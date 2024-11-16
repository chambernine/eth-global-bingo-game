export const WalletInfo = ({ address, chainName }) => (
  <div className="space-y-4">
    <div className="text-center text-gray-300">
      <p className="text-sm font-mono">{`${address.slice(0, 6)}...${address.slice(-4)}`}</p>
    </div>
  </div>
); 