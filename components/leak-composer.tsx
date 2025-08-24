"use client"

import { useState } from "react"
import { Upload, Wallet, Send, FileText, AlertCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { STABLECOINS } from "@/lib/midnight"
import { EmailAuth } from "./email-auth"
import type { Cip30Api } from "@/types"

const FILECOIN_UPLOAD_ENDPOINT = "/api/ipfs/upload"
const PREPARE_TX_ENDPOINT = "/api/midnight/prepare-tx"

export function LeakComposer() {
  const [title, setTitle] = useState("")
  const [message, setMessage] = useState("")
  const [files, setFiles] = useState<FileList | null>(null)
  const [cid, setCid] = useState("")

  // States
  const [uploading, setUploading] = useState(false)
  const [sending, setSending] = useState(false)
  const [laceConnected, setLaceConnected] = useState(false)

  const [emailAuthenticated, setEmailAuthenticated] = useState(false)
  const [authenticatedEmail, setAuthenticatedEmail] = useState("")

  // For donations with leak
  const [donationAmount, setDonationAmount] = useState("")
  const [donationToken, setDonationToken] = useState<keyof typeof STABLECOINS>("usdc")

  const handleEmailAuthenticated = (email: string) => {
    if (email) {
      setEmailAuthenticated(true)
      setAuthenticatedEmail(email)
    } else {
      setEmailAuthenticated(false)
      setAuthenticatedEmail("")
    }
  }

  // Connect to Lace wallet
  async function connectLace(): Promise<Cip30Api | null> {
    const anyWin = window as any
    const provider = anyWin?.cardano?.lace

    if (!provider?.enable) {
      alert("Lace wallet not found. Please install or enable Lace wallet.")
      return null
    }

    try {
      const api: Cip30Api = await provider.enable()
      setLaceConnected(true)
      return api
    } catch (error) {
      alert("Failed to connect to Lace wallet")
      return null
    }
  }

  // Upload to Filecoin/IPFS
  async function uploadToFilecoin(): Promise<string> {
    if ((!files || files.length === 0) && !message.trim() && !title.trim()) {
      alert("Please add a title/message or files before uploading.")
      return ""
    }

    setUploading(true)
    try {
      const formData = new FormData()

      if (files && files.length > 0) {
        Array.from(files).forEach((file) => formData.append("files", file, file.name))
      }

      formData.append("title", title)
      formData.append("message", message)

      const response = await fetch(FILECOIN_UPLOAD_ENDPOINT, {
        method: "POST",
        body: formData,
        mode: "cors",
      })

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.status}`)
      }

      const data = await response.json()
      if (!data?.cid) {
        throw new Error("Missing CID in response")
      }

      setCid(data.cid)
      return data.cid as string
    } catch (error: any) {
      alert(`Upload error: ${error?.message || error}`)
      return ""
    } finally {
      setUploading(false)
    }
  }

  // Send leak via Lace and Midnight
  async function sendLeakViaLace() {
    try {
      setSending(true)

      // Ensure we have content uploaded
      const gotCid = cid || (await uploadToFilecoin())
      if (!gotCid) {
        throw new Error("CID missing: please upload content first")
      }

      // Connect to Lace if not already connected
      const api = await connectLace()
      if (!api) return

      // Prepare transaction
      const selected = STABLECOINS[donationToken]
      const body = {
        token: selected.symbol,
        tokenContract: selected.contract,
        amount: Number(donationAmount) > 0 ? Number(donationAmount) : 0,
        recipient: "midnight1donationaddrxxxxxxxxxxxxxxxxxxxxxxxxxxx", // Default donation address
        metadata: {
          cid: gotCid,
          title,
          message,
          anonymous: false,
          submitterEmail: authenticatedEmail,
        },
      }

      const prepResponse = await fetch(PREPARE_TX_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        mode: "cors",
      })

      if (!prepResponse.ok) {
        throw new Error(`Prepare transaction failed: ${prepResponse.status}`)
      }

      const { cbor } = await prepResponse.json()
      if (!cbor) {
        throw new Error("Missing CBOR in response")
      }

      // Sign and submit transaction
      const signed = await api.signTx(cbor, true)
      const txHash = await api.submitTx(signed)

      alert(`Leak successfully submitted to Midnight! Transaction: ${txHash}`)

      // Reset form
      setTitle("")
      setMessage("")
      setFiles(null)
      setCid("")
      setDonationAmount("")
    } catch (error: any) {
      alert(`Error: ${error?.message || error}`)
    } finally {
      setSending(false)
    }
  }

  const hasContent = title.trim() || message.trim() || (files && files.length > 0)
  const canSubmit = hasContent && (cid || !uploading) && emailAuthenticated && laceConnected

  return (
    <div className="space-y-6">
      <EmailAuth
        onAuthenticated={handleEmailAuthenticated}
        isAuthenticated={emailAuthenticated}
        authenticatedEmail={authenticatedEmail}
      />

      <Card className="rounded-2xl shadow-lg border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            Submit Leak
            <span className="text-sm font-normal text-slate-500 dark:text-slate-400">(Filecoin + Midnight + Lace)</span>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Content Form */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">Title</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Brief title for your leak"
                className="text-base"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">Description</label>
              <textarea
                className="w-full min-h-[120px] p-3 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 resize-y"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Provide context and details about your leak..."
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                Attachments (optional)
              </label>
              <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-6 text-center hover:border-slate-400 dark:hover:border-slate-500 transition-colors">
                <input
                  type="file"
                  multiple
                  onChange={(e) => setFiles(e.currentTarget.files)}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-sm text-slate-600 dark:text-slate-400">Click to upload files or drag and drop</p>
                  <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                    Documents, images, audio, video supported
                  </p>
                </label>
              </div>

              {files && files.length > 0 && (
                <div className="mt-2 space-y-1">
                  {Array.from(files).map((file, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <FileText className="w-4 h-4" />
                      <span>{file.name}</span>
                      <span className="text-xs">({(file.size / 1024 / 1024).toFixed(1)} MB)</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-3 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
                  <div className="text-xs text-amber-700 dark:text-amber-300">
                    <p className="font-medium mb-1">Privacy Notice:</p>
                    <p>
                      Files are uploaded publicly to IPFS/Filecoin without encryption. Only the CID and minimal metadata
                      are stored on-chain.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Optional Donation */}
          <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
            <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
              Optional Donation (with submission)
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Input
                  type="text"
                  placeholder="Amount"
                  value={donationAmount}
                  onChange={(e) => setDonationAmount(e.target.value)}
                />
              </div>
              <div>
                <select
                  className="w-full border border-slate-300 dark:border-slate-600 rounded-md p-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  value={donationToken}
                  onChange={(e) => setDonationToken(e.target.value as keyof typeof STABLECOINS)}
                >
                  {Object.entries(STABLECOINS).map(([k, v]) => (
                    <option key={k} value={k}>
                      {v.symbol}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* CID Display */}
          {cid && (
            <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <div className="text-xs text-green-700 dark:text-green-300">
                <p className="font-medium mb-1">Content Uploaded:</p>
                <code className="break-all">{cid}</code>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
            <Button
              onClick={uploadToFilecoin}
              disabled={uploading || !hasContent}
              variant="outline"
              className="gap-2 bg-transparent"
            >
              <Upload className="w-4 h-4" />
              {uploading ? "Uploading..." : cid ? "Re-upload" : "Upload to IPFS"}
            </Button>

            <Button
              onClick={connectLace}
              disabled={laceConnected}
              variant={laceConnected ? "secondary" : "default"}
              className="gap-2"
            >
              <Wallet className="w-4 h-4" />
              {laceConnected ? "Lace Connected" : "Connect Lace"}
            </Button>

            <Button
              onClick={sendLeakViaLace}
              disabled={sending || !canSubmit}
              className="gap-2 bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
              title={
                !emailAuthenticated
                  ? "Email verification required"
                  : !laceConnected
                    ? "Lace wallet connection required"
                    : ""
              }
            >
              <Send className="w-4 h-4" />
              {sending ? "Submitting..." : "Submit Leak"}
            </Button>
          </div>

          {(!emailAuthenticated || !laceConnected) && (
            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg">
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Requirements to submit:</p>
              <div className="space-y-1 text-xs">
                <div
                  className={`flex items-center gap-2 ${emailAuthenticated ? "text-green-600 dark:text-green-400" : "text-slate-500 dark:text-slate-400"}`}
                >
                  <div
                    className={`w-2 h-2 rounded-full ${emailAuthenticated ? "bg-green-500" : "bg-slate-300 dark:bg-slate-600"}`}
                  />
                  Email verification {emailAuthenticated ? "✓" : "(required)"}
                </div>
                <div
                  className={`flex items-center gap-2 ${laceConnected ? "text-green-600 dark:text-green-400" : "text-slate-500 dark:text-slate-400"}`}
                >
                  <div
                    className={`w-2 h-2 rounded-full ${laceConnected ? "bg-green-500" : "bg-slate-300 dark:bg-slate-600"}`}
                  />
                  Lace wallet connection {laceConnected ? "✓" : "(required)"}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
