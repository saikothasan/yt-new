import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const videoId = searchParams.get("videoId")

  if (!videoId) {
    return NextResponse.json({ error: "Video ID is required" }, { status: 400 })
  }

  const apiKey = process.env.YOUTUBE_API_KEY
  const baseUrl = "https://www.googleapis.com/youtube/v3"
  const maxResults = 10

  try {
    const url = `${baseUrl}/search?part=snippet&relatedToVideoId=${videoId}&type=video&maxResults=${maxResults}&key=${apiKey}`

    const response = await fetch(url)
    const data = await response.json()

    if (!response.ok) {
      console.error("YouTube API Error:", data)
      throw new Error(data.error?.message || "Failed to fetch related videos")
    }

    if (!data.items || data.items.length === 0) {
      return NextResponse.json({ items: [] })
    }

    // Fetch additional details for each video
    const videoIds = data.items.map((item: any) => item.id.videoId).join(",")
    const detailsUrl = `${baseUrl}/videos?part=statistics,contentDetails&id=${videoIds}&key=${apiKey}`
    const detailsResponse = await fetch(detailsUrl)
    const detailsData = await detailsResponse.json()

    if (!detailsResponse.ok) {
      console.error("YouTube API Error (details):", detailsData)
      throw new Error(detailsData.error?.message || "Failed to fetch video details")
    }

    // Merge search results with video details
    data.items = data.items.map((item: any) => {
      const details = detailsData.items?.find((detail: any) => detail.id === item.id.videoId)
      return {
        ...item,
        statistics: details?.statistics,
        contentDetails: details?.contentDetails,
      }
    })

    return NextResponse.json(data)
  } catch (error) {
    console.error("Server Error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "An unexpected error occurred" },
      { status: 500 },
    )
  }
}

