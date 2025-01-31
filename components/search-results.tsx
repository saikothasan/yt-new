"use client"

import { useEffect, useState } from "react"
import { VideoCard, VideoCardSkeleton } from "@/components/video-card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

interface SearchResultsProps {
  query: string
}

export function SearchResults({ query }: SearchResultsProps) {
  const [videos, setVideos] = useState([])
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
        setVideos(data.items || [])
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

