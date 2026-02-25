# Validation Metrics and Logging

This document describes the metrics tracking and logging features added to the AI validation system.

## Overview

The validation module now includes comprehensive metrics tracking and error logging to monitor AI response quality and identify issues in production.

## Features

### 1. Automatic Metrics Tracking

Every call to `validateAIResponse()` automatically tracks:
- Total validations performed
- Passed vs failed validations
- Error types and frequencies
- Errors by divination type (tarot, spirit, numerology, chat)

### 2. Fallback Usage Tracking

The system tracks when fallback structures are used:
- Empty cardStructure inputs
- Missing section labels
- Manual fallback triggers

### 3. Error Logging

All validation failures and fallbacks are logged with:
- Timestamp
- Error type (validation, template, api)
- Divination type
- Error message
- Context data

### 4. Quality Metrics

Calculate quality metrics:
- Validation pass rate (percentage)
- Fallback usage rate (percentage)
- Error distribution by type and divination type

## API Reference

### Core Functions

#### `validateAIResponse(response, type)`
Validates an AI response and automatically tracks metrics.

```typescript
const result = validateAIResponse(response, 'tarot');
// Returns: { isValid: boolean, errors: string[], warnings: string[] }
```

#### `getValidationMetrics()`
Returns current metrics snapshot.

```typescript
const metrics = getValidationMetrics();
// Returns: {
//   totalValidations: number,
//   passedValidations: number,
//   failedValidations: number,
//   fallbackUsages: number,
//   errorsByType: Record<string, number>,
//   errorsByDivinationType: Record<DivinationType, number>
// }
```

#### `getValidationPassRate()`
Returns validation pass rate as percentage (0-100) or null if no validations yet.

```typescript
const passRate = getValidationPassRate();
// Returns: number | null
```

#### `getFallbackUsageRate()`
Returns fallback usage rate as percentage (0-100) or null if no validations yet.

```typescript
const fallbackRate = getFallbackUsageRate();
// Returns: number | null
```

#### `trackFallbackUsage(type, reason)`
Manually track fallback usage (useful in API routes).

```typescript
trackFallbackUsage('tarot', 'Gemini API timeout');
```

#### `logError(log)`
Manually log an error with full context.

```typescript
logError({
  timestamp: new Date(),
  errorType: 'api',
  divinationType: 'tarot',
  errorMessage: 'Gemini API rate limit exceeded',
  context: { statusCode: 429 }
});
```

#### `getErrorLogs(options?)`
Retrieve error logs with optional filtering.

```typescript
// Get all logs
const allLogs = getErrorLogs();

// Filter by error type
const validationErrors = getErrorLogs({ errorType: 'validation' });

// Filter by divination type
const tarotErrors = getErrorLogs({ divinationType: 'tarot' });

// Get recent logs
const recentLogs = getErrorLogs({ limit: 10 });

// Get logs since date
const yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1);
const recentByDate = getErrorLogs({ since: yesterday });

// Combine filters
const filtered = getErrorLogs({
  errorType: 'validation',
  divinationType: 'tarot',
  since: yesterday,
  limit: 5
});
```

#### `resetMetrics()`
Reset all metrics and logs (useful for testing).

```typescript
resetMetrics();
```

#### `ensureFortuneStructure(input, summary, type?)`
Ensures fortune structure with optional fallback tracking.

```typescript
// With tracking
const structure = ensureFortuneStructure('', 'summary', 'tarot');

// Without tracking (backward compatible)
const structure = ensureFortuneStructure('', 'summary');
```

## Usage Examples

### Example 1: Basic Validation with Metrics

```typescript
import { validateAIResponse, getValidationMetrics } from '@/lib/ai/validation';

const response = {
  summary: 'คำทำนาย...',
  cardStructure: 'ภาพรวมสถานการณ์: ...'
};

const result = validateAIResponse(response, 'tarot');

if (!result.isValid) {
  console.error('Validation failed:', result.errors);
}

// Check metrics
const metrics = getValidationMetrics();
console.log('Total validations:', metrics.totalValidations);
```

### Example 2: Monitoring Quality

