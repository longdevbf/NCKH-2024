import {Data} from "lucid-cardano";


const SmartcontractsDatumSchema = Data.Object({
    lock_until: Data.Integer(),
    owner: Data.Bytes(),
    beneficiary: Data.Bytes(),
})
type SmartconntractsDatum = Data.Static<typeof SmartcontractsDatumSchema>
export const SmartconntractsDatum = SmartcontractsDatumSchema as any as SmartconntractsDatum