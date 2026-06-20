import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import { BottomTabBar } from "@/components/nav/BottomTabBar";
import { ThemeProvider } from "@/lib/theme/ThemeProvider";
import { MemphisBackground } from "@/components/effects/MemphisBackground";
import { StoreHydrator } from "@/store/StoreHydrator";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { ConfirmHost } from "@/components/ui/ConfirmHost";
import { SITE_URL, SITE_NAME } from "@/lib/site";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const DEFAULT_TITLE = "REFFORTUNE — ดูดวงออนไลน์ แม่นยำ ครบวงจร | ไพ่ทาโรต์ โหราศาสตร์ นามมติ เลขศาสตร์";
const DEFAULT_DESCRIPTION =
  "ดูดวงออนไลน์ครบวงจรที่ REFFORTUNE ไพ่ทาโรต์ โหราศาสตร์ไทย นามมติ เลขศาสตร์ ดวงรายวัน ความรัก การงาน การเงิน ฟรี! พร้อม AI วิเคราะห์เชิงลึกแม่นยำ และวอลเปเปอร์เสริมดวง";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: DEFAULT_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  keywords: [
    "ดูดวง",
    "ดูดวงออนไลน์",
    "ไพ่ทาโรต์",
    "ไพ่ Oracle",
    "ดวงรายวัน",
    "โหราศาสตร์",
    "นามมติ",
    "เซียมซี",
    "Numerology",
    "เลขศาสตร์",
    "ดูดวงไพ่",
    "เปิดไพ่ทาโรต์",
    "ดูดวงความรัก",
    "ดูดวงการเงิน",
    "ดูดวงการงาน",
    "ดวงรายปี",
    "ดวงจีน",
    "ไพ่จิตวิญญาณ",
    "วอลเปเปอร์เสริมดวง",
    "AI ดูดวง",
    "REFFORTUNE",
    "Reffortune",
  ],
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: "REFFORTUNE Team",
  publisher: "REFFORTUNE",
  applicationName: "REFFORTUNE",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    locale: "th_TH",
    url: SITE_URL,
    // TODO(og): ship a dedicated 1200x630 og-image.jpg once design is ready.
    // The logo is a placeholder so the OG meta tags don't 404.
    images: [
      {
        url: "/logo.png",
        width: 400,
        height: 400,
        alt: "REFFORTUNE — ดูดวงออนไลน์ แม่นยำ ครบวงจร",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    creator: "@reffortune",
    site: "@reffortune",
    images: ["/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
    other: {
      rel: "apple-touch-icon-precomposed",
      url: "/logo.png",
    },
  },
  category: "lifestyle",
  // TODO(seo): re-add `verification` and platform-specific `other` keys once
  // real values are issued. The placeholder strings (`your-google-...`) were
  // rendering as live <meta> tags in production, which is worse than
  // emitting nothing at all.
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" data-theme="light">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <script
          // Pre-hydration: set data-theme from the same key ThemeProvider writes
          // ("reffortune-theme", plain string). Prevents FOUC of the data-theme
          // attribute on first paint. CSS variables for non-light themes are
          // still applied by ThemeProvider after mount.
          dangerouslySetInnerHTML={{
            __html: `(() => {
  try {
    var VALID = ["light", "pastel", "rainbow", "soft"];
    var stored = localStorage.getItem("reffortune-theme");
    var theme = stored && VALID.indexOf(stored) !== -1 ? stored : "light";
    document.documentElement.setAttribute("data-theme", theme);
  } catch (e) {}
})();`,
          }}
        />
      </head>
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased bg-bg pb-20 text-fg`}>
        <ThemeProvider>
          <StoreHydrator />
          <AuthProvider>
            <MemphisBackground />
            {children}
            <SpeedInsights />
            <Analytics />
            <BottomTabBar />
            <ConfirmHost />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
