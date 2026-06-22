#!/usr/bin/env node
/**
 * scripts/setup-rich-menu.mjs
 *
 * One-off script to create and activate the REFFORTUNE rich menu on the LINE OA.
 * Run manually after deploying:
 *
 *   node scripts/setup-rich-menu.mjs
 *
 * Prerequisites:
 *   - LINE_MESSAGING_CHANNEL_ACCESS_TOKEN set in env / .env.local
 *   - NEXT_PUBLIC_LIFF_ID set (for deep links)
 *   - NEXT_PUBLIC_SITE_ORIGIN set (fallback for deep links)
 *   - A 2500×1686 PNG image at scripts/rich-menu.png
 *     (create this asset separately; see LINE docs for design specs)
 *
 * Rich menu spec: 2500×1686 px, 6 areas (3 cols × 2 rows)
 * Area size per cell: 833×843 px
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ── Config ────────────────────────────────────────────────────────────────────
const TOKEN = process.env.LINE_MESSAGING_CHANNEL_ACCESS_TOKEN;
const LIFF_ID = process.env.NEXT_PUBLIC_LIFF_ID ?? "";
const ORIGIN = (process.env.NEXT_PUBLIC_SITE_ORIGIN ?? "https://www.reffortune.com").replace(/\/$/, "");

if (!TOKEN) {
  console.error("❌  LINE_MESSAGING_CHANNEL_ACCESS_TOKEN is not set.");
  process.exit(1);
}

function deepLink(path_) {
  return LIFF_ID ? `https://liff.line.me/${LIFF_ID}${path_}` : `${ORIGIN}${path_}`;
}

const LINE_API = "https://api.line.me/v2/bot";
const headers = {
  Authorization: `Bearer ${TOKEN}`,
  "Content-Type": "application/json",
};

// ── Rich menu definition ──────────────────────────────────────────────────────
const richMenuBody = {
  size: { width: 2500, height: 1686 },
  selected: true,
  name: "REFFORTUNE Main Menu",
  chatBarText: "เมนู ✨",
  areas: [
    // Row 1
    {
      bounds: { x: 0,    y: 0,   width: 833, height: 843 },
      action: { type: "uri", label: "ไพ่รายวัน", uri: deepLink("/daily-card") },
    },
    {
      bounds: { x: 833,  y: 0,   width: 834, height: 843 },
      action: { type: "uri", label: "ทาโรต์", uri: deepLink("/tarot") },
    },
    {
      bounds: { x: 1667, y: 0,   width: 833, height: 843 },
      action: { type: "uri", label: "ดูดวง", uri: deepLink("/astrology") },
    },
    // Row 2
    {
      bounds: { x: 0,    y: 843, width: 833, height: 843 },
      action: { type: "uri", label: "ตั้งค่าแจ้งเตือน", uri: deepLink("/profile") },
    },
    {
      bounds: { x: 833,  y: 843, width: 834, height: 843 },
      action: { type: "uri", label: "เติมเครดิต", uri: deepLink("/pricing") },
    },
    {
      bounds: { x: 1667, y: 843, width: 833, height: 843 },
      action: { type: "uri", label: "โปรไฟล์", uri: deepLink("/profile") },
    },
  ],
};

async function apiPost(endpoint, body) {
  const res = await fetch(`${LINE_API}${endpoint}`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`POST ${endpoint} failed (${res.status}): ${err}`);
  }
  return res.json();
}

async function apiDelete(endpoint) {
  const res = await fetch(`${LINE_API}${endpoint}`, { method: "DELETE", headers });
  if (!res.ok && res.status !== 404) {
    const err = await res.text();
    throw new Error(`DELETE ${endpoint} failed (${res.status}): ${err}`);
  }
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  console.log("🟢  Creating rich menu…");
  const { richMenuId } = await apiPost("/richmenu", richMenuBody);
  console.log(`   ✅  richMenuId = ${richMenuId}`);

  // Upload image
  const imagePath = path.join(__dirname, "rich-menu.png");
  if (!fs.existsSync(imagePath)) {
    console.warn(`⚠️   Image not found at ${imagePath}`);
    console.warn("    Create a 2500×1686 PNG there and re-run to upload it.");
    console.warn(`    Rich menu ID ${richMenuId} created but has no image.`);
    return;
  }

  console.log("📸  Uploading rich menu image…");
  const imageBuffer = fs.readFileSync(imagePath);
  const uploadRes = await fetch(`${LINE_API}/richmenu/${richMenuId}/content`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "Content-Type": "image/png",
    },
    body: imageBuffer,
  });
  if (!uploadRes.ok) {
    const err = await uploadRes.text();
    throw new Error(`Image upload failed (${uploadRes.status}): ${err}`);
  }
  console.log("   ✅  Image uploaded.");

  console.log("🔗  Setting as default rich menu…");
  const setRes = await fetch(`${LINE_API}/user/all/richmenu/${richMenuId}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${TOKEN}` },
  });
  if (!setRes.ok) {
    const err = await setRes.text();
    throw new Error(`Set default failed (${setRes.status}): ${err}`);
  }
  console.log("   ✅  Default rich menu set.");

  console.log(`\n🎉  Done! Rich menu ${richMenuId} is now active for all users.`);
  console.log("    To update: edit this script, run again, then delete the old menu:");
  console.log(`    curl -X DELETE ${LINE_API}/richmenu/<old_id> -H "Authorization: Bearer $TOKEN"`);
}

main().catch((err) => {
  console.error("❌  Error:", err.message);
  process.exit(1);
});
