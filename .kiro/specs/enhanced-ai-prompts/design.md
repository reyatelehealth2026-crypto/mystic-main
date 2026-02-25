# Design Document: Enhanced AI Prompts

## Overview

This design enhances the AI prompt engineering system for REFFORTUNE by integrating Thai cultural context, implementing few-shot learning, and creating a modular prompt template architecture. The system will maintain the existing API structure while significantly improving interpretation depth and cultural authenticity.

### Key Design Principles

1. **Cultural Authenticity**: Embed Thai astrology and Buddhist philosophy naturally
2. **Modularity**: Reusable prompt components across all divination types
3. **Consistency**: Standardized structure while allowing type-specific customization
4. **Maintainability**: Centralized prompt management separate from API routes
5. **Quality**: Validation and fallback mechanisms for robust responses

### Design Goals

- Increase interpretation depth without sacrificing clarity
- Reduce response time while improving quality
- Enable easy prompt iteration and A/B testing
- Maintain backward compatibility with existing API contracts

## Architecture

### System Components

```
src/lib/ai/
├── prompts.ts              # Prompt template builders
├── templates/
│   ├── base.ts            # Shared template components
│   ├── tarot.ts           # Tarot-specific templates
│   ├── spirit.ts          # Spirit card templates
│   ├── numerology.ts      # Numerology templates
│   └── chat.ts            # Chat mode templates
├── examples/
│   ├── tarot-examples.ts  # Few-shot examples for tarot
│   ├── spirit-examples.ts # Few-shot examples for spirit
│   └── numerology-examples.ts # Few-shot examples for numerology
├── cultural/
│   └── thai-context.ts    # Thai astrology and cultural knowledge
└── validation.ts          # Response quality validation
```

### Data Flow

```
API Route → Prompt Builder → Template Composer → Gemini API → Validator → Response
     ↓            ↓                  ↓
  User Data   Few-Shot         Thai Context
              Examples
```


## Components and Interfaces

### 1. Prompt Template System

#### Base Template Interface

```typescript
// src/lib/ai/types.ts
export interface PromptSection {
  role?: string;
  culturalContext?: string;
  fewShotExamples?: string;
  instructions: string;
  userData: string;
}

export interface PromptTemplate {
  build(params: Record<string, unknown>): string;
  validate(params: Record<string, unknown>): boolean;
}

export interface FewShotExample {
  input: string;
  output: string;
  scenario: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}
```

#### Template Builder

```typescript
// src/lib/ai/prompts.ts
export class PromptBuilder {
  private sections: PromptSection = { instructions: "", userData: "" };
  
  withRole(role: string): this;
  withCulturalContext(context: string): this;
  withFewShotExamples(examples: FewShotExample[]): this;
  withInstructions(instructions: string): this;
  withUserData(data: string): this;
  build(): string;
}

export function buildTarotPrompt(params: TarotPromptParams): string;
export function buildSpiritPrompt(params: SpiritPromptParams): string;
export function buildNumerologyPrompt(params: NumerologyPromptParams): string;
export function buildChatPrompt(params: ChatPromptParams): string;
```

### 2. Thai Cultural Context Module

```typescript
// src/lib/ai/cultural/thai-context.ts
export const THAI_DIVINATION_CONTEXT = {
  philosophy: string;  // Buddhist concepts: karma, merit, mindfulness
  astrology: string;   // Thai astrology principles
  numerology: string;  // Thai number beliefs
  guidance: string;    // Cultural approach to advice-giving
};

export function getContextForDivinationType(type: DivinationType): string;
```

### 3. Few-Shot Examples Repository

```typescript
// src/lib/ai/examples/tarot-examples.ts
export const TAROT_EXAMPLES: FewShotExample[] = [
  {
    scenario: "3-card spread about career decision",
    input: "...",
    output: "..."
  },
  // 2-3 examples covering different scenarios
];

// Similar structure for spirit-examples.ts and numerology-examples.ts
```

### 4. Response Validator

```typescript
// src/lib/ai/validation.ts
export interface AIResponse {
  summary: string;
  cardStructure: string;
}

export function validateAIResponse(
  response: AIResponse,
  type: DivinationType
): ValidationResult;

export function ensureFortuneStructure(
  input: string,
  summary: string
): string;

export function validateMinimumLength(
  text: string,
  minChars: number
): boolean;

export function validateStructureSections(
  structure: string,
  requiredSections: string[]
): boolean;
```


