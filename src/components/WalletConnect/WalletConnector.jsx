import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { X } from 'lucide-react';
import { useToast } from "@/hooks/use-toast"
import { useWalletConnect } from '../../hooks/useWalletConnect';
import { AnimatedModal } from '../ui/AnimatedModal';
import { WalletOption } from './WalletOption';
import { WalletInfo } from './WalletInfo';
import { useAuth } from '@/contexts/auth';

const WalletConnector = ({ onConnect, onDisconnect }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();
  const { isLoggedIn, userInfo } = useAuth();

  const {
    isConnecting,
    connectWallet,
    disconnectWallet,
  } = useWalletConnect({
    onConnect,
    onDisconnect,
  });

  const handleConnectWallet = async (walletType) => {
    const result = await connectWallet(walletType);
    
    if (result.success) {
      toast({
        title: "Wallet Connected",
        description: `Connected to ${result.data.address.slice(0, 6)}...${result.data.address.slice(-4)}`,
      });
      setIsModalOpen(false);
    } else {
      toast({
        title: "Connection Error",
        description: result.error.message,
        variant: "destructive",
      });
    }
  };

  const handleDisconnect = () => {
    disconnectWallet();
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected",
    });
  };


  useEffect(() => {
    if (isLoggedIn) {
      setIsModalOpen(false);
    }
  } , [isLoggedIn]);


  return (
    <>
      {isLoggedIn ? (
        <div className="space-y-4">
          <WalletInfo 
            address={userInfo.walletAddress}
          />
          <Button
            onClick={handleDisconnect}
            className="w-full bg-red-500 hover:bg-red-600"
          >
            Disconnect Wallet
          </Button>
        </div>
      ) : (
        <Button
          onClick={() => setIsModalOpen(true)}
          className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
          disabled={isConnecting}
        >
          {isConnecting ? 'Connecting...' : 'Connect Wallet'}
        </Button>
      )}

      <AnimatedModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <Card className="w-full max-w-md bg-gray-900 border-gray-700">
          <CardHeader className="relative">
            <Button
              variant="ghost"
              className="absolute right-2 top-2 text-gray-400 hover:text-white"
              onClick={() => setIsModalOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
            <CardTitle className="text-xl font-bold text-white">
              Connect Wallet
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <WalletOption
              name="Bitkub Next"
              icon="🦁"
              onClick={() => handleConnectWallet('bitkubNext')}
            />
            {/* <WalletOption
              name="MetaMask"
              icon="🦊"
              onClick={() => handleConnectWallet('metamask')}
              disabled={!window?.ethereum}
            /> */}
          </CardContent>
          <CardFooter className="text-sm text-gray-400 text-center">
            By connecting your wallet, you agree to our Terms of Service and Privacy Policy
          </CardFooter>
        </Card>
      </AnimatedModal>
    </>
  );
};

export default WalletConnector;