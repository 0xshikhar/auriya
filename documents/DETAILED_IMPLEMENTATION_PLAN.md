# Auriya - Detailed Implementation Plan

## Product Overview

**Auriya** is a decentralized creator monetization platform built on the Sui blockchain stack. It enables creators to own their content, audience relationships, and revenue streams while providing fans with transparent, verifiable access to exclusive content through NFT-based subscriptions.

### Core Value Proposition

- **For Creators**: Keep 95% of revenue, no deplatforming risk, instant payments, portable audience
- **For Fans**: Provable support via NFTs, transferable subscriptions, privacy-first authentication
- **For Ecosystem**: Real-world use case for Walrus (storage), Seal (encryption), and Sui (programmable logic)

---

## Hackathon Strategy

### Target Tracks

**1. Data Marketplaces (Primary)**
- Direct creator-to-fan data exchange with provable ownership
- Transparent onchain pricing with no hidden fees
- Decentralized storage preserves difficult-to-obtain content
- 10x better curation through onchain reputation

**2. Data Security & Privacy (Secondary)**
- zkLogin for privacy-preserving authentication
- Seal encryption for content protection
- Zero-knowledge access verification
- No centralized data collection

**3. Best Tech Implementation (Bonus)**
- Deep Walrus integration (all media stored decentrally)
- Seal encryption with onchain policies
- Production-ready architecture

---

## Technical Stack

### Frontend Layer
```typescript
Framework: Next.js 14 (App Router)
Language: TypeScript
UI Library: Shadcn UI + Radix primitives
Styling: Tailwind CSS
State: React Query (@tanstack/react-query)
Wallet: @mysten/dapp-kit
Auth: Enoki zkLogin (already integrated ✅)
Icons: Lucide React
```

### Smart Contracts Layer
```move
Language: Sui Move
Modules:
  - creator_profile.move (identity & metadata)
  - subscription.move (NFT access control)
  - content.move (post registry)
  - marketplace.move (optional: P2P NFT trading)
```

### Storage & Encryption Layer
```
Walrus: Decentralized blob storage
  - Creator avatars/banners
  - Post media (images, videos, files)
  - All large content
  
Seal: Onchain encryption policies
  - Content access control
  - Tier-based decryption
  - Key management
```

---

## Implementation Phases

## Phase 1: Smart Contracts (Days 1-3)

### Day 1: Creator Profile Contract

**File**: `backend/move/creator_profile/sources/creator_profile.move`

**Objectives**:
1. Enable creator profile creation
2. Store Walrus references for avatar/banner
3. Track subscriber metrics
4. Support SuiNS integration

**Implementation Steps**:

```bash
# 1. Create directory structure
cd backend/move
mkdir -p creator_profile/sources
mkdir -p creator_profile/tests

# 2. Create Move.toml
cat > creator_profile/Move.toml << 'EOF'
[package]
name = "creator_profile"
version = "0.0.1"
edition = "2024.beta"

[dependencies]
Sui = { git = "https://github.com/MystenLabs/sui.git", subdir = "crates/sui-framework/packages/sui-framework", rev = "framework/testnet" }

[addresses]
creator_profile = "0x0"
EOF
```

