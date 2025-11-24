"use client";

import { useCallback } from 'react';
import { Transaction } from '@mysten/sui/transactions';
import { useUnifiedTransaction } from '@/hooks/useUnifiedTransaction';

export type DonationInput = {
  recipientAddress: string;
  amountSui: number;
};

export function useDonation() {
  const { signAndExecute, isPending } = useUnifiedTransaction();

  const donate = useCallback(async (input: DonationInput) => {
    if (!input.recipientAddress) {
      throw new Error('Recipient address is required');
    }
    if (!input.amountSui || input.amountSui <= 0) {
      throw new Error('Amount must be greater than 0');
    }

    // Convert SUI to MIST (1 SUI = 1,000,000,000 MIST)
    const amountMist = BigInt(Math.ceil(input.amountSui * 1_000_000_000));

    const tx = new Transaction();

    // Split coins from gas to create payment
    const [payment] = tx.splitCoins(tx.gas, [tx.pure.u64(amountMist)]);

    // Transfer payment to recipient
    tx.transferObjects([payment], tx.pure.address(input.recipientAddress));

    tx.setGasBudget(10_000_000);

    const res = await signAndExecute({ transaction: tx });

    return res;
  }, [signAndExecute]);

  return { donate, isPending } as const;
}
