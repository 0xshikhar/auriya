# Auriya - Executive Summary

## 🎯 One-Line Pitch
**Decentralized Patreon on Sui Stack: Creators keep 95% revenue, fans own their access rights, content lives forever on Walrus.**

---

## 📊 Quick Facts

| Metric | Value |
|--------|-------|
| **Target Market** | $104B Creator Economy |
| **Problem** | 12-20% platform fees, deplatforming risk, payment delays |
| **Solution** | Blockchain-based monetization with provable ownership |
| **Tech Stack** | Sui + Walrus + Seal + zkLogin + Next.js |
| **Implementation Time** | 8 days (with existing template) |
| **Target Tracks** | Data Marketplaces (primary), Data Security (secondary) |

---

## 🔥 Core Innovation

### 1. Programmable Access Control
Subscription NFTs grant tiered access to content. Smart contracts enforce rules onchain:
- **Bronze NFT** ($5/mo) → Access tier 1+ posts
- **Silver NFT** ($10/mo) → Access tier 1-2 posts
- **Gold NFT** ($25/mo) → Access all posts + 1-on-1 calls

### 2. Composable Subscriptions
NFTs are transferable objects that work across platforms:
- Trade on NFT marketplaces (Clutchy, Hyperspace)
- Use as Discord/Telegram access tokens
- Verify ownership for event tickets
- Cross-platform authentication

### 3. Censorship-Resistant Content
All media stored on Walrus (decentralized blob storage):
- No AWS/S3 dependency
- Permanent availability
- No deplatforming risk
- Creator owns blob references

### 4. Privacy-First Authentication
zkLogin eliminates passwords while preserving privacy:
- Sign in with Google → Get Sui address
- Google doesn't know blockchain activity
- No email required
- No seed phrase management

---

## 🏗️ System Architecture

```
┌──────────────────────────────────────────────────────────┐
│                     AURIYA PLATFORM                       │
├──────────────────────────────────────────────────────────┤
│                                                            │
│  FRONTEND (Next.js 14 + TypeScript)                       │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐         │
│  │  Creator   │  │    Fan     │  │  Content   │         │
│  │ Dashboard  │  │   Portal   │  │   Viewer   │         │
│  └────────────┘  └────────────┘  └────────────┘         │
│                                                            │
│  INTEGRATION LAYER                                         │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐         │
│  │ Sui Client │  │  Walrus    │  │   zkLogin  │         │
│  │ (dapp-kit) │  │   SDK      │  │   (Enoki)  │         │
│  └────────────┘  └────────────┘  └────────────┘         │
│                                                            │
│  BLOCKCHAIN LAYER                                          │
│  ┌──────────────────────────────────────────────┐        │
│  │  Sui Move Smart Contracts                    │        │
│  │  • creator_profile.move                      │        │
│  │  • subscription.move                         │        │
│  │  • content.move                              │        │
│  └──────────────────────────────────────────────┘        │
│                                                            │
│  ┌──────────────┐              ┌──────────────┐          │
│  │   Walrus     │              │     Seal     │          │
│  │   Storage    │              │  Encryption  │          │
│  │              │              │              │          │
│  │ • Avatars    │              │ • Access     │          │
│  │ • Banners    │              │   Policies   │          │
│  │ • Post Media │              │ • Decrypt    │          │
│  │ • Videos     │              │   Keys       │          │
│  └──────────────┘              └──────────────┘          │
│                                                            │
└──────────────────────────────────────────────────────────┘
```

---

## 🎬 User Flows

### Creator Journey (3 minutes)
1. **Sign up** → zkLogin with Google → Get Sui address
2. **Create profile** → Upload avatar to Walrus → Deploy CreatorProfile contract
3. **Set tiers** → Configure Bronze/Silver/Gold pricing → Deploy CreatorSubscriptions
4. **Create content** → Upload image to Walrus → Set tier access → Publish ContentPost
5. **Earn revenue** → Fans subscribe → 95% goes directly to creator wallet

### Fan Journey (2 minutes)
1. **Sign in** → zkLogin → Browse creators
2. **Discover** → Find creator → View profile & preview posts
3. **Subscribe** → Select tier → Approve transaction → Receive SubscriptionNFT
4. **Access** → View premium posts → Content decrypted via Seal → Stream from Walrus
5. **Engage** → Comment, like, tip creator

---

## 🛠️ Technology Deep Dive

### Smart Contracts (Sui Move)

#### creator_profile.move
```move
public struct CreatorProfile has key, store {
    id: UID,
    owner: address,
    suins_name: Option<String>,
    display_name: String,
    bio: String,
    avatar_walrus_id: String,  // Walrus blob reference
    banner_walrus_id: String,
    category: String,
    total_subscribers: u64,
    total_revenue_mist: u64,
}
```

