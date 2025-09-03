import React, { useState } from "react";
import { Card, CardTitle } from "./ui/card";
import QRCode from "react-qr-code";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { AccountInfo } from "./AccountInfo";

export const MerchantDashboard: React.FC = () => {
  const [cashback, setCashback] = useState(5);
  const [payments, setPayments] = useState([
    { payer: "user1", amount: 100, coin: "USDT", cashback: 5 },
    { payer: "user2", amount: 200, coin: "USDC", cashback: 10 },
  ]);
  const { account } = useWallet();
  const merchantAddress = account?.address?.toStringLong() ?? "";

  return (
    <Card className="p-4">
      <CardTitle className="text-xl mb-2 text-purple-700">Merchant Dashboard</CardTitle>
      <div className="flex flex-col gap-3">
        <div className="text-sm">Show this QR to customers:</div>
        <div className="flex justify-center my-2">
          {merchantAddress ? <QRCode value={merchantAddress} size={128} /> : <div className="text-red-500">No wallet connected</div>}
        </div>
        <div className="bg-gray-100 p-2 rounded text-center font-mono">{merchantAddress || "No address found"}</div>
        <AccountInfo />
        <div className="text-sm mt-2">Cashback %: <input type="number" value={cashback} onChange={e => setCashback(Number(e.target.value))} className="border rounded px-2 py-1 w-16" /></div>
        <div className="mt-4">
          <div className="font-semibold mb-2">Recent Payments</div>
          <ul className="text-sm">
            {payments.map((p, i) => (
              <li key={i} className="mb-1">{p.payer} paid {p.amount} {p.coin} (Cashback: {p.cashback})</li>
            ))}
          </ul>
        </div>
      </div>
    </Card>
  );
}