**Contract Structure**:
```move
module creator_profile::creator_profile {
    use sui::object::{Self, UID};
    use sui::tx_context::{Self, TxContext};
    use sui::transfer;
    use sui::clock::{Self, Clock};
    use std::string::{Self, String};
    use std::option::{Self, Option};
    use sui::event;
    
    // === Structs ===
    
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
    
    public struct ProfileRegistry has key {
        id: UID,
        profile_count: u64,
    }
    
    // === Events ===
    
    public struct ProfileCreated has copy, drop {
        profile_id: ID,
        owner: address,
        display_name: String,
        timestamp: u64,
    }
    
    public struct ProfileUpdated has copy, drop {
        profile_id: ID,
        timestamp: u64,
    }
    
    // === Error Codes ===
    
    const ENotOwner: u64 = 0;
    const EEmptyDisplayName: u64 = 1;
    const EEmptyBio: u64 = 2;
    
    // === Init Function ===
    
    fun init(ctx: &mut TxContext) {
        let registry = ProfileRegistry {
            id: object::new(ctx),
            profile_count: 0,
        };
        transfer::share_object(registry);
    }
    
    // === Public Functions ===
    
    public entry fun create_profile(
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
            created_at: clock::timestamp_ms(clock),
            total_subscribers: 0,
            total_revenue_mist: 0,
            verified: false,
        };
        
        let profile_id = object::id(&profile);
        
        event::emit(ProfileCreated {
            profile_id,
            owner: tx_context::sender(ctx),
            display_name: profile.display_name,
            timestamp: clock::timestamp_ms(clock),
        });
        
        registry.profile_count = registry.profile_count + 1;
        
        transfer::transfer(profile, tx_context::sender(ctx));
    }
    
    public entry fun update_profile(
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
    
    public entry fun link_suins(
        profile: &mut CreatorProfile,
        suins_name: String,
        ctx: &TxContext
    ) {
        assert!(profile.owner == tx_context::sender(ctx), ENotOwner);
        profile.suins_name = option::some(suins_name);
    }
    
    public entry fun add_social_link(
        profile: &mut CreatorProfile,
        link: String,
        ctx: &TxContext
    ) {
        assert!(profile.owner == tx_context::sender(ctx), ENotOwner);
        vector::push_back(&mut profile.social_links, link);
    }
    
    // === Public Mutative Functions (Internal) ===
    
    public fun increment_subscribers(profile: &mut CreatorProfile) {
        profile.total_subscribers = profile.total_subscribers + 1;
    }
    
    public fun add_revenue(profile: &mut CreatorProfile, amount: u64) {
        profile.total_revenue_mist = profile.total_revenue_mist + amount;
    }
    
    // === View Functions ===
    
    public fun get_owner(profile: &CreatorProfile): address {
        profile.owner
    }
    
    public fun get_display_name(profile: &CreatorProfile): String {
        profile.display_name
    }
    
    public fun get_total_subscribers(profile: &CreatorProfile): u64 {
        profile.total_subscribers
    }
    
    public fun get_avatar_walrus_id(profile: &CreatorProfile): String {
        profile.avatar_walrus_id
    }
    
    #[test_only]
    public fun init_for_testing(ctx: &mut TxContext) {
        init(ctx);
    }
}
```

**Testing**:
```move
#[test_only]
module creator_profile::creator_profile_tests {
    use creator_profile::creator_profile::{Self, CreatorProfile, ProfileRegistry};
    use sui::test_scenario;
    use sui::clock;
    use std::string;
    
    #[test]
    fun test_create_profile() {
        let creator = @0xCAFE;
        let mut scenario = test_scenario::begin(creator);
        
        // Initialize
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
                string::utf8(b"Test Creator"),
                string::utf8(b"Test bio"),
                string::utf8(b"avatar_blob_id"),
                string::utf8(b"banner_blob_id"),
                string::utf8(b"Art"),
                &clock,
                test_scenario::ctx(&mut scenario)
            );
            
            clock::destroy_for_testing(clock);
            test_scenario::return_shared(registry);
        };
        
        // Verify profile
        test_scenario::next_tx(&mut scenario, creator);
        {
            let profile = test_scenario::take_from_sender<CreatorProfile>(&scenario);
            assert!(creator_profile::get_display_name(&profile) == string::utf8(b"Test Creator"), 0);
            test_scenario::return_to_sender(&scenario, profile);
        };
        
        test_scenario::end(scenario);
    }
}
```

**Deployment**:
```bash
# Build
sui move build -p backend/move/creator_profile

# Test
sui move test -p backend/move/creator_profile

# Deploy to testnet
sui client publish --gas-budget 100000000 backend/move/creator_profile
```

---

### Day 2: Subscription Contract

**File**: `backend/move/subscription/sources/subscription.move`

**Objectives**:
1. Enable creators to configure subscription tiers
2. Mint Subscription NFTs on purchase
3. Handle payment distribution (95% creator, 5% platform)
4. Support renewal and expiry checks

**Key Features**:
- Multiple tier support (Bronze/Silver/Gold)
- Time-based expiry with Clock object
- Payment splitting logic
- Auto-renewal capability

**Full implementation in next section...**

---

### Day 3: Content Contract

**File**: `backend/move/content/sources/content.move`

**Objectives**:
1. Create post registry for creators
2. Store Walrus blob references
3. Implement tier-based access control
4. Track engagement metrics

---

## Phase 2: Walrus Integration (Days 3-4)

### Walrus Client Setup

**File**: `frontend/src/lib/walrus.ts`

