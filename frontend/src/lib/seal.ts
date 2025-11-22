import { SealClient, SessionKey, type EncryptOptions, type DecryptOptions, DemType } from '@mysten/seal';
import { fromB64 } from '@mysten/bcs';
// no signer imports needed
import { createSuiClient } from './sui';
import { 
  SEAL_ACCESS_CONTROL_PACKAGE_ID, 
  SEAL_KEY_SERVERS, 
  SEAL_THRESHOLD,
  SEAL_SESSION_KEY_TTL 
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

// Global Seal client instance
export const sealClient = createSealClient();

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
 * @returns Encrypted data and metadata
 */
export async function encryptContent(
  file: File,
  requiredTier: number,
  creatorAddress: string
): Promise<EncryptedContent> {
  console.log('🔐 [Seal] Starting encryption process...');
  console.log('📄 [Seal] File:', { name: file.name, size: file.size, type: file.type });
  console.log('🎯 [Seal] Required tier:', requiredTier);
  console.log('👤 [Seal] Creator:', creatorAddress);
  
  try {
    // Convert file to Uint8Array
    console.log('📦 [Seal] Converting file to Uint8Array...');
    const arrayBuffer = await file.arrayBuffer();
    const data = new Uint8Array(arrayBuffer);
    console.log('✅ [Seal] File converted:', data.length, 'bytes');

    // Generate unique ID for this content (must be valid hex string)
    // Combine creator address, timestamp, and tier into a hex string
    const timestamp = Date.now();
    const uniqueString = `${creatorAddress}-${timestamp}-${requiredTier}-${file.name}`;
    
    // Create a simple hash by converting to bytes and taking first 32 bytes
    const encoder = new TextEncoder();
    const bytes = encoder.encode(uniqueString);
    
    // Create a 32-byte hex ID by repeating/truncating the bytes
    const idBytes = new Uint8Array(32);
    for (let i = 0; i < 32; i++) {
      idBytes[i] = bytes[i % bytes.length];
    }
    
    // Convert to hex string
    const contentId = '0x' + Array.from(idBytes)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    
    console.log('🆔 [Seal] Generated content ID:', contentId);

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

    const encrypted = await sealClient.encrypt(encryptOptions);
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
    console.log('🔒 [Seal] Decrypting with Seal SDK...');
    console.log('⚙️ [Seal] Decryption options:', {
      dataSize: encryptedData.length,
      threshold: encryptionMetadata.threshold,
      checkShareConsistency: true
    });
    
    const decryptOptions: DecryptOptions = {
      data: encryptedData,
      sessionKey,
      checkShareConsistency: true,
      ...(txBytes && txBytes.length > 0 ? { txBytes } : {}),
    } as DecryptOptions;

    const decrypted = await sealClient.decrypt(decryptOptions);
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
export async function createAccessVerificationTx(
  subscriptionNftId: string,
  contentPostId: string
): Promise<Uint8Array> {
  console.log('📝 [Seal] Creating access verification transaction...');
  console.log('🎫 [Seal] Subscription NFT:', subscriptionNftId);
  console.log('📄 [Seal] Content Post ID:', contentPostId);
  
  try {
    const tx = new Transaction();
    
    // Call the access control function
    console.log('🔧 [Seal] Adding move call to transaction...');
    tx.moveCall({
      target: `${SEAL_ACCESS_CONTROL_PACKAGE_ID}::content_access::can_access`,
      arguments: [
        tx.object(contentPostId), // Access policy
        tx.object(subscriptionNftId), // Subscription NFT
      ],
    });

    // Build and serialize transaction to bytes
    console.log('🔨 [Seal] Building transaction...');
    const txBytes = await tx.build({ client: createSuiClient() });
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
  return !!(post.fields?.encryption_metadata && post.fields?.access_policy_id);
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