## Data Models

### Prompt Parameters

```typescript
// Tarot Reading Parameters
interface TarotPromptParams {
  cards: DrawnCard[];
  count: number;
  question?: string;
  spreadType: 1 | 3 | 10;
}

// Spirit Card Parameters
interface SpiritPromptParams {
  card: TarotCard;
  orientation: Orientation;
  lifePathNumber: number;
  dob: string;
}

// Numerology Parameters
interface NumerologyPromptParams {
  normalizedPhone: string;
  score: number;
  tier: string;
  total: number;
  root: number;
  themes: {
    work: string;
    money: string;
    relationship: string;
    caution: string;
  };
}

// Chat Parameters
interface ChatPromptParams {
  cards: DrawnCard[];
  baseQuestion?: string;
  followUpQuestion: string;
  history: ChatTurn[];
}
```

### Cultural Context Structure

```typescript
interface ThaiCulturalContext {
  buddhism: {
    karma: string;           // กฎแห่งกรรม
    merit: string;           // บุญ
    mindfulness: string;     // สติ
    middlePath: string;      // ทางสายกลาง
  };
  astrology: {
    destiny: string;         // ดวงชะตา
    timing: string;          // ฤกษ์ยาม
    elements: string;        // ธาตุทั้งสี่
  };
  numerology: {
    auspicious: string[];    // เลขมงคล
    meanings: Record<number, string>;
  };
  guidance: {
    tone: string;            // น้ำเสียงการให้คำแนะนำ
    structure: string;       // โครงสร้างคำทำนาย
  };
}
```

### Few-Shot Example Structure

```typescript
interface FewShotExample {
  scenario: string;          // Brief description
  input: string;             // User data and context
  output: string;            // Expected AI response
  notes?: string;            // Why this example is included
}

interface ExampleSet {
  positive: FewShotExample;  // Favorable reading
  challenging: FewShotExample; // Difficult situation
  neutral?: FewShotExample;  // Balanced reading
}
```


## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property Reflection

After analyzing all acceptance criteria, I identified several areas where properties can be consolidated:

1. **Cultural Context Properties (1.1-1.5)**: All five criteria check for presence of specific Thai cultural elements in prompts. These can be combined into a single comprehensive property that verifies all required cultural elements are present based on divination type.

2. **Few-Shot Example Count Properties (2.1-2.4)**: These all verify example counts for different divination types. Can be combined into one property that checks example count matches the specification for each type.

3. **Instruction Content Properties (4.1-4.6, 6.1-6.5, 7.1-7.5, 8.1-8.5, 9.1, 9.5-9.6)**: Many of these check that prompts contain specific instructions. These can be grouped by divination type into comprehensive properties.

4. **Validation Properties (5.1-5.4)**: These can be combined into a single validation property that checks all validation rules.

### Core Properties

**Property 1: Cultural Context Completeness**
*For any* divination type and generated prompt, the prompt should contain all required Thai cultural context elements appropriate for that divination type (Buddhist philosophy for tarot, numerology beliefs for phone analysis, life path connections for spirit cards).
**Validates: Requirements 1.1, 1.2, 1.3, 1.4, 1.5**

**Property 2: Few-Shot Example Count Compliance**
*For any* divination type, the generated prompt should contain the correct number of few-shot examples as specified (2-3 for tarot, 1-2 for spirit/numerology/chat).
**Validates: Requirements 2.1, 2.2, 2.3, 2.4**

**Property 3: Few-Shot Example Structure**
*For any* few-shot example in a generated prompt, the example should have clearly delineated input and output sections.
**Validates: Requirements 2.5**

**Property 4: Example Scenario Diversity**
*For any* set of few-shot examples, the examples should cover diverse scenarios including at least one positive and one challenging situation.
**Validates: Requirements 2.6**

**Property 5: Template Section Ordering**
*For any* generated prompt, the sections should appear in the consistent order: role → cultural context → few-shot examples → specific instructions → user data.
**Validates: Requirements 3.2**

**Property 6: Template Variable Injection**
*For any* template with variables and provided values, building the template should produce output containing all injected variable values.
**Validates: Requirements 3.4**

**Property 7: Template Validation Completeness**
*For any* template, validation should fail if any required section is missing, and pass if all required sections are present.
**Validates: Requirements 3.5**

