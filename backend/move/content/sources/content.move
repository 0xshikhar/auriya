// Copyright (c) Auriya
// SPDX-License-Identifier: MIT

/// Module: content
/// Manages creator content posts with tier-based access control
module content::content {
    use sui::object::{Self, UID, ID};
    use sui::tx_context::{Self, TxContext};
    use sui::transfer;
    use sui::clock::{Self, Clock};
    use sui::event;
    use std::string::{Self, String};
    use std::option::{Self, Option};
    use std::vector;
    
    // === Constants ===
    
    /// Content types
    const CONTENT_TYPE_TEXT: u8 = 0;
    const CONTENT_TYPE_IMAGE: u8 = 1;
    const CONTENT_TYPE_VIDEO: u8 = 2;
    const CONTENT_TYPE_AUDIO: u8 = 3;
    const CONTENT_TYPE_FILE: u8 = 4;
    
    /// Access tiers
    const TIER_PUBLIC: u8 = 0;
    const TIER_BRONZE: u8 = 1;
    const TIER_SILVER: u8 = 2;
    const TIER_GOLD: u8 = 3;
    
    // === Structs ===
    
    /// Content post object
    public struct ContentPost has key, store {
        id: UID,
        creator: address,
        title: String,
        description: String,
        content_type: u8,
        walrus_blob_id: String,           // Walrus storage reference
        seal_policy_id: Option<String>,   // Optional Seal encryption policy
        required_tier: u8,                // Minimum tier to access (0 = public)
        created_at: u64,
        updated_at: u64,
        likes: u64,
        views: u64,
        is_published: bool,
        tags: vector<String>,
    }
    
    /// Creator's content registry (shared object)
    public struct ContentRegistry has key {
        id: UID,
        creator: address,
        post_ids: vector<ID>,
        post_count: u64,
        total_views: u64,
        total_likes: u64,
    }
    
    /// Like record to prevent double-liking
    public struct LikeRecord has key {
        id: UID,
        post_id: ID,
        liker: address,
        timestamp: u64,
    }
    
    // === Events ===
    
    public struct RegistryCreated has copy, drop {
        registry_id: ID,
        creator: address,
    }
    
    public struct PostCreated has copy, drop {
        post_id: ID,
        creator: address,
        title: String,
        required_tier: u8,
        is_public: bool,
        timestamp: u64,
    }
    
    public struct PostUpdated has copy, drop {
        post_id: ID,
        timestamp: u64,
    }
    
    public struct PostPublished has copy, drop {
        post_id: ID,
        timestamp: u64,
    }
    
    public struct PostViewed has copy, drop {
        post_id: ID,
        viewer: address,
        timestamp: u64,
    }
    
    public struct PostLiked has copy, drop {
        post_id: ID,
        liker: address,
        timestamp: u64,
    }
    
    // === Error Codes ===
    
    const ENotCreator: u64 = 0;
    const EEmptyTitle: u64 = 1;
    const EEmptyWalrusId: u64 = 2;
    const EInvalidContentType: u64 = 3;
    const EInvalidTier: u64 = 4;
    const EPostNotPublished: u64 = 5;
    const EAlreadyLiked: u64 = 6;
    
    // === Init Function ===
    
    fun init(_ctx: &mut TxContext) {
        // No global state needed
    }
    
    // === Public Entry Functions ===
    
    /// Create content registry for a creator
    public entry fun create_registry(ctx: &mut TxContext) {
        let registry = ContentRegistry {
            id: object::new(ctx),
            creator: tx_context::sender(ctx),
            post_ids: vector::empty(),
            post_count: 0,
            total_views: 0,
            total_likes: 0,
        };
        
        let registry_id = object::id(&registry);
        
        event::emit(RegistryCreated {
            registry_id,
            creator: tx_context::sender(ctx),
        });
        
        transfer::share_object(registry);
    }
    
    /// Create a new content post
    public entry fun create_post(
        registry: &mut ContentRegistry,
        title: String,
        description: String,
        content_type: u8,
        walrus_blob_id: String,
        required_tier: u8,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        assert!(registry.creator == tx_context::sender(ctx), ENotCreator);
        assert!(!string::is_empty(&title), EEmptyTitle);
        assert!(!string::is_empty(&walrus_blob_id), EEmptyWalrusId);
        assert!(content_type <= CONTENT_TYPE_FILE, EInvalidContentType);
        assert!(required_tier <= TIER_GOLD, EInvalidTier);
        
        let current_time = clock::timestamp_ms(clock);
        let is_public = required_tier == TIER_PUBLIC;
        
        let post = ContentPost {
            id: object::new(ctx),
            creator: tx_context::sender(ctx),
            title,
            description,
            content_type,
            walrus_blob_id,
            seal_policy_id: option::none(),
            required_tier,
            created_at: current_time,
            updated_at: current_time,
            likes: 0,
            views: 0,
            is_published: true,  // Auto-publish for now
            tags: vector::empty(),
        };
        
        let post_id = object::id(&post);
        
        // Add to registry
        vector::push_back(&mut registry.post_ids, post_id);
        registry.post_count = registry.post_count + 1;
        
        event::emit(PostCreated {
            post_id,
            creator: tx_context::sender(ctx),
            title: post.title,
            required_tier,
            is_public,
            timestamp: current_time,
        });
        
        transfer::share_object(post);
    }
    
