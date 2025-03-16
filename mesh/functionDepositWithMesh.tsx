import {
  Asset,
  deserializeAddress,
  mConStr0,
  MeshTxBuilder,
  MeshValue,
  Transaction,
} from "@meshsdk/core";
import { MeshVestingContract } from "@meshsdk/contract";
import {
  getScript,
  getTxBuilder,
  blockchainProvider,
  getWalletInfoForTx,
} from "./common";
import { CardanoWallet, useWallet } from "@meshsdk/react";

/**
 * Khóa tài sản vào smart contract với cơ chế bảo mật nâng cao
 * 
 * @param beneficiary Địa chỉ người thụ hưởng 
 * @param assets Danh sách tài sản cần khóa
 * @param wallet Đối tượng ví người dùng
 * @param lockUntilTimeStamp Thời điểm hết hạn khóa (unix timestamp)
 * @returns Mã giao dịch (txHash)
 */
export async function lock(beneficiary: string, assets: Asset[], wallet: any, lockUntilTimeStamp: number) {
  try {
    // Lấy thông tin script
    const { scriptAddr, scriptCbor } = getScript();
    
    // Chuyển đổi assets thành value cho giao dịch
    const value = MeshValue.fromAssets(assets);
    
    // Tạo transaction builder
    const txBuilder = new MeshTxBuilder({
      fetcher: blockchainProvider,
      submitter: blockchainProvider,
    });

    // Lấy thông tin ví người dùng
    const { utxos, walletAddress, collateral } = await getWalletInfoForTx(wallet);
    
    // Trích xuất public key hash từ địa chỉ
    const { pubKeyHash: ownerPubKeyHash } = deserializeAddress(walletAddress);
    const { pubKeyHash: beneficiaryPubKeyHash } = deserializeAddress(beneficiary);
    
    // Kiểm tra dữ liệu đầu vào
    if (!ownerPubKeyHash || !beneficiaryPubKeyHash) {
      throw new Error("Invalid owner or beneficiary address");
    }
    
    // Kiểm tra thời gian khóa phải nằm trong tương lai
    const currentTime = Math.floor(Date.now() / 1000);
    if (lockUntilTimeStamp <= currentTime) {
      throw new Error("Lock time must be in the future");
    }
    
    // Định nghĩa cấu trúc datum lưu trữ thông tin khóa
    // Format: [lockUntilTimeStamp, ownerPubKeyHash, beneficiaryPubKeyHash]
    const datum = mConStr0([lockUntilTimeStamp, ownerPubKeyHash, beneficiaryPubKeyHash]);
    
    // Tạo nội dung metadata chi tiết hơn
    const metadata = {
      action: 'lock_assets',
      owner: walletAddress,
      beneficiary: beneficiary,
      lockUntil: lockUntilTimeStamp,
      lockUntilFormatted: new Date(lockUntilTimeStamp * 1000).toISOString(),
      assets: assets.map(asset => ({
        unit: asset.unit,
        quantity: asset.quantity
      })),
      timestamp: currentTime
    };

    // Xây dựng giao dịch
    await txBuilder
      .txOut(scriptAddr, assets)
      .txOutInlineDatumValue(datum)
      .metadataValue('674', "")  // Sử dụng metadata chi tiết hơn
      .changeAddress(walletAddress)
      .selectUtxosFrom(utxos)
      .complete();

    // Lấy phiên bản hex của giao dịch chưa ký
    const unsignedTx = txBuilder.txHex;

    // Ký và gửi giao dịch
    const signedTx = await wallet.signTx(unsignedTx);
    const txHash = await wallet.submitTx(signedTx);
    
    // Ghi log để theo dõi
    console.log(`Assets locked successfully. TxHash: ${txHash}`);
    console.log(`Lock details: Owner=${walletAddress}, Beneficiary=${beneficiary}, UnlockTime=${new Date(lockUntilTimeStamp * 1000).toISOString()}`);
    
    // Trả về hash giao dịch
    return txHash;
  } catch (error) {
    // Xử lý lỗi
    console.error("Error in lock function:", error);
    throw error;
  }
}