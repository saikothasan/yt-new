import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const apiKey = process.env.YOUTUBE_API_KEY
  const videoId = params.id

  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&id=${videoId}&key=${apiKey}`,
    )
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error?.message || "Failed to fetch video details")
    }

    if (!data.items?.length) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 })
    }

    // Fetch channel details
    const channelId = data.items[0].snippet.channelId
    const channelResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${channelId}&key=${apiKey}`,
    )
    const channelData = await channelResponse.json()

    if (!channelResponse.ok) {
      throw new Error(channelData.error?.message || "Failed to fetch channel details")
    }

    // Merge video and channel data
    data.items[0].channelDetails = channelData.items?.[0]

    return NextResponse.json(data)
  } catch (error) {
    console.error("YouTube API Error:", error)
    return NextResponse.json({ error: "Failed to fetch video details" }, { status: 500 })
  }
}

