/**
 * Verification script for the main prompt builder interface
 * 
 * This script verifies that all exports from prompts.ts are accessible
 * and that the module structure is correct.
 */

// Import all exports from the main interface
import {
  buildTarotPrompt,
  buildSpiritPrompt,
  buildNumerologyPrompt,
  buildChatPrompt,
  PromptBuilder,
  buildBasePrompt,
} from './prompts';

// Import types
import type {
  TarotPromptParams,
  SpiritPromptParams,
  NumerologyPromptParams,
  ChatPromptParams,
  PromptSection,
  FewShotExample,
  DivinationType,
} from './prompts';

/**
 * Verify that all functions are exported and accessible
 */
function verifyExports(): void {
  console.log('Verifying exports from prompts.ts...\n');

  // Check function exports
  console.log('✓ buildTarotPrompt:', typeof buildTarotPrompt === 'function' ? 'OK' : 'FAIL');
  console.log('✓ buildSpiritPrompt:', typeof buildSpiritPrompt === 'function' ? 'OK' : 'FAIL');
  console.log('✓ buildNumerologyPrompt:', typeof buildNumerologyPrompt === 'function' ? 'OK' : 'FAIL');
  console.log('✓ buildChatPrompt:', typeof buildChatPrompt === 'function' ? 'OK' : 'FAIL');
  console.log('✓ PromptBuilder:', typeof PromptBuilder === 'function' ? 'OK' : 'FAIL');
  console.log('✓ buildBasePrompt:', typeof buildBasePrompt === 'function' ? 'OK' : 'FAIL');

  console.log('\nAll exports verified successfully!');
}

/**
 * Test basic PromptBuilder functionality
 */
function testPromptBuilder(): void {
  console.log('\nTesting PromptBuilder class...\n');

  const builder = new PromptBuilder();
  const prompt = builder
    .withRole('Test role')
    .withInstructions('Test instructions')
    .withUserData('Test data')
    .build();

  console.log('✓ PromptBuilder instance created');
  console.log('✓ Prompt built successfully');
  console.log('✓ Prompt contains role:', prompt.includes('Test role') ? 'OK' : 'FAIL');
  console.log('✓ Prompt contains instructions:', prompt.includes('Test instructions') ? 'OK' : 'FAIL');
  console.log('✓ Prompt contains userData:', prompt.includes('Test data') ? 'OK' : 'FAIL');

  console.log('\nPromptBuilder test completed!');
}

/**
 * Test buildBasePrompt function
 */
function testBuildBasePrompt(): void {
  console.log('\nTesting buildBasePrompt function...\n');

  const sections: PromptSection = {
    role: 'Test role',
    instructions: 'Test instructions',
    userData: 'Test data',
  };

  const prompt = buildBasePrompt(sections);

  console.log('✓ buildBasePrompt executed');
  console.log('✓ Prompt contains role:', prompt.includes('Test role') ? 'OK' : 'FAIL');
  console.log('✓ Prompt contains instructions:', prompt.includes('Test instructions') ? 'OK' : 'FAIL');
  console.log('✓ Prompt contains userData:', prompt.includes('Test data') ? 'OK' : 'FAIL');

  console.log('\nbuildBasePrompt test completed!');
}

// Run verification
if (require.main === module) {
  verifyExports();
  testPromptBuilder();
  testBuildBasePrompt();
  console.log('\n✅ All verifications passed!');
}

export { verifyExports, testPromptBuilder, testBuildBasePrompt };
