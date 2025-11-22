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
    
    // === Errors ===
    
    const EInsufficientTier: u8 = 0;
    const ESubscriptionCancelled: u8 = 1;
    const EWrongCreator: u8 = 2;
    const ESubscriptionExpired: u8 = 3;
    
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
    
    /// Simplified subscription NFT reference
    /// In production, import from subscription package
    public struct SubscriptionNFT has key, store {
        id: UID,
        creator: address,
        subscriber: address,
        tier_level: u8,
        is_cancelled: bool,
        expires_at: u64,
    }
    
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
        reason: u8,
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
    
    // === Public View Functions ===
    
    /// Check if a subscription NFT grants access to content
    /// This is called by Seal key servers during decryption
    /// Returns true if access is granted, false otherwise
    public fun can_access(
        policy: &AccessPolicy,
        subscription_nft: &SubscriptionNFT,
        ctx: &TxContext
    ): bool {
        let subscriber = tx_context::sender(ctx);
        
        // Check 1: Subscription must be for the same creator
        if (subscription_nft.creator != policy.creator) {
            event::emit(AccessDenied {
                policy_id: object::id(policy),
                subscriber,
                reason: EWrongCreator,
            });
            return false
        };
        
        // Check 2: Subscription must not be cancelled
        if (subscription_nft.is_cancelled) {
            event::emit(AccessDenied {
                policy_id: object::id(policy),
                subscriber,
                reason: ESubscriptionCancelled,
            });
            return false
        };
        
        // Check 3: Subscription tier must be sufficient
        if (subscription_nft.tier_level < policy.required_tier) {
            event::emit(AccessDenied {
                policy_id: object::id(policy),
                subscriber,
                reason: EInsufficientTier,
            });
            return false
        };
        
        // Check 4: Subscription must not be expired (if expiry is set)
        // Note: expires_at = 0 means no expiry
        // if (subscription_nft.expires_at > 0 && subscription_nft.expires_at < current_time) {
        //     event::emit(AccessDenied {
        //         policy_id: object::id(policy),
        //         subscriber,
        //         reason: ESubscriptionExpired,
        //     });
        //     return false
        // };
        
        // All checks passed - grant access
        event::emit(AccessGranted {
            policy_id: object::id(policy),
            subscriber,
            tier_level: subscription_nft.tier_level,
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
