// Copyright (c) Auriya
// SPDX-License-Identifier: MIT

#[test_only]
module content::content_tests {
    use content::content::{Self, ContentRegistry, ContentPost};
    use sui::test_scenario;
    use sui::clock;
    use std::string;
    
    #[test]
    fun test_create_registry() {
        let creator = @0xCAFE;
        let mut scenario = test_scenario::begin(creator);
        
        // Create registry
        {
            content::create_registry(test_scenario::ctx(&mut scenario));
        };
        
        // Verify registry
        test_scenario::next_tx(&mut scenario, creator);
        {
            let registry = test_scenario::take_shared<ContentRegistry>(&scenario);
            assert!(content::get_post_count(&registry) == 0, 0);
            assert!(content::get_total_views(&registry) == 0, 1);
            assert!(content::get_total_likes(&registry) == 0, 2);
            test_scenario::return_shared(registry);
        };
        
        test_scenario::end(scenario);
    }
    
    #[test]
    fun test_create_post() {
        let creator = @0xCAFE;
        let mut scenario = test_scenario::begin(creator);
        
        // Create registry
        {
            content::create_registry(test_scenario::ctx(&mut scenario));
        };
        
        // Create post
        test_scenario::next_tx(&mut scenario, creator);
        {
            let mut registry = test_scenario::take_shared<ContentRegistry>(&scenario);
            let clock = clock::create_for_testing(test_scenario::ctx(&mut scenario));
            
            content::create_post(
                &mut registry,
                string::utf8(b"My First Post"),
                string::utf8(b"This is an amazing post"),
                1, // IMAGE
                string::utf8(b"walrus_blob_id_123"),
                2, // SILVER tier
                &clock,
                test_scenario::ctx(&mut scenario)
            );
            
            assert!(content::get_post_count(&registry) == 1, 0);
            
            clock::destroy_for_testing(clock);
            test_scenario::return_shared(registry);
        };
        
        // Verify post
        test_scenario::next_tx(&mut scenario, creator);
        {
            let post = test_scenario::take_shared<ContentPost>(&scenario);
            
            assert!(content::get_creator(&post) == creator, 0);
            assert!(content::get_title(&post) == string::utf8(b"My First Post"), 1);
            assert!(content::get_walrus_blob_id(&post) == string::utf8(b"walrus_blob_id_123"), 2);
            assert!(content::get_required_tier(&post) == 2, 3);
            assert!(content::get_content_type(&post) == 1, 4);
            assert!(content::get_views(&post) == 0, 5);
            assert!(content::get_likes(&post) == 0, 6);
            assert!(content::is_published(&post), 7);
            
            test_scenario::return_shared(post);
        };
        
        test_scenario::end(scenario);
    }
    
    #[test]
    fun test_update_post() {
        let creator = @0xCAFE;
        let mut scenario = test_scenario::begin(creator);
        
        // Setup
        {
            content::create_registry(test_scenario::ctx(&mut scenario));
        };
        
        test_scenario::next_tx(&mut scenario, creator);
        {
            let mut registry = test_scenario::take_shared<ContentRegistry>(&scenario);
            let clock = clock::create_for_testing(test_scenario::ctx(&mut scenario));
            
            content::create_post(
                &mut registry,
                string::utf8(b"Original Title"),
                string::utf8(b"Original description"),
                1,
                string::utf8(b"blob_id"),
                1,
                &clock,
                test_scenario::ctx(&mut scenario)
            );
            
            clock::destroy_for_testing(clock);
            test_scenario::return_shared(registry);
        };
        
        // Update post
        test_scenario::next_tx(&mut scenario, creator);
        {
            let mut post = test_scenario::take_shared<ContentPost>(&scenario);
            let clock = clock::create_for_testing(test_scenario::ctx(&mut scenario));
            
            content::update_post(
                &mut post,
                string::utf8(b"Updated Title"),
                string::utf8(b"Updated description"),
                2,
                &clock,
                test_scenario::ctx(&mut scenario)
            );
            
            assert!(content::get_title(&post) == string::utf8(b"Updated Title"), 0);
            assert!(content::get_description(&post) == string::utf8(b"Updated description"), 1);
            assert!(content::get_required_tier(&post) == 2, 2);
            
            clock::destroy_for_testing(clock);
            test_scenario::return_shared(post);
        };
        
        test_scenario::end(scenario);
    }
    
    #[test]
    fun test_record_view() {
        let creator = @0xCAFE;
        let viewer = @0xVIEW;
        let mut scenario = test_scenario::begin(creator);
        
        // Setup
        {
            content::create_registry(test_scenario::ctx(&mut scenario));
        };
        
        test_scenario::next_tx(&mut scenario, creator);
        {
            let mut registry = test_scenario::take_shared<ContentRegistry>(&scenario);
            let clock = clock::create_for_testing(test_scenario::ctx(&mut scenario));
            
            content::create_post(
                &mut registry,
                string::utf8(b"Post"),
                string::utf8(b"Description"),
                1,
                string::utf8(b"blob"),
                0, // Public
                &clock,
                test_scenario::ctx(&mut scenario)
            );
            
            clock::destroy_for_testing(clock);
            test_scenario::return_shared(registry);
        };
        
        // Record view
        test_scenario::next_tx(&mut scenario, viewer);
        {
            let mut post = test_scenario::take_shared<ContentPost>(&scenario);
            let mut registry = test_scenario::take_shared<ContentRegistry>(&scenario);
            let clock = clock::create_for_testing(test_scenario::ctx(&mut scenario));
            
            assert!(content::get_views(&post) == 0, 0);
            
            content::record_view(
                &mut post,
                &mut registry,
                &clock,
                test_scenario::ctx(&mut scenario)
            );
            
            assert!(content::get_views(&post) == 1, 1);
            assert!(content::get_total_views(&registry) == 1, 2);
            
            clock::destroy_for_testing(clock);
            test_scenario::return_shared(post);
            test_scenario::return_shared(registry);
        };
        
        test_scenario::end(scenario);
    }
    
