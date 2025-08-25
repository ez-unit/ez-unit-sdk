import { createHyperUnitSDK } from "../src/index";

async function withdrawalQueueExample() {
  // Create SDK instance for mainnet
  const sdk = createHyperUnitSDK({
    environment: "mainnet",
    timeout: 30000,
  });

  try {
    console.log("Fetching withdrawal queue information...");
    const response = await sdk.getWithdrawalQueue();

    console.log("✅ Withdrawal queue information retrieved successfully!");
    console.log("\n📊 Withdrawal Queue Status:");
    console.log("============================");

    // Bitcoin withdrawal queue
    console.log("\n🔸 Bitcoin:");
    console.log(
      `   Operations in queue: ${response.data.bitcoin.withdrawalQueueLength}`
    );
    console.log(
      `   Last operation TX ID: ${response.data.bitcoin.lastWithdrawQueueOperationTxID}`
    );

    // Ethereum withdrawal queue
    console.log("\n🔸 Ethereum:");
    console.log(
      `   Operations in queue: ${response.data.ethereum.withdrawalQueueLength}`
    );
    console.log(
      `   Last operation TX ID: ${response.data.ethereum.lastWithdrawQueueOperationTxID}`
    );

    // Provide insights based on queue status
    console.log("\n💡 Queue Analysis:");
    console.log("==================");

    if (response.data.bitcoin.withdrawalQueueLength === 0) {
      console.log("✅ Bitcoin withdrawal queue is empty - fast processing!");
    } else if (response.data.bitcoin.withdrawalQueueLength <= 5) {
      console.log("⚡ Bitcoin withdrawal queue is short - moderate wait time");
    } else {
      console.log(
        "⏳ Bitcoin withdrawal queue has operations - longer wait time"
      );
    }

    if (response.data.ethereum.withdrawalQueueLength === 0) {
      console.log("✅ Ethereum withdrawal queue is empty - fast processing!");
    } else if (response.data.ethereum.withdrawalQueueLength <= 5) {
      console.log("⚡ Ethereum withdrawal queue is short - moderate wait time");
    } else {
      console.log(
        "⏳ Ethereum withdrawal queue has operations - longer wait time"
      );
    }

    // Calculate estimated processing times
    console.log("\n⏱️  Estimated Processing Times:");
    console.log("===============================");

    // Bitcoin processes ~every 3 blocks (30 minutes)
    const bitcoinBlockTime = 10; // minutes per block
    const bitcoinProcessingInterval = 3; // blocks
    const bitcoinEstimatedTime =
      response.data.bitcoin.withdrawalQueueLength *
      bitcoinProcessingInterval *
      bitcoinBlockTime;

    // Ethereum processes ~every 21 slots (4.2 minutes)
    const ethereumSlotTime = 0.2; // minutes per slot
    const ethereumProcessingInterval = 21; // slots
    const ethereumEstimatedTime =
      response.data.ethereum.withdrawalQueueLength *
      ethereumProcessingInterval *
      ethereumSlotTime;

    console.log(
      `🔸 Bitcoin: ~${bitcoinEstimatedTime} minutes (${(
        bitcoinEstimatedTime / 60
      ).toFixed(1)} hours)`
    );
    console.log(`🔸 Ethereum: ~${ethereumEstimatedTime.toFixed(1)} minutes`);

    if (bitcoinEstimatedTime === 0) {
      console.log("   Bitcoin: No wait time - immediate processing");
    }
    if (ethereumEstimatedTime === 0) {
      console.log("   Ethereum: No wait time - immediate processing");
    }

    // Transaction ID analysis
    console.log("\n🔍 Transaction ID Analysis:");
    console.log("============================");

    const bitcoinTxId = response.data.bitcoin.lastWithdrawQueueOperationTxID;
    const ethereumTxId = response.data.ethereum.lastWithdrawQueueOperationTxID;

    console.log(`🔸 Bitcoin TX ID length: ${bitcoinTxId.length} characters`);
    console.log(`🔸 Ethereum TX ID length: ${ethereumTxId.length} characters`);
    console.log(
      `🔸 Bitcoin TX ID format: ${
        bitcoinTxId.match(/^[a-fA-F0-9]+$/) ? "Valid hex" : "Invalid format"
      }`
    );
    console.log(
      `🔸 Ethereum TX ID format: ${
        ethereumTxId.match(/^0x[a-fA-F0-9]+$/)
          ? "Valid hex with 0x prefix"
          : "Invalid format"
      }`
    );
  } catch (error) {
    console.error("❌ Error fetching withdrawal queue information:", error);
  }
}

// Run the example
withdrawalQueueExample();
