'use client';

import { useState } from 'react';
import { CreatorLandingPage } from '@/types/creator-landing';
import { Button } from '@/components/ui/button';
import { LatestPostSection, RecentPostsSection, AboutSection, TiersSection } from '../sections';
import Image from 'next/image';
import { getWalrusUrl } from '@/lib/walrus';
import { useRouter } from 'next/navigation';
import MembershipModal from '../MembershipModal';
import { useCreatorTiers } from '@/hooks/contracts/useCreatorTiers';

interface LivePreviewProps {
  landingPage: CreatorLandingPage;
}

export default function LivePreview({ landingPage }: LivePreviewProps) {
  const { header, theme, sections } = landingPage;
  const router = useRouter();
  const [showMembershipModal, setShowMembershipModal] = useState(false);

  const enabledSections = sections
    .filter((section) => section.enabled)
    .sort((a, b) => a.order - b.order);

  // Get tiers from the creator's subscription contract
  const { tiers: creatorTiers } = useCreatorTiers(landingPage.creatorAddress);
  
  // Convert to TierDisplay format for the modal
  const tiers = creatorTiers.map(tier => ({
    id: tier.id,
    name: tier.name,
    price: tier.price,
    currency: tier.currency,
    benefits: tier.benefits,
    highlighted: false,
  }));

  const handleMembershipClick = () => {
    setShowMembershipModal(true);
  };

  const handleJoinClick = () => {
    // Open membership modal for subscription
    setShowMembershipModal(true);
  };

  return (
    <div
      className="min-h-screen rounded-lg overflow-hidden shadow-xl"
      style={{
        backgroundColor: theme.backgroundColor,
        color: theme.textColor,
        fontFamily: theme.fontFamily,
      }}
    >
      {/* Header */}
      <div
        className="relative"
        style={{
          backgroundColor: theme.accentColor,
        }}
      >
        {/* Cover Photo Area */}
        <div className="h-32 md:h-48 relative overflow-hidden">
          {header.coverPhotoWalrusId ? (
            <Image
              src={getWalrusUrl(header.coverPhotoWalrusId)}
              alt="Cover photo"
              fill
              className="object-cover"
              sizes="100vw"
            />
          ) : (
            <div className="w-full h-full" style={{ backgroundColor: theme.accentColor }} />
          )}
        </div>

        {/* Profile Section */}
        <div className="px-6 pb-6 relative">
          {/* Dark overlay for better text visibility */}
          {/* <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-transparent pointer-events-none" /> */}
          
          <div className="flex flex-col md:flex-row items-start md:items-end gap-4 -mt-16 relative z-10">
            {/* Profile Photo */}
            <div
              className="w-32 h-32 rounded-full border-4 flex-shrink-0 overflow-hidden relative"
              style={{
                borderColor: theme.backgroundColor,
                backgroundColor: theme.primaryColor,
              }}
            >
              {header.profilePhotoWalrusId ? (
                <Image
                  src={getWalrusUrl(header.profilePhotoWalrusId)}
                  alt="Profile photo"
                  fill
                  className="object-cover"
                  sizes="128px"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-4xl font-bold">
                  {header.displayName?.[0] || '?'}
                </div>
              )}
            </div>

            {/* Name and Actions */}
            <div className="flex-1 flex flex-col md:flex-row md:items-center justify-between gap-4 w-full pt-16">
              <div>
                <h1 className="text-3xl font-bold">
                  {header.displayName || 'Creator Name'}
                </h1>
                <p className="text-sm opacity-80">
                  {header.tagline || ' Creator'}
                </p>
                <p className="text-sm opacity-60">0 posts</p>
              </div>

              <div className="flex gap-2 flex-shrink-0">
                    <Button 
                  variant="outline"
                  onClick={handleMembershipClick}
                >
                  Membership
                </Button>
                {header.showJoinButton && (
                  <Button
                    onClick={handleJoinClick}
                    style={{
                      backgroundColor: theme.primaryColor,
                      color: '#000',
                    }}
                    className="font-semibold"
                  >
                    {header.joinButtonText || 'Join for free'}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tiers Section - Display if creator has tiers */}
      {creatorTiers.length > 0 && (
        <div className="px-6 py-8 border-b" style={{ borderColor: theme.accentColor + '20' }}>
          <div className="max-w-5xl mx-auto">
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-2">Membership Tiers</h2>
              <p className="opacity-80">Choose a tier to support and get exclusive access</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {creatorTiers.map((tier, i) => (
                <div
                  key={tier.id}
                  className="border-2 rounded-2xl p-6 hover:shadow-lg transition"
                  style={{
                    backgroundColor: theme.backgroundColor,
                    borderColor: i === 0 ? theme.primaryColor : theme.accentColor,
                  }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg"
                      style={{
                        backgroundColor: theme.primaryColor,
                        color: '#000',
                      }}
                    >
                      {i + 1}
                    </div>
                    <span className="text-xl font-bold">{tier.name}</span>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold">{tier.price}</span>
                      <span className="text-sm opacity-60">{tier.currency}</span>
                    </div>
                    <p className="text-sm opacity-60 mt-1">{tier.duration} days</p>
                  </div>
                  
                  <Button
                    onClick={handleMembershipClick}
                    className="w-full"
                    style={{
                      backgroundColor: i === 0 ? theme.primaryColor : theme.accentColor,
                      color: '#000',
                    }}
                  >
                    Subscribe
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Content Sections */}
      <div className="px-6 py-8 space-y-12">
        {enabledSections.map((section) => {
          switch (section.type) {
            case 'latest_post':
              return <LatestPostSection key={section.id} section={section} theme={theme} />;
            case 'recent_posts':
            case 'popular_posts':
            case 'explore_posts':
              return <RecentPostsSection key={section.id} section={section} theme={theme} />;
            case 'about':
              return <AboutSection key={section.id} section={section} theme={theme} about={landingPage.about} />;
            case 'tiers':
              return <TiersSection key={section.id} section={section} theme={theme} />;
            default:
              return (
                <div key={section.id} className="space-y-4">
                  {section.config.showTitle !== false && (
                    <h2 className="text-2xl font-bold">{section.title}</h2>
                  )}
                  <div className="border rounded-lg p-8 text-center opacity-60">
                    <p className="text-sm">
                      This section will be shown when you add content.
                    </p>
                  </div>
                </div>
              );
          }
        })}

        {enabledSections.length === 0 && (
          <div className="text-center py-12 opacity-60">
            <p>No sections enabled. Add sections from the Layout panel.</p>
          </div>
        )}
      </div>

      {/* Membership Modal */}
      <MembershipModal
        open={showMembershipModal}
        onClose={() => setShowMembershipModal(false)}
        creatorAddress={landingPage.creatorAddress || ''}
        creatorName={header.displayName || 'Creator'}
        tiers={tiers}
      />
    </div>
  );
}
