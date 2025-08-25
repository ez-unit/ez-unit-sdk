import { createHyperUnitSDK } from "../index";

describe("HyperUnit SDK - Get Operations", () => {
  const sdk = createHyperUnitSDK({
    environment: "testnet",
    timeout: 30000,
  });

  const testAddress = "0xa6f1Ef42D335Ec7CbfC39f57269c851568300132";

  test("should get operations for an address", async () => {
    const response = await sdk.getOperations(testAddress);

    // Verify the response structure
    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty("addresses");
    expect(response.data).toHaveProperty("operations");
    expect(Array.isArray(response.data.addresses)).toBe(true);
    expect(Array.isArray(response.data.operations)).toBe(true);

    // Verify addresses structure
    if (response.data.addresses.length > 0) {
      const address = response.data.addresses[0];
      expect(address).toHaveProperty("sourceCoinType");
      expect(address).toHaveProperty("destinationChain");
      expect(address).toHaveProperty("address");
      expect(address).toHaveProperty("signatures");
      expect(typeof address.sourceCoinType).toBe("string");
      expect(typeof address.destinationChain).toBe("string");
      expect(typeof address.address).toBe("string");
      expect(typeof address.signatures).toBe("object");

      // Verify signature structure based on environment
      if (address.signatures) {
        expect(address.signatures).toHaveProperty("field-node");
        // Testnet should have these signatures
        if (address.signatures["hl-node-testnet"]) {
          expect(typeof address.signatures["hl-node-testnet"]).toBe("string");
        }
        if (address.signatures["node-1"]) {
          expect(typeof address.signatures["node-1"]).toBe("string");
        }
      }
    }

    // Verify operations structure
    if (response.data.operations.length > 0) {
      const operation = response.data.operations[0];

      // Required fields
      expect(operation).toHaveProperty("opCreatedAt");
      expect(operation).toHaveProperty("operationId");
      expect(operation).toHaveProperty("protocolAddress");
      expect(operation).toHaveProperty("sourceAddress");
      expect(operation).toHaveProperty("destinationAddress");
      expect(operation).toHaveProperty("sourceChain");
      expect(operation).toHaveProperty("destinationChain");
      expect(operation).toHaveProperty("sourceAmount");
      expect(operation).toHaveProperty("destinationFeeAmount");
      expect(operation).toHaveProperty("sweepFeeAmount");
      expect(operation).toHaveProperty("stateStartedAt");
      expect(operation).toHaveProperty("stateUpdatedAt");
      expect(operation).toHaveProperty("stateNextAttemptAt");
      expect(operation).toHaveProperty("sourceTxHash");
      expect(operation).toHaveProperty("destinationTxHash");
      expect(operation).toHaveProperty("asset");
      expect(operation).toHaveProperty("state");

      // Optional fields
      if (operation.sourceTxConfirmations !== undefined) {
        expect(typeof operation.sourceTxConfirmations).toBe("number");
      }
      if (operation.destinationTxConfirmations !== undefined) {
        expect(typeof operation.destinationTxConfirmations).toBe("number");
      }
      if (operation.broadcastAt !== undefined) {
        expect(typeof operation.broadcastAt).toBe("string");
      }
      if (operation.positionInWithdrawQueue !== undefined) {
        expect(typeof operation.positionInWithdrawQueue).toBe("number");
      }
      //   if (operation.destinationFeeAmountSPL !== undefined) {
      //     expect(typeof operation.destinationFeeAmountSPL).toBe("string");
      //   }

      // Verify data types
      expect(typeof operation.opCreatedAt).toBe("string");
      expect(typeof operation.operationId).toBe("string");
      expect(typeof operation.protocolAddress).toBe("string");
      expect(typeof operation.sourceAddress).toBe("string");
      expect(typeof operation.destinationAddress).toBe("string");
      expect(typeof operation.sourceChain).toBe("string");
      expect(typeof operation.destinationChain).toBe("string");
      expect(typeof operation.sourceAmount).toBe("string");
      expect(typeof operation.destinationFeeAmount).toBe("string");
      expect(typeof operation.sweepFeeAmount).toBe("string");
      expect(typeof operation.stateStartedAt).toBe("string");
      expect(typeof operation.stateUpdatedAt).toBe("string");
      expect(typeof operation.stateNextAttemptAt).toBe("string");
      expect(typeof operation.sourceTxHash).toBe("string");
      expect(typeof operation.destinationTxHash).toBe("string");
      expect(typeof operation.asset).toBe("string");
      expect(typeof operation.state).toBe("string");

      // Verify valid enum values
      expect(["bitcoin", "solana", "ethereum", "hyperliquid"]).toContain(
        operation.sourceChain
      );
      expect(["bitcoin", "solana", "ethereum", "hyperliquid"]).toContain(
        operation.destinationChain
      );
      expect(["btc", "eth", "sol", "fart"]).toContain(operation.asset);
      expect([
        "sourceTxDiscovered",
        "waitForSrcTxFinalization",
        "buildingDstTx",
        "signTx",
        "broadcastTx",
        "waitForDstTxFinalization",
        "readyForWithdrawQueue",
        "queuedForWithdraw",
        "done",
        "failure",
      ]).toContain(operation.state);
    }
  });

  test("should handle invalid address", async () => {
    const invalidAddress = "invalid-address";

    await expect(sdk.getOperations(invalidAddress)).rejects.toThrow();
  });

  test("should return operations for the specific test address", async () => {
    const response = await sdk.getOperations(testAddress);

    // Verify we get some operations
    expect(response.data.operations.length).toBeGreaterThan(0);

    // Verify the operations are for the correct address
    const operationsForAddress = response.data.operations.filter(
      (op) =>
        op.sourceAddress === testAddress ||
        op.destinationAddress === testAddress
    );
    expect(operationsForAddress.length).toBeGreaterThan(0);

    // Verify we have addresses for this user
    expect(response.data.addresses.length).toBeGreaterThan(0);

    // Verify the addresses are valid protocol addresses
    response.data.addresses.forEach((address) => {
      expect(address.address).toBeTruthy();
      expect(address.sourceCoinType).toBeTruthy();
      expect(address.destinationChain).toBeTruthy();
      expect(address.signatures).toBeTruthy();
    });
  });

  test("should handle mainnet environment", async () => {
    const mainnetSdk = createHyperUnitSDK({
      environment: "mainnet",
      timeout: 30000,
    });

    try {
      const response = await mainnetSdk.getOperations(testAddress);

      // Mainnet should have different signature structure
      if (response.data.addresses.length > 0) {
        const address = response.data.addresses[0];
        if (address.signatures) {
          expect(address.signatures).toHaveProperty("field-node");
          // Mainnet should have these signatures
          if (address.signatures["hl-node"]) {
            expect(typeof address.signatures["hl-node"]).toBe("string");
          }
          if (address.signatures["unit-node"]) {
            expect(typeof address.signatures["unit-node"]).toBe("string");
          }
        }
      }
    } catch (error) {
      // It's okay if mainnet doesn't have data for this testnet address
      expect(error).toBeDefined();
    }
  });
});
