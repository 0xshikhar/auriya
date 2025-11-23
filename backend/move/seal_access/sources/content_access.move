// Copyright (c) Auriya
// SPDX-License-Identifier: MIT

/// Module: seal_access
/// Seal-based access control for encrypted content
/// Used by Seal key servers to verify subscription NFT ownership before decryption
module seal_access::content_access {
    use sui::object::{Self, UID, ID};
    use sui::tx_context::{Self, TxContext};
    use sui::transfer;
    use sui::event;
    use sui::clock::{Self, Clock};
    use subscription::subscription::{Self, SubscriptionNFT};
    
    // === Errors ===
    
    const EInsufficientTier: u64 = 0;
    const ESubscriptionCancelled: u64 = 1;
    const EWrongCreator: u64 = 2;
    const ESubscriptionExpired: u64 = 3;
    
    // === Structs ===
    
    /// Access policy for encrypted content
    /// This is checked by Seal key servers before releasing decryption keys
    public struct AccessPolicy has key, store {
        id: UID,
        creator: address,
        content_id: ID,
        required_tier: u8,
        created_at: u64,
    }
    
    // Subscription NFT type is imported from `subscription::subscription::SubscriptionNFT`
    
    // === Events ===
    
    public struct PolicyCreated has copy, drop {
        policy_id: ID,
        creator: address,
        content_id: ID,
        required_tier: u8,
    }
    
    public struct AccessGranted has copy, drop {
        policy_id: ID,
        subscriber: address,
        tier_level: u8,
    }
    
    public struct AccessDenied has copy, drop {
        policy_id: ID,
        subscriber: address,
        reason: u64,
    }
    
    // === Public Entry Functions ===
    
    /// Create an access policy for encrypted content
    public entry fun create_policy(
        creator: address,
        content_id: ID,
        required_tier: u8,
        created_at: u64,
        ctx: &mut TxContext
    ) {
        let policy = AccessPolicy {
            id: object::new(ctx),
            creator,
            content_id,
            required_tier,
            created_at,
        };
        
        let policy_id = object::id(&policy);
        
        event::emit(PolicyCreated {
            policy_id,
            creator,
            content_id,
            required_tier,
        });
        
        transfer::share_object(policy);
    }
    
    // === Seal Access Control Functions ===
    
    /// Returns true if `prefix` is a prefix of `word`
    /// Used to validate encryption IDs match the policy object ID pattern
    fun is_prefix(prefix: vector<u8>, word: vector<u8>): bool {
        if (prefix.length() > word.length()) {
            return false
        };
        
        let mut i = 0;
        while (i < prefix.length()) {
            if (prefix[i] != word[i]) {
                return false
            };
            i = i + 1;
        };
        
        true
    }
    
    /// Seal-compatible access approval function
    /// Called by Seal key servers to verify access before releasing decryption keys
    /// Must accept subscription NFT as proof of access
    /// CRITICAL: Validates that encryption ID starts with policy.id bytes (Seal requirement)
    public fun seal_approve(
        id: vector<u8>,
        policy: &AccessPolicy,
        subscription_nft: &SubscriptionNFT,
        c: &Clock,
        ctx: &TxContext
    ) {
        // Verify subscription grants access to this policy
        assert!(subscription::get_creator(subscription_nft) == policy.creator, EWrongCreator);
        // Expiry check: subscription must be active
        assert!(clock::timestamp_ms(c) < subscription::get_expires_at(subscription_nft), ESubscriptionExpired);
        assert!(subscription::get_tier_id(subscription_nft) >= policy.required_tier, EInsufficientTier);
        
        // CRITICAL: Verify encryption ID has the right prefix (policy.id bytes)
        // This is required by Seal key servers - encryption IDs must be: [policy_id_bytes] + [nonce]
        assert!(is_prefix(object::uid_to_bytes(&policy.id), id), EInsufficientTier);
        
        // Emit access granted event
        event::emit(AccessGranted {
            policy_id: object::id(policy),
            subscriber: tx_context::sender(ctx),
            tier_level: subscription::get_tier_id(subscription_nft),
        });
    }
    
    // === Public View Functions ===
    
    /// Check if a subscription NFT grants access to content
    /// This is called by Seal key servers during decryption
    /// Returns true if access is granted, false otherwise
    public fun can_access(
        policy: &AccessPolicy,
        subscription_nft: &SubscriptionNFT,
        c: &Clock,
        ctx: &TxContext
    ): bool {
        let subscriber = tx_context::sender(ctx);
        
        // Check 1: Subscription must be for the same creator
        if (subscription::get_creator(subscription_nft) != policy.creator) {
            event::emit(AccessDenied {
                policy_id: object::id(policy),
                subscriber,
                reason: EWrongCreator,
            });
            return false
        };
        
        // Check 2: Subscription must not be cancelled
        // (no explicit is_cancelled flag in real NFT)
        
        // Check 3: Subscription tier must be sufficient
        if (subscription::get_tier_id(subscription_nft) < policy.required_tier) {
            event::emit(AccessDenied {
                policy_id: object::id(policy),
                subscriber,
                reason: EInsufficientTier,
            });
            return false
        };
        
        // Check 4: Subscription must not be expired
        if (!(clock::timestamp_ms(c) < subscription::get_expires_at(subscription_nft))) {
            event::emit(AccessDenied {
                policy_id: object::id(policy),
                subscriber,
                reason: ESubscriptionExpired,
            });
            return false
        };
        
        // All checks passed - grant access
        event::emit(AccessGranted {
            policy_id: object::id(policy),
            subscriber,
            tier_level: subscription::get_tier_id(subscription_nft),
        });
        
        true
    }
    
    // === Getter Functions ===
    
    public fun get_creator(policy: &AccessPolicy): address {
        policy.creator
    }
    
    public fun get_content_id(policy: &AccessPolicy): ID {
        policy.content_id
    }
    
    public fun get_required_tier(policy: &AccessPolicy): u8 {
        policy.required_tier
    }
}
