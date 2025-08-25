import { createHyperUnitSDK } from "../index";

describe("HyperUnit SDK - Estimate Fees", () => {
  const sdk = createHyperUnitSDK({
    environment: "mainnet",
    timeout: 30000,
  });

  test("should get fee estimates for all networks", async () => {
    const response = await sdk.estimateFees();

    // Verify the response structure
    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty("bitcoin");
    expect(response.data).toHaveProperty("ethereum");
    expect(response.data).toHaveProperty("solana");
    expect(response.data).toHaveProperty("spl");

    // Verify Bitcoin fee structure
    const bitcoin = response.data.bitcoin;
    expect(bitcoin).toHaveProperty("deposit-fee-rate-sats-per-vb");
    expect(bitcoin).toHaveProperty("deposit-size-v-bytes");
    expect(bitcoin).toHaveProperty("depositEta");
    expect(bitcoin).toHaveProperty("depositFee");
    expect(bitcoin).toHaveProperty("withdrawal-fee-rate-sats-per-vb");
    expect(bitcoin).toHaveProperty("withdrawal-size-v-bytes");
    expect(bitcoin).toHaveProperty("withdrawalEta");
    expect(bitcoin).toHaveProperty("withdrawalFee");

    // Verify Bitcoin data types
    expect(typeof bitcoin["deposit-fee-rate-sats-per-vb"]).toBe("number");
    expect(typeof bitcoin["deposit-size-v-bytes"]).toBe("number");
    expect(typeof bitcoin.depositEta).toBe("string");
    expect(typeof bitcoin.depositFee).toBe("number");
    expect(typeof bitcoin["withdrawal-fee-rate-sats-per-vb"]).toBe("number");
    expect(typeof bitcoin["withdrawal-size-v-bytes"]).toBe("number");
    expect(typeof bitcoin.withdrawalEta).toBe("string");
    expect(typeof bitcoin.withdrawalFee).toBe("number");

    // Verify Bitcoin values are reasonable
    expect(bitcoin["deposit-fee-rate-sats-per-vb"]).toBeGreaterThan(0);
    expect(bitcoin["deposit-size-v-bytes"]).toBeGreaterThan(0);
    expect(bitcoin.depositFee).toBeGreaterThan(0);
    expect(bitcoin["withdrawal-fee-rate-sats-per-vb"]).toBeGreaterThan(0);
    expect(bitcoin["withdrawal-size-v-bytes"]).toBeGreaterThan(0);
    expect(bitcoin.withdrawalFee).toBeGreaterThan(0);

    // Verify Ethereum fee structure
    const ethereum = response.data.ethereum;
    expect(ethereum).toHaveProperty("base-fee");
    expect(ethereum).toHaveProperty("depositEta");
    expect(ethereum).toHaveProperty("depositFee");
    expect(ethereum).toHaveProperty("eth-deposit-gas");
    expect(ethereum).toHaveProperty("eth-withdrawal-gas");
    expect(ethereum).toHaveProperty("priority-fee");
    expect(ethereum).toHaveProperty("withdrawalEta");
    expect(ethereum).toHaveProperty("withdrawalFee");

    // Verify Ethereum data types
    expect(typeof ethereum["base-fee"]).toBe("number");
    expect(typeof ethereum.depositEta).toBe("string");
    expect(typeof ethereum.depositFee).toBe("number");
    expect(typeof ethereum["eth-deposit-gas"]).toBe("number");
    expect(typeof ethereum["eth-withdrawal-gas"]).toBe("number");
    expect(typeof ethereum["priority-fee"]).toBe("number");
    expect(typeof ethereum.withdrawalEta).toBe("string");
    expect(typeof ethereum.withdrawalFee).toBe("number");

    // Verify Ethereum values are reasonable
    expect(ethereum["base-fee"]).toBeGreaterThan(0);
    expect(ethereum.depositFee).toBeGreaterThan(0);
    expect(ethereum["eth-deposit-gas"]).toBeGreaterThan(0);
    expect(ethereum["eth-withdrawal-gas"]).toBeGreaterThan(0);
    expect(ethereum["priority-fee"]).toBeGreaterThanOrEqual(0);
    expect(ethereum.withdrawalFee).toBeGreaterThan(0);

    // Verify Solana fee structure
    const solana = response.data.solana;
    expect(solana).toHaveProperty("depositEta");
    expect(solana).toHaveProperty("depositFee");
    expect(solana).toHaveProperty("withdrawalEta");
    expect(solana).toHaveProperty("withdrawalFee");

    // Verify Solana data types
    expect(typeof solana.depositEta).toBe("string");
    expect(typeof solana.depositFee).toBe("number");
    expect(typeof solana.withdrawalEta).toBe("string");
    expect(typeof solana.withdrawalFee).toBe("number");

    // Verify Solana values are reasonable
    expect(solana.depositFee).toBeGreaterThan(0);
    expect(solana.withdrawalFee).toBeGreaterThan(0);

    // Verify SPL fee structure
    const spl = response.data.spl;
    expect(spl).toHaveProperty("depositEta");
    expect(spl).toHaveProperty("depositFee");
    expect(spl).toHaveProperty("withdrawalEta");
    expect(spl).toHaveProperty("withdrawalFee");

    // Verify SPL data types
    expect(typeof spl.depositEta).toBe("string");
    expect(typeof spl.depositFee).toBe("number");
    expect(typeof spl.withdrawalEta).toBe("string");
    expect(typeof spl.withdrawalFee).toBe("number");

    // Verify SPL values are reasonable
    expect(spl.depositFee).toBeGreaterThan(0);
    expect(spl.withdrawalFee).toBeGreaterThan(0);
  });

  test("should handle mainnet environment", async () => {
    const mainnetSdk = createHyperUnitSDK({
      environment: "mainnet",
      timeout: 30000,
    });

    const response = await mainnetSdk.estimateFees();

    // Verify the response structure
    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty("bitcoin");
    expect(response.data).toHaveProperty("ethereum");
    expect(response.data).toHaveProperty("solana");
    expect(response.data).toHaveProperty("spl");

    // Verify all networks have valid fee data
    const networks = ["bitcoin", "ethereum", "solana", "spl"] as const;
    networks.forEach((network) => {
      const networkData = response.data[network];
      expect(networkData).toBeDefined();
      expect(networkData.depositFee).toBeGreaterThan(0);
      expect(networkData.withdrawalFee).toBeGreaterThan(0);
      expect(networkData.depositEta).toBeTruthy();
      expect(networkData.withdrawalEta).toBeTruthy();
    });
  });

  test("should return consistent fee estimates within reasonable time", async () => {
    const startTime = Date.now();
    const response = await sdk.estimateFees();
    const endTime = Date.now();

    // Verify response time is reasonable (should be fast for fee estimates)
    expect(endTime - startTime).toBeLessThan(5000); // 5 seconds max

    // Verify all required networks are present
    expect(response.data.bitcoin).toBeDefined();
    expect(response.data.ethereum).toBeDefined();
    expect(response.data.solana).toBeDefined();
    expect(response.data.spl).toBeDefined();

    // Verify fee estimates are positive numbers
    expect(response.data.bitcoin.depositFee).toBeGreaterThan(0);
    expect(response.data.bitcoin.withdrawalFee).toBeGreaterThan(0);
    expect(response.data.ethereum.depositFee).toBeGreaterThan(0);
    expect(response.data.ethereum.withdrawalFee).toBeGreaterThan(0);
    expect(response.data.solana.depositFee).toBeGreaterThan(0);
    expect(response.data.solana.withdrawalFee).toBeGreaterThan(0);
    expect(response.data.spl.depositFee).toBeGreaterThan(0);
    expect(response.data.spl.withdrawalFee).toBeGreaterThan(0);
  });

  test("should handle network errors gracefully", async () => {
    // Create SDK with very short timeout to test error handling
    const invalidSdk = createHyperUnitSDK({
      environment: "mainnet",
      timeout: 1, // Very short timeout to trigger error quickly
    });

    // This should fail due to timeout
    await expect(invalidSdk.estimateFees()).rejects.toThrow();
  });
});
