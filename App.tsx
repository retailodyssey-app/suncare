import React, { useState, useMemo } from 'react';
import { StoreSelector } from './components/StoreSelector';
import { ProductOverlay } from './components/ProductOverlay';
import { Scanner } from './components/Scanner';
import { PdfViewer } from './components/PdfViewer';
import { ProductImage } from './components/ProductImage';
import { PlanogramMetadata, Product, ViewMode } from './types';

// Simple Icons
const IconBrowse = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
);
const IconScan = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" /></svg>
);
const IconEdit = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
);
const IconPdf = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
);

const App: React.FC = () => {
  const [storeNumber, setStoreNumber] = useState<string | null>(null);
  const [activePog, setActivePog] = useState<PlanogramMetadata | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.BROWSE);
  const [activeSide, setActiveSide] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [redirectInfo, setRedirectInfo] = useState<{oldUpc: string, newUpc: string} | null>(null);
  const [manualUpc, setManualUpc] = useState('');
  const [filterMode, setFilterMode] = useState<'all'|'new'|'srp'>('all');
  const [showPdf, setShowPdf] = useState(false);

  const handleStoreSelect = (store: string, pog: PlanogramMetadata) => {
    setStoreNumber(store);
    setActivePog(pog);
    setViewMode(ViewMode.BROWSE);
    setActiveSide(1);
  };

  const handleProductLookup = (inputUpc: string) => {
    if (!activePog) return;

    // Normalization: Remove non-numeric
    let cleanUpc = inputUpc.replace(/\D/g, '');
    
    // Check redirect
    let targetUpc = cleanUpc;
    let redirectData = null;

    // Check if redirect exists for this UPC
    if (activePog.upcRedirects[cleanUpc]) {
      const newUpc = activePog.upcRedirects[cleanUpc];
      redirectData = { oldUpc: cleanUpc, newUpc };
      targetUpc = newUpc;
    }

    // Find product
    const product = activePog.products.find(p => p.upc === targetUpc || p.upc.endsWith(targetUpc) || targetUpc.endsWith(p.upc));

    if (product) {
      setRedirectInfo(redirectData);
      setSelectedProduct(product);
    } else {
      alert(`Product not found: ${cleanUpc}`);
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleProductLookup(manualUpc);
  };

  // Group products by shelf for the active side
  const shelfData = useMemo(() => {
    if (!activePog) return [];
    
    // 1. Get products for this side
    const sideProducts = activePog.products.filter(p => p.segment === activeSide);
    
    // 2. Group by shelf
    const shelves: Product[][] = Array.from({ length: activePog.shelves }, () => []);
    sideProducts.forEach(p => {
        if (shelves[p.shelf - 1]) {
            shelves[p.shelf - 1].push(p);
        }
    });

    // 3. Sort each shelf by position
    shelves.forEach(shelf => shelf.sort((a, b) => a.position - b.position));

    // 4. Return reversed so Shelf N (Top) is first in the list
    return shelves.map((products, index) => ({ shelfNum: index + 1, products })).reverse();
  }, [activePog, activeSide]);

  if (!storeNumber || !activePog) {
    return <StoreSelector onStoreSelect={handleStoreSelect} />;
  }

  // Determine side border color
  const getSideColor = (s: number) => {
    switch(s) {
        case 1: return 'border-red-400 text-red-400';
        case 2: return 'border-teal-400 text-teal-400';
        case 3: return 'border-blue-400 text-blue-400';
        case 4: return 'border-yellow-400 text-yellow-400';
        default: return 'border-slate-600 text-slate-400';
    }
  };

  const isProductDimmed = (product: Product) => {
    if (filterMode === 'all') return false;
    if (filterMode === 'new' && product.isNew) return false;
    if (filterMode === 'srp' && product.srp) return false;
    return true;
  };

  return (
    <div className="min-h-screen bg-[#0e1117] text-[#e6edf3] pb-20">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-[#161b22]/95 backdrop-blur border-b border-slate-800 px-4 py-3 shadow-sm">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-amber-500 font-bold text-lg leading-none">SUNCARE POG</h1>
            <p className="text-xs text-slate-400 mt-1">Store {storeNumber} • {activePog.name}</p>
          </div>
          <div className="flex gap-2">
            <button 
                onClick={() => setShowPdf(true)}
                className="flex items-center gap-1 text-xs bg-slate-800 px-3 py-1.5 rounded text-white border border-slate-600 hover:bg-slate-700 active:scale-95 transition-all"
            >
                <IconPdf /> POG PDF
            </button>
            <button 
                onClick={() => setStoreNumber(null)}
                className="text-xs bg-slate-800 px-3 py-1.5 rounded text-slate-400 border border-slate-700 hover:text-white active:scale-95 transition-all"
            >
                Change
            </button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="sticky top-[60px] z-20 bg-[#0e1117] border-b border-slate-800 flex justify-around p-2">
        <button 
          onClick={() => setViewMode(ViewMode.BROWSE)}
          className={`flex-1 flex justify-center items-center gap-2 py-2 rounded-lg transition-colors ${viewMode === ViewMode.BROWSE ? 'bg-slate-800 text-amber-500' : 'text-slate-500'}`}
        >
          <IconBrowse /> <span className="text-sm font-medium">Browse</span>
        </button>
        <button 
          onClick={() => setViewMode(ViewMode.SCAN)}
          className={`flex-1 flex justify-center items-center gap-2 py-2 rounded-lg transition-colors ${viewMode === ViewMode.SCAN ? 'bg-slate-800 text-amber-500' : 'text-slate-500'}`}
        >
          <IconScan /> <span className="text-sm font-medium">Scan</span>
        </button>
        <button 
          onClick={() => setViewMode(ViewMode.MANUAL)}
          className={`flex-1 flex justify-center items-center gap-2 py-2 rounded-lg transition-colors ${viewMode === ViewMode.MANUAL ? 'bg-slate-800 text-amber-500' : 'text-slate-500'}`}
        >
          <IconEdit /> <span className="text-sm font-medium">UPC</span>
        </button>
      </div>

      {/* Main Content */}
      <main className={viewMode === ViewMode.BROWSE ? "p-0" : "p-4"}>
        {viewMode === ViewMode.BROWSE && (
          <div className="animate-fade-in">
            {/* Filter Bar */}
            <div className="flex gap-2 p-3 bg-[#0e1117] border-b border-slate-800 overflow-x-auto no-scrollbar">
               <span className="text-xs font-bold text-slate-500 self-center mr-2">HIGHLIGHT:</span>
               <button 
                 onClick={() => setFilterMode('all')}
                 className={`px-3 py-1 rounded-full text-xs font-bold border transition-colors whitespace-nowrap ${filterMode === 'all' ? 'bg-slate-700 border-slate-500 text-white' : 'border-slate-800 text-slate-500'}`}
               >
                 None
               </button>
               <button 
                 onClick={() => setFilterMode('new')}
                 className={`px-3 py-1 rounded-full text-xs font-bold border transition-colors whitespace-nowrap ${filterMode === 'new' ? 'bg-green-900/30 border-green-500/50 text-green-400' : 'border-slate-800 text-slate-500'}`}
               >
                 🟢 New Items
               </button>
               <button 
                 onClick={() => setFilterMode('srp')}
                 className={`px-3 py-1 rounded-full text-xs font-bold border transition-colors whitespace-nowrap ${filterMode === 'srp' ? 'bg-purple-900/30 border-purple-500/50 text-purple-400' : 'border-slate-800 text-slate-500'}`}
               >
                 🟣 SRP
               </button>
            </div>

            {/* Shelves Layout */}
            <div className="flex flex-col border-b border-slate-800">
              {shelfData.map(({ shelfNum, products }) => (
                <div key={shelfNum} className="flex h-36 w-full bg-[#161b22] border-t border-slate-800 relative">
                  {/* Left Label */}
                  <div className="w-8 flex-none flex items-center justify-center bg-[#0d1117] border-r border-slate-800 z-10">
                     <div className="-rotate-90 whitespace-nowrap text-[10px] font-bold text-slate-500 tracking-widest uppercase">
                       Shelf {shelfNum}
                     </div>
                  </div>

                  {/* Shelf Products Strip */}
                  <div className="flex-1 flex px-1 pt-2 pb-1 relative items-end">
                     {/* Shelf Surface (visual line at bottom) */}
                     <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-b from-[#252b36] to-[#161b22] z-0" />

                     {products.map((product) => {
                        const dimmed = isProductDimmed(product);
                        return (
                         <div
                             key={product.upc}
                             // Proportional width based on facings
                             style={{ flex: `${product.facings} 1 0px` }}
                             onClick={() => {
                                setRedirectInfo(null);
                                setSelectedProduct(product);
                             }}
                             className={`
                                relative group cursor-pointer
                                h-full flex flex-col justify-end
                                mx-[1px] mb-1.5
                                transition-all duration-200
                                ${dimmed ? 'opacity-30 grayscale' : 'opacity-100'}
                             `}
                         >
                             {/* Product Body */}
                             <div className="w-full h-full bg-slate-800/50 rounded-sm overflow-hidden relative border border-white/5 hover:border-white/30 hover:z-20 hover:scale-105 hover:shadow-xl transition-transform">
                                {/* Smart Image Component */}
                                 <ProductImage 
                                     upc={product.upc} 
                                     alt={product.name}
                                     className="w-full h-full object-cover opacity-90"
                                 />
                                 
                                 {/* New Item Badge */}
                                 {product.isNew && !dimmed && (
                                     <div className="absolute top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_4px_rgba(34,197,94,1)] z-10" />
                                 )}
                                 
                                 {/* SRP Badge */}
                                 {product.srp && !dimmed && (
                                     <div className="absolute top-1 right-0.5 w-1.5 h-1.5 rounded-sm bg-purple-500 z-10" />
                                 )}
                             </div>

                             {/* Position Label */}
                             <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-[8px] text-white text-center font-mono leading-none py-0.5 z-10 truncate">
                                {product.position}
                             </div>
                         </div>
                     )})}
                     
                     {products.length === 0 && (
                        <div className="flex-1 flex items-center justify-center text-xs text-slate-700 italic">
                            Empty Shelf
                        </div>
                     )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {viewMode === ViewMode.SCAN && (
          <div className="animate-fade-in pt-4">
            <Scanner onScan={handleProductLookup} />
            <div className="mt-8 text-center text-sm text-slate-500 px-8">
              Point your camera at a product UPC barcode.
            </div>
          </div>
        )}

        {viewMode === ViewMode.MANUAL && (
          <div className="animate-fade-in pt-8 px-4">
            <form onSubmit={handleManualSubmit} className="max-w-sm mx-auto">
              <label className="block text-sm font-bold text-slate-400 mb-2">Enter UPC</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={manualUpc}
                  onChange={(e) => setManualUpc(e.target.value)}
                  placeholder="000..."
                  className="flex-1 bg-[#161b22] border border-slate-700 rounded-lg px-4 py-3 text-white font-mono focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  inputMode="numeric"
                />
                <button 
                  type="submit"
                  className="bg-amber-500 text-black font-bold px-6 py-3 rounded-lg hover:bg-amber-400 transition-colors"
                >
                  GO
                </button>
              </div>
              <p className="mt-4 text-xs text-slate-600 text-center">
                Supports 12 or 13 digit UPCs. Leading zeros are optional.
              </p>
            </form>
          </div>
        )}
      </main>

      {/* Side Navigation (Pallet Only) */}
      {activePog.sides > 1 && viewMode === ViewMode.BROWSE && (
        <div className="fixed bottom-0 left-0 right-0 bg-[#161b22] border-t border-slate-800 p-2 flex justify-center gap-2 pb-safe">
          {[1, 2, 3, 4].map((side) => (
            <button
              key={side}
              onClick={() => {
                  setActiveSide(side);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`flex-1 py-3 rounded-lg font-bold text-sm transition-all border-b-2 ${
                activeSide === side 
                  ? `bg-slate-800 text-white ${getSideColor(side)}` 
                  : 'text-slate-500 border-transparent hover:bg-slate-800/50'
              }`}
            >
              Side {side}
            </button>
          ))}
        </div>
      )}

      {/* Overlays */}
      <ProductOverlay 
        product={selectedProduct} 
        onClose={() => setSelectedProduct(null)} 
        redirectInfo={redirectInfo}
      />
      
      {showPdf && (
        <PdfViewer 
            defaultPdfUrl={activePog.pdfUrl} 
            onClose={() => setShowPdf(false)} 
        />
      )}
    </div>
  );
};

export default App;
