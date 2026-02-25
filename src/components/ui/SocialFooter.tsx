"use client";

import Link from "next/link";
import { Facebook, Instagram, MessageCircle, Video } from "lucide-react";
import { useTheme } from "@/lib/theme/ThemeProvider";
import { cn } from "@/lib/cn";

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
  const { theme } = useTheme();
  const isPastel = theme === "pastel";

  return (
    <footer className="px-5 pb-20 pt-8 text-center">
      <div className={cn("h-px w-full mb-8", isPastel ? "bg-white/20" : "bg-gray-100")} />
      
      <h3 className={cn("text-sm font-medium mb-4", isPastel ? "text-white/80" : "text-gray-500")}>
        ติดตามเราได้ที่
      </h3>
      
      <div className="flex justify-center gap-4 mb-6">
        {socials.map((social) => (
          <Link
            key={social.name}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "p-3 rounded-full transition-all active:scale-95 flex items-center justify-center",
              isPastel 
                ? "bg-white/20 backdrop-blur hover:bg-white/30 text-white border border-white/20" 
                : "bg-white hover:bg-gray-50 text-gray-600 border border-gray-100 shadow-sm"
            )}
            aria-label={social.name}
          >
            <social.icon size={20} strokeWidth={1.5} />
          </Link>
        ))}
      </div>

      <div className={cn("text-xs space-y-2", isPastel ? "text-white/60" : "text-gray-400")}>
        <p>© 2026 MysticFlow by Reffortune</p>
        <div className="flex justify-center gap-3">
            <Link href="/terms" className="hover:underline opacity-80 hover:opacity-100">ข้อกำหนด</Link>
            <span className="opacity-50">•</span>
            <Link href="/privacy" className="hover:underline opacity-80 hover:opacity-100">นโยบายความเป็นส่วนตัว</Link>
        </div>
      </div>
    </footer>
  );
}
