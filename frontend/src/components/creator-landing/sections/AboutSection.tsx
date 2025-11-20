'use client';

import { LandingSection } from '@/types/creator-landing';

interface AboutSectionProps {
  section: LandingSection;
  theme: any;
  about?: string;
}

export default function AboutSection({ section, theme, about }: AboutSectionProps) {
  return (
    <div className="space-y-4">
      {section.config.showTitle !== false && (
        <h2 className="text-2xl font-bold">{section.title}</h2>
      )}
      
      <div className="prose max-w-none">
        {about ? (
          <p className="whitespace-pre-wrap opacity-90">{about}</p>
        ) : (
          <div 
            className="border rounded-lg p-8 text-center"
            style={{
              borderColor: `${theme.textColor}20`,
              backgroundColor: `${theme.accentColor}10`,
            }}
          >
            <p className="text-sm opacity-60">
              Add your about section in the Details panel.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
