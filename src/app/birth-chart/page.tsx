import type { Metadata } from "next";
import BirthChartIntroClient from "./IntroClient";

export const metadata: Metadata = {
  title: "ผูกดวงพิชัยสงคราม — ดวงไทยจากวัน-เวลา-สถานที่เกิด",
  description:
    "ผูกดวงพิชัยสงครามแบบไทย คำนวณลัคนา ภพ ๑๒ ราศีอาทิตย์ และดาวประจำวันเกิด พร้อมคำทำนายจากตำราโหราศาสตร์ไทย ไม่ใช้ AI",
  alternates: { canonical: "/birth-chart" },
};

export default function BirthChartPage() {
  return <BirthChartIntroClient />;
}
