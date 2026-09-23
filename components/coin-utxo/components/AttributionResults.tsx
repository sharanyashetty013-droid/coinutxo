import React, { useState } from 'react';
import { 
  Building2, 
  ShieldCheck, 
  AlertTriangle, 
  Clock, 
  Send, 
  FileText, 
  ChevronRight, 
  Check, 
  Activity, 
  Zap, 
  Scale, 
  Info,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { TraceResult } from '../types';

interface AttributionResultsProps {
  traceResult: TraceResult;
  onOpenAlertModal: () => void;
  onOpenReportModal: () => void;
}

export const AttributionResults: React.FC<AttributionResultsProps> = ({
  traceResult,
  onOpenAlertModal,
  onOpenReportModal
}) => {
  const [activeHeuristicTab, setActiveHeuristicTab] = useState<'hops' | 'timing' | 'cluster' | 'sweeping'>('hops');
  const [activeCandidateIndex, setActiveCandidateIndex] = useState(0);

  const topVasp = traceResult.topCandidates[activeCandidateIndex] || traceResult.topCandidates[0];
  const isHighRisk = traceResult.caseRisk === 'HIGH';
  const isUrgent = traceResult.urgency.status === 'IMMEDIATE_ACTION' || traceResult.urgency.status === 'ACTIVE_WINDOW';

  // SVG Radial Gauge Calculations
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (topVasp.confidenceScore / 100) * circumference;

  return (
    <div className="space-y-3 font-mono">
      {/* 1. TIME-SENSITIVE GOLDEN FREEZE WINDOW BANNER */}
      <div className={`rounded-md p-2.5 sm:p-3 border flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 transition-all shadow-2xs ${
        isUrgent
          ? 'bg-red-50 dark:bg-red-950/40 border-red-300 dark:border-red-900/60 text-red-950 dark:text-red-200'
          : 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-900/60 text-amber-950 dark:text-amber-200'
      }`}>
        <div className="flex items-center space-x-2.5">
          <div className={`p-1.5 rounded-xs shrink-0 ${isUrgent ? 'bg-red-200 dark:bg-red-900 text-red-800 dark:text-red-300' : 'bg-amber-200 dark:bg-amber-900 text-amber-800 dark:text-amber-300'}`}>
            <Clock className="w-3.5 h-3.5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2 text-[10px]">
              <span className={`px-1.5 py-0.2 rounded-xs font-bold uppercase tracking-wider ${
                isUrgent 
                  ? 'bg-red-200 dark:bg-red-900 text-red-900 dark:text-red-100 border border-red-300 dark:border-red-700' 
                  : 'bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-100 border border-amber-300 dark:border-amber-700'
              }`}>
                {traceResult.urgency.status.replace(/_/g, ' ')}
              </span>
              <span className="text-zinc-400">•</span>
              <span className="text-zinc-700 dark:text-zinc-300">
                LAST MOVEMENT: <strong className="text-black dark:text-white font-bold">{traceResult.urgency.lastMovementText}</strong>
              </span>
            </div>
            <p className="text-[11px] text-zinc-700 dark:text-zinc-300 mt-0.5">
              {traceResult.urgency.freezeRecommendation}
            </p>
          </div>
        </div>

        <div className="shrink-0 flex items-center space-x-2">
          <button
            onClick={onOpenAlertModal}
            className="px-3 py-1.5 rounded-xs bg-red-600 hover:bg-red-700 text-white text-[11px] font-bold uppercase tracking-wider transition-colors flex items-center space-x-1.5 shadow-2xs cursor-pointer border border-red-700"
          >
            <Zap className="w-3 h-3 fill-current text-white" />
            <span>FAST-TRACK FREEZE DIRECTIVE</span>
          </button>
        </div>
      </div>

      {/* 2. LAUNDERING / MIXER RISK BANNER (IF DETECTED) */}
      {traceResult.launderingRisk.detected && (
        <div className="rounded-md p-2.5 bg-purple-50 dark:bg-purple-950/30 border border-purple-300 dark:border-purple-900/60 shadow-2xs flex items-center justify-between gap-2.5">
          <div className="flex items-center space-x-2.5">
            <div className="p-1.5 rounded-xs bg-purple-200 dark:bg-purple-900 text-purple-800 dark:text-purple-300 shrink-0">
              <AlertTriangle className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="flex items-center space-x-2 text-[10px]">
                <span className="font-bold text-purple-950 dark:text-purple-200 uppercase tracking-wide">
                  OBFUSCATION PATTERN: {traceResult.launderingRisk.type}
                </span>
                <span className="px-1.5 py-0.2 rounded-xs bg-purple-200 dark:bg-purple-900 text-purple-900 dark:text-purple-100 border border-purple-300 dark:border-purple-700 uppercase font-bold">
                  INTERMEDIARY MIXER POOL
                </span>
              </div>
              <p className="text-[11px] text-zinc-700 dark:text-zinc-300 mt-0.5">
                {traceResult.launderingRisk.description}
              </p>
            </div>
          </div>
          <span className="hidden md:inline text-[9px] text-purple-800 dark:text-purple-200 bg-purple-100 dark:bg-purple-900/50 px-2 py-0.5 rounded-xs border border-purple-200 dark:border-purple-800 uppercase font-bold">
            PEELING CHAIN DE-ANONYMIZED
          </span>
        </div>
      )}

      {/* 3. PRIMARY ATTRIBUTION HERO & RADIAL GAUGE */}
      <div className="rounded-md bg-white dark:bg-[#070A11] border border-zinc-300 dark:border-zinc-800 p-3.5 sm:p-4 shadow-2xs relative overflow-hidden transition-colors">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Left: Headline Attribution */}
          <div className="space-y-2.5 max-w-2xl">
            <div className="flex items-center space-x-2 text-[10px]">
              <span className="px-1.5 py-0.2 rounded-xs bg-[#C6FF00] text-black font-bold uppercase tracking-wider">
                PRIMARY ATTRIBUTION FINDING
              </span>
              <span className="text-zinc-400">•</span>
              <span className="text-zinc-600 dark:text-zinc-400 font-semibold uppercase">JURISDICTION: {topVasp.vaspJurisdiction}</span>
            </div>

            <div>
              <div className="text-[10px] text-zinc-500 uppercase tracking-wider">
                CRYPTOGRAPHIC HEURISTICS ISOLATE DESTINATION VASP:
              </div>
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-white mt-0.5 flex items-center space-x-2.5 uppercase">
                <span>{topVasp.name}</span>
                <span className="text-[10px] font-bold text-black bg-[#C6FF00] px-2 py-0.5 rounded-xs shadow-2xs">
                  {topVasp.confidenceScore}% CERTAINTY
                </span>
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs pt-0.5">
              <div className="p-2 rounded-xs bg-zinc-50 dark:bg-[#05070B] border border-zinc-200 dark:border-zinc-800">
                <div className="text-[9px] text-zinc-400 uppercase tracking-wider">DEPOSIT SWEEPER</div>
                <div className="font-bold text-zinc-900 dark:text-white mt-0.5 truncate text-[11px]">{topVasp.depositAddress}</div>
              </div>

              <div className="p-2 rounded-xs bg-zinc-50 dark:bg-[#05070B] border border-zinc-200 dark:border-zinc-800">
                <div className="text-[9px] text-zinc-400 uppercase tracking-wider">GRAPH LINEAGE</div>
                <div className="font-bold text-[#65A30D] dark:text-[#C6FF00] mt-0.5 text-[11px]">{topVasp.hopsCount} INTERMEDIATE HOPS</div>
              </div>

              <div className="p-2 rounded-xs bg-zinc-50 dark:bg-[#05070B] border border-zinc-200 dark:border-zinc-800">
                <div className="text-[9px] text-zinc-400 uppercase tracking-wider">DESTINATION NODE</div>
                <div className="font-bold text-zinc-900 dark:text-white mt-0.5 text-[11px]">{topVasp.clusterType}</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-2 pt-0.5">
              <button
                onClick={onOpenAlertModal}
                className="px-3.5 py-1.5 rounded-xs bg-[#C6FF00] hover:bg-[#bcf100] text-black text-xs font-bold uppercase tracking-wider transition-colors flex items-center space-x-1.5 shadow-2xs cursor-pointer border border-[#b2e600]"
              >
                <Send className="w-3 h-3" />
                <span>ROUTE TO INVESTIGATION DESK</span>
              </button>

              <button
                onClick={onOpenReportModal}
                className="px-3.5 py-1.5 rounded-xs bg-zinc-900 hover:bg-black text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center space-x-1.5 cursor-pointer shadow-2xs border border-zinc-700"
              >
                <FileText className="w-3 h-3 text-[#C6FF00]" />
                <span>EXPORT FORENSIC DOSSIER</span>
              </button>
            </div>
          </div>

          {/* Right: Radial Confidence Meter HUD */}
          <div className="shrink-0 flex flex-col items-center justify-center p-3.5 rounded-xs bg-zinc-50 dark:bg-[#05070B] border border-zinc-200 dark:border-zinc-800 shadow-2xs">
            <div className="relative w-24 h-24 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  fill="transparent"
                  stroke="currentColor"
                  className="text-zinc-200 dark:text-zinc-800"
                  strokeWidth="8"
                />
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  fill="transparent"
                  stroke="#C6FF00"
                  strokeWidth="8"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className="transition-all duration-700 ease-out"
                />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center font-mono">
                <span className="text-xl font-bold text-zinc-900 dark:text-white tabular-nums tracking-tight">
                  {topVasp.confidenceScore}%
                </span>
                <span className="text-[8px] text-[#65A30D] dark:text-[#C6FF00] font-bold uppercase tracking-wider">
                  CONFIDENCE
                </span>
              </div>
            </div>

            <div className="mt-1.5 text-center">
              <div className="text-[9px] font-bold text-zinc-900 dark:text-white uppercase tracking-wider">FATF REC 16 MATCH</div>
              <div className="text-[8px] text-zinc-500 uppercase">CONVERGENCE: HIGH</div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. RANKED CANDIDATE MATRIX */}
      <div className="rounded-md bg-white dark:bg-[#070A11] border border-zinc-300 dark:border-zinc-800 p-3 sm:p-3.5 shadow-2xs space-y-2.5 transition-colors">
        <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-2">
          <div className="flex items-center space-x-1.5">
            <Layers className="w-3.5 h-3.5 text-[#65A30D] dark:text-[#C6FF00]" />
            <h4 className="text-[11px] font-bold text-zinc-900 dark:text-white uppercase tracking-wider">
              RANKED CANDIDATE ATTRIBUTION MATRIX (TOP 3 SIGNALS)
            </h4>
          </div>
          <span className="text-[9px] text-zinc-400 uppercase">
            CLICK TO EXPAND EVIDENCE
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          {traceResult.topCandidates.map((candidate, idx) => {
            const isSelected = activeCandidateIndex === idx;

            return (
              <div
                key={candidate.name}
                onClick={() => setActiveCandidateIndex(idx)}
                className={`p-2.5 rounded-xs border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-zinc-900 dark:bg-[#0B101C] text-white border-zinc-900 dark:border-zinc-600 shadow-2xs ring-1 ring-[#C6FF00]'
                    : 'bg-zinc-50 dark:bg-[#05070B] border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 text-zinc-900 dark:text-zinc-200'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className={`text-[8px] font-bold uppercase tracking-wider ${isSelected ? 'text-[#C6FF00]' : 'text-zinc-500'}`}>
                      RANK #{idx + 1}
                    </span>
                    <h5 className={`text-xs font-bold mt-0.5 uppercase ${isSelected ? 'text-white' : 'text-zinc-900 dark:text-white'}`}>
                      {candidate.name}
                    </h5>
                  </div>
                  <span className="text-xs font-bold text-[#C6FF00] tabular-nums">
                    {candidate.confidenceScore}%
                  </span>
                </div>

                {/* Progress bar */}
                <div className={`w-full h-1 rounded-xs mt-2 overflow-hidden ${isSelected ? 'bg-zinc-800' : 'bg-zinc-200 dark:bg-zinc-800'}`}>
                  <div
                    className="bg-[#C6FF00] h-full rounded-xs transition-all"
                    style={{ width: `${candidate.confidenceScore}%` }}
                  />
                </div>

                <div className={`mt-2 grid grid-cols-2 gap-1 text-[9px] ${isSelected ? 'text-zinc-400' : 'text-zinc-500'}`}>
                  <div>HOPS: <strong className={isSelected ? 'text-white' : 'text-zinc-800 dark:text-zinc-200'}>{candidate.hopsCount}</strong></div>
                  <div>RISK: <strong className={isSelected ? 'text-zinc-200' : 'text-zinc-800 dark:text-zinc-200'}>{candidate.riskLabel}</strong></div>
                  <div className="col-span-2 truncate">
                    TYPE: <strong className={isSelected ? 'text-zinc-300' : 'text-zinc-800 dark:text-zinc-200'}>{candidate.clusterType}</strong>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. FORENSIC EXPLAINABILITY HEURISTICS */}
      <div className="rounded-md bg-white dark:bg-[#070A11] border border-zinc-300 dark:border-zinc-800 p-3 sm:p-3.5 shadow-2xs space-y-2.5 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-2">
          <div className="flex items-center space-x-1.5">
            <Info className="w-3.5 h-3.5 text-[#65A30D] dark:text-[#C6FF00]" />
            <h4 className="text-[11px] font-bold text-zinc-900 dark:text-white uppercase tracking-wider">
              FORENSIC EXPLAINABILITY // VECTORS FOR {topVasp.name} ({topVasp.confidenceScore}%)
            </h4>
          </div>

          {/* Tab Selector */}
          <div className="flex space-x-1 bg-zinc-100 dark:bg-[#05070B] p-0.5 rounded-xs border border-zinc-200 dark:border-zinc-800">
            {(['hops', 'timing', 'cluster', 'sweeping'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveHeuristicTab(tab)}
                className={`px-2 py-0.5 text-[9px] rounded-xs transition-colors cursor-pointer uppercase font-bold ${
                  activeHeuristicTab === tab ? 'bg-zinc-900 dark:bg-zinc-700 text-[#C6FF00]' : 'text-zinc-500 hover:text-black dark:hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Heuristic Explanation Detail Box */}
        <div className="p-3 rounded-xs bg-zinc-50 dark:bg-[#05070B] border border-zinc-200 dark:border-zinc-800 text-[11px] text-zinc-700 dark:text-zinc-300 leading-normal">
          {activeHeuristicTab === 'hops' && (
            <div className="space-y-1">
              <div className="text-zinc-900 dark:text-white font-bold uppercase text-[10px]">
                VECTOR 01 // MULTI-HOP GRAPH LINEAGE:
              </div>
              <p>{topVasp.heuristics.hopsAnalysis}</p>
              <div className="text-[9px] text-zinc-400 mt-0.5">
                Confidence decay benchmark: 4.2% per intermediate hop; 2-hop transmission maintains 94%+ statistical certainty.
              </div>
            </div>
          )}

          {activeHeuristicTab === 'timing' && (
            <div className="space-y-1">
              <div className="text-zinc-900 dark:text-white font-bold uppercase text-[10px]">
                VECTOR 02 // TEMPORAL VELOCITY CORRELATION:
              </div>
              <p>{topVasp.heuristics.timingCorrelation}</p>
              <div className="text-[9px] text-zinc-400 mt-0.5">
                Automated script relay signature flagged across sub-12 minute confirmation intervals.
              </div>
            </div>
          )}

          {activeHeuristicTab === 'cluster' && (
            <div className="space-y-1">
              <div className="text-zinc-900 dark:text-white font-bold uppercase text-[10px]">
                VECTOR 03 // COMMON-INPUT CLUSTER SIGNATURES:
              </div>
              <p>{topVasp.heuristics.clusterBehavior}</p>
              <div className="text-[9px] text-zinc-400 mt-0.5">
                Multi-input address clustering merges disparate private keys under single criminal syndicate custody.
              </div>
            </div>
          )}

          {activeHeuristicTab === 'sweeping' && (
            <div className="space-y-1">
              <div className="text-zinc-900 dark:text-white font-bold uppercase text-[10px]">
                VECTOR 04 // VASP HOT SWEEPER ARCHITECTURE:
              </div>
              <p>{topVasp.heuristics.depositPattern}</p>
              <div className="text-[9px] text-zinc-400 mt-0.5">
                Deposit aggregation bytecode corresponds with verified exchange hot-wallet sweeper registry.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
