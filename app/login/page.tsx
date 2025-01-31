import { LoginForm } from "@/components/login-form"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Login to YouTube Clone</h1>
        <LoginForm />
      </div>
    </div>
  )
}

