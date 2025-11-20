'use client';

import { useState, useEffect } from 'react';
import PageBuilder from '@/components/creator-landing/builder/PageBuilder';
import { CreatorLandingPage } from '@/types/creator-landing';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { toast } from 'sonner';
import { useCreateLandingPage, useUpdateLandingPage, usePublishLandingPage, useLandingPageByCreator } from '@/hooks/contracts/useLandingPage';
import { cacheLandingPage, getCachedLandingPage } from '@/lib/landing-storage';

export default function LandingPageBuilderPage() {
  const account = useCurrentAccount();
  const { landingPage: existingPage, isLoading } = useLandingPageByCreator(account?.address);
  const { createLandingPage, isPending: isCreating } = useCreateLandingPage();
  const { updateLandingPage, isPending: isUpdating } = useUpdateLandingPage();
  const { publishLandingPage, isPending: isPublishing } = usePublishLandingPage();
  
  const [configObjectId, setConfigObjectId] = useState<string | null>(null);
  const [initialData, setInitialData] = useState<Partial<CreatorLandingPage> | undefined>();

  // Load existing landing page or cached data
  useEffect(() => {
    if (existingPage) {
      setInitialData(existingPage);
    } else if (account?.address) {
      const cached = getCachedLandingPage(account.address);
      if (cached) {
        setInitialData(cached);
      }
    }
  }, [existingPage, account?.address]);

  const handleSave = async (data: CreatorLandingPage) => {
    if (!account?.address) {
      toast.error('Please connect your wallet');
      return;
    }

    try {
      // Cache locally for quick access
      cacheLandingPage(account.address, data);

      if (configObjectId) {
        // Update existing landing page
        await updateLandingPage(configObjectId, data, (progress) => {
          if (progress < 100) {
            toast.loading(`Uploading to Walrus... ${progress}%`, { id: 'upload' });
          }
        });
        toast.success('Landing page updated!', { id: 'upload' });
      } else {
        // Create new landing page
        // TODO: Get creator profile ID from user's profile
        const creatorProfileId = '0x...'; // Replace with actual profile ID
        
        const result = await createLandingPage(creatorProfileId, data, (progress) => {
          if (progress < 100) {
            toast.loading(`Uploading to Walrus... ${progress}%`, { id: 'upload' });
          }
        });
        
        // Extract config object ID from result
        // @ts-ignore
        const objectId = result?.effects?.created?.[0]?.reference?.objectId;
        if (objectId) {
          setConfigObjectId(objectId);
        }
        
        toast.success('Landing page created!', { id: 'upload' });
      }
    } catch (error: any) {
      toast.error(error?.message || 'Failed to save landing page');
      console.error(error);
    }
  };

  const handlePublish = async (data: CreatorLandingPage) => {
    if (!account?.address) {
      toast.error('Please connect your wallet');
      return;
    }

    try {
      // First save the data
      await handleSave(data);
      
      // Then publish if we have a config object ID
      if (configObjectId) {
        await publishLandingPage(configObjectId);
        toast.success('Landing page published! 🎉');
        
        // Show the public URL
        const publicUrl = `${window.location.origin}/c/${account.address}`;
        toast.success(
          <div>
            <p className="font-semibold">Your page is live!</p>
            <a href={publicUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-500 underline">
              {publicUrl}
            </a>
          </div>,
          { duration: 10000 }
        );
      }
    } catch (error: any) {
      toast.error(error?.message || 'Failed to publish landing page');
      console.error(error);
    }
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
