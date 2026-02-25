# Implementation Plan: Popular Fortune Features

## Overview

This implementation plan breaks down the development of six new fortune-telling features into discrete, incremental tasks. The approach follows the existing REFFORTUNE architecture patterns: deterministic baseline interpretations enhanced by AI, credit-based monetization, local storage for privacy, and fast response times through caching.

The implementation is organized into logical phases: shared infrastructure first, then individual features, followed by integration and testing. Each task builds on previous work to ensure no orphaned code.

**Status Update:** Core implementation is complete. Remaining work focuses on property-based testing, integration testing, and final polish.

## Tasks

- [ ] 1. Set up shared infrastructure and type definitions
  - [x] 1.1 Create shared type definitions for new features
    - Create `src/lib/horoscope/types.ts` with ZodiacSign enum, TimePeriod enum, HoroscopeInput, HoroscopeReading interfaces
    - Create `src/lib/compatibility/types.ts` with CompatibilityInput, CompatibilityReading interfaces
    - Create `src/lib/chinese-zodiac/types.ts` with ChineseZodiacAnimal enum, ChineseElement enum, ChineseZodiacInput, ChineseZodiacReading interfaces
    - Create `src/lib/name-numerology/types.ts` with NameNumerologyInput, NameNumerologyReading interfaces
    - _Requirements: 1.1, 2.1, 3.1, 4.1, 5.1, 6.1_
  
  - [x] 1.2 Extend reading pipeline types
    - Update `src/lib/reading/types.ts` to add new ReadingType enum values: HOROSCOPE, COMPATIBILITY, CHINESE_ZODIAC, SPECIALIZED, NAME_NUMEROLOGY
    - Update ReadingRequest and ReadingResult interfaces to support new types
    - _Requirements: 7.1, 7.2_
  
  - [x] 1.3 Create cache manager utility
    - Implement `src/lib/reading/cache.ts` with setCacheEntry, getCacheEntry, isCacheValid, clearExpiredCache, clearCacheByPrefix, generateCacheKey functions
    - Use local storage with prefix `fortune_cache_`
    - Support TTL-based expiration
    - _Requirements: 10.3, 10.4, 10.5_
  
  - [~]* 1.4 Write property tests for cache manager
    - **Property 3: Horoscope Cache Consistency**
    - Test that same key returns same data, different dates return different data
    - **Validates: Requirements 1.5, 10.3, 10.4, 10.5**

- [ ] 2. Implement zodiac engine and horoscope features
  - [x] 2.1 Implement zodiac sign utilities
    - Create `src/lib/horoscope/zodiac.ts` with calculateZodiacSign, getZodiacMetadata, getZodiacThaiName, getAllZodiacSigns functions
    - Define all 12 zodiac signs with Thai names, elements, qualities, date ranges
    - _Requirements: 1.1, 3.3_
  
  - [x]* 2.2 Write property test for zodiac calculation
    - **Property 7: Zodiac Sign Calculation Correctness**
    - Test that any birth date maps to correct zodiac sign based on date ranges
    - **Validates: Requirements 3.3**
  
  - [~]* 2.3 Write unit tests for zodiac boundary dates
    - Test zodiac sign boundaries (Mar 20/21, Apr 19/20, etc.)
    - Test leap year dates (Feb 29)
    - _Requirements: 3.3_
  
  - [x] 2.4 Implement baseline horoscope generation
    - Create `src/lib/horoscope/baseline.ts` with baseline interpretation templates for each zodiac sign
    - Implement seed-based randomization for lucky numbers and colors
    - Create deterministic content for love, career, finance, health aspects
    - _Requirements: 1.2, 1.3, 1.4_
  
  - [x] 2.5 Implement horoscope engine
    - Create `src/lib/horoscope/engine.ts` with generateHoroscope, getBaselineHoroscope, calculateDateRange functions
    - Implement date range calculation for daily, weekly, monthly periods
    - Integrate with cache manager
    - _Requirements: 1.2, 1.5, 2.2, 2.3, 2.5_
  
  - [~]* 2.6 Write property tests for horoscope engine
    - **Property 1: Horoscope Generation Completeness**
    - Test that any zodiac/date produces complete reading with all aspects
    - **Property 2: Date Range Calculation Correctness**
    - Test that date ranges match period type (daily=1 day, weekly=Mon-Sun, monthly=full month)
    - **Validates: Requirements 1.2, 1.4, 2.2, 2.3, 2.5**
  
  - [x] 2.7 Implement specialized domain readings
    - Create `src/lib/horoscope/specialized.ts` with generateSpecializedReading, getBaselineSpecializedReading functions
    - Implement domain-specific baseline templates for finance/career and love/relationships
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.6_

