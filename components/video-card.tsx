import Link from "next/link"
import Image from "next/image"
import { formatViews, formatDuration, formatDate } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import { VerifiedIcon } from "lucide-react"

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

interface VideoCardProps {
  video: Video
  layout?: "grid" | "list"
}

export function VideoCard({ video, layout = "grid" }: VideoCardProps) {
  const videoId = typeof video.id === "string" ? video.id : video.id.videoId
  const viewCount = video.statistics?.viewCount ? formatViews(video.statistics.viewCount) : "N/A"
  const duration = video.contentDetails?.duration ? formatDuration(video.contentDetails.duration) : null

  if (layout === "list") {
    return (
      <Link href={`/watch?v=${videoId}`}>
        <div className="flex gap-4 group">
          <div className="relative aspect-video w-64 rounded-xl overflow-hidden flex-shrink-0">
            <Image
              src={video.snippet.thumbnails.medium.url || "/placeholder.svg"}
              alt={video.snippet.title}
              fill
              className="object-cover transition-transform group-hover:scale-105"
            />
            {duration && (
              <div className="absolute bottom-1 right-1 bg-black/80 px-1 rounded text-xs text-white">{duration}</div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold line-clamp-2 mb-1">{video.snippet.title}</h3>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <span>{video.snippet.channelTitle}</span>
              <VerifiedIcon className="h-4 w-4" />
            </div>
            <div className="text-sm text-muted-foreground flex items-center gap-1">
              {viewCount !== "N/A" && <span>{viewCount} views</span>}
              <span className="text-xs">•</span>
              <span>{formatDate(video.snippet.publishedAt)}</span>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2 mt-2">{video.snippet.description}</p>
          </div>
        </div>
      </Link>
    )
  }

  return (
    <Link href={`/watch?v=${videoId}`}>
      <div className="group cursor-pointer">
        <div className="aspect-video relative rounded-xl overflow-hidden">
          <Image
            src={video.snippet.thumbnails.medium.url || "/placeholder.svg"}
            alt={video.snippet.title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
          {duration && (
            <div className="absolute bottom-1 right-1 bg-black/80 px-1 rounded text-xs text-white">{duration}</div>
          )}
        </div>
        <div className="mt-2">
          <h3 className="font-semibold line-clamp-2">{video.snippet.title}</h3>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <span>{video.snippet.channelTitle}</span>
            <VerifiedIcon className="h-4 w-4" />
          </div>
          <div className="text-sm text-muted-foreground flex items-center gap-1">
            {viewCount !== "N/A" && <span>{viewCount} views</span>}
            <span className="text-xs">•</span>
            <span>{formatDate(video.snippet.publishedAt)}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}

export function VideoCardSkeleton({ layout = "grid" }: { layout?: "grid" | "list" }) {
  if (layout === "list") {
    return (
      <div className="flex gap-4">
        <Skeleton className="aspect-video w-64 rounded-xl flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-20 w-full" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <Skeleton className="aspect-video w-full rounded-xl" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-4 w-1/4" />
    </div>
  )
}

