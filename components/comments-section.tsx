"use client"

import { useState, useEffect } from "react"
import { formatDate } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, ThumbsUp, ThumbsDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

interface Comment {
  id: string
  snippet: {
    topLevelComment: {
      snippet: {
        authorDisplayName: string
        authorProfileImageUrl: string
        textDisplay: string
        publishedAt: string
        likeCount: number
      }
    }
  }
}

interface CommentsSectionProps {
  videoId: string
}

export function CommentsSection({ videoId }: CommentsSectionProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [newComment, setNewComment] = useState("")

  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await fetch(`/api/videos/${videoId}/comments`)
        if (!response.ok) {
          throw new Error("Failed to fetch comments")
        }
        const data = await response.json()
        if (data.error) {
          throw new Error(data.error)
        }
        setComments(data.items || [])
      } catch (error) {
        setError(error instanceof Error ? error.message : "An error occurred")
        console.error("Error fetching comments:", error)
      }
      setLoading(false)
    }

    if (videoId) {
      fetchComments()
    }
  }, [videoId])

  const handleAddComment = async () => {
    if (!newComment.trim()) return

    try {
      const response = await fetch(`/api/videos/${videoId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ text: newComment }),
      })

      if (!response.ok) {
        throw new Error("Failed to add comment")
      }

      const addedComment = await response.json()
      setComments([addedComment, ...comments])
      setNewComment("")
    } catch (error) {
      console.error("Error adding comment:", error)
      setError("Failed to add comment. Please try again.")
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
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex space-x-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Textarea placeholder="Add a comment..." value={newComment} onChange={(e) => setNewComment(e.target.value)} />
        <Button onClick={handleAddComment}>Comment</Button>
      </div>
      {comments.map((comment) => (
        <div key={comment.id} className="flex space-x-4">
          <img
            src={comment.snippet.topLevelComment.snippet.authorProfileImageUrl || "/placeholder.svg"}
            alt={comment.snippet.topLevelComment.snippet.authorDisplayName}
            className="h-10 w-10 rounded-full"
          />
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <span className="font-semibold">{comment.snippet.topLevelComment.snippet.authorDisplayName}</span>
              <span className="text-sm text-muted-foreground">
                {formatDate(comment.snippet.topLevelComment.snippet.publishedAt)}
              </span>
            </div>
            <p className="mt-1">{comment.snippet.topLevelComment.snippet.textDisplay}</p>
            <div className="flex items-center space-x-4 mt-2">
              <div className="flex items-center space-x-1">
                <ThumbsUp className="h-4 w-4" />
                <span className="text-sm">{comment.snippet.topLevelComment.snippet.likeCount}</span>
              </div>
              <ThumbsDown className="h-4 w-4" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

