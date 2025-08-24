"use client"

import { useState } from "react"
import { Mail, Shield, Check, AlertCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface EmailAuthProps {
  onAuthenticated: (email: string) => void
  isAuthenticated: boolean
  authenticatedEmail?: string
}

export function EmailAuth({ onAuthenticated, isAuthenticated, authenticatedEmail }: EmailAuthProps) {
  const [email, setEmail] = useState("")
  const [verificationCode, setVerificationCode] = useState("")
  const [step, setStep] = useState<"email" | "verify">("email")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const sendVerificationCode = async () => {
    if (!isValidEmail(email)) {
      setError("Please enter a valid email address")
      return
    }

    setLoading(true)
    setError("")

    try {
      // Simulate API call to send verification code
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // In a real implementation, this would call your backend
      // const response = await fetch('/api/auth/send-code', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email })
      // })

      setStep("verify")
    } catch (err) {
      setError("Failed to send verification code. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const verifyCode = async () => {
    if (!verificationCode.trim()) {
      setError("Please enter the verification code")
      return
    }

    setLoading(true)
    setError("")

    try {
      // Simulate API call to verify code
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // In a real implementation, this would verify the code
      // const response = await fetch('/api/auth/verify-code', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email, code: verificationCode })
      // })

      // For demo purposes, accept any 6-digit code
      if (verificationCode.length === 6) {
        onAuthenticated(email)
      } else {
        setError("Invalid verification code")
      }
    } catch (err) {
      setError("Verification failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setEmail("")
    setVerificationCode("")
    setStep("email")
    setError("")
    onAuthenticated("")
  }

  if (isAuthenticated && authenticatedEmail) {
    return (
      <Card className="rounded-xl border border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-900/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center">
                <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-green-800 dark:text-green-200">Email Verified</p>
                <p className="text-xs text-green-600 dark:text-green-400">{authenticatedEmail}</p>
              </div>
            </div>
            <Button
              onClick={logout}
              variant="ghost"
              size="sm"
              className="text-green-700 dark:text-green-300 hover:text-green-800 dark:hover:text-green-200"
            >
              Change
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-900/20">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg text-amber-800 dark:text-amber-200">
          <Shield className="w-5 h-5" />
          Email Verification Required
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-start gap-2 p-3 bg-amber-100/50 dark:bg-amber-900/30 rounded-lg">
          <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
          <div className="text-xs text-amber-700 dark:text-amber-300">
            <p className="font-medium mb-1">Why email verification?</p>
            <p>To prevent spam and ensure accountability, we require email verification before submitting leaks.</p>
          </div>
        </div>

        {step === "email" && (
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-amber-800 dark:text-amber-200 mb-2 block">Email Address</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                className="bg-white dark:bg-slate-800"
              />
            </div>

            {error && <p className="text-xs text-red-600 dark:text-red-400">{error}</p>}

            <Button
              onClick={sendVerificationCode}
              disabled={loading || !isValidEmail(email)}
              className="w-full gap-2 bg-amber-600 hover:bg-amber-700 text-white"
            >
              <Mail className="w-4 h-4" />
              {loading ? "Sending..." : "Send Verification Code"}
            </Button>
          </div>
        )}

        {step === "verify" && (
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-amber-800 dark:text-amber-200 mb-2 block">
                Verification Code
              </label>
              <Input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="Enter 6-digit code"
                maxLength={6}
                className="bg-white dark:bg-slate-800 text-center text-lg tracking-widest"
              />
              <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                Check your email ({email}) for the verification code
              </p>
            </div>

            {error && <p className="text-xs text-red-600 dark:text-red-400">{error}</p>}

            <div className="flex gap-2">
              <Button onClick={() => setStep("email")} variant="outline" className="flex-1">
                Back
              </Button>
              <Button
                onClick={verifyCode}
                disabled={loading || !verificationCode.trim()}
                className="flex-1 bg-amber-600 hover:bg-amber-700 text-white"
              >
                {loading ? "Verifying..." : "Verify"}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
