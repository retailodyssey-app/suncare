import React, { useState } from 'react';

interface Props {
  defaultPdfUrl: string;
  onClose: () => void;
}

export const PdfViewer: React.FC<Props> = ({ defaultPdfUrl, onClose }) => {
  const [activePdf, setActivePdf] = useState(defaultPdfUrl);

  return (
    <div className="fixed inset-0 z-50 bg-[#0e1117] flex flex-col h-full w-full animate-fade-in">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between p-3 bg-[#161b22] border-b border-slate-700 shadow-md z-10 gap-3 sm:gap-0">
        <div className="flex items-center gap-3">
            <button 
                onClick={onClose}
                className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <h2 className="text-white font-bold text-lg hidden sm:block">Planogram Viewer</h2>
        </div>

        {/* View Switcher */}
        <div className="flex bg-slate-900 rounded-lg p-1 border border-slate-700">
            <button 
                onClick={() => setActivePdf('endcap.pdf')}
                className={`px-4 py-1.5 rounded-md text-sm font-bold transition-colors ${activePdf === 'endcap.pdf' ? 'bg-amber-500 text-black shadow-sm' : 'text-slate-400 hover:text-white'}`}
            >
                Endcap PDF
            </button>
            <button 
                onClick={() => setActivePdf('pallet.pdf')}
                className={`px-4 py-1.5 rounded-md text-sm font-bold transition-colors ${activePdf === 'pallet.pdf' ? 'bg-amber-500 text-black shadow-sm' : 'text-slate-400 hover:text-white'}`}
            >
                Pallet PDF
            </button>
        </div>

        <div className="flex gap-2">
            <button 
                onClick={() => window.print()} // Note: Mobile browsers handle print differently, usually via the share sheet for PDFs
                className="p-2 bg-slate-800 text-slate-300 rounded hover:bg-slate-700 hover:text-white"
                title="Print"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
            </button>
        </div>
      </div>
      
      {/* Viewer Container */}
      <div className="flex-1 relative bg-slate-800 w-full h-full overflow-hidden">
        {/* We use <object> for native PDF rendering which supports Pinch-to-Zoom and Text Search natively on iOS/Android */}
        <object
          key={activePdf} // Force re-render when PDF changes
          data={activePdf}
          type="application/pdf"
          className="w-full h-full block"
        >
            {/* Fallback for browsers that don't support inline PDF (rare on modern mobile) */}
            <div className="flex flex-col items-center justify-center h-full text-slate-400 p-6 text-center">
                <p className="mb-4">Your browser prefers downloading PDFs.</p>
                <a 
                    href={activePdf} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="px-6 py-3 bg-amber-500 text-black font-bold rounded-lg shadow-lg hover:bg-amber-400"
                >
                    Download {activePdf === 'endcap.pdf' ? 'Endcap' : 'Pallet'} Planogram
                </a>
            </div>
        </object>
      </div>
    </div>
  );
};
