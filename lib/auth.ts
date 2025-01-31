import { sign, verify } from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export function generateToken(userId: string): string {
  return sign({ userId }, JWT_SECRET, { expiresIn: "1d" })
}

export function verifyToken(token: string): { userId: string } | null {
  try {
    return verify(token, JWT_SECRET) as { userId: string }
  } catch (error) {
    return null
  }
}

