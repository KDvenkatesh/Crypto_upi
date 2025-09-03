import React, { useState } from "react";
import { Card, CardTitle } from "./ui/card";
import { QrReader } from "react-qr-reader";
import { aptosClient } from "../utils/aptosClient";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { MODULE_ADDRESS } from "../constants";


export const ScanPay: React.FC = () => {
  const { account, signAndSubmitTransaction, wallet } = useWallet();
  // Wallet connection status
  const walletStatus = account ? `Wallet connected: ${account.address}` : "Wallet not connected";
  const connectWallet = () => {
    window.open("https://petra.app/", "_blank"); // Suggest Petra wallet for Aptos
  };
  const [scannedQR, setScannedQR] = useState("");
  const [amount, setAmount] = useState("0.001");
  const [status, setStatus] = useState("");
  const [showScanner, setShowScanner] = useState(false);
  const walletConnected = !!account && typeof signAndSubmitTransaction === "function";

  const handleScan = (result: any) => {
    if (result?.text) {
      setScannedQR(result.text);
      setShowScanner(false);
    }
  };

  const handleError = (error: any) => {
    setStatus("QR scan error: " + error?.message);
  };

  const handlePay = async () => {
    if (!walletConnected || typeof signAndSubmitTransaction !== "function") {
      setStatus("Wallet is not connected or transaction function is unavailable. Please reconnect your wallet or try a different wallet extension.");
      return;
    }
    setStatus("Processing payment...");
    try {
      // Debug: print MODULE_ADDRESS
      console.log("MODULE_ADDRESS:", MODULE_ADDRESS);
      if (!MODULE_ADDRESS) {
        setStatus("Error: MODULE_ADDRESS is undefined. Please check your .env and restart the frontend server.");
        return;
      }
      // Validate merchant address
      const merchantAddr = scannedQR.trim();
      if (!merchantAddr || !merchantAddr.startsWith("0x") || merchantAddr.length < 10) {
        setStatus("Invalid merchant address scanned. Please try again.");
        return;
      }
      // Only support minimum APT payment for hackathon
      // Convert amount to octas (1 APT = 100,000,000 octas)
      const amountOctas = Math.floor(Number(amount) * 1e8);
      const tx = {
        type: "entry_function_payload",
        function: `${MODULE_ADDRESS}::crypto_upi::pay_merchant`,
        type_arguments: [],
        arguments: [
          merchantAddr ?? "",
          amountOctas,
          0, // coinType fixed to 0
          []
        ],
      };
      console.log("Transaction payload:", JSON.stringify(tx, null, 2));
      if (!tx.type || !tx.function || !Array.isArray(tx.type_arguments) || !Array.isArray(tx.arguments)) {
        setStatus("Transaction payload is invalid. Please check all fields and try again.");
        return;
      }
      let response;
      try {
        response = await signAndSubmitTransaction(tx as any);
      } catch (err) {
        console.error('Wallet transaction error:', err);
        setStatus('Wallet transaction error: ' + (err && typeof err === 'object' && 'message' in err ? (err as any).message : String(err)));
        return;
      }
      if (response?.hash) {
        setStatus("Payment successful! Cashback credited. Tx: " + response.hash);
      } else {
        setStatus("Payment submitted, check wallet for status.");
      }
    } catch (err: any) {
      setStatus("Payment failed: " + err?.message);
    }
  };

  return (
    <Card className="p-4">
      <CardTitle className="text-xl mb-2 text-blue-700">Scan & Pay</CardTitle>
      <div className="flex flex-col gap-3">
        <div className="text-sm mb-2">
          <span className={account ? "text-green-700" : "text-red-700"}>{walletStatus}</span>
          {!account && (
            <button className="ml-2 bg-blue-500 text-white px-2 py-1 rounded" onClick={connectWallet}>
              Install Petra Wallet
            </button>
          )}
          <div className="mt-2 p-2 bg-gray-100 rounded text-xs">
            <div><strong>Wallet name:</strong> {wallet?.name ?? "N/A"}</div>
            <div><strong>Wallet type:</strong> {wallet?.type ?? "N/A"}</div>
            <div><strong>Account address:</strong> {account?.address?.toStringLong() ?? "N/A"}</div>
            <div><strong>signAndSubmitTransaction type:</strong> {typeof signAndSubmitTransaction}</div>
            <div><strong>signAndSubmitTransaction available:</strong> {signAndSubmitTransaction ? "Yes" : "No"}</div>
          </div>
        </div>
        {!scannedQR && !showScanner && (
          <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={() => setShowScanner(true)}>
            Scan Merchant QR
          </button>
        )}
        {showScanner && (
          <div className="mb-2">
            <QrReader
              constraints={{ facingMode: "environment" }}
              onResult={handleScan}
              onError={handleError}
              style={{ width: "100%" }}
            />
            <button className="mt-2 text-sm text-gray-600 underline" onClick={() => setShowScanner(false)}>
              Cancel
            </button>
          </div>
        )}
        {scannedQR && (
          <>
            <div className="text-sm text-gray-600">Merchant: {scannedQR}</div>
            <input
              type="number"
              placeholder="Amount (default: 0.001 APT)"
              value={amount}
              min="0.001"
              step="0.001"
              onChange={e => setAmount(e.target.value)}
              className="border rounded px-2 py-1"
            />
            <button
              className="bg-green-500 text-white px-4 py-2 rounded"
              onClick={handlePay}
              disabled={!walletConnected}
            >
              {walletConnected ? "Pay" : "Connect Wallet to Pay"}
            </button>
            {status && <div className={status.startsWith("Error:") ? "text-red-600 mt-2" : "text-green-600 mt-2"}>{status}</div>}
          </>
        )}
      </div>
    </Card>
  );
}
