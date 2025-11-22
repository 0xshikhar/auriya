'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Check, X, Wallet } from 'lucide-react';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { toast } from 'sonner';

import { TierDisplay } from '@/types/creator-landing';
import { usePurchaseSubscription } from '@/hooks/contracts/usePurchaseSubscription';
import { useZkLogin } from '@/hooks/useZkLogin';

interface MembershipModalProps {
  open: boolean;
  onClose: () => void;
  creatorAddress: string;
  creatorName: string;
  tiers: TierDisplay[];
  subscriptionObjectId?: string;
}

export default function MembershipModal({
  open,
  onClose,
  creatorAddress,
  creatorName,
  tiers,
  subscriptionObjectId,
}: MembershipModalProps) {
  const account = useCurrentAccount();
  const { session: zkLoginSession } = useZkLogin();
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [subscribing, setSubscribing] = useState(false);
  const { purchase, isPending } = usePurchaseSubscription();
  
  const hasWallet = !!account;
  const hasZkLogin = !!zkLoginSession;
  const canTransact = hasWallet;

  const handleSubscribe = async (tier: TierDisplay) => {
    if (!canTransact) {
      if (hasZkLogin) {
        toast.error('Please connect a wallet to make transactions', {
          description: 'zkLogin is for viewing content. Transactions require a wallet.',
        });
      } else {
        toast.error('Please connect your wallet to subscribe');
      }
      return;
    }
    if (!subscriptionObjectId) {
      toast.error('Creator subscription is not available yet. Please refresh.');
      return;
    }

    setSubscribing(true);
    setSelectedTier(tier.id);

    try {
      toast.loading('Processing subscription...', { id: 'subscribe' });

      // Determine numeric tier id and amount
      const tierId = (tier.tierId ?? Number(String(tier.id).replace('tier-', ''))) || 1;
      const amountSui = parseFloat(tier.price);

      console.log('[MembershipModal] Purchasing', { subscriptionObjectId, tierId, amountSui });

      const res = await purchase({ subsId: subscriptionObjectId, tierId, amountSui });
      const digest = (res as any)?.digest;

      toast.success(`Successfully subscribed to ${tier.name}!`, {
        id: 'subscribe',
        description: digest ? `Tx: ${digest}` : undefined,
      });
      onClose();
    } catch (error: any) {
      toast.error(error?.message || 'Failed to subscribe', { id: 'subscribe' });
    } finally {
      setSubscribing(false);
      setSelectedTier(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Support {creatorName}
          </DialogTitle>
          <p className="text-muted-foreground">
            Choose a membership tier and get exclusive benefits
          </p>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {tiers.map((tier) => (
            <div
              key={tier.id}
              className={`relative border rounded-lg p-6 flex flex-col ${
                tier.highlighted
                  ? 'border-primary shadow-lg ring-2 ring-primary'
                  : 'border-border'
              }`}
            >
              {tier.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold">
                  Most Popular
                </div>
              )}

              <div className="mb-4">
                <h3 className="text-xl font-bold mb-2">{tier.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold">
                    {tier.currency === 'SUI' ? '◎' : '$'}
                    {tier.price}
                  </span>
                  <span className="text-muted-foreground">/month</span>
                </div>
              </div>

              <div className="flex-1 mb-6">
                <p className="text-sm font-semibold mb-3">What you&apos;ll get:</p>
                <ul className="space-y-2">
                  {tier.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Button
                onClick={() => handleSubscribe(tier)}
                disabled={subscribing || isPending}
                className={`w-full ${
                  tier.highlighted
                    ? 'bg-primary hover:bg-primary/90'
                    : ''
                }`}
              >
                {subscribing && selectedTier === tier.id
                  ? 'Processing...'
                  : 'Subscribe'}
              </Button>
            </div>
          ))}
        </div>

        {tiers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              This creator hasn&apos;t set up membership tiers yet.
            </p>
          </div>
        )}

        <div className="mt-6 pt-6 border-t space-y-3">
          {hasZkLogin && !hasWallet && (
            <div className="flex items-start gap-2 text-sm bg-amber-50 border border-amber-200 rounded-lg p-3">
              <Wallet className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
              <p className="text-amber-800">
                <strong>Wallet Required:</strong> You&apos;re signed in with zkLogin. To purchase memberships, please connect a Sui wallet.
              </p>
            </div>
          )}
          <div className="flex items-start gap-2 text-sm text-muted-foreground">
            <Check className="h-4 w-4 text-green-500 mt-0.5" />
            <p>
              Cancel anytime. Your subscription will remain active until the end of your billing period.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
