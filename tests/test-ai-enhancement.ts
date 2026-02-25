/**
 * Automated Test Script for AI Enhancement Verification
 * 
 * This script tests if the AI is using the new enhanced prompts and cultural context
 * by checking the response structure and content quality.
 */

import type { AIResponse } from '@/lib/ai/types';

interface TestResult {
  testName: string;
  passed: boolean;
  details: string;
  score?: number;
}

/**
 * Test 1: Check if response has new fields (psychologicalLayer, energyPattern, deeperInsight)
 */
function testNewFields(response: any): TestResult {
  const hasNewFields = 
    response.cards?.some((card: any) => 
      card.psychologicalLayer && card.energyPattern
    ) &&
    response.deeperInsight;

  return {
    testName: 'New Fields Present',
    passed: hasNewFields,
    details: hasNewFields 
      ? '✅ Response includes psychologicalLayer, energyPattern, and deeperInsight'
      : '❌ Missing new fields - AI may not be using enhanced prompts'
  };
}

/**
 * Test 2: Check summary length (should be 3-5 lines, ~200+ chars)
 */
function testSummaryLength(response: any): TestResult {
  const summary = response.summary || '';
  const thaiChars = (summary.match(/[\u0E00-\u0E7F]/g) || []).length;
  const lines = summary.split('\n').length;
  
  const passed = thaiChars >= 100 && summary.length >= 200;
  
  return {
    testName: 'Summary Length & Depth',
    passed,
    details: `Thai chars: ${thaiChars} (need ≥100), Total length: ${summary.length} (need ≥200), Lines: ${lines}`,
    score: thaiChars
  };
}

/**
 * Test 3: Check cardStructure length (should be 300+ Thai chars)
 */
function testCardStructureLength(response: any): TestResult {
  const cardStructure = response.cardStructure || '';
  const thaiChars = (cardStructure.match(/[\u0E00-\u0E7F]/g) || []).length;
  
  const passed = thaiChars >= 300;
  
  return {
    testName: 'CardStructure Length',
    passed,
    details: `Thai chars: ${thaiChars} (need ≥300)`,
    score: thaiChars
  };
}

/**
 * Test 4: Check if actions are structured in 3 steps
 */
function testActionableSteps(response: any): TestResult {
  const actions = response.actions || [];
  const hasThreeSteps = actions.length >= 3;
  const hasTimeframes = actions.some((action: string) => 
    action.includes('วัน') || action.includes('สัปดาห์') || action.includes('เดือน')
  );
  
  const passed = hasThreeSteps && hasTimeframes;
  
  return {
    testName: 'Actionable Steps Structure',
    passed,
    details: `Steps: ${actions.length} (need ≥3), Has timeframes: ${hasTimeframes}`,
    score: actions.length
  };
}

/**
 * Test 5: Check for depth indicators (เพราะว่า, เนื่องจาก, etc.)
 */
function testDepthIndicators(response: any): TestResult {
  const fullText = JSON.stringify(response);
  const depthIndicators = ['เพราะว่า', 'เนื่องจาก', 'ซึ่งหมายความว่า', 'ดังนั้น', 'อย่างไรก็ตาม', 'นอกจากนี้'];
  
  const foundIndicators = depthIndicators.filter(indicator => fullText.includes(indicator));
  const passed = foundIndicators.length >= 2;
  
  return {
    testName: 'Depth Indicators',
    passed,
    details: `Found ${foundIndicators.length} indicators: ${foundIndicators.join(', ')}`,
    score: foundIndicators.length
  };
}

/**
 * Test 6: Check for cultural context (Buddhist philosophy keywords)
 */
function testCulturalContext(response: any): TestResult {
  const fullText = JSON.stringify(response);
  const culturalKeywords = ['กรรม', 'สติ', 'ปัญญา', 'เมตตา', 'อนิจจัง', 'สมดุล', 'ทางสายกลาง'];
  
  const foundKeywords = culturalKeywords.filter(keyword => fullText.includes(keyword));
  const passed = foundKeywords.length >= 1;
  
  return {
    testName: 'Thai Cultural Context',
    passed,
    details: `Found ${foundKeywords.length} cultural keywords: ${foundKeywords.join(', ')}`,
    score: foundKeywords.length
  };
}

/**
 * Test 7: Check for symbolic/archetypal references
 */
function testSymbolicDepth(response: any): TestResult {
  const fullText = JSON.stringify(response);
  const symbolicKeywords = ['สัญลักษณ์', 'สี', 'ธาตุ', 'พลังงาน', 'เหมือน', 'แทน', 'สะท้อน'];
  
  const foundKeywords = symbolicKeywords.filter(keyword => fullText.includes(keyword));
  const passed = foundKeywords.length >= 2;
  
  return {
    testName: 'Symbolic & Archetypal Depth',
    passed,
    details: `Found ${foundKeywords.length} symbolic references: ${foundKeywords.join(', ')}`,
    score: foundKeywords.length
  };
}

/**
 * Run all tests and generate report
 */
export function runEnhancementTests(response: any): {
  allPassed: boolean;
  passedCount: number;
  totalTests: number;
  results: TestResult[];
  summary: string;
} {
  const tests = [
    testNewFields,
    testSummaryLength,
    testCardStructureLength,
    testActionableSteps,
    testDepthIndicators,
    testCulturalContext,
    testSymbolicDepth
  ];

  const results = tests.map(test => test(response));
  const passedCount = results.filter(r => r.passed).length;
  const totalTests = results.length;
  const allPassed = passedCount === totalTests;

  let summary = `\n${'='.repeat(60)}\n`;
  summary += `AI ENHANCEMENT TEST RESULTS\n`;
  summary += `${'='.repeat(60)}\n\n`;
  
  results.forEach((result, index) => {
    const icon = result.passed ? '✅' : '❌';
    summary += `${index + 1}. ${icon} ${result.testName}\n`;
    summary += `   ${result.details}\n`;
    if (result.score !== undefined) {
      summary += `   Score: ${result.score}\n`;
    }
    summary += '\n';
  });

  summary += `${'='.repeat(60)}\n`;
  summary += `OVERALL: ${passedCount}/${totalTests} tests passed\n`;
  
  if (allPassed) {
    summary += `✅ AI IS USING ENHANCED PROMPTS AND CULTURAL CONTEXT\n`;
  } else if (passedCount >= totalTests * 0.7) {
    summary += `⚠️  AI IS PARTIALLY USING ENHANCEMENTS (${Math.round(passedCount/totalTests*100)}%)\n`;
  } else {
    summary += `❌ AI IS NOT USING ENHANCED PROMPTS - CHECK CONFIGURATION\n`;
  }
  summary += `${'='.repeat(60)}\n`;

  return {
    allPassed,
    passedCount,
    totalTests,
    results,
    summary
  };
}

/**
 * Example usage in browser console or test file:
 * 
 * // After getting response from /api/ai/tarot
 * import { runEnhancementTests } from './tests/test-ai-enhancement';
 * 
 * const response = await fetch('/api/ai/tarot', {
 *   method: 'POST',
 *   headers: { 'Content-Type': 'application/json' },
 *   body: JSON.stringify({
 *     cards: [...],
 *     count: 3,
 *     question: 'งานของฉันจะเป็นอย่างไรในอีก 3 เดือนข้างหน้า'
 *   })
 * }).then(r => r.json());
 * 
 * const testResults = runEnhancementTests(response.ai);
 * console.log(testResults.summary);
 */
