import { SuiClient, getFullnodeUrl } from '@mysten/sui/client';
import { SUI_NETWORK } from '@/lib/constants';

export function createSuiClient() {
  const url = SUI_NETWORK === 'mainnet' ? getFullnodeUrl('mainnet') : SUI_NETWORK === 'devnet' ? getFullnodeUrl('devnet') : getFullnodeUrl('testnet');
  return new SuiClient({ url });
}
