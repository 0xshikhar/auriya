// Copyright (c) Auriya
// SPDX-License-Identifier: MIT

/// Module: subscription
/// Manages subscription tiers and NFT-based access control
module subscription::subscription {
    use sui::object::{Self, UID, ID};
    use sui::tx_context::{Self, TxContext};
    use sui::transfer;
    use sui::coin::{Self, Coin};
    use sui::sui::SUI;
    use sui::clock::{Self, Clock};
    use sui::event;
    use std::string::{Self, String};
    use std::vector;
    
    // === Constants ===
    
    const MIST_PER_SUI: u64 = 1_000_000_000;
    const BASIS_POINTS_TOTAL: u64 = 10000;
    const DEFAULT_PLATFORM_FEE_BPS: u64 = 500; // 5%
    const ONE_MONTH_MS: u64 = 2_592_000_000; // 30 days in milliseconds
    
    // === Structs ===
    
    /// Subscription tier configuration
    public struct SubscriptionTier has store, copy, drop {
        tier_id: u8,
        name: String,
        price_mist: u64,
        duration_ms: u64,
        benefits: vector<String>,
    }
    
    /// Creator's subscription offerings (shared object)
    public struct CreatorSubscriptions has key {
        id: UID,
        creator: address,
        tiers: vector<SubscriptionTier>,
        active_subscriber_count: u64,
        total_revenue_mist: u64,
        platform_fee_bps: u64,
    }
    
    /// Subscription NFT (transferable access token)
    public struct SubscriptionNFT has key, store {
        id: UID,
        creator: address,
        subscriber: address,
        tier_id: u8,
        purchased_at: u64,
        expires_at: u64,
        auto_renew: bool,
    }
    
    /// Platform treasury for fees (shared object)
    public struct PlatformTreasury has key {
        id: UID,
        owner: address,
        total_fees_collected: u64,
    }
    
