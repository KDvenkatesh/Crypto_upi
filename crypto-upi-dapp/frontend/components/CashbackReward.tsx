import React from "react";
import { Card, CardTitle } from "@/components/ui/card";

export const CashbackReward: React.FC = () => {
  // Demo: show fixed cashback
  return (
    <Card className="p-4">
      <CardTitle className="text-xl mb-2 text-green-700">Cashback Reward</CardTitle>
      <div className="text-lg font-semibold text-green-600">You earned ₹5 cashback!</div>
      <div className="text-sm text-gray-500 mt-1">Cashback will be auto-credited to your wallet after payment.</div>
    </Card>
  );
}
