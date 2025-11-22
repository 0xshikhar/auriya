# Auriya Smart Contracts

## Overview

Three Sui Move modules powering the Auriya decentralized creator platform:

1. **creator_profile** - Creator identity and metadata
2. **subscription** - NFT-based access control with tiered subscriptions
3. **content** - Content posts with Walrus storage references

---

## Module 1: Creator Profile

### Purpose
Manages creator identities, profiles, and metadata on Auriya.

### Key Structs

```move
public struct CreatorProfile has key, store {
    id: UID,
    owner: address,
    suins_name: Option<String>,
    display_name: String,
    bio: String,
    avatar_walrus_id: String,      // Walrus blob reference
    banner_walrus_id: String,       // Walrus blob reference
    social_links: vector<String>,
    category: String,
    created_at: u64,
    total_subscribers: u64,
    total_revenue_mist: u64,
    verified: bool,
}
```

### Main Functions

#### `create_profile`
Creates a new creator profile with Walrus-hosted avatar and banner.

```bash
sui client call \
  --package $PACKAGE_ID \
  --module creator_profile \
  --function create_profile \
  --args $REGISTRY_ID "Alice Creator" "Digital artist" "avatar_blob_id" "banner_blob_id" "Art" $CLOCK \
  --gas-budget 10000000
```

#### `update_profile`
Updates profile metadata (only callable by owner).

#### `link_suins`
Links a SuiNS name to the profile (e.g., alice.sui).

#### `increment_subscribers` / `add_revenue`
Internal functions called by subscription module to track metrics.

---

## Module 2: Subscription

### Purpose
Manages subscription tiers and mints NFT-based access tokens.

### Key Structs

```move
public struct SubscriptionNFT has key, store {
    id: UID,
    creator: address,
    subscriber: address,
    tier_id: u8,              // 1=Bronze, 2=Silver, 3=Gold
    tier_name: String,
    purchased_at: u64,
    expires_at: u64,          // Unix timestamp
    auto_renew: bool,
}

public struct CreatorSubscriptions has key {
    id: UID,
    creator: address,
    tiers: vector<SubscriptionTier>,
    active_subscriber_count: u64,
    total_revenue_mist: u64,
    platform_fee_bps: u64,    // Basis points (500 = 5%)
}
```

### Main Functions

#### `create_tiers`
Creator configures subscription tiers with pricing.

```typescript
// Example: 3 tiers (Bronze $5, Silver $10, Gold $25)
const tierNames = ["Bronze", "Silver", "Gold"];
const tierPrices = [5_000_000_000, 10_000_000_000, 25_000_000_000]; // in MIST
const tierDurations = [2_592_000_000, 2_592_000_000, 2_592_000_000]; // 30 days

await tx.moveCall({
  target: `${PACKAGE_ID}::subscription::create_tiers`,
  arguments: [
    tx.pure(tierNames),
    tx.pure(tierPrices),
    tx.pure(tierDurations),
  ],
});
```

#### `purchase_subscription`
Fan purchases a subscription NFT.

```typescript
const [coin] = tx.splitCoins(tx.gas, [tx.pure(10_000_000_000)]); // 10 SUI

tx.moveCall({
  target: `${PACKAGE_ID}::subscription::purchase_subscription`,
  arguments: [
    tx.object(SUBSCRIPTIONS_ID),
    tx.object(TREASURY_ID),
    tx.pure(2), // Silver tier
    coin,
    tx.object('0x6'), // Clock
  ],
});
```

**Payment Flow**:
1. Total payment: 10 SUI
2. Platform fee (5%): 0.5 SUI → Treasury
3. Creator receives: 9.5 SUI
4. Fan receives: SubscriptionNFT (expires in 30 days)

#### `renew_subscription`
Extends expiry of existing NFT.

#### `is_active`
Checks if subscription is currently valid (not expired).

```move
public fun is_active(nft: &SubscriptionNFT, clock: &Clock): bool {
    clock::timestamp_ms(clock) < nft.expires_at
}
```

---

## Module 3: Content

### Purpose
Manages content posts with Walrus storage references and tier-based access control.

### Key Structs