- [ ] 3. Implement compatibility engine
  - [x] 3.1 Implement compatibility scoring algorithm
    - Create `src/lib/compatibility/scoring.ts` with calculateElementScore, calculateQualityScore functions
    - Implement element compatibility rules (same=90-100, compatible=70-85, neutral=50-65, challenging=30-45)
    - Implement quality compatibility rules
    - Implement sign-specific pairing rules
    - _Requirements: 3.2, 3.6_
  
  - [x] 3.2 Implement baseline compatibility interpretations
    - Create `src/lib/compatibility/baseline.ts` with templates for strengths, challenges, advice based on score ranges
    - Create element compatibility descriptions
    - _Requirements: 3.4, 3.5_
  
  - [x] 3.3 Implement compatibility engine
    - Create `src/lib/compatibility/engine.ts` with calculateCompatibility, getBaselineCompatibility functions
    - Auto-calculate zodiac signs from birth dates
    - Calculate all score categories (overall, communication, emotional, long-term)
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6_
  
  - [~]* 3.4 Write property tests for compatibility engine
    - **Property 5: Compatibility Score Bounds**
    - Test that any two birth dates produce score in [0, 100]
    - **Property 6: Compatibility Score Determinism**
    - Test that same zodiac pair always produces same scores
    - **Property 8: Compatibility Output Completeness**
    - Test that result contains all four score categories, strengths, challenges, advice
    - **Validates: Requirements 3.2, 3.4, 3.5, 3.6**

- [x] 4. Implement Chinese zodiac engine
  - [x] 4.1 Implement Chinese zodiac calculation
    - Create `src/lib/chinese-zodiac/animals.ts` with animal and element definitions, Thai names, Chinese names
    - Implement calculateChineseZodiac function using formula: (year - 4) % 12
    - Implement calculateChineseElement function using formula: floor((year - 4) % 10 / 2)
    - _Requirements: 4.1, 4.2_
  
  - [~]* 4.2 Write property test for Chinese zodiac calculation
    - **Property 9: Chinese Zodiac Calculation Correctness**
    - Test that any birth year produces correct animal and element based on formulas
    - **Validates: Requirements 4.2**
  
  - [~]* 4.3 Write unit tests for known Chinese zodiac years
    - Test specific years: 2024=Dragon, 2025=Snake, 2020=Rat
    - Test element calculations for known years
    - _Requirements: 4.2_
  
  - [x] 4.4 Implement baseline Chinese zodiac interpretations
    - Create `src/lib/chinese-zodiac/baseline.ts` with fortune templates for each animal
    - Implement lucky colors, numbers, directions based on element
    - Create fortune sections for overall, career, wealth, health, relationships
    - _Requirements: 4.4, 4.5, 4.6_
  
  - [x] 4.5 Implement Chinese zodiac engine
    - Create `src/lib/chinese-zodiac/engine.ts` with generateChineseZodiacReading, getBaselineChineseZodiacReading functions
    - Support daily, weekly, monthly, yearly periods
    - Integrate with cache manager
    - _Requirements: 4.2, 4.3, 4.5_
  
  - [~]* 4.6 Write property test for Chinese zodiac output
    - **Property 10: Chinese Zodiac Output Completeness**
    - Test that result contains all fortune sections, lucky colors, numbers, directions
    - **Validates: Requirements 4.5**

- [ ] 5. Implement name numerology engine
  - [x] 5.1 Implement Thai character to number mapping
    - Create `src/lib/name-numerology/thai-mapping.ts` with thaiCharToNumber function
    - Define mapping for Thai consonants (ก=1, ข=2, ค=3, ง=4, จ=5, ฉ=6, ช=7, ซ=8, ฌ=9, cycling)
    - Define mapping for Thai vowels
    - _Requirements: 6.3_
  
  - [~]* 5.2 Write property test for Thai character mapping
    - **Property 13: Thai Character to Number Mapping Consistency**
    - Test that any Thai character always maps to same number in range [1, 9]
    - **Validates: Requirements 6.3**
  
  - [x] 5.3 Implement name score calculation
    - Create `src/lib/name-numerology/engine.ts` with calculateNameScore, isValidThaiName functions
    - Implement score reduction to single digit (preserve 11, 22 as master numbers)
    - Calculate firstName, lastName, fullName, destiny scores
    - _Requirements: 6.2, 6.4_
  
  - [~]* 5.4 Write property tests for name numerology
    - **Property 11: Thai Name Validation**
    - Test that validation accepts only Thai characters (U+0E00-U+0E7F) and spaces
    - **Property 12: Name Score Calculation Structure**
    - Test that result contains four scores, each in range [1-9] or master numbers [11, 22]
    - **Validates: Requirements 6.2, 6.4, 6.6, 6.7**
  
  - [~]* 5.5 Write unit tests for Thai name validation
    - Test rejection of English characters
    - Test acceptance of Thai characters with spaces
    - Test known Thai names with expected scores
    - _Requirements: 6.6, 6.7_
  
  - [x] 5.6 Implement baseline name numerology interpretations
    - Create `src/lib/name-numerology/baseline.ts` with interpretation templates for each destiny number (1-9, 11, 22)
    - Create personality, strengths, weaknesses, life path, career, relationships descriptions
    - _Requirements: 6.5_
  
  - [x] 5.7 Complete name numerology engine
    - Implement calculateNameNumerology, getBaselineNameNumerology functions
    - Generate lucky numbers based on destiny number
    - _Requirements: 6.1, 6.2, 6.5_
  
  - [~]* 5.8 Write property test for name numerology output
    - **Property 14: Name Numerology Output Completeness**
    - Test that interpretation contains personality, strengths, weaknesses, life path, career, relationships
    - **Validates: Requirements 6.5**

