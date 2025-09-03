
module message_board_addr::crypto_upi {
    use std::string::String;
    use std::signer;
    use std::vector;
    use aptos_framework::coin::{Self, Coin};
    use aptos_framework::account;

    /// Supported stablecoins (demo: USDT, USDC)
    struct SupportedCoin has copy, drop, store, key {
        symbol: String,
        coin_type: u8, // 0 = USDT, 1 = USDC
    }

    /// Merchant info
    struct Merchant has key {
        owner: address,
        qr_code: String,
        cashback_percent: u8, // e.g. 5 = 5%
    }

    /// Payment record
    struct Payment has key {
        payer: address,
        merchant: address,
        amount: u64,
        coin_type: u8,
        split_with: vector<address>,
        cashback: u64,
        timestamp: u64,
    }

    /// Register merchant with QR code and cashback
    public entry fun register_merchant(
        sender: &signer,
        qr_code: String,
        cashback_percent: u8
    ) {
        let addr = signer::address_of(sender);
        assert!(!exists<Merchant>(addr), 1);
        move_to(sender, Merchant {
            owner: addr,
            qr_code,
            cashback_percent,
        });
    }

    /// Pay merchant (scan QR), supports split bill and cashback
    public entry fun pay_merchant(
        sender: &signer,
        merchant_addr: address,
        amount: u64,
        coin_type: u8, // 0 = USDT, 1 = USDC
        split_with: vector<address>
    ) acquires Merchant {
        assert!(exists<Merchant>(merchant_addr), 2);
        let payer_addr = signer::address_of(sender);
        let merchant = borrow_global<Merchant>(merchant_addr);
        let split_count = vector::length(&split_with) + 1;
        let split_amount = amount / split_count;

        // Transfer coins to merchant (demo: no actual coin transfer, just record)
        // In production, use Coin<T> and transfer from sender to merchant

        let cashback = (split_amount * (merchant.cashback_percent as u64)) / 100;

        // Record payment for each participant
        let now = 0; // Replace with blockchain timestamp if available
        move_to(sender, Payment {
            payer: payer_addr,
            merchant: merchant_addr,
            amount: split_amount,
            coin_type,
            split_with: split_with,
            cashback,
            timestamp: now,
        });
        let i = 0;
        while (i < vector::length(&split_with)) {
            let addr = *vector::borrow(&split_with, i);
            // In production, transfer from each addr to merchant
            i = i + 1;
        }
    }

    /// View merchant info
    #[view]
    public fun get_merchant(addr: address): (String, u8) acquires Merchant {
        let m = borrow_global<Merchant>(addr);
        (m.qr_code, m.cashback_percent)
    }

    /// View payment info
    #[view]
    public fun get_payment(addr: address): (address, address, u64, u8, vector<address>, u64, u64) acquires Payment {
        let p = borrow_global<Payment>(addr);
        (p.payer, p.merchant, p.amount, p.coin_type, p.split_with, p.cashback, p.timestamp)
    }
}
