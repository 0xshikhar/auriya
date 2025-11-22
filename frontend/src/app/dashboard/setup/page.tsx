"use client";

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import WalrusUploader from '@/components/walrus/WalrusUploader';
import { useCreateProfile } from '@/hooks/contracts/useCreateProfile';
import { useCreatorProfile } from '@/hooks/contracts/useCreatorProfile';
import { Textarea } from '@/components/ui/textarea';
import Image from 'next/image';
import { getWalrusUrl } from '@/lib/walrus';
import { User, Image as ImageIcon, FileText, CheckCircle2, AlertCircle, Wallet, ArrowLeft } from 'lucide-react';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { useZkLogin } from '@/hooks/useZkLogin';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ProfileSetupPage() {
  const { createProfile, isPending } = useCreateProfile();
  const currentAccount = useCurrentAccount();
  const { session: zkLoginSession } = useZkLogin();
  const router = useRouter();

  // Check if user already has a profile
  const { profile, hasProfile, isLoading: profileLoading } = useCreatorProfile(currentAccount?.address);

  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [category, setCategory] = useState('Art');
  const [avatarId, setAvatarId] = useState<string>('');
  const [bannerId, setBannerId] = useState<string>('');
  const [txDigest, setTxDigest] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Check if only zkLogin is connected (wallet is required for transactions)
  const hasWallet = !!currentAccount;
  const hasOnlyZkLogin = !hasWallet && !!zkLoginSession;

  // Pre-fill form if profile exists (edit mode)
  React.useEffect(() => {
    if (profile) {
      setDisplayName(profile.displayName);
      setBio(profile.bio);
      setCategory(profile.category);
      setAvatarId(profile.avatarWalrusId);
      setBannerId(profile.bannerWalrusId);
    }
  }, [profile]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setTxDigest(null);

    if (hasProfile) {
      setError('You already have a profile. Profile updates coming soon!');
      return;
    }

    try {
      const res = await createProfile({
        displayName,
        bio,
        avatarWalrusId: avatarId,
        bannerWalrusId: bannerId,
        category,
      });
      // @ts-ignore
      setTxDigest(res?.digest || null);

      // Redirect to landing page after successful creation
      setTimeout(() => {
        router.push('/dashboard/landing');
      }, 2000);
    } catch (err: any) {
      setError(err?.message || 'Failed to create profile');
    }
  };

  // Show loading state while checking for existing profile
  if (profileLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gumroad-pink mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Back button */}
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-gray-600 hover:text-black mb-6 transition">
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold text-black mb-4">
            {hasProfile ? 'Your Profile' : 'Create Your Profile'}
          </h1>
          <p className="text-xl text-gray-600">
            {hasProfile
              ? 'Your onchain creator identity. Profile editing coming soon!'
              : 'Set up your onchain creator identity. All media stored permanently on Walrus.'}
          </p>
        </div>

        {/* Profile exists notification */}
        {hasProfile && (
          <div className="mb-8 p-6 bg-gumroad-pink/20 border-2 border-blue-200 rounded-xl flex items-start gap-3">
            <CheckCircle2 className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-lg font-semibold text-gray-900 mb-1">Profile Already Created</p>
              <p className="text-sm text-gray-700 mb-3">
                You created your profile on {new Date(profile!.createdAt).toLocaleDateString()}.
                Profile editing functionality is coming soon.
              </p>
              <Link
                href="/dashboard/landing"
                className="inline-flex items-center gap-2 m-1 bg-gumroad-pink text-black px-4 py-2 rounded-lg hover:bg-gumroad-pink transition text-sm font-medium"
              >
                Customize Your Landing Page →
              </Link>
              {/* go to dashboard */}
              <Link
                href="/dashboard/"
                className="inline-flex items-center  m-1 gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-black transition text-sm font-medium"
              >
                Go to Dashboard →
              </Link>
            </div>
          </div>
        )}

        {/* Progress indicators */}
        <div className="flex items-center justify-center gap-4 mb-12">
          <div className="flex items-center gap-2">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${displayName && bio ? 'bg-gumroad-pink' : 'bg-gray-200'}`}>
              <User className="w-5 h-5" />
            </div>
            <span className="text-sm font-medium">Basic Info</span>
          </div>
          <div className="w-16 h-0.5 bg-gray-200"></div>
          <div className="flex items-center gap-2">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${avatarId && bannerId ? 'bg-gumroad-pink' : 'bg-gray-200'}`}>
              <ImageIcon className="w-5 h-5" />
            </div>
            <span className="text-sm font-medium">Media</span>
          </div>
          <div className="w-16 h-0.5 bg-gray-200"></div>
          <div className="flex items-center gap-2">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${txDigest ? 'bg-gumroad-pink' : 'bg-gray-200'}`}>
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <span className="text-sm font-medium">Complete</span>
          </div>
        </div>

        <div className="bg-white border-2 border-gray-200 rounded-2xl p-10 shadow-sm">{/* Form content */}

          {/* Wallet connection warning */}
          {hasOnlyZkLogin && (
            <div className="mb-6 p-6 bg-amber-50 border-2 border-amber-200 rounded-xl flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-lg font-semibold text-amber-900 mb-1">Sui Wallet Required</p>
                <p className="text-sm text-amber-700 mb-3">
                  Profile creation requires a Sui wallet connection to sign transactions.
                  or use pre-funded wallet ZK wallet
                </p>
                <p className="text-sm text-amber-700">
                  Please connect your Sui wallet using the wallet button in the navigation bar to continue.
                </p>
              </div>
            </div>
          )}

          {!hasWallet && !zkLoginSession && (
            <div className="mb-6 p-6 bg-red-50 border-2 border-red-200 rounded-xl flex items-start gap-3">
              <Wallet className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-lg font-semibold text-red-800 mb-1">No Wallet Connected</p>
                <p className="text-sm text-red-600">
                  Please connect your Sui wallet or sign in with zkLogin to create a profile.
                </p>
              </div>
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Display Name</Label>
                <Input value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="e.g. Alice" required />
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Art / Music / Writing" required />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Bio</Label>
              <Textarea value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Short intro about you..." rows={4} required />
              <p className="text-xs text-gray-500">Keep it concise. You can edit this later.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <ImageIcon className="w-5 h-5 text-gumroad-pink" />
                  <Label className="text-lg font-semibold">Avatar</Label>
                </div>
                <WalrusUploader label="" accept="image/*" maxSizeMB={10} onUploaded={(r) => setAvatarId(r.blobId)} />
                {avatarId && (
                  <div className="relative h-32 w-32 overflow-hidden rounded-full border-4 border-gumroad-pink shadow-lg">
                    <Image src={getWalrusUrl(avatarId)} alt="Avatar preview" fill sizes="128px" className="object-cover" />
                  </div>
                )}
                <p className="text-sm text-gray-500">Recommended: 400x400px, max 10MB</p>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <ImageIcon className="w-5 h-5 text-gumroad-pink" />
                  <Label className="text-lg font-semibold">Banner</Label>
                </div>
                <WalrusUploader label="" accept="image/*" maxSizeMB={20} onUploaded={(r) => setBannerId(r.blobId)} />
                {bannerId && (
                  <div className="relative h-32 w-full overflow-hidden rounded-xl border-2 border-gray-200 shadow-lg">
                    <Image src={getWalrusUrl(bannerId)} alt="Banner preview" fill sizes="100vw" className="object-cover" />
                  </div>
                )}
                <p className="text-sm text-gray-500">Recommended: 1500x500px, max 20MB</p>
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-8 border-t border-gray-200">
              <Button
                type="submit"
                disabled={isPending || !avatarId || !bannerId || !hasWallet || hasProfile}
                className="bg-black hover:bg-gray-800 text-white px-8 py-3 rounded-full font-semibold text-lg disabled:opacity-50"
              >
                {isPending ? 'Creating Profile...' : hasProfile ? 'Profile Already Created' : hasWallet ? 'Create Profile' : 'Connect Wallet to Continue'}
              </Button>
            </div>

            {txDigest && (
              <div className="p-6 bg-gumroad-pink/10 border-2 border-gumroad-pink rounded-xl flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-gumroad-pink flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-lg font-semibold text-black mb-1">Profile Created Successfully!</p>
                  <p className="text-sm text-gray-600 break-all mb-2">Transaction: {txDigest}</p>
                  <p className="text-sm text-gray-600">Redirecting to landing page customization...</p>
                </div>
              </div>
            )}
            {error && (
              <div className="p-6 bg-red-50 border-2 border-red-200 rounded-xl flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-lg font-semibold text-red-800 mb-1">Error</p>
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

