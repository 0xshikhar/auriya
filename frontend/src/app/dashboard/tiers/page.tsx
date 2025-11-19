"use client";

import React, { useState } from 'react';
import { useCreateTiers, TierInput } from '@/hooks/contracts/useCreateTiers';
import { Plus, Trash2, DollarSign, Calendar, Tag, CheckCircle2, AlertCircle } from 'lucide-react';

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

  const tierColors = ['bg-amber-100 border-amber-300', 'bg-gray-100 border-gray-300', 'bg-yellow-100 border-yellow-300'];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="mb-12">
          <h1 className="text-5xl font-bold text-black mb-4">NFT Subscription Tiers</h1>
          <p className="text-xl text-gray-600">Configure up to 5 membership tiers. Fans mint NFTs to subscribe, revenue flows directly to your wallet.</p>
        </div>

        <div className="bg-white border-2 border-gray-200 rounded-2xl p-10 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-black">Your Tiers</h2>
            <span className="text-sm text-gray-500">{tiers.length} / 5 tiers</span>
          </div>
          
          <form onSubmit={onSubmit} className="space-y-6">
            {tiers.map((t, i) => (
              <div key={i} className={`border-2 rounded-2xl p-8 ${tierColors[i % tierColors.length]} hover:shadow-lg transition`}>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-white border-2 border-black flex items-center justify-center font-bold text-xl">
                      {i + 1}
                    </div>
                    <span className="text-2xl font-bold">Tier {i + 1}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeTier(i)}
                    disabled={tiers.length <= 1}
                    className="p-3 text-gray-600 hover:text-red-600 hover:bg-white rounded-full transition disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Tag className="w-5 h-5 text-gumroad-pink" />
                      <label className="text-sm font-semibold text-black">Tier Name</label>
                    </div>
                    <input
                      type="text"
                      value={t.name}
                      onChange={(e) => update(i, { name: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gumroad-pink focus:border-gumroad-pink bg-white font-medium"
                      placeholder="e.g. Bronze"
                      required
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-gumroad-pink" />
                      <label className="text-sm font-semibold text-black">Price (SUI)</label>
                    </div>
                    <input
                      type="number"
                      min="0"
                      step="0.000001"
                      value={Number.isFinite(t.priceSui) ? t.priceSui : 0}
                      onChange={(e) => update(i, { priceSui: parseFloat(e.target.value || '0') })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gumroad-pink focus:border-gumroad-pink bg-white font-medium"
                      placeholder="0.1"
                      required
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-gumroad-pink" />
                      <label className="text-sm font-semibold text-black">Duration (days)</label>
                    </div>
                    <input
                      type="number"
                      min="1"
                      step="1"
                      value={Number.isFinite(t.durationDays) ? t.durationDays : 30}
                      onChange={(e) => update(i, { durationDays: parseInt(e.target.value || '30', 10) })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gumroad-pink focus:border-gumroad-pink bg-white font-medium"
                      placeholder="30"
                      required
                    />
                  </div>
                </div>
              </div>
            ))}

            <div className="flex flex-col sm:flex-row justify-between gap-4 pt-8 border-t-2 border-gray-200">
              <button
                type="button"
                onClick={addTier}
                disabled={tiers.length >= 5}
                className="px-8 py-4 bg-white border-2 border-gray-300 text-black hover:bg-gray-50 hover:border-gumroad-pink rounded-full transition font-semibold flex items-center justify-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed text-lg"
              >
                <Plus className="w-5 h-5" />
                Add Another Tier
              </button>

              <button
                type="submit"
                disabled={isPending}
                className="px-10 py-4 bg-black text-white hover:bg-gray-800 rounded-full transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed text-lg"
              >
                {isPending ? 'Creating Tiers...' : 'Save All Tiers'}
              </button>
            </div>

            {resultId && (
              <div className="p-6 bg-gumroad-pink/10 border-2 border-gumroad-pink rounded-xl flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-gumroad-pink flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-lg font-semibold text-black mb-1">Tiers Created Successfully!</p>
                  <p className="text-sm text-gray-600 break-all">Subscription Contract ID: {resultId}</p>
                </div>
              </div>
            )}
            
            {error && (
              <div className="p-6 bg-red-50 border-2 border-red-200 rounded-xl flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-lg font-semibold text-red-800 mb-1">Error</p>
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
