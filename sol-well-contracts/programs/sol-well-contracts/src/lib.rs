use anchor_lang::prelude::*;
use std::string::ToString;

declare_id!("5D8DSGCWhzyFtEFKAZxYFVUmn9dgMS4PRABNwEJyjmH6");

#[program]
pub mod health_data {
    use super::*;

    // set data
    pub fn set_health_data(
        ctx: Context<SetHealthData>,
        time_range: TimeRange,
        steps: u32,
        sleep: f32,
        heart_rate: u16,
        calories: u16,
        active_minutes: u16,
    ) -> Result<()> {
        let health_data = &mut ctx.accounts.health_data;

        // set user
        health_data.user = ctx.accounts.user.key();
        // update health_data
        health_data.time_range = time_range;
        health_data.steps = steps;
        health_data.sleep = sleep;
        health_data.heart_rate = heart_rate;
        health_data.calories = calories;
        health_data.active_minutes = active_minutes;

        Ok(())
    }
}

// health data in time range
#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq, Default)]
pub enum TimeRange {
    #[default]
    Week,
    Month,
    Year,
    All,
}

// define the data strcture of HealthData's PDA
#[account]
#[derive(Default)]
pub struct HealthData {
    pub user: Pubkey,
    pub time_range: TimeRange,
    pub steps: u32,
    pub sleep: f32,
    pub heart_rate: u16,
    pub calories: u16,
    pub active_minutes: u16,
}

// Define which account that you want to modify when you call to the set_health_data directive.
#[derive(Accounts)]
#[instruction(time_range: TimeRange)]
pub struct SetHealthData<'info> {
    #[account(
        init_if_needed,
        payer = user,
        space = 8 + HealthData::LEN,
        seeds = [
            b"health_info",
            user.key().as_ref(),
            time_range.to_string().as_bytes()
        ],
        bump
    )]
    pub health_data: Account<'info, HealthData>,

    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

impl HealthData {
    const LEN: usize = 32   // user
        + 1                 // time_range (enum index)
        + 4                 // steps (u32)
        + 4                 // sleep (f32)
        + 2                 // heart_rate (u16)
        + 2                 // calories (u16)
        + 2;                // active_minutes (u16)
}

impl ToString for TimeRange {
    fn to_string(&self) -> String {
        match self {
            TimeRange::Week => "7 days".to_string(),
            TimeRange::Month => "30 days".to_string(),
            TimeRange::Year => "365 days".to_string(),
            TimeRange::All => "All".to_string(),
        }
    }
}

#[error_code]
pub enum ErrorCode {
    #[msg("Unauthorized access")]
    Unauthorized,
}