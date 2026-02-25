# Requirements Document: Enhanced AI Prompts

## Introduction

This specification defines requirements for enhancing the AI prompt engineering system across all divination services in REFFORTUNE (Tarot, Spirit Card, Numerology, and Tarot Chat). The enhancement focuses on integrating Thai astrology and divination cultural context, implementing few-shot learning examples, and improving response depth while maintaining the application's core values of clarity, actionability, and natural Thai language.

## Glossary

- **AI_Prompt_System**: The prompt engineering infrastructure that generates instructions for the Gemini API across all divination endpoints
- **Few_Shot_Examples**: Concrete example pairs of input scenarios and expert-level responses used to guide AI behavior
- **Thai_Divination_Context**: Cultural knowledge including Thai astrology (โหราศาสตร์ไทย), Buddhist philosophy, and traditional fortune-telling practices
- **Gemini_API**: Google's generative AI API (gemini-2.0-flash model) used for interpretations
- **Response_Structure**: The standardized format containing summary and cardStructure fields
- **Expert_Tone**: Response style that demonstrates deep knowledge, cultural sensitivity, and practical wisdom
- **Tarot_Reading**: 1/3/10 card spread interpretations via /api/ai/tarot
- **Spirit_Card_Reading**: Birth date-based card interpretation via /api/ai/spirit
- **Numerology_Reading**: Thai phone number analysis via /api/ai/numerology
- **Tarot_Chat**: Follow-up conversation system via /api/ai/tarot-chat
- **Prompt_Template**: Reusable prompt structure with placeholders for dynamic content

## Requirements

### Requirement 1: Thai Cultural Context Integration

**User Story:** As a Thai user seeking divination guidance, I want interpretations that reflect Thai cultural wisdom and astrology, so that the readings feel authentic and culturally relevant.

#### Acceptance Criteria

1. WHEN generating any divination interpretation, THE AI_Prompt_System SHALL include Thai astrology concepts (ดวงชะตา, กรรม, บุญ) in the system instructions
2. WHEN interpreting Tarot cards, THE AI_Prompt_System SHALL reference Thai Buddhist philosophy about cause and effect (กฎแห่งกรรม)
3. WHEN providing guidance, THE AI_Prompt_System SHALL incorporate Thai cultural values about balance (สมดุล), merit-making (ทำบุญ), and mindfulness (สติ)
4. WHEN analyzing Spirit Cards, THE AI_Prompt_System SHALL connect life path numbers to Thai numerology beliefs
5. WHEN interpreting phone numbers, THE AI_Prompt_System SHALL reference Thai beliefs about auspicious numbers and their cultural significance

### Requirement 2: Few-Shot Learning Implementation

**User Story:** As a system designer, I want to use few-shot examples in prompts, so that the AI produces expert-level responses consistently.

#### Acceptance Criteria

1. WHEN constructing prompts for Tarot_Reading, THE AI_Prompt_System SHALL include 2-3 example interpretations demonstrating expert tone and structure
2. WHEN constructing prompts for Spirit_Card_Reading, THE AI_Prompt_System SHALL include 1-2 example readings showing how to connect birth dates to life guidance
3. WHEN constructing prompts for Numerology_Reading, THE AI_Prompt_System SHALL include 1-2 example analyses demonstrating actionable insights from phone numbers
4. WHEN constructing prompts for Tarot_Chat, THE AI_Prompt_System SHALL include 1-2 example Q&A exchanges showing empathetic and insightful responses
5. THE AI_Prompt_System SHALL format few-shot examples with clear input-output boundaries
6. THE AI_Prompt_System SHALL select examples that cover diverse scenarios (positive, challenging, neutral situations)

### Requirement 3: Enhanced Prompt Structure

**User Story:** As a developer, I want a modular prompt template system, so that prompts are maintainable and consistent across all divination types.

#### Acceptance Criteria

1. THE AI_Prompt_System SHALL define reusable Prompt_Template components for role definition, cultural context, few-shot examples, and output format
2. WHEN building a prompt, THE AI_Prompt_System SHALL compose templates in a consistent order: role → cultural context → few-shot examples → specific instructions → user data
3. THE AI_Prompt_System SHALL store prompt templates in a dedicated module separate from API route handlers
4. THE AI_Prompt_System SHALL support template variables for dynamic content injection
5. THE AI_Prompt_System SHALL validate that all required template sections are present before sending to Gemini_API

### Requirement 4: Depth and Expertise Enhancement

**User Story:** As a user, I want deeper and more insightful interpretations, so that I receive meaningful guidance rather than surface-level readings.

#### Acceptance Criteria

1. WHEN generating interpretations, THE AI_Prompt_System SHALL instruct the AI to provide specific, actionable guidance rather than vague statements
2. WHEN analyzing card combinations, THE AI_Prompt_System SHALL instruct the AI to explain relationships between cards and their combined meaning
3. WHEN providing warnings (จุดที่ควรระวัง), THE AI_Prompt_System SHALL instruct the AI to identify specific risks with concrete examples
4. WHEN suggesting actions (แนวทางที่ควรทำ), THE AI_Prompt_System SHALL instruct the AI to provide step-by-step guidance with timeframes
5. THE AI_Prompt_System SHALL instruct the AI to reference card symbolism and archetypal meanings when relevant
6. THE AI_Prompt_System SHALL instruct the AI to avoid absolute predictions while maintaining confidence in guidance

