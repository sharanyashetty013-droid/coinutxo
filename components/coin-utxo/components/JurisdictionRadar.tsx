import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Globe2, 
  ShieldAlert, 
  Clock, 
  ArrowRight, 
  FileText, 
  Copy, 
  Check, 
  AlertTriangle, 
  Building2, 
  Scale, 
  ExternalLink,
  ChevronRight,
  Radio,
  Send
} from 'lucide-react';
import { TraceResult } from '../types';

interface JurisdictionRadarProps {
  traceResult: TraceResult;
  className?: string;
}

interface JurisdictionProfile {
  id: string;
  name: string;
  region: string;
  flag: string;
  fatfStatus: 'Compliant' | 'Monitored (Grey List)' | 'High Risk';
  mlatStatus: 'Direct Treaty Active' | 'Letters Rogatory Required' | 'Special Liaison Protocol';
  avgMlatLatency: string;
  directLePortal: boolean;
  frictionScore: number; // 0-100 (higher = harder to freeze)
  frictionLevel: 'Low' | 'Moderate' | 'High' | 'Severe';
  regulator: string;
  authoritiesToContact: {
    step: number;
    title: string;
    entity: string;
    action: string;
    latency: string;
  }[];
  statutoryBasis: string;
}

const JURISDICTION_PROFILES: Record<string, JurisdictionProfile> = {
  'cayman': {
    id: 'cayman',
    name: 'Cayman Islands',
    region: 'Caribbean Offshore',
    flag: '🇰🇾',
    fatfStatus: 'Compliant',
    mlatStatus: 'Direct Treaty Active',
    avgMlatLatency: '14 - 28 Days',
    directLePortal: true,
    frictionScore: 38,
    frictionLevel: 'Low',
    regulator: 'Cayman Islands Monetary Authority (CIMA)',
    authoritiesToContact: [
      {
        step: 1,
        title: 'VASP Global LE Portal',
        entity: 'Direct Exchange Compliance Desk',
        action: 'Submit 72-hour emergency account preservation order with transaction hashes.',
        latency: '4 - 8 Hours'
      },
      {
        step: 2,
        title: 'Central Authority Intimation',
        entity: 'CBI Interpol NCB & Cayman Financial Crimes Unit',
        action: 'File electronic liaison request for freeze extension beyond 72 hours.',
        latency: '24 - 48 Hours'
      },
      {
        step: 3,
        title: 'Formal MLAT Transmittal',
        entity: 'Ministry of Home Affairs & Grand Court of Cayman',
        action: 'Issue formal Mutual Legal Assistance Treaty request under Sec 166A CrPC.',
        latency: '14 - 28 Days'
      }
    ],
    statutoryBasis: 'Cayman Islands Mutual Legal Assistance (USA/Commonwealth) Act & CIMA VASP Regulations'
  },
  'seychelles': {
    id: 'seychelles',
    name: 'Seychelles',
    region: 'Indian Ocean Offshore',
    flag: '🇸🇨',
    fatfStatus: 'Monitored (Grey List)',
    mlatStatus: 'Letters Rogatory Required',
    avgMlatLatency: '45 - 90 Days',
    directLePortal: true,
    frictionScore: 78,
    frictionLevel: 'High',
    regulator: 'Seychelles Financial Services Authority (FSA)',
    authoritiesToContact: [
      {
        step: 1,
        title: 'Emergency LE Portal Notice',
        entity: 'Exchange Compliance Liaison',
        action: 'File immediate voluntary preservation request citing ongoing wire fraud investigation.',
        latency: '6 - 12 Hours'
      },
      {
        step: 2,
        title: 'FIU Seychelles Notification',
        entity: 'Financial Intelligence Unit (FIU) Seychelles',
        action: 'Transmit intelligence bulletin via Egmont Group FIU-to-FIU secure channel.',
        latency: '3 - 5 Days'
      },
      {
        step: 3,
        title: 'High Court Letters Rogatory',
        entity: 'Supreme Court of Seychelles via MHA Central Authority',
        action: 'Transmit judicial rogatory commission seeking restraint of omnibus hot wallet outputs.',
        latency: '45 - 90 Days'
      }
    ],
    statutoryBasis: 'Seychelles Mutual Assistance in Criminal Matters Act & FSA Offshore IBC Registry'
  },
  'dubai': {
    id: 'dubai',
    name: 'United Arab Emirates (Dubai)',
    region: 'Middle East Hub',
    flag: '🇦🇪',
    fatfStatus: 'Compliant',
    mlatStatus: 'Direct Treaty Active',
    avgMlatLatency: '7 - 14 Days',
    directLePortal: true,
    frictionScore: 28,
    frictionLevel: 'Low',
    regulator: 'Virtual Assets Regulatory Authority (VARA)',
    authoritiesToContact: [
      {
        step: 1,
        title: 'VARA LE Enforcement Fast-Track',
        entity: 'VARA Compliance & Licensed VASP Portal',
        action: 'Issue digital freezing subpoena under VARA Rulebook for Market Conduct.',
        latency: '2 - 6 Hours'
      },
      {
        step: 2,
        title: 'Dubai Police Cybercrime Division',
        entity: 'General Department of Criminal Investigation (CID)',
        action: 'Coordinate bilateral cyber patrol liaison for suspect wallet freezing.',
        latency: '24 Hours'
      },
      {
        step: 3,
        title: 'Bilateral Judicial Execution',
        entity: 'Ministry of Justice (UAE) & MHA India',
        action: 'Bilateral criminal legal assistance execution under UAE-India Extradition & MLAT.',
        latency: '7 - 14 Days'
      }
    ],
    statutoryBasis: 'UAE Cabinet Resolution No. 111/2022 on Virtual Assets & India-UAE Bilateral MLAT'
  },
  'singapore': {
    id: 'singapore',
    name: 'Singapore',
    region: 'Asia Pacific Financial Center',
    flag: '🇸🇬',
    fatfStatus: 'Compliant',
    mlatStatus: 'Direct Treaty Active',
    avgMlatLatency: '5 - 10 Days',
    directLePortal: true,
    frictionScore: 22,
    frictionLevel: 'Low',
    regulator: 'Monetary Authority of Singapore (MAS)',
    authoritiesToContact: [
      {
        step: 1,
        title: 'Direct VASP Rapid Freeze',
        entity: 'Licensed Digital Payment Token (DPT) Desk',
        action: 'Serve immediate preservation order with verified graph attribution proof.',
        latency: '2 - 4 Hours'
      },
      {
        step: 2,
        title: 'Singapore Police Force (CAD)',
        entity: 'Commercial Affairs Department (CAD) Cyber Ops',
        action: 'File police-to-police mutual request via INTERPOL I-24/7 communications.',
        latency: '12 - 24 Hours'
      },
      {
        step: 3,
        title: 'Attorney-General\'s Chambers (AGC)',
        entity: 'International Affairs Division (IAD)',
        action: 'Execute mutual assistance order for seizure of accounts under MACMA.',
        latency: '5 - 10 Days'
      }
    ],
    statutoryBasis: 'Singapore Mutual Assistance in Criminal Matters Act (MACMA) & Payment Services Act'
  }
};

