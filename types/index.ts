export type Stable = {
  symbol: "USDC" | "USDT" | "DAI"
  contract: string
  decimals: number
}

export type AddressAnalysis = {
  isValid: boolean
  type?: "wallet" | "contract"
  label?: string
  txCount?: number
  warnings?: string[]
}

export type Cip30Api = {
  getNetworkId: () => Promise<number>
  signTx: (tx: string, partialSign?: boolean) => Promise<string>
  submitTx: (tx: string) => Promise<string>
}

export type Post = {
  id: string
  title: string
  excerpt: string
  cid?: string
  onchainRef?: string
  tags: string[]
  createdAt: string
  hasMedia?: boolean
  verified?: boolean
}

export type LeakSubmission = {
  title: string
  message: string
  files: FileList | null
  cid?: string
}