    #[test]
    fun test_like_post() {
        let creator = @0xCAFE;
        let liker = @0xLIKE;
        let mut scenario = test_scenario::begin(creator);
        
        // Setup
        {
            content::create_registry(test_scenario::ctx(&mut scenario));
        };
        
        test_scenario::next_tx(&mut scenario, creator);
        {
            let mut registry = test_scenario::take_shared<ContentRegistry>(&scenario);
            let clock = clock::create_for_testing(test_scenario::ctx(&mut scenario));
            
            content::create_post(
                &mut registry,
                string::utf8(b"Post"),
                string::utf8(b"Description"),
                1,
                string::utf8(b"blob"),
                0,
                &clock,
                test_scenario::ctx(&mut scenario)
            );
            
            clock::destroy_for_testing(clock);
            test_scenario::return_shared(registry);
        };
        
        // Like post
        test_scenario::next_tx(&mut scenario, liker);
        {
            let mut post = test_scenario::take_shared<ContentPost>(&scenario);
            let mut registry = test_scenario::take_shared<ContentRegistry>(&scenario);
            let clock = clock::create_for_testing(test_scenario::ctx(&mut scenario));
            
            assert!(content::get_likes(&post) == 0, 0);
            
            content::like_post(
                &mut post,
                &mut registry,
                &clock,
                test_scenario::ctx(&mut scenario)
            );
            
            assert!(content::get_likes(&post) == 1, 1);
            assert!(content::get_total_likes(&registry) == 1, 2);
            
            clock::destroy_for_testing(clock);
            test_scenario::return_shared(post);
            test_scenario::return_shared(registry);
        };
        
        test_scenario::end(scenario);
    }
    
    #[test]
    fun test_can_access_tier() {
        let creator = @0xCAFE;
        let mut scenario = test_scenario::begin(creator);
        
        // Setup
        {
            content::create_registry(test_scenario::ctx(&mut scenario));
        };
        
        test_scenario::next_tx(&mut scenario, creator);
        {
            let mut registry = test_scenario::take_shared<ContentRegistry>(&scenario);
            let clock = clock::create_for_testing(test_scenario::ctx(&mut scenario));
            
            content::create_post(
                &mut registry,
                string::utf8(b"Post"),
                string::utf8(b"Description"),
                1,
                string::utf8(b"blob"),
                2, // SILVER tier required
                &clock,
                test_scenario::ctx(&mut scenario)
            );
            
            clock::destroy_for_testing(clock);
            test_scenario::return_shared(registry);
        };
        
        // Test access
        test_scenario::next_tx(&mut scenario, creator);
        {
            let post = test_scenario::take_shared<ContentPost>(&scenario);
            
            // Bronze tier (1) should NOT have access to Silver (2) content
            assert!(!content::can_access_tier(&post, 1), 0);
            
            // Silver tier (2) should have access
            assert!(content::can_access_tier(&post, 2), 1);
            
            // Gold tier (3) should have access
            assert!(content::can_access_tier(&post, 3), 2);
            
            test_scenario::return_shared(post);
        };
        
        test_scenario::end(scenario);
    }
    
    #[test]
    fun test_add_tag() {
        let creator = @0xCAFE;
        let mut scenario = test_scenario::begin(creator);
        
        // Setup
        {
            content::create_registry(test_scenario::ctx(&mut scenario));
        };
        
        test_scenario::next_tx(&mut scenario, creator);
        {
            let mut registry = test_scenario::take_shared<ContentRegistry>(&scenario);
            let clock = clock::create_for_testing(test_scenario::ctx(&mut scenario));
            
            content::create_post(
                &mut registry,
                string::utf8(b"Post"),
                string::utf8(b"Description"),
                1,
                string::utf8(b"blob"),
                0,
                &clock,
                test_scenario::ctx(&mut scenario)
            );
            
            clock::destroy_for_testing(clock);
            test_scenario::return_shared(registry);
        };
        
        // Add tags
        test_scenario::next_tx(&mut scenario, creator);
        {
            let mut post = test_scenario::take_shared<ContentPost>(&scenario);
            
            content::add_tag(&mut post, string::utf8(b"art"), test_scenario::ctx(&mut scenario));
            content::add_tag(&mut post, string::utf8(b"digital"), test_scenario::ctx(&mut scenario));
            
            test_scenario::return_shared(post);
        };
        
        test_scenario::end(scenario);
    }
}
