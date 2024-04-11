import Transaction from "../src/objects/transaction.js";
import Wallet from "../src/objects/wallet.js";
import Block from "../src/objects/block.js";

describe('Encoding Testing', () => {
    test('Test Transaction Enoding And Decoding', () => {
        const tx = Transaction.createCoinbaseTransaction();
        const encoded = tx.encodeToHex();
        const decoded: any = Transaction.fromDecodedHex(encoded);

        expect(JSON.stringify(tx)).toBe(JSON.stringify(decoded));
    });
    test('Test Wallet Enoding And Decoding', () => {

        const wallet = new Wallet("lc0x6c6569636f696e6e65745f636f696e62617365", "10000000000000", "10000000");

        const decoded = Wallet.fromDecodedHex("lc0x6c6569636f696e6e65745f636f696e62617365", wallet.encodeToHex());

        const decoded2 = Wallet.fromDecodedHex("lc0x6c6569636f696e6e65745f636f696e62617365", (decoded as Wallet).encodeToHex());

        expect(JSON.stringify(wallet)).toBe(JSON.stringify(decoded2));
    });
    test('Block Enoding And Decoding', () => {

        const block = Block.createNewBlock("01da74f8d1cf98760388643407cd1d4bc19f2857a1a1f499b0ef100af4f009b8");

        const decoded: any = Block.fromDecodedHex(block.encodeToHex());

        const decoded2: any = Block.fromDecodedHex(decoded.encodeToHex());

        //fs.writeFileSync("./blockchain_data/test.bin", decoded2.encodeToHex(), {encoding: "hex", flag: "w"});
        //console.log(decoded2?.encodeToHex().length);

        expect(JSON.stringify(block)).toBe(JSON.stringify(decoded2));
    });
});
