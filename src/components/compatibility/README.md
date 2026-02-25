# Compatibility Components

This directory contains components for the love compatibility analysis feature.

## DateInputPair

A component for inputting two birth dates for compatibility analysis.

### Features

- Two date inputs with Thai labels
- Date validation (1900-01-01 to today)
- Error message display in Thai
- Customizable labels
- Built-in min/max date constraints
- Required field validation

### Usage

```tsx
import { DateInputPair } from "@/components/compatibility/DateInputPair";
import { validateCompatibilityDates } from "@/lib/compatibility/validation";

function CompatibilityForm() {
  const [person1Date, setPerson1Date] = useState("");
  const [person2Date, setPerson2Date] = useState("");
  const [person1Error, setPerson1Error] = useState("");
  const [person2Error, setPerson2Error] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = validateCompatibilityDates(person1Date, person2Date);
    
    if (!result.ok) {
      setPerson1Error(result.error.person1?.message || "");
      setPerson2Error(result.error.person2?.message || "");
      return;
    }
    
    // Proceed with valid dates
    console.log(result.value.date1, result.value.date2);
  };

  return (
    <form onSubmit={handleSubmit}>
      <DateInputPair
        person1Date={person1Date}
        person2Date={person2Date}
        onPerson1DateChange={setPerson1Date}
        onPerson2DateChange={setPerson2Date}
        person1Error={person1Error}
        person2Error={person2Error}
      />
      <button type="submit">ดูความเข้ากัน</button>
    </form>
  );
}
```

### Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `person1Date` | `string` | Yes | - | Birth date value for person 1 (YYYY-MM-DD format) |
| `person2Date` | `string` | Yes | - | Birth date value for person 2 (YYYY-MM-DD format) |
| `onPerson1DateChange` | `(date: string) => void` | Yes | - | Callback when person 1 date changes |
| `onPerson2DateChange` | `(date: string) => void` | Yes | - | Callback when person 2 date changes |
| `person1Label` | `string` | No | "วันเกิดคนที่ 1" | Label for person 1 input |
| `person2Label` | `string` | No | "วันเกิดคนที่ 2" | Label for person 2 input |
| `person1Error` | `string` | No | - | Error message for person 1 input |
| `person2Error` | `string` | No | - | Error message for person 2 input |
| `className` | `string` | No | - | Additional CSS classes |

### Validation

Use the `validateCompatibilityDates` function from `@/lib/compatibility/validation` to validate both dates:

```tsx
import { validateCompatibilityDates } from "@/lib/compatibility/validation";

const result = validateCompatibilityDates(date1, date2);

if (result.ok) {
  // Both dates are valid
  const { date1, date2 } = result.value;
} else {
  // Handle errors
  if (result.error.person1) {
    console.error(result.error.person1.message);
  }
  if (result.error.person2) {
    console.error(result.error.person2.message);
  }
}
```

### Error Messages

All error messages are in Thai:

- `"กรุณาระบุวันเกิด"` - Empty date
- `"รูปแบบวันที่ไม่ถูกต้อง กรุณาระบุวันที่ในรูปแบบที่ถูกต้อง"` - Invalid date format
- `"ไม่สามารถใช้วันที่ในอนาคตได้"` - Future date
- `"วันที่ต้องไม่เก่ากว่าปี ค.ศ. 1900"` - Date before 1900

### Date Constraints

- **Min date**: 1900-01-01
- **Max date**: Today
- **Format**: YYYY-MM-DD (ISO 8601)

### Examples

See `DateInputPair.example.tsx` for complete usage examples.
