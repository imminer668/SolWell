use std::fmt::Display;
use anchor_lang::prelude::*;
use anchor_lang::solana_program::pubkey::Pubkey;

declare_id!("FKmiJUF4PdDWNPrtPmZGLYXsqTMzXmjcsC9bnuuEFW2M");

#[program]
pub mod data_storage {
    use super::*;

    // 更新数据
    pub fn update(ctx: Context<Update>, heart_rate:u8,calorie: u16,movement_time: u8,time_range:TimeRange) -> Result<()> {
        let health_info = &mut ctx.accounts.health_info;
        health_info.user = ctx.accounts.user.key();
        health_info.time_range = time_range;
        health_info.heart_rate = heart_rate;
        health_info.calorie = calorie;
        health_info.movement_time = movement_time;
        Ok(())
    }

}


// 时间范围枚举
#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum TimeRange {
    Week,
    Month,
    Year,
    All,
}

impl Display for TimeRange {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        let str = match self {
            TimeRange::Week => "7天".to_string(),
            TimeRange::Month => "30天".to_string(),
            TimeRange::Year => "365天".to_string(),
            TimeRange::All => "全部".to_string(),
        };
        write!(f, "{}", str)
    }
}

// 更新账户结构
#[derive(Accounts)]
#[instruction(time_range: TimeRange)]
pub struct Update<'info> {
    #[account(
        init,
        payer = user,
        space = 8 + HealthInfo::LEN,
        seeds = [b"health_info", user.key().as_ref(),time_range.to_string().as_bytes()],
        bump
    )]
    pub health_info: Account<'info, HealthInfo>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}



// 数据账户结构
#[account]
pub struct HealthInfo{
    pub user:Pubkey,
    pub time_range:TimeRange,
    pub heart_rate: u8,  // 心跳
    pub calorie: u16,  // 卡路里
    pub movement_time: u8,  // 活动时间
}


#[error_code]
pub enum ErrorCode {
    #[msg("Unauthorized access")]
    Unauthorized,
}




