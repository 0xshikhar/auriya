'use client';

import { useEffect, useState } from 'react';
import { useLandingPageByCreator } from '@/hooks/contracts/useLandingPage';
import { CreatorLandingPage } from '@/types/creator-landing';
import LivePreview from '@/components/creator-landing/builder/LivePreview';
import { Loader2, RefreshCw } from 'lucide-react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function PublicLandingPage() {
  const params = useParams();
  const address = params?.address as string;
  const { landingPage, isLoading, error, refetch } = useLandingPageByCreator(address);
  const [pageData, setPageData] = useState<CreatorLandingPage | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (landingPage) {
      setPageData(landingPage);
      setRefreshing(false);
    }
  }, [landingPage]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading creator page...</p>
        </div>
      </div>
    );
  }

  if (error || !pageData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center max-w-md">
          <h1 className="text-4xl font-bold mb-4">404</h1>
          <p className="text-xl text-muted-foreground mb-2">Page Not Found</p>
          <p className="text-sm text-muted-foreground">
            This creator hasn&apos;t published their landing page yet.
          </p>
        </div>
      </div>
    );
  }

  // Check if page is published
  if (!pageData.isPublished) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold mb-4">Page Not Published</h1>
          <p className="text-muted-foreground">
            This creator page is not yet available to the public.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      {/* Refresh Button - Only visible for creator */}
      {pageData && (
        <div className="fixed bottom-6 right-6 z-50">
          <Button
            onClick={handleRefresh}
            disabled={refreshing}
            size="sm"
            variant="secondary"
            className="shadow-lg"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
        </div>
      )}
      <LivePreview landingPage={pageData} />
    </div>
  );
}
