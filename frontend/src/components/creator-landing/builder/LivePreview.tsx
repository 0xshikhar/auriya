'use client';

import { CreatorLandingPage } from '@/types/creator-landing';
import { Button } from '@/components/ui/button';
import { LatestPostSection, RecentPostsSection, AboutSection, TiersSection } from '../sections';

interface LivePreviewProps {
  landingPage: CreatorLandingPage;
}

export default function LivePreview({ landingPage }: LivePreviewProps) {
  const { header, theme, sections } = landingPage;

  const enabledSections = sections
    .filter((section) => section.enabled)
    .sort((a, b) => a.order - b.order);

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
        <div className="h-32 md:h-48" />

        {/* Profile Section */}
        <div className="px-6 pb-6">
          <div className="flex flex-col md:flex-row items-start md:items-end gap-4 -mt-16">
            {/* Profile Photo */}
            <div
              className="w-32 h-32 rounded-full border-4 flex-shrink-0"
              style={{
                borderColor: theme.backgroundColor,
                backgroundColor: theme.primaryColor,
              }}
            >
              {header.profilePhotoWalrusId ? (
                <div className="w-full h-full rounded-full bg-muted" />
              ) : (
                <div className="w-full h-full rounded-full flex items-center justify-center text-4xl font-bold">
                  {header.displayName?.[0] || '?'}
                </div>
              )}
            </div>

            {/* Name and Actions */}
            <div className="flex-1 flex flex-col md:flex-row md:items-end justify-between gap-4 w-full">
              <div>
                <h1 className="text-3xl font-bold mb-1">
                  {header.displayName || 'Creator Name'}
                </h1>
                <p className="text-sm opacity-80">
                  {header.tagline || 'Full stack dev'}
                </p>
                <p className="text-sm opacity-60 mt-1">0 posts</p>
              </div>

              <div className="flex gap-2">
                <Button
                  style={{
                    backgroundColor: theme.backgroundColor,
                    color: theme.textColor,
                  }}
                >
                  Home
                </Button>
                <Button variant="outline">Membership</Button>
                {header.showJoinButton && (
                  <Button
                    style={{
                      backgroundColor: theme.backgroundColor,
                      color: theme.textColor,
                    }}
                  >
                    {header.joinButtonText || 'Join for free'}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

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
    </div>
  );
}
