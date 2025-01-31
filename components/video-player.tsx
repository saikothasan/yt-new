"use client"

import { useEffect, useState } from "react"
import { formatViews, formatDate } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { ThumbsUp, ThumbsDown, Share2, VerifiedIcon } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { DownloadButton } from "@/components/download-button"

interface VideoPlayerProps {
  videoId: string
}

interface VideoDetails {
  snippet: {
    title: string
    description: string
    channelTitle: string
    channelId: string
    publishedAt: string
    thumbnails: {
      default: {
        url: string
      }
    }
  }
  statistics: {
    viewCount: string
    likeCount: string
    commentCount: string
  }
}

export function VideoPlayer({ videoId }: VideoPlayerProps) {
  const [videoDetails, setVideoDetails] = useState<VideoDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [dislikeCount, setDislikeCount] = useState(0)
  const [userLiked, setUserLiked] = useState(false)
  const [userDisliked, setUserDisliked] = useState(false)

  useEffect(() => {
    const fetchVideoDetails = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await fetch(`/api/videos/${videoId}`)
        if (!response.ok) {
          throw new Error("Failed to fetch video details")
        }
        const data = await response.json()
        if (data.error) {
          throw new Error(data.error)
        }
        if (data.items?.[0]) {
          setVideoDetails(data.items[0])
          setLikeCount(Number.parseInt(data.items[0].statistics.likeCount))
        } else {
          throw new Error("Video not found")
        }
      } catch (error) {
        setError(error instanceof Error ? error.message : "An error occurred")
        console.error("Error fetching video details:", error)
      }
      setLoading(false)
    }

    if (videoId) {
      fetchVideoDetails()
    }
  }, [videoId])

  const handleLike = () => {
    if (userLiked) {
      setLikeCount(likeCount - 1)
      setUserLiked(false)
    } else {
      setLikeCount(likeCount + 1)
      setUserLiked(true)
      if (userDisliked) {
        setDislikeCount(dislikeCount - 1)
        setUserDisliked(false)
      }
    }
  }

  const handleDislike = () => {
    if (userDisliked) {
      setDislikeCount(dislikeCount - 1)
      setUserDisliked(false)
    } else {
      setDislikeCount(dislikeCount + 1)
      setUserDisliked(true)
      if (userLiked) {
        setLikeCount(likeCount - 1)
        setUserLiked(false)
      }
    }
  }

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
        <Skeleton className="aspect-video w-full" />
        <Skeleton className="h-8 w-3/4" />
        <div className="flex items-center gap-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
      </div>
    )
  }

  if (!videoDetails) {
    return null
  }

  return (
    <div className="max-w-[1280px] mx-auto">
      <div className="aspect-video rounded-xl overflow-hidden bg-black">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}`}
          className="w-full h-full"
          allowFullScreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        />
      </div>
      <div className="mt-4 space-y-4">
        <h1 className="text-xl sm:text-2xl font-bold">{videoDetails.snippet.title}</h1>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={videoDetails.snippet.thumbnails.default.url || "/placeholder.svg"}
              alt={videoDetails.snippet.channelTitle}
              className="w-12 h-12 rounded-full"
            />
            <div>
              <div className="flex items-center gap-1">
                <span className="font-semibold">{videoDetails.snippet.channelTitle}</span>
                <VerifiedIcon className="h-4 w-4" />
              </div>
              <div className="text-sm text-muted-foreground">
                {formatViews(videoDetails.statistics.viewCount)} views
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Button variant={userLiked ? "default" : "secondary"} className="space-x-2" onClick={handleLike}>
              <ThumbsUp className="h-4 w-4" />
              <span>{formatViews(likeCount.toString())}</span>
            </Button>
            <Button variant={userDisliked ? "default" : "secondary"} className="space-x-2" onClick={handleDislike}>
              <ThumbsDown className="h-4 w-4" />
              <span>{formatViews(dislikeCount.toString())}</span>
            </Button>
            <Button variant="secondary">
              <Share2 className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Share</span>
            </Button>
            <DownloadButton videoId={videoId} />
          </div>
        </div>
        <div
          className={`bg-muted rounded-xl p-4 ${isDescriptionExpanded ? "" : "cursor-pointer"}`}
          onClick={() => !isDescriptionExpanded && setIsDescriptionExpanded(true)}
        >
          <div className="flex items-center gap-2 text-sm font-medium mb-2">
            <span>{formatViews(videoDetails.statistics.viewCount)} views</span>
            <span>•</span>
            <span>{formatDate(videoDetails.snippet.publishedAt)}</span>
          </div>
          <p className={`whitespace-pre-wrap text-sm ${isDescriptionExpanded ? "" : "line-clamp-2"}`}>
            {videoDetails.snippet.description}
          </p>
          {!isDescriptionExpanded && videoDetails.snippet.description.length > 100 && (
            <Button
              variant="ghost"
              className="text-sm p-0 h-auto mt-2"
              onClick={(e) => {
                e.stopPropagation()
                setIsDescriptionExpanded(true)
              }}
            >
              Show more
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

