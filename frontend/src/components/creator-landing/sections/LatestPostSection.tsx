'use client';

import { LandingSection } from '@/types/creator-landing';

interface LatestPostSectionProps {
  section: LandingSection;
  theme: any;
}

export default function LatestPostSection({ section, theme }: LatestPostSectionProps) {
  return (
    <div className="space-y-4">
      {section.config.showTitle !== false && (
        <h2 className="text-2xl font-bold">{section.title}</h2>
      )}
      
      <div 
        className="border rounded-lg p-8 text-center"
        style={{
          borderColor: `${theme.textColor}20`,
          backgroundColor: `${theme.accentColor}10`,
        }}
      >
        <p className="text-sm opacity-60">
          This section will be shown when you add posts.
        </p>
      </div>
    </div>
  );
}
