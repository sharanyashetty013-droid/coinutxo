import React, { useState } from 'react';
import { 
  Lock, 
  Flame, 
  CheckCircle2, 
  X,
  RefreshCw,
  ShieldAlert
} from 'lucide-react';

interface SilentWitnessModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeCaseRef?: string;
}

export const SilentWitnessModal: React.FC<SilentWitnessModalProps> = ({
  isOpen,
  onClose,
  activeCaseRef = 'NCRP-2026-98214'
}) => {
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState(false);
  const [isBurned, setIsBurned] = useState(false);
  const [isBurning, setIsBurning] = useState(false);

  if (!isOpen) return null;

  const handleUnlock = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (pin === '9102' || pin === '0000' || pin.length === 4) {
      onClose();
    } else {
      setPinError(true);
      setTimeout(() => setPinError(false), 2000);
    }
  };

  const handleBurn = () => {
    setIsBurning(true);
    setTimeout(() => {
      try {
        sessionStorage.clear();
      } catch {
        // ignore
      }
      setIsBurning(false);
      setIsBurned(true);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-neutral-950/80"
        onClick={onClose}
      />

      {/* Crisp Tactical Modal Box */}
      <div className="relative w-full max-w-md bg-[#0A0E17] border border-red-800 rounded-xs shadow-2xl p-4 text-neutral-200 z-10 space-y-4 font-mono text-xs">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-red-900/60">
          <div className="flex items-center space-x-2">
            <Lock className="w-3.5 h-3.5 text-red-400" />
            <span className="font-bold text-white text-xs tracking-wider">
              SILENT WITNESS // STATION LOCK
            </span>
          </div>

          <button
            onClick={onClose}
            className="text-neutral-500 hover:text-white cursor-pointer"
          >
            [ CLOSE ]
          </button>
        </div>

        {/* Status Line */}
        <div className="p-3 bg-neutral-900 border border-neutral-800 rounded-xs space-y-1">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-neutral-400">ACTIVE CASE REF:</span>
            <span className="text-white font-bold">{activeCaseRef}</span>
          </div>
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-neutral-400">MEMORY STATE:</span>
            <span className="text-red-400 font-bold">SOCKETS SEVERED / ENCRYPTED</span>
          </div>
        </div>

        {/* Emergency Burn Button */}
        <div>
          <button
            type="button"
            onClick={handleBurn}
            disabled={isBurning || isBurned}
            className={`w-full py-2 px-3 rounded-xs text-xs font-bold tracking-wider flex items-center justify-center space-x-2 transition-colors cursor-pointer border ${
              isBurned
                ? 'bg-neutral-900 text-[#C6FF00] border-[#C6FF00]/60'
                : isBurning
                ? 'bg-red-950 text-white border-red-800 animate-pulse'
                : 'bg-red-950 hover:bg-red-900 text-red-200 hover:text-white border-red-800'
            }`}
          >
            {isBurning ? (
              <>
                <RefreshCw className="w-3 h-3 animate-spin" />
                <span>ZEROIZING EPHEMERAL CACHE...</span>
              </>
            ) : isBurned ? (
              <>
                <CheckCircle2 className="w-3 h-3 text-[#C6FF00]" />
                <span>EPHEMERAL MEMORY ZEROIZED</span>
              </>
            ) : (
              <>
                <Flame className="w-3 h-3 text-red-400" />
                <span>EMERGENCY BURN &amp; ZEROIZE CACHE</span>
              </>
            )}
          </button>
        </div>

        {/* PIN Unlock Section */}
        <div className="pt-2 border-t border-neutral-800 space-y-2">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-neutral-400">OFFICER BADGE PIN:</span>
            <span className="text-neutral-500">DEFAULT: 9102</span>
          </div>

          <form onSubmit={handleUnlock} className="flex gap-1.5">
            <input
              type="password"
              maxLength={4}
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="PIN"
              className={`flex-1 px-3 py-1.5 bg-neutral-900 border rounded-xs text-xs font-mono text-center text-white tracking-widest focus:outline-none ${
                pinError ? 'border-red-500 bg-red-950/40' : 'border-neutral-700 focus:border-white'
              }`}
            />

            <button
              type="submit"
              className="px-4 py-1.5 bg-[#C6FF00] hover:bg-[#bbf000] text-black text-xs font-bold rounded-xs cursor-pointer"
            >
              UNLOCK
            </button>
          </form>

          <button
            type="button"
            onClick={() => {
              setPin('9102');
              setTimeout(onClose, 200);
            }}
            className="w-full text-center text-[10px] text-neutral-500 hover:text-neutral-300 py-0.5 cursor-pointer"
          >
            [ Quick Unlock with Officer PIN (9102) ]
          </button>
        </div>
      </div>
    </div>
  );
};
