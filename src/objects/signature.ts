import elliptic from 'elliptic';
import { FixedUint, Uint64, Uint8, Uint } from "../utils/binary.js";

export interface EllipticBinarySignature extends elliptic.ec.Signature {
    recoveryParam: number;
}

export class RawSignature extends FixedUint {
    public static byteLength: number = 66;

    public static fromElliptic(signerType: Uint8, signature: EllipticBinarySignature) {
        return this.concat([
            signerType,
            new Uint(Buffer.concat([
                signature.r.toArrayLike(Buffer),
                signature.s.toArrayLike(Buffer)
            ])),
            Uint8.from(signature.recoveryParam)
        ]);
    }

    public getElliptic() {
        return {
            r: this.buffer.subarray(1, 33),
            s: this.buffer.subarray(33, 65),
            recoveryParam: this.buffer.subarray(65, 66).readUint8(0)
        }
    }

    public getRecoveryParam() {
        return this.buffer.subarray(65, 66).readUint8(0);
    }
}

export class Signature {
    public signerType: Uint8;
    public r: Uint64;
    public s: Uint64;
    public recoveryParam: number;

    constructor(signerType: Uint8, r: Uint64, s: Uint64, recoveryParam: number) {
        this.signerType = signerType;
        this.r = r;
        this.s = s;
        this.recoveryParam = recoveryParam;
    }

    public static fromRaw(raw: RawSignature) {
        return new Signature(
            raw.slice(0, 1),
            new Uint64(raw.slice(1, 33).getRaw()),
            new Uint64(raw.slice(33, 65).getRaw()),
            raw.slice(65, 66).getRaw().readUint8(0)
        );
    }

    public getRaw() {
        return RawSignature.concat([this.signerType, this.r, this.s, Uint8.from(this.recoveryParam)]);
    }

    public getElliptic() {
        return {
            r: this.r.getRaw(),
            s: this.s.getRaw(),
            recoveryParam: this.recoveryParam
        }
    }
}
