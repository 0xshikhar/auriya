# Auriya Design Guide (Gumroad-Inspired)

Quick reference for maintaining design consistency across the app.

## 🎨 Color Palette

### Primary Colors
```tsx
// Use these Tailwind classes
bg-black          // #000000 - Primary buttons, text
bg-white          // #FFFFFF - Backgrounds, secondary buttons
bg-gumroad-pink   // #FF90E8 - Accent, branding
text-black        // Black text
text-white        // White text
```

### Grays
```tsx
bg-gray-50        // #FAFAFA - Page backgrounds
bg-gray-100       // #F5F5F5 - Secondary backgrounds
border-gray-200   // #E5E5E5 - Card borders
border-gray-300   // #D4D4D4 - Input borders
text-gray-600     // #525252 - Secondary text
text-gray-500     // #737373 - Tertiary text
```

## 🔘 Buttons

### Primary Button (Black)
```tsx
<button className="px-8 py-3 bg-black text-white hover:bg-gray-800 rounded-lg transition font-medium">
  Start selling
</button>
```

### Secondary Button (Outline)
```tsx
<button className="px-6 py-3 bg-white border border-gray-300 text-black hover:bg-gray-50 rounded-lg transition font-medium">
  Learn more
</button>
```

### Pink Accent Button
```tsx
<button className="px-8 py-4 bg-gumroad-pink text-black hover:bg-gumroad-pink-light rounded-lg transition font-bold">
  Get started
</button>
```

### Using Button Component
```tsx
import { Button } from '@/components/ui/button';

<Button>Default (Black)</Button>
<Button variant="outline">Outline</Button>
<Button variant="pink">Pink Accent</Button>
<Button variant="ghost">Ghost</Button>
```

## 📦 Cards

### Standard Card
```tsx
<div className="bg-white border border-gray-200 rounded-xl p-8">
  <h2 className="text-2xl font-bold text-black mb-4">Title</h2>
  <p className="text-gray-600">Description text</p>
</div>
```

### Hover Card
```tsx
<div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition">
  {/* Content */}
</div>
```

### Using Card Component
```tsx
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>
    {/* Content */}
  </CardContent>
</Card>
```

## 📝 Forms

### Input Field
```tsx
<div className="space-y-2">
  <label className="text-sm font-medium text-black">Label</label>
  <input
    type="text"
    placeholder="Enter value..."
    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gumroad-pink focus:border-transparent"
  />
</div>
```

### Using Input Component
```tsx
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

<div className="space-y-2">
  <Label>Email</Label>
  <Input type="email" placeholder="you@example.com" />
</div>
```

### Textarea
```tsx
import { Textarea } from '@/components/ui/textarea';

<div className="space-y-2">
  <Label>Description</Label>
  <Textarea rows={4} placeholder="Enter description..." />
</div>
```

## 📐 Layout

### Page Container
```tsx
<div className="min-h-screen bg-gray-50">
  <div className="max-w-7xl mx-auto px-6 py-8">
    {/* Page content */}
  </div>
</div>
```

### Section Header
```tsx
<div className="mb-8">
  <h1 className="text-4xl font-bold text-black">Page Title</h1>
  <p className="text-gray-600 mt-2">Description text</p>
</div>
```

### Grid Layout
```tsx
{/* 3 columns on desktop, 1 on mobile */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  {/* Cards */}
</div>

{/* 2 columns */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
  {/* Cards */}
</div>
```

## 📱 Typography

### Headings
```tsx
<h1 className="text-4xl font-bold text-black">Main Title</h1>
<h2 className="text-2xl font-bold text-black">Section Title</h2>
<h3 className="text-xl font-bold text-black">Card Title</h3>
```

### Body Text
```tsx
<p className="text-gray-600">Regular paragraph text</p>
<p className="text-sm text-gray-500">Small secondary text</p>
<p className="text-xs text-gray-400">Tiny helper text</p>
```

### Links
```tsx
<a href="#" className="text-black hover:text-gumroad-pink transition font-medium">
  Link text
</a>
```

## 🎯 Icons

### Using Lucide Icons
```tsx
import { Search, Users, TrendingUp, Settings } from 'lucide-react';

<Search className="w-5 h-5 text-gray-400" />
<Users className="w-4 h-4 text-gumroad-pink" />
```

