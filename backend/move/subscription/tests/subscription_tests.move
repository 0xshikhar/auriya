// Copyright (c) Auriya
// SPDX-License-Identifier: MIT

#[test_only]
module subscription::subscription_tests {
    use subscription::subscription::{Self, CreatorSubscriptions, SubscriptionNFT, PlatformTreasury};
    use sui::test_scenario::{Self, Scenario};
    use sui::coin::{Self, Coin};
    use sui::sui::SUI;
    use sui::clock;
    use sui::test_utils;
    use std::string;
    use std::vector;
    
    const MIST_PER_SUI: u64 = 1_000_000_000;
    
    fun setup_test(creator: address): Scenario {
        let mut scenario = test_scenario::begin(creator);
        
        // Initialize module
        {
            subscription::init_for_testing(test_scenario::ctx(&mut scenario));
        };
        
        scenario
    }
    
    fun create_test_tiers(scenario: &mut Scenario, creator: address) {
        test_scenario::next_tx(scenario, creator);
        {
            let mut tier_names = vector::empty<string::String>();
            vector::push_back(&mut tier_names, string::utf8(b"Bronze"));
            vector::push_back(&mut tier_names, string::utf8(b"Silver"));
            vector::push_back(&mut tier_names, string::utf8(b"Gold"));
            
            let mut tier_prices = vector::empty<u64>();
            vector::push_back(&mut tier_prices, 5 * MIST_PER_SUI);
            vector::push_back(&mut tier_prices, 10 * MIST_PER_SUI);
            vector::push_back(&mut tier_prices, 25 * MIST_PER_SUI);
            
            let mut tier_durations = vector::empty<u64>();
            vector::push_back(&mut tier_durations, 2_592_000_000); // 30 days
            vector::push_back(&mut tier_durations, 2_592_000_000);
            vector::push_back(&mut tier_durations, 2_592_000_000);
            
            subscription::create_tiers(
                tier_names,
                tier_prices,
                tier_durations,
                test_scenario::ctx(scenario)
            );
        };
    }
    
    #[test]
    fun test_create_tiers() {
        let creator = @0xCAFE;
        let mut scenario = setup_test(creator);
        
        create_test_tiers(&mut scenario, creator);
        
        test_scenario::next_tx(&mut scenario, creator);
        {
            let subs = test_scenario::take_shared<CreatorSubscriptions>(&scenario);
            assert!(subscription::get_active_count(&subs) == 0, 0);
            assert!(subscription::get_total_revenue(&subs) == 0, 1);
            test_scenario::return_shared(subs);
        };
        
        test_scenario::end(scenario);
    }
    
    #[test]
    fun test_purchase_subscription() {
        let creator = @0xCAFE;
        let fan = @0xF00D;
        let mut scenario = setup_test(creator);
        
        create_test_tiers(&mut scenario, creator);
        
        // Fan purchases subscription
        test_scenario::next_tx(&mut scenario, fan);
        {
            let mut subs = test_scenario::take_shared<CreatorSubscriptions>(&scenario);
            let mut treasury = test_scenario::take_shared<PlatformTreasury>(&scenario);
            let clock = clock::create_for_testing(test_scenario::ctx(&mut scenario));
            
            // Create payment coin
            let payment = coin::mint_for_testing<SUI>(10 * MIST_PER_SUI, test_scenario::ctx(&mut scenario));
            
            subscription::purchase_subscription(
                &mut subs,
                &mut treasury,
                2, // Silver tier
                payment,
                &clock,
                test_scenario::ctx(&mut scenario)
            );
            
            assert!(subscription::get_active_count(&subs) == 1, 0);
            assert!(subscription::get_total_revenue(&subs) == 10 * MIST_PER_SUI, 1);
            
            clock::destroy_for_testing(clock);
            test_scenario::return_shared(subs);
            test_scenario::return_shared(treasury);
        };
        
        // Verify NFT received
        test_scenario::next_tx(&mut scenario, fan);
        {
            let nft = test_scenario::take_from_sender<SubscriptionNFT>(&scenario);
            assert!(subscription::get_creator(&nft) == creator, 0);
            assert!(subscription::get_subscriber(&nft) == fan, 1);
            assert!(subscription::get_tier_id(&nft) == 2, 2);
            test_scenario::return_to_sender(&scenario, nft);
        };
        
        test_scenario::end(scenario);
    }
    
