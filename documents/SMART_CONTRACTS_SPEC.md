# Smart Contracts Specification

## Overview
All smart contracts built with Sui Move, leveraging object model for composability and security.

---

## 1. Creator Profile Module

**File**: `backend/move/creator_profile/sources/creator_profile.move`

### Structs

```rust
module auriya::creator_profile {
    use sui::coin::{Self, Coin};
    use sui::sui::SUI;
    use std::string::{String};
    
    /// Creator profile object
    public struct CreatorProfile has key, store {
        id: UID,
        owner: address,
        suins_name: Option<String>,
        display_name: String,
        bio: String,
        avatar_walrus_id: String,
        banner_walrus_id: String,
        social_links: vector<String>,
        category: String,
        created_at: u64,
        total_subscribers: u64,
        total_revenue_mist: u64,
        verified: bool,
    }
    
    /// Event emitted when profile created
    public struct ProfileCreated has copy, drop {
        profile_id: ID,
        owner: address,
        suins_name: Option<String>,
    }
    
    /// Event emitted when profile updated
    public struct ProfileUpdated has copy, drop {
        profile_id: ID,
    }
}
```

### Key Functions

```rust
/// Create new creator profile
public entry fun create_profile(
    display_name: String,
    bio: String,
    avatar_walrus_id: String,
    banner_walrus_id: String,
    category: String,
    clock: &Clock,
    ctx: &mut TxContext
) {
    let profile = CreatorProfile {
        id: object::new(ctx),
        owner: ctx.sender(),
        suins_name: option::none(),
        display_name,
        bio,
        avatar_walrus_id,
        banner_walrus_id,
        social_links: vector::empty(),
        category,
        created_at: clock.timestamp_ms(),
        total_subscribers: 0,
        total_revenue_mist: 0,
        verified: false,
    };
    
    let profile_id = object::id(&profile);
    
    event::emit(ProfileCreated {
        profile_id,
        owner: ctx.sender(),
        suins_name: option::none(),
    });
    
    transfer::transfer(profile, ctx.sender());
}

/// Update profile metadata
public entry fun update_profile(
    profile: &mut CreatorProfile,
    display_name: String,
    bio: String,
    avatar_walrus_id: String,
    banner_walrus_id: String,
    ctx: &TxContext
) {
    assert!(profile.owner == ctx.sender(), ENotOwner);
    
    profile.display_name = display_name;
    profile.bio = bio;
    profile.avatar_walrus_id = avatar_walrus_id;
    profile.banner_walrus_id = banner_walrus_id;
    
    event::emit(ProfileUpdated {
        profile_id: object::id(profile),
    });
}

/// Link SuiNS name
public entry fun link_suins(
    profile: &mut CreatorProfile,
    suins_name: String,
    ctx: &TxContext
) {
    assert!(profile.owner == ctx.sender(), ENotOwner);
    profile.suins_name = option::some(suins_name);
}

/// Public view functions
public fun get_owner(profile: &CreatorProfile): address { profile.owner }
public fun get_display_name(profile: &CreatorProfile): String { profile.display_name }
public fun get_total_subscribers(profile: &CreatorProfile): u64 { profile.total_subscribers }
```

---

## 2. Subscription Module

**File**: `backend/move/subscription/sources/subscription.move`

### Structs

```rust
module auriya::subscription {
    use sui::coin::{Self, Coin};
    use sui::sui::SUI;
    use sui::clock::{Self, Clock};
    use std::string::{String};
    use auriya::creator_profile::{Self, CreatorProfile};
    
    /// Subscription tier configuration
    public struct SubscriptionTier has store, copy, drop {
        tier_id: u8,              // 1=Bronze, 2=Silver, 3=Gold
        name: String,
        price_mist: u64,          // Price in MIST (1 SUI = 1B MIST)
        duration_ms: u64,         // Duration in milliseconds
        benefits: vector<String>,
    }
    
    /// Creator's subscription offerings
    public struct CreatorSubscriptions has key {
        id: UID,
        creator: address,
        profile_id: ID,
        tiers: vector<SubscriptionTier>,
        active_count: u64,
        platform_fee_bps: u64,    // Basis points (500 = 5%)
    }
    
    /// Subscription NFT (access token)
    public struct SubscriptionNFT has key, store {
        id: UID,
        creator: address,
        subscriber: address,
        tier_id: u8,
        tier_name: String,
        purchased_at: u64,
        expires_at: u64,
        auto_renew: bool,
    }
    
    /// Events
    public struct TiersCreated has copy, drop {
        subscription_id: ID,
        creator: address,
        tier_count: u64,
    }
    
    public struct SubscriptionPurchased has copy, drop {
        nft_id: ID,
        creator: address,
        subscriber: address,
        tier_id: u8,
        price_mist: u64,
        expires_at: u64,
    }
    
    public struct SubscriptionRenewed has copy, drop {
        nft_id: ID,
        new_expiry: u64,
    }
}
```

