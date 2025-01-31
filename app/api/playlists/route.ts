import { NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth"

// This is a mock database. In a real application, you'd use a proper database.
const playlists: { id: string; userId: string; name: string; videos: string[] }[] = []

export async function GET(request: Request) {
  const token = request.headers.get("Authorization")?.split(" ")[1]
  const user = token ? verifyToken(token) : null

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const userPlaylists = playlists.filter((playlist) => playlist.userId === user.userId)
  return NextResponse.json(userPlaylists)
}

export async function POST(request: Request) {
  const token = request.headers.get("Authorization")?.split(" ")[1]
  const user = token ? verifyToken(token) : null

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { name } = await request.json()

  if (!name) {
    return NextResponse.json({ error: "Playlist name is required" }, { status: 400 })
  }

  const newPlaylist = {
    id: String(playlists.length + 1),
    userId: user.userId,
    name,
    videos: [],
  }

  playlists.push(newPlaylist)
  return NextResponse.json(newPlaylist)
}

