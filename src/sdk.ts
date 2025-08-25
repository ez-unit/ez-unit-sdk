import { HyperUnitClient } from "./client";
import {
  HyperUnitConfig,
  GenerateAddressParams,
  GenerateAddressResponse,
  GetOperationsResponse,
  EstimateFeesResponse,
  WithdrawalQueueResponse,
  ApiResponse,
} from "./types";
import { verifyDepositAddressSignatures } from "./actions/verifySignatures";

// Extended response type that includes verification
export interface VerifiedAddressResponse extends GenerateAddressResponse {
  verification: {
    success: boolean;
    verifiedCount: number;
    errors?: string[];
    verificationDetails?: { [nodeId: string]: boolean };
  };
}

/**
 * HyperUnit SDK - Maps API endpoints to typed TypeScript functions with signature verification
 */
export class HyperUnitSDK {
  private client: HyperUnitClient;
  private config: HyperUnitConfig;

  constructor(config: HyperUnitConfig) {
    this.config = config;
    this.client = new HyperUnitClient(config);
  }

  /**
   * Generate an address for deposit/withdrawal
   * Maps to: GET /gen/:src_chain/:dst_chain/:asset/:dst_addr
   * @returns Generated address
   */
  async generateAddress(
    params: GenerateAddressParams
  ): Promise<ApiResponse<GenerateAddressResponse>> {
    const { src_chain, dst_chain, asset, dst_addr } = params;
    const url = `/gen/${src_chain}/${dst_chain}/${asset}/${dst_addr}`;

    return this.client.get<GenerateAddressResponse>(url);
  }

  /**
   * Get operations for an address
   * Maps to: GET /operations/:address
   * @returns Operations for an address
   */
  async getOperations(
    address: string
  ): Promise<ApiResponse<GetOperationsResponse>> {
    const url = `/operations/${address}`;
    return this.client.get<GetOperationsResponse>(url);
  }

  /**
   * Get current fee rate and processing time estimates for each network
   * Maps to: GET /v2/estimate-fees
   * @returns Fee rate and processing time estimates for each network
   */
  async estimateFees(): Promise<ApiResponse<EstimateFeesResponse>> {
    const url = `/v2/estimate-fees`;
    return this.client.get<EstimateFeesResponse>(url);
  }

  /**
   * Get withdrawal queue information for Bitcoin and Ethereum
   * Maps to: GET /withdrawal-queue
   * @returns Withdrawal queue information for Bitcoin and Ethereum
   */
  async getWithdrawalQueue(): Promise<ApiResponse<WithdrawalQueueResponse>> {
    const url = `/withdrawal-queue`;
    return this.client.get<WithdrawalQueueResponse>(url);
  }

  /**
   * Generate an address and verify its signatures
   * @param params - The parameters for generating the address
   * @returns Generated address with signature verification
   */
  async generateAddressWithVerification(
    params: GenerateAddressParams
  ): Promise<ApiResponse<VerifiedAddressResponse>> {
    const response = await this.generateAddress(params);

    // Create proposal for signature verification
    const proposal = {
      destinationAddress: params.dst_addr,
      destinationChain: params.dst_chain,
      asset: params.asset,
      address: response.data.address,
      sourceChain: params.src_chain,
      coinType: this.getCoinType(params.asset),
    };

    // Verify signatures using the correct environment
    const verification = await verifyDepositAddressSignatures(
      response.data.signatures,
      proposal
    );

    // Return extended response with verification
    return {
      ...response,
      data: {
        ...response.data,
        verification,
      },
    };
  }

  /**
   * Generates Bitcoin deposit address
   * @param dst_addr - The destination HyperCore address
   * @returns Generated Bitcoin deposit address
   */
  async generateBitcoinDepositAddress(
    dst_addr: string
  ): Promise<ApiResponse<GenerateAddressResponse>> {
    return this.generateAddress({
      src_chain: "bitcoin",
      dst_chain: "hyperliquid",
      asset: "btc",
      dst_addr,
    });
  }

  /**
   * Generates Bitcoin deposit address with signature verification
   * @param dst_addr - The destination HyperCore address
   * @returns Generated Bitcoin deposit address with signature verification
   */
  async generateBitcoinDepositAddressWithVerification(
    dst_addr: string
  ): Promise<ApiResponse<VerifiedAddressResponse>> {
    return this.generateAddressWithVerification({
      src_chain: "bitcoin",
      dst_chain: "hyperliquid",
      asset: "btc",
      dst_addr,
    });
  }

  /**
   * Generates Ethereum deposit address
   */
  async generateEthereumDepositAddress(
    dst_addr: string
  ): Promise<ApiResponse<GenerateAddressResponse>> {
    return this.generateAddress({
      src_chain: "ethereum",
      dst_chain: "hyperliquid",
      asset: "eth",
      dst_addr,
    });
  }

  /**
   * Generates Ethereum deposit address with signature verification
   * @param dst_addr - The destination HyperCore address
   * @returns Generated Ethereum deposit address with signature verification
   */
  async generateEthereumDepositAddressWithVerification(
    dst_addr: string
  ): Promise<ApiResponse<VerifiedAddressResponse>> {
    return this.generateAddressWithVerification({
      src_chain: "ethereum",
      dst_chain: "hyperliquid",
      asset: "eth",
      dst_addr,
    });
  }

  /**
   * Generates Solana deposit address
   * @param dst_addr - The destination HyperCore address
   * @returns Generated Solana deposit address with signature verification
   */
  async generateSolanaDepositAddress(
    dst_addr: string
  ): Promise<ApiResponse<GenerateAddressResponse>> {
    return this.generateAddress({
      src_chain: "solana",
      dst_chain: "hyperliquid",
      asset: "sol",
      dst_addr,
    });
  }

  /**
   * Generates Solana deposit address with signature verification
   * @param dst_addr - The destination HyperCore address
   * @returns Generated Solana deposit address with signature verification
   */
  async generateSolanaDepositAddressWithVerification(
    dst_addr: string
  ): Promise<ApiResponse<VerifiedAddressResponse>> {
    return this.generateAddressWithVerification({
      src_chain: "solana",
      dst_chain: "hyperliquid",
      asset: "sol",
      dst_addr,
    });
  }

  /**
   * Verify signatures for an existing address response
   */
  async verifyAddressSignatures(
    response: GenerateAddressResponse,
    params: GenerateAddressParams
  ): Promise<VerifiedAddressResponse> {
    const proposal = {
      destinationAddress: params.dst_addr,
      destinationChain: params.dst_chain,
      asset: params.asset,
      address: response.address,
      sourceChain: params.src_chain,
      coinType: this.getCoinType(params.asset),
    };

    const verification = await verifyDepositAddressSignatures(
      response.signatures,
      proposal
    );

    return {
      ...response,
      verification,
    };
  }

  /**
   * Helper method to determine coin type from asset
   */
  private getCoinType(asset: string): string {
    switch (asset) {
      case "btc":
        return "bitcoin";
      case "eth":
        return "ethereum";
      case "sol":
        return "solana";
      default:
        return asset;
    }
  }
}

/**
 * Factory function to create a new HyperUnit SDK instance
 */
export function createHyperUnitSDK(config: HyperUnitConfig): HyperUnitSDK {
  return new HyperUnitSDK(config);
}
