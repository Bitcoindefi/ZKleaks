import type { Stable } from "@/types"

export const STABLECOINS: Record<"usdc" | "usdt" | "dai", Stable> = {
  usdc: {
    symbol: "USDC",
    contract: "midnight1contractusdcxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    decimals: 6,
  },
  usdt: {
    symbol: "USDT",
    contract: "midnight1contractusdtxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    decimals: 6,
  },
  dai: {
    symbol: "DAI",
    contract: "midnight1contractdaixxxxxxxxxxxxxxxxxxxxxxxxxxx",
    decimals: 18,
  },
}

export const DEFAULT_DONATION_WALLET = "midnight1donationaddrxxxxxxxxxxxxxxxxxxxxxxxxxxx"

export const MIDNIGHT_ADDR_REGEX = /^midnight1[0-9a-z]{20,}$/

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