**Property 8: Tarot Instruction Completeness**
*For any* tarot prompt, the instructions should include guidance about: providing specific actionable advice, explaining card relationships (for multi-card spreads), identifying specific risks, providing step-by-step actions, referencing symbolism, and avoiding absolute predictions.
**Validates: Requirements 4.1, 4.2, 4.3, 4.4, 4.5, 4.6**

**Property 9: Spread-Specific Instructions**
*For any* tarot prompt with a specific spread size (1, 3, or 10 cards), the instructions should include spread-specific guidance appropriate for that spread type.
**Validates: Requirements 6.5, 6.1, 6.2**

**Property 10: Card Orientation Instructions**
*For any* tarot prompt containing reversed cards, the instructions should include guidance about explaining shadow aspects or blocked energy.
**Validates: Requirements 6.3**

**Property 11: Major Arcana Emphasis**
*For any* tarot prompt containing Major Arcana cards, the instructions should include guidance about emphasizing their significance as major life themes.
**Validates: Requirements 6.4**

**Property 12: Spirit Card Instruction Completeness**
*For any* spirit card prompt, the instructions should include guidance about: explaining life path number connections, describing strengths (upright) or growth areas (reversed), providing life-long guidance, and connecting to personal development.
**Validates: Requirements 7.1, 7.2, 7.3, 7.4, 7.5**

**Property 13: Numerology Instruction Completeness**
*For any* numerology prompt, the instructions should include guidance about: explaining root number significance, score-appropriate framing (positive for high scores, constructive for low scores), analyzing each theme with examples, and explaining Thai cultural number beliefs.
**Validates: Requirements 8.1, 8.2, 8.3, 8.4, 8.5**

**Property 14: Chat Context Inclusion**
*For any* chat prompt, the prompt should include the original card reading context and conversation history (up to last 6 turns).
**Validates: Requirements 9.5**

**Property 15: Chat Response Instructions**
*For any* chat prompt, the instructions should include guidance about: referencing specific cards from the original reading and keeping responses concise (1-3 paragraphs).
**Validates: Requirements 9.1, 9.6**

**Property 16: Response Validation Rules**
*For any* AI response, validation should verify: summary contains at least 50 Thai characters, cardStructure contains all three required sections (ภาพรวมสถานการณ์, จุดที่ควรระวัง, แนวทางที่ควรทำ), and return appropriate validation results.
**Validates: Requirements 5.1, 5.2**

**Property 17: Validation Failure Handling**
*For any* response that fails validation, the system should log the failure reason, use the fallback structure, and record metrics.
**Validates: Requirements 5.3, 5.4**

**Property 18: Template Composition**
*For any* set of reusable template sections, composing them should produce a valid complete prompt that passes validation.
**Validates: Requirements 10.3**


## Error Handling

### Error Categories

1. **Template Construction Errors**
   - Missing required parameters
   - Invalid divination type
   - Malformed template sections

2. **Validation Errors**
   - Response too short (< 50 Thai characters)
   - Missing required structure sections
   - Malformed JSON from Gemini API

3. **API Errors**
   - Gemini API unavailable
   - Rate limiting
   - Network timeouts

### Error Handling Strategy

```typescript
// Graceful degradation with fallbacks
try {
  const prompt = buildPrompt(params);
  const response = await callGeminiAPI(prompt);
  const validated = validateResponse(response);
  
  if (!validated.isValid) {
    logValidationFailure(validated.errors);
    return createFallbackResponse(params);
  }
  
  return validated.response;
} catch (error) {
  logError(error);
  return createFallbackResponse(params);
}
```

### Fallback Mechanisms

1. **Prompt Construction Fallback**: Use minimal prompt without few-shot examples if template building fails
2. **Response Validation Fallback**: Use deterministic card meanings if AI response is invalid
3. **API Failure Fallback**: Return structured baseline interpretation from card meanings

### Logging Strategy

```typescript
interface ErrorLog {
  timestamp: Date;
  errorType: 'template' | 'validation' | 'api';
  divinationType: DivinationType;
  errorMessage: string;
  context: Record<string, unknown>;
}

// Log all errors for monitoring and improvement
logError(log: ErrorLog): void;
```

## Testing Strategy

### Dual Testing Approach

This feature requires both unit tests and property-based tests for comprehensive coverage:

