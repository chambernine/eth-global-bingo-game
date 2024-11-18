import { initializeSDK, Network } from "@bitkub-chain/sdk.js";

export const sdk = initializeSDK(
  process.env.NEXT_BKC_ID, // Client ID
  process.env.NEXT__BKC_PROJECT_ID, // Project ID
  Network.BKC_TESTNET
);
