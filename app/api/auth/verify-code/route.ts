import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { email, code } = await request.json()

    if (!email || !code) {
      return NextResponse.json({ success: false, error: "Email and code are required" }, { status: 400 })
    }

    console.log("[v0] Verifying code:", code, "for email:", email)

    // Simulate verification delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    // For demo purposes, accept any 6-digit code
    const isValid = /^\d{6}$/.test(code)

    if (isValid) {
      return NextResponse.json({
        success: true,
        message: "Email verified successfully",
        verified: true,
      })
    } else {
      return NextResponse.json({ success: false, error: "Invalid verification code" }, { status: 400 })
    }
  } catch (error) {
    console.error("[v0] Verify code error:", error)
    return NextResponse.json({ success: false, error: "Verification failed" }, { status: 500 })
  }
}
