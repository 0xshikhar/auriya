import { useCallback } from 'react';
import { useCurrentAccount, useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';
import { useZkLogin } from './useZkLogin';

export interface ExecuteTransactionArgs { transaction: Transaction }

/**
 * Unified transaction signing hook that works with both wallet and zkLogin
 */
export function useUnifiedTransaction() {
  const wallet = useCurrentAccount();
  const { session: zkLoginSession } = useZkLogin();
  const signAndExecuteTx = useSignAndExecuteTransaction();

  const signAndExecute = useCallback(
    async ({ transaction }: ExecuteTransactionArgs) => {
      // dapp-kit supports both normal wallets and Enoki wallets via wallet-standard.
      // Ensure there is a connected account; if zkLogin session exists but no wallet
      // is connected, surface a clear error to connect via ConnectButton (Enoki).
      if (!wallet?.address) {
        if (zkLoginSession?.address) {
          throw new Error('zkLogin active. Please connect the Enoki wallet via Connect button to sign.');
        }
        throw new Error('No account connected. Connect a wallet to continue.');
      }

      return signAndExecuteTx.mutateAsync({ transaction });
    },
    [wallet?.address, zkLoginSession?.address, signAndExecuteTx]
  );

  return {
    signAndExecute,
    isPending: signAndExecuteTx.isPending,
    isConnected: !!wallet?.address,
    activeAddress: wallet?.address,
    accountType: wallet?.address ? 'wallet' : null,
  };
}

