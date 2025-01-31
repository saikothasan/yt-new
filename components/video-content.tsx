"use client"

import { useSearchParams } from "next/navigation"
import { VideoGrid } from "@/components/video-grid"
import { SearchResults } from "@/components/search-results"

export function VideoContent() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q")

  if (query) {
    return <SearchResults query={query} />
  }

  return <VideoGrid />
}

