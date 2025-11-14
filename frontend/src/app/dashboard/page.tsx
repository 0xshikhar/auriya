"use client";

import Link from 'next/link';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
  const account = useCurrentAccount();

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Creator Dashboard</h1>
        <p className="text-sm text-white/60 mt-1">Manage your profile, tiers, and content.</p>
      </div>

      {!account && (
        <Card>
          <CardHeader>
            <CardTitle>Connect to continue</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-white/70">Connect a wallet or sign in with zkLogin from the navbar to access creator tools.</p>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
        <Card>
          <CardHeader>
            <CardTitle>1. Profile Setup</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-white/70">Create your creator profile with avatar, banner, and bio.</p>
            <Button asChild>
              <Link href="/dashboard/setup">Create / Edit Profile</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>2. Subscription Tiers</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-white/70">Configure Bronze/Silver/Gold pricing and duration.</p>
            <Button asChild variant="secondary">
              <Link href="/dashboard/tiers">Manage Tiers</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>3. Create Content</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-white/70">Upload media to Walrus and post gated content.</p>
            <Button asChild variant="outline">
              <Link href="/dashboard/content/new">New Post</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
