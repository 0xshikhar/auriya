// Copyright (c) Auriya
// SPDX-License-Identifier: MIT

/// Module: creator_profile
/// Manages creator identities and metadata on Auriya platform
module creator_profile::creator_profile {
    use sui::object::{Self, UID, ID};
    use sui::tx_context::{Self, TxContext};
    use sui::transfer;
    use sui::clock::{Self, Clock};
    use std::string::{Self, String};
    use std::option::{Self, Option};
    use sui::event;
    
    // === Structs ===
    
    /// Creator profile object containing all creator metadata
    public struct CreatorProfile has key, store {
        id: UID,
        owner: address,
        suins_name: Option<String>,
        display_name: String,
        bio: String,
        avatar_walrus_id: String,      // Walrus blob ID for avatar
        banner_walrus_id: String,       // Walrus blob ID for banner
        social_links: vector<String>,
        category: String,               // Art, Music, Writing, etc.
        content_registry_id: Option<ID>, // Optional link to ContentRegistry
        created_at: u64,                // Unix timestamp in milliseconds
        total_subscribers: u64,
        total_revenue_mist: u64,        // Total revenue in MIST (1 SUI = 1B MIST)
        verified: bool,
    }
    
    /// Global registry tracking all profiles
    public struct ProfileRegistry has key {
        id: UID,
        profile_count: u64,
    }
    
    // === Events ===
    
    /// Emitted when a new creator profile is created
    public struct ProfileCreated has copy, drop {
        profile_id: ID,
        owner: address,
        display_name: String,
        timestamp: u64,
    }
    
    /// Emitted when a profile is updated
    public struct ProfileUpdated has copy, drop {
        profile_id: ID,
        timestamp: u64,
    }
    
    /// Emitted when SuiNS name is linked
    public struct SuiNSLinked has copy, drop {
        profile_id: ID,
        suins_name: String,
    }
    
    /// Emitted when social link is added
    public struct SocialLinkAdded has copy, drop {
        profile_id: ID,
        link: String,
    }
    
    // === Error Codes ===
    
    const ENotOwner: u64 = 0;
    const EEmptyDisplayName: u64 = 1;
    const EEmptyBio: u64 = 2;
    const EEmptyWalrusId: u64 = 3;
    const EEmptyCategory: u64 = 4;
    
    // === Init Function ===
    
    /// Initialize the module by creating a shared ProfileRegistry
    fun init(ctx: &mut TxContext) {
        let registry = ProfileRegistry {
            id: object::new(ctx),
            profile_count: 0,
        };
        transfer::share_object(registry);
    }
    
    // === Public Entry Functions ===
    
    /// Create a new creator profile
    public fun create_profile(
        registry: &mut ProfileRegistry,
        display_name: String,
        bio: String,
        avatar_walrus_id: String,
        banner_walrus_id: String,
        category: String,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        assert!(!string::is_empty(&display_name), EEmptyDisplayName);
        assert!(!string::is_empty(&bio), EEmptyBio);
        assert!(!string::is_empty(&avatar_walrus_id), EEmptyWalrusId);
        assert!(!string::is_empty(&banner_walrus_id), EEmptyWalrusId);
        assert!(!string::is_empty(&category), EEmptyCategory);
        
        let display_name_copy = copy display_name;

        let profile = CreatorProfile {
            id: object::new(ctx),
            owner: tx_context::sender(ctx),
            suins_name: option::none(),
            display_name,
            bio,
            avatar_walrus_id,
            banner_walrus_id,
            social_links: vector::empty(),
            category,
            content_registry_id: option::none(),
            created_at: clock::timestamp_ms(clock),
            total_subscribers: 0,
            total_revenue_mist: 0,
            verified: false,
        };
        
        let profile_id = object::id(&profile);
        let timestamp = clock::timestamp_ms(clock);
        
        event::emit(ProfileCreated {
            profile_id,
            owner: tx_context::sender(ctx),
            display_name: display_name_copy,
            timestamp,
        });
        
        registry.profile_count = registry.profile_count + 1;
        
        transfer::transfer(profile, tx_context::sender(ctx));
    }
    
