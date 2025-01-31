import { NextResponse } from "next/server"
import { generateToken } from "@/lib/auth"

// This is a mock user database. In a real application, you'd use a proper database.
const users = [
  { id: "1", username: "user1", password: "password1" },
  { id: "2", username: "user2", password: "password2" },
]

export async function POST(request: Request) {
  const { username, password } = await request.json()

  if (users.some((u) => u.username === username)) {
    return NextResponse.json({ error: "Username already exists" }, { status: 400 })
  }

  const newUser = { id: String(users.length + 1), username, password }
  users.push(newUser)

  const token = generateToken(newUser.id)
  return NextResponse.json({ token })
}

