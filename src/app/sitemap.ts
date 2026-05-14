import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.reffortune.com";
  const now = new Date();
  const weekly = "weekly" as const;
  const daily = "daily" as const;
  const monthly = "monthly" as const;

  return [
    { url: baseUrl, lastModified: now, changeFrequency: weekly, priority: 1.0 },

    // Core verticals
    { url: `${baseUrl}/tarot`, lastModified: now, changeFrequency: weekly, priority: 0.9 },
    { url: `${baseUrl}/spirit-card`, lastModified: now, changeFrequency: weekly, priority: 0.8 },
    { url: `${baseUrl}/spirit-path`, lastModified: now, changeFrequency: weekly, priority: 0.8 },
    { url: `${baseUrl}/numerology`, lastModified: now, changeFrequency: weekly, priority: 0.8 },
    { url: `${baseUrl}/name-numerology`, lastModified: now, changeFrequency: weekly, priority: 0.8 },
    { url: `${baseUrl}/daily-card`, lastModified: now, changeFrequency: daily, priority: 0.8 },
    { url: `${baseUrl}/love-tarot`, lastModified: now, changeFrequency: weekly, priority: 0.8 },
    { url: `${baseUrl}/horoscope`, lastModified: now, changeFrequency: daily, priority: 0.8 },
    { url: `${baseUrl}/compatibility`, lastModified: now, changeFrequency: weekly, priority: 0.8 },
    { url: `${baseUrl}/chinese-zodiac`, lastModified: now, changeFrequency: weekly, priority: 0.8 },
    { url: `${baseUrl}/specialized`, lastModified: now, changeFrequency: weekly, priority: 0.7 },
    { url: `${baseUrl}/esiimsi`, lastModified: now, changeFrequency: weekly, priority: 0.7 },
    { url: `${baseUrl}/wallpaper`, lastModified: now, changeFrequency: weekly, priority: 0.7 },

    // Support pages
    { url: `${baseUrl}/pricing`, lastModified: now, changeFrequency: monthly, priority: 0.7 },
    { url: `${baseUrl}/library`, lastModified: now, changeFrequency: monthly, priority: 0.6 },
    { url: `${baseUrl}/explore`, lastModified: now, changeFrequency: weekly, priority: 0.6 },
  ];
}