### Requirement 5: Response Quality Validation

**User Story:** As a system maintainer, I want to validate AI response quality, so that users consistently receive high-quality interpretations.

#### Acceptance Criteria

1. WHEN receiving a response from Gemini_API, THE AI_Prompt_System SHALL verify that the summary field contains at least 50 Thai characters
2. WHEN receiving a response from Gemini_API, THE AI_Prompt_System SHALL verify that cardStructure contains all three required sections (ภาพรวมสถานการณ์, จุดที่ควรระวัง, แนวทางที่ควรทำ)
3. IF a response fails validation, THEN THE AI_Prompt_System SHALL log the failure reason and use the fallback structure
4. THE AI_Prompt_System SHALL track response quality metrics (validation pass rate, fallback usage rate)
5. THE AI_Prompt_System SHALL provide clear error messages when responses are incomplete or malformed

### Requirement 6: Tarot-Specific Enhancements

**User Story:** As a user receiving a Tarot reading, I want interpretations that consider card positions and spread patterns, so that I understand the full context of my reading.

#### Acceptance Criteria

1. WHEN interpreting a 3-card spread, THE AI_Prompt_System SHALL instruct the AI to analyze the past-present-future narrative flow
2. WHEN interpreting a 10-card Celtic Cross spread, THE AI_Prompt_System SHALL instruct the AI to identify key themes across positions
3. WHEN cards appear in reversed orientation, THE AI_Prompt_System SHALL instruct the AI to explain the shadow aspect or blocked energy
4. WHEN Major Arcana cards appear, THE AI_Prompt_System SHALL instruct the AI to emphasize their significance as major life themes
5. THE AI_Prompt_System SHALL provide spread-specific guidance in the prompt based on card count (1, 3, or 10)

### Requirement 7: Spirit Card Enhancements

**User Story:** As a user discovering my Spirit Card, I want to understand how my birth date connects to my life path, so that I gain self-awareness and direction.

#### Acceptance Criteria

1. WHEN interpreting a Spirit_Card_Reading, THE AI_Prompt_System SHALL instruct the AI to explain the connection between the life path number and the card's meaning
2. WHEN the Spirit Card is upright, THE AI_Prompt_System SHALL instruct the AI to describe natural strengths and talents
3. WHEN the Spirit Card is reversed, THE AI_Prompt_System SHALL instruct the AI to describe growth areas and challenges to overcome
4. THE AI_Prompt_System SHALL instruct the AI to provide life-long guidance rather than short-term predictions
5. THE AI_Prompt_System SHALL instruct the AI to connect the Spirit Card to personal development themes

### Requirement 8: Numerology Enhancements

**User Story:** As a user analyzing my phone number, I want to understand how the numbers influence different life areas, so that I can make informed decisions about keeping or changing my number.

#### Acceptance Criteria

1. WHEN interpreting a Numerology_Reading, THE AI_Prompt_System SHALL instruct the AI to explain the significance of the root number (เลขราก)
2. WHEN the score is high (80+), THE AI_Prompt_System SHALL instruct the AI to emphasize auspicious aspects while avoiding overconfidence
3. WHEN the score is low (<40), THE AI_Prompt_System SHALL instruct the AI to provide constructive guidance without negativity
4. THE AI_Prompt_System SHALL instruct the AI to analyze each theme (work, money, relationships, caution) with specific examples
5. THE AI_Prompt_System SHALL instruct the AI to explain Thai cultural beliefs about number combinations when relevant

### Requirement 9: Chat Mode Enhancements

**User Story:** As a user asking follow-up questions, I want empathetic and insightful responses that build on my original reading, so that I can explore my situation more deeply.

#### Acceptance Criteria

1. WHEN responding in Tarot_Chat, THE AI_Prompt_System SHALL instruct the AI to reference specific cards from the original reading
2. WHEN the user asks about timing, THE AI_Prompt_System SHALL instruct the AI to provide realistic timeframes based on card energy
3. WHEN the user asks about other people, THE AI_Prompt_System SHALL instruct the AI to focus on what the user can control
4. WHEN the user expresses worry, THE AI_Prompt_System SHALL instruct the AI to acknowledge feelings while providing grounded perspective
5. THE AI_Prompt_System SHALL instruct the AI to maintain conversation history context (last 6 turns)
6. THE AI_Prompt_System SHALL instruct the AI to keep responses concise (1-3 paragraphs) for chat format

### Requirement 10: Prompt Template Management

**User Story:** As a developer, I want centralized prompt template management, so that I can update prompts without modifying multiple API routes.

#### Acceptance Criteria

1. THE AI_Prompt_System SHALL provide a dedicated module at src/lib/ai/prompts.ts for all prompt templates
2. THE AI_Prompt_System SHALL export template builder functions for each divination type
3. THE AI_Prompt_System SHALL support template composition from reusable sections
4. WHEN a template is updated, THE AI_Prompt_System SHALL apply changes to all API routes using that template
5. THE AI_Prompt_System SHALL include TypeScript types for template parameters and return values
