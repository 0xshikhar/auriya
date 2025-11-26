
## 📜 Smart Contracts ( Backend)


```
auriya/
├── creator_profile/
│   ├── Move.toml
│   └── sources/
│       └── creator_profile.move
├── subscription/
│   ├── Move.toml
│   └── sources/
│       └── subscription.move
├── content/
│   ├── Move.toml
│   └── sources/
│       └── content.move
├── membership_tiers/
│   ├── Move.toml
│   └── sources/
│       └── membership_tiers.move
└── landing_page/
    ├── Move.toml
    └── sources/
        └── landing_page.move
```


### **Deployed Contracts (Sui Testnet)**

```typescript
// Creator Profile & Landing Pages
CREATOR_PROFILE_PACKAGE_ID = '0x1ba3dac9157e597bfaf27e94f6f2fa513bd3d41d0931da990eff0708e8e74315'
CREATOR_PROFILE_REGISTRY_ID = '0xe6b3363c91fb1883c49bace782b25dbefdb3c5158fb1dfe878507a6833cf7d5c'
LANDING_PAGE_REGISTRY_ID = '0x4b97d0f4aeee6c1e031394c80c07e0d91876602c8a7e03e3a5347514ffa7de11'

// Subscriptions & Revenue
SUBSCRIPTION_PACKAGE_ID = '0x9e0516bded6a0b380331cbfdc498503d59f23a93985782d9f493d5fdbb8c0464'
SUBSCRIPTION_TREASURY_ID = '0xf364c48c6b18e9a97b92e56ea94822492b4af829602f0384bb4110e58bc377c3'

// Content Management
CONTENT_PACKAGE_ID = '0x35bfc5722ef228581b825a32cb4971f38b0470d3db2cd081e69ac40565975e15'

// Seal Access Control
SEAL_ACCESS_CONTROL_PACKAGE_ID = '0x1435b35c3d5bfb75224a5394ea47cf4054c84277e63aa7a2f1bc2188cf6b814a'
```

### **1. Creator Profile Contract**
**File**: `backend/move/creator_profile/sources/creator_profile.move`

**Functions**:
- `create_profile()` - Create creator identity with Walrus-stored media
- `update_profile()` - Update profile metadata
- `link_suins()` - Link SuiNS name
- `add_social_link()` - Add social media links

**Events**: `ProfileCreated`, `ProfileUpdated`, `SuiNSLinked`

---

### **2. Subscription Contract**
**File**: `backend/move/subscription/sources/subscription.move`

**Functions**:
- `create_tiers()` - Creator sets up subscription tiers
- `purchase_subscription()` - Fan mints NFT, pays creator (97/3 split)
- `renew_subscription()` - Extend NFT expiry
- `cancel_subscription()` - Disable auto-renew
- `is_active()` - Check if NFT is valid

**Revenue Split**: 97% to creator, 3% to platform treasury

**Events**: `TiersCreated`, `SubscriptionPurchased`, `SubscriptionRenewed`

---

### **3. Content Contract**
**File**: `backend/move/content/sources/content.move`

**Functions**:
- `create_registry()` - Initialize creator's content registry
- `create_post()` - Publish content with Walrus blob ID + Seal metadata
- `update_post()` - Update metadata
- `set_seal_policy()` - Link Seal encryption policy
- `record_view()` - Increment view count
- `like_post()` - Like content (creates LikeRecord NFT)

**Events**: `PostCreated`, `PostViewed`, `PostLiked`

---

### **4. Landing Page Contract**
**File**: `backend/move/creator_profile/sources/creator_landing.move`

**Functions**:
- `create_landing_page()` - Create landing page with Walrus-stored JSON
- `update_landing_page()` - Update with new Walrus blob
- `publish_landing_page()` - Make publicly visible
- `unpublish_landing_page()` - Hide from public

**Events**: `LandingPageCreated`, `LandingPageUpdated`, `LandingPagePublished`

---

### **5. Seal Access Control Contract**
**File**: `backend/move/seal_access/sources/content_access.move`

**Functions**:
- `create_policy()` - Create access policy for encrypted content
- `seal_approve()` - **Seal-compatible verification function** (called by key servers)
- `can_access()` - Check if subscription NFT grants access

**Seal Integration**:
- Verifies subscription NFT ownership
- Checks tier level ≥ required tier
- Validates NFT expiry
- Confirms encryption ID prefix matches policy ID

**Events**: `PolicyCreated`, `AccessGranted`, `AccessDenied`

---


