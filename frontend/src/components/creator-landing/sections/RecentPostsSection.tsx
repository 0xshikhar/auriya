'use client';

import { LandingSection } from '@/types/creator-landing';
import { ChevronRight } from 'lucide-react';

interface RecentPostsSectionProps {
  section: LandingSection;
  theme: any;
}

export default function RecentPostsSection({ section, theme }: RecentPostsSectionProps) {
  const maxItems = section.config.maxItems || 6;
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        {section.config.showTitle !== false && (
          <h2 className="text-2xl font-bold">{section.title}</h2>
        )}
        <button className="flex items-center gap-1 text-sm opacity-80 hover:opacity-100">
          View all
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
      
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
