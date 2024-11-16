import { ethers } from "ethers";
import { CONTRACT_ABI } from "./contract-abi";

const CONTRACT_ADDRESS = "0x99953906b37F69208eF8EB41Eb5DDb0436Bf5896";

class BlockchainService {
  constructor() {
    // if (typeof window !== "undefined" && window.ethereum) {
    //   this.provider = new ethers.BrowserProvider(window.ethereum);
    this.initializeContract();
    // }
  }

  async initializeContract() {
    try {
      const signer = await this.provider.getSigner();
      this.contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        CONTRACT_ABI,
        signer
      );
    } catch (error) {
      console.error("Failed to initialize contract:", error);
    }
  }

  // this is function to know game state
  async getCurrentGameState() {
    try {
      const gameState = await this.contract.getCurrentGameState();
      return {
        startTime: new Date(gameState.startTime * 1000),
        lastDrawTime: new Date(gameState.lastDrawTime * 1000),
        numberCount: gameState.numberCount.toString(),
        drawnNumbers: gameState.drawnNumbers.map((n) => n.toString()),
        isEnded: gameState.isEnded,
        playerCount: gameState.playerCount.toString(),
        isStarted: gameState.isStarted,
      };
    } catch (error) {
      console.error("Error getting game state:", error);
      throw error;
    }
  }

  //this is function to know current player in game
  async getCurrentPlayerCount() {
    try {
      const count = await this.contract.getCurrentPlayerCount();
      return count.toString();
    } catch (error) {
      console.error("Error getting player count:", error);
      throw error;
    }
  }

  //this is function to know remaining player for start game
  async getRemainingPlayerCount() {
    try {
      const count = await this.contract.getRemainingPlayerCount();
      return count.toString();
    } catch (error) {
      console.error("Error getting remaining player count:", error);
      throw error;
    }
  }

  // function getCard
  async purchaseCard() {
    try {
      const tx = await this.contract.purchaseCard();
      const receipt = await tx.wait();

      // Get the player's card numbers after purchase
      const numbers = await this.getPlayerCards();

      return {
        numbers: numbers,
        transactionHash: receipt.hash,
      };
    } catch (error) {
      console.error("Error purchasing card:", error);
      throw error;
    }
  }

  //get card player
  async getPlayerCards() {
    try {
      const numbers = await this.contract.getPlayerCards();
      return Array.from(numbers).map((n) => n.toString());
    } catch (error) {
      console.error("Error getting player cards:", error);
      throw error;
    }
  }

  //Challenge function
  async claimWin() {
    try {
      const tx = await this.contract.claimWin();
      const receipt = await tx.wait();
      return receipt.hash;
    } catch (error) {
      console.error("Error claiming win:", error);
      throw error;
    }
  }

  // Get Call number
  async getDrawnNumbers() {
    try {
      const numbers = await this.contract.getDrawnNumbers();
      return numbers.map((n) => n.toString());
    } catch (error) {
      console.error("Error getting drawn numbers:", error);
      throw error;
    }
  }

  //check if player is in game
  async isInGame() {
    try {
      return await this.contract.isInGame();
    } catch (error) {
      console.error("Error checking game status:", error);
      throw error;
    }
  }
}

export const blockchainService = new BlockchainService();