### Icon Sizes
```tsx
w-4 h-4   // 16px - Small icons in text
w-5 h-5   // 20px - Medium icons
w-6 h-6   // 24px - Large icons
w-12 h-12 // 48px - Feature icons
```

## 🔔 Notifications

### Success Message
```tsx
<div className="p-4 bg-green-50 border border-green-200 rounded-lg">
  <p className="text-sm font-medium text-green-800">Success!</p>
  <p className="text-xs text-green-600 mt-1">Operation completed successfully</p>
</div>
```

### Error Message
```tsx
<div className="p-4 bg-red-50 border border-red-200 rounded-lg">
  <p className="text-sm text-red-600">Error message here</p>
</div>
```

### Info Message
```tsx
<div className="p-4 bg-gray-50 rounded-lg">
  <p className="text-sm text-gray-600">
    💡 <strong>Tip:</strong> Helpful information here
  </p>
</div>
```

## 🎨 Spacing

### Common Spacing Values
```tsx
gap-4   // 1rem (16px)
gap-6   // 1.5rem (24px)
gap-8   // 2rem (32px)

px-4    // 1rem horizontal padding
px-6    // 1.5rem horizontal padding
px-8    // 2rem horizontal padding

py-2    // 0.5rem vertical padding
py-3    // 0.75rem vertical padding
py-4    // 1rem vertical padding
py-8    // 2rem vertical padding

mb-4    // 1rem bottom margin
mb-6    // 1.5rem bottom margin
mb-8    // 2rem bottom margin
```

## 🎭 States

### Hover States
```tsx
hover:bg-gray-50      // Subtle hover on white
hover:bg-gray-800     // Hover on black buttons
hover:shadow-lg       // Add shadow on hover
hover:text-gumroad-pink // Pink text on hover
```

### Focus States
```tsx
focus:outline-none
focus:ring-2
focus:ring-gumroad-pink
focus:border-transparent
```

### Disabled States
```tsx
disabled:opacity-50
disabled:cursor-not-allowed
```

## 📏 Border Radius

```tsx
rounded-lg    // 8px - Buttons, inputs, small cards
rounded-xl    // 12px - Large cards, sections
rounded-full  // 9999px - Circles, pills
```

## ✨ Transitions

```tsx
transition           // Standard transition
transition-all       // Transition all properties
duration-200         // 200ms duration
```

## 🎪 Common Patterns

### Feature Card with Icon
```tsx
<div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition">
  <div className="w-12 h-12 bg-gumroad-pink rounded-lg flex items-center justify-center mb-4">
    <Icon className="w-6 h-6 text-black" />
  </div>
  <h3 className="text-xl font-bold text-black mb-2">Feature Title</h3>
  <p className="text-gray-600">Feature description</p>
</div>
```

### Stat Card
```tsx
<div className="bg-white border border-gray-200 rounded-xl p-6">
  <div className="flex items-center justify-between mb-2">
    <span className="text-gray-600 text-sm font-medium">Label</span>
    <Icon className="w-5 h-5 text-gumroad-pink" />
  </div>
  <div className="text-3xl font-bold text-black">$0</div>
  <div className="text-sm text-gray-500 mt-1">+0% from last month</div>
</div>
```

### Search Bar
```tsx
<div className="flex items-center gap-3 px-6 py-3 bg-white border border-gray-300 rounded-lg">
  <Search className="w-5 h-5 text-gray-400" />
  <input
    type="text"
    placeholder="Search..."
    className="outline-none text-gray-700 placeholder:text-gray-400 flex-1"
  />
</div>
```

## 🚀 Quick Start

1. **Always use gray-50 for page backgrounds**
2. **White cards with gray-200 borders**
3. **Black for primary actions**
4. **Pink for accents and branding**
5. **Generous spacing (px-6, py-8)**
6. **Bold headings (font-bold)**
7. **Rounded corners (rounded-lg, rounded-xl)**
8. **Smooth transitions on interactive elements**

## 📚 Resources

- Tailwind CSS: https://tailwindcss.com/docs
- Lucide Icons: https://lucide.dev
- Radix UI: https://www.radix-ui.com
- shadcn/ui: https://ui.shadcn.com
