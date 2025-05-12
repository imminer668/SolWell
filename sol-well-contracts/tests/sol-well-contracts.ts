import * as anchor from "@coral-xyz/anchor";
import {Program} from "@coral-xyz/anchor";
import type {HealthData} from "../target/types/health_data";

describe("sol-well-contracts", () => {
    // Configure the client to use the local cluster.
    const provider = anchor.AnchorProvider.env()
    anchor.setProvider(provider);
    const payer = provider.wallet as anchor.Wallet;
    const program = anchor.workspace.HealthData as Program<HealthData>;

    const [myPda, _bump] = anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from("health_info"), payer.publicKey.toBuffer(), Buffer.from("Week")],
        program.programId
    );

    it("Is initialized!", async () => {
        // Add your test here.
        const week = {week: {}};
        let steps = 42;
        let sleep = 3.0;
        let heart_rate = 66;
        let calories = 44;
        let active_minutes = 55;
        // seeds = [
        //             b"health_info",
        //             user.key().as_ref(),
        //             time_range.to_string().as_bytes()
        //         ],
        // set_health_data(
        //         ctx: Context<SetHealthData>,
        //         time_range: TimeRange,
        //         steps: u32,
        //         sleep: f32,
        //         heart_rate: u16,
        //         calories: u16,
        //         active_minutes: u16,
        //     )
        const tx = await program.methods
            .setHealthData(week, steps, sleep, heart_rate, calories, active_minutes)
            .accounts({
                healthData: myPda,
                user: payer.publicKey,
            })
            .rpc()
        console.log("Your transaction signature", tx);
    });

    it('loading sleep value', async () => {
        const healthData = await program.account.healthData.fetch(myPda);
        console.log(`sleep value is: ${healthData.sleep}`);
        console.log(`heart_rate value is: ${healthData.heartRate}`);

    });
});
