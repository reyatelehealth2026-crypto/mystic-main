"use client";

import * as React from "react";
import { Button, ButtonProps } from "./Button";

export interface ShareData {
  title: string;
  text: string;
  url: string;
}

interface ShareButtonProps extends ButtonProps {
  shareData: ShareData;
  onShareSuccess?: () => void;
}

export function ShareButton({ shareData, onShareSuccess, children, ...props }: ShareButtonProps) {
  const [copied, setCopied] = React.useState(false);

  const handleShare = async () => {
    // 1. Try Web Share API (Mobile / Modern Browsers)
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: shareData.title,
          text: shareData.text,
          url: shareData.url,
        });
        onShareSuccess?.();
        return;
      } catch (err) {
        // User cancelled or share failed, fallback to copy
        console.log("Share failed or cancelled:", err);
      }
    }

    // 2. Fallback: Copy to Clipboard
    try {
      const fullText = `${shareData.title}\n${shareData.text}\n${shareData.url}`;
      await navigator.clipboard.writeText(fullText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      onShareSuccess?.();
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <Button onClick={handleShare} {...props}>
      {copied ? (
        <span className="flex items-center gap-1.5">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          Copied!
        </span>
      ) : (
        children || (
          <span className="flex items-center gap-1.5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
              <polyline points="16 6 12 2 8 6" />
              <line x1="12" y1="2" x2="12" y2="15" />
            </svg>
            Share
          </span>
        )
      )}
    </Button>
  );
}
