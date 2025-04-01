"use client";
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var react_1 = require("react");
var mint_1 = require("@/cip68_action/mint");
var update_1 = require("@/cip68_action/update");
var index_1 = require("./index");
var pinata_1 = require("pinata");
var core_1 = require("@meshsdk/core");
function NFTPage() {
    var _this = this;
    var _a = index_1.useWalletContext(), wallet = _a.wallet, connected = _a.connected;
    // State cho tab (mặc định là mint)
    var _b = react_1.useState("mint"), activeTab = _b[0], setActiveTab = _b[1];
    // States cho Mint NFT
    var _c = react_1.useState(null), file = _c[0], setFile = _c[1];
    var _d = react_1.useState(""), preview = _d[0], setPreview = _d[1];
    var _e = react_1.useState(""), title = _e[0], setTitle = _e[1];
    var _f = react_1.useState(""), description = _f[0], setDescription = _f[1];
    var _g = react_1.useState(false), mintLoading = _g[0], setMintLoading = _g[1];
    // States cho Update NFT
    var _h = react_1.useState(""), updateTokenName = _h[0], setUpdateTokenName = _h[1];
    var _j = react_1.useState(""), updateDescription = _j[0], setUpdateDescription = _j[1];
    var _k = react_1.useState(""), updateExtra = _k[0], setUpdateExtra = _k[1];
    var _l = react_1.useState(""), updateImage = _l[0], setUpdateImage = _l[1]; // Nhập IPFS URL cho image
    var _m = react_1.useState("image/jpg"), updateMediaType = _m[0], setUpdateMediaType = _m[1]; // Nhập media type
    var _o = react_1.useState(false), updateLoading = _o[0], setUpdateLoading = _o[1];
    // Cấu hình Pinata với JWT và gateway của bạn
    var JWT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI3MzdkNzd" +
        "iZC1kMWY2LTQyMWUtOGY2MC01OTgwZTMyOTdhOTEiLCJlbWFpbCI6Imxvbmd0ZC5hNWs0OGd0YkBnbWF" +
        "pbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJkZXN" +
        "pcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJGUkExIn0seyJkZXNpcmVkUmVwbGljYXRpb25Db3V" +
        "udCI6MSwiaWQiOiJOWUMxIn1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXM" +
        "iOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5Ijo" +
        "iZGNjYmY4MTA2ZDg1NjQzM2I1YWUiLCJzY29wZWRLZXlTZWNyZXQiOiIxZWM0YmE5YjQ3ZjllMjA1MzN" +
        "lYTFiYmM5MjZkODIzOTJjZTcxODYyOWZjMmMwZWZjOTBjMWRiYjAxYTljN2IzIiwiZXhwIjoxNzc0NTI" +
        "0MTMyfQ.IokET3UfMOUUe9EQaZ6y7iNOnJdKdu0rbzxeO0PKTSc";
    var pinataGateway = "emerald-managing-koala-687.mypinata.cloud";
    var pinata = new pinata_1.PinataSDK({ pinataJwt: JWT, pinataGateway: pinataGateway });
    // Xử lý file upload cho Mint NFT
    var handleFileChange = function (e) {
        if (e.target.files && e.target.files.length > 0) {
            var selectedFile = e.target.files[0];
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
        }
    };
    // Handler cho Mint NFT
    var handleMint = function () { return __awaiter(_this, void 0, Promise, function () {
        var uploadResult, ipfsUrl, useraddr, userPubKeyHash, metadata, txHash, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!file) {
                        alert("Vui lòng chọn file ảnh");
                        return [2 /*return*/];
                    }
                    if (!connected) {
                        alert("Ví chưa kết nối");
                        return [2 /*return*/];
                    }
                    setMintLoading(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 5, 6, 7]);
                    return [4 /*yield*/, pinata
                            .upload
                            .public
                            .file(file)];
                case 2:
                    uploadResult = _a.sent();
                    if (!uploadResult || !uploadResult.cid) {
                        throw new Error("Upload thất bại");
                    }
                    ipfsUrl = "ipfs://" + uploadResult.cid;
                    return [4 /*yield*/, wallet.getChangeAddress()];
                case 3:
                    useraddr = _a.sent();
                    userPubKeyHash = core_1.deserializeAddress(useraddr).pubKeyHash;
                    metadata = {
                        name: title,
                        _pk: userPubKeyHash,
                        image: ipfsUrl,
                        mediaType: file.type,
                        description: description
                    };
                    return [4 /*yield*/, mint_1["default"](wallet, title, metadata, {})];
                case 4:
                    txHash = _a.sent();
                    alert("Mint thành công! TxHash: " + txHash);
                    return [3 /*break*/, 7];
                case 5:
                    error_1 = _a.sent();
                    console.error("Mint NFT lỗi:", error_1);
                    alert("Mint NFT thất bại!");
                    return [3 /*break*/, 7];
                case 6:
                    setMintLoading(false);
                    return [7 /*endfinally*/];
                case 7: return [2 /*return*/];
            }
        });
    }); };
    // Handler cho Update NFT
    var handleUpdate = function () { return __awaiter(_this, void 0, Promise, function () {
        var useraddr, userPubKeyHash, metadata, result, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!connected) {
                        alert("Ví chưa kết nối");
                        return [2 /*return*/];
                    }
                    if (!updateTokenName || !updateDescription || !updateImage || !updateMediaType) {
                        alert("Vui lòng nhập đầy đủ Token Name, Description, Image (IPFS) và Media Type");
                        return [2 /*return*/];
                    }
                    setUpdateLoading(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, 5, 6]);
                    return [4 /*yield*/, wallet.getChangeAddress()];
                case 2:
                    useraddr = _a.sent();
                    userPubKeyHash = core_1.deserializeAddress(useraddr).pubKeyHash;
                    metadata = {
                        name: updateTokenName,
                        pk: userPubKeyHash,
                        description: updateDescription,
                        image: updateImage,
                        mediaType: updateMediaType,
                        extra: updateExtra
                    };
                    return [4 /*yield*/, update_1["default"](wallet, [
                            {
                                assetName: updateTokenName,
                                metadata: metadata
                            }
                        ])];
                case 3:
                    result = _a.sent();
                    alert("Update NFT thành công! TxHash: " + result);
                    return [3 /*break*/, 6];
                case 4:
                    error_2 = _a.sent();
                    console.error("Update NFT lỗi:", error_2);
                    alert("Update NFT thất bại!");
                    return [3 /*break*/, 6];
                case 5:
                    setUpdateLoading(false);
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    }); };
    return (react_1["default"].createElement("div", { className: "page-container", style: {
            paddingTop: "5rem"
        } },
        react_1["default"].createElement("div", { style: {
                display: "flex",
                gap: "1rem",
                marginBottom: "2rem"
            } },
            react_1["default"].createElement("button", { onClick: function () { return setActiveTab("mint"); }, style: {
                    padding: "0.5rem 1rem",
                    backgroundColor: activeTab === "mint"
                        ? "#0070f3"
                        : "#ccc",
                    color: "#fff",
                    border: "none",
                    cursor: "pointer"
                } }, "Mint NFT"),
            react_1["default"].createElement("button", { onClick: function () { return setActiveTab("update"); }, style: {
                    padding: "0.5rem 1rem",
                    backgroundColor: activeTab === "update"
                        ? "#0070f3"
                        : "#ccc",
                    color: "#fff",
                    border: "none",
                    cursor: "pointer"
                } }, "Update NFT")),
        activeTab === "mint" && (react_1["default"].createElement("div", { className: "card" },
            react_1["default"].createElement("h1", { className: "title" }, "Mint Your NFT"),
            react_1["default"].createElement("div", { className: "input-group" },
                react_1["default"].createElement("label", { className: "input-label" }, "Upload Image"),
                react_1["default"].createElement("label", { htmlFor: "file-upload", className: "custom-file-upload" }, "Ch\u1ECDn t\u1EC7p"),
                react_1["default"].createElement("input", { id: "file-upload", type: "file", accept: "image/*", onChange: handleFileChange, style: {
                        display: "none"
                    } }),
                " ",
                preview && (react_1["default"].createElement("div", { className: "image-preview" },
                    react_1["default"].createElement("img", { src: preview, alt: "Image Preview" })))),
            react_1["default"].createElement("div", { className: "input-group" },
                react_1["default"].createElement("label", { className: "input-label" }, "Title"),
                react_1["default"].createElement("input", { type: "text", value: title, onChange: function (e) { return setTitle(e.target.value); }, className: "text-input", placeholder: "Enter NFT title" })),
            react_1["default"].createElement("div", { className: "input-group" },
                react_1["default"].createElement("label", { className: "input-label" }, "Description"),
                react_1["default"].createElement("textarea", { value: description, onChange: function (e) { return setDescription(e.target.value); }, className: "textarea-input", placeholder: "Describe your NFT" })),
            react_1["default"].createElement("button", { onClick: handleMint, disabled: mintLoading, className: "mint-button" }, mintLoading
                ? "Minting..."
                : "Mint NFT"))),
        activeTab === "update" && (react_1["default"].createElement("div", { className: "card" },
            react_1["default"].createElement("h1", { className: "title" }, "Update Your NFT"),
            react_1["default"].createElement("div", { className: "input-group" },
                react_1["default"].createElement("label", { className: "input-label" }, "Token Name"),
                react_1["default"].createElement("input", { type: "text", value: updateTokenName, onChange: function (e) { return setUpdateTokenName(e.target.value); }, className: "text-input", placeholder: "Enter token name" })),
            react_1["default"].createElement("div", { className: "input-group" },
                react_1["default"].createElement("label", { className: "input-label" }, "Description"),
                react_1["default"].createElement("textarea", { value: updateDescription, onChange: function (e) { return setUpdateDescription(e.target.value); }, className: "textarea-input", placeholder: "Enter description" })),
            react_1["default"].createElement("div", { className: "input-group" },
                react_1["default"].createElement("label", { className: "input-label" }, "Image (IPFS URL)"),
                react_1["default"].createElement("input", { type: "text", value: updateImage, onChange: function (e) { return setUpdateImage(e.target.value); }, className: "text-input", placeholder: "Enter image URL (ipfs://...)" })),
            react_1["default"].createElement("div", { className: "input-group" },
                react_1["default"].createElement("label", { className: "input-label" }, "Media Type"),
                react_1["default"].createElement("input", { type: "text", value: updateMediaType, onChange: function (e) { return setUpdateMediaType(e.target.value); }, className: "text-input", placeholder: "e.g., image/jpg" })),
            react_1["default"].createElement("div", { className: "input-group" },
                react_1["default"].createElement("label", { className: "input-label" }, "Extra Metadata"),
                react_1["default"].createElement("input", { type: "text", value: updateExtra, onChange: function (e) { return setUpdateExtra(e.target.value); }, className: "text-input", placeholder: "Enter extra metadata (optional)" })),
            react_1["default"].createElement("button", { onClick: handleUpdate, disabled: updateLoading, className: "mint-button" }, updateLoading
                ? "Updating..."
                : "Update NFT")))));
}
exports["default"] = NFTPage;