    /// Update profile metadata
    public fun update_profile(
        profile: &mut CreatorProfile,
        display_name: String,
        bio: String,
        avatar_walrus_id: String,
        banner_walrus_id: String,
        category: String,
        clock: &Clock,
        ctx: &TxContext
    ) {
        assert!(profile.owner == tx_context::sender(ctx), ENotOwner);
        assert!(!string::is_empty(&display_name), EEmptyDisplayName);
        assert!(!string::is_empty(&bio), EEmptyBio);
        
        profile.display_name = display_name;
        profile.bio = bio;
        profile.avatar_walrus_id = avatar_walrus_id;
        profile.banner_walrus_id = banner_walrus_id;
        profile.category = category;
        
        event::emit(ProfileUpdated {
            profile_id: object::id(profile),
            timestamp: clock::timestamp_ms(clock),
        });
    }
    
    /// Link a SuiNS name to the profile
    public fun link_suins(
        profile: &mut CreatorProfile,
        suins_name: String,
        ctx: &TxContext
    ) {
        assert!(profile.owner == tx_context::sender(ctx), ENotOwner);
        let suins_copy = copy suins_name;
        profile.suins_name = option::some(suins_name);
        
        event::emit(SuiNSLinked {
            profile_id: object::id(profile),
            suins_name: suins_copy,
   });
    }
    
    /// Add a social media link
    public fun add_social_link(
        profile: &mut CreatorProfile,
        link: String,
        ctx: &TxContext
    ) {
        assert!(profile.owner == tx_context::sender(ctx), ENotOwner);
        vector::push_back(&mut profile.social_links, link);
        
        event::emit(SocialLinkAdded {
            profile_id: object::id(profile),
            link,
        });
    }
    
    /// Link a content registry to the profile
    public fun link_content_registry(
        profile: &mut CreatorProfile,
        registry_id: ID,
        ctx: &TxContext
    ) {
        assert!(profile.owner == tx_context::sender(ctx), ENotOwner);
        profile.content_registry_id = option::some(registry_id);
    }
    
    // === Public Mutative Functions (For Cross-Module Access) ===
    
    /// Increment subscriber count (called by subscription module)
    public fun increment_subscribers(profile: &mut CreatorProfile) {
        profile.total_subscribers = profile.total_subscribers + 1;
    }
    
    /// Decrement subscriber count (called when subscription ends)
    public fun decrement_subscribers(profile: &mut CreatorProfile) {
        if (profile.total_subscribers > 0) {
            profile.total_subscribers = profile.total_subscribers - 1;
        }
    }
    
    /// Add revenue to total (called by subscription module on payment)
    public fun add_revenue(profile: &mut CreatorProfile, amount_mist: u64) {
        profile.total_revenue_mist = profile.total_revenue_mist + amount_mist;
    }
    
    // === Public View Functions ===
    
    public fun get_owner(profile: &CreatorProfile): address {
        profile.owner
    }
    
    public fun get_display_name(profile: &CreatorProfile): String {
        profile.display_name
    }
    
    public fun get_bio(profile: &CreatorProfile): String {
        profile.bio
    }
    
    public fun get_avatar_walrus_id(profile: &CreatorProfile): String {
        profile.avatar_walrus_id
    }
    
    public fun get_banner_walrus_id(profile: &CreatorProfile): String {
        profile.banner_walrus_id
    }
    
    public fun get_category(profile: &CreatorProfile): String {
        profile.category
    }
    
    public fun get_created_at(profile: &CreatorProfile): u64 {
        profile.created_at
    }
    
    public fun get_total_subscribers(profile: &CreatorProfile): u64 {
        profile.total_subscribers
    }
    
    public fun get_total_revenue_mist(profile: &CreatorProfile): u64 {
        profile.total_revenue_mist
    }
    
    public fun is_verified(profile: &CreatorProfile): bool {
        profile.verified
    }
    
    public fun get_suins_name(profile: &CreatorProfile): Option<String> {
        profile.suins_name
    }
    
    public fun get_social_links(profile: &CreatorProfile): &vector<String> {
        &profile.social_links
    }
    
    public fun get_content_registry_id(profile: &CreatorProfile): Option<ID> {
        profile.content_registry_id
    }
    
    // === Test-Only Functions ===
    
    #[test_only]
    public fun init_for_testing(ctx: &mut TxContext) {
        init(ctx);
    }
    
    #[test_only]
    public fun get_profile_count(registry: &ProfileRegistry): u64 {
        registry.profile_count
    }
}
