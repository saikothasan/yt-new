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
    // First, fetch related videos
    const relatedUrl = `${baseUrl}/search?part=snippet&relatedToVideoId=${videoId}&type=video&maxResults=${maxResults}&key=${apiKey}`
    const relatedResponse = await fetch(relatedUrl)
    const relatedData = await relatedResponse.json()

    if (!relatedResponse.ok) {
      console.error("YouTube API Error:", relatedData)
      throw new Error(relatedData.error?.message || "Failed to fetch related videos")
    }

    if (!relatedData.items || relatedData.items.length === 0) {
      return NextResponse.json({ items: [] })
    }

    // Then, fetch additional details for each video
    const videoIds = relatedData.items.map((item: any) => item.id.videoId).join(",")
    const detailsUrl = `${baseUrl}/videos?part=snippet,statistics,contentDetails&id=${videoIds}&key=${apiKey}`
    const detailsResponse = await fetch(detailsUrl)
    const detailsData = await detailsResponse.json()

    if (!detailsResponse.ok) {
      console.error("YouTube API Error (details):", detailsData)
      throw new Error(detailsData.error?.message || "Failed to fetch video details")
    }

    // Merge search results with video details
    const mergedItems = relatedData.items.map((item: any) => {
      const details = detailsData.items.find((detail: any) => detail.id === item.id.videoId)
      return {
        ...item,
        statistics: details?.statistics,
        contentDetails: details?.contentDetails,
      }
    })

    return NextResponse.json({ items: mergedItems })
  } catch (error) {
    console.error("Server Error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "An unexpected error occurred" },
      { status: 500 },
    )
  }
}

