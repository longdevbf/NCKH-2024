import {
  Asset,
  deserializeAddress,
  deserializeDatum,
  mConStr0,
  mConStr1,
  MeshTxBuilder,
  MeshValue,
  pubKeyAddress,
  pubKeyHash,
  signData,
  SLOT_CONFIG_NETWORK,
  unixTimeToEnclosingSlot,
  UTxO,
  Transaction
} from "@meshsdk/core";
import { MeshVestingContract, VestingDatum } from "@meshsdk/contract";
import {
  blockchainProvider,
  getScript,
  getTxBuilder,
  getUtxoByTxHash,
  getWalletInfoForTx,
} from "./common";

/**
 * Mở khóa tài sản từ smart contract với kiểm tra quyền và thời gian
 * 
 * @param txHash Mã giao dịch khóa tài sản
 * @param wallet Đối tượng ví người dùng
 * @returns Mã giao dịch mở khóa (txHash)
 */
export async function unlock(txHash: string, wallet: any) {
  try {
    console.log("Starting unlock process for txHash:", txHash);
    
    // Lấy UTXO của giao dịch từ blockchain
    const contractutxos = await blockchainProvider.fetchUTxOs(txHash);
    
    // Kiểm tra dữ liệu đầu vào
    if (!contractutxos || contractutxos.length === 0) {
      throw new Error("Transaction not found or no UTXOs available");
    }
    
    console.log(`Found ${contractutxos.length} UTXOs for transaction`);
    
    // Lấy UTXO hợp lệ
    const vestingUtxo = contractutxos[0];
    
    if (!vestingUtxo || !vestingUtxo.input || !vestingUtxo.output || !vestingUtxo.output.plutusData) {
      throw new Error("Invalid UTXO data or missing plutus data");
    }
    
    // Lấy thông tin ví người dùng hiện tại (người gọi hàm unlock)
    const { utxos, walletAddress, collateral } = await getWalletInfoForTx(wallet);
    const { input: collateralInput, output: collateralOutput } = collateral;
    const { pubKeyHash: currentUserPubKeyHash } = deserializeAddress(walletAddress);
    
    console.log("Current user address:", walletAddress);
    console.log("Current user pubKeyHash:", currentUserPubKeyHash);
    
    // Lấy thông tin script và địa chỉ
    const { scriptAddr, scriptCbor } = getScript();
    
    // Giải mã datum từ UTXO để lấy thông tin khóa
    const datum = deserializeDatum<VestingDatum>(vestingUtxo.output.plutusData);
    
    // Trích xuất thông tin từ datum
    const lockUntilTimestamp = datum.fields[0].int as number;
    const ownerPubKeyHash = datum.fields[1].bytes;
    const beneficiaryPubKeyHash = datum.fields[2].bytes;
    
    console.log("Datum info:");
    console.log("- Lock until:", new Date(lockUntilTimestamp * 1000).toISOString());
    console.log("- Owner pubKeyHash:", ownerPubKeyHash);
    console.log("- Beneficiary pubKeyHash:", beneficiaryPubKeyHash);
    
    // Kiểm tra quyền và thời gian
    const currentTime = Math.floor(Date.now() / 1000);
    const isLockExpired = currentTime >= lockUntilTimestamp;
    const isOwner = currentUserPubKeyHash === ownerPubKeyHash;
    const isBeneficiary = currentUserPubKeyHash === beneficiaryPubKeyHash;
    
    console.log("Permission check:");
    console.log("- Current time:", new Date(currentTime * 1000).toISOString());
    console.log("- Is lock expired:", isLockExpired);
    console.log("- Is owner:", isOwner);
    console.log("- Is beneficiary:", isBeneficiary);
    
    // Kiểm tra quyền truy cập: chủ sở hữu (sau khi hết hạn) hoặc người thụ hưởng
    if (!(isOwner && isLockExpired) && !isBeneficiary) {
      if (!isOwner && !isBeneficiary) {
        throw new Error("Access denied: You are neither the owner nor the beneficiary of these assets");
      } else if (isOwner && !isLockExpired) {
        throw new Error(`Access denied: Lock time has not expired yet. Available after ${new Date(lockUntilTimestamp * 1000).toLocaleString()}`);
      }
    }
    
    // Tính toán thời điểm có thể tiêu UTXO (invalidBefore)
    // Đối với beneficiary, có thể rút ngay lập tức
    // Đối với owner, chỉ có thể rút sau khi hết hạn
    const invalidBefore = isBeneficiary ? 0 : Math.max(
      unixTimeToEnclosingSlot(lockUntilTimestamp, SLOT_CONFIG_NETWORK.preprod) + 1, 
      0
    );
    
    console.log("Using invalidBefore:", invalidBefore);
    
    // Tạo metadata chi tiết - Sử dụng đối tượng thay vì chuỗi rỗng
    const metadata = {
      action: "unlock",
      txHash: txHash,
      unlockedBy: walletAddress,
      unlockTime: currentTime,
      role: isOwner ? "owner" : "beneficiary"
    };
    
    console.log("Building transaction...");
    
    // Xây dựng giao dịch unlock
    const txBuilder = new MeshTxBuilder({
      fetcher: blockchainProvider,
      submitter: blockchainProvider,
    });
    
    // Lấy danh sách tài sản từ output - phải chuyển đổi đúng định dạng
  
    

    
    await txBuilder
      .spendingPlutusScriptV3()
      .txIn(
        vestingUtxo.input.txHash,
        vestingUtxo.input.outputIndex,
        vestingUtxo.output.amount,
        scriptAddr
      )
      .spendingReferenceTxInInlineDatumPresent()
      .spendingReferenceTxInRedeemerValue(mConStr0([]))  // Sử dụng mConStr0 thay vì chuỗi rỗng
      .txInScript(scriptCbor)
      .txOut(walletAddress, [])  // Chuyển các tài sản đã khóa về ví người dùng
      .txInCollateral(
        collateralInput.txHash,
        collateralInput.outputIndex,
        collateralOutput.amount,
        collateralOutput.address
      )
      .invalidBefore(invalidBefore)
      .requiredSignerHash(currentUserPubKeyHash)
      .changeAddress(walletAddress)
      .selectUtxosFrom(utxos)
      .metadataValue('674', "")  // Sử dụng đối tượng metadata thay vì chuỗi rỗng
      .setNetwork("preprod")
      .complete();
    
    console.log("Transaction built successfully");
    
    // Lấy giao dịch chưa ký
    const unsignedTx = txBuilder.txHex;
    
    console.log("Signing transaction...");
    
    // Ký và gửi giao dịch
    const signedTx = await wallet.signTx(unsignedTx, true);
    
    console.log("Submitting transaction...");
    
    const resultTxHash = await wallet.submitTx(signedTx);
    
    // Ghi log kết quả
    console.log(`Assets unlocked successfully. TxHash: ${resultTxHash}`);
    console.log(`Unlock performed by: ${isOwner ? 'Owner' : 'Beneficiary'}, Address: ${walletAddress}`);
    
    // Trả về hash giao dịch
    return resultTxHash;
    
  } catch (error) {
    // Xử lý và ghi log lỗi
    console.error("Error in unlock function:", error);
    throw error;
  }
}