- **Unit tests**: Verify specific examples, edge cases, and error conditions
- **Property tests**: Verify universal properties across all inputs

### Unit Testing Focus

Unit tests should cover:

1. **Specific Examples**
   - Example: "3-card tarot prompt with specific cards produces expected structure"
   - Example: "High-score numerology prompt includes positive framing"
   - Example: "Spirit card with reversed orientation includes growth guidance"

2. **Edge Cases**
   - Empty question strings
   - Maximum conversation history (6+ turns)
   - Extreme numerology scores (0, 99)
   - All Major Arcana spread
   - Mixed upright/reversed cards

3. **Error Conditions**
   - Invalid divination type
   - Missing required parameters
   - Malformed API responses
   - Validation failures

4. **Integration Points**
   - API route integration with prompt builders
   - Validator integration with fallback system
   - Template composition with cultural context

### Property-Based Testing Configuration

**Testing Library**: Use `fast-check` for TypeScript property-based testing

**Configuration**:
- Minimum 100 iterations per property test
- Each test tagged with feature name and property number
- Tag format: `Feature: enhanced-ai-prompts, Property {N}: {property description}`

**Property Test Focus**:

1. **Prompt Generation Properties** (Properties 1-15)
   - Generate random divination parameters
   - Verify generated prompts contain required elements
   - Check structural consistency across all inputs

2. **Validation Properties** (Properties 16-17)
   - Generate random AI responses (valid and invalid)
   - Verify validation logic correctly identifies issues
   - Check fallback behavior triggers appropriately

3. **Template Composition Properties** (Property 18)
   - Generate random template section combinations
   - Verify composition produces valid prompts
   - Check section ordering is maintained

### Example Property Test Structure

```typescript
import fc from 'fast-check';

// Feature: enhanced-ai-prompts, Property 1: Cultural Context Completeness
describe('Cultural Context Completeness', () => {
  it('should include all required Thai cultural elements for any divination type', () => {
    fc.assert(
      fc.property(
        fc.oneof(
          fc.constant('tarot'),
          fc.constant('spirit'),
          fc.constant('numerology')
        ),
        fc.record({
          // Generate appropriate parameters for each type
        }),
        (divinationType, params) => {
          const prompt = buildPrompt(divinationType, params);
          const requiredElements = getRequiredCulturalElements(divinationType);
          
          return requiredElements.every(element => 
            prompt.includes(element)
          );
        }
      ),
      { numRuns: 100 }
    );
  });
});
```

### Test Coverage Goals

- Unit test coverage: 80%+ for all prompt builder functions
- Property test coverage: All 18 correctness properties implemented
- Integration test coverage: All 4 API routes with new prompt system
- Edge case coverage: All identified edge cases have explicit tests

### Testing Checklist

- [ ] Unit tests for each prompt builder function
- [ ] Unit tests for validation logic
- [ ] Unit tests for error handling and fallbacks
- [ ] Property tests for all 18 correctness properties
- [ ] Integration tests for API routes
- [ ] Edge case tests for boundary conditions
- [ ] Performance tests for prompt generation speed
- [ ] Manual testing with real Gemini API responses


## Implementation Details

### Thai Cultural Context Content

The cultural context module will include:

```typescript
// src/lib/ai/cultural/thai-context.ts

export const THAI_BUDDHIST_PHILOSOPHY = `
คำแนะนำนี้สะท้อนหลักธรรมพุทธศาสนา:
- กฎแห่งกรรม: การกระทำในปัจจุบันสร้างผลในอนาคต
- การทำบุญ: การสร้างคุณงามความดีนำมาซึ่งผลดี
- สติและสมาธิ: การตระหนักรู้และมีสมาธิช่วยตัดสินใจอย่างชาญฉลาด
- ทางสายกลาง: หลีกเลี่ยงความสุดโต่งทั้งสองด้าน
`;

export const THAI_ASTROLOGY_CONCEPTS = `
โหราศาสตร์ไทยเชื่อว่า:
- ดวงชะตาเป็นแนวทาง ไม่ใช่คำตัดสิน
- ฤกษ์ยามมีผลต่อความสำเร็จของการกระทำ
- ธาตุทั้งสี่ (ดิน น้ำ ลม ไฟ) ต้องสมดุล
`;

export const THAI_NUMEROLOGY_BELIEFS = `
ความเชื่อเรื่องตัวเลขในวัฒนธรรมไทย:
- เลข 9 เป็นเลขมงคลสูงสุด (ก้าวหน้า)
- เลข 8 หมายถึงความมั่งคั่ง
- เลข 6 หมายถึงความราบรื่น
- เลขรวมและเลขรากมีความหมายต่อชีวิต
`;

export const THAI_GUIDANCE_STYLE = `
น้ำเสียงการให้คำแนะนำแบบไทย:
- อบอุ่น เป็นกันเอง ไม่ตัดสิน
- ตรงไปตรงมาแต่ไม่ทำร้ายจิตใจ
- ให้กำลังใจและมองโอกาสในวิกฤต
- เน้นสิ่งที่ทำได้ ไม่ใช่แค่ทำนาย
`;
```

