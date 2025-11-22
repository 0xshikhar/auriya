export const ENOKI_API_URL = process.env.ENOKI_API_URL || 'https://api.enoki.mystenlabs.com';
export const ZKLOGIN_NETWORK = process.env.ZKLOGIN_NETWORK || 'testnet';

export const ENOKI_PUBLIC_API_KEY = process.env.NEXT_PUBLIC_ENOKI_API_KEY || '';
export const ENOKI_API_KEY = process.env.ENOKI_API_KEY || (process.env.DEV_ZKLOGIN_ALLOW_PUBLIC === 'true' ? (process.env.NEXT_PUBLIC_ENOKI_API_KEY || '') : '');

export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || '';

export const ORIGIN_FALLBACK = 'http://localhost:3000';
export const ZKLOGIN_REDIRECT_URI = process.env.ZKLOGIN_REDIRECT_URI || `${ORIGIN_FALLBACK}/auth/callback`;

// ===== Auriya Onchain & Walrus Configuration =====

// Sui Clock object (global)
export const SUI_CLOCK_OBJECT_ID = '0x6';

// Network selection for RPC usage in UI
export const SUI_NETWORK: 'testnet' | 'mainnet' | 'devnet' = (process.env.SUI_NETWORK as any) || 'testnet';

// Walrus endpoints (use explicit constants; can be swapped if network changes)
export const WALRUS_PUBLISHER = 'https://publisher.walrus-testnet.walrus.space';
export const WALRUS_AGGREGATOR = 'https://aggregator.walrus-testnet.walrus.space';
export const WALRUS_DEFAULT_EPOCHS = 5; // storage duration

// Contract package & shared object IDs
// NOTE: Update these after deploying to Sui testnet. Kept here (not in .env) per project guideline.
// export const CREATOR_PROFILE_REGISTRY_ID = '0x504ec3f9e01a5296215a707d3caee0d5bfed18ef5a701f64da2170fa4fbb87bb';

export const SUBSCRIPTION_PACKAGE_ID = '0x9e0516bded6a0b380331cbfdc498503d59f23a93985782d9f493d5fdbb8c0464';
export const SUBSCRIPTION_TREASURY_ID = '0xf364c48c6b18e9a97b92e56ea94822492b4af829602f0384bb4110e58bc377c3';

// Updated with encryption_metadata field support (deployed 2025-11-24)
export const CONTENT_PACKAGE_ID = '0x35bfc5722ef228581b825a32cb4971f38b0470d3db2cd081e69ac40565975e15';
export const DEFAULT_CONTENT_REGISTRY_ID = '';

// Landing Page Registry 
export const LANDING_PAGE_REGISTRY_ID = '0x4b97d0f4aeee6c1e031394c80c07e0d91876602c8a7e03e3a5347514ffa7de11';

export const CREATOR_PROFILE_PACKAGE_ID = '0x1ba3dac9157e597bfaf27e94f6f2fa513bd3d41d0931da990eff0708e8e74315';
export const CREATOR_PROFILE_REGISTRY_ID = '0xe6b3363c91fb1883c49bace782b25dbefdb3c5158fb1dfe878507a6833cf7d5c';

// Seal Access Control Package (deploy seal_access Move package and update this)
export const SEAL_ACCESS_CONTROL_PACKAGE_ID = '0x1435b35c3d5bfb75224a5394ea47cf4054c84277e63aa7a2f1bc2188cf6b814a';

// Verified Seal Key Servers (Mysten Labs Testnet - Open Mode)
export const SEAL_KEY_SERVERS = [
  {
    objectId: '0x73d05d62c18d9374e3ea529e8e0ed6161da1a141a94d3f76ae3fe4e99356db75',
    weight: 1,
    url: 'https://seal-key-server-testnet-1.mystenlabs.com',
    name: 'mysten-testnet-1'
  },
  {
    objectId: '0xf5d14a81a982144ae441cd7d64b09027f116a468bd36e7eca494f750591623c8',
    weight: 1,
    url: 'https://seal-key-server-testnet-2.mystenlabs.com',
    name: 'mysten-testnet-2'
  },
];

// Seal configuration
export const SEAL_THRESHOLD = 2; // 2-out-of-2 threshold for decryption
export const SEAL_SESSION_KEY_TTL = 10; // 10 minutes
 
// mysten-testnet-2 (Open mode)
export const SEAL_KEY_SERVER_ID = '0xf5d14a81a982144ae441cd7d64b09027f116a468bd36e7eca494f750591623c8';
export const SEAL_KEY_SERVER_URL = 'https://seal-key-server-testnet-2.mystenlabs.com';