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
exports.burnTokens = void 0;
var core_1 = require("@meshsdk/core");
var lodash_1 = require("lodash");
var plutus_json_1 = require("@/cip68_contract/plutus.json");
var common_1 = require("../cardano/utils/common");
// Constants
var APP_WALLET_ADDRESS = "addr_test1qqwkave5e46pelgysvg6mx0st5zhte7gn79srscs8wv2qp5qkfvca3f7kpx3v3rssm4j97f63v5whrj8yvsx6dac9xrqyqqef6";
var appNetwork = "preprod";
// Helper functions
function readValidator(title) {
    var validator = plutus_json_1["default"].validators.find(function (v) { return v.title === title; });
    if (!validator) {
        throw new Error(title + " validator not found.");
    }
    return validator.compiledCode;
}
function getUtxoForTx(address, txHash) {
    return __awaiter(this, void 0, Promise, function () {
        var utxos, utxo;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, common_1.blockchainProvider.fetchAddressUTxOs(address)];
                case 1:
                    utxos = _a.sent();
                    utxo = utxos.find(function (utxo) { return utxo.input.txHash === txHash; });
                    if (!utxo)
                        throw new Error("No UTXOs found for txHash: " + txHash);
                    return [2 /*return*/, utxo];
            }
        });
    });
}
function getAddressUTXOAsset(address, unit) {
    return __awaiter(this, void 0, Promise, function () {
        var utxos;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, common_1.blockchainProvider.fetchAddressUTxOs(address, unit)];
                case 1:
                    utxos = _a.sent();
                    if (utxos.length === 0)
                        throw new Error("No UTXOs found with asset: " + unit);
                    return [2 /*return*/, utxos[utxos.length - 1]];
            }
        });
    });
}
function getAddressUTXOAssets(address, unit) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, common_1.blockchainProvider.fetchAddressUTxOs(address, unit)];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
;
function burnTokens(wallet, params) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, utxos, walletAddress, collateral, userPubKeyHash, exChange, pubkeyExchange, unsignedTx, mintCompilecode, storeCompilecode, storeScriptCbor, storeScript, storeAddress, storeScriptHash, mintScriptCbor, policyId, completeTx, signTx, txHash;
        var _this = this;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, common_1.getWalletInfoForTx(wallet)];
                case 1:
                    _a = _b.sent(), utxos = _a.utxos, walletAddress = _a.walletAddress, collateral = _a.collateral;
                    userPubKeyHash = core_1.deserializeAddress(walletAddress).pubKeyHash;
                    exChange = APP_WALLET_ADDRESS;
                    pubkeyExchange = core_1.deserializeAddress(exChange).pubKeyHash;
                    unsignedTx = new core_1.MeshTxBuilder({
                        fetcher: common_1.blockchainProvider,
                        submitter: common_1.blockchainProvider,
                        verbose: true
                    });
                    mintCompilecode = readValidator("mint.mint.mint");
                    storeCompilecode = readValidator("store.store.spend");
                    storeScriptCbor = core_1.applyParamsToScript(storeCompilecode, [pubkeyExchange, BigInt(1), userPubKeyHash]);
                    storeScript = {
                        code: storeScriptCbor,
                        version: "V3"
                    };
                    storeAddress = core_1.serializeAddressObj(core_1.scriptAddress(core_1.deserializeAddress(core_1.serializePlutusScript(storeScript, undefined, 0, false).address).scriptHash, core_1.deserializeAddress(exChange).stakeCredentialHash, false), 0);
                    storeScriptHash = core_1.deserializeAddress(storeAddress).scriptHash;
                    mintScriptCbor = core_1.applyParamsToScript(mintCompilecode, [
                        pubkeyExchange,
                        BigInt(1),
                        storeScriptHash,
                        core_1.deserializeAddress(exChange).stakeCredentialHash,
                        userPubKeyHash,
                    ]);
                    policyId = core_1.resolveScriptHash(mintScriptCbor, "V3");
                    return [4 /*yield*/, Promise.all(params.map(function (_a) {
                            var assetName = _a.assetName, quantity = _a.quantity, txHash = _a.txHash;
                            return __awaiter(_this, void 0, void 0, function () {
                                var userUtxos, amount, storeUtxo, _b;
                                return __generator(this, function (_c) {
                                    switch (_c.label) {
                                        case 0: return [4 /*yield*/, getAddressUTXOAssets(walletAddress, policyId + core_1.CIP68_222(core_1.stringToHex(assetName)))];
                                        case 1:
                                            userUtxos = _c.sent();
                                            amount = userUtxos.reduce(function (amount, utxos) {
                                                return (amount +
                                                    utxos.output.amount.reduce(function (amt, utxo) {
                                                        if (utxo.unit === policyId + core_1.CIP68_222(core_1.stringToHex(assetName))) {
                                                            return amt + Number(utxo.quantity);
                                                        }
                                                        return amt;
                                                    }, 0));
                                            }, 0);
                                            if (!!lodash_1.isNil(txHash)) return [3 /*break*/, 3];
                                            return [4 /*yield*/, getUtxoForTx(storeAddress, txHash)];
                                        case 2:
                                            _b = _c.sent();
                                            return [3 /*break*/, 5];
                                        case 3: return [4 /*yield*/, getAddressUTXOAsset(storeAddress, policyId + core_1.CIP68_100(core_1.stringToHex(assetName)))];
                                        case 4:
                                            _b = _c.sent();
                                            _c.label = 5;
                                        case 5:
                                            storeUtxo = _b;
                                            if (!storeUtxo)
                                                throw new Error("Store UTXO not found");
                                            if (-Number(quantity) === amount) {
                                                unsignedTx
                                                    .mintPlutusScriptV3()
                                                    .mint(quantity, policyId, core_1.CIP68_222(core_1.stringToHex(assetName)))
                                                    .mintRedeemerValue(core_1.mConStr1([]))
                                                    .mintingScript(mintScriptCbor)
                                                    .mintPlutusScriptV3()
                                                    .mint("-1", policyId, core_1.CIP68_100(core_1.stringToHex(assetName)))
                                                    .mintRedeemerValue(core_1.mConStr1([]))
                                                    .mintingScript(mintScriptCbor)
                                                    .spendingPlutusScriptV3()
                                                    .txIn(storeUtxo.input.txHash, storeUtxo.input.outputIndex)
                                                    .txInInlineDatumPresent()
                                                    .txInRedeemerValue(core_1.mConStr1([]))
                                                    .txInScript(storeScriptCbor);
                                            }
                                            else {
                                                unsignedTx
                                                    .mintPlutusScriptV3()
                                                    .mint(quantity, policyId, core_1.CIP68_222(core_1.stringToHex(assetName)))
                                                    .mintRedeemerValue(core_1.mConStr1([]))
                                                    .mintingScript(mintScriptCbor)
                                                    .txOut(walletAddress, [
                                                    {
                                                        unit: policyId + core_1.CIP68_222(core_1.stringToHex(assetName)),
                                                        quantity: String(amount + Number(quantity))
                                                    },
                                                ]);
                                            }
                                            return [2 /*return*/];
                                    }
                                });
                            });
                        }))];
                case 2:
                    _b.sent();
                    unsignedTx
                        .txOut(APP_WALLET_ADDRESS, [
                        {
                            unit: "lovelace",
                            quantity: "1000000"
                        },
                    ])
                        .requiredSignerHash(core_1.deserializeAddress(walletAddress).pubKeyHash)
                        .changeAddress(walletAddress)
                        .selectUtxosFrom(utxos)
                        .txInCollateral(collateral.input.txHash, collateral.input.outputIndex, collateral.output.amount, collateral.output.address)
                        .setNetwork(appNetwork);
                    return [4 /*yield*/, unsignedTx.complete()];
                case 3:
                    completeTx = _b.sent();
                    return [4 /*yield*/, wallet.signTx(completeTx, true)];
                case 4:
                    signTx = _b.sent();
                    return [4 /*yield*/, wallet.submitTx(signTx)];
                case 5:
                    txHash = _b.sent();
                    return [2 /*return*/, txHash];
            }
        });
    });
}
exports.burnTokens = burnTokens;
exports["default"] = burnTokens;