```move
public struct ContentPost has key, store {
    id: UID,
    creator: address,
    title: String,
    description: String,
    content_type: u8,             // 0=text, 1=image, 2=video, 3=audio, 4=file
    walrus_blob_id: String,       // Walrus storage reference
    seal_policy_id: Option<String>, // Seal encryption policy
    required_tier: u8,            // 0=public, 1=bronze, 2=silver, 3=gold
    created_at: u64,
    likes: u64,
    views: u64,
    is_published: bool,
}
```

### Main Functions

#### `create_registry`
Creator initializes their content registry (one-time setup).

#### `create_post`
Publishes a new post with Walrus storage reference.

```typescript
tx.moveCall({
  target: `${PACKAGE_ID}::content::create_post`,
  arguments: [
    tx.object(REGISTRY_ID),
    tx.pure("My First Post"),
    tx.pure("This is an amazing artwork!"),
    tx.pure(1), // IMAGE type
    tx.pure("walrus_blob_id_123"),
    tx.pure(2), // SILVER tier required
    tx.object('0x6'), // Clock
  ],
});
```

#### `record_view`
Increments view count (called when user accesses content).

#### `like_post`
Fan likes a post (creates LikeRecord to prevent double-liking).

#### `can_access_tier`
Checks if a user tier level can access the post.

```move
public fun can_access_tier(post: &ContentPost, user_tier: u8): bool {
    if (post.required_tier == TIER_PUBLIC) {
        true
    } else {
        user_tier >= post.required_tier
    }
}
```

---

## Testing

### Build All Contracts

```bash
cd backend

# Build each module
sui move build -p move/creator_profile
sui move build -p move/subscription
sui move build -p move/content
```

### Run Tests

```bash
# Test creator_profile
sui move test -p move/creator_profile

# Test subscription
sui move test -p move/subscription

# Test content
sui move test -p move/content
```

### Expected Output
```
Running Move unit tests
[ PASS    ] creator_profile::creator_profile_tests::test_create_profile
[ PASS    ] creator_profile::creator_profile_tests::test_update_profile
[ PASS    ] creator_profile::creator_profile_tests::test_link_suins
...
Test result: OK. Total tests: 12; passed: 12; failed: 0
```

---

## Deployment

### Deploy to Testnet

```bash
# 1. Deploy creator_profile
sui client publish --gas-budget 100000000 move/creator_profile

# 2. Deploy subscription
sui client publish --gas-budget 100000000 move/subscription

# 3. Deploy content
sui client publish --gas-budget 100000000 move/content

# Save package IDs
echo "CREATOR_PACKAGE_ID=0x..." >> ../frontend/.env
echo "SUBSCRIPTION_PACKAGE_ID=0x..." >> ../frontend/.env
echo "CONTENT_PACKAGE_ID=0x..." >> ../frontend/.env
```

### Post-Deployment Setup

```bash
# 1. Creator creates profile
sui client call \
  --package $CREATOR_PACKAGE_ID \
  --module creator_profile \
  --function create_profile \
  --args $REGISTRY_ID "Alice" "Artist" "avatar_blob" "banner_blob" "Art" 0x6 \
  --gas-budget 10000000

# 2. Creator sets up subscription tiers
sui client call \
  --package $SUBSCRIPTION_PACKAGE_ID \
  --module subscription \
  --function create_tiers \
  --args '["Bronze","Silver","Gold"]' '[5000000000,10000000000,25000000000]' '[2592000000,2592000000,2592000000]' \
  --gas-budget 10000000

# 3. Creator creates content registry
sui client call \
  --package $CONTENT_PACKAGE_ID \
  --module content \
  --function create_registry \
  --gas-budget 10000000
```

---

## Integration Flow

### Complete User Journey

#### Creator Setup
1. Call `creator_profile::create_profile` with Walrus blob IDs
2. Call `subscription::create_tiers` to configure pricing
3. Call `content::create_registry` to initialize content storage
4. Upload media to Walrus → Get blob_id
5. Call `content::create_post` with blob_id and tier requirement

#### Fan Subscription
1. Fan browses creator profiles (query on-chain)
2. Fan selects tier and clicks "Subscribe"
3. Frontend calls `subscription::purchase_subscription`
4. Smart contract:
   - Validates payment
   - Splits fees (97% creator, 5% platform)
   - Mints SubscriptionNFT
   - Transfers NFT to fan
