import React from 'react';
import { Product } from '../types';
import { ProductImage } from './ProductImage';

interface Props {
  product: Product | null;
  onClose: () => void;
  redirectInfo?: { oldUpc: string; newUpc: string } | null;
}

export const ProductOverlay: React.FC<Props> = ({ product, onClose, redirectInfo }) => {
  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 animate-fade-in">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Content */}
      <div className="relative bg-[#161b22] w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl border-t sm:border border-slate-700 shadow-2xl transform transition-transform duration-300 max-h-[90vh] overflow-y-auto">
        
        {/* Redirect Banner */}
        {redirectInfo && (
          <div className="bg-yellow-500/10 border-b border-yellow-500/20 p-4">
            <div className="flex items-start gap-3">
              <span className="text-xl">⚠️</span>
              <div>
                <h3 className="font-bold text-yellow-500 text-sm uppercase">UPC Changed</h3>
                <p className="text-xs text-yellow-200 mt-1">
                  Old: <span className="font-mono">{redirectInfo.oldUpc}</span><br/>
                  New: <span className="font-mono">{redirectInfo.newUpc}</span>
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Showing replacement product location.
                </p>
              </div>
            </div>
          </div>
        )}

        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-slate-800 rounded-full text-slate-400 hover:text-white z-10 border border-slate-700"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="p-6">
          <div className="flex justify-center mb-6">
            <div className="relative w-48 h-56 bg-white rounded-lg p-2 flex items-center justify-center shadow-inner">
               <ProductImage 
                 upc={product.upc} 
                 alt={product.name} 
                 className="max-w-full max-h-full object-contain"
               />
            </div>
          </div>

          <h2 className="text-xl font-bold text-white mb-2 leading-snug">{product.name}</h2>
          <div className="font-mono text-slate-500 text-sm mb-6 flex items-center gap-2">
            <span>UPC:</span>
            <span className="bg-slate-800 px-2 py-0.5 rounded text-slate-300">{product.upc}</span>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {product.isNew && (
              <span className="px-2 py-1 rounded bg-green-500/20 text-green-400 text-xs font-bold border border-green-500/30">NEW ITEM</span>
            )}
            {product.srp && (
              <span className="px-2 py-1 rounded bg-purple-500/20 text-purple-400 text-xs font-bold border border-purple-500/30">SRP PACKAGING</span>
            )}
            {product.isChange && (
              <span className="px-2 py-1 rounded bg-amber-500/20 text-amber-400 text-xs font-bold border border-amber-500/30">CHANGE</span>
            )}
            {product.isMove && (
              <span className="px-2 py-1 rounded bg-blue-500/20 text-blue-400 text-xs font-bold border border-blue-500/30">MOVE</span>
            )}
          </div>

          <div className="grid grid-cols-4 gap-3">
            <div className="bg-slate-800 p-3 rounded-lg text-center border border-slate-700">
              <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">Side</div>
              <div className="text-xl font-bold text-white">{product.segment}</div>
            </div>
            <div className="bg-slate-800 p-3 rounded-lg text-center border border-slate-700">
              <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">Shelf</div>
              <div className="text-xl font-bold text-white">{product.shelf}</div>
            </div>
            <div className="bg-slate-800 p-3 rounded-lg text-center border border-slate-700">
              <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">Position</div>
              <div className="text-xl font-bold text-white">{product.position}</div>
            </div>
            <div className="bg-slate-800 p-3 rounded-lg text-center border border-slate-700">
              <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">Facings</div>
              <div className="text-xl font-bold text-white">{product.facings}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
