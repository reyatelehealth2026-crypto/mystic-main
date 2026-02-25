# Implementation Plan: Enhanced AI Prompts

## Overview

This implementation plan breaks down the enhanced AI prompt engineering system into discrete coding tasks. The approach follows a modular architecture where we build the foundation (types, cultural context, examples) first, then create the prompt builders, integrate with API routes, and finally add validation and testing.

## Tasks

- [x] 1. Set up core infrastructure and types
  - Create directory structure: src/lib/ai/ with subdirectories (templates/, examples/, cultural/)
  - Define TypeScript interfaces in src/lib/ai/types.ts for PromptSection, PromptTemplate, FewShotExample, ValidationResult
  - Define parameter types for each divination type (TarotPromptParams, SpiritPromptParams, NumerologyPromptParams, ChatPromptParams)
  - _Requirements: 3.1, 10.2, 10.5_

- [ ] 2. Implement Thai cultural context module
  - [x] 2.1 Create cultural context constants
    - Implement src/lib/ai/cultural/thai-context.ts with Buddhist philosophy, astrology concepts, numerology beliefs, and guidance style constants
    - Export getContextForDivinationType() function that returns appropriate context based on divination type
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_
  
  - [ ]* 2.2 Write property test for cultural context completeness
    - **Property 1: Cultural Context Completeness**
    - **Validates: Requirements 1.1, 1.2, 1.3, 1.4, 1.5**

- [ ] 3. Create few-shot example repositories
  - [x] 3.1 Implement tarot examples
    - Create src/lib/ai/examples/tarot-examples.ts with 2-3 examples covering positive, challenging, and neutral scenarios
    - Include examples for 1-card, 3-card, and 10-card spreads
    - _Requirements: 2.1, 2.6_
  
  - [x] 3.2 Implement spirit card examples
    - Create src/lib/ai/examples/spirit-examples.ts with 1-2 examples for upright and reversed orientations
    - _Requirements: 2.2, 2.6_
  
  - [x] 3.3 Implement numerology examples
    - Create src/lib/ai/examples/numerology-examples.ts with 1-2 examples for high and low scores
    - _Requirements: 2.3, 2.6_
  
  - [x] 3.4 Implement chat examples
    - Create src/lib/ai/examples/chat-examples.ts with 1-2 Q&A exchange examples
    - _Requirements: 2.4, 2.6_
  
  - [ ]* 3.5 Write property tests for few-shot examples
    - **Property 2: Few-Shot Example Count Compliance**
    - **Property 3: Few-Shot Example Structure**
    - **Property 4: Example Scenario Diversity**
    - **Validates: Requirements 2.1, 2.2, 2.3, 2.4, 2.5, 2.6**

- [ ] 4. Build base template system
  - [x] 4.1 Create PromptBuilder class
    - Implement src/lib/ai/templates/base.ts with PromptBuilder class
    - Add methods: withRole(), withCulturalContext(), withFewShotExamples(), withInstructions(), withUserData(), build()
    - Implement buildBasePrompt() helper function
    - _Requirements: 3.1, 3.2, 3.4_
  
  - [ ]* 4.2 Write property tests for template system
    - **Property 5: Template Section Ordering**
    - **Property 6: Template Variable Injection**
    - **Property 7: Template Validation Completeness**
    - **Property 18: Template Composition**
    - **Validates: Requirements 3.2, 3.4, 3.5, 10.3**

