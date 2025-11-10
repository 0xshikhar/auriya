# Auriya Product Flow & User Experience

## Platform Vision

**Auriya empowers creators to own their content, audience, and revenue while giving fans transparent, verifiable access to exclusive material through blockchain technology.**

---

## User Personas

### 1. Creator (Alice)
- **Profile**: Digital artist, 5K Twitter followers, frustrated with Patreon's fees
- **Goals**: 
  - Monetize digital art without 10% platform fees
  - Own relationship with fans (no deplatforming risk)
  - Offer exclusive content to supporters
- **Pain Points**: 
  - Patreon takes too much revenue
  - Limited control over pricing/tiers
  - Fear of account suspension

### 2. Fan (Bob)
- **Profile**: Crypto enthusiast, collects NFTs, supports 3-4 creators
- **Goals**:
  - Support favorite creators directly
  - Access exclusive content
  - Trade/sell subscriptions if needed
- **Pain Points**:
  - Recurring payments feel opaque
  - No proof of support (just email receipts)
  - Can't transfer subscription if losing interest

---

## Complete User Journey

### Phase 1: Discovery

#### Landing Page (Public, No Auth)
```
┌─────────────────────────────────────────────────────┐
│  Auriya  [Browse Creators] [Sign In] [Create Profile]│
├─────────────────────────────────────────────────────┤
│                                                       │
│   Own Your Content. Empower Your Fans.              │
│   The first decentralized creator platform on Sui   │
│                                                       │
│   [Get Started] [Watch Demo]                         │
│                                                       │
│   ┌──────────────┐ ┌──────────────┐ ┌─────────────┐│
│   │ For Creators │ │   For Fans   │ │ How It Works││
│   │              │ │              │ │             ││
│   │ • Keep 95%   │ │ • Direct     │ │ • Blockchain││
│   │   revenue    │ │   support    │ │   powered   ││
│   │ • No fees    │ │ • Own access │ │ • Encrypted ││
│   └──────────────┘ └──────────────┘ └─────────────┘│
│                                                       │
│   Featured Creators                                  │
│   ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐     │
│   │ @alice │ │ @bob   │ │ @carol │ │ @dave  │     │
│   │  🎨    │ │  📷    │ │  🎵    │ │  📝    │     │
│   │ 234    │ │ 189    │ │ 456    │ │ 123    │     │
│   │ fans   │ │ fans   │ │ fans   │ │ fans   │     │
│   └────────┘ └────────┘ └────────┘ └────────┘     │
└─────────────────────────────────────────────────────┘
```

**Features**:
- Hero section explaining value proposition
- Featured creator carousel
- Category filters (Art, Music, Writing, etc.)
- Search by SuiNS handle
- Testimonials from early adopters

### Phase 2: Authentication

#### Sign In Modal
```
┌──────────────────────────────────────┐
│  Sign In to Auriya                   │
├──────────────────────────────────────┤
│                                       │
│  Choose your sign-in method:         │
│                                       │
│  ┌────────────────────────────────┐ │
│  │  🔍 Sign in with Google       │ │
│  │     (zkLogin - No passwords)   │ │
│  └────────────────────────────────┘ │
│                                       │
│           or                          │
│                                       │
│  ┌────────────────────────────────┐ │
│  │  👛 Connect Wallet             │ │
│  │     Sui Wallet / Suiet / Ethos │ │
│  └────────────────────────────────┘ │
│                                       │
│  Privacy first: No email required    │
│  Your data stays encrypted onchain   │
│                                       │
└──────────────────────────────────────┘
```

**zkLogin Flow**:
1. User clicks "Sign in with Google"
2. Redirect to Google OAuth
3. Google authenticates → Returns JWT
4. Backend exchanges JWT for zkProof
5. zkProof generates Sui address deterministically
6. User logged in with Sui address (no seed phrase needed!)

**Benefits**:
- No password management
- No wallet setup for newcomers
- Privacy-preserving (Google doesn't know user's Sui address)
- Seamless UX for non-crypto users

### Phase 3: Creator Onboarding

#### Step 1: Profile Setup
```
┌──────────────────────────────────────┐
│  Create Your Creator Profile         │
├──────────────────────────────────────┤
│                                       │
│  Display Name: [_____________]       │
│                                       │
│  Bio (max 500 chars):                │
│  [___________________________]       │
│  [___________________________]       │
│                                       │
│  Category:                            │
│  [ Select ▼ ] Art, Music, Writing... │
│                                       │
│  Avatar (upload to Walrus):           │
│  [📁 Choose File] avatar.png          │
│  ✅ Uploaded to Walrus                │
│                                       │
│  Banner Image:                        │
│  [📁 Choose File] banner.jpg          │
│  ✅ Uploaded to Walrus                │
│                                       │
│  Social Links (optional):             │
│  Twitter: [@_____________]           │
│  Instagram: [@_____________]         │
│                                       │
│  [Next: Set Up Tiers]                 │
│                                       │
└──────────────────────────────────────┘
```