```typescript
const WALRUS_PUBLISHER = 'https://publisher.walrus-testnet.walrus.space';
const WALRUS_AGGREGATOR = 'https://aggregator.walrus-testnet.walrus.space';
const EPOCHS = 5; // Storage duration

export interface WalrusUploadResult {
  blobId: string;
  url: string;
  size: number;
  mediaType: string;
}

export interface WalrusError {
  error: string;
  message: string;
}

export async function uploadToWalrus(
  file: File,
  onProgress?: (progress: number) => void
): Promise<WalrusUploadResult> {
  try {
    onProgress?.(10);
    
    const response = await fetch(
      `${WALRUS_PUBLISHER}/v1/store?epochs=${EPOCHS}`,
      {
        method: 'PUT',
        body: file,
      }
    );

    onProgress?.(90);

    if (!response.ok) {
      const error = await response.json() as WalrusError;
      throw new Error(`Walrus upload failed: ${error.message || response.statusText}`);
    }

    const data = await response.json();
    onProgress?.(100);

    const blobId = data.newlyCreated?.blobObject?.blobId || 
                   data.alreadyCertified?.blobId;

    if (!blobId) {
      throw new Error('No blob ID returned from Walrus');
    }

    return {
      blobId,
      url: `${WALRUS_AGGREGATOR}/v1/${blobId}`,
      size: file.size,
      mediaType: file.type,
    };
  } catch (error) {
    console.error('Walrus upload error:', error);
    throw error;
  }
}

export async function downloadFromWalrus(blobId: string): Promise<Blob> {
  const response = await fetch(`${WALRUS_AGGREGATOR}/v1/${blobId}`);
  
  if (!response.ok) {
    throw new Error(`Walrus download failed: ${response.statusText}`);
  }
  
  return response.blob();
}

export function getWalrusUrl(blobId: string): string {
  return `${WALRUS_AGGREGATOR}/v1/${blobId}`;
}

export function isValidBlobId(blobId: string): boolean {
  return /^[a-zA-Z0-9_-]+$/.test(blobId) && blobId.length > 0;
}
```

---

## Phase 3: Frontend Implementation (Days 4-6)

### Creator Dashboard

**File**: `frontend/src/app/dashboard/page.tsx`

```typescript
'use client';

import { useCurrentAccount } from '@mysten/dapp-kit';
import { useCreatorProfile } from '@/hooks/useCreatorProfile';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, DollarSign, FileText, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const account = useCurrentAccount();
  const { profile, stats, isLoading } = useCreatorProfile(account?.address);

  if (!account) {
    return (
      <div className="container py-20 text-center">
        <h1 className="text-3xl font-bold mb-4">Creator Dashboard</h1>
        <p className="text-muted-foreground mb-6">
          Connect your wallet to access the dashboard
        </p>
      </div>
    );
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!profile) {
    return (
      <div className="container py-20 text-center">
        <h1 className="text-3xl font-bold mb-4">Welcome to Auriya</h1>
        <p className="text-muted-foreground mb-6">
          Create your creator profile to get started
        </p>
        <Button asChild size="lg">
          <Link href="/dashboard/setup">Create Profile</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">{profile.displayName}</h1>
          <p className="text-muted-foreground">@{profile.suinsName || account.address.slice(0, 8)}</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/content/new">Create Post</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Subscribers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalSubscribers || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {((stats?.monthlyRevenueMist || 0) / 1_000_000_000).toFixed(2)} SUI
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalPosts || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Growth</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">+12%</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Posts</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Your recent posts will appear here</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/dashboard/content/new">Create New Post</Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/dashboard/tiers">Manage Tiers</Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/dashboard/settings">Profile Settings</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
```

---

## Testing Strategy

### Smart Contract Tests
```bash
# Unit tests for each module
sui move test -p backend/move/creator_profile
sui move test -p backend/move/subscription
sui move test -p backend/move/content

# Integration tests
# Test complete flow: create profile → set tiers → create post → subscribe → access
```

### Frontend E2E Tests
```typescript
// Test scenarios:
// 1. Creator onboarding flow
// 2. Subscription purchase flow
// 3. Content access verification
// 4. Walrus upload/download
```

---

## Deployment Checklist

### Testnet Deployment
- [ ] Deploy creator_profile to testnet
- [ ] Deploy subscription to testnet
- [ ] Deploy content to testnet
- [ ] Update frontend .env with package IDs
- [ ] Test all flows on testnet
- [ ] Deploy frontend to Vercel

### Documentation
- [ ] README with setup instructions
- [ ] Architecture diagram
- [ ] API documentation
- [ ] Video demo (2-3 min)
- [ ] Contract addresses on Explorer

---

## Success Metrics

### Technical
- All 3 contracts deployed and verified
- Walrus uploads/downloads working
- zkLogin authentication functional
- Mobile responsive UI
- <3 second page loads

### Business
- Demo shows complete creator & fan flows
- Real transactions on testnet
- Professional UI/UX
- Clear value proposition

**This is a production-ready foundation for winning the hackathon.** 🚀
