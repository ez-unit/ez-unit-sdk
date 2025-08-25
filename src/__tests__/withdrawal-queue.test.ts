import { createHyperUnitSDK } from "../index";

describe("HyperUnit SDK - Withdrawal Queue", () => {
  const sdk = createHyperUnitSDK({
    environment: "mainnet",
    timeout: 30000,
  });

  test("should get withdrawal queue information for all networks", async () => {
    const response = await sdk.getWithdrawalQueue();

    // Verify the response structure
    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty("bitcoin");
    expect(response.data).toHaveProperty("ethereum");

    // Verify Bitcoin withdrawal queue structure
    const bitcoin = response.data.bitcoin;
    expect(bitcoin).toHaveProperty("lastWithdrawQueueOperationTxID");
    expect(bitcoin).toHaveProperty("withdrawalQueueLength");

    // Verify Bitcoin data types
    expect(typeof bitcoin.lastWithdrawQueueOperationTxID).toBe("string");
    expect(typeof bitcoin.withdrawalQueueLength).toBe("number");

    // Verify Bitcoin values are reasonable
    expect(bitcoin.lastWithdrawQueueOperationTxID).toBeTruthy();
    expect(bitcoin.withdrawalQueueLength).toBeGreaterThanOrEqual(0);

    // Verify Ethereum withdrawal queue structure
    const ethereum = response.data.ethereum;
    expect(ethereum).toHaveProperty("lastWithdrawQueueOperationTxID");
    expect(ethereum).toHaveProperty("withdrawalQueueLength");

    // Verify Ethereum data types
    expect(typeof ethereum.lastWithdrawQueueOperationTxID).toBe("string");
    expect(typeof ethereum.withdrawalQueueLength).toBe("number");

    // Verify Ethereum values are reasonable
    expect(ethereum.lastWithdrawQueueOperationTxID).toBeTruthy();
    expect(ethereum.withdrawalQueueLength).toBeGreaterThanOrEqual(0);
  });

  test("should handle testnet environment", async () => {
    const testnetSdk = createHyperUnitSDK({
      environment: "testnet",
      timeout: 30000,
    });

    const response = await testnetSdk.getWithdrawalQueue();

    // Verify the response structure
    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty("bitcoin");
    expect(response.data).toHaveProperty("ethereum");

    // Verify all networks have valid queue data
    const networks = ["bitcoin", "ethereum"] as const;
    networks.forEach((network) => {
      const networkData = response.data[network];
      expect(networkData).toBeDefined();
      expect(networkData.lastWithdrawQueueOperationTxID).toBeTruthy();
      expect(networkData.withdrawalQueueLength).toBeGreaterThanOrEqual(0);
    });
  });

  test("should return consistent withdrawal queue data within reasonable time", async () => {
    const startTime = Date.now();
    const response = await sdk.getWithdrawalQueue();
    const endTime = Date.now();

    // Verify response time is reasonable (should be fast for queue data)
    expect(endTime - startTime).toBeLessThan(5000); // 5 seconds max

    // Verify all required networks are present
    expect(response.data.bitcoin).toBeDefined();
    expect(response.data.ethereum).toBeDefined();

    // Verify queue lengths are non-negative
    expect(response.data.bitcoin.withdrawalQueueLength).toBeGreaterThanOrEqual(
      0
    );
    expect(response.data.ethereum.withdrawalQueueLength).toBeGreaterThanOrEqual(
      0
    );

    // Verify transaction IDs are valid format
    expect(response.data.bitcoin.lastWithdrawQueueOperationTxID).toMatch(
      /^[a-fA-F0-9]+$/
    );
    expect(response.data.ethereum.lastWithdrawQueueOperationTxID).toMatch(
      /^0x[a-fA-F0-9]+$/
    );
  });

  test("should handle network errors gracefully", async () => {
    // Create SDK with very short timeout to test error handling
    const invalidSdk = createHyperUnitSDK({
      environment: "mainnet",
      timeout: 1, // Very short timeout to trigger error quickly
    });

    // This should fail due to timeout
    await expect(invalidSdk.getWithdrawalQueue()).rejects.toThrow();
  });

  test("should provide meaningful withdrawal queue information", async () => {
    const response = await sdk.getWithdrawalQueue();

    // Log the current queue status for debugging
    console.log("Current withdrawal queue status:");
    console.log(
      `Bitcoin: ${response.data.bitcoin.withdrawalQueueLength} operations in queue`
    );
    console.log(
      `Ethereum: ${response.data.ethereum.withdrawalQueueLength} operations in queue`
    );
    console.log(
      `Last Bitcoin operation: ${response.data.bitcoin.lastWithdrawQueueOperationTxID}`
    );
    console.log(
      `Last Ethereum operation: ${response.data.ethereum.lastWithdrawQueueOperationTxID}`
    );

    // Verify the data provides useful information
    expect(
      response.data.bitcoin.lastWithdrawQueueOperationTxID.length
    ).toBeGreaterThan(0);
    expect(
      response.data.ethereum.lastWithdrawQueueOperationTxID.length
    ).toBeGreaterThan(0);

    // Bitcoin TX ID should be 63-64 characters (32 bytes hex, may or may not have leading zero)
    expect(
      response.data.bitcoin.lastWithdrawQueueOperationTxID.length
    ).toBeGreaterThanOrEqual(63);
    expect(
      response.data.bitcoin.lastWithdrawQueueOperationTxID.length
    ).toBeLessThanOrEqual(64);

    // Ethereum TX ID should be 66 characters (0x + 32 bytes hex)
    expect(response.data.ethereum.lastWithdrawQueueOperationTxID.length).toBe(
      66
    );
  });
});
