import { sdk } from "@/lib/bitkubchain-sdk";

const KKUB_ADDRESS = "0x1BbE34CF9fd2E0669deEE34c68282ec1e6c44ab0";

const bkcService = () => {
  const contractAddress = "0x1E7636c1951135eDA266F89D9b3283D4806C9063";

  //   const getCurrentGameState = () => {
  //     return sdk.getGetCurrentGameState();
  //   };
  const getCurrentGameState = () => {
    const functionReadableABI =
      "function getCurrentGameState() external view returns (uint256 startTime, uint256 lastDrawTime, uint256 numberCount, uint256[] drawnNumbers, bool isEnded, uint256 playerCount, bool isStarted)";
    return sdk.sendCustomTx(contractAddress, functionReadableABI, []);
  };

  const getCurrentPlayerCount = () => {};
  const getRemainingPlayerCount = () => {};
  const purchaseCard = () => {
    const functionReadableABI =
      "purchaseCard(address _bitkubNext) returns (uint8[25] numbers)";
    return sdk.sendCustomTx(contractAddress, functionReadableABI, []);
  };
  //   const purchaseCard = () => {
  //     const functionReadableABI =
  //       "transfer(address _tokenAddr, address _recipient, uint256 _amount, address _bitkubNext)";
  //     return sdk.sendCustomTx(contractAddress, functionReadableABI, [
  //       "0x1BbE34CF9fd2E0669deEE34c68282ec1e6c44ab0",
  //       "0xAe0C6AAA49B780828401bC09EcD8c4B189D13f42",
  //       "1000000000000000000",
  //     ]);
  //   };
  const getPlayerCards = () => {
    const functionReadableABI =
      "function getPlayerCards() external view returns (uint8[25] storedNumbers)";
    return sdk.sendCustomTx(contractAddress, functionReadableABI, []);
  };

  return {
    getCurrentGameState,
    getPlayerCards,
    purchaseCard,
  };
};

export default bkcService;
