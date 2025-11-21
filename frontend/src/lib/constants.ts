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
export const CREATOR_PROFILE_PACKAGE_ID = '0x8deb03080bc12cb541f87a1f03586678420cf823230490d60a39472e0fda3a1d';
export const CREATOR_PROFILE_REGISTRY_ID = '0x504ec3f9e01a5296215a707d3caee0d5bfed18ef5a701f64da2170fa4fbb87bb';

export const SUBSCRIPTION_PACKAGE_ID = '0x9e0516bded6a0b380331cbfdc498503d59f23a93985782d9f493d5fdbb8c0464';
export const SUBSCRIPTION_TREASURY_ID = '0xf364c48c6b18e9a97b92e56ea94822492b4af829602f0384bb4110e58bc377c3';

export const CONTENT_PACKAGE_ID = '0xc5827f364c2c70096921cd7513abe7303d21c0afbea00fdf15fa5ccc42167403';
// Optional: if you pre-created a registry for development, put its ID here, else pass at call-site
export const DEFAULT_CONTENT_REGISTRY_ID = '';

// Landing Page Registry 
export const LANDING_PAGE_REGISTRY_ID = '0x969895fbb879c153a48fafd248c81b47137c972f58b1f252ca4ce79df8bd09b7';

// export const CREATOR_PROFILE_PACKAGE_ID = '0xcf6951be2aeafa1cfd6f176519f15ed4e1b806bf026a904cccfc3085d5270a5c';
// export const CREATOR_PROFILE_REGISTRY_ID = '0x5837f654433430864318e0f8ca82fabcdc772a35331cf8a74f80685003df049f';