- [~] 6. Checkpoint - Ensure all engines pass tests
  - Ensure all tests pass, ask the user if questions arise.

- [x] 7. Extend reading pipeline and integrate monetization
  - [x] 7.1 Update reading pipeline for new features
    - Update `src/lib/reading/pipeline.ts` to handle new ReadingType values
    - Implement processReading function routing for each new feature type
    - Integrate cache checking before engine execution
    - _Requirements: 7.1, 10.3_
  
  - [x] 7.2 Implement credit cost configuration
    - Update `src/lib/monetization/paywall.ts` to define credit costs for new features
    - Implement getCreditCost function: daily=1, weekly=2, monthly=3, compatibility=2, Chinese zodiac=1, specialized=2, name numerology=2
    - _Requirements: 7.2_
  
  - [~]* 7.3 Write property test for credit costs
    - **Property 15: Credit Cost Consistency**
    - Test that any reading type returns correct credit cost
    - **Validates: Requirements 7.2**
  
  - [x] 7.4 Implement paywall integration
    - Update paywall to evaluate credits before processing new reading types
    - Implement insufficient credits handling with purchase prompt
    - Implement first-time free reading logic per feature type
    - Track free readings in local storage with key `free_readings_{feature_type}`
    - _Requirements: 7.1, 7.3, 7.5, 7.6_
  
  - [~]* 7.5 Write property tests for credit system
    - **Property 16: Credit Deduction Correctness**
    - Test that credits decrease by correct amount after reading
    - **Property 17: First Reading Free Policy**
    - Test that first reading is free, second costs credits
    - **Property 21: Paywall Evaluation Trigger**
    - Test that paywall is checked before any feature access
    - **Property 22: Insufficient Credits Handling**
    - Test that insufficient credits shows prompt and blocks reading
    - **Validates: Requirements 7.1, 7.3, 7.4, 7.5**

- [x] 8. Implement library storage for new features
  - [x] 8.1 Extend library storage types
    - Update `src/lib/library/types.ts` to include new data models: HoroscopeData, CompatibilityData, ChineseZodiacData, NameNumerologyData, SpecializedData
    - Update LibraryEntry to support new reading types
    - _Requirements: 8.1, 8.7_
  
  - [x] 8.2 Update library storage functions
    - Update `src/lib/library/storage.ts` to handle new reading types
    - Implement preview generation for each new type (first 100 characters)
    - Implement 50-entry limit with oldest-first eviction (preserve favorites)
    - _Requirements: 8.1, 8.2, 8.3, 8.6_
  
  - [x]* 8.3 Write property tests for library storage
    - **Property 4: Reading History Persistence**
    - Test that completed readings appear in history and remain retrievable
    - **Property 18: Reading History Size Limit**
    - Test that history never exceeds 50 entries, oldest removed when adding 51st
    - **Property 20: Reading Deletion Completeness**
    - Test that deleted reading disappears and count decreases
    - **Validates: Requirements 1.8, 3.7, 8.1, 8.2, 8.3, 8.5, 8.6**
  
  - [x]* 8.4 Write unit tests for library edge cases
    - Test that favorite readings are not removed when at limit
    - Test that oldest non-favorite is removed first
    - _Requirements: 8.3_
  
  - [x] 8.5 Update library React hook
    - Update `src/lib/library/useLibrary.ts` to support new reading types
    - Implement filtering by feature type
    - Implement delete functionality
    - _Requirements: 8.4, 8.6_
  
  - [x]* 8.6 Write property test for library organization
    - **Property 19: Reading History Organization**
    - Test that library view groups by feature type and shows date, type, preview
    - **Validates: Requirements 8.4, 8.7**