### Few-Shot Example Templates

#### Tarot Examples

```typescript
// src/lib/ai/examples/tarot-examples.ts

export const TAROT_3_CARD_POSITIVE: FewShotExample = {
  scenario: "3-card career decision - positive outcome",
  input: `
คำถาม: ควรเปลี่ยนงานหรือไม่
ไพ่ที่เปิด:
1. อดีต: The Sun (ตั้งตรง) - ความสำเร็จ ความสุข พลังงานบวก
2. ปัจจุบัน: Two of Pentacles (ตั้งตรง) - การจัดการหลายเรื่อง ความยืดหยุ่น
3. อนาคต: Ace of Wands (ตั้งตรง) - จุดเริ่มต้นใหม่ แรงบันดาลใจ
  `,
  output: `
{
  "summary": "ไพ่บอกว่าคุณมีพื้นฐานที่ดีจากความสำเร็จในอดีต ตอนนี้กำลังชั่งน้ำหนักทางเลือก และอนาคตเปิดโอกาสให้เริ่มต้นใหม่ด้วยพลังงานสดใส การเปลี่ยนงานในช่วงนี้มีโอกาสนำมาซึ่งความก้าวหน้าที่คุณรอคอย",
  "cardStructure": "ภาพรวมสถานการณ์: คุณมีประสบการณ์และความสำเร็จที่สั่งสมมา (The Sun) ทำให้มั่นใจในตัวเองพอที่จะพิจารณาทางเลือกใหม่ ขณะนี้กำลังชั่งน้ำหนักระหว่างความมั่นคงเดิมกับโอกาสใหม่ (Two of Pentacles) และพลังงานของ Ace of Wands บอกว่ามีโครงการหรือบทบาทใหม่ที่จะจุดประกายความกระตือรือร้นให้คุณ\n\nจุดที่ควรระวัง: อย่าตัดสินใจเพียงเพราะเบื่องานเดิม ต้องแน่ใจว่างานใหม่ตอบโจทย์ทั้งด้านการเงินและการเติบโต อย่าลืมว่า Two of Pentacles เตือนให้จัดการหลายเรื่องพร้อมกัน ดังนั้นช่วงเปลี่ยนผ่านอาจต้องใช้พลังงานมาก\n\nแนวทางที่ควรทำ: (1) ภายใน 1-2 สัปดาห์: รวบรวมข้อมูลงานใหม่ให้ครบ เช็กเงื่อนไข สวัสดิการ โอกาสเติบโต (2) สัปดาห์ที่ 3-4: คุยกับคนในวงการหรือคนที่ทำงานที่นั่นแล้ว (3) ตัดสินใจภายในเดือนนี้ เพราะ Ace of Wands บอกว่าโอกาสนี้มีกรอบเวลา ยิ่งรอนานยิ่งพลาดจังหวะ"
}
  `,
  notes: "Shows positive reading with clear past-present-future narrative and actionable timeline"
};

export const TAROT_3_CARD_CHALLENGING: FewShotExample = {
  scenario: "3-card relationship question - challenging situation",
  input: `
