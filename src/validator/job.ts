import Crypto from "../crypto/index.js";
import ValidatorPipeline from "../leicoin-net/pipelines/validators.js";
import { AddressHex } from "../objects/address.js";
import Attestation from "../objects/attestation.js";
import Block from "../objects/block.js";
import { LeiCoinNetDataPackage, LeiCoinNetDataPackageType } from "../objects/leicoinnet.js";
import { PX } from "../objects/prefix.js";
import Proposition from "../objects/proposition.js";
import Signature from "../objects/signature.js";
import blockchain from "../storage/blockchain.js";
import mempool from "../storage/mempool.js";
import cli from "../utils/cli.js";
import utils from "../utils/index.js";
import Verification from "../verification/index.js";
import validatorsCommittee from "./committee.js";
import validator from "./index.js";

export class AttesterJob {

	public static async createAttestation(block: Block) {

		const vote = (await Verification.verifyBlock(block)).cb;
		const nonce = validatorsCommittee.getMember(validator.publicKey).nonce;
		const attestation = new Attestation(validator.address, block.hash, vote, nonce, Signature.empty());
		attestation.signature = await Crypto.sign(attestation.calculateHash(), PX.A_0e, validator.privateKey);
		return attestation;
		
	}

	public static async processProposition(proposition: Proposition) {

		validatorsCommittee.setCurrentBlock(proposition.block);

		if (validatorsCommittee.isCurrentAttester(validator.publicKey)) {
			const attestation = await this.createAttestation(proposition.block);
			ValidatorPipeline.broadcast(LeiCoinNetDataPackageType.V_VOTE, attestation.encodeToHex(), attestation.publicKey);
		}

	}

}

export class ProposerJob {

    public static async createProposition() {
		
		const block = Block.createNewBlock();
		const nonce = validatorsCommittee.getMember(validator.publicKey).nonce;
		const proposition = new Proposition(validator.publicKey, nonce, "", block);
		proposition.signature = await Crypto.sign(proposition.calculateHash(), validator.privateKey);
		return proposition;

        // Adjust the delay maybe later for faster Block times
        // await new Promise((resolve) => setTimeout(resolve, 15_000));
    }

    public static async broadcastBlock(block: Block) {

		if (!block || !(await Verification.verifyBlock(block)).cb) {
			cli.staker_message.info(`Created block with hash ${block?.hash} is invalid.`);
			return;
		}

		blockchain.blocks.addBlock(block);
		blockchain.chainstate.updateLatestBlockInfo(block, "main");
		mempool.clearMempoolbyBlock(block);

		await blockchain.wallets.adjustWalletsByBlock(block);

		utils.events.emit("block_receive", LeiCoinNetDataPackage.create(block));

		cli.staker_message.success(`Created block with hash ${block.hash} has been validated. Broadcasting now.`);
		return;
		
	}

	public static async processAttestation(attestation: AttestationSendData) {

		if (validatorsCommittee.isCurrentProposer(validator.publicKey)) {
            
			validatorsCommittee.getCurrentBlock()?.addAttestation(attestation.toAttestationInBlock());
            
		}

    }

}
