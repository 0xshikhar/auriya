import { useSignAndExecuteTransaction, useSuiClientQuery } from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';
import { CREATOR_PROFILE_PACKAGE_ID, LANDING_PAGE_REGISTRY_ID } from '@/lib/constants';
import { CreatorLandingPage } from '@/types/creator-landing';
import { saveLandingPageToWalrus, loadLandingPageFromWalrus } from '@/lib/landing-storage';
import { useState, useEffect } from 'react';

/**
 * Hook to create a new landing page
 */
export function useCreateLandingPage() {
  const signAndExecute = useSignAndExecuteTransaction();
  const [uploading, setUploading] = useState(false);

  const createLandingPage = async (
    creatorProfileId: string,
    landingPage: CreatorLandingPage,
    onProgress?: (progress: number) => void
  ) => {
    try {
      setUploading(true);
      
      // Step 1: Upload landing page JSON to Walrus
      const { blobId } = await saveLandingPageToWalrus(landingPage, onProgress);
      
      // Step 2: Create on-chain reference
      const tx = new Transaction();
      
      tx.moveCall({
        target: `${CREATOR_PROFILE_PACKAGE_ID}::creator_landing::create_landing_page`,
        arguments: [
          tx.object(LANDING_PAGE_REGISTRY_ID),
          tx.pure.id(creatorProfileId),
          tx.pure.string(blobId),
          tx.object('0x6'), // Clock object
        ],
      });
      
      const result = await signAndExecute.mutateAsync({
        transaction: tx,
      });
      
      return {
        ...result,
        blobId,
      };
    } finally {
      setUploading(false);
    }
  };

  return {
    createLandingPage,
    isPending: signAndExecute.isPending || uploading,
  };
}

/**
 * Hook to update an existing landing page
 */
export function useUpdateLandingPage() {
  const signAndExecute = useSignAndExecuteTransaction();
  const [uploading, setUploading] = useState(false);

  const updateLandingPage = async (
    configObjectId: string,
    landingPage: CreatorLandingPage,
    onProgress?: (progress: number) => void
  ) => {
    try {
      setUploading(true);
      
      // Step 1: Upload updated landing page JSON to Walrus
      const { blobId } = await saveLandingPageToWalrus(landingPage, onProgress);
      
      // Step 2: Update on-chain reference
      const tx = new Transaction();
      
      tx.moveCall({
        target: `${CREATOR_PROFILE_PACKAGE_ID}::creator_landing::update_landing_page`,
        arguments: [
          tx.object(configObjectId),
          tx.pure.string(blobId),
          tx.object('0x6'), // Clock object
        ],
      });
      
      return signAndExecute.mutateAsync({
        transaction: tx,
      });
    } finally {
      setUploading(false);
    }
  };

  return {
    updateLandingPage,
    isPending: signAndExecute.isPending || uploading,
  };
}

/**
 * Hook to publish a landing page
 */
export function usePublishLandingPage() {
  const signAndExecute = useSignAndExecuteTransaction();

  const publishLandingPage = async (configObjectId: string) => {
    const tx = new Transaction();
    
    tx.moveCall({
      target: `${CREATOR_PROFILE_PACKAGE_ID}::creator_landing::publish_landing_page`,
      arguments: [
        tx.object(configObjectId),
        tx.object('0x6'), // Clock object
      ],
    });
    
    return signAndExecute.mutateAsync({
      transaction: tx,
    });
  };

  return {
    publishLandingPage,
    isPending: signAndExecute.isPending,
  };
}

/**
 * Hook to fetch landing page config by object ID
 */
export function useLandingPageConfig(configObjectId?: string) {
  return useSuiClientQuery(
    'getObject',
    {
      id: configObjectId!,
      options: {
        showContent: true,
        showOwner: true,
      },
    },
    {
      enabled: !!configObjectId,
    }
  );
}

/**
 * Hook to fetch and load full landing page data
 */
export function useLandingPageData(configObjectId?: string) {
  const { data: configData, isLoading: configLoading } = useLandingPageConfig(configObjectId);
  const [landingPage, setLandingPage] = useState<CreatorLandingPage | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load landing page from Walrus when config is available
  useEffect(() => {
    if (!configData?.data?.content) return;
    
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Extract Walrus blob ID from on-chain data
        const content = configData?.data?.content as any;
        const blobId = content?.fields?.walrus_blob_id;
        
        if (!blobId) {
          throw new Error('No Walrus blob ID found');
        }
        
        // Load from Walrus
        const data = await loadLandingPageFromWalrus(blobId);
        setLandingPage(data);
      } catch (err: any) {
        setError(err?.message || 'Failed to load landing page');
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [configData]);

  return {
    landingPage,
    config: configData,
    isLoading: configLoading || loading,
    error,
  };
}

/**
 * Hook to fetch landing page by creator address
 * Queries owned objects to find the landing page config
 */
export function useLandingPageByCreator(creatorAddress?: string) {
  const { data: ownedObjects, refetch } = useSuiClientQuery(
    'getOwnedObjects',
    {
      owner: creatorAddress!,
      filter: {
        StructType: `${CREATOR_PROFILE_PACKAGE_ID}::creator_landing::LandingPageConfig`,
      },
      options: {
        showContent: true,
      },
    },
    {
      enabled: !!creatorAddress,
      refetchInterval: 5000, // Refetch every 5 seconds
      staleTime: 0, // Always consider data stale
    }
  );

  const configObjectId = ownedObjects?.data?.[0]?.data?.objectId;
  
  const landingPageData = useLandingPageData(configObjectId);
  
  return {
    ...landingPageData,
    refetch,
  };
}
