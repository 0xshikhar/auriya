// Copyright (c) Auriya
// SPDX-License-Identifier: MIT

/// Module: creator_landing
/// Manages creator landing page configurations stored on Walrus
/// 
/// Architecture:
/// - Landing page JSON data stored on Walrus (decentralized storage)
/// - Walrus blob ID stored on-chain (lightweight, verifiable reference)
/// - Images stored on Walrus via separate uploads
module creator_profile::creator_landing {
    use sui::object::{Self, UID, ID};
    use sui::tx_context::{Self, TxContext};
    use sui::transfer;
    use sui::clock::{Self, Clock};
    use std::string::String;
    use sui::event;
    
    // === Structs ===
    
    /// Landing page configuration reference
    /// Stores Walrus blob ID pointing to full landing page JSON
    public struct LandingPageConfig has key, store {
        id: UID,
        creator_address: address,
        creator_profile_id: ID,
        
        // Walrus blob ID containing the full landing page JSON
        walrus_blob_id: String,
        
        // Metadata
        is_published: bool,
        version: u64,
        created_at: u64,
        updated_at: u64,
    }
    
    /// Global registry tracking all landing pages
    public struct LandingPageRegistry has key {
        id: UID,
        total_pages: u64,
    }
    
    // === Events ===
    
    /// Emitted when a landing page is created
    public struct LandingPageCreated has copy, drop {
        config_id: ID,
        creator_address: address,
        walrus_blob_id: String,
        timestamp: u64,
    }
    
    /// Emitted when a landing page is updated
    public struct LandingPageUpdated has copy, drop {
        config_id: ID,
        walrus_blob_id: String,
        version: u64,
        timestamp: u64,
    }
    
    /// Emitted when a landing page is published
    public struct LandingPagePublished has copy, drop {
        config_id: ID,
        creator_address: address,
        timestamp: u64,
    }
    
    /// Emitted when a landing page is unpublished
    public struct LandingPageUnpublished has copy, drop {
        config_id: ID,
        timestamp: u64,
    }
    
    // === Error Codes ===
    
    const ENotOwner: u64 = 0;
    const EEmptyBlobId: u64 = 1;
    const EAlreadyPublished: u64 = 2;
    const ENotPublished: u64 = 3;
    
    // === Init Function ===
    
    /// Initialize the module by creating a shared LandingPageRegistry
    fun init(ctx: &mut TxContext) {
        let registry = LandingPageRegistry {
            id: object::new(ctx),
            total_pages: 0,
        };
        transfer::share_object(registry);
    }
    
    // === Public Entry Functions ===
    
    /// Create a new landing page configuration
    /// walrus_blob_id: Walrus blob ID containing the landing page JSON
    public fun create_landing_page(
        registry: &mut LandingPageRegistry,
        creator_profile_id: ID,
        walrus_blob_id: String,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        assert!(!std::string::is_empty(&walrus_blob_id), EEmptyBlobId);
        
        let timestamp = clock::timestamp_ms(clock);
        let creator_address = tx_context::sender(ctx);
        
        let config = LandingPageConfig {
            id: object::new(ctx),
            creator_address,
            creator_profile_id,
            walrus_blob_id: copy walrus_blob_id,
            is_published: false,
            version: 1,
            created_at: timestamp,
            updated_at: timestamp,
        };
        
        let config_id = object::id(&config);
        
        event::emit(LandingPageCreated {
            config_id,
            creator_address,
            walrus_blob_id,
            timestamp,
        });
        
        registry.total_pages = registry.total_pages + 1;
        
        transfer::transfer(config, creator_address);
    }
    
    /// Update landing page configuration with new Walrus blob
    public fun update_landing_page(
        config: &mut LandingPageConfig,
        walrus_blob_id: String,
        clock: &Clock,
        ctx: &TxContext
    ) {
        assert!(config.creator_address == tx_context::sender(ctx), ENotOwner);
        assert!(!std::string::is_empty(&walrus_blob_id), EEmptyBlobId);
        
        let timestamp = clock::timestamp_ms(clock);
        
        config.walrus_blob_id = walrus_blob_id;
        config.version = config.version + 1;
        config.updated_at = timestamp;
        
        event::emit(LandingPageUpdated {
            config_id: object::id(config),
            walrus_blob_id: config.walrus_blob_id,
            version: config.version,
            timestamp,
        });
    }
    
    /// Publish landing page (make it publicly visible)
    public fun publish_landing_page(
        config: &mut LandingPageConfig,
        clock: &Clock,
        ctx: &TxContext
    ) {
        assert!(config.creator_address == tx_context::sender(ctx), ENotOwner);
        
        config.is_published = true;
        config.updated_at = clock::timestamp_ms(clock);
        
        event::emit(LandingPagePublished {
            config_id: object::id(config),
            creator_address: config.creator_address,
            timestamp: clock::timestamp_ms(clock),
        });
    }
    
    /// Unpublish landing page
    public fun unpublish_landing_page(
        config: &mut LandingPageConfig,
        clock: &Clock,
        ctx: &TxContext
    ) {
        assert!(config.creator_address == tx_context::sender(ctx), ENotOwner);
        
        config.is_published = false;
        config.updated_at = clock::timestamp_ms(clock);
        
        event::emit(LandingPageUnpublished {
            config_id: object::id(config),
            timestamp: clock::timestamp_ms(clock),
        });
    }
    
    // === Public View Functions ===
    
    public fun get_creator_address(config: &LandingPageConfig): address {
        config.creator_address
    }
    
    public fun get_walrus_blob_id(config: &LandingPageConfig): String {
        config.walrus_blob_id
    }
    
    public fun is_published(config: &LandingPageConfig): bool {
        config.is_published
    }
    
    public fun get_version(config: &LandingPageConfig): u64 {
        config.version
    }
    
    public fun get_created_at(config: &LandingPageConfig): u64 {
        config.created_at
    }
    
    public fun get_updated_at(config: &LandingPageConfig): u64 {
        config.updated_at
    }
    
    public fun get_creator_profile_id(config: &LandingPageConfig): ID {
        config.creator_profile_id
    }
    
    // === Test-Only Functions ===
    
    #[test_only]
    public fun init_for_testing(ctx: &mut TxContext) {
        init(ctx);
    }
    
    #[test_only]
    public fun get_total_pages(registry: &LandingPageRegistry): u64 {
        registry.total_pages
    }
}
