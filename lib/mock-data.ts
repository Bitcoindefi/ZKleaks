import type { Post } from "@/types"

export const MOCK_POSTS: Post[] = [
  {
    id: "p3",
    title: "Emails obra pública (extracto)",
    excerpt: "PDFs y audios. Cambios de pliegos…",
    cid: "bafybeipdf…",
    onchainRef: "0xaaa999…",
    tags: ["obra pública", "emails"],
    createdAt: "2025-08-21T09:00:00Z",
    hasMedia: true,
    verified: true,
  },
  {
    id: "p2",
    title: "Plan vigilancia en escuelas",
    excerpt: "Cámaras + reconocimiento…",
    cid: "bafybeihash…",
    onchainRef: "0xdef456…",
    tags: ["vigilancia", "educación"],
    createdAt: "2025-08-10T14:30:00Z",
    hasMedia: false,
    verified: false,
  },
  {
    id: "p1",
    title: "Contratos compras 2023",
    excerpt: "Sobreprecios y adjudicaciones directas…",
    cid: "bafybeigdyr…",
    onchainRef: "0xabc123…",
    tags: ["corrupción", "contrataciones"],
    createdAt: "2025-05-20T10:00:00Z",
    hasMedia: true,
    verified: true,
  },
]
