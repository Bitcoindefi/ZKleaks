import type { Stable } from "@/types"

export const NETWORK_CONFIG = {
  isTestnet: true,
  networkName: "Midnight Testnet",
  explorerUrl: "https://testnet-explorer.midnight.network",
}

export const STABLECOINS: Record<"usdc" | "usdt" | "dai", Stable> = {
  usdc: {
    symbol: "USDC",
    contract: "midnight1testcontractusdcxxxxxxxxxxxxxxxxxxxxxxx",
    decimals: 6,
  },
  usdt: {
    symbol: "USDT",
    contract: "midnight1testcontractusdtxxxxxxxxxxxxxxxxxxxxxxx",
    decimals: 6,
  },
  dai: {
    symbol: "DAI",
    contract: "midnight1testcontractdaixxxxxxxxxxxxxxxxxxxxxxxx",
    decimals: 18,
  },
}

export const DEFAULT_DONATION_WALLET =
  "addr_test1qz5sz4npd8efdavvlk6snsnvlgn3sjqd3xc86aqj3at5h3tj68yxzrp6rsaet68rz9p7yftsva2a2p20vstffgd7wtzqx9uxv6"

export const MIDNIGHT_ADDR_REGEX = /^(midnight1[0-9a-z]{20,}|addr_test1[0-9a-z]{50,})$/

export function isLikelyMidnightAddress(addr?: string | null): boolean {
  return !!addr && MIDNIGHT_ADDR_REGEX.test(addr)
}

export function toUnits(amountStr: string, decimals: number): bigint {
  if (!amountStr) return 0n
  const trimmed = amountStr.trim()
  if (!/^\d*(?:\.\d*)?$/.test(trimmed)) return 0n

  const [intPartRaw, fracRaw = ""] = trimmed.split(".")
  const intPart = intPartRaw === "" ? "0" : intPartRaw
  const fracPadded = (fracRaw + "0".repeat(decimals)).slice(0, decimals)

  return BigInt(intPart || "0") * 10n ** BigInt(decimals) + BigInt(fracPadded || "0")
}

export function buildMidnightURI(recipient: string, tokenContract: string, amount: string, decimals: number): string {
  if (!isLikelyMidnightAddress(recipient) || !tokenContract) return ""

  const valueBI = toUnits(amount, decimals)
  if (valueBI <= 0) return ""

  return `midnight:${recipient}/transfer?contractAddress=${tokenContract}&value=${valueBI.toString()}`
}
