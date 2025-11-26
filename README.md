<div align="center">

# 🌟 Auriya
### ** Decentralized Permissionless Creator Economy Platform on Sui**

**Walrus Haulout Hackathon 2025**  
**Track: Data Marketplaces | Data Security & Privacy**

*Empowering creators with permanent content storage, encrypted access control, and 97% revenue share*

[![Sui](https://img.shields.io/badge/Sui-Blockchain-blue)](https://sui.io)
[![Walrus](https://img.shields.io/badge/Walrus-Storage-purple)](https://walrus.site)
[![Seal](https://img.shields.io/badge/Seal-Encryption-green)](https://sui.io)
[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)

**🎥 [Video Demo](https://www.loom.com/share/18f2a5d9b7be47aa9c418b25c26610c8) • 📊 [Pitch Deck](./PITCH_DECK.md) • 🚀 [Live Demo](https://auriya-chi.vercel.app)**

</div>

---

## 📋 Table of Contents
- [Problem](#-problem)
- [Solution](#-solution)
- [Platform Comparison](#-platform-comparison)
- [Technical Architecture](#-technical-architecture)
- [Walrus Integration](#-walrus-integration)
- [Seal Integration](#-seal-integration)
- [Smart Contracts](#-smart-contracts)
- [User Flows](#-user-flows)
- [Key Features](#-key-features)
- [Getting Started](#-getting-started)
- [Roadmap](#-roadmap)

---

## 💡 Problem

### **The Problem**
The $104B+ creator economy suffers from:

**1. Exploitative Platform Fees**
- Patreon: **15%** total fees (platform + payment processing)
- OnlyFans: **20%** platform fee
- YouTube: Takes **45%** of ad revenue
- **Impact**: Creators lose $15-20 of every $100 earned

**2. Deplatforming & Censorship**
- Platforms can ban creators without warning
- Content can be deleted at any time
- No ownership of audience relationships
- **Real Example**: Patreon banned 200+ creators in 2021

**3. Lack of True Ownership**
- Creators don't own subscriber lists
- Content stored on centralized servers
- Platform controls access to audience
- No portability between platforms

**4. Payment Delays**
- 7-14 day processing delays
- Geographic restrictions
- High minimum payouts
- Bank account requirements

**5. No Subscription Transferability**
- Fans can't transfer or resell subscriptions
- No secondary market for access rights


### **The Solution: Auriya**
Decentralized creator platform on Sui where creators mint **Subscription NFTs** for tiered access to content stored permanently on **Walrus**, with **Seal** encryption for premium content.

**Unique Value Propositions:**

🎯 **For Creators (Data Producers)**
- **97% revenue share** - Keep nearly all earnings (vs 55-90% on Web2)
- **Instant settlements** - On-chain payments in 3-5 seconds (vs 7-14 days)
- **True ownership** - Content + audience data fully portable
- **Censorship-proof** - No platform can ban you or delete content
- **Flexible pricing** - Set your own tier prices, change anytime
- **Global reach** - No geographic restrictions or payment processor limits

💎 **For Subscribers (Data Consumers)**
- **Own your access** - Subscription NFTs are yours to keep, transfer, or sell
- **Transparent pricing** - All fees visible on-chain, no hidden charges
- **Privacy-first** - zkLogin means no email required, anonymous access
- **Permanent content** - Access paid content forever, can't be deleted
- **Composable NFTs** - Use subscription across multiple dApps
- **Secondary market** - Sell unused subscriptions on NFT marketplaces

🔐 **Platform Advantages**
- **Decentralized storage** - Walrus ensures content lives forever
- **Smart contract automation** - Trustless revenue splits, no intermediaries
- **Threshold encryption** - Seal provides NFT-gated content access
- **Web2 UX** - zkLogin removes crypto complexity for mainstream users
- **Scalable** - Sui's 10,000+ TPS supports millions of transactions

## 📊 Creator Platforms Comparison

### **Feature-by-Feature Analysis**

| Feature | Patreon | OnlyFans | YouTube | Substack | Gumroad | **Auriya** |
|---------|---------|----------|---------|----------|---------|------------|
| **Total Creator Revenue** | 85-92% | 80% | 55% | 90% | 86.5% | **97%** ✅ |
| **Payment Speed** | 7-14 days | 7-21 days | Monthly | Monthly | 7 days | **Instant** ✅ |
| **Censorship Risk** | High | Very High | Very High | Medium | High | **None** ✅ |
| **Content Ownership** | Platform | Platform | Platform | Platform | Platform | **Creator** ✅ |
| **Content Permanence** | Can be deleted | Can be deleted | Can be deleted | Can be deleted | Can be deleted | **Forever (Walrus)** ✅ |
| **Transferable Access (NFTs)** | No | No | No | No | No | **Yes** ✅ |
| **Privacy & Auth** | Email | KYC | Email | Email | Email | **zkLogin** ✅ |
| **Decentralized Storage** | No (AWS) | No (AWS) | No (GCP) | No (AWS) | No (AWS) | **Yes (Walrus)** ✅ |
| **Encrypted Content** | No | No | No | No | No | **Yes (Seal)** ✅ |
| **Data Portability** | Limited | None | None | Email list only | Limited | **Full** ✅ |

### **Economic Impact Example**

**Scenario**: Creator earns $10,000/month from 200 subscribers

| Platform | Gross Revenue | Platform Fee | Payment Processing | Net to Creator | Creator % |
|----------|---------------|--------------|-------------------|----------------|----------|
| **Patreon** | $10,000 | $800 (8%) | $290 (2.9%) | **$8,910** | 89.1% |
| **OnlyFans** | $10,000 | $2,000 (20%) | $0 | **$8,000** | 80.0% |
| **YouTube** | $10,000 | $4,500 (45%) | $0 | **$5,500** | 55.0% |
| **Substack** | $10,000 | $1,000 (10%) | $0 | **$9,000** | 90.0% |
| **Gumroad** | $10,000 | $1,000 (10%) | $350 (3.5%) | **$8,650** | 86.5% |
| **Auriya** | $10,000 | $0 | **$300 (~3% gas)** | **$9,700** | **97.0%** ✅ |

**💰 Auriya Advantage**: Creator earns **$700-$4,200 MORE per month** than competitors!

### **Real-World Deplatforming Examples**

- **Patreon (2021)**: Banned 200+ creators for "community guidelines" violations
- **OnlyFans (2021)**: Attempted to ban adult content (reversed after backlash)
- **YouTube**: Thousands of creators demonetized annually
- **Substack**: Rare but possible for controversial content
- **Auriya**: **Impossible to deplatform** - content on Walrus is permanent


## 🏗️ Technical Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    AURIYA PLATFORM                           │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  FRONTEND (Next.js 15 + TypeScript)                          │
│  • Creator Dashboard  • Landing Page Builder                 │
│  • Content Viewer  • Subscription Management                 │
│  • Direct Donations                                          │
│                                                               │
│  BLOCKCHAIN LAYER (Sui Network)                              │
│  ┌───────────────────────────────────────────────┐          │
│  │  Smart Contracts (Move)                       │          │
│  │  • creator_profile.move - Identities          │          │
│  │  • subscription.move - NFT access            │          │
│  │  • content.move - Content registry            │          │
│  │  • creator_landing.move - Landing pages      │          │
│  │  • content_access.move - Seal integration    │          │
│  └───────────────────────────────────────────────┘          │
│                                                               │
│  STORAGE & ENCRYPTION                                         │
│  ┌──────────────┐              ┌──────────────┐            │
│  │   Walrus     │              │     Seal     │            │
│  │  • Content   │              │  • Access    │            │
│  │  • Images    │              │    policies  │            │
│  │  • Landing   │              │  • Decrypt   │            │
│  │    pages     │              │    keys      │            │
│  └──────────────┘              └──────────────┘            │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### **Data Flow**

1. **Content Upload**: Creator → Seal Encryption (if gated) → Walrus Storage → Blob ID
2. **On-Chain Storage**: Blob ID + Metadata → Sui Smart Contract
3. **Access Control**: Fan → Subscription NFT → Seal Verification → Content Decryption
4. **Revenue**: Fan Payment → Smart Contract → 97% Creator, 3% Platform

---


## 🐋 Walrus Integration

### **Walrus Usage Across Platform**

| Feature | Component | Walrus Usage |
|---------|-----------|--------------|
| **Profile Photos** | `WalrusUploader` | Avatar & banner images → Walrus blob IDs stored in `CreatorProfile` |
| **Landing Pages** | `useLandingPage` | Full landing page JSON → Walrus, blob ID in `LandingPageConfig` |
| **Content Posts** | `useCreatePost` | Videos, images, files → Walrus, blob ID in `ContentPost` |
| **Encrypted Content** | `encryptContent` | Seal-encrypted data → Walrus, blob ID + encryption metadata on-chain |

### **Storage Breakdown**

| Data Type | Storage Location | Size | Cost (5 epochs) |
|-----------|------------------|------|-----------------|
| Profile Photo | Walrus | ~500KB | ~$0.005 |
| Cover Photo | Walrus | ~1MB | ~$0.01 |
| Landing Page JSON | Walrus | ~10KB | ~$0.0001 |
| Video Content | Walrus | ~50MB | ~$0.50 |
| **Blob ID Reference** | **Sui Blockchain** | **~100 bytes** | **Gas fee only** |

**Result**: 99.98% of data on Walrus, 0.02% on-chain (references only)

### **Key Files**

1. **`frontend/src/lib/walrus.ts`** - Upload/download functions
2. **`frontend/src/components/walrus/WalrusUploader.tsx`** - Upload UI component
3. **`frontend/src/app/dashboard/setup/page.tsx`** - Profile creation with Walrus
4. **`frontend/src/app/dashboard/landing/page.tsx`** - Landing page builder with Walrus
5. **`frontend/src/app/dashboard/content/new/page.tsx`** - Content upload with Walrus

---

## 🔐 Seal Integration

### **Key Files**

1. **`frontend/src/lib/seal.ts`** - Seal client, encrypt/decrypt functions
2. **`frontend/src/app/dashboard/content/new/page.tsx`** - Encryption during upload
3. **`frontend/src/app/creators/[address]/posts/[id]/page.tsx`** - Decryption for viewing
4. **`backend/move/seal_access/sources/content_access.move`** - Access policy contract


### **Seal Usage in Platform**

| Step | Component | Seal Function |
|------|-----------|---------------|
| **1. Content Upload** | `dashboard/content/new/page.tsx` | `encryptContent()` - Encrypt before Walrus upload |
| **2. Store Metadata** | `useCreatePost` | Store encryption metadata in `ContentPost.encryption_metadata` |
| **3. Access Check** | `creators/[address]/posts/[id]/page.tsx` | Check if user has valid subscription NFT |
| **4. Session Key** | `useZkLogin` | `createSealSessionKey()` - Create decryption session |
| **5. Verification Tx** | Content viewer | `createAccessVerificationTx()` - Prove NFT ownership |
| **6. Decrypt** | Content viewer | `decryptContent()` - Decrypt and display |

### **Encryption Decision Logic**

**Gated Content (Tier > 0)**:
- File → Seal encryption → Walrus upload → Store blob ID + encryption metadata on-chain
- Implementation: `dashboard/content/new/page.tsx`

**Public Content (Tier = 0)**:
- File → Direct Walrus upload → Store blob ID on-chain
- No encryption metadata needed


#### **Encryption Flow**
1. Define access policy (NFT type, min tier, creator)
2. Encrypt content with Seal → Get policy ID
3. Upload encrypted blob to Walrus → Get blob ID
4. Store both IDs on-chain

**Implementation**: `frontend/src/lib/seal/encrypt.ts`

#### **Decryption Flow**
1. Fetch encrypted blob from Walrus
2. Prove NFT ownership
3. Request decryption key from Seal
4. Decrypt content client-side
5. Display content

Implementation: `frontend/src/lib/seal/decrypt.ts`

---


## 📜 Smart Contracts

**Full documentation**: [CONTRACT.md](./CONTRACT.md)

### **Deployed Contracts (Sui Testnet)**

| Contract | Package ID | Purpose |
|----------|------------|----------|
| **Creator Profile** | `0x1ba3dac9...` | Creator identities with Walrus-stored media |
| **Subscription** | `0x9e0516bd...` | NFT-based subscriptions with 97/3 revenue split |
| **Content** | `0x35bfc572...` | Content registry with Walrus blob IDs |
| **Landing Page** | `0x4b97d0f4...` | Landing page configs stored on Walrus |
| **Seal Access** | `0x1435b35c...` | Access policies for encrypted content |

**Key Features**:
- `creator_profile.move` - Create/update profiles, link SuiNS
- `subscription.move` - Mint NFTs, handle renewals, 97% revenue to creator
- `content.move` - Create posts, set tier access, track views/likes
- `creator_landing.move` - Create/publish landing pages
- `content_access.move` - Seal integration for access verification

## 👥 User Flows

More Detailed User Flows are in [User_Flow.md](User_Flow.md)

```
Creator uploads content → Walrus (permanent storage)
                       ↓
                    Sets tier requirement (Bronze/Silver/Gold)
                       ↓
                    Fan purchases Subscription NFT
                       ↓
                    Smart contract verifies NFT ownership
                       ↓
                    Seal decrypts content → Fan accesses from Walrus
```


## ✨ Key Features

### **For Creators**
1. **Profile Creation** - Create on-chain identity with Walrus-stored media
2. **Tier Management** - Set up Bronze/Silver/Gold subscription tiers
3. **Content Publishing** - Upload to Walrus, encrypt with Seal (optional)
4. **Landing Page Builder** - Customizable landing pages stored on Walrus
5. **Direct Donations** - Accept SUI donations from supporters (NEW)
6. **Analytics Dashboard** - Track subscribers, revenue, views, likes
7. **97% Revenue Share** - Keep nearly all earnings (3% platform fee)

### **For Subscribers**
1. **zkLogin Authentication** - Sign in with Google (no seed phrases)
2. **NFT Subscriptions** - Transferable, tradeable access tokens
3. **Tier-Based Access** - Bronze/Silver/Gold content gating
4. **Encrypted Content** - Seal-protected premium content
5. **Direct Support** - Donate any amount in SUI to creators
6. **Subscription Management** - Renew, cancel, transfer NFTs

### **Platform Features**
1. **Permanent Storage** - All content on Walrus (censorship-resistant)
2. **Instant Payments** - On-chain settlement (no delays)
3. **No Deplatforming** - Creators own their content and audience
4. **Secondary Market** - Trade subscription NFTs on marketplaces
5. **Privacy** - Optional zkLogin (no email required)



## ⚙️ Tech Stack

### **Frontend Architecture**

#### **Tech Stack**
- **Framework**: Next.js 15 (App Router with React Server Components)
- **Language**: TypeScript 5.3 (strict mode)
- **Styling**: Tailwind CSS 3.4 + Shadcn UI components
- **State Management**: 
  - React Query (server state)
  - Zustand (client state)
  - @mysten/dapp-kit (wallet state)
- **Blockchain Integration**: @mysten/sui.js v1.0+
- **Authentication**: Sui zkLogin

### **1. Sui Blockchain - Smart Contract Logic**

**Why Sui?**
- Object-centric model (NFTs are first-class objects)
- 10,000+ TPS for instant transactions
- $0.001-0.01 per transaction (vs $5-50 on Ethereum)
- 3-5 second finality

**Smart Contracts:**
- `creator_profile.move` - Identity, bio, revenue tracking
- `subscription.move` - Tiered NFTs with expiry & auto-renewal
- `content.move` - Content registry with Walrus references
- `membership_tiers.move` - Configurable pricing
- `landing_page.move` - Customizable creator pages

---

### **2. Walrus - Decentralized Storage**

**Why Walrus?**
- Permanent storage (can't be deleted)
- Cost-effective (~$0.01 per MB)
- Verifiable (cryptographic blob IDs)
- Fast retrieval (CDN-like performance)

**What We Store:**
- Creator avatars & banners
- Post media (images, videos, audio)
- Landing page configurations
- Downloadable files

**Integration:**
- Upload: `uploadToWalrus(file)` → Returns blob ID
- Store: `createContentPost({ walrus_blob_id })` → On-chain reference
- Retrieve: `${AGGREGATOR_URL}/v1/${blobId}` → CDN-like access

---

### **3. Seal - Conditional Encryption**

**Why Seal?**
- On-chain access policies
- NFT-gated decryption
- Tier-based access control
- Provable authenticity

**Use Cases:**
- Encrypt premium content (only Gold tier can decrypt)
- Content authenticity attestations
- Privacy-preserving access (zero-knowledge proofs)

---

### **4. zkLogin - Privacy-Preserving Auth**

**Why zkLogin?**
- No passwords or seed phrases
- Sign in with Google/Apple/Facebook
- OAuth provider doesn't see blockchain activity
- Web2 UX for Web3

**Impact:**
- 10x easier onboarding
- Privacy (email not stored on-chain)
- Security (OAuth can't access funds)

---

### **5. SuiNS - Human-Readable Identities**

**Why SuiNS?**
- Memorable handles (`creator.sui` vs `0x123...`)
- Portable identity across dApps
- Verified profiles
- Easy discoverability

---

## ✨ Key Features

### **For Creators**

- **Customizable Landing Pages** - Drag-and-drop builder, stored on Walrus
- **Tiered Subscriptions** - Bronze/Silver/Gold with flexible pricing
- **Content Management** - Upload media, set tier access, analytics dashboard
- **Revenue Dashboard** - Real-time earnings, subscriber growth, instant withdrawals
- **Community Engagement** - Direct messaging, exclusive updates, polls

### **For Fans**

- **Discover Creators** - Browse by category, search, filter by price
- **Subscription Management** - One-click subscribe, transfer NFTs, trade on marketplaces
- **Content Access** - Instant unlock, stream from Walrus, download files
- **Privacy & Security** - zkLogin, anonymous browsing, encrypted content

### **Platform Features**

- **Censorship Resistance** - Content on Walrus can't be deleted
- **Composability** - NFTs work across dApps (Discord, events, etc.)
- **Transparent Economics** - All fees visible on-chain
- **Scalability** - Sui's 10,000+ TPS supports millions of users

---


## 🚀 Getting Started

### **Prerequisites**
- Node.js 18+
- Sui CLI
- Sui Wallet extension

### **Installation**

```bash
# Clone repository
git clone https://github.com/yourusername/auriya.git
cd auriya/frontend

# Install dependencies
npm install

# Set up environment
cp .env.example .env.local
# Edit .env.local with your keys

# Run development server
npm run dev
```

### **Environment Variables**

```bash
NEXT_PUBLIC_SUI_NETWORK=testnet
NEXT_PUBLIC_WALRUS_PUBLISHER_URL=https://publisher.walrus-testnet.walrus.space
NEXT_PUBLIC_WALRUS_AGGREGATOR_URL=https://aggregator.walrus-testnet.walrus.space
NEXT_PUBLIC_ENOKI_API_KEY=your_enoki_key
```

### **Deploy Smart Contracts**

```bash
cd backend/move/creator_profile
sui move build
sui client publish --gas-budget 100000000
```

---

## 🗺️ Roadmap

### **✅ Completed (Hackathon)**
- [x] Next.js 15 frontend with Sui integration
- [x] zkLogin authentication (Google OAuth)
- [x] Walrus integration (upload/download with progress tracking)
- [x] 5 Move smart contracts deployed on testnet
- [x] Creator profile creation with Walrus-stored media
- [x] Landing page builder with Walrus storage
- [x] Subscription tier management (Bronze/Silver/Gold)
- [x] NFT-based subscriptions with 97/3 revenue split
- [x] Content upload with Walrus integration
- [x] Seal encryption for gated content
- [x] Content viewing with Seal decryption
- [x] Direct SUI donations to creators
- [x] Analytics dashboard (subscribers, revenue, views)
- [x] Responsive UI with Tailwind CSS

### ** Phase 2: Q1 2026**
- [ ] Subscription renewal automation
- [ ] Content recommendations algorithm
- [ ] Creator verification badges
- [ ] Enhanced analytics (engagement metrics)
- [ ] Fiat on-ramps (Stripe integration)
- [ ] Multi-language support

### ** Phase 3: Q2 2026**
- [ ] Creator DAOs for governance
- [ ] AI-powered content moderation
- [ ] Mainnet deployment
- [ ] 100 creator beta
- [ ] Marketing campaign
- [ ] Mobile app (iOS/Android)

### **Phase 4: Scale** (Q3-Q4 2026)
- [ ] AI recommendations
- [ ] Creator DAOs
- [ ] Multi-chain support
- [ ] Fiat on-ramps
- [ ] 10K+ creators

---

## 🤝 Team & Vision

**Vision**: Democratize the creator economy by giving creators true ownership of their content, audience, and revenue—powered by the Sui Stack.

**Mission**: Build the 10x better Patreon where:
- Creators keep 97% of revenue (vs 80% on Web2)
- Content lives forever on Walrus (censorship-resistant)
- Fans own their access rights as NFTs (transferable, composable)
- Privacy is built-in (zkLogin, Seal encryption)

**Built for**: Walrus Haulout Hackathon 2025 🦭

** Built by**: 
Shikhar Singh ( senior full stack dev )
Kryptonian ( full stack dev )

---

## 📞 Links

- **GitHub**: [github.com/0xshikhar/auriya](https://github.com/0xshikhar/auriya)
- **Demo**: [auriya-chi.vercel.app](https://auriya-chi.vercel.app)
- **Video**: [Video Demo](https://www.loom.com/share/18f2a5d9b7be47aa9c418b25c26610c8)
- **Twitter**: [@0xShikhar](https://twitter.com/0xShikhar)

---

<div align="center">

**Auriya: Own Your Content. Own Your Audience. Forever.**

Built with ❤️ on Walrus with Seal Encryption

</div>
