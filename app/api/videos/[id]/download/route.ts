import { NextResponse } from "next/server"
import ytdl from "ytdl-core"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { searchParams } = new URL(request.url)
  const quality = searchParams.get("quality") || "highest"
  const videoId = params.id

  if (!videoId) {
    return NextResponse.json({ error: "Video ID is required" }, { status: 400 })
  }

  try {
    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`
    const info = await ytdl.getInfo(videoUrl)

    let format = ytdl.chooseFormat(info.formats, { quality: quality })

    if (!format) {
      format = ytdl.chooseFormat(info.formats, { quality: "highest" })
    }

    // Instead of downloading the video, we'll return the direct URL
    return NextResponse.json({ url: format.url })
  } catch (error) {
    console.error("Error getting video download URL:", error)
    return NextResponse.json({ error: "Failed to get video download URL" }, { status: 500 })
  }
}

