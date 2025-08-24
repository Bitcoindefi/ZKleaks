"use client"

import { useEffect, useMemo, useState } from "react"
import { QRCodeSVG } from "qrcode.react"
import { Copy, Check, QrCode, ShieldQuestion, RefreshCw } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { STABLECOINS, DEFAULT_DONATION_WALLET, buildMidnightURI, isLikelyMidnightAddress } from "@/lib/midnight"
import type { AddressAnalysis } from "@/types"

const ANALYZE_ADDR_ENDPOINT = "/api/midnight/analyze-address"

export function DonationCard() {
  const [recipient, setRecipient] = useState(DEFAULT_DONATION_WALLET)
  const [amount, setAmount] = useState("")
  const [token, setToken] = useState<keyof typeof STABLECOINS>("usdc")
  const [note, setNote] = useState("")
  const [copied, setCopied] = useState(false)
  const [showQR, setShowQR] = useState(true)

  // Address analysis
  const [analyzing, setAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState<AddressAnalysis | null>(null)
  const [analysisError, setAnalysisError] = useState("")

  const selected = STABLECOINS[token]
  const quicks = [5, 10, 25, 50]

  const paymentURI = useMemo(
    () => buildMidnightURI(recipient, selected.contract, amount, selected.decimals),
    [recipient, selected, amount],
  )

  // Copy functionality
  const onCopy = async () => {
    if (!navigator?.clipboard) return
    await navigator.clipboard.writeText(recipient)
    setCopied(true)
    setTimeout(() => setCopied(false), 1600)
  }

  // Address analyzer (debounced)
  useEffect(() => {
    let timeout: NodeJS.Timeout
    setAnalysis(null)
    setAnalysisError("")

    if (!isLikelyMidnightAddress(recipient)) return

    timeout = setTimeout(async () => {
      try {
        setAnalyzing(true)
        const res = await fetch(ANALYZE_ADDR_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ address: recipient }),
        })

        if (!res.ok) throw new Error(`analyze failed: ${res.status}`)
        const data = (await res.json()) as AddressAnalysis
        setAnalysis(data)
      } catch (e: any) {
        setAnalysisError(e?.message || String(e))
      } finally {
        setAnalyzing(false)
      }
    }, 600)

    return () => clearTimeout(timeout)
  }, [recipient])

  return (
    <Card className="rounded-2xl shadow-lg border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between text-xl">
          <span className="flex items-center gap-3">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            Support ZKLeaks ({selected.symbol})
          </span>
          <Button
            variant="outline"
            size="sm"
            className="gap-2 hover:bg-slate-100 dark:hover:bg-slate-700 bg-transparent"
            onClick={() => setShowQR((s) => !s)}
          >
            <QrCode className="w-4 h-4" />
            {showQR ? "Hide QR" : "Show QR"}
          </Button>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Recipient Address */}
          <div className="md:col-span-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
              Recipient Address
            </label>
            <div className="flex flex-wrap items-center gap-2">
              <Input
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="font-mono text-sm flex-1 min-w-0"
                placeholder="midnight1..."
              />
              <Button variant="secondary" size="sm" onClick={onCopy} className="gap-2 shrink-0">
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? "Copied" : "Copy"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setRecipient(DEFAULT_DONATION_WALLET)}
                title="Reset to default"
                className="shrink-0"
              >
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>

            {/* Address Analysis */}
            <div className="flex items-center gap-2 mt-2 text-xs">
              <ShieldQuestion className="w-4 h-4 text-slate-500" />
              {analyzing && <span className="text-slate-600 dark:text-slate-400">Analyzing on-chain...</span>}
              {!analyzing && analysis && (
                <span className="text-slate-700 dark:text-slate-300">
                  {analysis.isValid ? "✓ Valid" : "✗ Invalid"}
                  {analysis.type && ` • ${analysis.type}`}
                  {typeof analysis.txCount === "number" && ` • ${analysis.txCount} txs`}
                  {analysis.label && ` • ${analysis.label}`}
                  {analysis.warnings?.length && (
                    <span className="text-amber-600"> • {analysis.warnings.join(", ")}</span>
                  )}
                </span>
              )}
              {!analyzing && analysisError && <span className="text-red-500">{analysisError}</span>}
            </div>
          </div>

          {/* Amount */}
          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
              Amount ({selected.symbol})
            </label>
            <Input
              type="text"
              placeholder="e.g. 10.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="mb-3"
            />
            <div className="flex flex-wrap gap-2">
              {quicks.map((q) => (
                <Button
                  key={q}
                  size="sm"
                  variant="outline"
                  onClick={() => setAmount(String(q))}
                  className="hover:bg-emerald-50 hover:border-emerald-300 dark:hover:bg-emerald-900/20"
                >
                  {q} {selected.symbol}
                </Button>
              ))}
            </div>
          </div>

          {/* Token Selection */}
          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">Token</label>
            <select
              className="w-full border border-slate-300 dark:border-slate-600 rounded-md p-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
              value={token}
              onChange={(e) => setToken(e.target.value as keyof typeof STABLECOINS)}
            >
              {Object.entries(STABLECOINS).map(([k, v]) => (
                <option key={k} value={k}>
                  {v.symbol}
                </option>
              ))}
            </select>
          </div>

          {/* Note */}
          <div className="md:col-span-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">Note (optional)</label>
            <Input
              placeholder="Thank you for supporting transparency!"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Notes are for display only and don't go on-chain.
            </p>
          </div>
        </div>

        {/* QR Code Section */}
        {showQR && (
          <div className="border border-slate-200 dark:border-slate-700 rounded-xl p-6 bg-slate-50/50 dark:bg-slate-900/50">
            {paymentURI ? (
              <div className="flex flex-col items-center gap-4">
                <QRCodeSVG
                  value={paymentURI}
                  size={180}
                  includeMargin
                  className="border border-slate-200 dark:border-slate-700 rounded-lg bg-white p-2"
                />
                <div className="text-center">
                  <a href={paymentURI} className="text-xs text-blue-600 dark:text-blue-400 hover:underline break-all">
                    {paymentURI}
                  </a>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">Scan with your Midnight wallet</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-slate-600 dark:text-slate-400">
                  Enter a valid address and amount to generate QR code
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