- [x] 9. Implement AI integration for new features
  - [x] 9.1 Create horoscope AI API route
    - Create `src/app/api/ai/horoscope/route.ts` with POST handler
    - Accept zodiac sign, period, baseline interpretation as input
    - Call Gemini API with Thai language prompt
    - Validate response (non-empty, min 100 Thai characters)
    - Implement retry logic (once on validation failure)
    - Return combined baseline + AI interpretation
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5, 11.6_
  
  - [x] 9.2 Create compatibility AI API route
    - Create `src/app/api/ai/compatibility/route.ts` with POST handler
    - Accept two zodiac signs, baseline compatibility as input
    - Generate personalized advice based on birth dates
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5_
  
  - [x] 9.3 Create Chinese zodiac AI API route
    - Create `src/app/api/ai/chinese-zodiac/route.ts` with POST handler
    - Accept animal, element, period, baseline fortune as input
    - Generate culturally appropriate Thai interpretation
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5_
  
  - [x] 9.4 Create name numerology AI API route
    - Create `src/app/api/ai/name-numerology/route.ts` with POST handler
    - Accept name scores, baseline interpretation as input
    - Generate personalized life path guidance
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5_
  
  - [x]* 9.5 Write property tests for AI integration
    - **Property 23: API Fallback Behavior**
    - Test that API failure returns baseline interpretation
    - **Property 24: AI Response Validation**
    - Test that responses are validated and retried once on failure
    - **Property 25: AI Request Context Completeness**
    - Test that API requests include all required context parameters
    - **Property 26: Output Structure with AI Enhancement**
    - Test that output indicates baseline vs AI sections with confidence
    - **Validates: Requirements 10.2, 11.1, 11.3, 11.4, 11.5, 11.6, 11.7**
  
  - [x]* 9.6 Write unit tests for API error handling
    - Test API timeout handling
    - Test rate limit handling
    - Test invalid response handling
    - _Requirements: 10.2, 11.5_

- [x] 10. Implement UI components for new features
  - [x] 10.1 Create zodiac selector component
    - Create `src/components/horoscope/ZodiacSelector.tsx` with all 12 zodiac signs
    - Display Thai names and symbols
    - Support selection state
    - _Requirements: 1.1, 9.1_
  
  - [x] 10.2 Create period selector component
    - Create `src/components/horoscope/PeriodSelector.tsx` for daily/weekly/monthly selection
    - Maintain zodiac selection when switching periods
    - _Requirements: 2.1, 2.6_
  
  - [~]* 10.3 Write property test for period switching
    - **Property 31: Period Maintenance Across UI Changes**
    - Test that zodiac sign remains unchanged when switching periods
    - **Validates: Requirements 2.6**
  
  - [x] 10.4 Create date input pair component
    - Create `src/components/compatibility/DateInputPair.tsx` for two birth date inputs
    - Validate date format and ranges
    - Display Thai labels
    - _Requirements: 3.1, 9.6_
  
  - [x] 10.5 Create Chinese zodiac animal display component
    - Create `src/components/chinese-zodiac/AnimalDisplay.tsx` to show animal, element, Thai name
    - Display animal icon/image
    - _Requirements: 4.1, 4.6_
  
  - [x] 10.6 Create Thai name input component
    - Create `src/components/name-numerology/ThaiNameInput.tsx` with validation
    - Show real-time validation feedback
    - Display error messages in Thai
    - _Requirements: 6.1, 6.6, 6.7, 9.6_
  
  - [x] 10.7 Create reading result display component
    - Create `src/components/reading/FortuneReadingBlocks.tsx` to display structured fortune readings
    - Support all new reading types with appropriate formatting
    - Show confidence indicators for baseline vs AI content
    - Display post-reading options (view another, share, return to menu)
    - _Requirements: 9.5, 11.7_
  
  - [~]* 10.8 Write property test for post-reading options
    - **Property 34: Post-Reading Options Completeness**
    - Test that result page offers all three options
    - **Validates: Requirements 9.5**

