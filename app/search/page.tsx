import { Suspense } from "react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { SearchResults } from "@/components/search-results"

export default function SearchPage({
  searchParams,
}: {
  searchParams: { q: string }
}) {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6 sm:ml-16 lg:ml-64">
          <Suspense fallback={<div>Loading...</div>}>
            <SearchResults query={searchParams.q} />
          </Suspense>
        </main>
      </div>
    </div>
  )
}

