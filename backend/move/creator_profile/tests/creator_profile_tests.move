// Copyright (c) Auriya
// SPDX-License-Identifier: MIT

#[test_only]
module creator_profile::creator_profile_tests {
    use creator_profile::creator_profile::{Self, CreatorProfile, ProfileRegistry};
    use sui::test_scenario;
    use sui::clock;
    use std::string;
    use std::option;
    
    #[test]
    fun test_create_profile() {
        let creator = @0xCAFE;
        let mut scenario = test_scenario::begin(creator);
        
        // Initialize module
        {
            creator_profile::init_for_testing(test_scenario::ctx(&mut scenario));
        };
        
        // Create profile
        test_scenario::next_tx(&mut scenario, creator);
        {
            let mut registry = test_scenario::take_shared<ProfileRegistry>(&scenario);
            let clock = clock::create_for_testing(test_scenario::ctx(&mut scenario));
            
            creator_profile::create_profile(
                &mut registry,
                string::utf8(b"Alice Creator"),
                string::utf8(b"Digital artist creating amazing art"),
                string::utf8(b"avatar_walrus_id_123"),
                string::utf8(b"banner_walrus_id_456"),
                string::utf8(b"Art"),
                &clock,
                test_scenario::ctx(&mut scenario)
            );
            
            assert!(creator_profile::get_profile_count(&registry) == 1, 0);
            
            clock::destroy_for_testing(clock);
            test_scenario::return_shared(registry);
        };
        
        // Verify profile
        test_scenario::next_tx(&mut scenario, creator);
        {
            let profile = test_scenario::take_from_sender<CreatorProfile>(&scenario);
            
            assert!(creator_profile::get_owner(&profile) == creator, 1);
            assert!(creator_profile::get_display_name(&profile) == string::utf8(b"Alice Creator"), 2);
            assert!(creator_profile::get_bio(&profile) == string::utf8(b"Digital artist creating amazing art"), 3);
            assert!(creator_profile::get_avatar_walrus_id(&profile) == string::utf8(b"avatar_walrus_id_123"), 4);
            assert!(creator_profile::get_category(&profile) == string::utf8(b"Art"), 5);
            assert!(creator_profile::get_total_subscribers(&profile) == 0, 6);
            assert!(creator_profile::get_total_revenue_mist(&profile) == 0, 7);
            assert!(!creator_profile::is_verified(&profile), 8);
            
            test_scenario::return_to_sender(&scenario, profile);
        };
        
        test_scenario::end(scenario);
    }
    
    #[test]
    fun test_update_profile() {
        let creator = @0xCAFE;
        let mut scenario = test_scenario::begin(creator);
        
        // Initialize and create profile
        {
            creator_profile::init_for_testing(test_scenario::ctx(&mut scenario));
        };
        
        test_scenario::next_tx(&mut scenario, creator);
        {
            let mut registry = test_scenario::take_shared<ProfileRegistry>(&scenario);
            let clock = clock::create_for_testing(test_scenario::ctx(&mut scenario));
            
            creator_profile::create_profile(
                &mut registry,
                string::utf8(b"Alice"),
                string::utf8(b"Bio 1"),
                string::utf8(b"avatar1"),
                string::utf8(b"banner1"),
                string::utf8(b"Art"),
                &clock,
                test_scenario::ctx(&mut scenario)
            );
            
            clock::destroy_for_testing(clock);
            test_scenario::return_shared(registry);
        };
        
        // Update profile
        test_scenario::next_tx(&mut scenario, creator);
        {
            let mut profile = test_scenario::take_from_sender<CreatorProfile>(&scenario);
            let clock = clock::create_for_testing(test_scenario::ctx(&mut scenario));
            
            creator_profile::update_profile(
                &mut profile,
                string::utf8(b"Alice Updated"),
                string::utf8(b"New bio"),
                string::utf8(b"avatar2"),
                string::utf8(b"banner2"),
                string::utf8(b"Music"),
                &clock,
                test_scenario::ctx(&mut scenario)
            );
            
            assert!(creator_profile::get_display_name(&profile) == string::utf8(b"Alice Updated"), 0);
            assert!(creator_profile::get_bio(&profile) == string::utf8(b"New bio"), 1);
            assert!(creator_profile::get_avatar_walrus_id(&profile) == string::utf8(b"avatar2"), 2);
            assert!(creator_profile::get_category(&profile) == string::utf8(b"Music"), 3);
            
            clock::destroy_for_testing(clock);
            test_scenario::return_to_sender(&scenario, profile);
        };
        
        test_scenario::end(scenario);
    }
    