#### subscription.move
```move
public struct SubscriptionNFT has key, store {
    id: UID,
    creator: address,
    subscriber: address,
    tier_id: u8,
    expires_at: u64,  // Unix timestamp
    auto_renew: bool,
}

public entry fun purchase_subscription(
    subs: &mut CreatorSubscriptions,
    tier_id: u8,
    payment: Coin<SUI>,
    clock: &Clock,
    ctx: &mut TxContext
)
```

#### content.move
```move
public struct ContentPost has key, store {
    id: UID,
    creator: address,
    walrus_blob_id: String,        // Walrus reference
    seal_policy_id: Option<String>, // Seal encryption
    required_tier: u8,
    views: u64,
    likes: u64,
}

public fun can_access(
    post: &ContentPost,
    nft: &SubscriptionNFT,
    clock: &Clock
): bool
```

### Walrus Integration

**Upload Flow**:
```typescript
const result = await fetch('https://publisher.walrus-testnet.walrus.space/v1/store', {
  method: 'PUT',
  body: file,
});
const { blobId } = await result.json();
// Store blobId onchain in ContentPost
```

**Download Flow**:
```typescript
const url = `https://aggregator.walrus-testnet.walrus.space/v1/${blobId}`;
// Use directly in <img src={url} /> or <video src={url} />
```

### Seal Integration (Conceptual)

**Encrypt Content**:
```typescript
const policy = {
  requiredNFT: SUBSCRIPTION_NFT_TYPE,
  minTier: 2, // Silver+
};
const sealPolicyId = await encryptWithSeal(content, policy);
```

**Decrypt Content**:
```typescript
const userNFT = await getUserSubscriptionNFT(userAddress);
const decrypted = await decryptWithSeal(sealPolicyId, userNFT);
```

---

## 📈 Market Analysis

### Target Addressable Market (TAM)
- **Creator Economy**: $104.2B (2024)
- **Patreon**: 250K creators, $3.5B paid to creators
- **OnlyFans**: 3M creators, $5.5B annual revenue
- **Substack**: 2M writers, $300M+ paid to creators

### Competitive Advantage

| Feature | Patreon | OnlyFans | Substack | Auriya |
|---------|---------|----------|----------|--------|
| Platform Fee | 5-12% | 20% | 10% | 5% (or 0%) |
| Deplatforming Risk | High | High | Medium | None |
| Content Storage | Centralized | Centralized | Centralized | Decentralized |
| Subscription Portability | No | No | No | Yes (NFT) |
| Payment Speed | 7-14 days | 7-21 days | Monthly | Instant |
| Privacy | Email required | KYC required | Email required | zkLogin |
| Secondary Market | No | No | No | Yes |

### Early Adopter Segments
1. **Crypto-native creators** (already have audience in Web3)
2. **Deplatformed creators** (banned from Patreon/OnlyFans)
3. **Privacy-conscious creators** (journalists, activists)
4. **NFT artists** (want composable access tokens)

---

## 🚀 Implementation Roadmap

### Phase 1: Foundation ✅ (Current)
- [x] Next.js frontend with Sui integration
- [x] zkLogin authentication
- [x] Basic Move contract template
- [x] Multi-network deployment scripts

### Phase 2: Smart Contracts (Days 1-3)
- [ ] Deploy creator_profile.move
- [ ] Deploy subscription.move
- [ ] Deploy content.move
- [ ] 80%+ test coverage

### Phase 3: Walrus Integration (Days 3-4)
- [ ] Build Walrus client
- [ ] Upload component (images, videos)
- [ ] Content streaming

### Phase 4: Frontend Features (Days 4-6)
- [ ] Creator Dashboard
- [ ] Fan Portal
- [ ] Content Viewer with access gates
- [ ] Subscription management

### Phase 5: Polish & Demo (Days 7-8)
- [ ] UI/UX polish
- [ ] Error handling
- [ ] Mobile responsive
- [ ] Video demo
- [ ] Documentation

---

## 🎯 Hackathon Submission

### Tracks
1. **Data Marketplaces** (Primary)
   - Direct creator-fan data exchange
   - Provable ownership via NFTs
   - Transparent pricing
   - Decentralized > Centralized

2. **Data Security & Privacy** (Secondary)
   - zkLogin privacy
   - Seal encryption
   - No centralized data storage

3. **Best Tech Implementation** (Bonus)
   - Full Walrus integration
   - Seal encryption
   - Production-ready architecture

### Deliverables
- ✅ Working demo on testnet
- ✅ Deployed smart contracts
- ✅ Open-source code repository
- ✅ Video demo (2-3 minutes)
- ✅ Comprehensive documentation
- ✅ Live deployment (Vercel)

---

## 💰 Business Model

### Revenue Streams
1. **Platform Fee**: 5% on all subscriptions (can be reduced to 0% later)
2. **Premium Features**: Analytics dashboard ($5/month)
3. **Verification Badge**: $10 one-time fee
4. **Promoted Listings**: $20/month for homepage feature

### Unit Economics
**Per Creator (assuming 50 subscribers @ $10/mo)**:
- Monthly revenue: $500
- Platform fee (5%): $25
- Creator keeps: $475

**Platform revenue (at 10K creators)**:
- Monthly: $250,000
- Annual: $3,000,000

### Moat Strategy
1. **Network Effects**: More creators → More fans → More creators
2. **Locked-In Content**: Walrus storage is permanent (high switching cost)
3. **Composability**: Subscription NFTs work with other dApps
4. **Brand**: "The Web3 Patreon" mindshare

---

## 🏆 Success Metrics

### Hackathon Goals
- Working demo with real transactions
- All 3 Sui Stack components integrated
- Beautiful UI (better than most hackathon projects)
- Comprehensive docs
- Strong video demo

### Post-Hackathon Goals (3 months)
- 100 creators onboarded
- 1,000 active subscribers
- $10K monthly volume
- Security audit complete
- Mobile app beta

### Long-Term Vision (12 months)
- 10,000 creators
- 100,000 subscribers
- $1M monthly volume
- Mainnet launch
- Token launch (AURI governance)

---

## 🔒 Security Considerations

### Smart Contract Security
- **Access Control**: Only creator can modify profile/tiers
- **Payment Validation**: Verify exact amount before minting NFT
- **Expiry Checks**: Validate timestamp before granting access
- **Reentrancy**: Use Sui's object model (prevents reentrancy by design)

### Frontend Security
- **Input Validation**: Sanitize all user inputs
- **XSS Prevention**: Use React's built-in escaping
- **Rate Limiting**: Prevent spam uploads to Walrus
- **HTTPS Only**: Force secure connections

### Privacy Protections
- **No PII Storage**: Never store email/name onchain
- **zkLogin**: Google can't track blockchain activity
- **Encrypted Storage**: Sensitive content encrypted with Seal
- **Anonymous Analytics**: No user tracking

---

## 🌟 Unique Selling Points (USPs)

### For Creators
1. **Keep 95% of revenue** (vs 80-88% on Web2)
2. **No deplatforming** (content on Walrus forever)
3. **Instant payments** (no 7-14 day delays)
4. **Own your audience** (subscriber list is onchain)
5. **Composable access** (NFTs work everywhere)

### For Fans
1. **Provable support** (NFT proves you're a supporter)
2. **Transferable subscriptions** (sell NFT if losing interest)
3. **Privacy-first** (no email, no tracking)
4. **Direct impact** (95% goes to creator)
5. **Cross-platform** (one NFT, multiple platforms)

### For Ecosystem
1. **Real use case** for Walrus (storage)
2. **Real use case** for Seal (encryption)
3. **Drives Sui adoption** (creators bring fans to Sui)
4. **Composability showcase** (NFTs as access tokens)

---

## 📚 Documentation Index

1. **TECHNICAL_ARCHITECTURE.md** - System design & tech stack
2. **SMART_CONTRACTS_SPEC.md** - Contract details & API reference
3. **IMPLEMENTATION_PHASES.md** - Step-by-step build guide
4. **PRODUCT_FLOW.md** - User journeys & UX flows
5. **HACKATHON_SUBMISSION_GUIDE.md** - Submission checklist & tips

---

## 🤝 Team & Execution

### Current Status
- ✅ Foundation complete (Sui + zkLogin + Next.js)
- ⏳ Ready to build smart contracts
- ⏳ Ready to integrate Walrus
- 🎯 8 days to completion

### Strengths
- Production-ready template (not starting from scratch)
- zkLogin already working (huge UX advantage)
- Clear implementation plan (detailed in docs)
- Strong product-market fit (creator economy is hot)

### Risks & Mitigations
| Risk | Mitigation |
|------|------------|
| Seal SDK not ready | Use client-side encryption as fallback |
| Walrus upload fails | Add retry logic + error handling |
| Smart contract bugs | Comprehensive testing + audit |
| Complex UX | Simplify flows, add tooltips |

---

## 🎉 Conclusion

**Auriya is not just a hackathon project—it's a blueprint for the future of the creator economy.**

By combining:
- **Sui's programmable logic** (smart contracts)
- **Walrus's decentralized storage** (content permanence)
- **Seal's encryption** (privacy & access control)
- **zkLogin's UX** (web2-like onboarding)

We create a platform that is:
- ✅ **More fair** (95% to creators)
- ✅ **More secure** (censorship-resistant)
- ✅ **More composable** (NFTs work everywhere)
- ✅ **More private** (no data collection)

**This is the 10x better solution judges are looking for.** 🚀

---

## 📞 Contact & Links

- **GitHub**: (to be added after repo creation)
- **Demo**: (to be deployed to Vercel)
- **Video**: (to be recorded)
- **Contracts**: (to be deployed to testnet)

**Built for the Walrus Haulout Hackathon** 🦭