    // === Events ===
    
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
        amount_paid: u64,
    }
    
    public struct SubscriptionCancelled has copy, drop {
        nft_id: ID,
        subscriber: address,
    }
    
    // === Error Codes ===
    
    const ENotOwner: u64 = 0;
    const EInvalidTierCount: u64 = 1;
    const EInsufficientPayment: u64 = 2;
    const ETierNotFound: u64 = 3;
    const ENotSubscriber: u64 = 4;
    const ESubscriptionExpired: u64 = 5;
    const EInvalidTierId: u64 = 6;
    const EEmptyTierName: u64 = 7;
    const EInvalidPrice: u64 = 8;
    const EInvalidDuration: u64 = 9;
    
    // === Init Function ===
    
    fun init(ctx: &mut TxContext) {
        let treasury = PlatformTreasury {
            id: object::new(ctx),
            owner: tx_context::sender(ctx),
            total_fees_collected: 0,
        };
        transfer::share_object(treasury);
    }
    
    // === Public Entry Functions ===
    
    /// Creator creates subscription tiers
    public entry fun create_tiers(
        tier_names: vector<String>,
        tier_prices_mist: vector<u64>,
        tier_durations_ms: vector<u64>,
        ctx: &mut TxContext
    ) {
        let tier_count = vector::length(&tier_names);
        assert!(tier_count > 0 && tier_count <= 5, EInvalidTierCount);
        assert!(tier_count == vector::length(&tier_prices_mist), EInvalidTierCount);
        assert!(tier_count == vector::length(&tier_durations_ms), EInvalidTierCount);
        
        let mut tiers = vector::empty<SubscriptionTier>();
        let mut i = 0;
        
        while (i < tier_count) {
            let name = *vector::borrow(&tier_names, i);
            let price = *vector::borrow(&tier_prices_mist, i);
            let duration = *vector::borrow(&tier_durations_ms, i);
            
            assert!(!string::is_empty(&name), EEmptyTierName);
            assert!(price > 0, EInvalidPrice);
            assert!(duration > 0, EInvalidDuration);
            
            let tier = SubscriptionTier {
                tier_id: ((i + 1) as u8),
                name,
                price_mist: price,
                duration_ms: duration,
                benefits: vector::empty(),
            };
            
            vector::push_back(&mut tiers, tier);
            i = i + 1;
        };
        
        let subs = CreatorSubscriptions {
            id: object::new(ctx),
            creator: tx_context::sender(ctx),
            tiers,
            active_subscriber_count: 0,
            total_revenue_mist: 0,
            platform_fee_bps: DEFAULT_PLATFORM_FEE_BPS,
        };
        
        let sub_id = object::id(&subs);
        
        event::emit(TiersCreated {
            subscription_id: sub_id,
            creator: tx_context::sender(ctx),
            tier_count,
        });
        
        transfer::share_object(subs);
    }
    
    /// Fan purchases subscription
    public entry fun purchase_subscription(
        subs: &mut CreatorSubscriptions,
        treasury: &mut PlatformTreasury,
        tier_id: u8,
        mut payment: Coin<SUI>,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        // Validate tier exists
        assert!(tier_id > 0, EInvalidTierId);
        let tier = get_tier(subs, tier_id);
        let price_mist = tier.price_mist;
        let duration_ms = tier.duration_ms;
        
        // Verify payment amount
        let payment_amount = coin::value(&payment);
        assert!(payment_amount >= price_mist, EInsufficientPayment);
        
        // Calculate fees
        let platform_fee = (price_mist * subs.platform_fee_bps) / BASIS_POINTS_TOTAL;
        let creator_amount = price_mist - platform_fee;
        
        // Split payment
        let platform_coin = coin::split(&mut payment, platform_fee, ctx);
        let creator_coin = coin::split(&mut payment, creator_amount, ctx);
        
        // Transfer to creator
        transfer::public_transfer(creator_coin, subs.creator);
        
        // Add to treasury: move platform fee coin to treasury owner and account fees
        transfer::public_transfer(platform_coin, treasury.owner);
        treasury.total_fees_collected = treasury.total_fees_collected + platform_fee;
        
        // Return excess payment
        if (coin::value(&payment) > 0) {
            transfer::public_transfer(payment, tx_context::sender(ctx));
        } else {
            coin::destroy_zero(payment);
        };
        
        // Calculate expiry
        let current_time = clock::timestamp_ms(clock);
        let expires_at = current_time + duration_ms;
        
        // Mint NFT
        let nft = SubscriptionNFT {
            id: object::new(ctx),
            creator: subs.creator,
            subscriber: tx_context::sender(ctx),
            tier_id,
            purchased_at: current_time,
            expires_at,
            auto_renew: false,
        };
        
        let nft_id = object::id(&nft);
        
        // Update stats
        subs.active_subscriber_count = subs.active_subscriber_count + 1;
        subs.total_revenue_mist = subs.total_revenue_mist + price_mist;
        
        event::emit(SubscriptionPurchased {
            nft_id,
            creator: subs.creator,
            subscriber: tx_context::sender(ctx),
            tier_id,
            price_mist: price_mist,
            expires_at,
        });
        
        transfer::transfer(nft, tx_context::sender(ctx));
    }
    
    /// Renew an existing subscription
    public entry fun renew_subscription(
        subs: &CreatorSubscriptions,
        treasury: &mut PlatformTreasury,
        nft: &mut SubscriptionNFT,
        mut payment: Coin<SUI>,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        assert!(nft.subscriber == tx_context::sender(ctx), ENotSubscriber);
        assert!(nft.creator == subs.creator, ENotOwner);
        
        let tier = get_tier(subs, nft.tier_id);
        let price_mist = tier.price_mist;
        let duration_ms = tier.duration_ms;
        assert!(coin::value(&payment) >= price_mist, EInsufficientPayment);
        
        // Process payment (same as purchase)
        let platform_fee = (price_mist * subs.platform_fee_bps) / BASIS_POINTS_TOTAL;
        let creator_amount = price_mist - platform_fee;
        
        let platform_coin = coin::split(&mut payment, platform_fee, ctx);
        let creator_coin = coin::split(&mut payment, creator_amount, ctx);
        
        transfer::public_transfer(creator_coin, subs.creator);
        
        transfer::public_transfer(platform_coin, treasury.owner);
        treasury.total_fees_collected = treasury.total_fees_collected + platform_fee;
        
        if (coin::value(&payment) > 0) {
            transfer::public_transfer(payment, tx_context::sender(ctx));
        } else {
            coin::destroy_zero(payment);
        };
        
        // Extend expiry
        let current_time = clock::timestamp_ms(clock);
        if (current_time > nft.expires_at) {
            // Expired - start from now
            nft.expires_at = current_time + duration_ms;
        } else {
            // Active - extend from current expiry
            nft.expires_at = nft.expires_at + duration_ms;
        };
        
        event::emit(SubscriptionRenewed {
            nft_id: object::id(nft),
            new_expiry: nft.expires_at,
            amount_paid: price_mist,
        });
    }
    
    /// Cancel subscription (NFT still exists but won't auto-renew)
    public entry fun cancel_subscription(
        nft: &mut SubscriptionNFT,
        ctx: &TxContext
    ) {
        assert!(nft.subscriber == tx_context::sender(ctx), ENotSubscriber);
        nft.auto_renew = false;
        
        event::emit(SubscriptionCancelled {
            nft_id: object::id(nft),
            subscriber: tx_context::sender(ctx),
        });
    }
    
    // === Public View Functions ===
    
    /// Check if subscription NFT is currently active
    public fun is_active(nft: &SubscriptionNFT, clock: &Clock): bool {
        clock::timestamp_ms(clock) < nft.expires_at
    }
    
    /// Get tier by ID
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
    
    // === NFT Getters ===
    
    public fun get_creator(nft: &SubscriptionNFT): address {
        nft.creator
    }
    
    public fun get_subscriber(nft: &SubscriptionNFT): address {
        nft.subscriber
    }
    
    public fun get_tier_id(nft: &SubscriptionNFT): u8 {
        nft.tier_id
    }
    
    public fun get_expires_at(nft: &SubscriptionNFT): u64 {
        nft.expires_at
    }
    
    public fun get_purchased_at(nft: &SubscriptionNFT): u64 {
        nft.purchased_at
    }
    
    // === Test Functions ===
    
    #[test_only]
    public fun init_for_testing(ctx: &mut TxContext) {
        init(ctx);
    }
    
    #[test_only]
    public fun get_active_count(subs: &CreatorSubscriptions): u64 {
        subs.active_subscriber_count
    }
    
    #[test_only]
    public fun get_total_revenue(subs: &CreatorSubscriptions): u64 {
        subs.total_revenue_mist
    }
}
