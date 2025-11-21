# Quick Start Guide - Landing Page Customizer

## 🚀 Getting Started

### 1. Install Dependencies (Already Done)
```bash
cd frontend
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
```

### 2. Start Development Server
```bash
npm run dev
```

### 3. Access the Builder
Navigate to: `http://localhost:3000/dashboard/landing`

## 📖 User Guide

### Layout Tab

#### Add Sections
1. Click **"Add"** button at bottom of sidebar
2. Select from available sections:
   - Latest post
   - Recent posts
   - Popular posts
   - About
   - Membership tiers
   - Gallery
   - And more...

#### Reorder Sections
1. Click and hold the **grip icon** (⋮⋮)
2. Drag section up or down
3. Drop in desired position

#### Enable/Disable Sections
- Click the **eye icon** to toggle visibility
- Disabled sections won't appear on published page

### Details Tab

#### Page Name
- Set your custom page name
- Used in URL and SEO

#### Profile Photo
1. Click **"Upload photo"**
2. Select image (recommended: 1024x1024px square)
3. Photo appears in header

#### Theme Color
- Choose from 8 preset colors
- Or use custom color picker
- Enter hex code manually

#### Cover Photo
- Upload banner image for header
- Appears behind profile photo

#### About
- Write your creator story
- Supports multi-line text
- Appears in About section

#### Social Links
- Add Twitter, Instagram, YouTube
- Links appear on your page

## 🎨 Customization Tips

### Color Selection
- **Primary Color**: Main brand color (default: #FF90E8)
- **Accent Color**: Header background
- **Background**: Page background
- **Text Color**: Main text color

### Section Order
Best practices:
1. Latest post (hero)
2. About
3. Membership tiers
4. Recent posts
5. Social proof (testimonials)

### Profile Photo
- Use high-quality image
- Square format works best
- Minimum 512x512px
- Maximum 2048x2048px

## 💾 Saving Your Work

### Save Draft
- Click **"Save"** button (top right)
- Changes saved to localStorage
- Not visible to public

### Publish
- Click **"Publish"** button
- Makes page live
- Accessible at `/c/[your-address]`

## 🔍 Preview Mode

### Live Preview (Right Panel)
- Updates in real-time
- Shows exact appearance
- Responsive design

### Full Preview
- Click **"View page"** button
- Opens in new view
- Test all interactions

## 📱 Responsive Design

The builder automatically handles:
- Mobile (< 768px)
- Tablet (768px - 1024px)
- Desktop (> 1024px)

## 🎯 Common Tasks

### Change Theme Color
1. Go to **Details** tab
2. Expand **"Theme colour"**
3. Click preset or use custom picker

### Add About Section
1. Go to **Layout** tab
2. Click **"Add"**
3. Select **"About"**
4. Go to **Details** tab
5. Expand **"About"**
6. Write your story

### Reorder Sections
1. Go to **Layout** tab
2. Drag sections using grip icon
3. Changes save automatically

### Hide a Section
1. Go to **Layout** tab
2. Click eye icon on section
3. Section hidden from preview

## 🐛 Troubleshooting

### Changes Not Showing?
- Check if section is enabled (eye icon)
- Refresh the page
- Clear browser cache

### Can't Upload Images?
- Walrus integration pending
- Feature coming soon
- Use placeholder for now

### Section Not Appearing?
- Check if enabled in Layout tab
- Verify section order
- Check visibility settings

## 📚 Section Types Explained

### Latest Post
- Shows your most recent post
- Auto-updates when you post
- Great for hero section

### Recent Posts
- Grid of latest posts
- Configurable item count
- Shows post previews

### About
- Your creator story
- Free-form text
- Markdown support (coming)

### Membership Tiers
- Showcase subscription options
- Pricing and benefits
- Call-to-action buttons

### Gallery
- Display your work
- Images and videos
- Portfolio showcase

### Testimonials
- Social proof
- Supporter feedback
- Builds trust

## 🎓 Best Practices

### Page Structure
1. **Hero** (Latest post or custom)
2. **Value Prop** (About or Features)
3. **Social Proof** (Testimonials)
4. **Offer** (Membership tiers)
5. **Content** (Recent posts)
6. **CTA** (Join button)

### Design Tips
- Use consistent colors
- Keep sections focused
- Add white space
- Use high-quality images
- Test on mobile

### Content Tips
- Clear headlines
- Concise descriptions
- Strong CTAs
- Show your personality
- Update regularly

## 🔗 Next Steps

After customizing your page:
1. ✅ Save your changes
2. ✅ Preview on different devices
3. ✅ Test all links
4. ✅ Publish when ready
5. ✅ Share your page URL
6. ✅ Monitor analytics

## 📞 Support

Need help?
- Check documentation: `/documents/LANDING_PAGE_CUSTOMIZER_PLAN.md`
- Implementation details: `/documents/LANDING_PAGE_IMPLEMENTATION_SUMMARY.md`
- Component README: `/src/components/creator-landing/README.md`

## 🎉 You're Ready!

Start customizing your landing page and showcase your best work to the world!

---

**Pro Tip**: Save frequently and use preview mode to test changes before publishing.
