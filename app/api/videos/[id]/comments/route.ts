import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const apiKey = process.env.YOUTUBE_API_KEY
  const videoId = params.id

  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${videoId}&maxResults=20&key=${apiKey}`,
    )
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error?.message || "Failed to fetch comments")
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("YouTube API Error:", error)
    return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 })
  }
}