**Backend Process**:
1. Upload avatar → Walrus → Get `blob_id_avatar`
2. Upload banner → Walrus → Get `blob_id_banner`
3. Transaction: Call `create_profile()` with Walrus blob IDs
4. CreatorProfile object minted onchain
5. Profile live at `/creators/0x{address}`

#### Step 2: Subscription Tiers
```
┌──────────────────────────────────────┐
│  Configure Subscription Tiers        │
├──────────────────────────────────────┤
│                                       │
│  Tier 1: Bronze                       │
│  Price: [5] SUI / month              │
│  Benefits:                            │
│  • Early access to new posts         │
│  • Behind-the-scenes content         │
│  [+ Add Benefit]                      │
│                                       │
│  Tier 2: Silver                       │
│  Price: [10] SUI / month             │
│  Benefits:                            │
│  • All Bronze benefits               │
│  • Exclusive video tutorials         │
│  • Monthly Q&A sessions              │
│  [+ Add Benefit]                      │
│                                       │
│  Tier 3: Gold                         │
│  Price: [25] SUI / month             │
│  Benefits:                            │
│  • All Silver benefits               │
│  • 1-on-1 video calls (1x/month)     │
│  • Custom artwork requests           │
│  [+ Add Benefit]                      │
│                                       │
│  [← Back]  [Deploy Tiers →]          │
│                                       │
└──────────────────────────────────────┘
```

**Backend Process**:
1. Transaction: Call `create_tiers()` with pricing
2. CreatorSubscriptions object created (shared object)
3. Tiers stored onchain, queryable by fans

#### Step 3: First Post
```
┌──────────────────────────────────────┐
│  Create Your First Post              │
├──────────────────────────────────────┤
│                                       │
│  Title: [_____________]              │
│                                       │
│  Content Type:                        │
│  ○ Text  ● Image  ○ Video  ○ File   │
│                                       │
│  Upload Image:                        │
│  [📁 Choose File] artwork.png         │
│  ┌─────────────────────────────┐    │
│  │ ████████░░░░░░░░ 60%        │    │
│  │ Uploading to Walrus...       │    │
│  └─────────────────────────────┘    │
│                                       │
│  Access Level:                        │
│  ○ Public (Free)                     │
│  ● Bronze Tier ($5/mo)               │
│  ○ Silver Tier ($10/mo)              │
│  ○ Gold Tier ($25/mo)                │
│                                       │
│  Description:                         │
│  [___________________________]       │
│                                       │
│  [Cancel]  [Publish Post]            │
│                                       │
└──────────────────────────────────────┘
```

**Backend Process**:
1. Upload image → Walrus → Get `blob_id_content`
2. (Optional) Encrypt with Seal → Get `seal_policy_id`
3. Transaction: Call `create_post()` with:
   - Title, description
   - `walrus_blob_id`
   - `seal_policy_id` (if encrypted)
   - `required_tier`
4. ContentPost object minted
5. Post appears in creator's feed

### Phase 4: Fan Subscription Journey