    #[test]
    fun test_link_suins() {
        let creator = @0xCAFE;
        let mut scenario = test_scenario::begin(creator);
        
        // Initialize and create profile
        {
            creator_profile::init_for_testing(test_scenario::ctx(&mut scenario));
        };
        
        test_scenario::next_tx(&mut scenario, creator);
        {
            let mut registry = test_scenario::take_shared<ProfileRegistry>(&scenario);
            let clock = clock::create_for_testing(test_scenario::ctx(&mut scenario));
            
            creator_profile::create_profile(
                &mut registry,
                string::utf8(b"Alice"),
                string::utf8(b"Bio"),
                string::utf8(b"avatar"),
                string::utf8(b"banner"),
                string::utf8(b"Art"),
                &clock,
                test_scenario::ctx(&mut scenario)
            );
            
            clock::destroy_for_testing(clock);
            test_scenario::return_shared(registry);
        };
        
        // Link SuiNS
        test_scenario::next_tx(&mut scenario, creator);
        {
            let mut profile = test_scenario::take_from_sender<CreatorProfile>(&scenario);
            
            creator_profile::link_suins(
                &mut profile,
                string::utf8(b"alice.sui"),
                test_scenario::ctx(&mut scenario)
            );
            
            let suins_name = creator_profile::get_suins_name(&profile);
            assert!(option::is_some(&suins_name), 0);
            assert!(*option::borrow(&suins_name) == string::utf8(b"alice.sui"), 1);
            
            test_scenario::return_to_sender(&scenario, profile);
        };
        
        test_scenario::end(scenario);
    }
    
    #[test]
    fun test_add_social_link() {
        let creator = @0xCAFE;
        let mut scenario = test_scenario::begin(creator);
        
        // Initialize and create profile
        {
            creator_profile::init_for_testing(test_scenario::ctx(&mut scenario));
        };
        
        test_scenario::next_tx(&mut scenario, creator);
        {
            let mut registry = test_scenario::take_shared<ProfileRegistry>(&scenario);
            let clock = clock::create_for_testing(test_scenario::ctx(&mut scenario));
            
            creator_profile::create_profile(
                &mut registry,
                string::utf8(b"Alice"),
                string::utf8(b"Bio"),
                string::utf8(b"avatar"),
                string::utf8(b"banner"),
                string::utf8(b"Art"),
                &clock,
                test_scenario::ctx(&mut scenario)
            );
            
            clock::destroy_for_testing(clock);
            test_scenario::return_shared(registry);
        };
        
        // Add social links
        test_scenario::next_tx(&mut scenario, creator);
        {
            let mut profile = test_scenario::take_from_sender<CreatorProfile>(&scenario);
            
            creator_profile::add_social_link(
                &mut profile,
                string::utf8(b"twitter.com/alice"),
                test_scenario::ctx(&mut scenario)
            );
            
            creator_profile::add_social_link(
                &mut profile,
                string::utf8(b"instagram.com/alice"),
                test_scenario::ctx(&mut scenario)
            );
            
            let links = creator_profile::get_social_links(&profile);
            assert!(vector::length(links) == 2, 0);
            
            test_scenario::return_to_sender(&scenario, profile);
        };
        
        test_scenario::end(scenario);
    }
    
