import { NextResponse } from "next/server"
import { generateToken } from "@/lib/auth"

// This is a mock user database. In a real application, you'd use a proper database.
const users = [
  { id: "1", username: "user1", password: "password1" },
  { id: "2", username: "user2", password: "password2" },
]

export async function POST(request: Request) {
  const { username, password } = await request.json()

  const user = users.find((u) => u.username === username && u.password === password)

  if (user) {
    const token = generateToken(user.id)
    return NextResponse.json({ token })
  } else {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
  }
}