#### Step 1: Discover Creator
```
┌─────────────────────────────────────────────────────┐
│  ← Back to Creators                                  │
├─────────────────────────────────────────────────────┤
│  Banner Image (from Walrus)                         │
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│
│  ┌──────┐                                           │
│  │ 🎨  │  Alice Chen                                │
│  │      │  @alice.sui                               │
│  └──────┘  Digital Artist • 234 fans               │
│                                                       │
│  Creating surreal digital art and tutorials         │
│  for aspiring artists. Support me to unlock         │
│  exclusive content!                                  │
│                                                       │
│  🔗 twitter.com/alice  📷 instagram.com/alice       │
│                                                       │
│  ┌────────────────────────────────────────────────┐│
│  │  Choose Your Support Level                     ││
│  │                                                 ││
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐      ││
│  │  │ Bronze   │ │ Silver   │ │ Gold     │      ││
│  │  │ 5 SUI/mo │ │ 10 SUI/mo│ │ 25 SUI/mo│      ││
│  │  │          │ │          │ │          │      ││
│  │  │ ✓ Early  │ │ ✓ All    │ │ ✓ All    │      ││
│  │  │   access │ │   Bronze │ │   Silver │      ││
│  │  │ ✓ BTS    │ │ ✓ Videos │ │ ✓ 1-on-1 │      ││
│  │  │   posts  │ │ ✓ Q&A    │ │   calls  │      ││
│  │  │          │ │          │ │ ✓ Custom │      ││
│  │  │          │ │          │ │   work   │      ││
│  │  │[Select] │ │[Select] │ │[Select] │      ││
│  │  └──────────┘ └──────────┘ └──────────┘      ││
│  └────────────────────────────────────────────────┘│
│                                                       │
│  Recent Posts                                        │
│  ┌─────────────────────────────────────────┐       │
│  │ 🔓 "New Tutorial Series" (Public)       │       │
│  │    Preview of my upcoming Blender tut.. │       │
│  │    👁 125 views  ❤ 45 likes             │       │
│  └─────────────────────────────────────────┘       │
│  ┌─────────────────────────────────────────┐       │
│  │ 🔒 "Exclusive WIP" (Bronze+)            │       │
│  │    Subscribe to unlock this content...  │       │
│  │    [View Tiers]                          │       │
│  └─────────────────────────────────────────┘       │
└─────────────────────────────────────────────────────┘
```

#### Step 2: Subscribe (Transaction Flow)
```
┌──────────────────────────────────────┐
│  Subscribe to Alice Chen              │
├──────────────────────────────────────┤
│                                       │
│  Selected Tier: Silver                │
│  Price: 10 SUI / month               │
│                                       │
│  You will receive:                    │
│  ✓ All Bronze benefits               │
│  ✓ Exclusive video tutorials         │
│  ✓ Monthly Q&A sessions              │
│                                       │
│  Payment Breakdown:                   │
│  Subscription:     10.000 SUI        │
│  Platform Fee (5%): 0.500 SUI        │
│  Gas Fee (est):    0.003 SUI         │
│  ─────────────────────────           │
│  Total:           10.503 SUI         │
│                                       │
│  Your wallet balance: 45.2 SUI       │
│                                       │
│  ☑ I understand this subscription    │
│    expires in 30 days                 │
│                                       │
│  [Cancel]  [Confirm & Subscribe]     │
│                                       │
└──────────────────────────────────────┘
```

**On "Confirm"**:
1. Sui wallet prompts for transaction approval
2. Transaction includes:
   - Split gas coin → 10.5 SUI
   - Call `purchase_subscription(tier=2, payment=10.5 SUI)`
3. Smart contract:
   - Validates payment
   - Splits: 9.5 SUI → Alice, 0.5 SUI → Platform
   - Mints SubscriptionNFT
   - Sets expiry = now + 30 days
4. NFT transferred to fan's address
5. Success screen:

```
┌──────────────────────────────────────┐
│  🎉 Subscription Activated!          │
├──────────────────────────────────────┤
│                                       │
│  You're now a Silver supporter of    │
│  Alice Chen!                          │
│                                       │
│  Your Subscription NFT:               │
│  ┌─────────────────────────────────┐│
│  │  🎫 Silver Access Pass          ││
│  │                                  ││
│  │  Creator: @alice.sui             ││
│  │  Tier: Silver                    ││
│  │  Expires: Dec 15, 2025           ││
│  │                                  ││
│  │  NFT ID: 0x7a3b...               ││
│  └─────────────────────────────────┘│
│                                       │
│  [View Exclusive Content]            │
│  [Manage Subscription]               │
│                                       │
└──────────────────────────────────────┘
```

### Phase 5: Content Access

#### Viewing Premium Post
```
┌─────────────────────────────────────────────────────┐
│  ← Back to @alice.sui                                │
├─────────────────────────────────────────────────────┤
│  🔓 Unlocked with Silver Tier                       │
│                                                       │
│  "Advanced Lighting Techniques"                      │
│  Posted 3 days ago • Silver Tier Required           │
│                                                       │
│  ┌───────────────────────────────────────────────┐ │
│  │                                                 │ │
│  │     [Embedded Image from Walrus]               │ │
│  │                                                 │ │
│  │  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  │ │
│  │  ▓ Beautiful digital art rendering...  ▓       │ │
│  │  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  │ │
│  │                                                 │ │
│  └───────────────────────────────────────────────┘ │
│                                                       │
│  In this tutorial, I'll show you my workflow for    │
│  creating dramatic lighting effects in Blender...   │
│                                                       │
│  [Full text content...]                              │
│                                                       │
│  ❤ 67 likes  💬 12 comments  📥 Download            │
│                                                       │
│  Comments (Silver+ only)                             │
│  ┌─────────────────────────────────────────┐       │
│  │ @bob: Amazing work! Can you share the   │       │
│  │       node setup?                         │       │
│  │ └─ @alice: Sure! Check DMs              │       │
│  └─────────────────────────────────────────┘       │
│  [Add Comment...]                                    │
│                                                       │
└─────────────────────────────────────────────────────┘
```

