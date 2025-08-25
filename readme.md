```
██╗░░░██╗███╗░░██╗██╗████████╗  ░██████╗██████╗░██╗░░██╗
██║░░░██║████╗░██║██║╚══██╔══╝  ██╔════╝██╔══██╗██║░██╔╝
██║░░░██║██╔██╗██║██║░░░██║░░░  ╚█████╗░██║░░██║█████═╝░
██║░░░██║██║╚████║██║░░░██║░░░  ░╚═══██╗██║░░██║██╔═██╗░
╚██████╔╝██║░╚███║██║░░░██║░░░  ██████╔╝██████╔╝██║░╚██╗
░╚═════╝░╚═╝░░╚══╝╚═╝░░░╚═╝░░░  ╚═════╝░╚═════╝░╚═╝░░╚═╝
```

A Community TypeScript SDK for the HyperUnit API with full type safety and signature verification. This SDK provides a clean, typed interface for interacting with HyperUnit's cross-chain bridge operations.

## Features

- 🔒 **Full Type Safety** - Complete TypeScript definitions for all API responses
- 🔐 **Signature Verification** - Built-in verification of deposit address signatures
- ⚡ **Cross-Chain Support** - Bitcoin, Ethereum, Solana, and HyperLiquid
- 🚀 **Easy Integration** - Simple, promise-based API
- 🧪 **Test Coverage** - Comprehensive test suite included

## Installation

```bash
npm install unit-sdk
# or
pnpm add unit-sdk
# or
yarn add unit-sdk
```

## Quick Start

```typescript
import { createHyperUnitSDK } from "unit-sdk";

// Initialize the SDK
const sdk = createHyperUnitSDK({
  environment: "mainnet", // or 'testnet'
  timeout: 30000,
});

// Generate a deposit address
const addressResponse = await sdk.generateAddress({
  src_chain: "bitcoin",
  dst_chain: "ethereum",
  asset: "btc",
  dst_addr: "0x1234567890abcdef...",
});

console.log("Deposit address:", addressResponse.data.address);

// Get fee estimates
const fees = await sdk.estimateFees();
console.log("Bitcoin deposit fee:", fees.data.bitcoin.depositFee, "sats");
```

## API Reference

### Core Methods

#### `generateAddress(params)`

Generate a deposit address for cross-chain transfers.

```typescript
const response = await sdk.generateAddress({
  src_chain: "bitcoin", // Source chain
  dst_chain: "ethereum", // Destination chain
  asset: "btc", // Asset to transfer
  dst_addr: "0x...", // Destination address
});
```

#### `generateAddressWithVerification(params)`

Generate an address and verify its signatures against guardian nodes.

```typescript
const response = await sdk.generateAddressWithVerification({
  src_chain: "bitcoin",
  dst_chain: "ethereum",
  asset: "btc",
  dst_addr: "0x...",
});

console.log("Verification success:", response.data.verification.success);
```

#### `getOperations(address)`

Get all operations for a specific address.

```typescript
const operations = await sdk.getOperations("bc1q...");
console.log("Operations:", operations.data.operations);
```

#### `estimateFees()`

Get current fee estimates for all supported networks.

```typescript
const fees = await sdk.estimateFees();
console.log("Bitcoin fees:", fees.data.bitcoin);
console.log("Ethereum fees:", fees.data.ethereum);
console.log("Solana fees:", fees.data.solana);
```

#### `getWithdrawalQueue()`

Get withdrawal queue information for Bitcoin and Ethereum.

```typescript
const queue = await sdk.getWithdrawalQueue();
console.log("Queue info:", queue.data);
```

### Supported Chains and Assets

**Chains:**

- `bitcoin` - Bitcoin network
- `ethereum` - Ethereum network
- `solana` - Solana network
- `hyperliquid` - HyperLiquid network

**Assets:**

- `btc` - Bitcoin
- `eth` - Ethereum
- `sol` - Solana
- `fart`, `pump`, `bonk`, `spx` - Various tokens

### Configuration

```typescript
const config = {
  environment: "mainnet" | "testnet",
  timeout: number, // Request timeout in milliseconds
};
```

## Examples

Check out the `examples/` directory for complete usage examples:

- `estimate-fees-example.ts` - How to fetch and display fee estimates
- `withdrawal-queue-example.ts` - How to check withdrawal queue status

## Error Handling

The SDK throws `HyperUnitError` for API errors:

```typescript
try {
  const response = await sdk.generateAddress(params);
} catch (error) {
  if (error instanceof HyperUnitError) {
    console.error("API Error:", error.message);
  }
}
```

## Development

```bash
# Install dependencies
pnpm install

# Run tests
pnpm test

# Build the project
pnpm build

# Watch mode for development
pnpm dev
```

## License

ISC

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request
