"use client"

import { useMemo, useState } from "react"
import { Search, Filter, ExternalLink, Shield, Flag, Calendar, FileText, ImageIcon } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MOCK_POSTS } from "@/lib/mock-data"
import type { Post } from "@/types"

function formatDate(dateString: string): string {
  try {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  } catch {
    return dateString
  }
}

function matchesFilters(
  post: Post,
  query: string,
  selectedTag: string | null,
  mediaOnly: boolean,
  verifiedOnly: boolean,
): boolean {
  const searchText = (post.title + "\n" + post.excerpt + "\n" + post.tags.join(" ")).toLowerCase()
  const matchesQuery = query ? searchText.includes(query.toLowerCase()) : true
  const matchesTag = selectedTag ? post.tags.includes(selectedTag) : true
  const matchesMedia = mediaOnly ? !!post.hasMedia : true
  const matchesVerified = verifiedOnly ? !!post.verified : true

  return matchesQuery && matchesTag && matchesMedia && matchesVerified
}

export function PostsList() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTag, setSelectedTag] = useState("")
  const [mediaOnly, setMediaOnly] = useState(false)
  const [verifiedOnly, setVerifiedOnly] = useState(false)

  // Get all unique tags for filter dropdown
  const allTags = useMemo(() => {
    return Array.from(new Set(MOCK_POSTS.flatMap((post) => post.tags))).sort()
  }, [])

  // Filter and sort posts
  const filteredPosts = useMemo(() => {
    return MOCK_POSTS.filter((post) =>
      matchesFilters(post, searchQuery, selectedTag || null, mediaOnly, verifiedOnly),
    ).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }, [searchQuery, selectedTag, mediaOnly, verifiedOnly])

  const handleReport = (postId: string) => {
    // TODO: Implement actual reporting functionality
    alert(`Post ${postId} reported for review`)
  }

  return (
    <Card className="rounded-2xl shadow-lg border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-xl">
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
          Leaked Documents
          <span className="text-sm font-normal text-slate-500 dark:text-slate-400">
            ({filteredPosts.length} {filteredPosts.length === 1 ? "post" : "posts"})
          </span>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Filters */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Search */}
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Search leaks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Tag Filter */}
            <div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <select
                  className="w-full pl-10 pr-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 appearance-none"
                  value={selectedTag}
                  onChange={(e) => setSelectedTag(e.target.value)}
                >
                  <option value="">All Topics</option>
                  {allTags.map((tag) => (
                    <option key={tag} value={tag}>
                      {tag}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Checkboxes */}
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={mediaOnly}
                  onChange={(e) => setMediaOnly(e.target.checked)}
                  className="rounded border-slate-300 dark:border-slate-600"
                />
                Media Only
              </label>
              <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={verifiedOnly}
                  onChange={(e) => setVerifiedOnly(e.target.checked)}
                  className="rounded border-slate-300 dark:border-slate-600"
                />
                Verified
              </label>
            </div>
          </div>
        </div>

        {/* Posts List */}
        <div className="space-y-4">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
              <p className="text-slate-600 dark:text-slate-400">No posts match your current filters.</p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("")
                  setSelectedTag("")
                  setMediaOnly(false)
                  setVerifiedOnly(false)
                }}
                className="mt-3"
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            filteredPosts.map((post) => (
              <div
                key={post.id}
                className="border border-slate-200 dark:border-slate-700 rounded-xl p-6 bg-white/50 dark:bg-slate-900/50 hover:bg-white/80 dark:hover:bg-slate-900/80 transition-colors"
              >
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                  {/* Main Content */}
                  <div className="lg:col-span-3 space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 leading-tight">
                        {post.title}
                      </h3>
                      <div className="flex items-center gap-2 shrink-0">
                        {post.hasMedia && (
                          <div className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400">
                            <ImageIcon className="w-3 h-3" />
                            Media
                          </div>
                        )}
                        {post.verified && (
                          <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                            <Shield className="w-3 h-3" />
                            Verified
                          </div>
                        )}
                      </div>
                    </div>

                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{post.excerpt}</p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 text-xs bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-full border border-slate-200 dark:border-slate-600"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Metadata & Actions */}
                  <div className="lg:col-span-1 space-y-3">
                    <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                      <Calendar className="w-4 h-4" />
                      {formatDate(post.createdAt)}
                    </div>

                    <div className="space-y-2">
                      {post.cid && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full gap-2 text-xs bg-transparent"
                          onClick={() => window.open(`https://ipfs.io/ipfs/${post.cid}`, "_blank")}
                        >
                          <ExternalLink className="w-3 h-3" />
                          View Document
                        </Button>
                      )}

                      {post.onchainRef && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full gap-2 text-xs bg-transparent"
                          onClick={() => window.open(`#tx/${post.onchainRef}`, "_blank")}
                        >
                          <Shield className="w-3 h-3" />
                          Verify On-Chain
                        </Button>
                      )}

                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full gap-2 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                        onClick={() => handleReport(post.id)}
                      >
                        <Flag className="w-3 h-3" />
                        Report
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
