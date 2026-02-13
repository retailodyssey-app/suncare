import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

interface Props {
  onScan: (upc: string) => void;
}

export const Scanner: React.FC<Props> = ({ onScan }) => {
  const [isScanning, setIsScanning] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const regionId = 'reader';

  const startScanner = async () => {
    if (!scannerRef.current) {
      scannerRef.current = new Html5Qrcode(regionId);
    }

    try {
      await scannerRef.current.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText) => {
          handleStop(); // Auto stop on success
          onScan(decodedText);
        },
        () => {} // Ignore errors for clean console
      );
      setIsScanning(true);
    } catch (err) {
      console.error('Error starting scanner', err);
      alert('Camera permission required or not available.');
    }
  };

  const handleStop = async () => {
    if (scannerRef.current && isScanning) {
      try {
        await scannerRef.current.stop();
        setIsScanning(false);
      } catch (err) {
        console.error('Failed to stop scanner', err);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current.stop().catch(console.error);
      }
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div id={regionId} className="w-full max-w-sm overflow-hidden rounded-lg bg-black border border-slate-700 min-h-[300px] mb-4 relative">
        {!isScanning && (
          <div className="absolute inset-0 flex items-center justify-center text-slate-500">
            <span className="text-4xl opacity-20">📷</span>
          </div>
        )}
      </div>
      
      <button
        onClick={isScanning ? handleStop : startScanner}
        className={`px-8 py-3 rounded-full font-bold text-white transition-colors ${
          isScanning ? 'bg-red-500 hover:bg-red-600' : 'bg-amber-500 hover:bg-amber-600 text-black'
        }`}
      >
        {isScanning ? 'Stop Camera' : 'Start Camera'}
      </button>
      
      {isScanning && <p className="mt-4 text-sm text-slate-400 animate-pulse">Scanning...</p>}
    </div>
  );
};