คำถาม: ความสัมพันธ์จะไปต่อได้ไหม
ไพ่ที่เปิด:
1. อดีต: Five of Cups (ตั้งตรง) - ความผิดหวัง การสูญเสีย
2. ปัจจุบัน: The Tower (ตั้งตรง) - การพังทลาย การเปลี่ยนแปลงกะทันหัน
3. อนาคต: Six of Swords (ตั้งตรง) - การเดินทางออกจากความยากลำบาก
  `,
  output: `
{
  "summary": "ไพ่สะท้อนว่าความสัมพันธ์นี้ผ่านความผิดหวังมาแล้ว และตอนนี้กำลังเผชิญจุดเปลี่ยนครั้งใหญ่ที่บังคับให้เห็นความจริง แม้ Six of Swords บอกว่าจะผ่านพ้นไปได้ แต่การ 'ผ่านพ้น' อาจหมายถึงการปล่อยวางและเดินหน้าต่อในทางของตัวเอง",
  "cardStructure": "ภาพรวมสถานการณ์: ความสัมพันธ์นี้มีรอยแตกมาตั้งแต่อดีต (Five of Cups) จากเหตุการณ์ที่ทำให้ผิดหวังหรือรู้สึกสูญเสียบางอย่าง ปัจจุบัน The Tower บอกว่าสิ่งที่สร้างมาอาจกำลังพังทลาย ไม่ใช่เพราะใครผิดใครถูก แต่เพราะรากฐานไม่แข็งแรงพอ Six of Swords ในอนาคตหมายถึงการเคลื่อนไปสู่ที่ที่สงบกว่า แต่ต้องยอมรับว่าบางอย่างต้องทิ้งไว้ข้างหลัง\n\nจุดที่ควรระวัง: อย่าพยายามซ่อมแซมสิ่งที่พังจนไม่เหลือรูปร่าง The Tower บอกว่าบางครั้งการพังทลายคือการเริ่มต้นใหม่ที่จำเป็น อย่าหลอกตัวเองว่าทุกอย่างจะกลับมาเหมือนเดิม เพราะ Six of Swords บอกว่าทางออกคือการเดินหน้า ไม่ใช่ย้อนกลับ\n\nแนวทางที่ควรทำ: (1) สัปดาห์นี้: ให้เวลาตัวเองคิดอย่างสงบ ไม่ต้องรีบตัดสินใจทันที (2) สัปดาห์หน้า: คุยกันตรงๆ ว่าทั้งคู่ยังต้องการอะไรจากความสัมพันธ์นี้ (3) ภายใน 2-3 สัปดาห์: ถ้าคำตอบไม่ตรงกัน ให้กล้าปล่อยวางด้วยความเคารพซึ่งกันและกัน Six of Swords บอกว่าการเดินออกจากสถานการณ์ที่เป็นพิษคือการดูแลตัวเอง"
}
  `,
  notes: "Shows challenging reading with honest assessment and constructive guidance"
};
```

#### Spirit Card Example

```typescript
// src/lib/ai/examples/spirit-examples.ts

export const SPIRIT_CARD_UPRIGHT: FewShotExample = {
  scenario: "Spirit card upright - natural strengths",
  input: `
วันเกิด: 15/03/1990
ไพ่: The Empress (ตั้งตรง)
เลขเส้นทางชีวิต: 9
ความหมาย: ความอุดมสมบูรณ์ การเลี้ยงดู ความคิดสร้างสรรค์
  `,
  output: `
{
  "summary": "The Empress เป็นไพ่แห่งการเลี้ยงดูและความอุดมสมบูรณ์ ผสมกับเลขเส้นทาง 9 (เลขแห่งการให้และความเมตตา) บอกว่าคุณมีพรสวรรค์ในการดูแลคนอื่นและสร้างสรรค์สิ่งที่มีคุณค่า ชีวิตคุณมีพลังในการทำให้สิ่งต่างๆ เติบโตและเบ่งบาน",
  "cardStructure": "ภาพรวมสถานการณ์: คุณเกิดมาพร้อมพลัง Empress ที่ทำให้คุณเป็นคนอบอุ่น ใส่ใจคนรอบข้าง และมีความคิดสร้างสรรค์สูง เลข 9 เสริมให้คุณมีวิสัยทัศน์กว้าง เห็นภาพใหญ่ และมักคิดถึงประโยชน์ส่วนรวม คุณมีพรสวรรค์ในงานที่ต้องดูแลคน สอน หรือสร้างสรรค์\n\nจุดที่ควรระวัง: อย่าให้มากเกินไปจนลืมดูแลตัวเอง The Empress บางครั้งอาจทำให้คุณเหนื่อยจากการดูแลคนอื่น เลข 9 อาจทำให้คุณรู้สึกว่าต้องช่วยทุกคน แต่จำไว้ว่าคุณไม่สามารถช่วยทุกคนได้ ต้องตั้งขอบเขต\n\nแนวทางที่ควรทำ: ใช้พรสวรรค์ด้านการเลี้ยงดูในอาชีพที่เหมาะสม เช่น การสอน การดูแลสุขภาพ งานสร้างสรรค์ หรือธุรกิจที่เกี่ยวกับความงาม ฝึกสมดุลระหว่างการให้และการรับ สร้างพื้นที่ส่วนตัวที่ให้คุณได้พักผ่อนและเติมพลัง และจำไว้ว่าการดูแลตัวเองก็คือการดูแลคนที่คุณรักด้วย"
}
  `,
  notes: "Shows upright spirit card with focus on natural strengths and life-long guidance"
};
```