- [ ] 5. Implement divination-specific prompt builders
  - [x] 5.1 Create tarot prompt builder
    - Implement src/lib/ai/templates/tarot.ts with buildTarotPrompt() function
    - Include spread-specific logic for 1, 3, and 10-card spreads
    - Add instructions for card relationships, reversed cards, Major Arcana emphasis
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 6.1, 6.2, 6.3, 6.4, 6.5_
  
  - [ ]* 5.2 Write property tests for tarot prompts
    - **Property 8: Tarot Instruction Completeness**
    - **Property 9: Spread-Specific Instructions**
    - **Property 10: Card Orientation Instructions**
    - **Property 11: Major Arcana Emphasis**
    - **Validates: Requirements 4.1-4.6, 6.1-6.5**
  
  - [x] 5.3 Create spirit card prompt builder
    - Implement src/lib/ai/templates/spirit.ts with buildSpiritPrompt() function
    - Include orientation-specific instructions (upright vs reversed)
    - Add life path number connection guidance
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_
  
  - [ ]* 5.4 Write property test for spirit card prompts
    - **Property 12: Spirit Card Instruction Completeness**
    - **Validates: Requirements 7.1, 7.2, 7.3, 7.4, 7.5**
  
  - [x] 5.5 Create numerology prompt builder
    - Implement src/lib/ai/templates/numerology.ts with buildNumerologyPrompt() function
    - Include score-based framing logic (high vs low scores)
    - Add theme analysis instructions
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_
  
  - [ ]* 5.6 Write property test for numerology prompts
    - **Property 13: Numerology Instruction Completeness**
    - **Validates: Requirements 8.1, 8.2, 8.3, 8.4, 8.5**
  
  - [x] 5.7 Create chat prompt builder
    - Implement src/lib/ai/templates/chat.ts with buildChatPrompt() function
    - Include conversation history integration (last 6 turns)
    - Add conciseness and card reference instructions
    - _Requirements: 9.1, 9.5, 9.6_
  
  - [ ]* 5.8 Write property tests for chat prompts
    - **Property 14: Chat Context Inclusion**
    - **Property 15: Chat Response Instructions**
    - **Validates: Requirements 9.1, 9.5, 9.6**

- [x] 6. Create main prompt builder interface
  - Implement src/lib/ai/prompts.ts that exports all prompt builder functions
  - Add convenience functions: buildTarotPrompt(), buildSpiritPrompt(), buildNumerologyPrompt(), buildChatPrompt()
  - _Requirements: 10.1, 10.2_

- [x] 7. Checkpoint - Ensure all prompt builders work correctly
  - Ensure all tests pass, ask the user if questions arise.

- [-] 8. Implement response validation system
  - [x] 8.1 Create validation module
    - Implement src/lib/ai/validation.ts with validateAIResponse() function
    - Add validateMinimumLength() for 50 Thai character check
    - Add validateStructureSections() for three required sections check
    - Implement ensureFortuneStructure() for fallback formatting
    - _Requirements: 5.1, 5.2_
  
  - [ ]* 8.2 Write property tests for validation
    - **Property 16: Response Validation Rules**
    - **Property 17: Validation Failure Handling**
    - **Validates: Requirements 5.1, 5.2, 5.3, 5.4**
  
  - [ ]* 8.3 Write unit tests for validation edge cases
    - Test empty responses, responses with missing sections, responses with extra sections
    - Test Thai character counting with mixed Thai/English text
    - Test fallback structure generation
    - _Requirements: 5.1, 5.2, 5.3_

- [x] 9. Integrate new prompts with API routes
  - [x] 9.1 Update tarot API route
    - Modify src/app/api/ai/tarot/route.ts to use buildTarotPrompt()
    - Replace inline prompt with new prompt builder
    - Keep existing error handling and fallback logic
    - _Requirements: 10.4_
  
  - [x] 9.2 Update spirit card API route
    - Modify src/app/api/ai/spirit/route.ts to use buildSpiritPrompt()
    - Replace inline prompt with new prompt builder
    - _Requirements: 10.4_
  
  - [x] 9.3 Update numerology API route
    - Modify src/app/api/ai/numerology/route.ts to use buildNumerologyPrompt()
    - Replace inline prompt with new prompt builder
    - _Requirements: 10.4_
  
  - [x] 9.4 Update chat API route
    - Modify src/app/api/ai/tarot-chat/route.ts to use buildChatPrompt()
    - Replace inline prompt with new prompt builder
    - _Requirements: 10.4_
  
  - [ ]* 9.5 Write integration tests for API routes
    - Test each API route with new prompt system
    - Verify responses maintain expected structure
    - Test error handling and fallback behavior
    - _Requirements: 10.4_

- [x] 10. Add metrics and logging
  - Implement error logging in validation module
  - Add metrics tracking for validation pass/fail rates
  - Add logging for fallback usage
  - _Requirements: 5.3, 5.4, 5.5_

- [x] 11. Final checkpoint - Ensure all tests pass
  - Run full test suite (unit + property + integration tests)
  - Verify all API routes work with new prompts
  - Test with real Gemini API calls
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional testing tasks that can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties
- Unit tests validate specific examples and edge cases
- Integration tests ensure API routes work correctly with new prompt system
