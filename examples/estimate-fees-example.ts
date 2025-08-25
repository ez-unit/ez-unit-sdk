import { createHyperUnitSDK } from "../src/index";

async function estimateFeesExample() {
  // Create SDK instance for mainnet
  const sdk = createHyperUnitSDK({
    environment: "mainnet",
    timeout: 30000,
  });

  try {
    console.log("Fetching fee estimates...");
    const response = await sdk.estimateFees();

    console.log("✅ Fee estimates retrieved successfully!");
    console.log("\n📊 Fee Estimates Summary:");
    console.log("==========================");

    // Bitcoin fees
    console.log("\n🔸 Bitcoin:");
    console.log(`   Deposit Fee: ${response.data.bitcoin.depositFee} sats`);
    console.log(
      `   Withdrawal Fee: ${response.data.bitcoin.withdrawalFee} sats`
    );
    console.log(`   Deposit ETA: ${response.data.bitcoin.depositEta}`);
    console.log(`   Withdrawal ETA: ${response.data.bitcoin.withdrawalEta}`);

    // Ethereum fees
    console.log("\n🔸 Ethereum:");
    console.log(`   Deposit Fee: ${response.data.ethereum.depositFee} wei`);
    console.log(
      `   Withdrawal Fee: ${response.data.ethereum.withdrawalFee} wei`
    );
    console.log(`   Deposit ETA: ${response.data.ethereum.depositEta}`);
    console.log(`   Withdrawal ETA: ${response.data.ethereum.withdrawalEta}`);

    // Solana fees
    console.log("\n🔸 Solana:");
    console.log(`   Deposit Fee: ${response.data.solana.depositFee} lamports`);
    console.log(
      `   Withdrawal Fee: ${response.data.solana.withdrawalFee} lamports`
    );
    console.log(`   Deposit ETA: ${response.data.solana.depositEta}`);
    console.log(`   Withdrawal ETA: ${response.data.solana.withdrawalEta}`);

    // SPL fees
    console.log("\n🔸 SPL Tokens:");
    console.log(`   Deposit Fee: ${response.data.spl.depositFee} lamports`);
    console.log(
      `   Withdrawal Fee: ${response.data.spl.withdrawalFee} lamports`
    );
    console.log(`   Deposit ETA: ${response.data.spl.depositEta}`);
    console.log(`   Withdrawal ETA: ${response.data.spl.withdrawalEta}`);

    // Convert to more readable formats
    console.log("\n💰 Fee Estimates in USD (approximate):");
    console.log("=====================================");

    // Note: These are rough estimates, actual USD values would depend on current prices
    const btcPrice = 50000; // Example BTC price in USD
    const ethPrice = 3000; // Example ETH price in USD
    const solPrice = 100; // Example SOL price in USD

    console.log(
      `\n🔸 Bitcoin: $${(
        (response.data.bitcoin.depositFee / 100000000) *
        btcPrice
      ).toFixed(4)} (deposit)`
    );
    console.log(
      `   Bitcoin: $${(
        (response.data.bitcoin.withdrawalFee / 100000000) *
        btcPrice
      ).toFixed(4)} (withdrawal)`
    );

    console.log(
      `\n🔸 Ethereum: $${(
        (response.data.ethereum.depositFee / 1e18) *
        ethPrice
      ).toFixed(4)} (deposit)`
    );
    console.log(
      `   Ethereum: $${(
        (response.data.ethereum.withdrawalFee / 1e18) *
        ethPrice
      ).toFixed(4)} (withdrawal)`
    );

    console.log(
      `\n🔸 Solana: $${(
        (response.data.solana.depositFee / 1e9) *
        solPrice
      ).toFixed(4)} (deposit)`
    );
    console.log(
      `   Solana: $${(
        (response.data.solana.withdrawalFee / 1e9) *
        solPrice
      ).toFixed(4)} (withdrawal)`
    );
  } catch (error) {
    console.error("❌ Error fetching fee estimates:", error);
  }
}

// Run the example
estimateFeesExample();
