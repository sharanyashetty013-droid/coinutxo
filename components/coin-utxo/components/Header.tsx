import React from 'react';
import { Lock, ShieldAlert } from 'lucide-react';
import { motion } from 'motion/react';

export type WorkspaceTab = 'alerts' | 'desk' | 'intelligence' | 'pass';

interface HeaderProps {
  activeTab: WorkspaceTab;
  setActiveTab: (tab: WorkspaceTab) => void;
  hasActiveTrace: boolean;
  onOpenSilentWitness: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  hasActiveTrace,
  onOpenSilentWitness
}) => {
  const navTabs: { id: WorkspaceTab; label: string; hasBadge?: boolean }[] = [
    { id: 'alerts', label: 'Incidents Feed' },
    { id: 'desk', label: 'Case Desk' },
    { id: 'intelligence', label: 'Forensics & Graph', hasBadge: hasActiveTrace },
    { id: 'pass', label: 'Legal & CrPC' }
  ];

  return (
    <header className="sticky top-0 z-40 w-full px-2 sm:px-4 pt-1">
      {/* Precision Tactical Header Bar */}
      <div className="w-full max-w-7xl mx-auto bg-[#0B0E14] text-white rounded-lg px-4 sm:px-6 py-3 flex items-center justify-between shadow-sm border border-zinc-800 transition-colors duration-300">
        {/* Left: Brand Logo & Title */}
        <div
          onClick={() => setActiveTab('desk')}
          className="flex items-center space-x-2.5 cursor-pointer select-none"
        >
          <div className="w-7 h-7 rounded-md bg-[#C6FF00] flex items-center justify-center shrink-0">
            <ShieldAlert className="w-4 h-4 text-black" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-sm sm:text-base font-bold tracking-tight text-white">
              Coin UTXO
            </span>
            <span className="hidden sm:block text-[11px] text-zinc-500">
              Crypto Fraud Attribution
            </span>
          </div>
        </div>

        {/* Center: Nav */}
        <nav className="relative flex items-center gap-1 text-sm">
          {navTabs.map((tab) => {
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-3 py-1.5 rounded-md text-xs sm:text-sm transition-colors flex items-center gap-1.5 select-none cursor-pointer ${
                  isActive ? 'text-white font-semibold' : 'text-zinc-400 hover:text-white'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNavTabPill"
                    className="absolute inset-0 rounded-md bg-zinc-800"
                    transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                  />
                )}
                <span className="relative z-10">{tab.label}</span>
                {tab.hasBadge && (
                  <span className="relative z-10 w-1.5 h-1.5 rounded-full bg-[#C6FF00]" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenSilentWitness}
            title="Emergency lock & local memory wipe"
            className="p-2 rounded-md text-zinc-400 hover:text-red-300 hover:bg-red-950/40 transition-colors cursor-pointer"
          >
            <Lock className="w-4 h-4" />
          </button>

          <button
            onClick={() => setActiveTab('intelligence')}
            className={`hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs border transition-colors cursor-pointer ${
              hasActiveTrace
                ? 'bg-[#C6FF00]/10 text-[#C6FF00] border-[#C6FF00]/30'
                : 'text-zinc-500 border-zinc-800'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${hasActiveTrace ? 'bg-[#C6FF00]' : 'bg-zinc-600'}`} />
            {hasActiveTrace ? 'Active trace' : 'Standby'}
          </button>
        </div>
      </div>
    </header>
  );
};



