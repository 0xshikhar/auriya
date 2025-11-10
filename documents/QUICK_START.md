# Auriya - Quick Start Guide

## 🎯 What You're Building

**Decentralized Patreon on Sui Stack**
- Creators monetize content with NFT-based subscriptions
- Fans get provable access rights via Subscription NFTs
- All media stored on Walrus (decentralized storage)
- Content encrypted with Seal (privacy-first)
- zkLogin authentication (already working ✅)

**Market**: $104B creator economy | **Competition**: Patreon, OnlyFans, Substack  
**Advantage**: 95% to creators (vs 80-88%), no deplatforming, composable NFTs

---

## 📁 Documentation Structure

```
/documents/
├── EXECUTIVE_SUMMARY.md          # 📊 High-level overview & pitch
├── TECHNICAL_ARCHITECTURE.md     # 🏗️ System design & tech stack
├── SMART_CONTRACTS_SPEC.md       # 📝 Contract details & Move code
├── IMPLEMENTATION_PHASES.md      # 🚀 Day-by-day build guide
├── PRODUCT_FLOW.md               # 🎬 User journeys & UX flows
└── HACKATHON_SUBMISSION_GUIDE.md # 🏆 Submission checklist & tips
```

**Start here**: Read `EXECUTIVE_SUMMARY.md` for context, then `IMPLEMENTATION_PHASES.md` to begin coding.

---

## ⚡ 8-Day Sprint

### Days 1-3: Smart Contracts
Build 3 Move modules:
1. **creator_profile.move** - Creator identity
2. **subscription.move** - NFT access tokens
3. **content.move** - Post registry with tier gating

**Deliverable**: 3 contracts deployed to Sui testnet

### Days 4-5: Walrus + Frontend
- Integrate Walrus for file uploads
- Build Creator Dashboard (profile, tiers, content)
- Build Fan Portal (discovery, subscribe, view)

**Deliverable**: Working creator & fan flows

### Days 6-7: Polish
- Error handling, loading states, mobile responsive
- End-to-end testing
- Deploy to Vercel

**Deliverable**: Production-ready app

### Day 8: Demo & Docs
- Record 2-3 min video
- Write comprehensive README
- Submit!

**Deliverable**: Hackathon submission

---

## 🛠️ Tech Stack (Already Set Up ✅)

### Frontend
- ✅ Next.js 14 + TypeScript
- ✅ Shadcn UI + Tailwind CSS
- ✅ @mysten/dapp-kit (Sui wallet)
- ✅ Enoki zkLogin (Google OAuth)

### Backend
- ✅ Sui Move contract template (greeting.move)
- ✅ Deployment scripts (localnet/devnet/testnet/mainnet)

### To Add
- [ ] Walrus SDK (file storage)
- [ ] Seal SDK (encryption)
- [ ] SuiNS resolver (optional)

---

## 🚀 Quick Commands

```bash
# Install dependencies
cd frontend && npm install
cd backend && npm install

# Start local dev
cd frontend && npm run dev
# Open http://localhost:3000

# Deploy contracts to testnet
cd backend
npm run testnet:deploy

# Test Move contracts
cd backend
sui move test -p move/creator_profile

# Deploy frontend
cd frontend
vercel deploy
```

---

## 📊 Current Project Status

### ✅ Already Complete
- Next.js frontend with wallet integration
- zkLogin with Google OAuth
- Basic UI components (buttons, forms, modals)
- Multi-network deployment scripts

### ⏳ Need to Build
- Smart contracts (creator_profile, subscription, content)
- Walrus integration (upload/download)
- Creator Dashboard UI
- Fan Portal UI
- Content access control

### 🎯 Hackathon Targets
- **Primary Track**: Data Marketplaces
- **Secondary Track**: Data Security & Privacy
- **Bonus**: Best Tech Implementation (Walrus + Seal)

---

## 💡 Key Features to Highlight

### 1. Composable NFT Subscriptions
```typescript
// Subscription NFT can be:
- Traded on marketplaces (Clutchy, Hyperspace)
- Used for Discord role verification
- Event ticket authentication
- Cross-platform access control
```

### 2. Walrus Deep Integration
```typescript
// Everything stored on Walrus:
- Creator avatars/banners
- Post images/videos
- Downloadable files
- All permanent, decentralized
```

### 3. Seal Encryption (if available)
```typescript
// Content encrypted with onchain policies:
- Only NFT holders can decrypt
- Tier-based access (Bronze/Silver/Gold)
- Zero-knowledge verification
```

### 4. zkLogin UX (already working!)
```typescript
// Best onboarding in Web3:
- Sign in with Google
- No seed phrase
- No email collection
- Privacy-preserving
```

---

## 📝 Smart Contract Overview

### CreatorProfile
```move
public struct CreatorProfile has key, store {
    owner: address,
    display_name: String,
    avatar_walrus_id: String,  // 🦭 Walrus reference
    total_subscribers: u64,
    total_revenue_mist: u64,
}
```

### SubscriptionNFT
```move
public struct SubscriptionNFT has key, store {
    creator: address,
    subscriber: address,
    tier_id: u8,        // 1=Bronze, 2=Silver, 3=Gold
    expires_at: u64,    // Unix timestamp
}

public fun is_active(nft: &SubscriptionNFT, clock: &Clock): bool
```

