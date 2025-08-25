import { createHyperUnitSDK } from "../index";

describe("HyperUnit SDK - Generate Address with Signature Verification", () => {
  const sdk = createHyperUnitSDK({
    environment: "mainnet",
    timeout: 30000,
  });

  const testHyperLiquidAddress = "0xF26F5551E96aE5162509B25925fFfa7F07B2D652";
  const expectedBitcoinAddress =
    "bc1pn0t4alxqv8hzz6l7ts6fs533s4v2364mnpf5dtt0cu40ug3l094qm7r7lw";

  test("should generate Bitcoin deposit address with signature verification", async () => {
    const response = await sdk.generateBitcoinDepositAddressWithVerification(
      testHyperLiquidAddress
    );

    // Verify the response structure
    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty("address");
    expect(response.data).toHaveProperty("signatures");
    expect(response.data).toHaveProperty("status");
    expect(response.data).toHaveProperty("verification");
    expect(response.data.status).toBe("OK");

    // Verify the generated address matches the expected address
    expect(response.data.address).toBe(expectedBitcoinAddress);

    // Verify signatures structure
    expect(response.data.signatures).toHaveProperty("field-node");
    expect(response.data.signatures).toHaveProperty("hl-node");
    expect(response.data.signatures).toHaveProperty("unit-node");

    // Verify verification results
    expect(response.data.verification).toHaveProperty("success");
    expect(response.data.verification).toHaveProperty("verifiedCount");
    expect(typeof response.data.verification.success).toBe("boolean");
    expect(typeof response.data.verification.verifiedCount).toBe("number");

    // The verification should succeed with at least 2 guardian signatures
    expect(response.data.verification.success).toBe(true);
    expect(response.data.verification.verifiedCount).toBeGreaterThanOrEqual(2);

    // Verify verification details
    if (response.data.verification.verificationDetails) {
      expect(typeof response.data.verification.verificationDetails).toBe(
        "object"
      );
      // Check that at least some nodes verified successfully
      const verifiedNodes = Object.values(
        response.data.verification.verificationDetails
      ).filter(Boolean);
      expect(verifiedNodes.length).toBeGreaterThanOrEqual(2);
    }
  });

  test("should verify existing address response signatures", async () => {
    // First generate an address
    const addressResponse = await sdk.generateBitcoinDepositAddress(
      testHyperLiquidAddress
    );

    // Then verify its signatures
    const verifiedResponse = await sdk.verifyAddressSignatures(
      addressResponse.data,
      {
        src_chain: "bitcoin",
        dst_chain: "hyperliquid",
        asset: "btc",
        dst_addr: testHyperLiquidAddress,
      }
    );

    expect(verifiedResponse.address).toBe(expectedBitcoinAddress);
    expect(verifiedResponse.verification.success).toBe(true);
    expect(verifiedResponse.verification.verifiedCount).toBeGreaterThanOrEqual(
      2
    );
  });

  test("should generate Ethereum deposit address with verification", async () => {
    const response = await sdk.generateEthereumDepositAddressWithVerification(
      testHyperLiquidAddress
    );

    expect(response.data.address).toBeTruthy();
    expect(response.data.verification.success).toBe(true);
    expect(response.data.verification.verifiedCount).toBeGreaterThanOrEqual(2);
  });

  test("should generate Solana deposit address with verification", async () => {
    const response = await sdk.generateSolanaDepositAddressWithVerification(
      testHyperLiquidAddress
    );

    expect(response.data.address).toBeTruthy();
    expect(response.data.verification.success).toBe(true);
    expect(response.data.verification.verifiedCount).toBeGreaterThanOrEqual(2);
  });
});
