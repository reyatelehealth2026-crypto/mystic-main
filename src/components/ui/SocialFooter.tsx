"use client";

import Link from "next/link";
import { Facebook, Instagram, MessageCircle, Video } from "lucide-react";

const socials = [
  {
    name: "Facebook",
    label: "ดูดวงกับเรฟ",
    url: "https://www.facebook.com/reffortune",
    icon: Facebook,
  },
  {
    name: "Line OA",
    label: "@reffortune",
    url: "https://line.me/R/ti/p/@reffortune",
    icon: MessageCircle,
  },
  {
    name: "Instagram",
    label: "Refmade",
    url: "https://instagram.com/reffortune",
    icon: Instagram,
  },
  {
    name: "TikTok",
    label: "Refmade",
    url: "https://tiktok.com/@reffortune",
    icon: Video,
  },
];

export function SocialFooter() {
  return (
    <footer className="px-5 pb-20 pt-8 text-center">
      <div className="h-px w-full mb-8 bg-border" />

      <h3 className="text-sm font-medium mb-4 text-fg-muted">
        ติดตามเราได้ที่
      </h3>

      <div className="flex justify-center gap-4 mb-6">
        {socials.map((social) => (
          <Link
            key={social.name}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-full transition-all active:scale-95 flex items-center justify-center bg-surface hover:bg-bg-elevated text-fg-muted border border-border shadow-sm"
            aria-label={social.name}
          >
            <social.icon size={20} strokeWidth={1.5} />
          </Link>
        ))}
      </div>

      <div className="text-xs space-y-2 text-fg-muted">
        <p>© 2026 REFFORTUNE</p>
        <div className="flex justify-center gap-3">
          <Link href="/terms" className="hover:underline opacity-80 hover:opacity-100">ข้อกำหนด</Link>
          <span className="opacity-50">•</span>
          <Link href="/privacy" className="hover:underline opacity-80 hover:opacity-100">นโยบายความเป็นส่วนตัว</Link>
        </div>
      </div>
    </footer>
  );
}
