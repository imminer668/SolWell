use anchor_lang::prelude::*;

declare_id!("J6pC1jbqJFSAfai5ociJQzCUg6uspv62FcnRNV7R1stE");

#[program]
pub mod insurance {
    use super::*;
    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let admin = &mut ctx.accounts.admin;
        admin.creater = ctx.accounts.creater.key();
        Ok(())
    }
    // Create insurance product
    pub fn create_insurance_product(
        ctx: Context<CreateInsuranceProduct>,
        product_id: String,
        name: String,
        description: String,
        coverage_amount: u64,
        premium_amount: u64,
        duration_days: u32,
    ) -> Result<()> {
        let insurance_product = &mut ctx.accounts.insurance_product;
        let clock = Clock::get()?;

        let admin = &ctx.accounts.admin;
        require!(
            admin.creater == *ctx.accounts.creator.key,
            ErrorCode::Unauthorized
        );

        // Set product information
        insurance_product.creator = ctx.accounts.creator.key();
        insurance_product.product_id = product_id;
        insurance_product.name = name;
        insurance_product.description = description;
        insurance_product.coverage_amount = coverage_amount;
        insurance_product.premium_amount = premium_amount;
        insurance_product.duration_days = duration_days;
        insurance_product.is_active = true;
        insurance_product.created_at = clock.unix_timestamp;
        insurance_product.updated_at = clock.unix_timestamp;

        Ok(())
    }

    // Update insurance product
    pub fn update_insurance_product(
        ctx: Context<UpdateInsuranceProduct>,
        product_id: String,
        name: String,
        description: String,
        coverage_amount: u64,
        premium_amount: u64,
        duration_days: u32,
        is_active: bool,
    ) -> Result<()> {
        let insurance_product = &mut ctx.accounts.insurance_product;
        let clock = Clock::get()?;

        // Verify creator
        require!(
            insurance_product.creator == *ctx.accounts.creator.key,
            ErrorCode::Unauthorized
        );

        // Update product information
        insurance_product.name = name;
        insurance_product.description = description;
        insurance_product.coverage_amount = coverage_amount;
        insurance_product.premium_amount = premium_amount;
        insurance_product.duration_days = duration_days;
        insurance_product.is_active = is_active;
        insurance_product.updated_at = clock.unix_timestamp;

        Ok(())
    }
}

// Initialize
#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = creater, space = 8 + 32, seeds = [creater.key().as_ref()], bump)]
    pub admin: Account<'info, Admin>,

    #[account(mut)]
    pub creater: Signer<'info>,

    pub system_program: Program<'info, System>,
}

// Context validation
#[derive(Accounts)]
#[instruction(product_id: String)]
pub struct CreateInsuranceProduct<'info> {
    #[account(
        init,
        payer = creator,
        space = 8 + InsuranceProduct::LEN,
        seeds = [
            product_id.as_bytes()
        ],
        bump
    )]
    pub insurance_product: Account<'info, InsuranceProduct>,

    #[account(mut)]
    pub creator: Signer<'info>,
    pub admin: Account<'info, Admin>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(product_id: String)]
pub struct UpdateInsuranceProduct<'info> {
    #[account(
        mut,
        seeds = [
            product_id.as_bytes()
        ],
        bump
    )]
    pub insurance_product: Account<'info, InsuranceProduct>,

    #[account(mut)]
    pub creator: Signer<'info>,
}

impl InsuranceProduct {
    const LEN: usize = 32   // creator
        + 4 + 32           // product_id (String) - 4 bytes for length + max 32 bytes for content
        + 4 + 32           // name (String) - 4 bytes for length + max 32 bytes for content
        + 4 + 128          // description (String) - 4 bytes for length + max 128 bytes for content
        + 8                // coverage_amount (u64)
        + 8                // premium_amount (u64)
        + 4                // duration_days (u32)
        + 1                // is_active (bool)
        + 8                // created_at (i64)
        + 8;               // updated_at (i64)
}

// Insurance product structure
#[account]
#[derive(Default)]
pub struct InsuranceProduct {
    pub creator: Pubkey,      // Creator public key
    pub product_id: String,   // Product ID
    pub name: String,         // Product name
    pub description: String,  // Product description
    pub coverage_amount: u64, // Coverage amount
    pub premium_amount: u64,  // Premium amount
    pub duration_days: u32,   // Coverage duration (days)
    pub is_active: bool,      // Active status
    pub created_at: i64,      // Creation time
    pub updated_at: i64,      // Update time
}

#[account]
#[derive(Default)]
pub struct Admin {
    pub creater: Pubkey,
}

#[error_code]
pub enum ErrorCode {
    #[msg("Unauthorized access")]
    Unauthorized,
}