- [x] 11. Implement feature pages and routing
  - [x] 11.1 Create horoscope feature pages
    - Create `src/app/horoscope/page.tsx` for feature selection (daily/weekly/monthly)
    - Create `src/app/horoscope/daily/page.tsx` for zodiac selection
    - Create `src/app/horoscope/daily/result/page.tsx` for daily horoscope display
    - Create `src/app/horoscope/weekly/result/page.tsx` for weekly horoscope display
    - Create `src/app/horoscope/monthly/result/page.tsx` for monthly horoscope display
    - Integrate with zodiac selector, period selector, reading pipeline
    - _Requirements: 1.1, 1.2, 2.1, 2.2, 2.3, 9.1, 9.2_
  
  - [x] 11.2 Create compatibility feature pages
    - Create `src/app/compatibility/page.tsx` for birth date input
    - Create `src/app/compatibility/result/page.tsx` for compatibility display
    - Integrate with date input pair, compatibility engine, reading pipeline
    - _Requirements: 3.1, 3.2, 9.1_
  
  - [x] 11.3 Create Chinese zodiac feature pages
    - Create `src/app/chinese-zodiac/page.tsx` for birth year input and period selection
    - Create `src/app/chinese-zodiac/result/page.tsx` for fortune display
    - Integrate with Chinese zodiac engine, reading pipeline
    - _Requirements: 4.1, 4.2, 4.3, 9.1_
  
  - [x] 11.4 Create specialized reading feature pages
    - Create `src/app/specialized/page.tsx` for domain and period selection
    - Create `src/app/specialized/result/page.tsx` for specialized reading display
    - Integrate with zodiac selector, specialized engine, reading pipeline
    - _Requirements: 5.1, 5.4, 5.6, 9.1_
  
  - [x] 11.5 Create name numerology feature pages
    - Create `src/app/name-numerology/page.tsx` for Thai name input
    - Create `src/app/name-numerology/result/page.tsx` for numerology display
    - Integrate with Thai name input, name numerology engine, reading pipeline
    - _Requirements: 6.1, 6.2, 9.1_
  
  - [x] 11.6 Add navigation menu to all feature pages
    - Update all feature pages to include navigation menu
    - Menu should link to all fortune features
    - _Requirements: 9.2_
  
  - [ ]* 11.7 Write property test for navigation presence
    - **Property 32: Navigation Menu Presence**
    - Test that all feature pages include navigation menu
    - **Validates: Requirements 9.2**
  
  - [x] 11.8 Add FAB to all feature pages
    - Add floating action button with LINE add CTA to all feature pages
    - _Requirements: 9.4_
  
  - [ ]* 11.9 Write property test for FAB presence
    - **Property 33: FAB Presence on Feature Pages**
    - Test that all feature pages include FAB
    - **Validates: Requirements 9.4**

- [x] 12. Implement library view for new features
  - [x] 12.1 Update library page to support new reading types
    - Update `src/app/library/saved/page.tsx` to display new reading types
    - Implement filtering by feature type
    - Display date, type, preview for each entry
    - Implement delete functionality
    - _Requirements: 8.4, 8.6, 8.7_
  
  - [x] 12.2 Create feature selection landing page
    - Create or update main landing page to showcase all fortune features
    - Display icons, descriptions for each feature
    - Link to each feature's entry point
    - _Requirements: 9.1_

- [x] 13. Implement error handling and localization
  - [x] 13.1 Create error display component
    - Create `src/components/ui/ErrorDisplay.tsx` for user-friendly error messages
    - Support retry and dismiss actions
    - Display all messages in Thai
    - _Requirements: 10.6, 10.7_
  
  - [x] 13.2 Implement input validation with Thai error messages
    - Add validation to all input forms (zodiac, dates, names)
    - Display Thai error messages for invalid inputs
    - _Requirements: 6.6, 6.7, 10.6_
  
  - [ ]* 13.3 Write property tests for error handling
    - **Property 27: Thai Language Output**
    - Test that all reading outputs contain Thai characters
    - **Property 28: Error Message Localization**
    - Test that error messages are in Thai and don't expose technical details
    - **Validates: Requirements 1.7, 4.6, 9.6, 10.6, 10.7**

- [x] 14. Implement data privacy features
  - [x] 14.1 Create settings page for data management
    - Create `src/app/settings/page.tsx` with clear data functionality
    - Implement clear all data button
    - Remove all local storage keys on clear: readings, cache, personal data, free reading flags
    - _Requirements: 12.3, 12.4_
  
  - [ ]* 14.2 Write property tests for data privacy
    - **Property 29: Local Storage Only Policy**
    - Test that no external storage requests are made (except Gemini API)
    - **Property 30: Data Clearing Completeness**
    - Test that clear operation removes all fortune-related storage keys
    - **Property 36: Cookie Absence**
    - Test that no cookies are set during any operation
    - **Validates: Requirements 12.1, 12.2, 12.3, 12.4, 12.5**
  
  - [x] 14.3 Implement privacy notice display
    - Create privacy notice component
    - Display on first use of each feature type
    - Track display state in local storage per feature
    - _Requirements: 12.6_
  
  - [ ]* 14.4 Write property test for privacy notice
    - **Property 35: Privacy Notice on First Use**
    - Test that notice is shown on first use, not on subsequent uses
    - **Validates: Requirements 12.6**

