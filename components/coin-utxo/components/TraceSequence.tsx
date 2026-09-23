import React, { useEffect, useState } from 'react';
import { 
  CheckCircle2, 
  Loader2, 
  Circle, 
  Terminal, 
  Cpu, 
  FastForward,
  Radio,
  Zap
} from 'lucide-react';

interface TraceSequenceProps {
  onComplete: () => void;
  walletAddress: string;
}

interface Step {
  id: number;
  label: string;
  subtext: string;
  logs: string[];
}

export const TraceSequence: React.FC<TraceSequenceProps> = ({
  onComplete,
  walletAddress
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [progress, setProgress] = useState(15);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    `[INIT] Booting graph crawler daemon for address: ${walletAddress.substring(0, 12)}...`,
    `[MEMPOOL] Ingesting raw UTXO / Account state logs from RPC nodes...`
  ]);

  const steps: Step[] = [
    {
      id: 0,
      label: 'Ingesting Transaction Graph',
      subtext: 'Scanning mempool, block headers & multi-hop forwarding edges',
      logs: [
        'Querying archive node for 5-hop directional transaction tree...',
        'Retrieved 14 transactions associated with reported scam node.',
        'Mempool velocity: 0.42 hops/hour detected.'
      ]
    },
    {
      id: 1,
      label: 'Clustering Common-Input Addresses',
      subtext: 'Applying change-address heuristics and co-spend clustering',
      logs: [
        'Executing multi-input co-spend clustering algorithm (RFC-6979 heuristic)...',
        'Isolated intermediate mule clusters with automated pass-through patterns.',
        'Analyzing peeling-chain signatures and micro-divergence splits.'
      ]
    },
    {
      id: 2,
      label: 'Matching Against Known VASP Signals',
      subtext: 'Correlating deposit wallets with 218 indexed exchange hot clusters',
      logs: [
        'Cross-referencing destination outputs with global VASP hot/deposit registry...',
        'Filtered 218 indexed Virtual Asset Service Providers (VASPs).',
        'High-density match detected on Centralized Exchange sweep script.'
      ]
    },
    {
      id: 3,
      label: 'Calculating Risk & Urgency Score',
      subtext: 'Evaluating laundering indicators, mixer hops & time-to-liquidate',
      logs: [
        'Running mixer / CoinJoin heuristic classifier...',
        'Evaluating block confirmation timestamp and withdrawal hold window...',
        'Attribution converged. Generating investigator freeze package.'
      ]
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 98) {
          clearInterval(timer);
          setTimeout(() => {
            onComplete();
          }, 350);
          return 100;
        }

        const newProgress = prev + 5;
        const targetStep = Math.min(Math.floor(newProgress / 25), 3);

        if (targetStep > currentStepIndex) {
          setCurrentStepIndex(targetStep);
          const newLogs = steps[targetStep]?.logs || [];
          setTerminalLogs((l) => [...l, ...newLogs]);
        }

        return newProgress;
      });
    }, 160);

    return () => clearInterval(timer);
  }, [currentStepIndex, onComplete]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-white dark:bg-[#0D111A] rounded-3xl border border-zinc-200 dark:border-[#1F2637] shadow-2xl overflow-hidden transition-colors duration-300">
        {/* Terminal Title Bar */}
        <div className="px-6 py-4 bg-[#0A0A0C] dark:bg-[#080B10] border-b border-zinc-800 dark:border-[#1A2230] text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#C6FF00]/80" />
            </div>
            <div className="h-4 w-[1px] bg-zinc-800 mx-2" />
            <div className="flex items-center space-x-2 text-xs font-mono">
              <Cpu className="w-3.5 h-3.5 text-[#C6FF00]" />
              <span className="text-zinc-300">ACTIVE TRACE ENGINE</span>
              <span className="text-zinc-600">•</span>
              <span className="text-[#C6FF00] font-bold">{progress}%</span>
            </div>
          </div>

          <button
            onClick={onComplete}
            className="text-[11px] font-mono text-zinc-400 hover:text-white flex items-center space-x-1 px-3 py-1 rounded-full bg-white/10 dark:bg-[#161D2C] hover:bg-white/20 dark:hover:bg-[#1E273B] transition-colors cursor-pointer border border-white/10 dark:border-[#232E42]"
          >
            <FastForward className="w-3 h-3 text-[#C6FF00]" />
            <span>Skip Animation</span>
          </button>
        </div>

        {/* Luminous Neon Progress Bar */}
        <div className="w-full bg-zinc-100 dark:bg-[#161D2B] h-1.5">
          <div
            className="bg-[#C6FF00] h-1.5 transition-all duration-200 ease-out shadow-[0_0_10px_#C6FF00]"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          {/* Target Address Header HUD */}
          <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-[#080B10] border border-zinc-200 dark:border-[#1C2538] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400 uppercase tracking-wider flex items-center space-x-2">
                <Radio className="w-3 h-3 text-[#65A30D] dark:text-[#C6FF00]" />
                <span>Tracing Target Root</span>
              </div>
              <div className="font-mono text-sm font-bold text-black dark:text-white mt-1 break-all">
                {walletAddress}
              </div>
            </div>
            <div className="shrink-0 flex items-center space-x-2 px-3 py-1 rounded-full bg-[#C6FF00]/20 dark:bg-[#C6FF00]/10 border border-[#C6FF00] text-black dark:text-[#C6FF00] text-xs font-mono font-bold">
              <span className="w-2 h-2 rounded-full bg-[#65A30D] dark:bg-[#C6FF00] animate-ping" />
              <span>HOP LINEAGE SCAN</span>
            </div>
          </div>

          {/* Sequential Step Progress Cards */}
          <div className="space-y-3">
            {steps.map((step) => {
              const isCompleted = step.id < currentStepIndex;
              const isCurrent = step.id === currentStepIndex;

              return (
                <div
                  key={step.id}
                  className={`p-4 rounded-2xl border transition-all duration-300 ${
                    isCurrent
                      ? 'bg-zinc-100 dark:bg-[#111726] border-black dark:border-[#C6FF00] shadow-md'
                      : isCompleted
                      ? 'bg-zinc-50 dark:bg-[#090C12] border-zinc-200 dark:border-[#1A2230]'
                      : 'bg-zinc-50/50 dark:bg-[#06080D] border-zinc-200/60 dark:border-[#121622] opacity-40'
                  }`}
                >
                  <div className="flex items-start space-x-3.5">
                    <div className="mt-0.5 shrink-0">
                      {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5 text-[#65A30D] dark:text-[#C6FF00]" />
                      ) : isCurrent ? (
                        <Loader2 className="w-5 h-5 text-[#65A30D] dark:text-[#C6FF00] animate-spin" />
                      ) : (
                        <Circle className="w-5 h-5 text-zinc-400 dark:text-zinc-600" />
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-xs font-mono font-bold uppercase tracking-wider ${
                            isCurrent
                              ? 'text-black dark:text-white'
                              : isCompleted
                              ? 'text-zinc-800 dark:text-zinc-200'
                              : 'text-zinc-400 dark:text-zinc-500'
                          }`}
                        >
                          Step {step.id + 1}: {step.label}
                        </span>
                        {isCompleted && (
                          <span className="text-[10px] font-mono text-[#65A30D] dark:text-[#C6FF00] font-bold bg-[#C6FF00]/20 px-2 py-0.5 rounded border border-[#C6FF00]/40">
                            RESOLVED
                          </span>
                        )}
                        {isCurrent && (
                          <span className="text-[10px] font-mono text-black dark:text-[#C6FF00] font-bold bg-[#C6FF00] dark:bg-[#C6FF00]/20 px-2 py-0.5 rounded animate-pulse border border-[#C6FF00]">
                            ANALYZING
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-mono text-zinc-600 dark:text-zinc-400 mt-1">
                        {step.subtext}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Real-Time Terminal Log Ticker */}
          <div className="rounded-2xl bg-[#06080D] p-4 text-xs font-mono border border-[#1C2538] shadow-inner">
            <div className="flex items-center space-x-2 text-zinc-400 mb-2 border-b border-[#1A2230] pb-2">
              <Terminal className="w-3.5 h-3.5 text-[#C6FF00]" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-300">
                Live Heuristic Execution Telemetry
              </span>
            </div>
            <div className="space-y-1.5 max-h-36 overflow-y-auto">
              {terminalLogs.map((log, index) => (
                <div key={index} className="text-zinc-400 leading-relaxed flex items-start space-x-2">
                  <span className="text-[#C6FF00] shrink-0 font-bold">&gt;</span>
                  <span className={index === terminalLogs.length - 1 ? 'text-white font-bold' : ''}>
                    {log}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
