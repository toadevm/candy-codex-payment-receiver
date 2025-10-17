export const PAYMENT_RECEIVER_ABI = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "paymentId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "payer",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
    ],
    name: "PaymentReceived",
    type: "event",
  },
  {
    inputs: [],
    name: "emergencyWithdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getBalance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "paymentId",
        type: "uint256",
      },
    ],
    name: "getPayment",
    outputs: [
      {
        internalType: "address",
        name: "payer",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "count",
        type: "uint256",
      },
    ],
    name: "getRecentPayments",
    outputs: [
      {
        internalType: "uint256[]",
        name: "paymentIds",
        type: "uint256[]",
      },
      {
        internalType: "address[]",
        name: "payers",
        type: "address[]",
      },
      {
        internalType: "uint256[]",
        name: "amounts",
        type: "uint256[]",
      },
      {
        internalType: "uint256[]",
        name: "timestamps",
        type: "uint256[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "payments",
    outputs: [
      {
        internalType: "address",
        name: "payer",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalPayments",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    stateMutability: "payable",
    type: "receive",
  },
] as const;

// Multichain contract addresses
export const PAYMENT_RECEIVER_ADDRESSES = {
  1: "0x4704eaf9d285a1388c0370bc7d05334d313f92be" as `0x${string}`, // Ethereum
  324: "0x405792CbED87Fbb34afA505F768C8eDF8f9504E9" as `0x${string}`, // zkSync
  10: "0x405792cbed87fbb34afa505f768c8edf8f9504e9" as `0x${string}`, // Optimism
  42161: "0x405792cbed87fbb34afa505f768c8edf8f9504e9" as `0x${string}`, // Arbitrum
  80094: "0x405792cbed87fbb34afa505f768c8edf8f9504e9" as `0x${string}`, // Berachain
  59144: "0x405792cbed87fbb34afa505f768c8edf8f9504e9" as `0x${string}`, // Linea
  2020: "0x405792CbED87Fbb34afA505F768C8eDF8f9504E9" as `0x${string}`, // Ronin
  43114: "0x405792cbed87fbb34afa505f768c8edf8f9504e9" as `0x${string}`, // Avalanche
  8453: "0x405792cbed87fbb34afa505f768c8edf8f9504e9" as `0x${string}`, // Base
  33139: "0x405792cbed87fbb34afa505f768c8edf8f9504e9" as `0x${string}`, // ApeChain
  1329: "0x405792CbED87Fbb34afA505F768C8eDF8f9504E9" as `0x${string}`, // Sei
  2741: "0x405792cbed87fbb34afa505f768c8edf8f9504e9" as `0x${string}`, // Abstract
  56: "0x405792cbed87fbb34afa505f768c8edf8f9504e9" as `0x${string}`, // BSC
  25: "0x405792CbED87Fbb34afA505F768C8eDF8f9504E9" as `0x${string}`, // Cronos
  1284: "0x405792cbed87fbb34afa505f768c8edf8f9504e9" as `0x${string}`, // Moonbeam
} as const;

// Network names mapping
export const NETWORK_NAMES = {
  1: "Ethereum",
  324: "zkSync Era",
  10: "Optimism",
  42161: "Arbitrum One",
  80094: "Berachain",
  59144: "Linea",
  2020: "Ronin",
  43114: "Avalanche",
  8453: "Base",
  33139: "ApeChain",
  1329: "Sei",
  2741: "Abstract",
  56: "BNB Chain",
  25: "Cronos",
  1284: "Moonbeam",
} as const;

export type SupportedChainId = keyof typeof PAYMENT_RECEIVER_ADDRESSES;
