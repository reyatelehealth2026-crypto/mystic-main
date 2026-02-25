"use client";

import * as React from "react";
import Link from "next/link";
import { Card, CardTitle, CardDesc } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";
import { Button } from "@/components/ui/Button";

type Language = "en" | "th";
type ThemeChoice = "system" | "light" | "dark";

const LS_LANGUAGE = "mf:language";
const LS_THEME = "mf:theme";
const LS_DAILY_REMINDER = "mf:dailyReminder";

function readLS<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (raw == null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeLS(key: string, value: unknown) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore
  }
}

function applyTheme(choice: ThemeChoice) {
  const el = document.documentElement;
  if (choice === "system") {
    el.removeAttribute("data-theme");
  } else {
    el.setAttribute("data-theme", choice);
  }
}

function Switch({
  checked,
  onCheckedChange,
  labelId,
}: {
  checked: boolean;
  onCheckedChange: (next: boolean) => void;
  labelId: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-labelledby={labelId}
      onClick={() => onCheckedChange(!checked)}
      className={
        "relative inline-flex h-8 w-14 items-center rounded-full border border-border transition-colors " +
        (checked ? "bg-accent-soft" : "bg-surface")
      }
    >
      <span
        aria-hidden="true"
        className={
          "inline-block h-6 w-6 translate-x-1 rounded-full bg-bg-elevated shadow-[var(--shadow-soft)] transition-transform " +
          (checked ? "translate-x-7" : "translate-x-1")
        }
      />
    </button>
  );
}

function Row({
  title,
  desc,
  right,
  id,
}: {
  title: React.ReactNode;
  desc?: React.ReactNode;
  right: React.ReactNode;
  id: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-4">
      <div className="min-w-0">
        <p id={id} className="truncate text-sm font-semibold text-fg">
          {title}
        </p>
        {desc ? <p className="mt-1 text-xs text-fg-muted">{desc}</p> : null}
      </div>
      <div className="shrink-0">{right}</div>
    </div>
  );
}

export function ProfileClient({ version }: { version?: string }) {
  const [language, setLanguage] = React.useState<Language>("th");
  const [theme, setTheme] = React.useState<ThemeChoice>("light");
  const [dailyReminder, setDailyReminder] = React.useState(false);
  const [loaded, setLoaded] = React.useState(false);

  React.useEffect(() => {
    const initialLang = readLS<Language>(LS_LANGUAGE, "th");
    const initialTheme = readLS<ThemeChoice>(LS_THEME, "light");
    const initialDaily = readLS<boolean>(LS_DAILY_REMINDER, false);

    setLanguage(initialLang);
    setTheme(initialTheme);
    setDailyReminder(initialDaily);
    setLoaded(true);

    applyTheme(initialTheme);
  }, []);

  React.useEffect(() => {
    if (!loaded) return;
    writeLS(LS_LANGUAGE, language);
  }, [language, loaded]);

  React.useEffect(() => {
    if (!loaded) return;
    writeLS(LS_THEME, theme);
    if (typeof document !== "undefined") applyTheme(theme);
  }, [theme, loaded]);

  React.useEffect(() => {
    if (!loaded) return;
    writeLS(LS_DAILY_REMINDER, dailyReminder);
  }, [dailyReminder, loaded]);

  return (
    <div className="px-5 pb-8">
      <div className="space-y-4">
        {/* Account */}
        <Card className="p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <CardTitle>Account</CardTitle>
              <CardDesc className="mt-1">
                {language === "th"
                  ? "คุณกำลังใช้งานแบบผู้เยี่ยมชม"
                  : "You are currently browsing as a guest."}
              </CardDesc>
            </div>
            <Chip selected>{language === "th" ? "ผู้เยี่ยมชม" : "Guest"}</Chip>
          </div>

          <div className="mt-4">
            <Button variant="secondary" size="md" disabled aria-disabled="true">
              {language === "th" ? "เข้าสู่ระบบ (เร็ว ๆ นี้)" : "Sign in (soon)"}
            </Button>
          </div>
        </Card>

        {/* Settings */}
        <Card className="p-5">
          <CardTitle>{language === "th" ? "การตั้งค่า" : "Settings"}</CardTitle>

          <div className="mt-2 divide-y divide-border">
            <Row
              id="setting-language"
              title={language === "th" ? "ภาษา" : "Language"}
              desc={language === "th" ? "แค่หน้าตา UI (ยังไม่ใช่ i18n เต็ม)" : "UI-only (no full i18n)."}
              right={
                <div className="flex items-center gap-2" aria-label="Language">
                  <Chip
                    selected={language === "th"}
                    aria-pressed={language === "th"}
                    onClick={() => setLanguage("th")}
                  >
                    ไทย
                  </Chip>
                  <Chip
                    selected={language === "en"}
                    aria-pressed={language === "en"}
                    onClick={() => setLanguage("en")}
                  >
                    English
                  </Chip>
                </div>
              }
            />

            <Row
              id="setting-theme"
              title={language === "th" ? "ธีม" : "Theme"}
              desc={language === "th" ? "ระบบ / สว่าง / มืด" : "System / Light / Dark."}
              right={
                <div className="flex items-center gap-2" aria-label="Theme">
                  <Chip
                    selected={theme === "system"}
                    aria-pressed={theme === "system"}
                    onClick={() => setTheme("system")}
                  >
                    {language === "th" ? "ระบบ" : "System"}
                  </Chip>
                  <Chip
                    selected={theme === "light"}
                    aria-pressed={theme === "light"}
                    onClick={() => setTheme("light")}
                  >
                    {language === "th" ? "สว่าง" : "Light"}
                  </Chip>
                  <Chip
                    selected={theme === "dark"}
                    aria-pressed={theme === "dark"}
                    onClick={() => setTheme("dark")}
                  >
                    {language === "th" ? "มืด" : "Dark"}
                  </Chip>
                </div>
              }
            />

            <Row
              id="setting-daily"
              title={language === "th" ? "การแจ้งเตือน" : "Notifications"}
              desc={
                language === "th"
                  ? "เตือนรายวัน (UI อย่างเดียว)"
                  : "Daily reminder (UI only)."
              }
              right={
                <Switch
                  labelId="setting-daily"
                  checked={dailyReminder}
                  onCheckedChange={setDailyReminder}
                />
              }
            />
          </div>
        </Card>

        {/* About */}
        <Card className="p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <CardTitle>{language === "th" ? "เกี่ยวกับ" : "About"}</CardTitle>
              <CardDesc className="mt-1">
                {version ? (language === "th" ? `เวอร์ชัน ${version}` : `Version ${version}`) : null}
              </CardDesc>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <Link href="/privacy" className="block">
              <Button variant="ghost" className="w-full">
                {language === "th" ? "ความเป็นส่วนตัว" : "Privacy"}
              </Button>
            </Link>
            <Link href="/terms" className="block">
              <Button variant="ghost" className="w-full">
                {language === "th" ? "ข้อกำหนด" : "Terms"}
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
