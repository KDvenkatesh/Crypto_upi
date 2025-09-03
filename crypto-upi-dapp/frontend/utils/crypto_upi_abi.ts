export const CRYPTO_UPI_ABI = {
  address: "process.env.VITE_MODULE_ADDRESS", // update with deployed address
  name: "crypto_upi",
  exposed_functions: [
    {
      name: "register_merchant",
      visibility: "public",
      is_entry: true,
      params: ["&signer", "string", "u8"],
      return: [],
    },
    {
      name: "pay_merchant",
      visibility: "public",
      is_entry: true,
      params: ["&signer", "address", "u64", "u8", "vector<address>"],
      return: [],
    },
    {
      name: "get_merchant",
      visibility: "public",
      is_entry: false,
      is_view: true,
      params: ["address"],
      return: ["string", "u8"],
    },
    {
      name: "get_payment",
      visibility: "public",
      is_entry: false,
      is_view: true,
      params: ["address"],
      return: ["address", "address", "u64", "u8", "vector<address>", "u64", "u64"],
    },
  ],
  structs: [
    {
      name: "Merchant",
      abilities: ["key"],
      fields: [
        { name: "owner", type: "address" },
        { name: "qr_code", type: "string" },
        { name: "cashback_percent", type: "u8" },
      ],
    },
    {
      name: "Payment",
      abilities: ["key"],
      fields: [
        { name: "payer", type: "address" },
        { name: "merchant", type: "address" },
        { name: "amount", type: "u64" },
        { name: "coin_type", type: "u8" },
        { name: "split_with", type: "vector<address>" },
        { name: "cashback", type: "u64" },
        { name: "timestamp", type: "u64" },
      ],
    },
  ],
} as const;
