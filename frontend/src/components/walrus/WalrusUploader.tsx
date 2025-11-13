"use client";

import React, { useRef, useState } from 'react';
import { uploadToWalrus, WalrusUploadResult, getWalrusUrl } from '@/lib/walrus';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';

interface Props {
  label?: string;
  accept?: string;
  maxSizeMB?: number;
  className?: string;
  onUploaded: (result: WalrusUploadResult) => void;
  defaultBlobId?: string;
}

export default function WalrusUploader({
  label = 'Upload media',
  accept = 'image/*,video/*',
  maxSizeMB = 100,
  className,
  onUploaded,
  defaultBlobId,
}: Props) {
  const [progress, setProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [blobId, setBlobId] = useState<string | null>(defaultBlobId || null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`File too large. Max ${maxSizeMB}MB`);
      return;
    }

    setUploading(true);
    setProgress(0);
    try {
      const result = await uploadToWalrus(file, (p) => setProgress(p));
      setBlobId(result.blobId);
      onUploaded(result);
    } catch (err: any) {
      setError(err?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={cn('w-full space-y-2', className)}>
      {label && <div className="text-sm font-medium text-white/90">{label}</div>}
      <div className={cn('flex items-center gap-3')}> 
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={onFileChange}
        />
        <Button
          type="button"
          variant="default"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
        >
          {uploading ? 'Uploading…' : 'Choose file'}
        </Button>
        {blobId && (
          <a href={getWalrusUrl(blobId)} target="_blank" rel="noreferrer" className="text-xs text-blue-400 underline break-all">
            {blobId}
          </a>
        )}
      </div>
      {uploading && (
        <div className="space-y-2">
          <Progress value={progress} />
          <div className="text-xs text-white/60">{progress}%</div>
        </div>
      )}
      {error && <div className="text-xs text-red-400">{error}</div>}
    </div>
  );
}