### ContentPost
```move
public struct ContentPost has key, store {
    creator: address,
    walrus_blob_id: String,        // 🦭 Walrus storage
    seal_policy_id: Option<String>, // 🔒 Seal encryption
    required_tier: u8,              // Access control
}

public fun can_access(post: &ContentPost, nft: &SubscriptionNFT): bool
```

---

## 🎬 Demo Script (30 seconds each)

### Creator Flow
1. Sign up with zkLogin → Create profile
2. Upload avatar to Walrus → Configure tiers ($5/$10/$25)
3. Create post → Upload image to Walrus → Set tier → Publish
4. Show transaction on Sui Explorer

### Fan Flow
1. Sign in with zkLogin → Browse creators
2. View creator profile → Select Silver tier → Subscribe
3. Wallet approves → Receive SubscriptionNFT
4. Access premium content → Image loads from Walrus

### Tech Highlights
1. Show Walrus upload (file → blob_id)
2. Show Sui transaction (subscription purchase)
3. Show NFT in wallet (proof of access)
4. Show access control (paywall for unsubscribed users)

---

## 🏆 Winning Factors

### vs Other Hackathon Projects
Most projects will have:
- Basic Walrus integration (just upload a file)
- Incomplete UX (buttons that don't work)
- No real use case (gimmicky demos)

**Auriya will have**:
- ✅ **Deep integration** (Walrus for everything)
- ✅ **Complete flows** (end-to-end working)
- ✅ **$104B market** (real-world opportunity)
- ✅ **Production-ready** (actually usable today)

### Judges Look For
1. **Innovation** ✅ Composable NFT subscriptions
2. **Technical Excellence** ✅ Full Sui Stack usage
3. **Real-World Impact** ✅ Creator economy is massive
4. **Execution** ✅ Polished UI, working demo
5. **Presentation** ✅ Clear docs, great video

---

## 📚 Implementation Resources

### Must-Read Docs
1. **IMPLEMENTATION_PHASES.md** - Day-by-day build guide
2. **SMART_CONTRACTS_SPEC.md** - Full contract code
3. **PRODUCT_FLOW.md** - User experience flows
4. **HACKATHON_SUBMISSION_GUIDE.md** - Final checklist

### External Resources
- Sui Docs: https://docs.sui.io
- Walrus Docs: https://docs.walrus.site
- Seal Guide: https://docs.sui.io/guides/developer/cryptography/seal
- Discord: https://discord.gg/sui (#dev-general)

---

## 🎯 Success Checklist

### Technical (Days 1-7)
- [ ] 3 smart contracts deployed to testnet
- [ ] Walrus uploads working (images + videos)
- [ ] Creator can create profile & posts
- [ ] Fan can subscribe & access content
- [ ] Mobile responsive UI
- [ ] No critical bugs

### Submission (Day 8)
- [ ] GitHub repo is public
- [ ] README with setup instructions
- [ ] Video demo uploaded (2-3 min)
- [ ] Live demo deployed (Vercel)
- [ ] Architecture diagram included
- [ ] Contract addresses documented

### Polish
- [ ] Loading states everywhere
- [ ] Error messages are helpful
- [ ] UI is beautiful (dark theme)
- [ ] Code is clean & commented
- [ ] Demo data pre-populated

---

## 🚨 Common Pitfalls to Avoid

### Don't
- ❌ Build everything (focus on core features)
- ❌ Ignore error handling (judges will try to break it)
- ❌ Skip mobile testing (judges use phones)
- ❌ Record bad demo video (invest time here!)
- ❌ Submit without testing (test 3x before submitting)

### Do
- ✅ Focus on working demo (not perfect code)
- ✅ Pre-populate demo data (don't create during demo)
- ✅ Show Sui Stack usage (highlight Walrus, Seal, zkLogin)
- ✅ Test on testnet (not localnet for submission)
- ✅ Make it beautiful (judges are humans, visuals matter)

---

## 💪 Motivational Notes

### You Have Strong Advantages
1. **Template works** - zkLogin, wallet, UI already done
2. **Clear plan** - Detailed docs for every step
3. **Hot market** - Judges know creator economy is huge
4. **Best UX** - zkLogin is leagues ahead of competitors

### Time Budget (8 days = 192 hours)
- Smart contracts: 24 hours
- Walrus integration: 8 hours
- Frontend: 32 hours
- Polish: 16 hours
- Testing: 8 hours
- Demo prep: 8 hours
- **Buffer**: 96 hours (50% buffer!)

### You Got This! 🚀
This is not just a hackathon project—it's a real product that could change the creator economy. Build with passion, ship with confidence.

**Good luck! 🎉**

---

## 📞 Quick Links

- **Sui Testnet Faucet**: https://faucet.testnet.sui.io
- **Sui Explorer**: https://suiexplorer.com
- **Walrus Testnet**: https://docs.walrus.site/usage/testnet.html
- **Hackathon Portal**: (link from DeepSurge)

---

**Next Step**: Open `documents/IMPLEMENTATION_PHASES.md` and start Day 1! 🚀
