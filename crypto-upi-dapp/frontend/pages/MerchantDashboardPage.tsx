import React from "react";
import { MerchantDashboard } from "../components/MerchantDashboard";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { WalletSelector } from "../components/WalletSelector";

export const MerchantDashboardPage: React.FC = () => {
  const { connected } = useWallet();
  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-blue-50 to-purple-100">
      <div className="w-full max-w-xl mt-8">
        {connected ? (
          <MerchantDashboard />
        ) : (
          <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center">
            <h2 className="text-2xl font-bold mb-4 text-purple-700">
              Connect your Petra Wallet
            </h2>
            <WalletSelector />
          </div>
        )}
      </div>
    </div>
  );
};
