import { Suspense } from "react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { VideoContent } from "@/components/video-content"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6 sm:ml-16 lg:ml-64">
          <Suspense fallback={<div>Loading...</div>}>
            <VideoContent />
          </Suspense>
        </main>
      </div>
    </div>
  )
}

