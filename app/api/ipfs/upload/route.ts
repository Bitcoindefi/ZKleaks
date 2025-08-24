import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const files = formData.getAll("files") as File[]
    const title = formData.get("title") as string
    const message = formData.get("message") as string

    // Simulate upload delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Generate mock CID
    const mockCid = `bafybei${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`

    console.log("[v0] IPFS Upload:", {
      filesCount: files.length,
      title,
      message: message?.substring(0, 50) + "...",
      mockCid,
    })

    return NextResponse.json({
      success: true,
      cid: mockCid,
      files: files.map((f) => ({ name: f.name, size: f.size })),
      metadata: { title, message },
    })
  } catch (error) {
    console.error("[v0] IPFS upload error:", error)
    return NextResponse.json({ success: false, error: "Upload failed" }, { status: 500 })
  }
}
