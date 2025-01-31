"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface DownloadButtonProps {
  videoId: string
}

export function DownloadButton({ videoId }: DownloadButtonProps) {
  const [quality, setQuality] = useState("highest")
  const [isDownloading, setIsDownloading] = useState(false)

  const handleDownload = async () => {
    setIsDownloading(true)
    try {
      const response = await fetch(`/api/videos/${videoId}/download?quality=${quality}`)
      if (!response.ok) {
        throw new Error("Download failed")
      }
      const data = await response.json()
      if (data.error) {
        throw new Error(data.error)
      }

      // Create a temporary anchor element to trigger the download
      const a = document.createElement("a")
      a.style.display = "none"
      a.href = data.url
      a.download = `video-${videoId}.mp4`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    } catch (error) {
      console.error("Error downloading video:", error)
      alert("Failed to download video. Please try again.")
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Select value={quality} onValueChange={setQuality}>
        <SelectTrigger className="w-[100px]">
          <SelectValue placeholder="Quality" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="highest">Highest</SelectItem>
          <SelectItem value="lowest">Lowest</SelectItem>
        </SelectContent>
      </Select>
      <Button onClick={handleDownload} disabled={isDownloading}>
        <Download className="mr-2 h-4 w-4" />
        {isDownloading ? "Downloading..." : "Download"}
      </Button>
    </div>
  )
}

