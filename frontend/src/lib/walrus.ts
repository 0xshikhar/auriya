import { WALRUS_AGGREGATOR, WALRUS_DEFAULT_EPOCHS, WALRUS_PUBLISHER } from '@/lib/constants';

export interface WalrusUploadResult {
  blobId: string;
  url: string;
  size: number;
  mediaType: string;
}

export interface WalrusErrorResponse {
  error?: string;
  message?: string;
  [key: string]: any;
}

export function getWalrusUrl(blobId: string): string {
  return `${WALRUS_AGGREGATOR}/v1/${blobId}`;
}

export function isValidBlobId(blobId: string): boolean {
  return /^[a-zA-Z0-9_-]+$/.test(blobId) && blobId.length > 0;
}

// Upload using XHR to provide progress events reliably across browsers
export async function uploadToWalrus(
  file: File,
  onProgress?: (progress: number) => void,
): Promise<WalrusUploadResult> {
  return new Promise<WalrusUploadResult>((resolve, reject) => {
    try {
      const xhr = new XMLHttpRequest();
      const url = `${WALRUS_PUBLISHER}/v1/store?epochs=${WALRUS_DEFAULT_EPOCHS}`;
      xhr.open('PUT', url, true);

      xhr.upload.onprogress = (evt) => {
        if (!onProgress) return;
        if (evt.lengthComputable) {
          const pct = Math.min(99, Math.round((evt.loaded / evt.total) * 100));
          onProgress(pct);
        } else {
          onProgress(50);
        }
      };

      xhr.onerror = () => {
        reject(new Error('Walrus upload network error'));
      };

      xhr.onreadystatechange = async () => {
        if (xhr.readyState !== XMLHttpRequest.DONE) return;
        try {
          const text = xhr.responseText || '{}';
          const json = JSON.parse(text) as WalrusErrorResponse & { newlyCreated?: any; alreadyCertified?: any };
          if (xhr.status < 200 || xhr.status >= 300) {
            reject(new Error(`Walrus upload failed: ${json.message || json.error || xhr.statusText}`));
            return;
          }

          const blobId = json?.newlyCreated?.blobObject?.blobId || json?.alreadyCertified?.blobId;
          if (!blobId) {
            reject(new Error('No blobId returned from Walrus'));
            return;
          }

          onProgress?.(100);
          resolve({
            blobId,
            url: getWalrusUrl(blobId),
            size: file.size,
            mediaType: file.type,
          });
        } catch (e: any) {
          reject(new Error(`Walrus upload parse error: ${e?.message || String(e)}`));
        }
      };

      xhr.send(file);
    } catch (e) {
      reject(e);
    }
  });
}

export async function downloadFromWalrus(blobId: string): Promise<Blob> {
  const resp = await fetch(getWalrusUrl(blobId));
  if (!resp.ok) throw new Error(`Walrus download failed: ${resp.status} ${resp.statusText}`);
  return resp.blob();
}
