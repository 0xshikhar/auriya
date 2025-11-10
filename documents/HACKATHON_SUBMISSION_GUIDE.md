# Hackathon Submission Guide

## 🎯 Winning Strategy for Walrus Haulout Hackathon

### Target Tracks

**Primary: Data Marketplaces** (Strong fit)
- ✅ Decentralized data exchange (creator content ↔ fan access)
- ✅ Provable ownership via Sui objects
- ✅ Transparent pricing with smart contracts
- ✅ Clear incentives (95% revenue to creators)
- ✅ 10x better than centralized platforms (no deplatforming, lower fees, composable access)

**Secondary: Data Security & Privacy** (Good fit)
- ✅ zkLogin for privacy-preserving authentication
- ✅ Seal encryption for content protection
- ✅ Zero-knowledge access verification
- ✅ No centralized data collection

**Bonus: Best Tech Implementation** (Excellent)
- ✅ Full Walrus integration (storage for all media)
- ✅ Seal integration (encrypted content access)
- ✅ Sui Move contracts (programmable access control)

---

## 📊 Evaluation Criteria Mapping

### 1. Innovation & Creativity (25%)

**What makes Auriya innovative**:
- **Composable Subscriptions**: NFT-based access tokens can be traded, sold, or used across platforms
- **Privacy-First Creator Economy**: zkLogin eliminates email/password while maintaining privacy
- **Programmable Monetization**: Smart contracts enable dynamic pricing, revenue sharing, time-limited access
- **Censorship-Resistant Content**: Walrus ensures permanent availability, no deplatforming

**Pitch**: *"Patreon meets Web3 — but with 10x better economics, true ownership, and zero censorship risk"*

### 2. Technical Implementation (25%)

**Sui Stack Integration**:
- **Sui Move Contracts** (3 modules):
  - `creator_profile.move` - Identity & metadata
  - `subscription.move` - Access NFTs with expiry logic
  - `content.move` - Post registry with tier gating
- **Walrus Storage**:
  - All avatars, banners, post media stored on Walrus
  - Blob IDs referenced onchain
  - Streaming support for videos
- **Seal Encryption**:
  - Premium content encrypted with access policies
  - Only NFT holders can decrypt
  - Onchain key management

**Code Quality Checklist**:
- [ ] TypeScript strict mode enabled
- [ ] All contracts have >80% test coverage
- [ ] Error handling for all user actions
- [ ] Loading states & optimistic UI
- [ ] Mobile responsive (Tailwind)
- [ ] Accessibility (ARIA labels, keyboard nav)

### 3. Real-World Application (20%)

**Market Opportunity**:
- Creator economy: **$104 billion** (2024)
- Patreon: 250K+ creators, $3.5B+ paid to creators
- OnlyFans: 3M+ creators, $5.5B annual revenue

**Pain Points Solved**:
1. **High Fees**: Patreon (5-12%), OnlyFans (20%) → Auriya (5%, can be 0%)
2. **Deplatforming**: Creators lose income overnight → Auriya: censorship-resistant
3. **Payment Delays**: 7-14 days on Web2 → Auriya: instant crypto payments
4. **No Portability**: Subscription locked to platform → Auriya: tradable NFTs

**Target Users**:
- Digital artists (Patreon refugees)
- Writers/bloggers (Substack alternative)
- Educators (course access via NFTs)
- Musicians (exclusive releases)

### 4. Presentation & Documentation (15%)

**Required Materials**:
1. **README.md** ✅
   - Project overview
   - Setup instructions
   - Architecture diagram
   - Deployed contract addresses
2. **Video Demo** (2-3 minutes)
   - Show creator onboarding
   - Fan subscribes & accesses content
   - Highlight Walrus upload, Sui transaction, zkLogin
3. **Live Demo**
   - Deploy to Vercel/Netlify
   - Pre-populate with demo data
   - Ensure testnet connection works
4. **Code Documentation**
   - JSDoc comments for all functions
   - Inline comments for complex logic
   - API reference in docs/

### 5. Team & Execution (15%)

**What Judges Look For**:
- Complete, working product (not just mockups)
- Polished UI/UX
- Deployed contracts on testnet/mainnet
- Comprehensive testing
- Clear roadmap for post-hackathon

---

## 🚀 8-Day Implementation Timeline

### Days 1-3: Smart Contracts ⚡
**Goal**: Deploy all 3 contracts to testnet

**Day 1**:
- [ ] Create `creator_profile.move`
- [ ] Write tests (profile creation, updates)
- [ ] Deploy to devnet
- [ ] Build frontend hook (`useCreateProfile`)

**Day 2**:
- [ ] Create `subscription.move`
- [ ] Implement purchase/renew/validate logic
- [ ] Test payment flows
- [ ] Deploy to devnet
- [ ] Build frontend hooks (`usePurchaseSubscription`, `useRenewSubscription`)

