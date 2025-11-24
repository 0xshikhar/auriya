import { SealClient, SessionKey, type EncryptOptions, type DecryptOptions, DemType, EncryptedObject } from '@mysten/seal';
import { fromHex, toHex } from '@mysten/sui/utils';
import { createSuiClient } from './sui';
import { 
  SEAL_ACCESS_CONTROL_PACKAGE_ID, 
  SEAL_KEY_SERVERS, 
  SEAL_THRESHOLD,
  SEAL_SESSION_KEY_TTL,
  SUI_CLOCK_OBJECT_ID,
} from './constants';
import { Transaction } from '@mysten/sui/transactions';

/**
 * Initialize Seal client with verified Mysten Labs testnet key servers
 */
export function createSealClient() {
  console.log('🔐 [Seal] Initializing Seal client with verified key servers:', SEAL_KEY_SERVERS.map(ks => ks.name));
  
  const suiClient = createSuiClient();
  
  const sealClient = new SealClient({
    suiClient: suiClient as any,
    serverConfigs: SEAL_KEY_SERVERS.map(ks => ({
      objectId: ks.objectId,
      weight: ks.weight,
    })),
    verifyKeyServers: false, // Set to false for faster initialization
    timeout: 30000, // 30 seconds
  });
  
  console.log('✅ [Seal] Seal client initialized successfully');
  return sealClient;
}

// Lazy singleton to avoid SSR/sessionStorage warnings during build
let _sealClient: SealClient | null = null;
export function getSealClient(): SealClient {
  if (typeof window === 'undefined') {
    // During SSR, return a thrower proxy if accidentally used
    throw new Error('SealClient accessed on server. Call only from client-side code.');
  }
  if (!_sealClient) {
    _sealClient = createSealClient();
  }
  return _sealClient;
}

// (no-op helper removed; we use fromSerializedSignature)

export interface EncryptedContent {
  encryptedData: Uint8Array;
  encryptionMetadata: {
    id: string;
    packageId: string;
    threshold: number;
  };
}

/**
 * Encrypt content before uploading to Walrus
 * @param file - File to encrypt
 * @param requiredTier - Minimum subscription tier required (0-3)
 * @param creatorAddress - Creator's Sui address
 * @param accessPolicyId - REQUIRED: Pre-created AccessPolicy object ID
 * @returns Encrypted data and metadata
 * 
 * CRITICAL: You MUST create an AccessPolicy object BEFORE calling this function.
 * The encryption ID will be: [accessPolicyId bytes] + [5-byte nonce]
 * This is required by Seal key servers for access verification.
 */