### Key Functions

```rust
/// Creator initializes subscription tiers
public entry fun create_tiers(
    profile: &CreatorProfile,
    tier_names: vector<String>,
    tier_prices: vector<u64>,
    tier_durations: vector<u64>,
    ctx: &mut TxContext
) {
    assert!(creator_profile::get_owner(profile) == ctx.sender(), ENotOwner);
    assert!(vector::length(&tier_names) == vector::length(&tier_prices), EInvalidTiers);
    
    let mut tiers = vector::empty<SubscriptionTier>();
    let mut i = 0;
    let len = vector::length(&tier_names);
    
    while (i < len) {
        let tier = SubscriptionTier {
            tier_id: (i as u8) + 1,
            name: *vector::borrow(&tier_names, i),
            price_mist: *vector::borrow(&tier_prices, i),
            duration_ms: *vector::borrow(&tier_durations, i),
            benefits: vector::empty(),
        };
        vector::push_back(&mut tiers, tier);
        i = i + 1;
    };
    
    let subs = CreatorSubscriptions {
        id: object::new(ctx),
        creator: ctx.sender(),
        profile_id: object::id(profile),
        tiers,
        active_count: 0,
        platform_fee_bps: 500,  // 5% platform fee
    };
    
    let sub_id = object::id(&subs);
    
    event::emit(TiersCreated {
        subscription_id: sub_id,
        creator: ctx.sender(),
        tier_count: len,
    });
    
    transfer::share_object(subs);
}

/// Fan purchases subscription
public entry fun purchase_subscription(
    subs: &mut CreatorSubscriptions,
    tier_id: u8,
    mut payment: Coin<SUI>,
    clock: &Clock,
    ctx: &mut TxContext
) {
    // Find tier
    let tier = get_tier(subs, tier_id);
    assert!(coin::value(&payment) >= tier.price_mist, EInsufficientPayment);
    
    // Calculate fees
    let total = tier.price_mist;
    let platform_fee = (total * subs.platform_fee_bps) / 10000;
    let creator_amount = total - platform_fee;
    
    // Split payment
    let platform_coin = coin::split(&mut payment, platform_fee, ctx);
    let creator_coin = coin::split(&mut payment, creator_amount, ctx);
    
    // Transfer to creator
    transfer::public_transfer(creator_coin, subs.creator);
    
    // Transfer platform fee (for now, to creator - can be treasury later)
    transfer::public_transfer(platform_coin, subs.creator);
    
    // Return excess
    if (coin::value(&payment) > 0) {
        transfer::public_transfer(payment, ctx.sender());
    } else {
        coin::destroy_zero(payment);
    };
    
    // Mint NFT
    let current_time = clock.timestamp_ms();
    let expires_at = current_time + tier.duration_ms;
    
    let nft = SubscriptionNFT {
        id: object::new(ctx),
        creator: subs.creator,
        subscriber: ctx.sender(),
        tier_id,
        tier_name: tier.name,
        purchased_at: current_time,
        expires_at,
        auto_renew: false,
    };
    
    let nft_id = object::id(&nft);
    
    subs.active_count = subs.active_count + 1;
    
    event::emit(SubscriptionPurchased {
        nft_id,
        creator: subs.creator,
        subscriber: ctx.sender(),
        tier_id,
        price_mist: total,
        expires_at,
    });
    
    transfer::transfer(nft, ctx.sender());
}

/// Check if subscription is active
public fun is_active(nft: &SubscriptionNFT, clock: &Clock): bool {
    clock.timestamp_ms() < nft.expires_at
}

/// Renew subscription
public entry fun renew_subscription(
    subs: &CreatorSubscriptions,
    nft: &mut SubscriptionNFT,
    mut payment: Coin<SUI>,
    clock: &Clock,
    ctx: &mut TxContext
) {
    assert!(nft.subscriber == ctx.sender(), ENotSubscriber);
    
    let tier = get_tier(subs, nft.tier_id);
    assert!(coin::value(&payment) >= tier.price_mist, EInsufficientPayment);
    
    // Process payment (same as purchase)
    let total = tier.price_mist;
    let platform_fee = (total * subs.platform_fee_bps) / 10000;
    let creator_amount = total - platform_fee;
    
    let platform_coin = coin::split(&mut payment, platform_fee, ctx);
    let creator_coin = coin::split(&mut payment, creator_amount, ctx);
    
    transfer::public_transfer(creator_coin, subs.creator);
    transfer::public_transfer(platform_coin, subs.creator);
    
    if (coin::value(&payment) > 0) {
        transfer::public_transfer(payment, ctx.sender());
    } else {
        coin::destroy_zero(payment);
    };
    
    // Extend expiry
    let current_time = clock.timestamp_ms();
    if (current_time > nft.expires_at) {
        // Expired - start from now
        nft.expires_at = current_time + tier.duration_ms;
    } else {
        // Active - extend from current expiry
        nft.expires_at = nft.expires_at + tier.duration_ms;
    };
    
    event::emit(SubscriptionRenewed {
        nft_id: object::id(nft),
        new_expiry: nft.expires_at,
    });
}

/// Helper to get tier
fun get_tier(subs: &CreatorSubscriptions, tier_id: u8): &SubscriptionTier {
    let mut i = 0;
    let len = vector::length(&subs.tiers);
    while (i < len) {
        let tier = vector::borrow(&subs.tiers, i);
        if (tier.tier_id == tier_id) {
            return tier
        };
        i = i + 1;
    };
    abort ETierNotFound
}

// Error codes
const ENotOwner: u64 = 0;
const EInvalidTiers: u64 = 1;
const EInsufficientPayment: u64 = 2;
const ETierNotFound: u64 = 3;
const ENotSubscriber: u64 = 4;
```

