"use client";
import React, { useEffect, useState } from "react";
import mintNFT from "@/cip68_action/mint";
import { useWalletContext } from "./index";
import { PinataSDK } from "pinata";
import {
  CIP68_222,
  stringToHex,
  mConStr0,
  CIP68_100,
  metadataToCip68,
  deserializeAddress,
  MeshTxBuilder,
  applyParamsToScript,
  resolveScriptHash,
  serializeAddressObj,
  serializePlutusScript,
  scriptAddress,
} from "@meshsdk/core";

export default function MintNFTPage() {
  const { wallet, connected } = useWalletContext();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);

  // Cấu hình Pinata với JWT và gateway của bạn
  const JWT =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI3MzdkNzdiZC1kMWY2LTQyMWUtOGY2MC01OTgwZTMyOTdhOTEiLCJlbWFpbCI6Imxvbmd0ZC5hNWs0OGd0YkBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJGUkExIn0seyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJOWUMxIn1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiZGNjYmY4MTA2ZDg1NjQzM2I1YWUiLCJzY29wZWRLZXlTZWNyZXQiOiIxZWM0YmE5YjQ3ZjllMjA1MzNlYTFiYmM5MjZkODIzOTJjZTcxODYyOWZjMmMwZWZjOTBjMWRiYjAxYTljN2IzIiwiZXhwIjoxNzc0NTI0MTMyfQ.IokET3UfMOUUe9EQaZ6y7iNOnJdKdu0rbzxeO0PKTSc";
  const pinataGateway = "emerald-managing-koala-687.mypinata.cloud";
  const pinata = new PinataSDK({
    pinataJwt: JWT,
    pinataGateway: pinataGateway,
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      // Tạo URL preview cho file
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleMint = async (): Promise<void> => {
    if (!file) {
      alert("Vui lòng chọn file ảnh");
      return;
    }
    if (!connected) {
      alert("Ví chưa kết nối");
      return;
    }
    setLoading(true);
    try {
      const uploadResult = await pinata.upload.public.file(file);
      if (!uploadResult || !uploadResult.cid) {
        throw new Error("Upload thất bại");
      }
      const ipfsUrl = `ipfs://${uploadResult.cid}`;
      const useraddr = await wallet.getChangeAddress();
      const { pubKeyHash: userPubKeyHash } = deserializeAddress(useraddr);

      const metadata = {
        name: title,
        _pk: userPubKeyHash,
        image: ipfsUrl,
        mediaType: file.type,
        description: description,
      };

      const txHash = await mintNFT(wallet, title, metadata, {});
      alert("Mint thành công! TxHash: " + txHash);
    } catch (error) {
      console.error("Mint NFT lỗi:", error);
      alert("Mint NFT thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="card">
        <h1 className="title">Mint Your NFT</h1>

        {/* File Upload */}
        <div className="input-group">
          <label className="input-label">Upload Image</label>
          <label htmlFor="file-upload" className="custom-file-upload">
            Chọn tệp
          </label>
          <input
            id="file-upload"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
          {preview && (
            <div className="image-preview">
              <img src={preview} alt="Image Preview" />
            </div>
          )}
        </div>

        {/* Title Input */}
        <div className="input-group">
          <label className="input-label">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setTitle(e.target.value)
            }
            className="text-input"
            placeholder="Enter NFT title"
          />
        </div>

        {/* Description Input */}
        <div className="input-group">
          <label className="input-label">Description</label>
          <textarea
            value={description}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setDescription(e.target.value)
            }
            className="textarea-input"
            placeholder="Describe your NFT"
          />
        </div>

        {/* Quantity Input */}
        <div className="input-group">
          <label className="input-label">Quantity</label>
          <input
            type="number"
            value={quantity}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setQuantity(parseInt(e.target.value, 10))
            }
            className="number-input"
          />
        </div>

        <button onClick={handleMint} disabled={loading} className="mint-button">
          {loading ? (
            <div className="spinner-container">
              <svg className="spinner" viewBox="0 0 24 24">
                {/* SVG cho spinner */}
              </svg>
              Minting...
            </div>
          ) : (
            "Mint NFT"
          )}
        </button>
      </div>
    </div>
  );
}
