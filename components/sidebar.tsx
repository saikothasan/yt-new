import Link from "next/link"
import {
  Home,
  PlaySquare,
  History,
  Clock,
  ThumbsUp,
  Flame,
  ShoppingBag,
  Music2,
  Film,
  Radio,
  Gamepad2,
  Newspaper,
  Trophy,
  Shirt,
  Podcast,
} from "lucide-react"

export function Sidebar() {
  return (
    <aside className="w-16 lg:w-64 fixed h-[calc(100vh-4rem)] overflow-y-auto pb-4 border-r bg-background hidden sm:block">
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="space-y-1">
            <Link
              href="/"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            >
              <Home className="h-5 w-5" />
              <span className="hidden lg:inline">Home</span>
            </Link>
            <Link
              href="/shorts"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            >
              <PlaySquare className="h-5 w-5" />
              <span className="hidden lg:inline">Shorts</span>
            </Link>
          </div>
        </div>
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold hidden lg:block">You</h2>
          <div className="space-y-1">
            <Link
              href="/history"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            >
              <History className="h-5 w-5" />
              <span className="hidden lg:inline">History</span>
            </Link>
            <Link
              href="/watch-later"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            >
              <Clock className="h-5 w-5" />
              <span className="hidden lg:inline">Watch later</span>
            </Link>
            <Link
              href="/liked"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            >
              <ThumbsUp className="h-5 w-5" />
              <span className="hidden lg:inline">Liked videos</span>
            </Link>
          </div>
        </div>
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold hidden lg:block">Explore</h2>
          <div className="space-y-1">
            <Link
              href="/trending"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            >
              <Flame className="h-5 w-5" />
              <span className="hidden lg:inline">Trending</span>
            </Link>
            <Link
              href="/shopping"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            >
              <ShoppingBag className="h-5 w-5" />
              <span className="hidden lg:inline">Shopping</span>
            </Link>
            <Link
              href="/music"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            >
              <Music2 className="h-5 w-5" />
              <span className="hidden lg:inline">Music</span>
            </Link>
            <Link
              href="/movies"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            >
              <Film className="h-5 w-5" />
              <span className="hidden lg:inline">Movies & TV</span>
            </Link>
            <Link
              href="/live"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            >
              <Radio className="h-5 w-5" />
              <span className="hidden lg:inline">Live</span>
            </Link>
            <Link
              href="/gaming"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            >
              <Gamepad2 className="h-5 w-5" />
              <span className="hidden lg:inline">Gaming</span>
            </Link>
            <Link
              href="/news"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            >
              <Newspaper className="h-5 w-5" />
              <span className="hidden lg:inline">News</span>
            </Link>
            <Link
              href="/sports"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            >
              <Trophy className="h-5 w-5" />
              <span className="hidden lg:inline">Sports</span>
            </Link>
            <Link
              href="/fashion"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            >
              <Shirt className="h-5 w-5" />
              <span className="hidden lg:inline">Fashion & Beauty</span>
            </Link>
            <Link
              href="/podcasts"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            >
              <Podcast className="h-5 w-5" />
              <span className="hidden lg:inline">Podcasts</span>
            </Link>
          </div>
        </div>
      </div>
    </aside>
  )
}