- [ ] 15. Complete property-based testing implementation
  - [ ]* 15.1 Implement cache consistency property tests
    - **Property 3: Horoscope Cache Consistency**
    - Test that same key returns same data on same date, different data on different dates
    - Use fast-check to generate random zodiac signs and dates
    - **Validates: Requirements 1.5, 10.3, 10.4, 10.5**
  
  - [ ]* 15.2 Implement zodiac calculation property tests
    - **Property 7: Zodiac Sign Calculation Correctness**
    - Test that any birth date maps to correct zodiac sign based on date ranges
    - Generate random dates and verify zodiac sign matches expected range
    - **Validates: Requirements 3.3**
  
  - [ ]* 15.3 Implement horoscope generation property tests
    - **Property 1: Horoscope Generation Completeness**
    - Test that any zodiac/date produces complete reading with all aspects
    - **Property 2: Date Range Calculation Correctness**
    - Test that date ranges match period type (daily=1 day, weekly=Mon-Sun, monthly=full month)
    - **Validates: Requirements 1.2, 1.4, 2.2, 2.3, 2.5**
  
  - [ ]* 15.4 Implement compatibility engine property tests
    - **Property 5: Compatibility Score Bounds**
    - Test that any two birth dates produce score in [0, 100]
    - **Property 6: Compatibility Score Determinism**
    - Test that same zodiac pair always produces same scores
    - **Property 8: Compatibility Output Completeness**
    - Test that result contains all four score categories, strengths, challenges, advice
    - **Validates: Requirements 3.2, 3.4, 3.5, 3.6**
  
  - [ ]* 15.5 Implement Chinese zodiac property tests
    - **Property 9: Chinese Zodiac Calculation Correctness**
    - Test that any birth year produces correct animal and element based on formulas
    - **Property 10: Chinese Zodiac Output Completeness**
    - Test that result contains all fortune sections, lucky colors, numbers, directions
    - **Validates: Requirements 4.2, 4.5**
  
  - [ ]* 15.6 Implement name numerology property tests
    - **Property 11: Thai Name Validation**
    - Test that validation accepts only Thai characters (U+0E00-U+0E7F) and spaces
    - **Property 12: Name Score Calculation Structure**
    - Test that result contains four scores, each in range [1-9] or master numbers [11, 22]
    - **Property 13: Thai Character to Number Mapping Consistency**
    - Test that any Thai character always maps to same number in range [1, 9]
    - **Property 14: Name Numerology Output Completeness**
    - Test that interpretation contains personality, strengths, weaknesses, life path, career, relationships
    - **Validates: Requirements 6.2, 6.3, 6.4, 6.5, 6.6, 6.7**
  
  - [ ]* 15.7 Implement credit system property tests
    - **Property 15: Credit Cost Consistency**
    - Test that any reading type returns correct credit cost
    - **Property 16: Credit Deduction Correctness**
    - Test that credits decrease by correct amount after reading
    - **Property 17: First Reading Free Policy**
    - Test that first reading is free, second costs credits
    - **Property 21: Paywall Evaluation Trigger**
    - Test that paywall is checked before any feature access
    - **Property 22: Insufficient Credits Handling**
    - Test that insufficient credits shows prompt and blocks reading
    - **Validates: Requirements 7.1, 7.2, 7.3, 7.4, 7.5**
  
  - [ ]* 15.8 Implement library storage property tests
    - **Property 4: Reading History Persistence**
    - Test that completed readings appear in history and remain retrievable
    - **Property 18: Reading History Size Limit**
    - Test that history never exceeds 50 entries, oldest removed when adding 51st
    - **Property 19: Reading History Organization**
    - Test that library view groups by feature type and shows date, type, preview
    - **Property 20: Reading Deletion Completeness**
    - Test that deleted reading disappears and count decreases
    - **Validates: Requirements 1.8, 3.7, 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7**
  
  - [ ]* 15.9 Implement AI integration property tests
    - **Property 23: API Fallback Behavior**
    - Test that API failure returns baseline interpretation
    - **Property 24: AI Response Validation**
    - Test that responses are validated and retried once on failure
    - **Property 25: AI Request Context Completeness**
    - Test that API requests include all required context parameters
    - **Property 26: Output Structure with AI Enhancement**
    - Test that output indicates baseline vs AI sections with confidence
    - **Validates: Requirements 10.2, 11.1, 11.3, 11.4, 11.5, 11.6, 11.7**
  
  - [ ]* 15.10 Implement localization and error handling property tests
    - **Property 27: Thai Language Output**
    - Test that all reading outputs contain Thai characters
    - **Property 28: Error Message Localization**
    - Test that error messages are in Thai and don't expose technical details
    - **Validates: Requirements 1.7, 4.6, 9.6, 10.6, 10.7**
  
  - [ ]* 15.11 Implement data privacy property tests
    - **Property 29: Local Storage Only Policy**
    - Test that no external storage requests are made (except Gemini API)
    - **Property 30: Data Clearing Completeness**
    - Test that clear operation removes all fortune-related storage keys
    - **Property 35: Privacy Notice on First Use**
    - Test that notice is shown on first use, not on subsequent uses
    - **Property 36: Cookie Absence**
    - Test that no cookies are set during any operation
    - **Validates: Requirements 12.1, 12.2, 12.3, 12.4, 12.5, 12.6**
  
  - [ ]* 15.12 Implement UI behavior property tests
    - **Property 31: Period Maintenance Across UI Changes**
    - Test that zodiac sign remains unchanged when switching periods
    - **Property 32: Navigation Menu Presence**
    - Test that all feature pages include navigation menu
    - **Property 33: FAB Presence on Feature Pages**
    - Test that all feature pages include FAB
    - **Property 34: Post-Reading Options Completeness**
    - Test that result page offers all three options
    - **Validates: Requirements 2.6, 9.2, 9.4, 9.5**

