import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("q")
  const category = searchParams.get("category")

  const apiKey = process.env.YOUTUBE_API_KEY
  const baseUrl = "https://www.googleapis.com/youtube/v3"
  const maxResults = 24

  try {
    let url: string
    if (query) {
      url = `${baseUrl}/search?part=snippet&q=${encodeURIComponent(
        query,
      )}&type=video&maxResults=${maxResults}&key=${apiKey}`
    } else if (category) {
      url = `${baseUrl}/search?part=snippet&type=video&videoCategoryId=${category}&maxResults=${maxResults}&key=${apiKey}`
    } else {
      url = `${baseUrl}/videos?part=snippet,statistics,contentDetails&chart=mostPopular&maxResults=${maxResults}&key=${apiKey}`
    }

    const response = await fetch(url)
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error?.message || "Failed to fetch videos")
    }

    // If this is a search query or category search, fetch additional details for each video
    if ((query || category) && data.items) {
      const videoIds = data.items.map((item: any) => item.id.videoId).join(",")
      const detailsUrl = `${baseUrl}/videos?part=statistics,contentDetails&id=${videoIds}&key=${apiKey}`
      const detailsResponse = await fetch(detailsUrl)
      const detailsData = await detailsResponse.json()

      if (!detailsResponse.ok) {
        throw new Error(detailsData.error?.message || "Failed to fetch video details")
      }

      // Merge search results with video details
      data.items = data.items.map((item: any) => {
        const details = detailsData.items.find((detail: any) => detail.id === item.id.videoId)
        return {
          ...item,
          statistics: details?.statistics,
          contentDetails: details?.contentDetails,
        }
      })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("YouTube API Error:", error)
    return NextResponse.json({ error: "Failed to fetch videos" }, { status: 500 })
  }
}