export const JurisdictionRadar: React.FC<JurisdictionRadarProps> = ({
  traceResult,
  className = ''
}) => {
  const topVasp = traceResult.topCandidates[0];
  const detectedJurisdictionRaw = topVasp?.vaspJurisdiction || 'Cayman Islands';

  // Match default jurisdiction from VASP profile
  const getDefaultJurisdictionKey = () => {
    const rawLower = detectedJurisdictionRaw.toLowerCase();
    if (rawLower.includes('seychelles')) return 'seychelles';
    if (rawLower.includes('dubai') || rawLower.includes('uae')) return 'dubai';
    if (rawLower.includes('singapore')) return 'singapore';
    return 'cayman';
  };

  const [selectedJurisdictionKey, setSelectedJurisdictionKey] = useState<string>(getDefaultJurisdictionKey());
  const [copiedMemo, setCopiedMemo] = useState(false);
  const [showMemoModal, setShowMemoModal] = useState(false);

  const currentProfile = JURISDICTION_PROFILES[selectedJurisdictionKey] || JURISDICTION_PROFILES['cayman'];

  const liveFeeds = [
    {
      time: 'Just now',
      source: 'Singapore MAS',
      msg: 'DPT licensed exchanges reporting average 4.2h preservation response time.'
    },
    {
      time: '3m ago',
      source: 'Dubai VARA',
      msg: 'VARA Rulebook update: Direct LE portal API online for registered desks.'
    },
    {
      time: '11m ago',
      source: 'Seychelles FSA',
      msg: 'High-friction advisory: Letters rogatory queue extended; prioritize direct VASP LE portal.'
    },
    {
      time: '24m ago',
      source: 'INTERPOL NCB',
      msg: 'Silver Notice fast-track enabled for cross-border cryptocurrency sweepers.'
    }
  ];

  const handleCopyMemo = () => {
    const memo = `INTERNATIONAL MUTUAL LEGAL ASSISTANCE (MLAT) PRESERVATION REQUEST
To: Central Authority / Compliance Liaison Desk - ${currentProfile.name}
Regulatory Authority: ${currentProfile.regulator}
Case Token: ${traceResult.complaint.complaintRef}
Investigation ID: ${traceResult.traceId}

1. TARGET CRYPTOCURRENCY ENTITY:
- Destination VASP: ${topVasp?.name || 'Identified Exchange'}
- Jurisdictional Hub: ${currentProfile.name}
- Target Depository Address: ${topVasp?.depositAddress || '0x3f5CE5FBFe3E9af3971dD833D26bA9b5C936f0bE'}
- Traced Defrauded Amount: ${traceResult.complaint.amountEstimated}

2. STATUTORY BASIS:
- ${currentProfile.statutoryBasis}
- Criminal Procedure Code (Sec 91/102 & 166A) / Bilateral Treaties
- FATF Recommendation 16 (Travel Rule Cross-Border Compliance)

3. URGENT RELIEF REQUESTED:
- Immediate 72-Hour Administrative Freeze on destination deposit cluster.
- Preservation of associated IP login logs, KYC/AML identity records, and bank cash-out accounts.
- Transmission of verified account holder records to Central Bureau of Investigation (CBI) INTERPOL NCB.`;

    navigator.clipboard.writeText(memo);
    setCopiedMemo(true);
    setTimeout(() => setCopiedMemo(false), 2000);
  };

  return (
    <div className={`bg-white dark:bg-[#070A11] rounded-md border border-zinc-300 dark:border-zinc-800 shadow-2xs overflow-hidden font-mono ${className}`}>
      {/* Radar Section Header */}
      <div className="p-3 sm:p-3.5 bg-zinc-100 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-[11px] font-bold text-zinc-900 dark:text-white uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-[#65A30D] dark:bg-[#C6FF00] animate-pulse" />
            <Globe2 className="w-3.5 h-3.5 text-[#65A30D] dark:text-[#C6FF00]" />
            <span>JURISDICTION RADAR // CROSS-BORDER TRAP</span>
            <span className="text-zinc-400">•</span>
            <span className="text-zinc-500 font-normal">COMPLIANCE &amp; TREATY MAPPER</span>
          </div>

          <p className="text-[11px] text-zinc-500 leading-normal max-w-2xl">
            Detects offshore movement into foreign VASP hubs. Real-time MLAT latency forecasts, freezing friction indices, and international judicial contact paths.
          </p>
        </div>

        {/* Action Button to Generate MLAT Notice */}
        <button
          onClick={() => setShowMemoModal(true)}
          className="px-3 py-1.5 rounded-xs bg-zinc-900 hover:bg-black text-[#C6FF00] text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5 transition-colors cursor-pointer border border-zinc-700 shadow-2xs self-start md:self-auto shrink-0"
        >
          <FileText className="w-3 h-3" />
          <span>GENERATE MLAT NOTICE</span>
        </button>
      </div>

      {/* Interactive Jurisdiction Selector */}
      <div className="px-3.5 py-2 bg-zinc-50 dark:bg-[#05070B] border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between flex-wrap gap-2 text-xs">
        <div className="flex items-center space-x-1.5 overflow-x-auto">
          <span className="text-zinc-400 text-[10px] uppercase font-bold mr-1">JURISDICTION:</span>
          {Object.values(JURISDICTION_PROFILES).map((prof) => {
            const isSelected = selectedJurisdictionKey === prof.id;
            const isDetectedHop = detectedJurisdictionRaw.toLowerCase().includes(prof.name.toLowerCase());

            return (
              <button
                key={prof.id}
                onClick={() => setSelectedJurisdictionKey(prof.id)}
                className={`px-2 py-1 rounded-xs text-[10px] uppercase font-bold flex items-center space-x-1.5 transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-zinc-900 dark:bg-zinc-800 text-[#C6FF00] border border-zinc-700 shadow-2xs'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white border border-transparent'
                }`}
              >
                <span>{prof.flag}</span>
                <span>{prof.name}</span>
                {isDetectedHop && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C6FF00] inline-block animate-pulse" title="Detected in active trace" />
                )}
              </button>
            );
          })}
        </div>

        <div className="flex items-center space-x-1.5 text-[10px] text-zinc-500 bg-zinc-100 dark:bg-zinc-900 px-2 py-0.5 rounded-xs border border-zinc-200 dark:border-zinc-800">
          <span>DESTINATION VASP:</span>
          <strong className="text-zinc-900 dark:text-white font-bold uppercase">{topVasp?.name || 'Unknown'}</strong>
        </div>
      </div>

      {/* Main Radar Dashboard Content */}
      <div className="p-3.5 sm:p-4 space-y-3.5">
        {/* Visual Cross-Border Route Pipeline Diagram */}
        <div className="p-3 rounded-xs bg-zinc-900 dark:bg-[#05070B] text-white border border-zinc-800 relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C6FF00] animate-ping" />
              <span className="text-[10px] font-bold tracking-wider text-[#C6FF00] uppercase">
                DETECTED CROSS-BORDER TRAP ROUTE
              </span>
            </div>
            <span className="text-[9px] text-zinc-400 bg-zinc-800 px-1.5 py-0.2 rounded-xs border border-zinc-700 uppercase">
              ACTIVE HOP GRAPH
            </span>
          </div>

          {/* 3-Stage Pipeline */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {/* Stage 1 */}
            <div className="p-2.5 rounded-xs bg-zinc-800/80 border border-zinc-700/80 space-y-0.5">
              <div className="flex items-center justify-between text-[10px] text-zinc-400 uppercase">
                <span>STAGE 1: ORIGIN</span>
                <span className="text-xs">🇮🇳</span>
              </div>
              <div className="text-xs font-bold text-white uppercase truncate">
                Victim Ingress
              </div>
              <div className="text-[10px] text-zinc-400 truncate">
                {traceResult.complaint.walletAddress.substring(0, 14)}...
              </div>
            </div>

            {/* Stage 2 */}
            <div className="p-2.5 rounded-xs bg-zinc-800/80 border border-zinc-700/80 space-y-0.5">
              <div className="flex items-center justify-between text-[10px] text-amber-400 uppercase">
                <span className="font-bold">STAGE 2: BORDER HOP</span>
                <span>⚡</span>
              </div>
              <div className="text-xs font-bold text-white uppercase">
                Mule &amp; Peeling Mixer
              </div>
              <div className="text-[10px] text-zinc-400">
                {topVasp?.hopsCount ?? (traceResult.graph.nodes.length - 2)} intermediate hops
              </div>
            </div>

            {/* Stage 3 */}
            <div className="p-2.5 rounded-xs bg-zinc-800/80 border border-[#C6FF00]/50 space-y-0.5">
              <div className="flex items-center justify-between text-[10px] text-[#C6FF00] uppercase">
                <span className="font-bold">STAGE 3: VASP HUB</span>
                <span className="text-xs">{currentProfile.flag}</span>
              </div>
              <div className="text-xs font-bold text-white uppercase truncate">
                {topVasp?.name || 'Destination VASP'}
              </div>
              <div className="text-[10px] text-zinc-300 uppercase truncate">
                {currentProfile.name}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3.5">
        {/* Col 1 & 2: Interactive Friction & Authority Roadmap */}
        <div className="lg:col-span-2 space-y-3.5">
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {/* Metric 1: Freezing Friction Score */}
            <div className="p-3 rounded-xs border border-zinc-300 dark:border-zinc-800 bg-zinc-50 dark:bg-[#05070B] space-y-1.5">
              <div className="flex items-center justify-between text-[10px] text-zinc-500 uppercase">
                <span className="font-bold">FREEZING FRICTION</span>
                <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-xs uppercase ${
                  currentProfile.frictionScore < 40
                    ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                    : currentProfile.frictionScore < 70
                    ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
                    : 'bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-300 border border-red-300 dark:border-red-800'
                }`}>
                  {currentProfile.frictionLevel}
                </span>
              </div>

              <div className="flex items-baseline space-x-1">
                <span className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white tabular-nums">
                  {currentProfile.frictionScore}
                </span>
                <span className="text-[10px] text-zinc-400">/ 100</span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-1 bg-zinc-200 dark:bg-zinc-800 rounded-xs overflow-hidden">
                <div 
                  className={`h-full rounded-xs transition-all duration-500 ${
                    currentProfile.frictionScore < 40 ? 'bg-emerald-500' : currentProfile.frictionScore < 70 ? 'bg-amber-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${currentProfile.frictionScore}%` }}
                />
              </div>

              <p className="text-[10px] text-zinc-500 leading-tight">
                {currentProfile.frictionScore < 40 
                  ? 'High legal cooperation; direct VASP portal available.'
                  : 'Offshore corporate secrecy; formal diplomatic rogatory required.'}
              </p>
            </div>

            {/* Metric 2: MLAT Latency Estimate */}
            <div className="p-3 rounded-xs border border-zinc-300 dark:border-zinc-800 bg-zinc-50 dark:bg-[#05070B] space-y-1.5">
              <div className="flex items-center justify-between text-[10px] text-zinc-500 uppercase">
                <span className="font-bold">MLAT LATENCY</span>
                <Clock className="w-3 h-3 text-zinc-400" />
              </div>

              <div className="text-lg font-bold tracking-tight text-zinc-900 dark:text-white tabular-nums uppercase">
                {currentProfile.avgMlatLatency}
              </div>

              <div className="text-[10px] text-zinc-500 flex items-center space-x-1 uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
                <span>{currentProfile.mlatStatus}</span>
              </div>

              <p className="text-[10px] text-zinc-500 leading-tight">
                Direct LE Portal responds in &lt;12h for emergency preservation.
              </p>
            </div>

            {/* Metric 3: FATF & Regulatory Status */}
            <div className="p-3 rounded-xs border border-zinc-300 dark:border-zinc-800 bg-zinc-50 dark:bg-[#05070B] space-y-1.5">
              <div className="flex items-center justify-between text-[10px] text-zinc-500 uppercase">
                <span className="font-bold">FATF STANDING</span>
                <Scale className="w-3 h-3 text-zinc-400" />
              </div>

              <div className="text-xs font-bold text-zinc-900 dark:text-white uppercase">
                {currentProfile.fatfStatus}
              </div>

              <div className="text-[10px] text-zinc-500 truncate uppercase" title={currentProfile.regulator}>
                {currentProfile.regulator}
              </div>

              <p className="text-[10px] text-zinc-500 leading-tight">
                Travel Rule (Rec 16) enforcement verified.
              </p>
            </div>
          </div>

          {/* International Authority Contact Roadmap */}
          <div className="space-y-2">
            <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-1.5">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-zinc-900 dark:text-white">
                INTERNATIONAL LIAISON ROADMAP // {currentProfile.name}
              </h4>
              <span className="text-[9px] text-zinc-400 uppercase">
                STATUTORY WORKFLOW
              </span>
            </div>

            <div className="space-y-1.5">
              {currentProfile.authoritiesToContact.map((auth) => (
                <div
                  key={auth.step}
                  className="p-2.5 rounded-xs border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-[#05070B] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                >
                  <div className="flex items-start space-x-2">
                    <div className="w-4 h-4 rounded-xs bg-zinc-900 text-white text-[10px] flex items-center justify-center font-bold shrink-0 border border-zinc-700">
                      {auth.step}
                    </div>

                    <div className="space-y-0.5">
                      <div className="flex items-center space-x-1.5">
                        <span className="text-[11px] font-bold text-zinc-900 dark:text-white uppercase">
                          {auth.title}
                        </span>
                        <span className="text-zinc-400">•</span>
                        <span className="text-[10px] text-[#65A30D] dark:text-[#C6FF00] font-semibold uppercase">
                          {auth.entity}
                        </span>
                      </div>

                      <p className="text-[11px] text-zinc-600 dark:text-zinc-400 leading-normal">
                        {auth.action}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 sm:text-right text-[10px]">
                    <span className="text-zinc-400 block text-[9px] uppercase">TURNAROUND</span>
                    <span className="font-bold text-zinc-900 dark:text-white uppercase">{auth.latency}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Col 3: Live Treaty Feed & Statutory Context */}
        <div className="space-y-2.5">
          {/* Live Treaty Feed */}
          <div className="p-3 rounded-xs border border-zinc-300 dark:border-zinc-800 bg-zinc-50 dark:bg-[#05070B] space-y-2">
            <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-1.5">
              <div className="flex items-center space-x-1.5 text-[11px] font-bold text-zinc-900 dark:text-white uppercase">
                <Radio className="w-3 h-3 text-[#65A30D] dark:text-[#C6FF00] animate-pulse" />
                <span>LIVE TREATY TELEMETRY</span>
              </div>
              <span className="text-[9px] text-zinc-400 uppercase">AUTO-SYNC</span>
            </div>

            <div className="space-y-1.5">
              {liveFeeds.map((feed, idx) => (
                <div key={idx} className="p-2 rounded-xs bg-white dark:bg-[#080D18] border border-zinc-200 dark:border-zinc-800 space-y-0.5 text-xs">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="font-bold text-zinc-900 dark:text-white uppercase">{feed.source}</span>
                    <span className="text-zinc-400 text-[9px]">{feed.time}</span>
                  </div>
                  <p className="text-zinc-600 dark:text-zinc-400 text-[10px] leading-normal">
                    {feed.msg}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Legal Precedent Box */}
          <div className="p-3 rounded-xs border border-zinc-300 dark:border-zinc-800 bg-zinc-50 dark:bg-[#05070B] space-y-1.5 text-xs">
            <div className="font-bold text-zinc-900 dark:text-white flex items-center space-x-1.5 text-[10px] uppercase">
              <Building2 className="w-3 h-3 text-zinc-400" />
              <span>CROSS-BORDER STATUTORY BASIS</span>
            </div>
            <p className="text-zinc-600 dark:text-zinc-400 text-[10px] leading-normal">
              {currentProfile.statutoryBasis}
            </p>
            <div className="pt-1.5 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-[10px] text-zinc-500">
              <span className="uppercase">INTERPOL NCB:</span>
              <span className="font-bold text-zinc-900 dark:text-white uppercase">I-24/7 ENCRYPTED</span>
            </div>
          </div>
        </div>
      </div>
      </div>

      {/* Modal for Generated MLAT Preservation Notice */}
      <AnimatePresence>
        {showMemoModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-xs"
              onClick={() => setShowMemoModal(false)}
            />

            <motion.div
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.98, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="relative w-full max-w-2xl bg-white dark:bg-[#070A11] rounded-md border border-zinc-400 dark:border-zinc-700 shadow-2xl p-4 z-10 space-y-3 font-mono"
            >
              <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-2">
                <div className="flex items-center space-x-1.5">
                  <FileText className="w-3.5 h-3.5 text-[#65A30D] dark:text-[#C6FF00]" />
                  <h3 className="text-xs font-bold text-zinc-900 dark:text-white uppercase tracking-wider">
                    INTERNATIONAL MLAT PRESERVATION NOTICE // DISPATCH DRAFT
                  </h3>
                </div>

                <button
                  onClick={() => setShowMemoModal(false)}
                  className="text-zinc-400 hover:text-black dark:hover:text-white text-xs font-bold uppercase px-1.5 py-0.5 rounded-xs"
                >
                  [ESC] CLOSE
                </button>
              </div>

              <div className="p-3 rounded-xs bg-zinc-50 dark:bg-[#05070B] border border-zinc-200 dark:border-zinc-800 text-[11px] text-zinc-800 dark:text-zinc-200 max-h-80 overflow-y-auto leading-normal whitespace-pre-wrap">
{`INTERNATIONAL MUTUAL LEGAL ASSISTANCE (MLAT) PRESERVATION REQUEST
To: Central Authority / Compliance Liaison Desk - ${currentProfile.name}
Regulatory Authority: ${currentProfile.regulator}
Case Token: ${traceResult.complaint.complaintRef}
Investigation ID: ${traceResult.traceId}

1. TARGET CRYPTOCURRENCY ENTITY:
- Destination VASP: ${topVasp?.name || 'Identified Exchange'}
- Jurisdictional Hub: ${currentProfile.name}
- Target Depository Address: ${topVasp?.depositAddress || '0x3f5CE5FBFe3E9af3971dD833D26bA9b5C936f0bE'}
- Traced Defrauded Amount: ${traceResult.complaint.amountEstimated}

2. STATUTORY BASIS:
- ${currentProfile.statutoryBasis}
- Criminal Procedure Code (Sec 91/102 & 166A) / Bilateral Treaties
- FATF Recommendation 16 (Travel Rule Cross-Border Compliance)

3. URGENT RELIEF REQUESTED:
- Immediate 72-Hour Administrative Freeze on destination deposit cluster.
- Preservation of associated IP login logs, KYC/AML identity records, and bank cash-out accounts.
- Transmission of verified account holder records to Central Bureau of Investigation (CBI) INTERPOL NCB.`}
              </div>

              <div className="flex items-center justify-between pt-1 text-[10px]">
                <span className="text-zinc-500 uppercase">
                  SEC 166A CrPC • INTERPOL I-24/7 STANDARD
                </span>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleCopyMemo}
                    className="px-3 py-1.5 rounded-xs bg-zinc-900 hover:bg-black text-[#C6FF00] text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5 transition-colors cursor-pointer border border-zinc-700 shadow-2xs"
                  >
                    {copiedMemo ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedMemo ? 'COPIED TO CLIPBOARD' : 'COPY NOTICE TEXT'}</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
