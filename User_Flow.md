# 🔄 Detailed User Flows

## 👥 User Flows

### **Creator Flow**

```
┌───────────────────────────────────────────────────────┐
│                  CREATOR JOURNEY                          │
└───────────────────────────────────────────────────────┘
         │
         │  1️⃣ Sign Up (zkLogin)
         │     • Google OAuth
         │     • Sui wallet auto-generated
         │     • No seed phrases
         │
         ↓
         │  2️⃣ Create Profile
         │     • Upload avatar/banner → Walrus
         │     • Deploy CreatorProfile contract
         │     • Set bio, category, socials
         │
         ↓
         │  3️⃣ Configure Tiers
         │     • Bronze: $5/month
         │     • Silver: $10/month
         │     • Gold: $25/month
         │
         ↓
         │  4️⃣ Upload Content
         │     • Select file (video/image/audio)
         │     • Encrypt with Seal (if gated)
         │     • Upload to Walrus
         │     • Store blob ID on-chain
         │
         ↓
         │  5️⃣ Earn Revenue
         │     • Fans subscribe → 97% to creator
         │     • Instant on-chain settlement
         │     • Real-time analytics dashboard
         │
         ↓
    🎉 SUCCESS!
```

### **Subscriber Flow**

```
┌───────────────────────────────────────────────────────┐
│                SUBSCRIBER JOURNEY                        │
└───────────────────────────────────────────────────────┘
         │
         │  1️⃣ Discover Creator
         │     • Browse platform
         │     • View profile & free content
         │     • See locked premium posts
         │
         ↓
         │  2️⃣ Sign In (zkLogin)
         │     • Google OAuth
         │     • Wallet auto-created
         │     • No crypto knowledge needed
         │
         ↓
         │  3️⃣ Subscribe
         │     • Choose tier (Bronze/Silver/Gold)
         │     • Pay in SUI
         │     • Mint SubscriptionNFT
         │     • 97% goes to creator
         │
         ↓
         │  4️⃣ Access Content
         │     • Smart contract verifies NFT
         │     • Seal decrypts gated content
         │     • Stream from Walrus
         │     • All tier content unlocked
         │
         ↓
         │  5️⃣ Manage Subscription
         │     • Renew monthly
         │     • Transfer to friend
         │     • Sell on marketplace
         │
         ↓
    🎉 ENJOY CONTENT!
```


### **Creator Onboarding Flow (5 minutes)**

#### **Step 1: Authentication (30 seconds)**
```
1. Visit auriya.io
2. Click "Become a Creator"
3. Click "Sign in with Google"
4. Google OAuth flow (standard Web2 UX)
5. zkLogin generates Sui address deterministically
6. No seed phrase, no MetaMask installation
7. Wallet ready with 0 SUI balance
```

**Technical Details**:
- zkLogin uses JWT from Google OAuth
- Ephemeral key pair generated in browser
- Salt stored in browser localStorage
- Sui address derived from: `hash(sub, aud, salt)`
- User can recover wallet with same Google account

---

#### **Step 2: Profile Creation (2 minutes)**
```
1. Fill profile form:
   - Display name: "Alice the Artist"
   - Bio: "Digital artist creating NFT art tutorials"
   - Category: "Art & Design"
   - Social links: Twitter, Instagram, Discord

2. Upload avatar (JPEG, 500KB)
   → Uploaded to Walrus Publisher
   → Returns blob ID: "abc123..."
   → Stored in browser state

3. Upload banner (JPEG, 2MB)
   → Uploaded to Walrus Publisher
   → Returns blob ID: "def456..."

4. Click "Create Profile"
   → Calls smart contract: creator_profile::create_profile()
   → Transaction includes:
      - display_name: "Alice the Artist"
      - bio: "Digital artist..."
      - avatar_walrus_id: "abc123..."
      - banner_walrus_id: "def456..."
      - category: "Art & Design"
   → Gas fee: ~0.01 SUI (~$0.01)
   → Transaction confirmed in 3-5 seconds
   → CreatorProfile object created with ID: 0x789...
```

