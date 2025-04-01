"use client";
import React, {useState} from "react";
import mintNFT from "@/cip68_action/mint";
import updateTokens from "@/cip68_action/update";
import {useWalletContext} from "./index";
import {PinataSDK} from "pinata";
import {deserializeAddress} from "@meshsdk/core";

export default function NFTPage() {
    const {wallet, connected} = useWalletContext();

    // State cho tab (mặc định là mint)
    const [activeTab,
        setActiveTab] = useState < "mint" | "update" > ("mint");

    // States cho Mint NFT
    const [file,
        setFile] = useState < File | null > (null);
    const [preview,
        setPreview] = useState < string > ("");
    const [title,
        setTitle] = useState < string > ("");
    const [description,
        setDescription] = useState < string > ("");
    const [mintLoading,
        setMintLoading] = useState < boolean > (false);

    // States cho Update NFT
    const [updateTokenName,
        setUpdateTokenName] = useState < string > ("");
    const [updateDescription,
        setUpdateDescription] = useState < string > ("");
    const [updateExtra,
        setUpdateExtra] = useState < string > ("");
    const [updateImage,
        setUpdateImage] = useState < string > (""); // Nhập IPFS URL cho image
    const [updateMediaType,
        setUpdateMediaType] = useState < string > ("image/jpg"); // Nhập media type
    const [updateLoading,
        setUpdateLoading] = useState < boolean > (false);

    // Cấu hình Pinata với JWT và gateway của bạn
    const JWT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI3MzdkNzd" +
            "iZC1kMWY2LTQyMWUtOGY2MC01OTgwZTMyOTdhOTEiLCJlbWFpbCI6Imxvbmd0ZC5hNWs0OGd0YkBnbWF" +
            "pbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJkZXN" +
            "pcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJGUkExIn0seyJkZXNpcmVkUmVwbGljYXRpb25Db3V" +
            "udCI6MSwiaWQiOiJOWUMxIn1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXM" +
            "iOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5Ijo" +
            "iZGNjYmY4MTA2ZDg1NjQzM2I1YWUiLCJzY29wZWRLZXlTZWNyZXQiOiIxZWM0YmE5YjQ3ZjllMjA1MzN" +
            "lYTFiYmM5MjZkODIzOTJjZTcxODYyOWZjMmMwZWZjOTBjMWRiYjAxYTljN2IzIiwiZXhwIjoxNzc0NTI" +
            "0MTMyfQ.IokET3UfMOUUe9EQaZ6y7iNOnJdKdu0rbzxeO0PKTSc";
    const pinataGateway = "emerald-managing-koala-687.mypinata.cloud";
    const pinata = new PinataSDK({pinataJwt: JWT, pinataGateway: pinataGateway});

    // Xử lý file upload cho Mint NFT
    const handleFileChange = (e : React.ChangeEvent < HTMLInputElement >) : void => {
        if (e.target.files && e.target.files.length > 0) {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
        }
    };

    // Handler cho Mint NFT
    const handleMint = async() : Promise < void > => {
        if (!file) {
            alert("Vui lòng chọn file ảnh");
            return;
        }
        if (!connected) {
            alert("Ví chưa kết nối");
            return;
        }
        setMintLoading(true);
        try {
            const uploadResult = await pinata
                .upload
                .public
                .file(file);
            if (!uploadResult || !uploadResult.cid) {
                throw new Error("Upload thất bại");
            }
            const ipfsUrl = `ipfs://${uploadResult.cid}`;
            const useraddr = await wallet.getChangeAddress();
            const {pubKeyHash: userPubKeyHash} = deserializeAddress(useraddr);

            const metadata = {
                name: title,
                _pk: userPubKeyHash,
                image: ipfsUrl,
                mediaType: file.type,
                description: description
            };

            const txHash = await mintNFT(wallet, title, metadata, {});
            alert("Mint thành công! TxHash: " + txHash);
        } catch (error) {
            console.error("Mint NFT lỗi:", error);
            alert("Mint NFT thất bại!");
        } finally {
            setMintLoading(false);
        }
    };

    // Handler cho Update NFT
    const handleUpdate = async() : Promise<void> => {
        if (!connected) {
            alert("Ví chưa kết nối");
            return;
        }
        if (!updateTokenName || !updateDescription || !updateImage || !updateMediaType) {
            alert("Vui lòng nhập đầy đủ Token Name, Description, Image (IPFS) và Media Type");
            return;
        }
        setUpdateLoading(true);
        try {
            // Fix the address method - use getUsedAddresses instead
            const addresses = await wallet.getUsedAddresses();
            const useraddr = addresses.length > 0 ? addresses[0] : '';
            const {pubKeyHash: userPubKeyHash} = deserializeAddress(useraddr);

            const metadata = {
                name: updateTokenName,
                pk: userPubKeyHash,
                description: updateDescription,
                image: updateImage,
                mediaType: updateMediaType,
                extra: updateExtra
            };

            // Make sure result is a simple string, not a complex object
            let result = await updateTokens(wallet, [
                {
                    assetName: updateTokenName,
                    metadata: metadata
                }
            ]);
            
            // Ensure result is a simple string before using it
            if (typeof result !== 'string') {
                result = JSON.stringify(result);
            }
            
            alert("Update NFT thành công! TxHash: " + result);
        } catch (error) {
            console.error("Update NFT lỗi:", error);
            alert("Update NFT thất bại!");
        } finally {
            setUpdateLoading(false);
        }
    };

    return (
        <div
            className="page-container"
            style={{
            paddingTop: "5rem"
        }}>
            {/* Thanh chuyển tab với margin-bottom để tránh header che */}
            <div
                style={{
                display: "flex",
                gap: "1rem",
                marginBottom: "2rem"
            }}>
                <button
                    onClick={() => setActiveTab("mint")}
                    style={{
                    padding: "0.5rem 1rem",
                    backgroundColor: activeTab === "mint"
                        ? "#0070f3"
                        : "#ccc",
                    color: "#fff",
                    border: "none",
                    cursor: "pointer"
                }}>
                    Mint NFT
                </button>
                <button
                    onClick={() => setActiveTab("update")}
                    style={{
                    padding: "0.5rem 1rem",
                    backgroundColor: activeTab === "update"
                        ? "#0070f3"
                        : "#ccc",
                    color: "#fff",
                    border: "none",
                    cursor: "pointer"
                }}>
                    Update NFT
                </button>
            </div>

            {activeTab === "mint" && (
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
                            style={{
                            display: "none"
                        }}/> {preview && (
                            <div className="image-preview">
                                <img src={preview} alt="Image Preview"/>
                            </div>
                        )}
                    </div>
                    {/* Title Input */}
                    <div className="input-group">
                        <label className="input-label">Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="text-input"
                            placeholder="Enter NFT title"/>
                    </div>
                    {/* Description Input */}
                    <div className="input-group">
                        <label className="input-label">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="textarea-input"
                            placeholder="Describe your NFT"/>
                    </div>
                    <button onClick={handleMint} disabled={mintLoading} className="mint-button">
                        {mintLoading
                            ? "Minting..."
                            : "Mint NFT"}
                    </button>
                </div>
            )}

            {activeTab === "update" && (
                <div className="card">
                    <h1 className="title">Update Your NFT</h1>
                    {/* Token Name Input */}
                    <div className="input-group">
                        <label className="input-label">Token Name</label>
                        <input
                            type="text"
                            value={updateTokenName}
                            onChange={(e) => setUpdateTokenName(e.target.value)}
                            className="text-input"
                            placeholder="Enter token name"/>
                    </div>
                    {/* Description Input */}
                    <div className="input-group">
                        <label className="input-label">Description</label>
                        <textarea
                            value={updateDescription}
                            onChange={(e) => setUpdateDescription(e.target.value)}
                            className="textarea-input"
                            placeholder="Enter description"/>
                    </div>
                    {/* Image Input (IPFS URL) */}
                    <div className="input-group">
                        <label className="input-label">Image (IPFS URL)</label>
                        <input
                            type="text"
                            value={updateImage}
                            onChange={(e) => setUpdateImage(e.target.value)}
                            className="text-input"
                            placeholder="Enter image URL (ipfs://...)"/>
                    </div>
                    {/* Media Type Input */}
                    <div className="input-group">
                        <label className="input-label">Media Type</label>
                        <input
                            type="text"
                            value={updateMediaType}
                            onChange={(e) => setUpdateMediaType(e.target.value)}
                            className="text-input"
                            placeholder="e.g., image/jpg"/>
                    </div>
                    {/* Extra Metadata Input (mục bổ sung nếu cần) */}
                    <div className="input-group">
                        <label className="input-label">Extra Metadata</label>
                        <input
                            type="text"
                            value={updateExtra}
                            onChange={(e) => setUpdateExtra(e.target.value)}
                            className="text-input"
                            placeholder="Enter extra metadata (optional)"/>
                    </div>
                    <button onClick={handleUpdate} disabled={updateLoading} className="mint-button">
                        {updateLoading
                            ? "Updating..."
                            : "Update NFT"}
                    </button>
                </div>
            )}
        </div>
    );
}