    /// Update post metadata
    public entry fun update_post(
        post: &mut ContentPost,
        title: String,
        description: String,
        required_tier: u8,
        clock: &Clock,
        ctx: &TxContext
    ) {
        assert!(post.creator == tx_context::sender(ctx), ENotCreator);
        assert!(!string::is_empty(&title), EEmptyTitle);
        assert!(required_tier <= TIER_GOLD, EInvalidTier);
        
        post.title = title;
        post.description = description;
        post.required_tier = required_tier;
        post.updated_at = clock::timestamp_ms(clock);
        
        event::emit(PostUpdated {
            post_id: object::id(post),
            timestamp: clock::timestamp_ms(clock),
        });
    }
    
    /// Add Seal encryption policy ID
    public entry fun set_seal_policy(
        post: &mut ContentPost,
        seal_policy_id: String,
        ctx: &TxContext
    ) {
        assert!(post.creator == tx_context::sender(ctx), ENotCreator);
        post.seal_policy_id = option::some(seal_policy_id);
    }
    
    /// Add tags to post
    public entry fun add_tag(
        post: &mut ContentPost,
        tag: String,
        ctx: &TxContext
    ) {
        assert!(post.creator == tx_context::sender(ctx), ENotCreator);
        vector::push_back(&mut post.tags, tag);
    }
    
    /// Record a view (can be called by anyone who can access the post)
    public entry fun record_view(
        post: &mut ContentPost,
        registry: &mut ContentRegistry,
        clock: &Clock,
        ctx: &TxContext
    ) {
        assert!(post.is_published, EPostNotPublished);
        
        post.views = post.views + 1;
        registry.total_views = registry.total_views + 1;
        
        event::emit(PostViewed {
            post_id: object::id(post),
            viewer: tx_context::sender(ctx),
            timestamp: clock::timestamp_ms(clock),
        });
    }
    
    /// Like a post
    public entry fun like_post(
        post: &mut ContentPost,
        registry: &mut ContentRegistry,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        assert!(post.is_published, EPostNotPublished);
        
        // Create like record to prevent double-liking
        let like_record = LikeRecord {
            id: object::new(ctx),
            post_id: object::id(post),
            liker: tx_context::sender(ctx),
            timestamp: clock::timestamp_ms(clock),
        };
        
        post.likes = post.likes + 1;
        registry.total_likes = registry.total_likes + 1;
        
        event::emit(PostLiked {
            post_id: object::id(post),
            liker: tx_context::sender(ctx),
            timestamp: clock::timestamp_ms(clock),
        });
        
        transfer::transfer(like_record, tx_context::sender(ctx));
    }
    
    /// Publish/unpublish post
    public entry fun set_published(
        post: &mut ContentPost,
        is_published: bool,
        clock: &Clock,
        ctx: &TxContext
    ) {
        assert!(post.creator == tx_context::sender(ctx), ENotCreator);
        post.is_published = is_published;
        
        if (is_published) {
            event::emit(PostPublished {
                post_id: object::id(post),
                timestamp: clock::timestamp_ms(clock),
            });
        };
    }
    
    // === Public View Functions ===
    
    /// Check if a user can access the post based on tier
    /// Note: In production, this should verify SubscriptionNFT ownership
    /// For now, it's a simple tier check that can be called off-chain
    public fun can_access_tier(post: &ContentPost, user_tier: u8): bool {
        if (post.required_tier == TIER_PUBLIC) {
            true
        } else {
            user_tier >= post.required_tier
        }
    }
    
    /// Get post details
    public fun get_creator(post: &ContentPost): address {
        post.creator
    }
    
    public fun get_title(post: &ContentPost): String {
        post.title
    }
    
    public fun get_description(post: &ContentPost): String {
        post.description
    }
    
    public fun get_walrus_blob_id(post: &ContentPost): String {
        post.walrus_blob_id
    }
    
    public fun get_required_tier(post: &ContentPost): u8 {
        post.required_tier
    }
    
    public fun get_content_type(post: &ContentPost): u8 {
        post.content_type
    }
    
    public fun get_likes(post: &ContentPost): u64 {
        post.likes
    }
    
    public fun get_views(post: &ContentPost): u64 {
        post.views
    }
    
    public fun is_published(post: &ContentPost): bool {
        post.is_published
    }
    
    public fun get_created_at(post: &ContentPost): u64 {
        post.created_at
    }
    
    public fun get_seal_policy_id(post: &ContentPost): Option<String> {
        post.seal_policy_id
    }
    
    // === Registry Getters ===
    
    public fun get_post_count(registry: &ContentRegistry): u64 {
        registry.post_count
    }
    
    public fun get_total_views(registry: &ContentRegistry): u64 {
        registry.total_views
    }
    
    public fun get_total_likes(registry: &ContentRegistry): u64 {
        registry.total_likes
    }
    
    // === Test Functions ===
    
    #[test_only]
    public fun init_for_testing(ctx: &mut TxContext) {
        init(ctx);
    }
    
    #[test_only]
    public fun get_post_ids(registry: &ContentRegistry): &vector<ID> {
        &registry.post_ids
    }
}