**Data Model Reference**: `backend/move/creator_profile/sources/creator_profile.move`

---

#### **Step 3: Tier Configuration (1 minute)**
```
1. Navigate to "Membership Tiers" settings
2. Configure Bronze tier:
   - Name: "Bronze Supporter"
   - Price: 5 SUI/month
   - Benefits: "Access to basic tutorials"
   - Tier level: 1

3. Configure Silver tier:
   - Name: "Silver Patron"
   - Price: 10 SUI/month
   - Benefits: "All Bronze + premium tutorials"
   - Tier level: 2

4. Configure Gold tier:
   - Name: "Gold VIP"
   - Price: 20 SUI/month
   - Benefits: "All Silver + 1-on-1 calls"
   - Tier level: 3

5. Click "Save Tiers"
   → Calls: membership_tiers::create_tiers()
   → Gas fee: ~0.01 SUI
   → MembershipTiers object created
```

---

#### **Step 4: First Content Upload (1.5 minutes)**
```
1. Click "Create Post"
2. Upload video: "NFT Art Tutorial - Part 1" (50MB MP4)
   → Chunked upload to Walrus Publisher
   → Progress bar: 0% → 100%
   → Returns blob ID: "ghi789..."

3. Fill post details:
   - Title: "NFT Art Tutorial - Part 1"
   - Description: "Learn to create NFT art in Blender"
   - Required tier: Silver (level 2)
   - Tags: ["tutorial", "nft", "blender"]

4. Click "Publish"
   → Calls: content::create_post()
   → Transaction data:
      - creator: 0x789...
      - walrus_blob_id: "ghi789..."
      - title: "NFT Art Tutorial - Part 1"
      - required_tier: 2
   → Gas fee: ~0.005 SUI
   → ContentPost object created with ID: 0xabc...
```

**Content Post Schema**: `backend/move/content/sources/content.move`

---

#### **Step 5: Earning Revenue (Instant)**
```
1. Fan "Bob" visits Alice's profile
2. Sees locked content (Silver tier required)
3. Clicks "Subscribe to Silver - 10 SUI/month"
4. Approves transaction
   → Calls: subscription::purchase_subscription()
   → Bob pays 10 SUI
   → Revenue distribution:
      - Alice receives: 9.7 SUI (97%)
      - Platform receives: 0.3 SUI (3%)
   → SubscriptionNFT minted to Bob's wallet
   → NFT details:
      - creator: Alice's address
      - subscriber: Bob's address
      - tier_id: 2 (Silver)
      - expires_at: now + 30 days
      - auto_renew: true

5. Alice's dashboard updates:
   - Total subscribers: 0 → 1
   - Total revenue: 0 → 9.7 SUI
   - New subscriber notification

6. Bob's view updates:
   - All Silver+ content unlocked
   - Can now watch "NFT Art Tutorial - Part 1"
```

---

### **Fan Subscription Flow (3 minutes)**

#### **Step 1: Discovery (30 seconds)**
```
1. Visit auriya.io
2. Browse "Trending Creators" section
3. Filter by category: "Art & Design"
4. Click on "Alice the Artist" profile
5. See profile:
   - Avatar & banner (loaded from Walrus)
   - Bio & social links
   - Subscriber count: 42
   - Tier options: Bronze/Silver/Gold
   - Content preview: 3 free posts
   - Locked content: 15 premium posts (blurred)
```

---

#### **Step 2: Authentication (30 seconds)**
```
1. Click "Subscribe" button
2. Prompted: "Sign in to continue"
3. Click "Sign in with Google"
4. Google OAuth flow
5. zkLogin generates Sui wallet
6. Redirected back to Alice's profile
7. Wallet address shown in header: 0xdef...
```

---

