import React, { useState } from "react";
import { Card, CardTitle } from "./ui/card";
import { QrReader } from "react-qr-reader";
import { aptosClient } from "../utils/aptosClient";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { MODULE_ADDRESS } from "../constants";

export const ScanPay: React.FC = () => {
  // Petra wallet integration
  const [scannedQR, setScannedQR] = useState("");
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState("");
  const [showScanner, setShowScanner] = useState(false);
  const [petraAddress, setPetraAddress] = useState<string>("");
  const walletConnected = !!petraAddress;

  // Connect to Petra wallet
  const connectWallet = async () => {
    if (window.petra) {
      try {
        const response = await window.petra.connect();
        setPetraAddress(response.address);
        setStatus("Wallet connected: " + response.address);
      } catch (err) {
        setStatus("Wallet connection failed: " + String(err));
      }
    } else {
      setStatus("Petra wallet extension not found. Please install Petra wallet.");
      window.open("https://petra.app/", "_blank");
    }
  };

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
    if (!window.petra || !petraAddress) {
      setStatus("Petra wallet not connected. Please connect your wallet first.");
      return;
    }
    setStatus("Processing payment...");
    try {
      if (!MODULE_ADDRESS) {
        setStatus("Error: MODULE_ADDRESS is undefined. Please check your .env and restart the frontend server.");
        return;
      }
      const merchantAddr = scannedQR.trim();
      if (!merchantAddr || !merchantAddr.startsWith("0x") || merchantAddr.length < 10) {
        setStatus("Invalid merchant address scanned. Please try again.");
        return;
      }
      const amountOctas = Math.floor(Number(amount) * 1e8);
      const tx = {
        type: "entry_function_payload",
        function: `${MODULE_ADDRESS}::crypto_upi::pay_merchant`,
        type_arguments: [],
        arguments: [
          merchantAddr,
          amountOctas,
          0,
          []
        ],
        max_gas_amount: 200000, // Changed to number
        gas_unit_price: 1 // Changed to number
      };
      console.log("Transaction payload:", JSON.stringify(tx, null, 2));
      let response;
      try {
        response = await window.petra.signAndSubmitTransaction(tx);
      } catch (err) {
        setStatus('Wallet transaction error: ' + String(err));
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
          <span className={walletConnected ? "text-green-700" : "text-red-700"}>{walletConnected ? `Wallet connected: ${petraAddress}` : "Wallet not connected"}</span>
          {!walletConnected && (
            <button className="ml-2 bg-blue-500 text-white px-2 py-1 rounded" onClick={connectWallet}>
              Connect Petra Wallet
            </button>
          )}
          {walletConnected && (
            <button className="ml-2 bg-red-500 text-white px-2 py-1 rounded" onClick={() => { setPetraAddress(""); setStatus("Wallet disconnected."); }}>
              Disconnect Wallet
            </button>
          )}
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
              placeholder="Enter amount in APT"
              value={amount}
              min="0.000001"
              step="0.000001"
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