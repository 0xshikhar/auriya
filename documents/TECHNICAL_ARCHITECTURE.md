# Auriya Technical Architecture & Implementation

## Hackathon Strategy: Data Marketplaces + Privacy Track

### Why Auriya Wins
- **Data Marketplaces**: Direct creator-fan data exchange with provable ownership
- **Privacy**: zkLogin + Seal encryption for privacy-first content delivery
- **Best Tech**: Deep integration of Walrus (storage) + Seal (encryption) + Sui (logic)

---

## Core Technology Stack

### Frontend
- Next.js 14 (App Router) + TypeScript
- Shadcn UI + Tailwind CSS
- @mysten/dapp-kit (Sui wallet)
- Enoki zkLogin (already integrated ✅)
- Walrus SDK for file uploads
- React Query for state management

### Smart Contracts (Sui Move)
- **creator_profile.move**: Creator identity & metadata
- **subscription.move**: NFT-based access control
- **content.move**: Post registry with Walrus references
- **payment.move**: Revenue distribution logic
- **marketplace.move**: P2P subscription NFT trading

### Storage & Encryption
- **Walrus**: All media files (images, videos, downloads)
- **Seal**: Encrypted content with onchain access policies
- **Integration**: Upload → Walrus → Encrypt with Seal → Store reference onchain

---

## Project Structure

```
/auriya/
├── /frontend/                    # Next.js app (existing ✅)
│   ├── /src/
│   │   ├── /app/
│   │   │   ├── /creators/
│   │   │   │   ├── page.tsx              # Browse creators
│   │   │   │   └── /[handle]/
│   │   │   │       ├── page.tsx          # Creator profile
│   │   │   │       └── /posts/[id]/
│   │   │   │           └── page.tsx      # Content viewer
│   │   │   ├── /dashboard/
│   │   │   │   ├── page.tsx              # Creator dashboard
│   │   │   │   ├── /analytics/
│   │   │   │   ├── /content/
│   │   │   │   └── /settings/
│   │   │   └── /subscribe/
│   │   │       └── page.tsx              # Subscription purchase
│   │   ├── /components/
│   │   │   ├── /creator/
│   │   │   │   ├── ProfileCard.tsx
│   │   │   │   ├── TierManager.tsx
│   │   │   │   └── ContentUploader.tsx
│   │   │   ├── /fan/
│   │   │   │   ├── SubscriptionModal.tsx
│   │   │   │   ├── ContentViewer.tsx
│   │   │   │   └── CreatorGrid.tsx
│   │   │   └── /shared/
│   │   │       ├── AccessGate.tsx
│   │   │       └── WalrusUpload.tsx
│   │   └── /lib/
│   │       ├── /contracts/
│   │       │   ├── creator.ts            # Creator contract calls
│   │       │   ├── subscription.ts       # Subscription logic
│   │       │   └── content.ts            # Content management
│   │       ├── walrus.ts                 # Walrus client
│   │       ├── seal.ts                   # Seal encryption
│   │       ├── enoki.ts                  # zkLogin (existing ✅)
│   │       └── suins.ts                  # SuiNS resolver
│   └── /public/
│
└── /backend/                     # Move contracts (existing ✅)
    └── /move/
        ├── /creator_profile/
        │   ├── Move.toml
        │   └── /sources/
        │       └── creator_profile.move
        ├── /subscription/
        │   ├── Move.toml
        │   └── /sources/
        │       └── subscription.move
        ├── /content/
        │   ├── Move.toml
        │   └── /sources/
        │       └── content.move
        └── /marketplace/
            ├── Move.toml
            └── /sources/
                └── marketplace.move
```
