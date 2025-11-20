'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CreatorLandingPage } from '@/types/creator-landing';
import { Upload, ChevronRight, Palette } from 'lucide-react';
import Image from 'next/image';

interface DetailsPanelProps {
  landingPage: CreatorLandingPage;
  onUpdate: (updates: Partial<CreatorLandingPage>) => void;
}

interface ExpandableSection {
  id: string;
  title: string;
  expanded: boolean;
}

export default function DetailsPanel({ landingPage, onUpdate }: DetailsPanelProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    pageName: false,
    profilePhoto: false,
    headerOptions: false,
    themeColor: false,
    coverPhoto: false,
    about: false,
    socialLinks: false,
    membershipEarnings: false,
  });

  const toggleSection = (id: string) => {
    setExpandedSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleProfilePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // TODO: Upload to Walrus
    console.log('Upload profile photo:', file);
    // const walrusId = await uploadToWalrus(file);
    // onUpdate({ header: { ...landingPage.header, profilePhotoWalrusId: walrusId } });
  };

  const handleCoverPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // TODO: Upload to Walrus
    console.log('Upload cover photo:', file);
  };

  const predefinedColors = [
    '#1a1a1a', '#2d2d2d', '#3c3f44', '#5c5c5c', '#7c7c7c',
    '#9c9c9c', '#bcbcbc', '#dcdcdc',
  ];

  return (
    <div className="space-y-3">
      {/* Page Name */}
      <div className="border rounded-lg">
        <button
          onClick={() => toggleSection('pageName')}
          className="w-full px-4 py-3 flex items-center justify-between hover:bg-muted/50 transition-colors"
        >
          <div className="text-left">
            <div className="font-medium text-sm">Page name</div>
          </div>
          <ChevronRight
            className={`h-4 w-4 transition-transform ${
              expandedSections.pageName ? 'rotate-90' : ''
            }`}
          />
        </button>
        {expandedSections.pageName && (
          <div className="px-4 pb-4 space-y-3 border-t">
            <div className="pt-3">
              <Input
                value={landingPage.header.pageName}
                onChange={(e) =>
                  onUpdate({
                    header: { ...landingPage.header, pageName: e.target.value },
                  })
                }
                placeholder="Enter page name"
              />
            </div>
          </div>
        )}
      </div>

      {/* Profile Photo */}
      <div className="border rounded-lg">
        <button
          onClick={() => toggleSection('profilePhoto')}
          className="w-full px-4 py-3 flex items-center justify-between hover:bg-muted/50 transition-colors"
        >
          <div className="text-left">
            <div className="font-medium text-sm">Profile photo</div>
            <div className="text-xs text-muted-foreground">
              We recommend a square image at least 1024 by 1024px
            </div>
          </div>
          <ChevronRight
            className={`h-4 w-4 transition-transform ${
              expandedSections.profilePhoto ? 'rotate-90' : ''
            }`}
          />
        </button>
        {expandedSections.profilePhoto && (
          <div className="px-4 pb-4 border-t">
            <div className="pt-3 space-y-3">
              {landingPage.header.profilePhotoWalrusId && (
                <div className="w-24 h-24 rounded-lg overflow-hidden bg-muted">
                  {/* TODO: Display Walrus image */}
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    Photo
                  </div>
                </div>
              )}
              <div>
                <label htmlFor="profile-photo-upload">
                  <Button variant="outline" size="sm" className="cursor-pointer" asChild>
                    <span>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload photo
                    </span>
                  </Button>
                </label>
                <input
                  id="profile-photo-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleProfilePhotoUpload}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Header Options */}
      <div className="border rounded-lg">
        <button
          onClick={() => toggleSection('headerOptions')}
          className="w-full px-4 py-3 flex items-center justify-between hover:bg-muted/50 transition-colors"
        >
          <div className="text-left">
            <div className="font-medium text-sm">Header options</div>
          </div>
          <ChevronRight
            className={`h-4 w-4 transition-transform ${
              expandedSections.headerOptions ? 'rotate-90' : ''
            }`}
          />
        </button>
        {expandedSections.headerOptions && (
          <div className="px-4 pb-4 space-y-3 border-t pt-3">
            <div className="flex items-center gap-2">
              <input
                type="radio"
                id="use-profile-photo"
                name="header-option"
                checked={landingPage.header.showJoinButton}
                onChange={() =>
                  onUpdate({
                    header: { ...landingPage.header, showJoinButton: true },
                  })
                }
                className="w-4 h-4"
              />
              <label htmlFor="use-profile-photo" className="text-sm">
                Use profile photo
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Theme Color */}
      <div className="border rounded-lg">
        <button
          onClick={() => toggleSection('themeColor')}
          className="w-full px-4 py-3 flex items-center justify-between hover:bg-muted/50 transition-colors"
        >
          <div className="text-left">
            <div className="font-medium text-sm">Theme colour</div>
            <div className="text-xs text-muted-foreground">
              Options are automatically pulled from your photo
            </div>
          </div>
          <ChevronRight
            className={`h-4 w-4 transition-transform ${
              expandedSections.themeColor ? 'rotate-90' : ''
            }`}
          />
        </button>
        {expandedSections.themeColor && (
          <div className="px-4 pb-4 border-t pt-3">
            <div className="space-y-3">
              <div className="grid grid-cols-8 gap-2">
                {predefinedColors.map((color) => (
                  <button
                    key={color}
                    onClick={() =>
                      onUpdate({
                        theme: { ...landingPage.theme, accentColor: color },
                      })
                    }
                    className={`w-8 h-8 rounded-full border-2 ${
                      landingPage.theme.accentColor === color
                        ? 'border-primary ring-2 ring-primary ring-offset-2'
                        : 'border-border'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor="custom-color" className="text-sm">
                  Choose a custom colour
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="custom-color"
                    type="color"
                    value={landingPage.theme.accentColor}
                    onChange={(e) =>
                      onUpdate({
                        theme: { ...landingPage.theme, accentColor: e.target.value },
                      })
                    }
                    className="w-12 h-8 cursor-pointer"
                  />
                  <Input
                    type="text"
                    value={landingPage.theme.accentColor}
                    onChange={(e) =>
                      onUpdate({
                        theme: { ...landingPage.theme, accentColor: e.target.value },
                      })
                    }
                    className="w-24 h-8 text-xs font-mono"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Cover Photo */}
      <div className="border rounded-lg">
        <button
          onClick={() => toggleSection('coverPhoto')}
          className="w-full px-4 py-3 flex items-center justify-between hover:bg-muted/50 transition-colors"
        >
          <div className="text-left">
            <div className="font-medium text-sm">Upload cover photo</div>
          </div>
          <ChevronRight
            className={`h-4 w-4 transition-transform ${
              expandedSections.coverPhoto ? 'rotate-90' : ''
            }`}
          />
        </button>
        {expandedSections.coverPhoto && (
          <div className="px-4 pb-4 border-t pt-3">
            <div>
              <label htmlFor="cover-photo-upload">
                <Button variant="outline" size="sm" className="cursor-pointer" asChild>
                  <span>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload photo
                  </span>
                </Button>
              </label>
              <input
                id="cover-photo-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleCoverPhotoUpload}
              />
            </div>
          </div>
        )}
      </div>

      {/* About */}
      <div className="border rounded-lg">
        <button
          onClick={() => toggleSection('about')}
          className="w-full px-4 py-3 flex items-center justify-between hover:bg-muted/50 transition-colors"
        >
          <div className="text-left">
            <div className="font-medium text-sm">About</div>
            <div className="text-xs text-muted-foreground">
              Introduce yourself and your Patreon
            </div>
          </div>
          <ChevronRight
            className={`h-4 w-4 transition-transform ${
              expandedSections.about ? 'rotate-90' : ''
            }`}
          />
        </button>
        {expandedSections.about && (
          <div className="px-4 pb-4 border-t pt-3">
            <Textarea
              value={landingPage.about || ''}
              onChange={(e) => onUpdate({ about: e.target.value })}
              placeholder="Tell your story..."
              rows={4}
            />
          </div>
        )}
      </div>

      {/* Social Links */}
      <div className="border rounded-lg">
        <button
          onClick={() => toggleSection('socialLinks')}
          className="w-full px-4 py-3 flex items-center justify-between hover:bg-muted/50 transition-colors"
        >
          <div className="text-left">
            <div className="font-medium text-sm">Social links</div>
            <div className="text-xs text-muted-foreground">
              Display your social accounts on your page
            </div>
          </div>
          <ChevronRight
            className={`h-4 w-4 transition-transform ${
              expandedSections.socialLinks ? 'rotate-90' : ''
            }`}
          />
        </button>
        {expandedSections.socialLinks && (
          <div className="px-4 pb-4 border-t pt-3 space-y-3">
            <div>
              <Label className="text-xs">Twitter</Label>
              <Input
                value={landingPage.socialLinks.twitter || ''}
                onChange={(e) =>
                  onUpdate({
                    socialLinks: { ...landingPage.socialLinks, twitter: e.target.value },
                  })
                }
                placeholder="https://twitter.com/..."
              />
            </div>
            <div>
              <Label className="text-xs">Instagram</Label>
              <Input
                value={landingPage.socialLinks.instagram || ''}
                onChange={(e) =>
                  onUpdate({
                    socialLinks: { ...landingPage.socialLinks, instagram: e.target.value },
                  })
                }
                placeholder="https://instagram.com/..."
              />
            </div>
            <div>
              <Label className="text-xs">YouTube</Label>
              <Input
                value={landingPage.socialLinks.youtube || ''}
                onChange={(e) =>
                  onUpdate({
                    socialLinks: { ...landingPage.socialLinks, youtube: e.target.value },
                  })
                }
                placeholder="https://youtube.com/..."
              />
            </div>
          </div>
        )}
      </div>

      {/* Membership and Earnings */}
      <div className="border rounded-lg">
        <button
          onClick={() => toggleSection('membershipEarnings')}
          className="w-full px-4 py-3 flex items-center justify-between hover:bg-muted/50 transition-colors"
        >
          <div className="text-left">
            <div className="font-medium text-sm">Membership and earnings</div>
            <div className="text-xs text-muted-foreground">
              Control who does what on your page in settings
            </div>
          </div>
          <ChevronRight
            className={`h-4 w-4 transition-transform ${
              expandedSections.membershipEarnings ? 'rotate-90' : ''
            }`}
          />
        </button>
      </div>
    </div>
  );
}
