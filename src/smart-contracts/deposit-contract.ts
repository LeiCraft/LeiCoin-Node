import { AddressHex } from "../objects/address.js";

export class DepositContract {

    private static loaded = false;

    private static readonly address = AddressHex.from("0c0000000000000000000000000000000000000001");

    private static rawDataLength = 29;

    public static async load() {
        if (this.loaded) return;

    
        this.loaded = true;
    }

}

export default DepositContract;