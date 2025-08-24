// Application constants
export const APP_CONFIG = {
  name: "ZKLeaks",
  description: "Secure, anonymous whistleblowing platform powered by Midnight blockchain and IPFS",
  version: "1.0.0",

  // File upload limits
  maxFileSize: 100, // MB
  maxFiles: 10,
  allowedFileTypes: [
    "image/*",
    "video/*",
    "audio/*",
    "application/pdf",
    "text/*",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ],

  // Form limits
  maxTitleLength: 200,
  maxMessageLength: 5000,
  minTitleLength: 3,
  minMessageLength: 10,

  // UI settings
  debounceDelay: 600, // ms for address analysis
  copyFeedbackDuration: 1600, // ms

  // External links
  ipfsGateway: "https://ipfs.io/ipfs/",

  // Donation quick amounts
  donationQuickAmounts: [5, 10, 25, 50],
} as const

// Error messages
export const ERROR_MESSAGES = {
  WALLET_NOT_FOUND: "Wallet not found. Please install or enable your wallet.",
  WALLET_CONNECTION_FAILED: "Failed to connect to wallet.",
  UPLOAD_FAILED: "Failed to upload files. Please try again.",
  TRANSACTION_FAILED: "Transaction failed. Please try again.",
  INVALID_ADDRESS: "Invalid Midnight address format.",
  INVALID_AMOUNT: "Please enter a valid amount.",
  FILE_TOO_LARGE: "File size exceeds the maximum limit.",
  TITLE_TOO_SHORT: "Title must be at least 3 characters long.",
  MESSAGE_TOO_SHORT: "Message must be at least 10 characters long.",
  NETWORK_ERROR: "Network error. Please check your connection.",
} as const

// Success messages
export const SUCCESS_MESSAGES = {
  WALLET_CONNECTED: "Wallet connected successfully!",
  UPLOAD_SUCCESS: "Files uploaded successfully!",
  TRANSACTION_SUCCESS: "Transaction submitted successfully!",
  COPIED_TO_CLIPBOARD: "Copied to clipboard!",
} as const
