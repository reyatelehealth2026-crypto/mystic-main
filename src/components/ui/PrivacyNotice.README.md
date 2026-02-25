# PrivacyNotice Component

A privacy notice component that displays on first use of each feature type. Tracks display state in localStorage per feature.

## Usage

### Basic Usage

```tsx
import { PrivacyNotice } from '@/components/ui/PrivacyNotice';
import { ReadingType } from '@/lib/reading/types';

export default function HoroscopePage() {
  return (
    <div>
      <PrivacyNotice 
        featureType={ReadingType.HOROSCOPE}
        featureName="ดูดวงรายวัน"
      />
      
      {/* Your page content */}
    </div>
  );
}
```

### With Callback

```tsx
<PrivacyNotice 
  featureType={ReadingType.COMPATIBILITY}
  featureName="ดูดวงความรัก"
  onDismiss={() => {
    console.log('Privacy notice dismissed');
  }}
/>
```

### Using the Hook

```tsx
import { usePrivacyNotice } from '@/components/ui/PrivacyNotice';
import { ReadingType } from '@/lib/reading/types';

export default function ChineseZodiacPage() {
  const { shouldShow, markAsShown } = usePrivacyNotice(ReadingType.CHINESE_ZODIAC);
  
  if (shouldShow) {
    return (
      <div>
        <p>Privacy notice will be shown...</p>
        <button onClick={markAsShown}>Accept</button>
      </div>
    );
  }
  
  return <div>Main content</div>;
}
```

## Props

- `featureType` (required): The ReadingType enum value for the feature
- `featureName` (required): Display name of the feature in Thai
- `onDismiss` (optional): Callback function when notice is dismissed

## Storage

The component stores the display state in localStorage with the key pattern:
```
privacy_notice_shown_{featureType}
```

For example:
- `privacy_notice_shown_horoscope`
- `privacy_notice_shown_compatibility`
- `privacy_notice_shown_chinese_zodiac`

## Features

- ✅ Displays only on first use per feature type
- ✅ Stores state in localStorage
- ✅ Full Thai language support
- ✅ Responsive design
- ✅ Modal overlay with backdrop
- ✅ Clear privacy information
- ✅ Easy to dismiss

## Example Feature Names

```tsx
// Horoscope
featureName="ดูดวงรายวัน"

// Compatibility
featureName="ดูดวงความรัก"

// Chinese Zodiac
featureName="ดูดวงจีน"

// Name Numerology
featureName="เลขศาสตร์ชื่อ"

// Specialized
featureName="ดูดวงเฉพาะด้าน"
```
