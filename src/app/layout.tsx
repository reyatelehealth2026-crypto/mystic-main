import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import { BottomTabBar } from "@/components/nav/BottomTabBar";
import { ThemeProvider } from "@/lib/theme/ThemeProvider";
import { MemphisBackground } from "@/components/effects/MemphisBackground";

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

const SITE_URL = "https://www.reffortune.com";
const SITE_NAME = "REFFORTUNE";
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
  authors: [{ name: "REFFORTUNE", url: "https://www.reffortune.com" }],
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
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "REFFORTUNE — ดูดวงออนไลน์ แม่นยำ ครบวงจร",
      },
      {
        url: "/logo.png",
        width: 400,
        height: 400,
        alt: "REFFORTUNE Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    creator: "@reffortune",
    site: "@reffortune",
    images: ["/og-image.jpg"],
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
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
    yahoo: "your-yahoo-verification-code",
  },
  other: {
    "facebook-domain-verification": "your-facebook-verification-code",
    "msvalidate.01": "your-bing-verification-code",
  },
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
          // Handle dynamic theme override from localStorage
          dangerouslySetInnerHTML={{
            __html: `(() => {
  try {
    const LS_LANGUAGE = "mf:language";
    const LS_THEME = "mf:theme";

    // Set defaults only if not exists
    if (localStorage.getItem(LS_LANGUAGE) == null) {
      localStorage.setItem(LS_LANGUAGE, JSON.stringify("th"));
    }
    if (localStorage.getItem(LS_THEME) == null) {
      localStorage.setItem(LS_THEME, JSON.stringify("light"));
    }

    const theme = JSON.parse(localStorage.getItem(LS_THEME) || '"light"');
    const el = document.documentElement;
    if (theme === "system") el.removeAttribute("data-theme");
    else el.setAttribute("data-theme", theme);
  } catch (e) {}
})();`,
          }}
        />
      </head>
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased bg-bg pb-20 text-fg`}>
        <ThemeProvider>
          <MemphisBackground />
          {children}
          <SpeedInsights />
          <Analytics />
          <BottomTabBar />
        </ThemeProvider>
      </body>
    </html>
  );
}
