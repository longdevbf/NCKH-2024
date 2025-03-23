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
  Transaction,
  slotToBeginUnixTime
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
    
    
    // Lấy UTXO của giao dịch từ blockchain
    const contractutxos = await blockchainProvider.fetchUTxOs(txHash);
    
    // Kiểm tra dữ liệu đầu vào
    
    console.log(`Found ${contractutxos.length} UTXOs for transaction`);
    
    // Lấy UTXO hợp lệ
    const vestingUtxo = contractutxos[0];
   
    
    
    // Lấy thông tin ví người dùng hiện tại (người gọi hàm unlock)
    const { utxos, walletAddress, collateral } = await getWalletInfoForTx(wallet);
    const { input: collateralInput, output: collateralOutput } = collateral;
    const { pubKeyHash: currentUserPubKeyHash } = deserializeAddress(walletAddress);
    
    
    // Lấy thông tin script và địa chỉ
    const { scriptAddr, scriptCbor } = getScript();
    
    // Giải mã datum từ UTXO để lấy thông tin khóa
    const datum = deserializeDatum<VestingDatum>(vestingUtxo.output.plutusData!);
    
    // Trích xuất thông tin từ datum
    const lockUntilTimestamp = datum.fields[0].int as number;
    const ownerPubKeyHash = datum.fields[1].bytes;
    const beneficiaryPubKeyHash = datum.fields[2].bytes;
    
       
    const isOwner = currentUserPubKeyHash === ownerPubKeyHash;
    const isBeneficiary = currentUserPubKeyHash === beneficiaryPubKeyHash;
    
 
    const invalidBefore = 
      unixTimeToEnclosingSlot(Math.min(datum.fields[0].int as number, Date.now() - 15000)
       ,SLOT_CONFIG_NETWORK.preprod) + 1;
 
    const txBuilder = new MeshTxBuilder({
      fetcher: blockchainProvider,
      submitter: blockchainProvider,    
      verbose: true
    });
    

    await txBuilder
      .spendingPlutusScriptV3()
      .txIn(
        vestingUtxo.input.txHash,
        vestingUtxo.input.outputIndex,
        vestingUtxo.output.amount,
        scriptAddr
      )
      .spendingReferenceTxInInlineDatumPresent()
      .spendingReferenceTxInRedeemerValue("")  // Sử dụng mConStr0 thay vì chuỗi rỗng
      .txInScript(scriptCbor)
      .txOut(walletAddress, [])  // Chuyển các tài sản đã khóa về ví người dùng
      .txInCollateral(
        collateralInput.txHash,
        collateralInput.outputIndex,
        collateralOutput.amount,
        collateralOutput.address
      )
      if(isBeneficiary){
       await txBuilder.invalidBefore(invalidBefore)
      }
     await txBuilder
      .requiredSignerHash(currentUserPubKeyHash)
      .changeAddress(walletAddress)
      .selectUtxosFrom(utxos)
      //.metadataValue('674', "")  // Sử dụng đối tượng metadata thay vì chuỗi rỗng
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