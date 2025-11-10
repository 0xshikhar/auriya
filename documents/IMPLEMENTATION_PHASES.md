# Implementation Phases

## Current Status: Foundation Complete ✅

You already have:
- ✅ Next.js 14 + TypeScript frontend
- ✅ Sui wallet integration (@mysten/dapp-kit)
- ✅ zkLogin with Google OAuth (Enoki)
- ✅ Shadcn UI component library
- ✅ Basic Move contract template (greeting.move)
- ✅ Multi-network deployment scripts (localnet/devnet/testnet/mainnet)

---

## Phase 1: Smart Contract Development (Days 1-3)

### Day 1: Creator Profile Contract

**Goal**: Enable creator onboarding

**Tasks**:
1. Create `backend/move/creator_profile/` directory
2. Implement `creator_profile.move` (see SMART_CONTRACTS_SPEC.md)
3. Write tests for profile creation/updates
4. Deploy to devnet

**Commands**:
```bash
cd backend
mkdir -p move/creator_profile/sources
# Copy creator_profile.move from spec
sui move build -p move/creator_profile
sui move test -p move/creator_profile
npm run devnet:deploy  # Adapt script for creator_profile
```

**Frontend Integration** (`frontend/src/lib/contracts/creator.ts`):
```typescript
import { Transaction } from '@mysten/sui/transactions';
import { useSignAndExecuteTransaction, useSuiClient } from '@mysten/dapp-kit';

export const useCreateProfile = () => {
  const client = useSuiClient();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();

  return async (profileData: {
    displayName: string;
    bio: string;
    avatarWalrusId: string;
    bannerWalrusId: string;
    category: string;
  }) => {
    const tx = new Transaction();
    
    tx.moveCall({
      target: `${PACKAGE_ID}::creator_profile::create_profile`,
      arguments: [
        tx.pure.string(profileData.displayName),
        tx.pure.string(profileData.bio),
        tx.pure.string(profileData.avatarWalrusId),
        tx.pure.string(profileData.bannerWalrusId),
        tx.pure.string(profileData.category),
        tx.object('0x6'), // Clock object
      ],
    });

    await signAndExecute({
      transaction: tx,
    });
  };
};
```

### Day 2: Subscription Contract

**Goal**: Enable tier configuration and NFT minting

**Tasks**:
1. Create `backend/move/subscription/` directory
2. Implement `subscription.move` with:
   - `create_tiers()` - Creator sets pricing
   - `purchase_subscription()` - Fan buys access NFT
   - `renew_subscription()` - Extend expiry
   - `is_active()` - Validation helper
3. Test payment flows (platform fee calculation)
4. Deploy to devnet

**Frontend Hook** (`frontend/src/lib/contracts/subscription.ts`):
```typescript
export const usePurchaseSubscription = () => {
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();

  return async (params: {
    subscriptionObjectId: string;
    tierId: number;
    priceInSui: number;
  }) => {
    const tx = new Transaction();
    
    // Split coin for payment
    const [coin] = tx.splitCoins(tx.gas, [
      tx.pure.u64(params.priceInSui * 1_000_000_000), // Convert SUI to MIST
    ]);

    tx.moveCall({
      target: `${PACKAGE_ID}::subscription::purchase_subscription`,
      arguments: [
        tx.object(params.subscriptionObjectId),
        tx.pure.u8(params.tierId),
        coin,
        tx.object('0x6'), // Clock
      ],
    });

    await signAndExecute({ transaction: tx });
  };
};
```

### Day 3: Content Contract

**Goal**: Post creation with access control

**Tasks**:
1. Create `backend/move/content/` directory
2. Implement `content.move`
3. Test access verification logic
4. Deploy to devnet

**Deliverables**:
- 3 deployed contracts on Sui devnet
- Test coverage >80%
- Package IDs documented in `.env`

---

## Phase 2: Walrus Integration (Days 3-4)

### Setup Walrus Client

**Install Dependencies**:
```bash
cd frontend
npm install axios form-data
```