export async function encryptContent(
  file: File,
  requiredTier: number,
  creatorAddress: string,
  accessPolicyId: string
): Promise<EncryptedContent> {
  console.log('🔐 [Seal] Starting encryption process...');
  console.log('📄 [Seal] File:', { name: file.name, size: file.size, type: file.type });
  console.log('🎯 [Seal] Required tier:', requiredTier);
  console.log('👤 [Seal] Creator Address:', creatorAddress);
  console.log('🛡️ [Seal] Access Policy ID:', accessPolicyId);
  
  try {
    // Convert file to Uint8Array
    console.log('📦 [Seal] Converting file to Uint8Array...');
    const arrayBuffer = await file.arrayBuffer();
    const data = new Uint8Array(arrayBuffer);
    console.log('✅ [Seal] File converted:', data.length, 'bytes');

    // CRITICAL: Generate encryption ID following Seal pattern
    // Pattern: [accessPolicyId bytes] + [5-byte nonce]
    // This is REQUIRED by Seal key servers - they verify the ID prefix matches the policy object
    const nonce = crypto.getRandomValues(new Uint8Array(5));
    const policyIdBytes = fromHex(accessPolicyId);
    const idBytes = new Uint8Array(policyIdBytes.length + nonce.length);
    idBytes.set(policyIdBytes, 0);
    idBytes.set(nonce, policyIdBytes.length);
    const contentId = toHex(idBytes);
    
    console.log('🆔 [Seal] Generated encryption ID (policy + nonce):', contentId);
    console.log('🔢 [Seal] Policy ID bytes:', policyIdBytes.length, 'bytes');
    console.log('🔢 [Seal] Nonce (5B):', toHex(nonce));
    console.log('🔢 [Seal] Total ID bytes:', idBytes.length, 'bytes');

    // Encrypt using Seal
    console.log('🔒 [Seal] Encrypting with Seal SDK...');
    console.log('⚙️ [Seal] Encryption options:', {
      packageId: SEAL_ACCESS_CONTROL_PACKAGE_ID,
      id: contentId,
      dataSize: data.length,
      threshold: SEAL_THRESHOLD,
      demType: 'AesGcm256'
    });
    
    const encryptOptions: EncryptOptions = {
      packageId: SEAL_ACCESS_CONTROL_PACKAGE_ID,
      id: contentId,
      data,
      threshold: SEAL_THRESHOLD,
      demType: DemType.AesGcm256,
    };

    const encrypted = await getSealClient().encrypt(encryptOptions);
    console.log('✅ [Seal] Encryption successful!');
    console.log('📊 [Seal] Encrypted data size:', encrypted.encryptedObject.length, 'bytes');

    const result = {
      encryptedData: encrypted.encryptedObject,
      encryptionMetadata: {
        id: contentId,
        packageId: SEAL_ACCESS_CONTROL_PACKAGE_ID,
        threshold: SEAL_THRESHOLD,
      },
    };
    
    console.log('✅ [Seal] Encryption complete:', result.encryptionMetadata);
    return result;
    
  } catch (error) {
    console.error('❌ [Seal] Encryption failed:', error);
    console.error('❌ [Seal] Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    throw new Error(`Failed to encrypt content: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Create a session key for decryption
 * @param address - User's Sui address
 * @param signPersonalMessage - Function to sign personal messages from wallet
 * @param packageId - Access control package ID
 * @returns Session key
 */
export async function createSealSessionKey(
  address: string,
  signPersonalMessage: (message: { message: Uint8Array }) => Promise<{ signature: string }>,
  packageId: string = SEAL_ACCESS_CONTROL_PACKAGE_ID
): Promise<SessionKey> {
  console.log('🔑 [Seal] Creating session key...');
  console.log('👤 [Seal] Address:', address);
  console.log('📦 [Seal] Package ID:', packageId);
  
  try {
    const suiClient = createSuiClient();

    // Create session key without passing a signer; we will sign the personal message ourselves
    const sessionKey = await SessionKey.create({
      address,
      packageId,
      ttlMin: SEAL_SESSION_KEY_TTL,
      suiClient: suiClient as any,
    });

    // Obtain the personal message from the session key and sign it with the wallet
    const personalMessage = sessionKey.getPersonalMessage();
    console.log('✍️ [Seal] Signing session personal message...');
    const { signature } = await signPersonalMessage({ message: personalMessage });
    await sessionKey.setPersonalMessageSignature(signature);
    console.log('✅ [Seal] Session personal message signed & attached');
    
    console.log('✅ [Seal] Session key created successfully');
    return sessionKey;
  } catch (error) {
    console.error('❌ [Seal] Failed to create session key:', error);
    throw new Error(`Failed to create session key: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Decrypt content after verifying access
 * @param encryptedData - Encrypted data from Walrus
 * @param encryptionMetadata - Metadata from encryption
 * @param subscriptionNftId - User's subscription NFT ID
 * @param sessionKey - Session key for decryption
 * @param txBytes - Transaction bytes for access verification
 * @returns Decrypted data
 */
export async function decryptContent(
  encryptedData: Uint8Array,
  encryptionMetadata: any,
  subscriptionNftId: string | undefined,
  sessionKey: SessionKey,
  txBytes?: Uint8Array
): Promise<Uint8Array> {
  console.log('🔓 [Seal] Starting decryption process...');
  console.log('📊 [Seal] Encrypted data size:', encryptedData.length, 'bytes');
  console.log('🆔 [Seal] Content ID:', encryptionMetadata.id);
  console.log('🎫 [Seal] Subscription NFT:', subscriptionNftId);
  
  try {
    // Parse encrypted object to get the full ID
    const encryptedObject = EncryptedObject.parse(encryptedData);
    const fullId = encryptedObject.id;
    console.log('🔍 [Seal] Parsed encrypted object ID:', fullId);

    // Step 1: Fetch decryption keys from key servers (if txBytes provided)
    if (txBytes && txBytes.length > 0) {
      console.log('🔑 [Seal] Fetching decryption keys from key servers...');
      console.log('🔐 [Seal] Using verification mode with txBytes:', txBytes.length, 'bytes');
      
      try {
        await getSealClient().fetchKeys({
          ids: [fullId],
          txBytes,
          sessionKey,
          threshold: SEAL_THRESHOLD,
        });
        console.log('✅ [Seal] Decryption keys fetched successfully');
      } catch (fetchError) {
        console.error('❌ [Seal] Failed to fetch keys:', fetchError);
        throw fetchError;
      }
    } else {
      console.log('🔓 [Seal] Using open mode (no access verification)');
    }

    // Step 2: Decrypt the content locally using fetched keys
    console.log('🔒 [Seal] Decrypting content...');
    const decryptOptions: DecryptOptions = {
      data: encryptedData,
      sessionKey,
      txBytes: txBytes || new Uint8Array(0),
    };

    const decrypted = await getSealClient().decrypt(decryptOptions);
    console.log('✅ [Seal] Decryption successful!');
    console.log('📊 [Seal] Decrypted data size:', decrypted.length, 'bytes');
    
    return decrypted;
  } catch (error) {
    console.error('❌ [Seal] Decryption failed:', error);
    console.error('❌ [Seal] Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    throw new Error(`Failed to decrypt content: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Create transaction for access verification
 * This transaction will be used by Seal key servers to verify subscription
 */
export type VerificationArgOrder = 'policy_first' | 'subscription_first';

export async function createAccessVerificationTx(
  contentIdHex: string,
  subscriptionNftId: string,
  accessPolicyId: string,
  pkgIdOverride?: string,
): Promise<Uint8Array> {
  console.log('📝 [Seal] Creating access verification transaction...');
  console.log('🆔 [Seal] Content ID:', contentIdHex);
  console.log('🎫 [Seal] Subscription NFT:', subscriptionNftId);
  console.log('🛡️ [Seal] Access Policy ID:', accessPolicyId);
  
  try {
    const tx = new Transaction();
    const client = createSuiClient();

    // Call seal_approve following the official example pattern
    // Signature: seal_approve(id: vector<u8>, policy: &AccessPolicy, subscription: &SubscriptionNFT, clock: &Clock, ctx: &TxContext)
    const targetFn = `${pkgIdOverride ?? SEAL_ACCESS_CONTROL_PACKAGE_ID}::content_access::seal_approve`;
    console.log('🔧 [Seal] Adding move call:', targetFn);

    // Convert content ID to vector<u8> using fromHex (matches official example)
    const idBytes = fromHex(contentIdHex);
    console.log('🧩 [Seal] ID bytes:', { length: idBytes.length, preview: Array.from(idBytes.slice(0, 8)) });

    tx.moveCall({
      target: targetFn,
      arguments: [
        tx.pure.vector('u8', Array.from(idBytes)),
        tx.object(accessPolicyId),
        tx.object(subscriptionNftId),
        tx.object(SUI_CLOCK_OBJECT_ID),
      ],
    });

    // Build transaction bytes (onlyTransactionKind for Seal verification)
    console.log('🔨 [Seal] Building transaction...');
    const txBytes = await tx.build({ client, onlyTransactionKind: true });
    console.log('✅ [Seal] Transaction created:', txBytes.length, 'bytes');
    
    return txBytes;
  } catch (error) {
    console.error('❌ [Seal] Failed to create access verification transaction:', error);
    throw new Error(`Failed to create access verification transaction: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Check if content is encrypted (has Seal metadata)
 */
export function isEncrypted(post: any): boolean {
  const enc = !!post?.fields?.encryption_metadata;
  const policyRaw = post?.fields?.access_policy_id ?? post?.fields?.seal_policy_id;
  if (!enc) return false;
  if (!policyRaw) return false;
  if (typeof policyRaw === 'string') return policyRaw.length > 0;
  const vec = policyRaw?.fields?.vec;
  const some = policyRaw?.fields?.some;
  return Array.isArray(vec) ? vec.length > 0 && !!vec[0] : some != null && String(some).length > 0;
}

/**
 * Get encryption info for display
 */
export function getEncryptionInfo(encryptionMetadata: any) {
  try {
    const metadata = typeof encryptionMetadata === 'string' 
      ? JSON.parse(encryptionMetadata) 
      : encryptionMetadata;
    
    return {
      algorithm: metadata.algorithm || 'AES-256-GCM',
      threshold: metadata.threshold || 2,
      keyCount: metadata.keyIds?.length || 0,
    };
  } catch {
    return null;
  }
}
