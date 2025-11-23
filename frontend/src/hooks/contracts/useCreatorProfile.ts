"use client";

import { useSuiClient, useSuiClientQuery } from '@mysten/dapp-kit';
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
  contentRegistryId?: string;
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
  const suiClient = useSuiClient();

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
    async function resolveProfileViaEvents(addr: string): Promise<{ objectId: string; fields: any } | null> {
      try {
        const eventType = `${CREATOR_PROFILE_PACKAGE_ID}::creator_profile::ProfileCreated`;
        const events = await suiClient.queryEvents({ query: { MoveEventType: eventType }, limit: 100, order: 'descending' });
        const found = (events.data as any[]).find((e: any) => (e.parsedJson?.owner || '').toLowerCase() === addr.toLowerCase());
        const id = found?.parsedJson?.profile_id as string | undefined;
        if (!id) return null;
        const obj = await suiClient.getObject({ id, options: { showContent: true, showType: true } });
        const fields = (obj.data as any)?.content?.fields;
        if (!fields) return null;
        return { objectId: id, fields };
      } catch {
        return null;
      }
    }

    async function load() {
      if (!address) {
        setProfile(null);
        setProfileObjectId(null);
        return;
      }

      let objectId: string | undefined;
      let fields: any | undefined;

      if (!ownedObjects?.data || ownedObjects.data.length === 0) {
        const fallback = await resolveProfileViaEvents(address);
        if (!fallback) {
          setProfile(null);
          setProfileObjectId(null);
          return;
        }
        objectId = fallback.objectId;
        fields = fallback.fields;
      } else {
        const profileObj = ownedObjects.data[0];
        objectId = profileObj.data?.objectId;
        fields = (profileObj.data?.content as any)?.fields;
        if (!fields) {
          setProfile(null);
          setProfileObjectId(null);
          return;
        }
      }
    
    // Helper to read Option<T> encoded by Sui as { fields: { vec: [value?] } } or sometimes { fields: { some: value } }
    const readOption = (opt: any): any | undefined => {
      if (!opt || !opt.fields) return undefined;
      if (Array.isArray(opt.fields.vec)) return opt.fields.vec[0];
      if (Object.prototype.hasOwnProperty.call(opt.fields, 'some')) return opt.fields.some;
      return undefined;
    };

    setProfileObjectId(objectId || null);
    setProfile({
      objectId: objectId || '',
      owner: fields.owner || '',
      displayName: fields.display_name || '',
      bio: fields.bio || '',
      avatarWalrusId: fields.avatar_walrus_id || '',
      bannerWalrusId: fields.banner_walrus_id || '',
      category: fields.category || '',
      contentRegistryId: readOption(fields.content_registry_id),
      totalSubscribers: parseInt(fields.total_subscribers || '0'),
      totalRevenueMist: parseInt(fields.total_revenue_mist || '0'),
      createdAt: parseInt(fields.created_at || '0'),
      verified: fields.verified || false,
      suinsName: readOption(fields.suins_name),
      socialLinks: fields.social_links || [],
    });
  }

    load();
  }, [address, ownedObjects, suiClient]);

  return {
    profile,
    profileObjectId,
    hasProfile: !!profile,
    isLoading,
    error,
  };
}
