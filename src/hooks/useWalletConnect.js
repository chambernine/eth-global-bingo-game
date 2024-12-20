import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth";

export const useWalletConnect = ({ onConnect, onDisconnect }) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const { loginWithBitkubNext, logout } = useAuth();

  const connectWallet = async (walletType) => {
    try {
      setIsConnecting(true);
      let accounts;

      if (walletType === "bitkubNext") {
        await loginWithBitkubNext();
        // await logout();
      } else if (walletType === "metamask") {
      }

      if (!accounts || accounts.length === 0) {
        throw new Error("No accounts found");
      }

      return { success: true, data: walletData };
    } catch (error) {
      return { success: false, error };
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = async () => {
    await logout();
    onDisconnect?.();
  };

  return {
    isConnecting,
    connectWallet,
    disconnectWallet,
  };
};
