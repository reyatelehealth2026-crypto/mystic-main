# Thai Name Input Component

A React component for inputting Thai names with real-time validation for the REFFORTUNE name numerology feature.

## Features

- **Real-time validation**: Validates input as users type and on blur
- **Thai character validation**: Only accepts Thai Unicode characters (U+0E00-U+0E7F) and spaces
- **Visual feedback**: Shows success checkmarks for valid input, error styling for invalid input
- **Thai error messages**: All error messages displayed in Thai language
- **Accessibility**: Proper ARIA labels, error associations, and keyboard navigation
- **Responsive design**: Works on all screen sizes

## Usage

### Basic Usage

```tsx
import { ThaiNameInput } from '@/components/name-numerology/ThaiNameInput';
import { useState } from 'react';

function MyComponent() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  return (
    <ThaiNameInput
      firstName={firstName}
      lastName={lastName}
      onFirstNameChange={setFirstName}
      onLastNameChange={setLastName}
      showValidation={true}
    />
  );
}
```

### Using the Hook

The component comes with a convenient hook for managing state:

```tsx
import { ThaiNameInput, useThaiNameInput } from '@/components/name-numerology/ThaiNameInput';
import { Button } from '@/components/ui/Button';

function MyComponent() {
  const nameInput = useThaiNameInput();

  const handleSubmit = () => {
    if (nameInput.validate()) {
      // Process the valid names
      console.log(nameInput.firstName, nameInput.lastName);
    }
  };

  return (
    <div>
      <ThaiNameInput
        firstName={nameInput.firstName}
        lastName={nameInput.lastName}
        onFirstNameChange={nameInput.setFirstName}
        onLastNameChange={nameInput.setLastName}
        showValidation={nameInput.showValidation}
      />
      
      <Button 
        onClick={handleSubmit}
        disabled={!nameInput.isValid}
      >
        ดูผลการวิเคราะห์
      </Button>
    </div>
  );
}
```

## Props

### ThaiNameInput

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `firstName` | `string` | Yes | Current first name value |
| `lastName` | `string` | Yes | Current last name value |
| `onFirstNameChange` | `(value: string) => void` | Yes | Callback when first name changes |
| `onLastNameChange` | `(value: string) => void` | Yes | Callback when last name changes |
| `showValidation` | `boolean` | No | Whether to show validation errors (default: false) |
| `className` | `string` | No | Additional CSS classes |

## Validation Rules

### Valid Input
- Thai characters only (Unicode range U+0E00-U+0E7F)
- Spaces are allowed
- Must not be empty or whitespace-only

### Examples

**Valid:**
- `สมชาย` ✓
- `นางสาว สมหญิง` ✓
- `ใจดี` ✓

**Invalid:**
- `John` ✗ (English characters)
- `สมชาย Smith` ✗ (Mixed Thai and English)
- `` ✗ (Empty)
- `   ` ✗ (Whitespace only)

## Error Messages

All error messages are displayed in Thai:

- **Empty field**: `กรุณาระบุชื่อ` / `กรุณาระบุนามสกุล`
- **Invalid characters**: `กรุณาใช้ตัวอักษรไทยเท่านั้น`
- **Overall validation**: `กรุณาตรวจสอบข้อมูล`

## Hook API

### useThaiNameInput()

Returns an object with:

| Property | Type | Description |
|----------|------|-------------|
| `firstName` | `string` | Current first name value |
| `lastName` | `string` | Current last name value |
| `setFirstName` | `(value: string) => void` | Update first name |
| `setLastName` | `(value: string) => void` | Update last name |
| `isValid` | `boolean` | Whether both names are valid |
| `showValidation` | `boolean` | Whether validation is being shown |
| `validate` | `() => boolean` | Trigger validation and return validity |
| `reset` | `() => void` | Reset all values to empty |

## Accessibility

The component follows accessibility best practices:

- Proper `<label>` elements with `htmlFor` attributes
- Required fields marked with asterisk
- Error messages linked via `aria-describedby`
- Invalid inputs marked with `aria-invalid`
- Success indicators use `aria-hidden` to avoid screen reader clutter
- Keyboard navigation fully supported

## Requirements Validated

This component validates the following requirements from the popular-fortune-features spec:

- **6.1**: Accept Thai name input (first name and surname)
- **6.6**: Validate that input contains valid Thai characters
- **6.7**: Display error messages in Thai when invalid characters detected
- **9.6**: Use Thai language for all UI text

## Integration

The component integrates with:

- `src/lib/name-numerology/engine.ts` - Uses `isValidThaiName()` for validation
- `src/components/ui/Input.tsx` - Uses base Input component
- `src/components/ui/Alert.tsx` - Uses Alert for validation summary
- `src/lib/cn.ts` - Uses cn() utility for conditional styling

## Example Page

See `src/app/name-numerology/page.tsx` for a complete example of using this component in a page.
