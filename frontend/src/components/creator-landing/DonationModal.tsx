"use client";

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useDonation } from '@/hooks/contracts/useDonation';
import { CheckCircle2, AlertCircle, Loader2, Heart } from 'lucide-react';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { useZkLogin } from '@/hooks/useZkLogin';

interface DonationModalProps {
  open: boolean;
  onClose: () => void;
  creatorAddress: string;
  creatorName: string;
}

export default function DonationModal({
  open,
  onClose,
  creatorAddress,
  creatorName,
}: DonationModalProps) {
  const [amount, setAmount] = useState<string>('');
  const [txDigest, setTxDigest] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const { donate, isPending } = useDonation();
  const currentAccount = useCurrentAccount();
  const { session: zkLoginSession } = useZkLogin();

  const hasWallet = !!currentAccount;
  const hasOnlyZkLogin = !hasWallet && !!zkLoginSession;

  const quickAmounts = [1, 5, 10, 25, 50, 100];

  const handleDonate = async () => {
    setError(null);
    setTxDigest(null);

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    try {
      const res = await donate({
        recipientAddress: creatorAddress,
        amountSui: amountNum,
      });
      // @ts-ignore
      setTxDigest(res?.digest || null);
      setAmount('');
    } catch (err: any) {
      setError(err?.message || 'Failed to process donation');
    }
  };

  const handleQuickAmount = (value: number) => {
    setAmount(value.toString());
  };

  const handleClose = () => {
    setTxDigest(null);
    setError(null);
    setAmount('');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-pink-500" />
            Support {creatorName}
          </DialogTitle>
          <DialogDescription>
            Send a direct donation in SUI to support this creator
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Wallet connection warning */}
          {hasOnlyZkLogin && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-amber-900">Wallet Required</p>
                <p className="text-xs text-amber-700 mt-1">
                  Please connect your Sui wallet to make a donation.
                </p>
              </div>
            </div>
          )}

          {!hasWallet && !zkLoginSession && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-red-800">No Wallet Connected</p>
                <p className="text-xs text-red-600 mt-1">
                  Please connect your Sui wallet to make a donation.
                </p>
              </div>
            </div>
          )}

          {/* Success message */}
          {txDigest && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-green-900">Donation Successful!</p>
                <p className="text-xs text-green-700 mt-1 break-all">
                  Transaction: {txDigest}
                </p>
                <p className="text-xs text-green-700 mt-2">
                  Thank you for supporting {creatorName}! 💚
                </p>
              </div>
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-red-800">Error</p>
                <p className="text-xs text-red-600 mt-1">{error}</p>
              </div>
            </div>
          )}

          {/* Donation form */}
          {!txDigest && (
            <>
              <div className="space-y-2">
                <Label htmlFor="amount">Amount (SUI)</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  disabled={isPending || !hasWallet}
                />
              </div>

              {/* Quick amount buttons */}
              <div className="space-y-2">
                <Label>Quick amounts</Label>
                <div className="grid grid-cols-3 gap-2">
                  {quickAmounts.map((value) => (
                    <Button
                      key={value}
                      type="button"
                      variant="outline"
                      onClick={() => handleQuickAmount(value)}
                      disabled={isPending || !hasWallet}
                      className="font-semibold"
                    >
                      {value} SUI
                    </Button>
                  ))}
                </div>
              </div>

              {/* Creator address */}
              <div className="space-y-1">
                <Label className="text-xs text-gray-500">Creator Address</Label>
                <p className="text-xs text-gray-600 break-all font-mono bg-gray-50 p-2 rounded">
                  {creatorAddress}
                </p>
              </div>

              {/* Donate button */}
              <Button
                onClick={handleDonate}
                disabled={isPending || !amount || !hasWallet}
                className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Heart className="w-4 h-4 mr-2" />
                    Donate {amount ? `${amount} SUI` : ''}
                  </>
                )}
              </Button>
            </>
          )}

          {/* Close button after success */}
          {txDigest && (
            <Button
              onClick={handleClose}
              className="w-full"
              variant="outline"
            >
              Close
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
