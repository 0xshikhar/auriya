'use client';

import { LandingSection } from '@/types/creator-landing';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

interface TiersSectionProps {
  section: LandingSection;
  theme: any;
}

export default function TiersSection({ section, theme }: TiersSectionProps) {
  const tiers = section.config.tiers || [];
  
  return (
    <div className="space-y-6">
      {section.config.showTitle !== false && (
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-2">{section.title || 'Membership Tiers'}</h2>
          <p className="text-sm opacity-80">
            {section.config.description || 'Choose a tier that works for you'}
          </p>
        </div>
      )}
      
      {tiers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tiers.map((tier) => (
            <div
              key={tier.id}
              className={`border rounded-xl p-6 ${
                tier.highlighted ? 'ring-2' : ''
              }`}
              style={{
                borderColor: tier.highlighted ? theme.primaryColor : `${theme.textColor}20`,
                ...(tier.highlighted && { '--tw-ring-color': theme.primaryColor } as any),
              }}
            >
              <div className="mb-4">
                <h3 className="text-xl font-bold mb-2">{tier.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold">{tier.price}</span>
                  <span className="text-sm opacity-60">/{tier.currency}</span>
                </div>
              </div>
              
              <ul className="space-y-2 mb-6">
                {tier.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <Check className="h-4 w-4 mt-0.5 flex-shrink-0" style={{ color: theme.primaryColor }} />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
              
              <Button
                className="w-full"
                style={{
                  backgroundColor: tier.highlighted ? theme.primaryColor : theme.accentColor,
                }}
              >
                Join
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <div 
          className="border rounded-lg p-8 text-center"
          style={{
            borderColor: `${theme.textColor}20`,
            backgroundColor: `${theme.accentColor}10`,
          }}
        >
          <p className="text-sm opacity-60">
            Your membership tiers will appear here automatically.
          </p>
        </div>
      )}
    </div>
  );
}
