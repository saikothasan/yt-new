"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import type React from "react" // Added import for React

interface Playlist {
  id: string
  name: string
  videos: string[]
}

export function PlaylistManager() {
  const [playlists, setPlaylists] = useState<Playlist[]>([])
  const [newPlaylistName, setNewPlaylistName] = useState("")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchPlaylists()
  }, [])

  const fetchPlaylists = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch("/api/playlists", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (!response.ok) {
        throw new Error("Failed to fetch playlists")
      }
      const data = await response.json()
      setPlaylists(data)
    } catch (error) {
      setError("Failed to fetch playlists")
    }
  }

  const createPlaylist = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem("token")
      const response = await fetch("/api/playlists", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: newPlaylistName }),
      })
      if (!response.ok) {
        throw new Error("Failed to create playlist")
      }
      setNewPlaylistName("")
      fetchPlaylists()
    } catch (error) {
      setError("Failed to create playlist")
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

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Your Playlists</h2>
      <form onSubmit={createPlaylist} className="flex gap-2">
        <Input
          type="text"
          placeholder="New playlist name"
          value={newPlaylistName}
          onChange={(e) => setNewPlaylistName(e.target.value)}
          required
        />
        <Button type="submit">Create Playlist</Button>
      </form>
      <ul className="space-y-2">
        {playlists.map((playlist) => (
          <li key={playlist.id} className="flex justify-between items-center">
            <span>{playlist.name}</span>
            <span>{playlist.videos.length} videos</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

