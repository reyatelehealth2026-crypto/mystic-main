"use client";

import React, { useEffect, useState } from "react";
import QRCode from "qrcode";
import { cn } from "@/lib/cn";

interface QRCodeImageProps {
  value: string;
  size?: number;
  className?: string;
  fg?: string;
  bg?: string;
}

export function QRCodeImage({
  value,
  size = 72,
  className,
  fg = "#5b21b6",
  bg = "#ffffff",
}: QRCodeImageProps) {
  const [dataUrl, setDataUrl] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    QRCode.toDataURL(value, {
      width: size * 2,
      margin: 1,
      errorCorrectionLevel: "M",
      color: { dark: fg, light: bg },
    })
      .then((url) => {
        if (!cancelled) setDataUrl(url);
      })
      .catch(() => {
        if (!cancelled) setDataUrl(null);
      });
    return () => {
      cancelled = true;
    };
  }, [value, size, fg, bg]);

  if (!dataUrl) {
    return (
      <div
        className={cn("rounded-lg bg-violet-50", className)}
        style={{ width: size, height: size }}
        aria-hidden
      />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={dataUrl}
      alt=""
      width={size}
      height={size}
      className={cn("rounded-lg", className)}
      style={{ width: size, height: size }}
    />
  );
}
