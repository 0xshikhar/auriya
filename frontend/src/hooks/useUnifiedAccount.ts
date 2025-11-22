import { useEffect, useMemo, useState } from 'react';
import { useCurrentAccount, useWallets } from '@mysten/dapp-kit';
import { isEnokiWallet } from '@mysten/enoki';
import { useZkLogin } from '@/hooks/useZkLogin';


export type AccountSource = 'wallet' | 'zklogin';

export interface UnifiedAccountItem {
  type: AccountSource;
  address: string;
  label: string;
}

const SELECTED_KEY = 'unified_account_selected';

export function useUnifiedAccount() {
  const wallet = useCurrentAccount();
  const wallets = useWallets();
  const { session, logout: logoutZk } = useZkLogin();
  const [selected, setSelected] = useState<AccountSource | null>(null);

  const accounts = useMemo<UnifiedAccountItem[]>(() => {
    const list: UnifiedAccountItem[] = [];
    if (wallet?.address) {
      // If the connected account belongs to an Enoki wallet, label it as zkLogin
      const isZkLoginWallet = wallets.filter(isEnokiWallet).some((w) =>
        w.accounts?.some((a) => a.address === wallet.address)
      );
      list.push({ type: 'wallet', address: wallet.address, label: isZkLoginWallet ? 'zkLogin' : 'Wallet' });
    }
    if (session?.address) list.push({ type: 'zklogin', address: session.address, label: 'zkLogin' });
    return list;
  }, [wallet?.address, session?.address, wallets]);

  // Initialize selection
  useEffect(() => {
    const stored = localStorage.getItem(SELECTED_KEY) as AccountSource | null;
    if (stored) {
      setSelected(stored);
      return;
    }
    if (accounts.length) {
      // Prefer wallet if present, else zklogin
      const pref: AccountSource = accounts.find(a => a.type === 'wallet') ? 'wallet' : 'zklogin';
      setSelected(pref);
      localStorage.setItem(SELECTED_KEY, pref);
    } else {
      setSelected(null);
    }
  }, [accounts]);

  const selectedAccount = useMemo(() => {
    if (!selected) return null;
    return accounts.find(a => a.type === selected) || null;
  }, [accounts, selected]);

  const choose = (next: AccountSource) => {
    setSelected(next);
    localStorage.setItem(SELECTED_KEY, next);
    // Broadcast change
    window.dispatchEvent(new StorageEvent('storage', { key: SELECTED_KEY, newValue: next, storageArea: localStorage }));
  };

  const disconnectZkLogin = () => {
    logoutZk();
    if (selected === 'zklogin') {
      choose('wallet');
    }
  };

  return {
    accounts,
    selected: selectedAccount,
    selectedType: selected as AccountSource | null,
    choose,
    disconnectZkLogin,
  };
}
