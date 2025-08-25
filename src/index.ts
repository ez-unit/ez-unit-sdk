import { HyperUnitSDK } from "./sdk";

// Core SDK exports
export { HyperUnitSDK, createHyperUnitSDK } from "./sdk";
export { HyperUnitClient } from "./client";

// Enums (exported as values)
export { OperationState } from "./types";

// Types
export type {
  Chain,
  Asset,
  Environment,
  Address,
  Operation,
  GetOperationsResponse,
  GenerateAddressParams,
  GenerateAddressResponse,
  VerifiedAddressResponse,
  ApiErrorResponse,
  HyperUnitConfig,
  ApiResponse,
  BitcoinFeeEstimate,
  EthereumFeeEstimate,
  SolanaFeeEstimate,
  SPLFeeEstimate,
  EstimateFeesResponse,
  WithdrawalQueueInfo,
  WithdrawalQueueResponse,
} from "./types";

// Error class
export { HyperUnitError } from "./types";

// Signature verification
export { verifyDepositAddressSignatures } from "./actions/verifySignatures";
export {
  TESTNET_GUARDIAN_NODES,
  MAINNET_GUARDIAN_NODES,
} from "./actions/verifySignatures";

// Default export
export default HyperUnitSDK;
