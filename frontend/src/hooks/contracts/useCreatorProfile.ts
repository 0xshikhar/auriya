"use client";

import { useSuiClientQuery } from '@mysten/dapp-kit';
import { CREATOR_PROFILE_PACKAGE_ID } from '@/lib/constants';
import { useState, useEffect } from 'react';

export interface CreatorProfileData {
  objectId: string;
  owner: string;
  displayName: string;
  bio: string;
  avatarWalrusId: string;
  bannerWalrusId: string;
  category: string;
  totalSubscribers: number;
  totalRevenueMist: number;
  createdAt: number;
  verified: boolean;
  suinsName?: string;
  socialLinks: string[];
}

/**
 * Hook to fetch creator profile for a given address
 * Returns the profile data if it exists, null otherwise
 */
export function useCreatorProfile(address?: string) {
  const [profile, setProfile] = useState<CreatorProfileData | null>(null);
  const [profileObjectId, setProfileObjectId] = useState<string | null>(null);

  // Query owned objects to find CreatorProfile
  const { data: ownedObjects, isLoading, error } = useSuiClientQuery(
    'getOwnedObjects',
    {
      owner: address!,
      filter: {
        StructType: `${CREATOR_PROFILE_PACKAGE_ID}::creator_profile::CreatorProfile`,
      },
      options: {
        showContent: true,
        showType: true,
      },
    },
    {
      enabled: !!address && !!CREATOR_PROFILE_PACKAGE_ID && !CREATOR_PROFILE_PACKAGE_ID.startsWith('0x...'),
    }
  );

  useEffect(() => {
    if (!ownedObjects?.data || ownedObjects.data.length === 0) {
      setProfile(null);
      setProfileObjectId(null);
      return;
    }

    // Get the first profile (users should only have one)
    const profileObj = ownedObjects.data[0];
    const objectId = profileObj.data?.objectId;
    const content = profileObj.data?.content as any;

    if (!content?.fields) {
      setProfile(null);
      setProfileObjectId(null);
      return;
    }

    const fields = content.fields;
    
    setProfileObjectId(objectId || null);
    setProfile({
      objectId: objectId || '',
      owner: fields.owner || '',
      displayName: fields.display_name || '',
      bio: fields.bio || '',
      avatarWalrusId: fields.avatar_walrus_id || '',
      bannerWalrusId: fields.banner_walrus_id || '',
      category: fields.category || '',
      totalSubscribers: parseInt(fields.total_subscribers || '0'),
      totalRevenueMist: parseInt(fields.total_revenue_mist || '0'),
      createdAt: parseInt(fields.created_at || '0'),
      verified: fields.verified || false,
      suinsName: fields.suins_name?.fields?.some || undefined,
      socialLinks: fields.social_links || [],
    });
  }, [ownedObjects]);

  return {
    profile,
    profileObjectId,
    hasProfile: !!profile,
    isLoading,
    error,
  };
}