---

## 3. Content Module

**File**: `backend/move/content/sources/content.move`

### Structs & Functions

```rust
module auriya::content {
    use sui::clock::{Self, Clock};
    use std::string::{String};
    use auriya::subscription::{Self, SubscriptionNFT};
    
    /// Content types
    const CONTENT_TYPE_TEXT: u8 = 0;
    const CONTENT_TYPE_IMAGE: u8 = 1;
    const CONTENT_TYPE_VIDEO: u8 = 2;
    const CONTENT_TYPE_FILE: u8 = 3;
    
    /// Content post
    public struct ContentPost has key, store {
        id: UID,
        creator: address,
        title: String,
        description: String,
        content_type: u8,
        walrus_blob_id: String,        // Walrus storage reference
        seal_policy_id: Option<String>, // Seal encryption policy
        required_tier: u8,              // Minimum tier (0 = public)
        created_at: u64,
        likes: u64,
        views: u64,
        is_public: bool,
    }
    
    /// Creator's content registry
    public struct ContentRegistry has key {
        id: UID,
        creator: address,
        post_ids: vector<ID>,
        post_count: u64,
    }
    
    /// Events
    public struct PostCreated has copy, drop {
        post_id: ID,
        creator: address,
        required_tier: u8,
    }
    
    public struct PostAccessed has copy, drop {
        post_id: ID,
        accessor: address,
    }
}
```

```rust
/// Create new post
public entry fun create_post(
    registry: &mut ContentRegistry,
    title: String,
    description: String,
    content_type: u8,
    walrus_blob_id: String,
    seal_policy_id: Option<String>,
    required_tier: u8,
    clock: &Clock,
    ctx: &mut TxContext
) {
    assert!(registry.creator == ctx.sender(), ENotOwner);
    
    let post = ContentPost {
        id: object::new(ctx),
        creator: ctx.sender(),
        title,
        description,
        content_type,
        walrus_blob_id,
        seal_policy_id,
        required_tier,
        created_at: clock.timestamp_ms(),
        likes: 0,
        views: 0,
        is_public: required_tier == 0,
    };
    
    let post_id = object::id(&post);
    vector::push_back(&mut registry.post_ids, post_id);
    registry.post_count = registry.post_count + 1;
    
    event::emit(PostCreated {
        post_id,
        creator: ctx.sender(),
        required_tier,
    });
    
    transfer::share_object(post);
}

/// Verify user can access post
public fun can_access(
    post: &ContentPost,
    nft: &SubscriptionNFT,
    clock: &Clock
): bool {
    if (post.is_public) {
        return true
    };
    
    // Check: same creator, tier sufficient, NFT active
    post.creator == subscription::get_creator(nft) &&
    subscription::get_tier_id(nft) >= post.required_tier &&
    subscription::is_active(nft, clock)
}

/// Record view
public entry fun record_view(
    post: &mut ContentPost,
    nft: &SubscriptionNFT,
    clock: &Clock,
    ctx: &TxContext
) {
    assert!(can_access(post, nft, clock), EAccessDenied);
    post.views = post.views + 1;
    
    event::emit(PostAccessed {
        post_id: object::id(post),
        accessor: ctx.sender(),
    });
}
```
