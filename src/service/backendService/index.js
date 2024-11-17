import axios from "axios";

const backendService = () => {
  const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_URL || "",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const getCurrentGameState = async () => {
    try {
      const res = await api.get(`/api/game/state/bitkub`);
      return res.data;
    } catch (error) {
      console.log(error);
    }
  };

  const getPlayerCards = async (address) => {
    try {
      const res = await api.post(`/api/card/get/bitkub`, {
        walletAddress: address,
      });

      return res.data;
    } catch (error) {
      console.log(error);
    }
  };

  const purchaseCards = async (address) => {
    try {
      const res = await api.post(`/api/card/purchase/bitkub`, {
        walletAddress: address,
      });

      return res.data;
    } catch (error) {
      console.log(error);
    }
  };
  const challengeWin = async (address) => {
    try {
      const res = await api.post(`/api/card/challenge/bitkub`, {
        walletAddress: address,
      });

      return res.data;
    } catch (error) {
      console.log(error);
    }
  };

  return {
    getCurrentGameState,
    getPlayerCards,
    purchaseCards,
    challengeWin,
  };
};

export default backendService;