- [ ] 16. Integration testing and validation
  - [ ] 16.1 Test end-to-end user flows for each feature
    - Test horoscope flow: zodiac selection → period selection → generation → display → save → library
    - Test compatibility flow: date input → calculation → display → save → library
    - Test Chinese zodiac flow: year input → period selection → generation → display → save → library
    - Test specialized reading flow: domain selection → zodiac selection → period selection → generation → display → save → library
    - Test name numerology flow: name input → validation → calculation → display → save → library
    - _Requirements: All feature requirements_
  
  - [ ] 16.2 Test credit system integration
    - Test credit deduction for each feature type with correct amounts
    - Test first-time free reading for each feature type
    - Test paywall blocking when credits insufficient
    - Test credit purchase prompt display
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6_
  
  - [ ] 16.3 Test cache behavior
    - Test daily horoscope cache hit on same date
    - Test cache invalidation on date change
    - Test weekly horoscope cache spanning Monday-Sunday
    - Test monthly horoscope cache spanning full month
    - Test cache key generation for different parameters
    - _Requirements: 1.5, 10.3, 10.4, 10.5_
  
  - [ ] 16.4 Test error handling scenarios
    - Test invalid zodiac sign input handling
    - Test invalid birth date input handling (future dates, too old dates, invalid format)
    - Test invalid Thai name input handling (English characters, empty input)
    - Test API timeout handling with fallback to baseline
    - Test API rate limit handling
    - Test local storage quota exceeded handling
    - _Requirements: 6.6, 6.7, 10.2, 10.6, 10.7_
  
  - [ ] 16.5 Test library functionality
    - Test reading saved to library after completion
    - Test library displays all reading types correctly
    - Test library filtering by feature type
    - Test reading deletion from library
    - Test 50-entry limit with oldest removal
    - Test favorite readings preserved at limit
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7_
  
  - [ ] 16.6 Test data privacy features
    - Test clear all data removes all local storage keys
    - Test privacy notice displays on first use of each feature
    - Test no cookies are set during any operation
    - Test no external storage requests (except Gemini API)
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5, 12.6_

- [ ] 17. Performance validation and optimization
  - [ ] 17.1 Measure reading generation performance
    - Verify all readings complete within 5 seconds from input submission
    - Measure baseline generation time (should be <500ms)
    - Measure AI enhancement time (should be <4 seconds)
    - Measure cache hit performance (should be <100ms)
    - _Requirements: 1.6, 10.1_
  
  - [ ] 17.2 Test API fallback performance
    - Test that API timeout triggers fallback within 10 seconds
    - Test that baseline fallback completes within 1 second
    - Verify no user-facing delays when API unavailable
    - _Requirements: 10.2_
  
  - [ ] 17.3 Optimize cache strategy
    - Verify cache reduces API calls for daily horoscopes
    - Test cache invalidation timing (midnight for daily, end of week for weekly, end of month for monthly)
    - Measure cache storage size and cleanup effectiveness
    - _Requirements: 10.3, 10.4, 10.5_
  
  - [ ] 17.4 Test with realistic data volumes
    - Test with 50 readings in library (maximum)
    - Test with multiple cached horoscopes (12 zodiac signs × 3 periods)
    - Test with large Thai names (long first name + long surname)
    - Verify no performance degradation with full data
    - _Requirements: 8.2, 8.3_

- [ ] 18. Content quality review
  - [ ] 18.1 Review Thai language content
    - Review all UI text for Thai language correctness and natural tone
    - Review all error messages for clarity and actionability
    - Review all baseline interpretations for conversational tone
    - Verify zodiac Thai names are accurate and commonly used
    - Verify Chinese zodiac Thai names are accurate
    - _Requirements: 1.7, 4.6, 9.6, 10.6_
  
  - [ ] 18.2 Review baseline interpretation quality
    - Review horoscope baseline templates for all 12 zodiac signs
    - Review compatibility baseline templates for different score ranges
    - Review Chinese zodiac baseline templates for all 12 animals
    - Review name numerology baseline templates for all destiny numbers (1-9, 11, 22)
    - Review specialized reading templates for both domains
    - Ensure all baselines provide actionable, specific guidance
    - _Requirements: 1.3, 1.4, 3.4, 3.5, 4.4, 5.5, 6.5_
  
  - [ ] 18.3 Review AI prompt quality
    - Review horoscope AI prompts for context completeness
    - Review compatibility AI prompts for personalization
    - Review Chinese zodiac AI prompts for cultural appropriateness
    - Review name numerology AI prompts for depth
    - Ensure all prompts request Thai language output
    - _Requirements: 11.1, 11.3_
  
  - [ ] 18.4 Test AI output quality
    - Generate sample readings for each feature with AI enhancement
    - Verify AI outputs are relevant and high-quality
    - Verify AI outputs are in Thai with conversational tone
    - Verify AI outputs meet minimum length requirements (100+ Thai characters)
    - Test that AI enhancement adds value beyond baseline
    - _Requirements: 11.3, 11.4_

