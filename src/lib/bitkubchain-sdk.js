import { initializeSDK, Network } from "@bitkub-chain/sdk.js";

export const sdk = initializeSDK(
  "67375ebb5f02f9001be0e54c", // Client ID
  "sdk-ce6da392-8450-489e-a65d-fb63f6a8169b", // Project ID
  Network.BKC_TESTNET
);
