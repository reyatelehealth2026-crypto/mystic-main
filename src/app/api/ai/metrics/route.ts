/**
 * AI Metrics API
 * 
 * Endpoint สำหรับดูสถิติคุณภาพคำตอบจาก AI
 * ใช้ตรวจสอบว่า enhanced prompts ทำงานได้ดีหรือไม่
 */

import { NextResponse } from "next/server";
import { 
  getValidationMetrics, 
  getValidationPassRate, 
  getFallbackUsageRate,
  getErrorLogs 
} from "@/lib/ai/validation";

export async function GET() {
  try {
    const metrics = getValidationMetrics();
    const passRate = getValidationPassRate();
    const fallbackRate = getFallbackUsageRate();
    const recentErrors = getErrorLogs({ limit: 10 });
    
    // Quality assessment
    let qualityStatus: 'excellent' | 'good' | 'poor' | 'no_data' = 'no_data';
    let qualityMessage = 'ยังไม่มีข้อมูล - เริ่มใช้งานเพื่อเก็บสถิติ';
    
    if (passRate !== null) {
      if (passRate >= 95) {
        qualityStatus = 'excellent';
        qualityMessage = 'คุณภาพดีเยี่ยม - AI ตอบได้ดีมาก';
      } else if (passRate >= 80) {
        qualityStatus = 'good';
        qualityMessage = 'คุณภาพดี - บางคำตอบต้องปรับปรุง';
      } else {
        qualityStatus = 'poor';
        qualityMessage = 'คุณภาพต่ำ - หลายคำตอบไม่ผ่านการตรวจสอบ';
      }
    }
    
    // Enhanced prompts status
    const enhancedPromptsActive = {
      tarot: true,
      spirit: true,
      numerology: true,
      chat: true
    };
    
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      
      // Overall metrics
      metrics: {
        totalValidations: metrics.totalValidations,
        passedValidations: metrics.passedValidations,
        failedValidations: metrics.failedValidations,
        fallbackUsages: metrics.fallbackUsages,
        passRate: passRate ? `${passRate.toFixed(1)}%` : 'N/A',
        fallbackRate: fallbackRate ? `${fallbackRate.toFixed(1)}%` : 'N/A'
      },
      
      // Quality assessment
      quality: {
        status: qualityStatus,
        message: qualityMessage,
        warnings: [
          ...(fallbackRate !== null && fallbackRate > 10 
            ? ['อัตราการใช้ fallback สูง - อาจต้องปรับ prompts'] 
            : [])
        ]
      },
      
      // By divination type
      byType: metrics.errorsByDivinationType,
      
      // Error types
      errorTypes: metrics.errorsByType,
      
      // Enhanced prompts status
      enhancedPrompts: {
        active: enhancedPromptsActive,
        allActive: Object.values(enhancedPromptsActive).every(v => v),
        message: 'Enhanced prompts ทำงานอยู่ทั้ง 4 endpoints'
      },
      
      // Recent errors
      recentErrors: recentErrors.map(error => ({
        timestamp: error.timestamp.toISOString(),
        type: error.errorType,
        divinationType: error.divinationType,
        message: error.errorMessage,
        context: error.context
      })),
      
      // Expected characteristics
      expectedCharacteristics: {
        tarot: [
          'มีการอ้างอิงหลักธรรมพุทธ (กรรม, บุญ, สติ)',
          'คำแนะนำเฉพาะเจาะจงพร้อมขั้นตอน',
          'อธิบายความสัมพันธ์ระหว่างไพ่',
          'เน้นความสำคัญของ Major Arcana',
          'อธิบาย shadow aspect สำหรับไพ่กลับหัว'
        ],
        spirit: [
          'เชื่อมโยงเลขเส้นทางชีวิตกับไพ่',
          'บอกจุดแข็งธรรมชาติ (ไพ่ตั้งตรง)',
          'บอกจุดที่ต้องพัฒนา (ไพ่กลับหัว)',
          'คำแนะนำระยะยาว',
          'เชื่อมโยงกับการพัฒนาตนเอง'
        ],
        numerology: [
          'อธิบายความหมายเลขราก',
          'น้ำเสียงเหมาะสมกับคะแนน',
          'วิเคราะห์แต่ละด้านพร้อมตัวอย่าง',
          'อ้างอิงความเชื่อไทยเรื่องตัวเลข'
        ],
        chat: [
          'อ้างอิงไพ่จากการดูดวงเดิม',
          'คำตอบกระชับ 1-3 ย่อหน้า',
          'มีความเห็นอกเห็นใจ',
          'เน้นสิ่งที่ผู้ใช้ควบคุมได้'
        ]
      }
    });
    
  } catch (error) {
    console.error('Error fetching AI metrics:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch metrics',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
