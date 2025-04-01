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
var link_1 = require("next/link");
var react_2 = require("@meshsdk/react");
var router_1 = require("next/router");
var react_toastify_1 = require("react-toastify");
require("react-toastify/dist/ReactToastify.css");
var UserContext_1 = require("../context/UserContext");
var index_1 = require("../pages/index");
var NavBar = function () {
    var _a = react_1.useState(false), showWalletModal = _a[0], setShowWalletModal = _a[1];
    var _b = react_1.useState(false), showWalletInfo = _b[0], setShowWalletInfo = _b[1]; // State cho modal thông tin ví
    var _c = UserContext_1.useUser(), userInfo = _c.userInfo, updateUserInfo = _c.updateUserInfo, clearUserInfo = _c.clearUserInfo;
    var pathname = router_1.useRouter().pathname;
    var _d = react_2.useWallet(), connect = _d.connect, disconnect = _d.disconnect;
    var router = router_1.useRouter();
    var _e = index_1.useWalletContext(), wallet = _e.wallet, connected = _e.connected;
    react_1.useEffect(function () {
        if (wallet) {
            fetchWalletData();
        }
    }, [wallet]);
    var fetchWalletData = function () { return __awaiter(void 0, void 0, void 0, function () {
        var address, utxos, totalLovelace, balance, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!connected) return [3 /*break*/, 5];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, wallet.getChangeAddress()];
                case 2:
                    address = _a.sent();
                    return [4 /*yield*/, wallet.getUtxos()];
                case 3:
                    utxos = _a.sent();
                    totalLovelace = utxos.reduce(function (sum, utxo) { var _a; return sum + BigInt(((_a = utxo.output.amount.find(function (a) { return a.unit === "lovelace"; })) === null || _a === void 0 ? void 0 : _a.quantity) || 0); }, BigInt(0));
                    balance = (Number(totalLovelace) / 1000000).toFixed(3) + " ADA";
                    updateUserInfo({ address: address, balance: balance });
                    return [3 /*break*/, 5];
                case 4:
                    error_1 = _a.sent();
                    console.error("Error fetching wallet data:", error_1);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var handleConnect = function (walletType) { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, connect(walletType)];
                case 1:
                    _a.sent();
                    setShowWalletModal(false);
                    return [2 /*return*/];
            }
        });
    }); };
    var handleDisconnect = function () {
        disconnect();
        clearUserInfo();
        setShowWalletInfo(false); // Đóng form khi đăng xuất
        router.push("/");
    };
    return (react_1["default"].createElement("div", null,
        react_1["default"].createElement(react_toastify_1.ToastContainer, { position: "top-right", autoClose: 3000 }),
        react_1["default"].createElement("div", { className: "header__navbar" },
            react_1["default"].createElement("img", { src: "/logox.png", alt: "logo", className: "header__navbar-logo-image" }),
            react_1["default"].createElement("div", { className: "header__navbar-navigate" },
                react_1["default"].createElement(link_1["default"], { href: "/", className: "header__navbar-navigate--page " + (pathname === "/" ? "active" : "") }, "Home"),
                react_1["default"].createElement(link_1["default"], { href: "/dedicated", className: "header__navbar-navigate--page " + (pathname === "/dedicated" ? "active" : ""), onClick: function (e) {
                        if (!userInfo.address) {
                            e.preventDefault();
                            react_toastify_1.toast.warning("Vui lòng kết nối ví trước khi truy cập Dedicated!");
                        }
                    } }, "Dedicated"),
                react_1["default"].createElement(link_1["default"], { href: "/MintNFT", className: "header__navbar-navigate--page " + (pathname === "/mintnft" ? "active" : ""), onClick: function (e) {
                        if (!userInfo.address) {
                            e.preventDefault();
                            react_toastify_1.toast.warning("Vui lòng kết nối ví trước khi truy cập Mint NFT!");
                        }
                    } }, "Mint NFT"),
                react_1["default"].createElement(link_1["default"], { href: "/user", className: "header__navbar-navigate--page " + (pathname === "/user" ? "active" : ""), onClick: function (e) {
                        if (!userInfo.address) {
                            e.preventDefault();
                            react_toastify_1.toast.warning("Vui lòng kết nối ví trước khi truy cập User!");
                        }
                    } }, "User"),
                react_1["default"].createElement(link_1["default"], { href: "/about", className: "header__navbar-navigate--page " + (pathname === "/about" ? "active" : "") }, "About Us")),
            userInfo.address ? (react_1["default"].createElement("button", { className: "wallet-info", onClick: function () { return setShowWalletInfo(true); } },
                react_1["default"].createElement("span", { className: "wallet-address" },
                    userInfo.address.slice(0, 6),
                    "...",
                    userInfo.address.slice(-8)),
                react_1["default"].createElement("span", { className: "wallet-balance" }, userInfo.balance))) : (react_1["default"].createElement("button", { className: "header__navbar-login", onClick: function () { return setShowWalletModal(true); } }, "Connect Wallet"))),
        showWalletModal && !userInfo.address && (react_1["default"].createElement("div", { className: "connect-wallet-container" },
            react_1["default"].createElement("div", { className: "overlay", onClick: function () { return setShowWalletModal(false); } }),
            react_1["default"].createElement("div", { className: "connect-wallet-modal" },
                react_1["default"].createElement("button", { className: "close-button", onClick: function () { return setShowWalletModal(false); } }, "X"),
                react_1["default"].createElement("h3", { className: "select-wallet" }, "Select Wallet"),
                react_1["default"].createElement("button", { className: "wallet-option", onClick: function () { return handleConnect("eternl"); } },
                    react_1["default"].createElement("img", { src: "https://play-lh.googleusercontent.com/BzpWa8LHTBzJq3bxOUjl-Bp7ixh2VOV_5zk6hZjrk57wRp7sc_kvrf3HCrjdKHL_BtbG", alt: "Eternl", className: "wallet-logo" }),
                    react_1["default"].createElement("p", { className: "connect-text" }, "Connect with Eternl")),
                react_1["default"].createElement("button", { className: "wallet-option", onClick: function () { return handleConnect("yoroi"); } },
                    react_1["default"].createElement("img", { style: { width: '28px', height: '28px', marginRight: '15px' }, src: "https://play-lh.googleusercontent.com/UlhGKCVtUuXjDDF_fFdDQaF7mdUpMpsKvfQNNQHuwzbNEvvN-sYRNLk308wpWmLQkR4", alt: "Yoroi", className: "wallet-logo" }),
                    react_1["default"].createElement("p", { className: "connect-text" }, "Connect with Yoroi"))))),
        showWalletInfo && (react_1["default"].createElement("div", { className: "wallet-info-modal" },
            react_1["default"].createElement("div", { className: "wallet-info-content" },
                react_1["default"].createElement("button", { className: "close-button", onClick: function () { return setShowWalletInfo(false); } }, "X"),
                react_1["default"].createElement("h3", null, "Wallet Information"),
                react_1["default"].createElement("p", null,
                    react_1["default"].createElement("strong", null, "Address:"),
                    " ",
                    userInfo.address),
                react_1["default"].createElement("p", null,
                    react_1["default"].createElement("strong", null, "Balance:"),
                    " ",
                    userInfo.balance),
                react_1["default"].createElement("button", { className: "disconnect-button", onClick: handleDisconnect }, "Disconnect"))))));
};
exports["default"] = NavBar;
