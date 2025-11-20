# Creator Landing Page Customizer

A professional landing page builder for creators on Auriya, inspired by Patreon's page customizer.

## Features

### ✅ Implemented

- **Dual-Panel Layout**: Left sidebar for controls, right side for live preview
- **Two Tabs**: Layout and Details
- **Drag & Drop**: Reorder sections with smooth animations
- **Section Management**: Add, remove, enable/disable sections
- **Theme Customization**: 
  - Profile photo upload
  - Theme color picker with presets
  - Custom color input
  - Cover photo upload
- **Section Types**:
  - Latest post
  - Recent posts
  - Popular posts
  - All collections
  - Popular products
  - Explore more posts
  - About
  - Membership tiers
  - Gallery
  - Testimonials
  - FAQ
  - Custom text
- **Live Preview**: Real-time updates as you edit
- **Responsive Design**: Mobile, tablet, and desktop views
- **Save & Publish**: Draft saving and publishing workflow

## Usage

### Basic Setup

```tsx
import { PageBuilder } from '@/components/creator-landing/builder';

function MyPage() {
  const handleSave = async (data) => {
    // Save to backend/blockchain
  };

  const handlePublish = async (data) => {
    // Publish to blockchain
  };

  return (
    <PageBuilder
      creatorAddress="0x..."
      initialData={existingData}
      onSave={handleSave}
      onPublish={handlePublish}
    />
  );
}
```

### Route Setup

Add to your app:

```tsx
// src/app/dashboard/landing/page.tsx
import PageBuilder from '@/components/creator-landing/builder/PageBuilder';

export default function LandingPageBuilderPage() {
  // ... implementation
}
```

## Component Structure

```
creator-landing/
├── builder/
│   ├── PageBuilder.tsx       # Main builder component
│   ├── LayoutPanel.tsx       # Section management panel
│   ├── DetailsPanel.tsx      # Details & theme panel
│   ├── LivePreview.tsx       # Live preview renderer
│   └── index.ts
├── sections/
│   ├── LatestPostSection.tsx
│   ├── RecentPostsSection.tsx
│   ├── AboutSection.tsx
│   ├── TiersSection.tsx
│   └── index.ts
└── README.md
```

## Data Model

See `src/types/creator-landing.ts` for full type definitions.

### Key Types

- `CreatorLandingPage`: Main landing page data structure
- `LandingSection`: Individual section configuration
- `ThemeConfig`: Theme and branding settings
- `HeaderConfig`: Header and profile settings

## Customization

### Adding New Section Types

1. Add type to `SectionType` in `creator-landing.ts`
2. Create section component in `sections/`
3. Add to `AVAILABLE_SECTIONS` array
4. Update `LivePreview.tsx` switch statement

### Styling

The builder uses Tailwind CSS and shadcn/ui components. Theme colors are applied via inline styles for dynamic customization.

## TODO

- [ ] Walrus integration for image uploads
- [ ] Smart contract integration for saving
- [ ] Public landing page routes
- [ ] More section types (gallery, testimonials, FAQ)
- [ ] Template presets
- [ ] Analytics integration
- [ ] SEO optimization tools
- [ ] Social media preview
- [ ] Export/import functionality

## Dependencies

- `@dnd-kit/core` - Drag and drop
- `@dnd-kit/sortable` - Sortable lists
- `@dnd-kit/utilities` - DnD utilities
- `lucide-react` - Icons
- `sonner` - Toast notifications
- `@mysten/dapp-kit` - Sui wallet integration

## Design Inspiration

Based on Patreon's creator page customizer with improvements:
- Better section organization
- More intuitive controls
- Cleaner visual design
- Enhanced live preview
