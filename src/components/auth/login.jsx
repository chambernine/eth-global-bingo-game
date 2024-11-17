"use client";
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import WalletConnector from '@/components/WalletConnect/WalletConnector';
import { useToast } from "@/hooks/use-toast"
import { useAuth } from '@/contexts/auth';
import BingoGame from '../bingo-game/page';
import Image from 'next/image';


export default function LoginPage() {
  const { toast } = useToast();
  const { isLoggedIn } = useAuth(); //is login kub use component game kub another use another

  const handleConnect = (walletData) => {
    console.log('Wallet connected:', walletData);
    toast({
      title: "Welcome to Bingo Game!",
      description: "Your wallet has been connected successfully.",
    });
  };

  const handleDisconnect = () => {
    console.log('Wallet disconnected');
    toast({
      title: "Wallet Disconnected",
      description: "Thanks for playing! See you soon.",
    });
  };
  

  return (
    <div className="min-h-screen flex items-start justify-center px-4 py-6 sm:px-4 lg:px-8 relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-tr from-dark-gray-1 to-dark-gray-2" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTYiIGhlaWdodD0iMTAwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iNTYiIGhlaWdodD0iMTAwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDU2IDAgTCAwIDAgMCAxMDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzk0YTNiOCIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-10" />
      </div>
      <div className='flex flex-col gap-4 w-full max-w-md'>
      {/* Main Card */}
      <Card className="w-full max-w-md z-10 bg-[#1a1a1a] rounded-[20px]">
        <CardHeader className="space-y-1 items-center gap-1">
        <Image
                  src="/img/game_club_icon.png"
                  width={40}
                  height={40}
                  alt="Chain icon"
                />
          <CardTitle className="text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
            Bingo Game
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-2">
         {!isLoggedIn&&  <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-600" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-gray-900 px-2 text-gray-400">Connect your wallet to play</span>
            </div>
          </div>}
          
          {/* Wallet Connector Component */}
          <div className={ isLoggedIn ?  '': 'mt-8'}>
            <WalletConnector 
            onConnect={handleConnect}
            onDisconnect={handleDisconnect}
          />
        </div>
        </CardContent>
      </Card>
      {isLoggedIn && <BingoGame/>}
      </div>
      {/* Footer */}
      <div className="absolute bottom-4 left-4 right-4 text-center text-gray-500 text-sm">
        &copy; 2024 Mini Games Club. All rights reserved.
      </div>
    </div>
  );
}