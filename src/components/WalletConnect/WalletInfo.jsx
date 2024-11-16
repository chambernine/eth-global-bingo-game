import Image from "next/image";

export const WalletInfo = ({ address, chainName }) => (
  <div className="space-y-4">
    <div className="flex gap-4 text-center text-gray-300">
    <Image
      src="/img/bkc.png"
      width={26}
      height={18}
      alt="Chain icon"
    />
      <p className="text-sm font-mono">{`${address.slice(0, 6)}...${address.slice(-4)}`}</p>
    </div>
  </div>
); 