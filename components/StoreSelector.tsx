import React, { useState } from 'react';
import { STORE_MAP, PLANOGRAMS } from '../constants';
import { PlanogramMetadata } from '../types';

interface Props {
  onStoreSelect: (storeNumber: string, pog: PlanogramMetadata) => void;
}

export const StoreSelector: React.FC<Props> = ({ onStoreSelect }) => {
  const [selectedStore, setSelectedStore] = useState<string>('');

  const stores = Object.keys(STORE_MAP).sort();

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedStore(e.target.value);
  };

  const handleConfirm = () => {
    if (selectedStore) {
      const pogId = STORE_MAP[selectedStore];
      onStoreSelect(selectedStore, PLANOGRAMS[pogId]);
    }
  };

  const selectedPogId = selectedStore ? STORE_MAP[selectedStore] : null;
  const previewPog = selectedPogId ? PLANOGRAMS[selectedPogId] : null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#0e1117] text-white">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-amber-500 mb-2">☀️ SUNCARE</h1>
          <h2 className="text-xl font-medium text-slate-400">POG LOOKUP</h2>
        </div>

        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl">
          <label className="block text-sm font-medium text-slate-400 mb-2">
            Select Your Store
          </label>
          <div className="relative">
            <select
              value={selectedStore}
              onChange={handleSelect}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg py-3 px-4 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
            >
              <option value="">Choose Store...</option>
              {stores.map((store) => (
                <option key={store} value={store}>
                  Store {store}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
              </svg>
            </div>
          </div>

          {previewPog && (
            <div className="mt-6 p-4 bg-slate-950 rounded-lg border border-slate-800 animate-fade-in">
              <div className="text-xs font-bold text-amber-500 uppercase tracking-wide mb-1">
                Planogram Preview
              </div>
              <h3 className="text-lg font-bold text-white">{previewPog.name}</h3>
              <p className="text-sm text-slate-400 mt-1">{previewPog.subtitle}</p>
              <div className="flex gap-4 mt-3 text-xs text-slate-500 font-mono">
                <span>{previewPog.pogNumber}</span>
                <span>•</span>
                <span>{previewPog.totalProducts} SKUs</span>
              </div>
            </div>
          )}

          <button
            onClick={handleConfirm}
            disabled={!selectedStore}
            className={`mt-6 w-full py-3.5 rounded-lg font-bold transition-all ${
              selectedStore
                ? 'bg-amber-500 hover:bg-amber-400 text-black shadow-lg shadow-amber-900/20'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            Load Planogram →
          </button>
        </div>
      </div>
    </div>
  );
};