**Access Verification Flow**:
1. Frontend: User clicks on post
2. Check: Does user own SubscriptionNFT for this creator?
3. Query: `getOwnedObjects({ owner: userAddress, type: SubscriptionNFT })`
4. Filter: NFTs where `creator == post.creator`
5. Validate onchain: `is_active(nft, clock)` (checks expiry)
6. Validate tier: `nft.tier_id >= post.required_tier`
7. If pass: Decrypt content (if Seal encrypted) & display
8. If fail: Show paywall with subscription CTA

**Walrus Content Delivery**:
- Image: `<img src="https://aggregator.walrus.../v1/{blob_id}" />`
- Video: `<video src="..." />` with streaming support
- File: Download button triggers `fetch(walrus_url)`

### Phase 6: Subscription Management

#### Fan's Subscription Dashboard
```
┌─────────────────────────────────────────────────────┐
│  My Subscriptions                                    │
├─────────────────────────────────────────────────────┤
│                                                       │
│  Active (2)                                          │
│  ┌─────────────────────────────────────────┐       │
│  │ 🎨 @alice.sui - Silver Tier              │       │
│  │    Expires: Dec 15, 2025 (22 days left) │       │
│  │    [Renew] [View Content] [Cancel]      │       │
│  └─────────────────────────────────────────┘       │
│  ┌─────────────────────────────────────────┐       │
│  │ 📷 @bob.sui - Gold Tier                 │       │
│  │    Expires: Jan 3, 2026 (41 days left)  │       │
│  │    [Renew] [View Content] [Cancel]      │       │
│  └─────────────────────────────────────────┘       │
│                                                       │
│  Expired (1)                                         │
│  ┌─────────────────────────────────────────┐       │
│  │ 🎵 @carol.sui - Bronze Tier             │       │
│  │    Expired: Nov 1, 2025                  │       │
│  │    [Resubscribe]                         │       │
│  └─────────────────────────────────────────┘       │
│                                                       │
│  Total Spent: 45 SUI (~$150)                        │
│  Creators Supported: 3                               │
│                                                       │
└─────────────────────────────────────────────────────┘
```

**Actions**:
- **Renew**: Call `renew_subscription()` → Extend expiry by 30 days
- **Cancel**: Don't renew → NFT expires naturally → Lose access
- **Transfer**: Send NFT to another address (secondary market!)

---

## Advanced Features

### 1. NFT Marketplace Integration

**Scenario**: Bob subscribed to Alice but lost interest. He can sell his subscription:

```
┌──────────────────────────────────────┐
│  Sell Subscription NFT                │
├──────────────────────────────────────┤
│                                       │
│  @alice.sui Silver Tier               │
│  Time Remaining: 22 days             │
│                                       │
│  Your asking price:                   │
│  [7] SUI (30% discount)              │
│                                       │
│  Potential buyers can:                │
│  • Access all Silver content         │
│  • Use remaining 22 days             │
│  • Renew at standard price           │
│                                       │
│  Marketplace Fee: 2.5%               │
│  You receive: 6.825 SUI              │
│                                       │
│  [List for Sale]                      │
│                                       │
└──────────────────────────────────────┘
```

**Benefits**:
- Creates secondary market for subscriptions
- Fans can recoup costs if losing interest
- New fans can get discounts on partial months

### 2. Creator Analytics Dashboard

```
┌─────────────────────────────────────────────────────┐
│  Analytics Dashboard                                 │
├─────────────────────────────────────────────────────┤
│                                                       │
│  Revenue (Last 30 Days)                              │
│  ┌────────────────────────────────────┐            │
│  │     ▂▃▅▆▇█▇▅▄▃▂                   │            │
│  │  285 SUI (~$950)  ↑ 12% vs last mo│            │
│  └────────────────────────────────────┘            │
│                                                       │
│  Subscribers by Tier                                 │
│  Bronze:  45 fans (5 SUI × 45 = 225 SUI/mo)        │
│  Silver:  12 fans (10 SUI × 12 = 120 SUI/mo)       │
│  Gold:     3 fans (25 SUI × 3 = 75 SUI/mo)         │
│  Total:   60 fans • 420 SUI/month recurring         │
│                                                       │
│  Top Posts (Last 7 Days)                            │
│  1. "Advanced Lighting" - 456 views, 89 likes       │
│  2. "Character Design" - 234 views, 67 likes        │
│  3. "Workflow Tips" - 189 views, 45 likes           │
│                                                       │
│  Subscription Churn: 8% (industry avg: 15%)         │
│  Avg Lifetime Value: 6.2 months                     │
│                                                       │
└─────────────────────────────────────────────────────┘
```

