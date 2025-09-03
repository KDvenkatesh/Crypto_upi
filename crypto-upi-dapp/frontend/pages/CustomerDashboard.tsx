import React from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { WalletSelector } from "../components/WalletSelector";
import { ScanPay } from "../components/ScanPay";
// ...existing code...

export const CustomerDashboard: React.FC = () => {
  const { connected } = useWallet();
  if (!connected) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-purple-100">
        <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center">
          <h2 className="text-2xl font-bold mb-4 text-blue-700">Connect your Petra Wallet</h2>
          <WalletSelector />
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-blue-50 to-purple-100">
      <div className="w-full max-w-xl mt-8">
        <ScanPay />
      </div>
    </div>
  );
}
