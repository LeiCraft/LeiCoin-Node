import cryptoHandlers from "../crypto/index.js";
import Validator from "../objects/validator.js";
import utils from "../utils/index.js";
import { CommitteeMember, CommitteeMemberList } from "./committee.js";

export interface StakersList {
    [publicKey: string]: {
        stake: string;
    }
}

class Stakerpool {

    private static instance: Stakerpool;

    public static getInstance() {
        if (!Stakerpool.instance) {
            Stakerpool.instance = new Stakerpool();
        }
        return Stakerpool.instance;
    }

    private stakers: StakersList;

    public nextStaker: Validator;

    private constructor() {
        this.stakers = {};
        this.nextStaker = new Validator("", "");
    }

    public calculateNextValidators(seedHash: string) {

        const validatorsArray = Object.entries(utils.sortObjectAlphabetical(this.stakers));

        const selected: CommitteeMemberList = {};

        let nextHash = seedHash;

        if (validatorsArray.length <= 128) {
            for (let i = 0; i < validatorsArray.length; i++) {
                selected[validatorsArray[i][0]] = CommitteeMember.create(validatorsArray[i][1].stake);
            }
            return selected;
        } 

        for (let i = 0; i < 128; i++) {

            const index = parseInt((BigInt(`0x${nextHash}`) % BigInt(validatorsArray.length)).toString());
            selected[validatorsArray[index][0]] = CommitteeMember.create(validatorsArray[index][1].stake);
            validatorsArray.splice(index, 1);

            nextHash = cryptoHandlers.sha256(nextHash);
        }

        return selected;

    }

}

const stakerpool = Stakerpool.getInstance();
export default stakerpool;
