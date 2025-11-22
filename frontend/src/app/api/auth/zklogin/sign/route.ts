import { NextResponse } from 'next/server';
import { EnokiClient } from '@mysten/enoki';
import { ENOKI_API_KEY } from '@/lib/constants';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * API endpoint to sign transactions with zkLogin credentials
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { transaction, address, zkProof } = body;

    if (!transaction) {
      return NextResponse.json({ error: 'Missing transaction' }, { status: 400 });
    }

    if (!address) {
      return NextResponse.json({ error: 'Missing address' }, { status: 400 });
    }

    // Get Enoki API key
    const enokiApiKey = ENOKI_API_KEY || process.env.NEXT_PUBLIC_ENOKI_API_KEY;
    if (!enokiApiKey) {
      console.error('[zklogin.sign] Missing ENOKI_API_KEY');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    console.log('[zklogin.sign] Signing transaction for address:', address.slice(0, 10));

    // Initialize Enoki client
    const enoki = new EnokiClient({ apiKey: enokiApiKey });

    // For now, return unsigned transaction with error message
    // The Enoki SDK doesn't directly support transaction signing in this way
    // We need to use the zkLogin proof to sign the transaction
    
    // This is a placeholder - in production, you would:
    // 1. Store the zkLogin ephemeral keypair securely
    // 2. Use it to sign the transaction with the zkProof
    // 3. Return the signed transaction

    return NextResponse.json(
      { 
        error: 'zkLogin transaction signing not fully implemented. Please use wallet connection for transactions.',
        details: 'Enoki zkLogin requires ephemeral keypair management which is not yet implemented in this endpoint.'
      },
      { status: 501 }
    );

  } catch (error: any) {
    console.error('[zklogin.sign] Error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to sign transaction' },
      { status: 500 }
    );
  }
}
