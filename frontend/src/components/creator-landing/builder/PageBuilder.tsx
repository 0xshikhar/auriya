'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { CreatorLandingPage, DEFAULT_SECTIONS, DEFAULT_THEME, DEFAULT_HEADER } from '@/types/creator-landing';
import { Eye, Settings, Layout, ChevronLeft } from 'lucide-react';
import LayoutPanel from './LayoutPanel';
import DetailsPanel from './DetailsPanel';
import LivePreview from './LivePreview';
import { toast } from 'sonner';

interface PageBuilderProps {
  creatorAddress: string;
  initialData?: Partial<CreatorLandingPage>;
  onSave?: (data: CreatorLandingPage) => Promise<void>;
  onPublish?: (data: CreatorLandingPage) => Promise<void>;
  onBack?: () => void;
}

type ActivePanel = 'layout' | 'details';

export default function PageBuilder({
  creatorAddress,
  initialData,
  onSave,
  onPublish,
  onBack,
}: PageBuilderProps) {
  const [landingPage, setLandingPage] = useState<CreatorLandingPage>({
    id: initialData?.id || '',
    creatorAddress,
    header: initialData?.header || DEFAULT_HEADER,
    theme: initialData?.theme || DEFAULT_THEME,
    sections: initialData?.sections || DEFAULT_SECTIONS,
    about: initialData?.about || '',
    socialLinks: initialData?.socialLinks || {},
    customKeywords: initialData?.customKeywords || [],
    visibility: initialData?.visibility || 'public',
    isPublished: initialData?.isPublished || false,
    showMembershipEarnings: initialData?.showMembershipEarnings ?? true,
    createdAt: initialData?.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...initialData,
  });

  const [activePanel, setActivePanel] = useState<ActivePanel>('layout');
  const [saving, setSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  // Update landing page when initialData changes (e.g., when profile loads)
  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setLandingPage({
        id: initialData?.id || '',
        creatorAddress,
        header: initialData?.header || DEFAULT_HEADER,
        theme: initialData?.theme || DEFAULT_THEME,
        sections: initialData?.sections || DEFAULT_SECTIONS,
        about: initialData?.about || '',
        socialLinks: initialData?.socialLinks || {},
        customKeywords: initialData?.customKeywords || [],
        visibility: initialData?.visibility || 'public',
        isPublished: initialData?.isPublished || false,
        showMembershipEarnings: initialData?.showMembershipEarnings ?? true,
        createdAt: initialData?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...initialData,
      });
    }
  }, [initialData, creatorAddress]);

  const updateLandingPage = (updates: Partial<CreatorLandingPage>) => {
    setLandingPage((prev) => ({
      ...prev,
      ...updates,
      updatedAt: new Date().toISOString(),
    }));
  };

  const handleSave = async () => {
    if (!onSave) return;
    
    setSaving(true);
    try {
      await onSave(landingPage);
      toast.success('Changes saved');
    } catch (error) {
      toast.error('Failed to save changes');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!onPublish) return;
    
    setSaving(true);
    try {
      const publishedPage = {
        ...landingPage,
        isPublished: true,
        lastPublishedAt: new Date().toISOString(),
      };
      await onPublish(publishedPage);
      setLandingPage(publishedPage);
      toast.success('Page published successfully!');
    } catch (error) {
      toast.error('Failed to publish page');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  if (previewMode) {
    return (
      <div className="min-h-screen bg-background">
        <div className="fixed top-0 left-0 right-0 z-50 bg-background border-b">
          <div className="container mx-auto px-6 py-3 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => setPreviewMode(false)}>
                <ChevronLeft className="h-4 w-4 mr-2" />
                Back to editor
              </Button>
              <span className="text-sm text-muted-foreground">Preview Mode</span>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleSave} disabled={saving}>
                Save
              </Button>
              <Button size="sm" onClick={handlePublish} disabled={saving}>
                Publish
              </Button>
            </div>
          </div>
        </div>
        <div className="pt-16">
          <LivePreview landingPage={landingPage} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Header */}
      <div className="border-b bg-background sticky top-0 z-40">
        <div className="px-6 py-3 flex justify-between items-center">
          <div className="flex items-center gap-4">
            {onBack && (
              <Button variant="ghost" size="sm" onClick={onBack}>
                <ChevronLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            )}
            <h1 className="text-xl font-semibold">{activePanel === 'layout' ? 'Layout' : 'Details'}</h1>
            <p className="text-sm text-muted-foreground hidden md:block">
              {activePanel === 'layout' 
                ? 'Customise the layout of your page to showcase your best work.'
                : 'Customise your page details and appearance.'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={landingPage.visibility}
              onChange={(e) => updateLandingPage({ visibility: e.target.value as any })}
              className="px-3 py-1.5 text-sm border rounded-md bg-background"
            >
              <option value="public">Public</option>
              <option value="unlisted">Unlisted</option>
              <option value="private">Private</option>
            </select>
            <Button variant="outline" size="sm">
              <Eye className="h-4 w-4 mr-2" />
              View page
            </Button>
            <Button variant="outline" size="sm" onClick={handleSave} disabled={saving}>
              Cancel
            </Button>
            <Button size="sm" onClick={handlePublish} disabled={saving}>
              {saving ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Controls */}
        <div className="w-80 border-r bg-background overflow-y-auto">
          {/* Tab Navigation */}
          <div className="border-b">
            <div className="flex">
              <button
                onClick={() => setActivePanel('layout')}
                className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activePanel === 'layout'
                    ? 'border-primary text-foreground'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <Layout className="h-4 w-4 inline-block mr-2" />
                Layout
              </button>
              <button
                onClick={() => setActivePanel('details')}
                className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activePanel === 'details'
                    ? 'border-primary text-foreground'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <Settings className="h-4 w-4 inline-block mr-2" />
                Details
              </button>
            </div>
          </div>

          {/* Panel Content */}
          <div className="p-4">
            {activePanel === 'layout' ? (
              <LayoutPanel
                landingPage={landingPage}
                onUpdate={updateLandingPage}
              />
            ) : (
              <DetailsPanel
                landingPage={landingPage}
                onUpdate={updateLandingPage}
              />
            )}
          </div>
        </div>

        {/* Right Side - Live Preview */}
        <div className="flex-1 bg-muted/30 overflow-y-auto">
          <div className="min-h-full flex items-start justify-center p-8">
            <div className="w-full max-w-4xl">
              <LivePreview landingPage={landingPage} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