**Create Walrus Service** (`frontend/src/lib/walrus.ts`):
```typescript
const WALRUS_PUBLISHER = 'https://publisher.walrus-testnet.walrus.space';
const WALRUS_AGGREGATOR = 'https://aggregator.walrus-testnet.walrus.space';

export interface WalrusUploadResult {
  blobId: string;
  url: string;
  size: number;
}

export async function uploadToWalrus(file: File): Promise<WalrusUploadResult> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${WALRUS_PUBLISHER}/v1/store`, {
    method: 'PUT',
    body: file, // Walrus expects raw binary
  });

  if (!response.ok) {
    throw new Error(`Walrus upload failed: ${response.statusText}`);
  }

  const data = await response.json();
  
  // Handle both new and existing blob responses
  const blobId = data.newlyCreated?.blobObject?.blobId || 
                 data.alreadyCertified?.blobId;
  
  if (!blobId) {
    throw new Error('No blob ID returned from Walrus');
  }

  return {
    blobId,
    url: `${WALRUS_AGGREGATOR}/v1/${blobId}`,
    size: file.size,
  };
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
```

### Build Upload Component

**Create** `frontend/src/components/creator/WalrusUploader.tsx`:
```typescript
'use client';

import { useState } from 'react';
import { uploadToWalrus } from '@/lib/walrus';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