**Day 3**:
- [ ] Create `content.move`
- [ ] Implement access control logic
- [ ] Test tier-based access
- [ ] Deploy to testnet (final)
- [ ] Update `.env` with package IDs

### Days 4-5: Walrus & Frontend 🎨
**Goal**: Complete core user flows

**Day 4**:
- [ ] Build Walrus client (`lib/walrus.ts`)
- [ ] Create upload component (`WalrusUploader.tsx`)
- [ ] Test image/video uploads
- [ ] Build Creator Dashboard
  - Profile setup page
  - Tier configuration page
  - Content creation page

**Day 5**:
- [ ] Build Fan Portal
  - Creator discovery page
  - Creator profile page
  - Subscription purchase flow
- [ ] Build Content Viewer with access gate
- [ ] Integrate Walrus streaming for videos

### Days 6-7: Polish & Testing ✨
**Goal**: Production-ready quality

**Day 6**:
- [ ] Add loading states (skeleton screens)
- [ ] Error handling (toast notifications)
- [ ] Optimistic UI updates
- [ ] Mobile responsive design
- [ ] Dark mode polish
- [ ] Accessibility audit

**Day 7**:
- [ ] End-to-end testing
  - Creator: Sign up → Configure tiers → Create 5 posts
  - Fan: Sign up → Subscribe → Access content
- [ ] Deploy to Vercel
- [ ] Test on mobile devices
- [ ] Fix bugs

### Day 8: Demo & Documentation 📹
**Goal**: Submission materials

**Morning**:
- [ ] Create demo accounts
  - @demo_creator (with 5 posts)
  - @demo_fan (with subscription)
- [ ] Record video demo
  - Intro (30s): Problem statement
  - Creator flow (60s): Profile setup, post creation
  - Fan flow (60s): Subscribe, access content
  - Tech highlights (30s): Walrus, Sui, zkLogin

**Afternoon**:
- [ ] Write comprehensive README
- [ ] Create architecture diagram (draw.io or Excalidraw)
- [ ] Document deployed contracts
- [ ] Proofread all docs
- [ ] Submit!

---

## 📝 Submission Checklist

### Code Repository
- [ ] Public GitHub repo
- [ ] Clean commit history
- [ ] No sensitive data in commits (.env in .gitignore)
- [ ] MIT or Apache 2.0 license
- [ ] All dependencies listed in package.json

### Documentation
- [ ] README.md with:
  - [ ] Project title & tagline
  - [ ] Problem statement
  - [ ] Solution overview
  - [ ] Tech stack
  - [ ] Setup instructions
  - [ ] Architecture diagram
  - [ ] Demo link
  - [ ] Video link
  - [ ] Deployed contracts (with Explorer links)
- [ ] TECHNICAL_ARCHITECTURE.md
- [ ] SMART_CONTRACTS_SPEC.md
- [ ] API documentation

### Live Demo
- [ ] Deployed to public URL (Vercel/Netlify)
- [ ] Works on mobile & desktop
- [ ] Pre-populated with demo data
- [ ] Connected to Sui testnet
- [ ] Walrus uploads functional
- [ ] zkLogin works

### Video Demo
- [ ] 2-3 minutes long
- [ ] High quality (1080p, clear audio)
- [ ] Shows actual product, not slides
- [ ] Demonstrates key features
- [ ] Highlights Sui Stack integration
- [ ] Uploaded to YouTube/Loom

### Smart Contracts
- [ ] Deployed to Sui testnet (or mainnet)
- [ ] Verified on Sui Explorer
- [ ] Source code in repo matches deployed
- [ ] Test coverage >80%
- [ ] No critical security issues

---

## 🎬 Video Demo Script

**[0:00-0:30] Hook & Problem**
> "Creators lose 12-20% of their revenue to platform fees. They can be deplatformed overnight. Fans have no proof of their support and can't transfer subscriptions. Meet Auriya—the decentralized Patreon that solves all of this."

**[0:30-1:30] Creator Flow**
> [Screen: Creator Dashboard]
> "I'm Alice, a digital artist. I'll create my profile, upload my avatar to Walrus—Sui's decentralized storage—and configure subscription tiers. Bronze is $5/month, Silver is $10, Gold is $25."
> 
> [Screen: Create Post]
> "Now I'll create a premium post. I'll upload this artwork to Walrus, set it to Silver tier access, and publish. The content reference is stored onchain, encrypted with Seal."

**[1:30-2:30] Fan Flow**
> [Screen: Fan Portal]
> "I'm Bob, a fan. I'll sign in with Google using zkLogin—no passwords, no seed phrases. I'll browse creators, find Alice, and subscribe to her Silver tier."
> 
> [Screen: Wallet Transaction]
> "I'll approve the transaction. 95% goes directly to Alice, 5% platform fee. I receive a Subscription NFT."
> 
> [Screen: Content Viewer]
> "Now I can access all Silver+ content. The NFT proves my subscription onchain. If I want, I can even sell this NFT to someone else!"

