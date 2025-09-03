import React, { useState } from "react";
import { Card, CardTitle } from "@/components/ui/card";

export const SplitBill: React.FC = () => {
  const [friends, setFriends] = useState([""]);
  const [amount, setAmount] = useState("");
  const [coinType, setCoinType] = useState("USDT");
  const [status, setStatus] = useState("");

  const handleAddFriend = () => setFriends([...friends, ""]);
  const handleFriendChange = (i: number, val: string) => {
    const updated = [...friends];
    updated[i] = val;
    setFriends(updated);
  };
  const handleSplit = () => {
    setStatus("Split payment successful! Cashback credited.");
  };

  return (
    <Card className="p-4">
      <CardTitle className="text-xl mb-2 text-pink-700">Split Bill</CardTitle>
      <div className="flex flex-col gap-3">
        <input
          type="number"
          placeholder="Total Amount"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          className="border rounded px-2 py-1"
        />
        <select value={coinType} onChange={e => setCoinType(e.target.value)} className="border rounded px-2 py-1">
          <option value="USDT">USDT</option>
          <option value="USDC">USDC</option>
        </select>
        <div className="mt-2">
          <div className="font-semibold">Friends to split with:</div>
          {friends.map((f, i) => (
            <input
              key={i}
              type="text"
              placeholder="Friend wallet address"
              value={f}
              onChange={e => handleFriendChange(i, e.target.value)}
              className="border rounded px-2 py-1 mt-1 w-full"
            />
          ))}
          <button className="bg-blue-400 text-white px-2 py-1 rounded mt-2" onClick={handleAddFriend}>Add Friend</button>
        </div>
        <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={handleSplit}>
          Split & Pay
        </button>
        {status && <div className="text-green-600 mt-2">{status}</div>}
      </div>
    </Card>
  );
}
