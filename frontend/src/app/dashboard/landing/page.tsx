'use client';

import { useState } from 'react';
import PageBuilder from '@/components/creator-landing/builder/PageBuilder';
import { CreatorLandingPage } from '@/types/creator-landing';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { toast } from 'sonner';

export default function LandingPageBuilderPage() {
  const account = useCurrentAccount();
  const [initialData, setInitialData] = useState<Partial<CreatorLandingPage> | undefined>();

  const handleSave = async (data: CreatorLandingPage) => {
    // TODO: Implement save to backend/blockchain
    console.log('Saving landing page:', data);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // Store in localStorage for now
    localStorage.setItem(`landing-page-${account?.address}`, JSON.stringify(data));
  };

  const handlePublish = async (data: CreatorLandingPage) => {
    // TODO: Implement publish to blockchain
    console.log('Publishing landing page:', data);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // Store in localStorage for now
    localStorage.setItem(`landing-page-${account?.address}`, JSON.stringify(data));
  };

  if (!account) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Connect Your Wallet</h1>
          <p className="text-muted-foreground">
            Please connect your wallet to customize your landing page
          </p>
        </div>
      </div>
    );
  }

  return (
    <PageBuilder
      creatorAddress={account.address}
      initialData={initialData}
      onSave={handleSave}
      onPublish={handlePublish}
      onBack={() => window.history.back()}
    />
  );
}