    #[test]
    fun test_renew_subscription() {
        let creator = @0xCAFE;
        let fan = @0xF00D;
        let mut scenario = setup_test(creator);
        
        create_test_tiers(&mut scenario, creator);
        
        // Purchase initial subscription
        test_scenario::next_tx(&mut scenario, fan);
        {
            let mut subs = test_scenario::take_shared<CreatorSubscriptions>(&scenario);
            let mut treasury = test_scenario::take_shared<PlatformTreasury>(&scenario);
            let clock = clock::create_for_testing(test_scenario::ctx(&mut scenario));
            
            let payment = coin::mint_for_testing<SUI>(10 * MIST_PER_SUI, test_scenario::ctx(&mut scenario));
            
            subscription::purchase_subscription(
                &mut subs,
                &mut treasury,
                2,
                payment,
                &clock,
                test_scenario::ctx(&mut scenario)
            );
            
            clock::destroy_for_testing(clock);
            test_scenario::return_shared(subs);
            test_scenario::return_shared(treasury);
        };
        
        // Renew subscription
        test_scenario::next_tx(&mut scenario, fan);
        {
            let subs = test_scenario::take_shared<CreatorSubscriptions>(&scenario);
            let mut treasury = test_scenario::take_shared<PlatformTreasury>(&scenario);
            let mut nft = test_scenario::take_from_sender<SubscriptionNFT>(&scenario);
            let clock = clock::create_for_testing(test_scenario::ctx(&mut scenario));
            
            let old_expiry = subscription::get_expires_at(&nft);
            
            let payment = coin::mint_for_testing<SUI>(10 * MIST_PER_SUI, test_scenario::ctx(&mut scenario));
            
            subscription::renew_subscription(
                &subs,
                &mut treasury,
                &mut nft,
                payment,
                &clock,
                test_scenario::ctx(&mut scenario)
            );
            
            let new_expiry = subscription::get_expires_at(&nft);
            assert!(new_expiry > old_expiry, 0);
            
            clock::destroy_for_testing(clock);
            test_scenario::return_shared(subs);
            test_scenario::return_shared(treasury);
            test_scenario::return_to_sender(&scenario, nft);
        };
        
        test_scenario::end(scenario);
    }
    
    #[test]
    fun test_is_active() {
        let creator = @0xCAFE;
        let fan = @0xF00D;
        let mut scenario = setup_test(creator);
        
        create_test_tiers(&mut scenario, creator);
        
        // Purchase subscription
        test_scenario::next_tx(&mut scenario, fan);
        {
            let mut subs = test_scenario::take_shared<CreatorSubscriptions>(&scenario);
            let mut treasury = test_scenario::take_shared<PlatformTreasury>(&scenario);
            let clock = clock::create_for_testing(test_scenario::ctx(&mut scenario));
            
            let payment = coin::mint_for_testing<SUI>(10 * MIST_PER_SUI, test_scenario::ctx(&mut scenario));
            
            subscription::purchase_subscription(
                &mut subs,
                &mut treasury,
                2,
                payment,
                &clock,
                test_scenario::ctx(&mut scenario)
            );
            
            clock::destroy_for_testing(clock);
            test_scenario::return_shared(subs);
            test_scenario::return_shared(treasury);
        };
        
        // Check if active
        test_scenario::next_tx(&mut scenario, fan);
        {
            let nft = test_scenario::take_from_sender<SubscriptionNFT>(&scenario);
            let clock = clock::create_for_testing(test_scenario::ctx(&mut scenario));
            
            assert!(subscription::is_active(&nft, &clock), 0);
            
            clock::destroy_for_testing(clock);
            test_scenario::return_to_sender(&scenario, nft);
        };
        
        test_scenario::end(scenario);
    }
}