### 3. Composability Examples

#### A. Token-Gated Discord
```typescript
// Discord bot verifies SubscriptionNFT ownership
async function verifyAccess(discordUserId: string) {
  const walletAddress = await getUserWallet(discordUserId);
  const nfts = await suiClient.getOwnedObjects({
    owner: walletAddress,
    filter: { StructType: SUBSCRIPTION_NFT_TYPE }
  });
  
  // Grant role if NFT found & active
  if (nfts.data.length > 0) {
    await grantRole(discordUserId, 'Silver Supporter');
  }
}
```

#### B. Cross-Platform Access
- **Scenario**: Alice also runs a Notion-based course
- **Integration**: Notion checks Sui blockchain for active NFT → Unlocks premium pages
- **Result**: One subscription, multiple platforms!

---

## Key Differentiators vs Web2

### Patreon
| Feature | Patreon | Auriya |
|---------|---------|--------|
| Platform Fee | 5-12% | 5% (can be 0%) |
| Content Storage | Patreon servers | Decentralized (Walrus) |
| Account Control | Can be banned | Censorship-resistant |
| Subscription Portability | Locked to platform | NFT can be sold/transferred |
| Payment Method | Credit cards | Crypto (SUI) |
| Privacy | Email + payment info required | zkLogin (no email needed) |

### OnlyFans
| Feature | OnlyFans | Auriya |
|---------|---------|--------|
| Platform Fee | 20% | 5% |
| Content Ownership | Platform owns | Creator owns (Walrus blobs) |
| Payment | Bank transfer delays | Instant crypto payments |
| Privacy | KYC required | Privacy-preserving zkLogin |

---

## Technical Highlights for Judges

### 1. **Walrus Integration**
- All media stored on Walrus (images, videos, files)
- Efficient large file handling (videos stream directly from aggregator)
- Permanent storage (no AWS/S3 vendor lock-in)

### 2. **Seal Encryption** (if available)
- Content encrypted with onchain access policies
- Only SubscriptionNFT holders can decrypt
- Zero-knowledge proof of access rights

### 3. **Sui Move Contracts**
- Object-centric design (CreatorProfile, SubscriptionNFT, ContentPost)
- Composable: NFTs work with any dApp (marketplaces, Discord bots, etc.)
- Gas-efficient: Shared objects for scalability

### 4. **zkLogin UX**
- Seamless onboarding for non-crypto users
- No seed phrase management
- Privacy-preserving (OAuth provider can't track blockchain activity)

### 5. **Real-World Use Case**
- $104B creator economy addressable market
- Solves real pain points (fees, deplatforming, payment delays)
- Production-ready architecture

---

## Success Metrics (Hackathon Demo)

### Live Demo Checklist
- [ ] Creator profile created with Walrus-hosted avatar
- [ ] 3 subscription tiers configured onchain
- [ ] 5 posts created (2 public, 3 premium)
- [ ] Fan subscribes via zkLogin
- [ ] Premium content access granted
- [ ] Walrus content streams smoothly
- [ ] Transaction history visible on Sui Explorer

### Code Quality
- [ ] TypeScript with strict mode
- [ ] Comprehensive error handling
- [ ] Loading states & optimistic UI
- [ ] Mobile responsive design
- [ ] Documented API (JSDoc comments)

### Documentation
- [ ] README with setup instructions
- [ ] Architecture diagrams
- [ ] Video demo (2-3 minutes)
- [ ] Deployed contracts on testnet
- [ ] Live demo URL

---

## Conclusion

**Auriya reimagines the creator economy with blockchain primitives**, delivering:

1. **True Ownership**: Creators own profiles, content, and revenue streams
2. **Composability**: Subscription NFTs work across platforms
3. **Privacy**: zkLogin + encryption protect user data
4. **Censorship Resistance**: Walrus ensures content permanence
5. **Fair Economics**: 95% revenue to creators (vs 80-88% on Web2)

**This is the future of creator monetization—decentralized, transparent, and user-owned.**
