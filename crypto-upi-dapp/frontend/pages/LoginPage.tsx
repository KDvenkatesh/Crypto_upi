import React from "react";
import { useNavigate } from "react-router-dom";

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200 animate-fadein">
      <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-md flex flex-col items-center transition-all duration-300">
        <img src="/aptos.png" alt="Crypto-UPI Logo" className="w-16 h-16 mb-4 animate-bounce" />
        <h1 className="text-4xl font-extrabold mb-2 text-purple-700 tracking-tight">Crypto-UPI</h1>
        <p className="mb-6 text-lg text-gray-700 text-center font-medium">Scan, Pay, Anywhere.<br />A UPI-like experience for crypto payments.</p>
        <div className="w-full flex flex-col gap-4 mt-2">
          <button
            className="w-full bg-blue-500 text-white py-3 rounded-xl text-lg font-semibold shadow hover:bg-blue-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
            onClick={() => navigate("/customer")}
            aria-label="Login as Customer"
          >
            <span className="inline-flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5.121 17.804A9.001 9.001 0 0112 3a9.001 9.001 0 016.879 14.804M12 3v9m0 0l3-3m-3 3l-3-3" /></svg>
              Customer Login
            </span>
          </button>
          <button
            className="w-full bg-purple-500 text-white py-3 rounded-xl text-lg font-semibold shadow hover:bg-purple-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-300"
            onClick={() => navigate("/merchant")}
            aria-label="Login as Shop Owner"
          >
            <span className="inline-flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 7v4a1 1 0 001 1h16a1 1 0 001-1V7M5 21h14a2 2 0 002-2v-7H3v7a2 2 0 002 2z" /></svg>
              Shop Owner Login
            </span>
          </button>
        </div>
      </div>
      <style>{`.animate-fadein { animation: fadein 0.7s; } @keyframes fadein { from { opacity: 0; transform: translateY(20px);} to { opacity: 1; transform: none;} }`}</style>
    </div>
  );
}