    #[test]
    fun test_increment_subscribers() {
        let creator = @0xCAFE;
        let mut scenario = test_scenario::begin(creator);
        
        // Initialize and create profile
        {
            creator_profile::init_for_testing(test_scenario::ctx(&mut scenario));
        };
        
        test_scenario::next_tx(&mut scenario, creator);
        {
            let mut registry = test_scenario::take_shared<ProfileRegistry>(&scenario);
            let clock = clock::create_for_testing(test_scenario::ctx(&mut scenario));
            
            creator_profile::create_profile(
                &mut registry,
                string::utf8(b"Alice"),
                string::utf8(b"Bio"),
                string::utf8(b"avatar"),
                string::utf8(b"banner"),
                string::utf8(b"Art"),
                &clock,
                test_scenario::ctx(&mut scenario)
            );
            
            clock::destroy_for_testing(clock);
            test_scenario::return_shared(registry);
        };
        
        // Increment subscribers
        test_scenario::next_tx(&mut scenario, creator);
        {
            let mut profile = test_scenario::take_from_sender<CreatorProfile>(&scenario);
            
            assert!(creator_profile::get_total_subscribers(&profile) == 0, 0);
            
            creator_profile::increment_subscribers(&mut profile);
            assert!(creator_profile::get_total_subscribers(&profile) == 1, 1);
            
            creator_profile::increment_subscribers(&mut profile);
            assert!(creator_profile::get_total_subscribers(&profile) == 2, 2);
            
            test_scenario::return_to_sender(&scenario, profile);
        };
        
        test_scenario::end(scenario);
    }
    
    #[test]
    fun test_add_revenue() {
        let creator = @0xCAFE;
        let mut scenario = test_scenario::begin(creator);
        
        // Initialize and create profile
        {
            creator_profile::init_for_testing(test_scenario::ctx(&mut scenario));
        };
        
        test_scenario::next_tx(&mut scenario, creator);
        {
            let mut registry = test_scenario::take_shared<ProfileRegistry>(&scenario);
            let clock = clock::create_for_testing(test_scenario::ctx(&mut scenario));
            
            creator_profile::create_profile(
                &mut registry,
                string::utf8(b"Alice"),
                string::utf8(b"Bio"),
                string::utf8(b"avatar"),
                string::utf8(b"banner"),
                string::utf8(b"Art"),
                &clock,
                test_scenario::ctx(&mut scenario)
            );
            
            clock::destroy_for_testing(clock);
            test_scenario::return_shared(registry);
        };
        
        // Add revenue
        test_scenario::next_tx(&mut scenario, creator);
        {
            let mut profile = test_scenario::take_from_sender<CreatorProfile>(&scenario);
            
            assert!(creator_profile::get_total_revenue_mist(&profile) == 0, 0);
            
            creator_profile::add_revenue(&mut profile, 5_000_000_000); // 5 SUI
            assert!(creator_profile::get_total_revenue_mist(&profile) == 5_000_000_000, 1);
            
            creator_profile::add_revenue(&mut profile, 10_000_000_000); // 10 SUI
            assert!(creator_profile::get_total_revenue_mist(&profile) == 15_000_000_000, 2);
            
            test_scenario::return_to_sender(&scenario, profile);
        };
        
        test_scenario::end(scenario);
    }
    
    #[test]
    #[expected_failure(abort_code = 0)]
    fun test_update_profile_not_owner() {
        let creator = @0xCAFE;
        let hacker = @0xBAD;
        let mut scenario = test_scenario::begin(creator);
        
        // Initialize and create profile
        {
            creator_profile::init_for_testing(test_scenario::ctx(&mut scenario));
        };
        
        test_scenario::next_tx(&mut scenario, creator);
        {
            let mut registry = test_scenario::take_shared<ProfileRegistry>(&scenario);
            let clock = clock::create_for_testing(test_scenario::ctx(&mut scenario));
            
            creator_profile::create_profile(
                &mut registry,
                string::utf8(b"Alice"),
                string::utf8(b"Bio"),
                string::utf8(b"avatar"),
                string::utf8(b"banner"),
                string::utf8(b"Art"),
                &clock,
                test_scenario::ctx(&mut scenario)
            );
            
            clock::destroy_for_testing(clock);
            test_scenario::return_shared(registry);
        };
        
        // Try to update as non-owner (should fail)
        test_scenario::next_tx(&mut scenario, hacker);
        {
            let mut profile = test_scenario::take_from_address<CreatorProfile>(&scenario, creator);
            let clock = clock::create_for_testing(test_scenario::ctx(&mut scenario));
            
            creator_profile::update_profile(
                &mut profile,
                string::utf8(b"Hacked"),
                string::utf8(b"Bad bio"),
                string::utf8(b"avatar"),
                string::utf8(b"banner"),
                string::utf8(b"Art"),
                &clock,
                test_scenario::ctx(&mut scenario)
            );
            
            clock::destroy_for_testing(clock);
            test_scenario::return_to_address(creator, profile);
        };
        
        test_scenario::end(scenario);
    }
}
