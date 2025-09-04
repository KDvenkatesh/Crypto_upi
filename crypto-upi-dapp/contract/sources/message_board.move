module message_board_addr::crypto_upi {
    use std::string::String;
    use std::signer;
    use std::vector;
    use aptos_framework::coin::{Self, Coin};
    use aptos_framework::account;
    use aptos_framework::timestamp;

    /// A struct to hold a user's payment history.
    struct PaymentHistory has key {
        payments: vector<Payment>,
    }

    /// A placeholder struct for supported stablecoins.
    struct SupportedCoin has copy, drop, store, key {
        symbol: String,
        coin_type: u8, // 0 = USDT, 1 = USDC
    }

    /// A struct to store merchant information.
    struct Merchant has key {
        owner: address,
        qr_code: String,
        cashback_percent: u8,
    }

    /// A struct to represent a single payment record.
    struct Payment has store {
        payer: address,
        merchant: address,
        amount: u64,
        coin_type: u8,
        split_with: vector<address>,
        cashback: u64,
        timestamp: u64,
    }

    /// Registers a new merchant with a QR code and cashback percentage.
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

    /// Handles a payment to a merchant, supporting split bills and cashback.
    public entry fun pay_merchant(
        sender: &signer,
        merchant_addr: address,
        amount: u64,
        coin_type: u8, // 0 = USDT, 1 = USDC
        split_with: vector<address>
    ) acquires Merchant, PaymentHistory {
        assert!(exists<Merchant>(merchant_addr), 2);
        let payer_addr = signer::address_of(sender);
        let merchant = borrow_global<Merchant>(merchant_addr);

        let split_count = vector::length(&split_with) + 1;
        let split_amount = amount / split_count;

        let cashback = (split_amount * (merchant.cashback_percent as u64)) / 100;
        let now = timestamp::now_seconds(); 

        let payment = Payment {
            payer: payer_addr,
            merchant: merchant_addr,
            amount: split_amount,
            coin_type,
            split_with,
            cashback,
            timestamp: now,
        };

        if (!exists<PaymentHistory>(payer_addr)) {
            move_to(sender, PaymentHistory { payments: vector::empty<Payment>() });
        };
        vector::push_back(&mut borrow_global_mut<PaymentHistory>(payer_addr).payments, payment);

        let i = 0;
        while (i < vector::length(&split_with)) {
            let addr = *vector::borrow(&split_with, i);
            let payment_partner = Payment {
                payer: addr,
                merchant: merchant_addr,
                amount: split_amount,
                coin_type,
                split_with: vector::empty<address>(),
                cashback,
                timestamp: now,
            };

            if (!exists<PaymentHistory>(addr)) {
                account::create_account(addr);
                // 👇 FIXED: publish PaymentHistory under the new account
                move_to(&account::create_signer_for_testing(addr), PaymentHistory { payments: vector::empty<Payment>() });
            };
            vector::push_back(&mut borrow_global_mut<PaymentHistory>(addr).payments, payment_partner);

            i = i + 1;
        }
    }

    /// Views a user's payment history.
    #[view]
    public fun get_payment_history(addr: address): vector<Payment> acquires PaymentHistory {
        if (exists<PaymentHistory>(addr)) {
            let h = borrow_global<PaymentHistory>(addr);
            h.payments
        } else {
            vector::empty<Payment>()
        }
    }

    /// Views a merchant's information.
    #[view]
    public fun get_merchant(addr: address): (String, u8) acquires Merchant {
        let m = borrow_global<Merchant>(addr);
        (m.qr_code, m.cashback_percent)
    }
}

