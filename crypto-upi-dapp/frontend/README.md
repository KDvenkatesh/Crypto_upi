# Crypto-UPI: Scan, Pay, Anywhere

A decentralized payments DApp inspired by UPI, powered by Aptos blockchain and stablecoins (USDT/USDC).

## Features
- **Scan & Pay**: Instantly pay merchants by scanning their QR code.
- **Stablecoins**: Pay in USDT/USDC, 1 USDT ≈ ₹83.
- **Split Bill**: Split payments with friends.
- **Cashback Rewards**: Earn cashback on every transaction.
- **Merchant Dashboard**: Generate QR, view payments, set cashback.
- **Cross-border Support**: Works globally, no middlemen.

## Demo Flow
1. Merchant registers and generates QR code.
2. Customer scans QR, enters amount, selects stablecoin, and pays.
3. Smart contract transfers stablecoins to merchant wallet.
4. Transaction confirmation and cashback shown in app.
5. (Optional) Split bill and auto-issue cashback tokens.

## Tech Stack
- **Frontend**: React + Tailwind (PhonePe/Paytm style UI)
- **Blockchain**: Aptos (Move smart contracts)
- **Wallets**: Petra Wallet integration
- **Smart Contracts**: Handles payments, split, cashback
- **Demo Token**: USDT (testnet)

## How to Run
1. Install dependencies: `npm install`
2. Start frontend: `npm run dev`
3. Compile & publish Move contract: `npm run move:compile` & `npm run move:publish`
4. Connect Petra Wallet and test Scan & Pay, Split Bill, Cashback

## Future Scope
- INR off-ramp API (auto-deposit to PhonePe/Bank)
- Loyalty tokens, offline payments, merchant analytics

## Tagline
**Crypto-UPI: Scan, Pay, Anywhere.**
