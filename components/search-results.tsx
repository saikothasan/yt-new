"use client"

import { useEffect, useState } from "react"
import { VideoCard, VideoCardSkeleton } from "@/components/video-card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

interface Video {
  id: string | { videoId: string }
  snippet: {
    title: string
    thumbnails: {
      medium: {
        url: string
        width: number
        height: number
      }
    }
    channelTitle: string
    publishedAt: string
    channelId: string
    description: string
  }
  statistics?: {
    viewCount: string
  }
  contentDetails?: {
    duration: string
  }
}

interface SearchResultsProps {
  query: string
}

export function SearchResults({ query }: SearchResultsProps) {
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await fetch(`/api/videos?q=${encodeURIComponent(query)}`)
        if (!response.ok) {
          throw new Error("Failed to fetch search results")
        }
        const data = await response.json()
        if (data.error) {
          throw new Error(data.error)
        }

        // Ensure the fetched data matches our Video interface
        const formattedVideos: Video[] = data.items.map((item: any) => ({
          id: item.id.videoId || item.id,
          snippet: {
            ...item.snippet,
            thumbnails: {
              medium: {
                url: item.snippet.thumbnails.medium.url,
                width: item.snippet.thumbnails.medium.width || 320,
                height: item.snippet.thumbnails.medium.height || 180,
              },
            },
          },
          statistics: item.statistics,
          contentDetails: item.contentDetails,
        }))

        setVideos(formattedVideos)
      } catch (error) {
        setError(error instanceof Error ? error.message : "An error occurred")
        console.error("Error fetching search results:", error)
      }
      setLoading(false)
    }

    if (query) {
      fetchResults()
    }
  }, [query])

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <VideoCardSkeleton key={i} layout="list" />
        ))}
      </div>
    )
  }

  if (videos.length === 0) {
    return (
      <Alert>
        <AlertDescription>No videos found for "{query}"</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">Search results for "{query}"</h2>
      {videos.map((video) => (
        <VideoCard key={typeof video.id === "string" ? video.id : video.id.videoId} video={video} layout="list" />
      ))}
    </div>
  )
}

