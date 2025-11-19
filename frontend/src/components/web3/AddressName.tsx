"use client";

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { SuiClient } from '@mysten/sui/client';
import { createSuiClient } from '@/lib/sui';

function truncate(address: string, size = 4) {
  if (!address?.startsWith('0x')) return address;
  return `${address.slice(0, 2 + size)}…${address.slice(-size)}`;
}

async function resolvePrimaryName(client: SuiClient, address: string): Promise<string | null> {
  try {
    const res = await client.resolveNameServiceNames({ address, limit: 1 });
    return res?.data?.[0] || null;
  } catch {
    return null;
  }
}

export default function AddressName({ address, withYou = false }: { address?: string; withYou?: boolean }) {
  const account = useCurrentAccount();
  const addr = address || account?.address || '';
  const client = React.useMemo(() => createSuiClient(), []);

  const { data: name } = useQuery({
    queryKey: ['suins', addr],
    queryFn: () => resolvePrimaryName(client, addr),
    enabled: !!addr,
    staleTime: 60_000,
  });

  if (!addr) return null;
  const label = name || truncate(addr);
  return <span title={addr}>{withYou && account?.address === addr ? 'you' : label}</span>;
}
