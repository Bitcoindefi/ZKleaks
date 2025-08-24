import { DonationCard } from "@/components/donation-card"
import { LeakComposer } from "@/components/leak-composer"
import { PostsList } from "@/components/posts-list"

export default function ZKLeaksApp() {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <header className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
            <h1 className="text-5xl font-bold gradient-text">ZKLeaks</h1>
            <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse" />
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Secure, anonymous whistleblowing platform powered by{" "}
            <span className="font-semibold text-blue-600 dark:text-blue-400">Midnight blockchain</span> and{" "}
            <span className="font-semibold text-purple-600 dark:text-purple-400">IPFS</span>
          </p>
          <div className="mt-6 flex items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span>End-to-End Encrypted</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full" />
              <span>Blockchain Verified</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full" />
              <span>Decentralized Storage</span>
            </div>
          </div>
        </header>

        <div className="space-y-12">
          <div className="animate-slide-up" style={{ animationDelay: "0.1s" }}>
            <DonationCard />
          </div>
          <div className="animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <LeakComposer />
          </div>
          <div className="animate-slide-up" style={{ animationDelay: "0.3s" }}>
            <PostsList />
          </div>
        </div>

        <footer className="mt-20 text-center space-y-4 animate-fade-in">
          <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
          <div className="pt-8 pb-4">
            <p className="text-muted-foreground text-sm">Built with privacy and transparency in mind</p>
            <p className="text-xs text-muted-foreground/70 mt-2">Powered by Midnight Protocol • IPFS • Vercel</p>
          </div>
        </footer>
      </div>
    </div>
  )
}
