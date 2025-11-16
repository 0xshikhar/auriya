"use client";

import React, { useState } from 'react';
import { useCreateTiers, TierInput } from '@/hooks/contracts/useCreateTiers';
import { Plus, Trash2 } from 'lucide-react';

export default function TiersPage() {
  const { createTiers, isPending } = useCreateTiers();
  const [tiers, setTiers] = useState<TierInput[]>([
    { name: 'Bronze', priceSui: 0.1, durationDays: 30 },
  ]);
  const [resultId, setResultId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const addTier = () => setTiers((t) => [...t, { name: '', priceSui: 0, durationDays: 30 }]);
  const removeTier = (i: number) => setTiers((t) => t.filter((_, idx) => idx !== i));

  const update = (i: number, patch: Partial<TierInput>) => {
    setTiers((t) => t.map((ti, idx) => (idx === i ? { ...ti, ...patch } : ti)));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResultId(null);

    for (const t of tiers) {
      if (!t.name.trim()) { setError('Tier name cannot be empty'); return; }
      if (!(t.priceSui > 0)) { setError('Price must be greater than 0'); return; }
      if (!(t.durationDays > 0)) { setError('Duration must be greater than 0'); return; }
    }

    try {
      const res = await createTiers(tiers);
      const created = ((res as any)?.objectChanges as any[] | undefined)?.find(
        (c) => c.type === 'created' && typeof c.objectType === 'string' && c.objectType.endsWith('::subscription::CreatorSubscriptions')
      );
      setResultId(created?.objectId || null);
    } catch (e: any) {
      setError(e?.message || 'Failed to create tiers');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-black">Subscription Tiers</h1>
          <p className="text-gray-600 mt-2">Define up to 5 tiers. Fans purchase access as an NFT; revenues go directly to your wallet.</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-black mb-6">Configure your tiers</h2>
          
          <form onSubmit={onSubmit} className="space-y-6">
            {tiers.map((t, i) => (
              <div key={i} className="border border-gray-200 rounded-xl p-6 bg-gray-50">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-gray-600">Tier #{i + 1}</span>
                  <button
                    type="button"
                    onClick={() => removeTier(i)}
                    disabled={tiers.length <= 1}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-black">Name</label>
                    <input
                      type="text"
                      value={t.name}
                      onChange={(e) => update(i, { name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gumroad-pink focus:border-transparent"
                      placeholder="e.g. Bronze"
                      required
                    />
                    {t.name.trim() === '' && <p className="text-xs text-red-600">Tier name cannot be empty</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-black">Price (SUI)</label>
                    <input
                      type="number"
                      min="0"
                      step="0.000001"
                      value={Number.isFinite(t.priceSui) ? t.priceSui : 0}
                      onChange={(e) => update(i, { priceSui: parseFloat(e.target.value || '0') })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gumroad-pink focus:border-transparent"
                      placeholder="0.1"
                      required
                    />
                    {!(t.priceSui > 0) && <p className="text-xs text-red-600">Price must be greater than 0</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-black">Duration (days)</label>
                    <input
                      type="number"
                      min="1"
                      step="1"
                      value={Number.isFinite(t.durationDays) ? t.durationDays : 30}
                      onChange={(e) => update(i, { durationDays: parseInt(e.target.value || '30', 10) })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gumroad-pink focus:border-transparent"
                      placeholder="30"
                      required
                    />
                    {!(t.durationDays > 0) && <p className="text-xs text-red-600">Duration must be greater than 0</p>}
                  </div>
                </div>
              </div>
            ))}

            <div className="flex flex-col sm:flex-row justify-between gap-4 pt-4">
              <button
                type="button"
                onClick={addTier}
                disabled={tiers.length >= 5}
                className="px-6 py-3 bg-white border border-gray-300 text-black hover:bg-gray-50 rounded-lg transition font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="w-4 h-4" />
                Add Tier
              </button>

              <button
                type="submit"
                disabled={isPending}
                className="px-8 py-3 bg-black text-white hover:bg-gray-800 rounded-lg transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPending ? 'Creating…' : 'Save Tiers'}
              </button>
            </div>

            {resultId && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm font-medium text-green-800">Success!</p>
                <p className="text-xs text-green-600 mt-1 break-all">CreatorSubscriptions ID: {resultId}</p>
              </div>
            )}
            
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
