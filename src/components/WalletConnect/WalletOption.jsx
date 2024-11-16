export const WalletOption = ({ name, icon, onClick, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className="flex items-center space-x-3 w-full p-4 rounded-lg transition-colors hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
  >
    <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
      {icon}
    </div>
    <div className="flex flex-col items-start">
      <span className="text-white font-medium">{name}</span>
      {disabled && <span className="text-xs text-gray-400">Not installed</span>}
    </div>
  </button>
); 