import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Insurance } from "../target/types/insurance";
import { Keypair, SystemProgram } from "@solana/web3.js";
import { assert } from "chai";

describe("insurance-contract", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.Insurance as Program<Insurance>;
  const provider = anchor.getProvider() as anchor.AnchorProvider;
  const wallet = provider.wallet as anchor.Wallet;

  // 全局变量保存 admin的 PDA地址，与保险产品对应的地址以种子计算而来
  let adminPda = null;
  let adminBump = null;
  let insuranceProductPda = null;

  // 测试数据
  const productId = "prod-001";
  const name = "保险产品一";
  const description = "这是一个综合保险产品";
  const coverageAmount = new anchor.BN(1_000_000);
  const premiumAmount = new anchor.BN(50_000);
  const durationDays = 365;

  // 为了测试非创建者的情况，预先创建一个不同的 Keypair
  const anotherUser = Keypair.generate();

  // admin账户在 initialize 函数中，会使用 creaters 的公钥作为种子生成 PDA
  // 我们需要提前计算 admin 的 PDA 地址
  before(async () => {
    // 计算 admin 的 PDA: seeds = [creater.key().as_ref()]
    const [pda, bump] = await anchor.web3.PublicKey.findProgramAddress(
      [provider.wallet.publicKey.toBuffer()],
      program.programId
    );
    adminPda = pda;
    adminBump = bump;

    // Airdrop SOL 给 anotherUser 用于发送交易
    const sig = await provider.connection.requestAirdrop(anotherUser.publicKey, 2 * anchor.web3.LAMPORTS_PER_SOL);
    await provider.connection.confirmTransaction(sig);
  });

  it("初始化时设置 admin.creater 为调用者", async () => {
    // 调用 initialize 指令，使用 Provider 的钱包作为 creaters
    await program.methods.initialize()
      .accounts({
        admin: adminPda,
        creater: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    // 拉取 admin 账户数据
    const adminAccount = await program.account.admin.fetch(adminPda);
    console.log("admin.creater:", adminAccount.creater.toString());
    console.log("provider.wallet.publicKey:", provider.wallet.publicKey.toString());
    assert.ok(adminAccount.creater.equals(provider.wallet.publicKey), "admin.creater 应该等于调用者的公钥");
  });

  it("创建保险产品", async () => {
    // 计算保险产品的 PDA
    const [pda] = await anchor.web3.PublicKey.findProgramAddress(
      [
        Buffer.from(productId)
      ],
      program.programId
    );
    insuranceProductPda = pda;

    // 创建保险产品
    await program.methods.createInsuranceProduct(
      productId,
      name,
      description,
      coverageAmount,
      premiumAmount,
      durationDays
    )
    .accounts({
      insuranceProduct: insuranceProductPda,
      creator: provider.wallet.publicKey,
      admin: adminPda,
      systemProgram: SystemProgram.programId,
    })
    .rpc();

    // 验证保险产品数据
    const product = await program.account.insuranceProduct.fetch(insuranceProductPda);
    assert.ok(product.creator.equals(provider.wallet.publicKey), "创建者应该匹配");
    assert.equal(product.productId, productId, "产品ID应该匹配");
    assert.equal(product.name, name, "产品名称应该匹配");
    assert.equal(product.description, description, "产品描述应该匹配");
    assert.ok(product.coverageAmount.eq(coverageAmount), "保额应该匹配");
    assert.ok(product.premiumAmount.eq(premiumAmount), "保费应该匹配");
    assert.equal(product.durationDays, durationDays, "保险期限应该匹配");
    assert.equal(product.isActive, true, "产品应该处于激活状态");
  });

  it("更新保险产品", async () => {
    const newName = "更新后的保险产品";
    const newDescription = "这是更新后的保险产品描述";
    const newCoverageAmount = new anchor.BN(2_000_000);
    const newPremiumAmount = new anchor.BN(100_000);
    const newDurationDays = 730;
    const newIsActive = false;

    await program.methods.updateInsuranceProduct(
      productId,
      newName,
      newDescription,
      newCoverageAmount,
      newPremiumAmount,
      newDurationDays,
      newIsActive
    )
    .accounts({
      insuranceProduct: insuranceProductPda,
      creator: provider.wallet.publicKey,
    })
    .rpc();

    // 验证更新后的数据
    const product = await program.account.insuranceProduct.fetch(insuranceProductPda);
    assert.equal(product.name, newName, "更新后的产品名称应该匹配");
    assert.equal(product.description, newDescription, "更新后的产品描述应该匹配");
    assert.ok(product.coverageAmount.eq(newCoverageAmount), "更新后的保额应该匹配");
    assert.ok(product.premiumAmount.eq(newPremiumAmount), "更新后的保费应该匹配");
    assert.equal(product.durationDays, newDurationDays, "更新后的保险期限应该匹配");
    assert.equal(product.isActive, newIsActive, "更新后的激活状态应该匹配");
  });

  it("非创建者无法更新保险产品", async () => {
    try {
      await program.methods.updateInsuranceProduct(
        productId,
        "新名称",
        "新描述",
        new anchor.BN(1_000_000),
        new anchor.BN(50_000),
        365,
        true
      )
      .accounts({
        insuranceProduct: insuranceProductPda,
        creator: anotherUser.publicKey,
      })
      .signers([anotherUser])
      .rpc();
      assert.fail("应该抛出未授权错误");
    } catch (err) {
      assert.include(err.message, "Unauthorized", "应该返回未授权错误");
    }
  });
});
