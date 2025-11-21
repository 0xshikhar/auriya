'use client';

import { useState, useEffect } from 'react';
import PageBuilder from '@/components/creator-landing/builder/PageBuilder';
import { CreatorLandingPage } from '@/types/creator-landing';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { toast } from 'sonner';
import { useCreateLandingPage, useUpdateLandingPage, usePublishLandingPage, useLandingPageByCreator } from '@/hooks/contracts/useLandingPage';
import { useCreatorProfile } from '@/hooks/contracts/useCreatorProfile';
import { cacheLandingPage, getCachedLandingPage } from '@/lib/landing-storage';
import Link from 'next/link';
import { AlertCircle } from 'lucide-react';

export default function LandingPageBuilderPage() {
  const account = useCurrentAccount();
  const { landingPage: existingPage, isLoading } = useLandingPageByCreator(account?.address);
  const { profile, profileObjectId, hasProfile, isLoading: profileLoading } = useCreatorProfile(account?.address);
  const { createLandingPage, isPending: isCreating } = useCreateLandingPage();
  const { updateLandingPage, isPending: isUpdating } = useUpdateLandingPage();
  const { publishLandingPage, isPending: isPublishing } = usePublishLandingPage();
  
  const [configObjectId, setConfigObjectId] = useState<string | null>(null);
  const [initialData, setInitialData] = useState<Partial<CreatorLandingPage> | undefined>();

  // Load existing landing page or cached data, and pre-populate from profile
  useEffect(() => {
    if (existingPage) {
      setInitialData(existingPage);
    } else if (account?.address) {
      const cached = getCachedLandingPage(account.address);
      if (cached) {
        setInitialData(cached);
      } else if (profile) {
        // Pre-populate landing page with profile data
        setInitialData({
          id: '',
          creatorAddress: account.address,
          header: {
            pageName: profile.displayName,
            displayName: profile.displayName,
            tagline: profile.bio,
            profilePhotoWalrusId: profile.avatarWalrusId,
            coverPhotoWalrusId: profile.bannerWalrusId,
            showJoinButton: true,
            joinButtonText: 'Join for free',
          },
          theme: {
            primaryColor: '#FF90E8',
            accentColor: '#3c3f44',
            backgroundColor: '#1a1a1a',
            textColor: '#ffffff',
            fontFamily: 'Inter',
            useProfilePhotoColor: false,
          },
          sections: [],
          socialLinks: {},
          customKeywords: [profile.category],
          visibility: 'public',
          isPublished: false,
          showMembershipEarnings: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        } as Partial<CreatorLandingPage>);
      }
    }
  }, [existingPage, account?.address, profile]);

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
        if (!profileObjectId) {
          toast.error('Please create your profile first at /dashboard/setup');
          return;
        }
        
        const result = await createLandingPage(profileObjectId, data, (progress) => {
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

  // Show loading state
  if (profileLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gumroad-pink mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your data...</p>
        </div>
      </div>
    );
  }

  // Require profile to be created first
  if (!hasProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md mx-auto text-center p-8">
          <div className="mb-6 p-6 bg-amber-50 border-2 border-amber-200 rounded-xl">
            <AlertCircle className="w-12 h-12 text-amber-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Profile Required</h1>
            <p className="text-gray-600 mb-6">
              You need to create your creator profile before customizing your landing page.
              Your profile provides the basic information (name, bio, images) that will be used on your landing page.
            </p>
            <Link 
              href="/dashboard/setup"
              className="inline-block bg-black text-white px-6 py-3 rounded-full hover:bg-gray-800 transition font-semibold"
            >
              Create Profile First →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {!existingPage && profile && (
        <div className="bg-blue-50 border-b-2 border-blue-200 p-4">
          <div className="max-w-7xl mx-auto flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-blue-900">
                <strong>Welcome!</strong> We&apos;ve pre-filled your landing page with your profile information. 
                Customize the sections, theme, and content below, then click <strong>Save</strong> to store on Walrus.
              </p>
            </div>
          </div>
        </div>
      )}
      
      <PageBuilder
        creatorAddress={account.address}
        initialData={initialData}
        onSave={handleSave}
        onPublish={handlePublish}
        onBack={() => window.history.back()}
      />
    </div>
  );
}