**[2:30-3:00] Tech Highlights**
> "Auriya uses the full Sui Stack: Walrus for decentralized storage, Seal for encrypted access control, and Sui Move for programmable subscriptions. Creators own their content, fans own their access rights, and no one can be censored. This is the future of the creator economy."

---

## 💡 Demo Tips

### Before Recording
1. **Clear browser cache** to show fresh experience
2. **Use demo accounts** with realistic names
3. **Pre-fund wallets** with testnet SUI (no waiting for faucet)
4. **Test Walrus uploads** to ensure they work quickly
5. **Prepare content** (images, videos) in advance

### During Demo
1. **Narrate your actions** ("Now I'm clicking...")
2. **Highlight tech** ("This is uploading to Walrus...")
3. **Show transactions** (open Sui Explorer in another tab)
4. **Emphasize UX** ("Notice how fast this is...")
5. **Keep moving** (don't wait for long loads, edit them out)

### After Recording
1. **Edit for pacing** (cut dead time)
2. **Add captions** for key points
3. **Background music** (subtle, not distracting)
4. **Test on multiple devices**

---

## 🏆 Winning Differentiators

### vs Other Hackathon Projects

**Most projects will**:
- Use Walrus for basic storage
- Have incomplete UX
- Lack real-world use case

**Auriya will**:
- ✅ **Deep Walrus integration** (avatars, banners, posts, videos—everything!)
- ✅ **Complete user flows** (end-to-end creator & fan journeys)
- ✅ **$104B market** (creator economy is massive)
- ✅ **Production-ready** (not a prototype, actually usable)
- ✅ **Best UX** (zkLogin, optimistic UI, mobile-first)

### Unique Features to Highlight

1. **Composable Subscriptions**
   - NFT access tokens can be sold on secondary markets
   - Works with other platforms (Discord bots, event platforms)
   - Cross-platform authentication

2. **Privacy-First**
   - zkLogin: No email, no password
   - Seal encryption: Only authorized fans decrypt
   - No tracking, no data collection

3. **Creator Sovereignty**
   - Content on Walrus (permanent, censorship-resistant)
   - Revenue goes directly to creator wallet
   - No platform can ban or throttle reach

---

## 📞 Support Resources

### Sui Ecosystem
- **Docs**: https://docs.sui.io
- **Discord**: https://discord.gg/sui (ask in #dev-general)
- **Walrus Docs**: https://docs.walrus.site
- **Seal Docs**: https://docs.sui.io/guides/developer/cryptography/seal

### Tools
- **Sui Explorer**: https://suiexplorer.com (view transactions)
- **Sui Testnet Faucet**: https://faucet.testnet.sui.io
- **Walrus Testnet**: https://docs.walrus.site/usage/testnet.html

### Quick Commands
```bash
# Get testnet SUI
curl --location --request POST 'https://faucet.testnet.sui.io/gas' \
  --header 'Content-Type: application/json' \
  --data-raw '{"FixedAmountRequest":{"recipient":"YOUR_ADDRESS"}}'

# Deploy contracts
cd backend
npm run testnet:deploy

# Start frontend
cd frontend
npm run dev
```

---

## 🎯 Final Checklist (Submit Only When All ✅)

### Technical
- [ ] All smart contracts deployed to testnet
- [ ] Frontend deployed to public URL
- [ ] Walrus uploads working
- [ ] zkLogin authentication working
- [ ] No critical bugs
- [ ] Mobile responsive

### Documentation
- [ ] README is comprehensive
- [ ] Video demo uploaded
- [ ] Architecture diagram included
- [ ] Contract addresses documented
- [ ] Setup instructions tested

### Polish
- [ ] Loading states everywhere
- [ ] Error messages are helpful
- [ ] UI is beautiful (dark theme)
- [ ] Demo data pre-populated
- [ ] Code is clean & commented

### Submission
- [ ] GitHub repo is public
- [ ] Submission form filled out
- [ ] All links are working
- [ ] Team info is correct
- [ ] Hackathon track selected

---

## 🚀 Post-Submission Plans

### If Selected as Finalist
1. **Mainnet deployment** (upgrade from testnet)
2. **Security audit** (engage Sui Foundation)
3. **Beta testers** (recruit 10 creators)
4. **Feedback iteration**

### Long-Term Vision
1. **Token launch** (AURI governance token)
2. **Mobile apps** (React Native)
3. **Creator tools** (analytics, scheduling)
4. **Partnerships** (integrate with existing creator tools)

---

## 💪 You Got This!

**Remember**:
- Focus on **working demo** over perfect code
- **Show, don't tell** (live demo > slides)
- **Highlight Sui Stack** (judges want to see Walrus + Seal usage)
- **Real-world impact** (creator economy is a huge market)
- **Have fun!** This is a hackathon, enjoy the process 🎉

**Good luck! 🚀**
