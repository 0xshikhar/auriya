"use client";

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { usePurchaseSubscription } from '@/hooks/contracts/usePurchaseSubscription';

interface Props {
  trigger?: React.ReactNode;
  defaultSubsId?: string;
}

export default function PurchaseModal({ trigger, defaultSubsId }: Props) {
  const [open, setOpen] = useState(false);
  const [subsId, setSubsId] = useState(defaultSubsId || '');
  const [tierId, setTierId] = useState<number>(1);
  const [amount, setAmount] = useState<number>(0);

  const { purchase, isPending } = usePurchaseSubscription();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await purchase({ subsId, tierId, amountSui: amount });
      setOpen(false);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || <Button variant="default">Purchase</Button>}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Purchase Subscription</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-3">
          <div className="space-y-1">
            <Label>Subscriptions Object ID</Label>
            <Input value={subsId} onChange={(e) => setSubsId(e.target.value)} placeholder="0x..." required />
          </div>
          <div className="space-y-1">
            <Label>Tier ID</Label>
            <Input type="number" value={tierId} min={1} onChange={(e) => setTierId(parseInt(e.target.value || '1', 10))} required />
          </div>
          <div className="space-y-1">
            <Label>Amount (SUI)</Label>
            <Input type="number" step="0.000001" value={amount} onChange={(e) => setAmount(parseFloat(e.target.value || '0'))} placeholder=">= price" required />
          </div>
          <div className="pt-2 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={isPending}>{isPending ? 'Processing…' : 'Confirm'}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
