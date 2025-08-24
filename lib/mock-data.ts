import type { Post } from "@/types"

export const MOCK_POSTS: Post[] = [
  {
    id: "p1",
    title: "Collateral Murder - Iraq War Video",
    excerpt:
      "Classified US military video showing Apache helicopter attack in Baghdad that killed civilians including Reuters journalists...",
    cid: "bafybeicollateral…",
    onchainRef: "0x1a2b3c4d…",
    tags: ["war crimes", "iraq", "military", "civilians"],
    createdAt: "2010-04-05T12:00:00Z",
    hasMedia: true,
    verified: true,
  },
  {
    id: "p2",
    title: "Afghanistan War Logs",
    excerpt:
      "75,000 classified documents revealing unreported civilian casualties, Taliban attacks, and Pakistan's ISI involvement...",
    cid: "bafybeiaflogs…",
    onchainRef: "0x2b3c4d5e…",
    tags: ["afghanistan", "war logs", "casualties", "pakistan"],
    createdAt: "2010-07-25T14:30:00Z",
    hasMedia: false,
    verified: true,
  },
  {
    id: "p3",
    title: "Iraq War Logs",
    excerpt:
      "391,832 classified US military documents detailing torture, civilian deaths, and Iran's influence in Iraq...",
    cid: "bafybeiiraq…",
    onchainRef: "0x3c4d5e6f…",
    tags: ["iraq", "torture", "civilian deaths", "iran"],
    createdAt: "2010-10-22T16:00:00Z",
    hasMedia: true,
    verified: true,
  },
  {
    id: "p4",
    title: "Cablegate - US Diplomatic Cables",
    excerpt:
      "251,287 confidential diplomatic cables revealing US foreign policy, surveillance of UN officials, and diplomatic scandals...",
    cid: "bafybeicables…",
    onchainRef: "0x4d5e6f7a…",
    tags: ["diplomacy", "surveillance", "foreign policy", "UN"],
    createdAt: "2010-11-28T18:00:00Z",
    hasMedia: false,
    verified: true,
  },
  {
    id: "p5",
    title: "Vault 7 - CIA Hacking Tools",
    excerpt:
      "CIA's cyber warfare capabilities including malware, viruses, trojans, and zero-day exploits targeting phones, computers, and smart TVs...",
    cid: "bafybeivault7…",
    onchainRef: "0x5e6f7a8b…",
    tags: ["CIA", "hacking", "surveillance", "cyber warfare"],
    createdAt: "2017-03-07T10:00:00Z",
    hasMedia: true,
    verified: true,
  },
  {
    id: "p6",
    title: "Guantanamo Files",
    excerpt:
      "779 classified documents on Guantanamo Bay detainees revealing torture, indefinite detention without trial, and intelligence failures...",
    cid: "bafybeiguantanamo…",
    onchainRef: "0x6f7a8b9c…",
    tags: ["guantanamo", "torture", "detention", "human rights"],
    createdAt: "2011-04-25T09:00:00Z",
    hasMedia: false,
    verified: true,
  },
]
