import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "REFFORTUNE — ดูดวงกับเรฟ",
    short_name: "REFFORTUNE",
    description:
      "ดูดวงไพ่ทาโรต์ โหราศาสตร์ ไพ่ Oracle และวิเคราะห์เบอร์มงคล คำแนะนำแม่นยำ ใช้ได้จริง",
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
