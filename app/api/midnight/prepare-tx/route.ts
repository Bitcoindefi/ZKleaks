import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { token, tokenContract, amount, recipient, metadata } = body

    console.log("[v0] Preparing Midnight transaction:", {
      token,
      tokenContract,
      amount,
      recipient: recipient?.substring(0, 20) + "...",
      metadata: {
        ...metadata,
        message: metadata?.message?.substring(0, 50) + "...",
      },
    })

    // Simulate preparation delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Generate mock CBOR transaction
    const mockCbor = `84a400818258200123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef00018182581d60${Math.random().toString(16).substring(2, 50)}1a${Math.random().toString(16).substring(2, 10)}021a0001e240a0f5f6`

    return NextResponse.json({
      success: true,
      cbor: mockCbor,
      txId: `tx_${Math.random().toString(36).substring(2, 15)}`,
      metadata,
    })
  } catch (error) {
    console.error("[v0] Transaction preparation error:", error)
    return NextResponse.json({ success: false, error: "Transaction preparation failed" }, { status: 500 })
  }
}
