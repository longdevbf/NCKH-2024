import {encode} from "cbor-x";
import { SpendingValidator, fromHex, toHex } from "lucid-cardano";

import smartcontracts from "../libs/plutus.json"
const readValidator = function (): SpendingValidator{
const smartcontractsValidator = smartcontracts.validators.find(function (validator){
    return validator.title === "contract.smartcontracts.spend"

});
if (!smartcontractsValidator) {
    throw new Error("Not Found Validator");
  }



const smartcontractsScript = toHex(encode(fromHex(smartcontractsValidator.compiledCode)));
 return {
    type: "PlutusV2",
    script: smartcontractsScript,
 }
}
export default readValidator
