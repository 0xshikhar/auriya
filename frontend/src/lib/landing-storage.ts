/**
 * Landing Page Storage using Walrus
 * 
 * Architecture Decision:
 * - Store landing page JSON data on Walrus (decentralized, permanent storage)
 * - Store reference to Walrus blob ID on-chain (lightweight, verifiable)
 * - Images already stored on Walrus via WalrusUploader
 * 
 * Benefits:
 * - Fully decentralized (Walrus + Sui)
 * - Permanent storage
 * - No centralized database needed
 * - Aligns with hackathon requirements
 */

import { uploadToWalrus, getWalrusUrl, downloadFromWalrus } from './walrus';
import { CreatorLandingPage } from '@/types/creator-landing';

export interface LandingPageStorageResult {
  blobId: string;
  url: string;
  landingPage: CreatorLandingPage;
}

/**
 * Save landing page data to Walrus
 * Converts JSON to blob and uploads to Walrus
 */
export async function saveLandingPageToWalrus(
  landingPage: CreatorLandingPage,
  onProgress?: (progress: number) => void
): Promise<LandingPageStorageResult> {
  try {
    // Convert landing page to JSON
    const jsonString = JSON.stringify(landingPage, null, 2);
    
    // Create a blob from JSON
    const blob = new Blob([jsonString], { type: 'application/json' });
    const file = new File([blob], 'landing-page.json', { type: 'application/json' });
    
    // Upload to Walrus
    const result = await uploadToWalrus(file, onProgress);
    
    return {
      blobId: result.blobId,
      url: result.url,
      landingPage,
    };
  } catch (error) {
    console.error('Failed to save landing page to Walrus:', error);
    throw new Error('Failed to save landing page to Walrus');
  }
}

/**
 * Load landing page data from Walrus
 * Downloads blob and parses JSON
 */
export async function loadLandingPageFromWalrus(
  blobId: string
): Promise<CreatorLandingPage> {
  try {
    // Download from Walrus
    const blob = await downloadFromWalrus(blobId);
    
    // Parse JSON
    const text = await blob.text();
    const landingPage = JSON.parse(text) as CreatorLandingPage;
    
    return landingPage;
  } catch (error) {
    console.error('Failed to load landing page from Walrus:', error);
    throw new Error('Failed to load landing page from Walrus');
  }
}

/**
 * Get landing page URL for sharing
 */
export function getLandingPageUrl(creatorAddress: string): string {
  return `/c/${creatorAddress}`;
}

/**
 * Cache landing page data in localStorage for quick access
 * This is a client-side optimization
 */
export function cacheLandingPage(creatorAddress: string, landingPage: CreatorLandingPage): void {
  try {
    const key = `landing-page-cache-${creatorAddress}`;
    localStorage.setItem(key, JSON.stringify(landingPage));
  } catch (error) {
    console.warn('Failed to cache landing page:', error);
  }
}

/**
 * Get cached landing page from localStorage
 */
export function getCachedLandingPage(creatorAddress: string): CreatorLandingPage | null {
  try {
    const key = `landing-page-cache-${creatorAddress}`;
    const cached = localStorage.getItem(key);
    if (!cached) return null;
    return JSON.parse(cached) as CreatorLandingPage;
  } catch (error) {
    console.warn('Failed to get cached landing page:', error);
    return null;
  }
}

/**
 * Clear cached landing page
 */
export function clearCachedLandingPage(creatorAddress: string): void {
  try {
    const key = `landing-page-cache-${creatorAddress}`;
    localStorage.removeItem(key);
  } catch (error) {
    console.warn('Failed to clear cached landing page:', error);
  }
}
