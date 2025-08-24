import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ success: false, error: "Valid email is required" }, { status: 400 })
    }

    console.log("[v0] Sending verification code to:", email)

    // Simulate email sending delay
    await new Promise((resolve) => setTimeout(resolve, 1200))

    // Generate mock verification code
    const code = Math.floor(100000 + Math.random() * 900000).toString()

    // In production, store this code in database/cache with expiration
    console.log("[v0] Generated verification code:", code, "for", email)

    return NextResponse.json({
      success: true,
      message: "Verification code sent",
      // Don't return the code in production!
      debug: { code }, // Only for testing
    })
  } catch (error) {
    console.error("[v0] Send code error:", error)
    return NextResponse.json({ success: false, error: "Failed to send verification code" }, { status: 500 })
  }
}
