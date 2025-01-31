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

interface RelatedVideosProps {
  videoId: string
}

export function RelatedVideos({ videoId }: RelatedVideosProps) {
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRelatedVideos = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await fetch(`/api/videos/related?videoId=${videoId}`)
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch related videos")
        }

        setVideos(data.items || [])
      } catch (error) {
        console.error("Error fetching related videos:", error)
        setError(error instanceof Error ? error.message : "An unexpected error occurred")
      } finally {
        setLoading(false)
      }
    }

    if (videoId) {
      fetchRelatedVideos()
    }
  }, [videoId])

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
        {Array.from({ length: 5 }).map((_, i) => (
          <VideoCardSkeleton key={i} layout="list" />
        ))}
      </div>
    )
  }

  if (videos.length === 0) {
    return (
      <Alert>
        <AlertDescription>No related videos found.</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-4">
      {videos.map((video) => (
        <VideoCard key={typeof video.id === "string" ? video.id : video.id.videoId} video={video} layout="list" />
      ))}
    </div>
  )
}