- [ ] 19. Final polish and code quality
  - [ ] 19.1 Code cleanup
    - Remove all console.log statements used for debugging
    - Remove commented-out code
    - Remove unused imports and variables
    - Ensure consistent code formatting
    - _Requirements: All_
  
  - [ ] 19.2 Documentation
    - Add JSDoc comments to all public functions in engines
    - Add JSDoc comments to all API route handlers
    - Document complex algorithms (compatibility scoring, name numerology calculation)
    - Add inline comments for non-obvious logic
    - Update README with new features if needed
    - _Requirements: All_
  
  - [ ] 19.3 Type safety review
    - Run TypeScript compiler with strict mode
    - Fix any type errors or warnings
    - Add explicit return types to all public functions
    - Ensure no 'any' types except where necessary
    - _Requirements: All_
  
  - [ ] 19.4 Linting and formatting
    - Run ESLint and fix all issues
    - Run Prettier to format all code
    - Ensure consistent naming conventions
    - Verify all files follow project structure guidelines
    - _Requirements: All_
  
  - [ ] 19.5 Test coverage verification
    - Run test coverage report
    - Verify line coverage ≥ 80%
    - Verify branch coverage ≥ 75%
    - Verify function coverage ≥ 85%
    - Identify and test any uncovered critical paths
    - _Requirements: All_

- [ ] 20. Final checkpoint - Complete validation
  - [ ] 20.1 Run complete test suite
    - Execute all unit tests (should pass 100%)
    - Execute all property tests with 100 iterations each (should pass 100%)
    - Execute all integration tests (should pass 100%)
    - Verify no test failures or warnings
    - _Requirements: All_
  
  - [ ] 20.2 Manual testing checklist
    - Test each feature on desktop browser (Chrome, Firefox, Safari)
    - Test each feature on mobile browser (iOS Safari, Android Chrome)
    - Test with different screen sizes (mobile, tablet, desktop)
    - Test with slow network connection (3G simulation)
    - Test with API failures (disconnect network)
    - Test with local storage disabled (privacy mode)
    - _Requirements: All_
  
  - [ ] 20.3 Accessibility review
    - Test keyboard navigation for all features
    - Test screen reader compatibility (basic check)
    - Verify color contrast meets WCAG AA standards
    - Verify all interactive elements have proper labels
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6_
  
  - [ ] 20.4 Final sign-off
    - Ensure all requirements are implemented and tested
    - Ensure all correctness properties have corresponding tests
    - Ensure all known bugs are fixed or documented
    - Ensure code is production-ready
    - Ask the user if any questions or concerns arise
    - _Requirements: All_

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties (minimum 100 iterations each)
- Unit tests validate specific examples and edge cases
- All code should follow existing REFFORTUNE patterns and structure
- Thai language is required for all user-facing text
- Local storage is the only persistence mechanism (no server-side storage)
- Gemini API is used for AI enhancement, with baseline fallback on failure

## Implementation Status

**Completed (Tasks 1-14):**
- ✅ Shared infrastructure and type definitions
- ✅ Zodiac engine and horoscope features
- ✅ Compatibility engine
- ✅ Chinese zodiac engine
- ✅ Name numerology engine
- ✅ Reading pipeline and monetization integration
- ✅ Library storage for new features
- ✅ AI integration API routes
- ✅ UI components for all features
- ✅ Feature pages and routing
- ✅ Library view updates
- ✅ Error handling and localization
- ✅ Data privacy features

**Remaining Work (Tasks 15-20):**
- ⏳ Property-based testing implementation (36 properties to test)
- ⏳ Integration testing and validation
- ⏳ Performance validation and optimization
- ⏳ Content quality review (Thai language, baseline interpretations, AI prompts)
- ⏳ Final polish and code quality (cleanup, documentation, type safety, linting)
- ⏳ Complete validation and sign-off

**Test Coverage Status:**
- Unit tests: Partially implemented for core engines
- Property tests: Most not yet implemented (marked with [~]* or [ ]*)
- Integration tests: Not yet implemented
- Coverage goals: 80% line, 75% branch, 85% function (not yet measured)

**Next Steps:**
1. Implement property-based tests for all 36 correctness properties (Task 15)
2. Conduct integration testing for all user flows (Task 16)
3. Validate performance meets <5 second requirement (Task 17)
4. Review and improve content quality (Task 18)
5. Final code cleanup and documentation (Task 19)
6. Complete validation and sign-off (Task 20)

