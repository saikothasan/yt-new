import { VideoPlayer } from "@/components/video-player"
import { RelatedVideos } from "@/components/related-videos"
import { CommentsSection } from "@/components/comments-section"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"

export default function WatchPage({
  searchParams,
}: {
  searchParams: { v: string }
}) {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6 sm:ml-16 lg:ml-64">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <VideoPlayer videoId={searchParams.v} />
              <div>
                <h2 className="text-xl font-semibold mb-4">Comments</h2>
                <CommentsSection videoId={searchParams.v} />
              </div>
            </div>
            <div className="lg:col-span-1">
              <h2 className="text-xl font-semibold mb-4">Related Videos</h2>
              <RelatedVideos videoId={searchParams.v} />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

