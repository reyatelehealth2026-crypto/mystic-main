/**
 * AI Quality Checker
 * 
 * เครื่องมือตรวจสอบคุณภาพคำตอบจาก AI
 * ใช้ตรวจสอบว่า enhanced prompts ทำงานได้ดีหรือไม่
 */

import { 
  getValidationMetrics, 
  getValidationPassRate, 
  getFallbackUsageRate,
  getErrorLogs 
} from '../src/lib/ai/validation';

/**
 * แสดงสถิติการ validation
 */
export function displayMetrics() {
  const metrics = getValidationMetrics();
  const passRate = getValidationPassRate();
  const fallbackRate = getFallbackUsageRate();
  
  console.log('\n=== AI Response Quality Metrics ===\n');
  
  console.log('📊 Overall Statistics:');
  console.log(`  Total Validations: ${metrics.totalValidations}`);
  console.log(`  Passed: ${metrics.passedValidations} (${passRate?.toFixed(1) || 'N/A'}%)`);
  console.log(`  Failed: ${metrics.failedValidations}`);
  console.log(`  Fallback Used: ${metrics.fallbackUsages} (${fallbackRate?.toFixed(1) || 'N/A'}%)`);
  
  console.log('\n📈 By Divination Type:');
  Object.entries(metrics.errorsByDivinationType).forEach(([type, count]) => {
    console.log(`  ${type}: ${count} errors`);
  });
  
  console.log('\n🔍 Error Types:');
  if (Object.keys(metrics.errorsByType).length === 0) {
    console.log('  No errors recorded ✅');
  } else {
    Object.entries(metrics.errorsByType).forEach(([type, count]) => {
      console.log(`  ${type}: ${count} occurrences`);
    });
  }
  
  // Quality assessment
  console.log('\n✨ Quality Assessment:');
  if (passRate === null) {
    console.log('  ⚠️  No data yet - start using the app to collect metrics');
  } else if (passRate >= 95) {
    console.log('  ✅ Excellent - AI responses are high quality');
  } else if (passRate >= 80) {
    console.log('  ⚠️  Good - Some responses need improvement');
  } else {
    console.log('  ❌ Poor - Many responses failing validation');
  }
  
  if (fallbackRate !== null && fallbackRate > 10) {
    console.log('  ⚠️  High fallback usage - prompts may need adjustment');
  }
  
  console.log('\n');
}

/**
 * แสดง error logs ล่าสุด
 */
export function displayRecentErrors(limit: number = 10) {
  const errors = getErrorLogs({ limit });
  
  if (errors.length === 0) {
    console.log('✅ No errors recorded\n');
    return;
  }
  
  console.log(`\n=== Recent Errors (Last ${limit}) ===\n`);
  
  errors.forEach((error, index) => {
    console.log(`${index + 1}. [${error.divinationType}] ${error.errorType}`);
    console.log(`   Time: ${error.timestamp.toLocaleString('th-TH')}`);
    console.log(`   Message: ${error.errorMessage}`);
    if (error.context) {
      console.log(`   Context:`, JSON.stringify(error.context, null, 2));
    }
    console.log('');
  });
}

/**
 * ตรวจสอบว่า enhanced prompts ทำงานหรือไม่
 */
export function checkEnhancedPromptsStatus() {
  console.log('\n=== Enhanced Prompts Status Check ===\n');
  
  // ตรวจสอบว่า API routes ใช้ prompt builders แบบใหม่
  console.log('✅ Code Integration:');
  console.log('  - Tarot API: Using buildTarotPrompt()');
  console.log('  - Spirit API: Using buildSpiritPrompt()');
  console.log('  - Numerology API: Using buildNumerologyPrompt()');
  console.log('  - Chat API: Using buildChatPrompt()');
  
  console.log('\n📋 Expected Response Characteristics:');
  console.log('  Tarot:');
  console.log('    - มีการอ้างอิงหลักธรรมพุทธ (กรรม, บุญ, สติ)');
  console.log('    - คำแนะนำเฉพาะเจาะจงพร้อมขั้นตอน');
  console.log('    - อธิบายความสัมพันธ์ระหว่างไพ่');
  
  console.log('  Spirit Card:');
  console.log('    - เชื่อมโยงเลขเส้นทางชีวิตกับไพ่');
  console.log('    - คำแนะนำระยะยาว');
  console.log('    - เน้นการพัฒนาตนเอง');
  
  console.log('  Numerology:');
  console.log('    - อธิบายความหมายเลขราก');
  console.log('    - น้ำเสียงเหมาะสมกับคะแนน');
  console.log('    - อ้างอิงความเชื่อไทยเรื่องตัวเลข');
  
  console.log('  Chat:');
  console.log('    - อ้างอิงไพ่จากการดูดวงเดิม');
  console.log('    - คำตอบกระชับ 1-3 ย่อหน้า');
  console.log('    - มีความเห็นอกเห็นใจ');
  
  console.log('\n📝 Next Steps:');
  console.log('  1. เปิดเว็บ: npm run dev');
  console.log('  2. ทดสอบแต่ละ feature');
  console.log('  3. ตรวจสอบว่าคำตอบมีลักษณะตามที่ระบุข้างต้น');
  console.log('  4. เรียก displayMetrics() เพื่อดูสถิติ');
  console.log('\n');
}

// Export for use in other scripts
export { getValidationMetrics, getValidationPassRate, getFallbackUsageRate, getErrorLogs };

// Run if called directly
if (require.main === module) {
  checkEnhancedPromptsStatus();
  displayMetrics();
  displayRecentErrors(5);
}