#### **Step 3: Subscription Purchase (1 minute)**
```
1. Click "Subscribe to Silver - 10 SUI/month"
2. Modal appears:
   - Tier: Silver Patron
   - Price: 10 SUI/month (~$10)
   - Benefits:
     ✓ Access to 15 premium posts
     ✓ All Bronze tier content
     ✓ Monthly exclusive updates
   - Auto-renewal: ON (toggle available)
   - Total: 10 SUI

3. Click "Confirm Subscription"
4. Transaction approval:
   - Function: subscription::purchase_subscription()
   - Gas estimate: 0.01 SUI
   - Total cost: 10.01 SUI

5. Problem: Wallet has 0 SUI
   → "Insufficient balance" error
   → Click "Get SUI" button
   → Redirected to faucet (testnet) or on-ramp (mainnet)
   → Receive 20 SUI

6. Retry "Confirm Subscription"
7. Transaction submitted
8. Confirmation in 3-5 seconds
9. Success notification:
   "Welcome to Alice's Silver tier! 🎉"
```

---

#### **Step 4: Content Access (Instant)**
```
1. Page refreshes automatically
2. All Silver+ content unlocked:
   - 15 premium posts now visible
   - Blur effect removed
   - "🔓 Unlocked" badge shown

3. Click on "NFT Art Tutorial - Part 1"
4. Content viewer loads:
   - Smart contract checks:
     → Does Bob own SubscriptionNFT? YES
     → NFT tier (2) >= required tier (2)? YES
     → NFT expired? NO
   - Access granted

5. Video player loads:
   - Source: https://aggregator.walrus-testnet.walrus.space/v1/ghi789...
   - Video streams from Walrus
   - Playback controls: play, pause, seek, fullscreen
   - Quality: 1080p, 720p, 480p (adaptive)

6. Engagement features:
   - Like button (increments on-chain counter)
   - Comment section (stored on-chain)
   - Share button (generates referral link)
```

---

#### **Step 5: Subscription Management (Ongoing)**
```
1. Navigate to "My Subscriptions" page
2. See active subscriptions:
   - Alice the Artist - Silver tier
     - Expires: 29 days
     - Auto-renew: ON
     - Actions: [Cancel] [Transfer] [Sell]

3. Option A: Cancel subscription
   → Toggle auto-renew OFF
   → Subscription expires in 29 days
   → No refund (already consumed content)

4. Option B: Transfer to friend
   → Click "Transfer"
   → Enter friend's Sui address: 0xfriend...
   → Approve transaction
   → SubscriptionNFT transferred
   → Friend now has access

5. Option C: Sell on marketplace
   → Click "Sell on Clutchy"
   → Set price: 8 SUI (20% discount)
   → List on NFT marketplace
   → Buyer purchases → NFT transferred
   → Seller receives 8 SUI
```

---

### **Content Viewing Flow with Seal Encryption**

#### **Premium Content (Gold Tier Only)**
```
1. Alice uploads exclusive 1-on-1 call recording
2. Before uploading to Walrus:
   → Content encrypted with Seal
   → Access policy:
      - required_nft_type: SubscriptionNFT
      - min_tier: 3 (Gold)
      - creator: Alice's address
   → Encrypted blob uploaded to Walrus
   → Seal policy ID: "seal_xyz..."

3. ContentPost created:
   - walrus_blob_id: "encrypted_blob_123..."
   - seal_policy_id: "seal_xyz..."
   - required_tier: 3

4. Bob (Silver tier) tries to access:
   → Smart contract check: tier 2 < required tier 3
   → Access denied
   → Shows upgrade prompt: "Upgrade to Gold for $20/month"

5. Charlie (Gold tier) accesses:
   → Smart contract check: tier 3 >= required tier 3
   → Access granted
   → Frontend fetches encrypted blob from Walrus
   → Calls Seal decryption:
      - Proof: Charlie's SubscriptionNFT
      - Policy: seal_xyz...
   → Seal verifies NFT ownership & tier
   → Decryption key released
   → Content decrypted client-side
   → Video plays in browser
```

---