export function WalrusUploader({ onUploadComplete }: {
  onUploadComplete: (blobId: string, url: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setProgress(0);

    try {
      // Simulate progress (Walrus doesn't provide progress callbacks yet)
      const interval = setInterval(() => {
        setProgress(p => Math.min(p + 10, 90));
      }, 200);

      const result = await uploadToWalrus(file);
      
      clearInterval(interval);
      setProgress(100);
      
      onUploadComplete(result.blobId, result.url);
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <input
        type="file"
        onChange={handleUpload}
        disabled={uploading}
        className="block w-full text-sm"
      />
      {uploading && <Progress value={progress} />}
    </div>
  );
}
```

**Test Walrus**:
- Upload profile images (avatar, banner)
- Upload post media (images, videos)
- Verify blob retrieval via aggregator

---

## Phase 3: Frontend Features (Days 4-6)

### Day 4: Creator Dashboard

**Create Pages**:

1. **Dashboard Home** (`frontend/src/app/dashboard/page.tsx`):
```typescript
export default function DashboardPage() {
  const account = useCurrentAccount();
  const { data: profile } = useCreatorProfile(account?.address);
  const { data: stats } = useCreatorStats(account?.address);

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold">Creator Dashboard</h1>
      
      <div className="grid grid-cols-3 gap-4 mt-6">
        <StatsCard 
          title="Total Subscribers" 
          value={stats?.totalSubscribers || 0}
          icon={<Users />}
        />
        <StatsCard 
          title="Monthly Revenue" 
          value={`${stats?.monthlyRevenue || 0} SUI`}
          icon={<DollarSign />}
        />
        <StatsCard 
          title="Total Posts" 
          value={stats?.totalPosts || 0}
          icon={<FileText />}
        />
      </div>

      <div className="mt-8">
        <Button asChild>
          <Link href="/dashboard/content/new">Create New Post</Link>
        </Button>
      </div>
    </div>
  );
}
```

2. **Content Creator** (`frontend/src/app/dashboard/content/new/page.tsx`):
```typescript
export default function NewPostPage() {
  const [walrusBlobId, setWalrusBlobId] = useState('');
  const { mutate: createPost } = useCreatePost();

  const handleSubmit = async (data: PostFormData) => {
    await createPost({
      title: data.title,
      description: data.description,
      contentType: data.type,
      walrusBlobId,
      requiredTier: data.tier,
    });
  };

  return (
    <div className="container max-w-2xl py-8">
      <h1 className="text-3xl font-bold">Create New Post</h1>
      
      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        <Input name="title" placeholder="Post Title" />
        <Textarea name="description" placeholder="Description" />
        
        <Select name="tier">
          <option value={0}>Public (Free)</option>
          <option value={1}>Bronze Tier</option>
          <option value={2}>Silver Tier</option>
          <option value={3}>Gold Tier</option>
        </Select>

        <WalrusUploader 
          onUploadComplete={(blobId) => setWalrusBlobId(blobId)} 
        />

        <Button type="submit">Publish Post</Button>
      </form>
    </div>
  );
}
```

### Day 5: Fan Discovery & Subscription

1. **Browse Creators** (`frontend/src/app/creators/page.tsx`):
```typescript
export default function CreatorsPage() {
  const { data: creators } = useAllCreators();

  return (
    <div className="container py-8">
      <h1 className="text-4xl font-bold">Discover Creators</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        {creators?.map(creator => (
          <CreatorCard key={creator.id} creator={creator} />
        ))}
      </div>
    </div>
  );
}
```

2. **Creator Profile** (`frontend/src/app/creators/[handle]/page.tsx`):
```typescript
export default function CreatorProfilePage({ params }: { 
  params: { handle: string } 
}) {
  const { data: creator } = useCreatorByHandle(params.handle);
  const { data: posts } = useCreatorPosts(creator?.address);
  const { data: tiers } = useCreatorTiers(creator?.address);

  return (
    <div className="container py-8">
      {/* Hero Section */}
      <div className="relative h-64 rounded-lg overflow-hidden">
        <img 
          src={getWalrusUrl(creator.bannerWalrusId)} 
          alt="Banner"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Profile Info */}
      <div className="flex items-start gap-6 -mt-16 relative">
        <img 
          src={getWalrusUrl(creator.avatarWalrusId)}
          alt={creator.displayName}
          className="w-32 h-32 rounded-full border-4 border-background"
        />
        <div className="flex-1 mt-16">
          <h1 className="text-3xl font-bold">{creator.displayName}</h1>
          <p className="text-muted-foreground">@{creator.suinsName || params.handle}</p>
          <p className="mt-4">{creator.bio}</p>
        </div>
      </div>

      {/* Subscription Tiers */}
      <div className="grid grid-cols-3 gap-4 mt-8">
        {tiers?.map(tier => (
          <TierCard key={tier.id} tier={tier} creatorAddress={creator.address} />
        ))}
      </div>

      {/* Content Feed */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Posts</h2>
        {posts?.map(post => (
          <PostPreview key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
```

### Day 6: Content Viewer with Access Control

**Create** `frontend/src/components/fan/ContentViewer.tsx`:
```typescript
export function ContentViewer({ post }: { post: ContentPost }) {
  const account = useCurrentAccount();
  const { data: nft } = useSubscriptionNFT(account?.address, post.creator);
  const [canAccess, setCanAccess] = useState(false);

  useEffect(() => {
    if (post.isPublic) {
      setCanAccess(true);
    } else if (nft) {
      // Verify onchain access
      verifyAccess(post.id, nft.id).then(setCanAccess);
    }
  }, [post, nft]);

  if (!canAccess) {
    return (
      <div className="bg-card p-8 rounded-lg text-center">
        <Lock className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-xl font-bold mb-2">Premium Content</h3>
        <p className="text-muted-foreground mb-4">
          Subscribe to access this content
        </p>
        <Button>View Subscription Tiers</Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">{post.title}</h1>
      <p className="text-muted-foreground">{post.description}</p>
      
      {post.contentType === CONTENT_TYPE_IMAGE && (
        <img 
          src={getWalrusUrl(post.walrusBlobId)} 
          alt={post.title}
          className="w-full rounded-lg"
        />
      )}
      
      {post.contentType === CONTENT_TYPE_VIDEO && (
        <video 
          src={getWalrusUrl(post.walrusBlobId)} 
          controls
          className="w-full rounded-lg"
        />
      )}
      
      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <span>{post.views} views</span>
        <span>{post.likes} likes</span>
      </div>
    </div>
  );
}
```

---

## Phase 4: Seal Integration (Days 6-7)

**Note**: Seal SDK is in early beta. Implementation may vary based on final API.

### Research & Prototype

1. **Check Seal Documentation**:
   - Visit: https://docs.sui.io/guides/developer/cryptography/seal
   - Join Sui Discord #walrus-seal channel for updates

2. **Conceptual Implementation** (`frontend/src/lib/seal.ts`):
```typescript
// Placeholder - update when Seal SDK available
export async function encryptWithSeal(
  content: Blob,
  accessPolicy: {
    requiredNFT: string; // NFT collection address
    minTier: number;
  }
): Promise<string> {
  // 1. Encrypt content locally
  // 2. Store encryption key onchain with access policy
  // 3. Return policy ID
  
  console.warn('Seal SDK not yet available - using mock');
  return 'seal_policy_' + Math.random();
}

export async function decryptWithSeal(
  policyId: string,
  userNFT: string
): Promise<Blob> {
  // 1. Verify user holds required NFT onchain
  // 2. Retrieve decryption key if authorized
  // 3. Decrypt content
  
  console.warn('Seal SDK not yet available - using mock');
  return new Blob();
}
```

3. **Alternative: Client-Side Encryption** (if Seal not ready):
   - Use Web Crypto API for AES-GCM encryption
   - Store encrypted keys onchain tied to NFT ownership
   - Decrypt client-side after NFT verification

---

## Phase 5: Polish & Demo (Days 7-8)

### Day 7: UI/UX Polish

**Tasks**:
- Add loading states and error handling
- Implement toast notifications (using `sonner`)
- Add animations (Tailwind + framer-motion)
- Mobile responsive design
- Dark mode optimization (next-themes already installed)

**Key Improvements**:
```typescript
// Add optimistic UI updates
const { mutate: purchaseSubscription } = usePurchaseSubscription({
  onMutate: () => {
    toast.loading('Processing subscription...');
  },
  onSuccess: () => {
    toast.success('Subscription activated!');
    queryClient.invalidateQueries(['subscription-nft']);
  },
  onError: (error) => {
    toast.error(`Failed: ${error.message}`);
  },
});
```

### Day 8: Demo Preparation

**Create Demo Scenario**:

1. **Creator Flow**:
   - Sign up as `@demo_creator.sui`
   - Upload avatar/banner to Walrus
   - Configure 3 tiers: $5, $10, $20/month
   - Create 5 posts (2 public, 3 premium)

2. **Fan Flow**:
   - Sign in with zkLogin
   - Browse creators
   - Subscribe to $10 tier
   - Access premium content
   - Tip creator additional SUI

**Record Video**:
- 2-3 minute demo showcasing key features
- Highlight Walrus (show upload), Sui (show transactions), zkLogin (show auth)
- Emphasize data ownership, privacy, censorship-resistance

**Documentation**:
- Update README with:
  - Project description
  - Setup instructions
  - Architecture diagram
  - Deployed contract addresses
  - Demo link

---

## Testing Checklist

### Smart Contracts
- [ ] Creator can create profile
- [ ] Creator can set subscription tiers
- [ ] Fan can purchase subscription NFT
- [ ] Payment splits correctly (95% creator, 5% platform)
- [ ] Access control validates NFT ownership + expiry
- [ ] Subscription can be renewed
- [ ] NFT can be transferred (secondary market)

### Walrus
- [ ] Images upload successfully
- [ ] Videos upload and stream smoothly
- [ ] Large files (>10MB) handled correctly
- [ ] Blob IDs stored correctly onchain
- [ ] Content retrieval works from aggregator

### Frontend
- [ ] zkLogin works for new users
- [ ] Wallet connection works
- [ ] Creator dashboard shows correct stats
- [ ] Post creation flow completes
- [ ] Subscription purchase completes
- [ ] Content access control enforced
- [ ] Mobile responsive

---

## Deployment

### Testnet Deployment (for hackathon submission)

```bash
# Deploy contracts to Sui testnet
cd backend
npm run testnet:deploy

# Update frontend environment variables
cd ../frontend
echo "NEXT_PUBLIC_CREATOR_PACKAGE_ID=0x..." >> .env
echo "NEXT_PUBLIC_SUBSCRIPTION_PACKAGE_ID=0x..." >> .env
echo "NEXT_PUBLIC_CONTENT_PACKAGE_ID=0x..." >> .env

# Deploy frontend to Vercel/Netlify
npm run build
# or
vercel deploy
```

### Mainnet Deployment (post-hackathon)

```bash
cd backend
npm run mainnet:deploy
# Update .env with mainnet package IDs
```

---

## Success Metrics for Hackathon

### Technical Excellence
- ✅ All 3 Sui Stack components integrated (Walrus, Seal, Sui)
- ✅ Working demo with real transactions on testnet
- ✅ Clean, well-documented code
- ✅ Comprehensive README

### Innovation
- ✅ Novel use case: Decentralized creator economy
- ✅ Composable NFT subscriptions (can be traded/used elsewhere)
- ✅ Privacy-first architecture (zkLogin + encryption)

### Track Alignment
- **Data Marketplaces**: Direct creator-fan data exchange, provable ownership
- **Data Security**: Encrypted content, access control, privacy-preserving auth

### Bonus Points
- ✅ Full Walrus integration (storage)
- ✅ Seal integration (encryption) - if available
- ✅ Production-ready architecture
- ✅ Beautiful, intuitive UI

---

## Post-Hackathon Roadmap

### V1.1 Features
- Creator analytics dashboard
- Fan messaging system
- Tipping & donations
- Post comments & reactions

### V1.2 Features
- SuiNS integration for creator handles
- NFT marketplace for subscription trading
- Revenue sharing with collaborators
- Multi-tier bundles

### V2.0 Features
- Livestreaming support
- Mobile apps (React Native)
- Creator tools (scheduling, bulk uploads)
- Decentralized moderation (community voting)