5. Fan now owns access NFT in their wallet

#### Content Access
1. Fan clicks on premium post
2. Frontend queries: Does fan own SubscriptionNFT for this creator?
3. If yes: Check `subscription::is_active(nft, clock)`
4. If active: Check `content::can_access_tier(post, nft.tier_id)`
5. If authorized: Show Walrus content via `getWalrusUrl(blob_id)`
6. Else: Show paywall with subscription tiers

---

## Security Considerations

### Access Control
- **Owner checks**: All mutative functions verify `ctx.sender() == owner`
- **NFT verification**: Content access requires valid, non-expired NFT
- **Immutable refs**: Most getters use immutable references

### Payment Safety
- **Exact amounts**: Payment validation ensures no underpayment
- **Excess refunds**: Any overpayment is returned to sender
- **Atomic transfers**: Coin splits and transfers happen atomically

### Object Model
- **Shared objects**: Registries and posts are shared for read access
- **Owned objects**: Profiles and NFTs are owned by users
- **No reentrancy**: Sui's object model prevents reentrancy attacks

---

## Gas Optimization

### Estimated Gas Costs (Testnet)

| Operation | Gas (MIST) | Gas (SUI) |
|-----------|------------|-----------|
| Create Profile | ~2,000,000 | 0.002 |
| Create Tiers | ~3,000,000 | 0.003 |
| Purchase Subscription | ~5,000,000 | 0.005 |
| Create Post | ~3,000,000 | 0.003 |
| Record View | ~500,000 | 0.0005 |
| Like Post | ~1,000,000 | 0.001 |

**Total creator onboarding**: ~0.008 SUI  
**Total fan subscription**: ~0.006 SUI

---

## Future Enhancements

### V1.1
- [ ] Add subscription auto-renewal
- [ ] Implement revenue sharing with collaborators
- [ ] Add post scheduling (publish_at timestamp)
- [ ] Support bundle pricing (3 months at discount)

### V1.2
- [ ] Marketplace for P2P NFT trading
- [ ] Referral system (affiliate rewards)
- [ ] Creator verification badges
- [ ] Multi-token payments (USDC, USDT)

### V2.0
- [ ] DAO governance for platform fee
- [ ] Staking for premium features
- [ ] Cross-chain subscriptions (bridge to other chains)

---

## Error Codes Reference

### creator_profile
- `ENotOwner (0)`: Caller is not the profile owner
- `EEmptyDisplayName (1)`: Display name cannot be empty
- `EEmptyBio (2)`: Bio cannot be empty
- `EEmptyWalrusId (3)`: Walrus blob ID cannot be empty
- `EEmptyCategory (4)`: Category cannot be empty

### subscription
- `ENotOwner (0)`: Caller is not authorized
- `EInvalidTierCount (1)`: Invalid number of tiers (must be 1-5)
- `EInsufficientPayment (2)`: Payment amount too low
- `ETierNotFound (3)`: Requested tier doesn't exist
- `ENotSubscriber (4)`: Caller doesn't own the NFT
- `ESubscriptionExpired (5)`: NFT has expired
- `EInvalidTierId (6)`: Tier ID is invalid
- `EEmptyTierName (7)`: Tier name cannot be empty
- `EInvalidPrice (8)`: Price must be > 0
- `EInvalidDuration (9)`: Duration must be > 0

### content
- `ENotCreator (0)`: Caller is not the content creator
- `EEmptyTitle (1)`: Title cannot be empty
- `EEmptyWalrusId (2)`: Walrus blob ID cannot be empty
- `EInvalidContentType (3)`: Content type out of range
- `EInvalidTier (4)`: Tier level out of range
- `EPostNotPublished (5)`: Post is not published yet
- `EAlreadyLiked (6)`: User already liked this post

---

## Support

- **Sui Docs**: https://docs.sui.io
- **Move Language**: https://move-language.github.io/move/
- **Discord**: https://discord.gg/sui
- **Issues**: GitHub Issues (to be added)

---

## License

MIT License - See LICENSE file for details
