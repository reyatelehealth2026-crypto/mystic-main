import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "REFFORTUNE — ดูดวงออนไลน์ แม่นยำ ครบวงจร",
    short_name: "REFFORTUNE",
    description:
      "ดูดวงออนไลน์ครบวงจร ไพ่ทาโรต์ โหราศาสตร์ นามมติ เลขศาสตร์ ดวงรายวัน ความรัก ฟรี! AI วิเคราะห์เชิงลึก วอลเปเปอร์เสริมดวง",
    start_url: "/",
    display: "standalone",
    background_color: "#140f28",
    theme_color: "#4c2889",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
