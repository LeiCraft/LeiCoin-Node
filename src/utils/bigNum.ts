export class BigNum {

    static add(v1: any, v2: any) {
        return (BigInt(v1) + BigInt(v2)).toString();
    }

    static subtract(v1: any, v2: any) {
        return (BigInt(v1) - BigInt(v2)).toString();
    }

    static multiply(v1: any, v2: any) {
        return (BigInt(v1) * BigInt(v2)).toString();
    }

    static divide(v1: any, v2: any) {
        return (BigInt(v1) / BigInt(v2)).toString();
    }

    static mod(v1: any, v2: any) {
        return (BigInt(v1) % BigInt(v2)).toString();
    }

    static greater(v1: any, v2: any) {
        return BigInt(v1) > BigInt(v2);
    }

    static greaterOrEqual(v1: any, v2: any) {
        return BigInt(v1) >= BigInt(v2);
    }

    static less(v1: any, v2: any) {
        return BigInt(v1) < BigInt(v2);
    }

    static lessOrEqual(v1: any, v2: any) {
        return BigInt(v1) <= BigInt(v2);
    }

    static max(v1: any, v2: any): string {
        return this.greater(v1, v2) ? v1 : v2;
    }

    static min(v1: any, v2: any): string {
        return this.less(v1, v2) ? v1 : v2;
    }

}

export default BigNum;
