"use client"

import { useState, useEffect } from "react"
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

interface VideoRecommendationsProps {
  category: string
}

export function VideoRecommendations({ category }: VideoRecommendationsProps) {
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRecommendations = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await fetch(`/api/videos?category=${category}`)
        if (!response.ok) {
          throw new Error("Failed to fetch recommendations")
        }
        const data = await response.json()
        if (data.error) {
          throw new Error(data.error)
        }
        setVideos(data.items || [])
      } catch (error) {
        setError(error instanceof Error ? error.message : "An error occurred")
        console.error("Error fetching recommendations:", error)
      }
      setLoading(false)
    }

    fetchRecommendations()
  }, [category])

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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <VideoCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (videos.length === 0) {
    return (
      <Alert>
        <AlertDescription>No recommendations found.</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {videos.map((video) => (
        <VideoCard key={typeof video.id === "string" ? video.id : video.id.videoId} video={video} />
      ))}
    </div>
  )
}

