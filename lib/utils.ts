import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { formatDistanceToNow, format } from "date-fns"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatViews(viewCount: string) {
  const count = Number.parseInt(viewCount)
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`
  } else if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`
  }
  return count.toLocaleString()
}

export function formatDuration(duration: string) {
  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/)
  if (!match) return "0:00"

  const hours = match[1] ? Number.parseInt(match[1]) : 0
  const minutes = match[2] ? Number.parseInt(match[2]) : 0
  const seconds = match[3] ? Number.parseInt(match[3]) : 0

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
  }
  return `${minutes}:${seconds.toString().padStart(2, "0")}`
}

export function formatDate(date: string) {
  const now = new Date()
  const publishedDate = new Date(date)
  const diffInHours = Math.abs(now.getTime() - publishedDate.getTime()) / 36e5

  if (diffInHours < 24) {
    return formatDistanceToNow(publishedDate, { addSuffix: true })
  }
  return format(publishedDate, "MMM d, yyyy")
}

