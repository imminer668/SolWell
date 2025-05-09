use anchor_lang::prelude::*;

declare_id!("HctzKeMZMvnwBAAL73jJaG1G9odgX3kvzjV1Fc1Wo8Lx");

#[program]
pub mod sol_well_contracts {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