#### Numerology Example

```typescript
// src/lib/ai/examples/numerology-examples.ts

export const NUMEROLOGY_HIGH_SCORE: FewShotExample = {
  scenario: "High score phone number - auspicious",
  input: `
เบอร์: 081-234-5678
คะแนน: 87/99 (ดีมาก)
เลขรวม: 45
เลขราก: 9
งาน: ก้าวหน้า มีโอกาสดี
เงิน: มั่นคง เงินไหลเวียน
ความสัมพันธ์: ราบรื่น เป็นที่รัก
คำเตือน: อย่าประมาท
  `,
  output: `
{
  "summary": "เบอร์นี้ได้คะแนน 87/99 ถือว่าเป็นเบอร์มงคลระดับดีมาก เลขราก 9 เป็นเลขแห่งความสำเร็จและการเติบโตสูงสุด พลังงานของเบอร์นี้สนับสนุนทั้งด้านการงาน การเงิน และความสัมพันธ์ แต่ต้องใช้อย่างมีสติ",
  "cardStructure": "ภาพรวมสถานการณ์: เบอร์นี้มีพลังงานเลข 9 ซึ่งในวัฒนธรรมไทยถือเป็นเลขมงคลสูงสุด หมายถึงความก้าวหน้า การเติบโต และการบรรลุเป้าหมาย เลขรวม 45 (4+5=9) เสริมพลังนี้ให้แข็งแกร่งยิ่งขึ้น คะแนน 87 บอกว่าเบอร์นี้มีความสมดุลดี ไม่มีเลขที่ขัดแย้งกัน\n\nจุดที่ควรระวัง: เบอร์ดีไม่ได้หมายความว่าทุกอย่างจะสำเร็จเองโดยไม่ต้องทำอะไร เลข 9 ต้องการการลงมือทำและความมุ่งมั่น อย่าประมาทหรือหยุดพัฒนาตัวเอง เพราะพลังงานของเลข 9 ทำงานได้ดีที่สุดเมื่อคุณมีเป้าหมายชัดเจนและลงมือทำอย่างจริงจัง\n\nแนวทางที่ควรทำ: ใช้เบอร์นี้ในการติดต่อธุรกิจ การสมัครงาน หรือการสร้างเครือข่าย เพราะพลังงานของมันช่วยสร้างความประทับใจและโอกาส ตั้งเป้าหมายระยะยาว (1-3 ปี) และใช้พลังงานของเลข 9 ผลักดันให้บรรลุ ดูแลความสัมพันธ์กับคนรอบข้าง เพราะเลข 9 ทำงานได้ดีในเรื่องการเป็นผู้นำและสร้างแรงบันดาลใจให้คนอื่น"
}
  `,
  notes: "Shows high-score numerology with positive framing and cultural context"
};
```

### Prompt Template Structure

```typescript
// src/lib/ai/templates/base.ts

export function buildBasePrompt(sections: {
  role: string;
  culturalContext: string;
  fewShotExamples: string;
  instructions: string;
  userData: string;
}): string {
  return `
${sections.role}

${sections.culturalContext}

${sections.fewShotExamples}

${sections.instructions}

${sections.userData}
  `.trim();
}
```

### Migration Strategy

1. **Phase 1**: Create new prompt module structure (no breaking changes)
2. **Phase 2**: Update one API route at a time to use new prompts
3. **Phase 3**: A/B test new prompts vs old prompts
4. **Phase 4**: Fully migrate all routes once validated
5. **Phase 5**: Remove old prompt code

This allows gradual rollout with easy rollback if issues arise.