```typescript
import {
  getValidationPassRate,
  getFallbackUsageRate,
  getErrorLogs
} from '@/lib/ai/validation';

function monitorQuality() {
  const passRate = getValidationPassRate();
  const fallbackRate = getFallbackUsageRate();
  
  if (passRate !== null && passRate < 90) {
    console.warn(`⚠️ Low pass rate: ${passRate.toFixed(2)}%`);
    
    // Investigate recent errors
    const errors = getErrorLogs({ limit: 5 });
    console.log('Recent errors:', errors);
  }
  
  if (fallbackRate !== null && fallbackRate > 10) {
    console.warn(`⚠️ High fallback usage: ${fallbackRate.toFixed(2)}%`);
  }
}
```

### Example 3: API Route Integration

```typescript
import {
  validateAIResponse,
  ensureFortuneStructure,
  trackFallbackUsage
} from '@/lib/ai/validation';

export async function POST(request: Request) {
  try {
    const geminiResponse = await callGeminiAPI(prompt);
    const parsed = JSON.parse(geminiResponse);
    
    // Validate response (automatically tracks metrics)
    const validation = validateAIResponse(parsed, 'tarot');
    
    if (!validation.isValid) {
      // Use fallback (automatically tracks fallback usage)
      const fallbackStructure = ensureFortuneStructure(
        parsed.cardStructure || '',
        parsed.summary || 'ไม่สามารถสร้างคำทำนายได้',
        'tarot'
      );
      
      return Response.json({
        summary: parsed.summary || 'ไม่สามารถสร้างคำทำนายได้',
        cardStructure: fallbackStructure
      });
    }
    
    return Response.json(parsed);
  } catch (error) {
    // Track API error
    trackFallbackUsage('tarot', `API error: ${error}`);
    
    return Response.json({
      summary: 'เกิดข้อผิดพลาด',
      cardStructure: ensureFortuneStructure('', 'เกิดข้อผิดพลาด', 'tarot')
    });
  }
}
```

## Error Types

The system tracks three types of errors:

1. **validation**: Response validation failures
   - `summary_missing`: Summary field is empty
   - `summary_too_short`: Summary has fewer than 50 Thai characters
   - `cardstructure_missing`: CardStructure field is empty
   - `cardstructure_incomplete_sections`: Missing required sections

2. **template**: Prompt template construction errors (future use)

3. **api**: Gemini API errors (future use)

## Logging Behavior

### Development Mode
- Errors logged to console with structured format
- Warnings for specific error types
- Fallback usage warnings

### Production Mode
- Errors logged to console (can be extended to external service)
- In-memory storage of error logs
- No console warnings for fallback usage

## Extending the System

### Adding External Logging Service

To send logs to an external service (e.g., Sentry, LogRocket):

```typescript
// In validation.ts, modify logError function:
export function logError(log: ErrorLog): void {
  errorLogs.push(log);
  
  console.error('[AI Error Log]', {
    timestamp: log.timestamp.toISOString(),
    type: log.errorType,
    divination: log.divinationType,
    message: log.errorMessage,
    context: log.context
  });
  
  // Add external logging
  if (process.env.NODE_ENV === 'production') {
    sendToSentry(log);
    // or
    sendToLogRocket(log);
  }
}
```

### Adding Custom Metrics

To track additional metrics:

```typescript
// Add to metrics interface
interface ValidationMetrics {
  // ... existing fields
  customMetric: number;
}

// Track in validation functions
function trackCustomMetric() {
  metrics.customMetric++;
}
```

## Performance Considerations

- Metrics are stored in-memory (resets on server restart)
- Error logs are capped at reasonable size (consider implementing rotation)
- Minimal performance impact (<1ms per validation)
- No external API calls during validation

## Future Enhancements

Potential improvements:
1. Persistent metrics storage (database or Redis)
2. Real-time alerting for quality drops
3. Dashboard for metrics visualization
4. Automatic error categorization and suggestions
5. A/B testing support for prompt variations
6. Integration with monitoring services (Datadog, New Relic)

## Requirements Satisfied

This implementation satisfies the following requirements:

- **Requirement 5.3**: Error logging in validation module ✓
- **Requirement 5.4**: Metrics tracking for validation pass/fail rates ✓
- **Requirement 5.5**: Logging for fallback usage ✓

## See Also

- [validation.ts](./validation.ts) - Main validation module
- [validation-metrics-example.ts](./validation-metrics-example.ts) - Usage examples
- [types.ts](./types.ts) - Type definitions
