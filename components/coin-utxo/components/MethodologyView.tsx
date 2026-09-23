import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Database, 
  Clock, 
  FileCheck2, 
  FileText,
  Copy,
  Check,
  Download,
  Scale,
  Sparkles,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { motion } from 'motion/react';

export const MethodologyView: React.FC = () => {
  const [activeLegalTab, setActiveLegalTab] = useState<'crpc' | 'bnss' | 'preservation' | 'fir' | 'sec65b'>('crpc');
  const [copied, setCopied] = useState(false);

  const handleCopyNotice = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const crpcNotice = `OFFICE OF THE SUPERINTENDENT OF POLICE / CYBER CRIME CELL
CRIMINAL PROCEDURE CODE (CrPC), 1973 - SECTION 91 & SECTION 102
ORDER FOR PRESERVATION AND IMMEDIATE FREEZE OF DIGITAL ASSETS

To: Compliance & Law Enforcement Response Team
Virtual Asset Service Provider (VASP): [Designated Exchange Compliance Desk]

Ref Case No: NCRP-2026-884192 / CYBER-FIR-412/2026
Date: ${new Date().toLocaleDateString()}

1. Under powers conferred by Section 91 and Section 102 of the Code of Criminal Procedure, 1973, you are hereby directed to immediately FREEZE and WITHHOLD all debits, withdrawals, and internal transfers associated with the following deposit transaction cluster:
   - Suspect Inflow Address: 0x71C8395B2dE5b53eE2522Ac75f7823b184Ab6d1C
   - Target Exchange Depository: [Identified VASP Sweeper Cluster]
   - Transaction Hashes: Cryptographically tracked via Coin UTXO Attributor

2. You are further required to provide within 24 hours:
   - Full KYC / PII records of the beneficiary account holder (Name, Registered Email, Phone, IP logs at login/deposit).
   - Internal Omnibus transfer logs and cold storage consolidation hashes.

3. Failure to comply with this order attracts statutory penal liability under Section 175/176 and Section 188 of the Indian Penal Code.

Issued under Seal of the Investigating Officer,
Cyber Crime Investigation Cell.`;

  const bnssNotice = `NOTICE UNDER SECTION 94 OF BHARATIYA NAGARIK SURAKSHA SANHITA (BNSS), 2023
SUMMONS TO PRODUCE DIGITAL RECORD OR PRESERVE DIGITAL ASSETS

To: Virtual Asset Service Provider Compliance Department
Reference: Crime No: CYBER/2026/099
Date: ${new Date().toLocaleDateString()}

Whereas an investigation into an offense punishable under the Bharatiya Nyaya Sanhita (BNS), 2023 and the Information Technology Act, 2000 is underway.

You are hereby commanded under Section 94 BNSS, 2023 to:
1. Maintain an immutable freeze on the digital currency holdings received from Transaction Cluster 0x71C8395B...
2. Prevent any conversion, withdrawal, P2P swap, or off-ramping to fiat currency.
3. Preserve all digital transaction records, login access timestamps, and device fingerprints for a statutory period of not less than 180 days.

Given under my hand and official seal.
Inspector of Police, Cyber Crime Police Station.`;

  const preservationNotice = `FATF RECOMMENDATION 16 & DIRECT LE EMERGENCY PRESERVATION DIRECTIVE (72-HOUR NOTICE)

Attn: Law Enforcement Relations / Urgent Asset Freeze Desk
Exchange: Designated Receiving VASP
Case Ref: INTERPOL-LE-2026-X884

URGENT: Stolen proceeds from an active cyber fraud incident have just entered your deposit sweeper cluster.
- Velocity: Funds arrived within past 45 minutes and are at immediate risk of internal omnibus consolidation.
- Depository Address: Identified Hot Sweeper Cluster
- Source Chain: Ethereum / Bitcoin / TRON / Solana

Under international standards of law enforcement assistance and FATF Recommendation 16 (Travel Rule compliance), please place an emergency 72-HOUR ADMINISTRATIVE HOLD on the account receiving these credits. Formal judicial rogatory letters / Mutual Legal Assistance Treaty (MLAT) requests are being expedited through Central Authority channels.`;

  const firDraft = `FORMAL COMPLAINT / FIRST INFORMATION REPORT (FIR) DRAFT
(For Citizen / Victim Submission to National Cybercrime Reporting Portal - cybercrime.gov.in & Local Police Station)

1. Complainant Details:
   - Full Name: [Victim Name]
   - Contact / Email: [Victim Phone / Email]
   - State / District: [District Name]

2. Incident Overview:
   - Type of Cyber Fraud: Investment / Task-Based / Impersonation Scam
   - Date & Time of Transfer: ${new Date().toLocaleDateString()}
   - Total Amount Defrauded: Stated in Case Report

3. Blockchain Evidence & Fund Trail (Verified by Coin UTXO Forensic Engine):
   - Victim Transfer Address: [Victim Outgoing Wallet]
   - Suspect Staging Wallet: 0x71C8395B2dE5b53eE2522Ac75f7823b184Ab6d1C
   - Number of Mule Hops: 2 Intermediate Hops (Peeling Chain)
   - Final Destination Exchange: [Identified VASP Sweeper]
   - Cryptographic Case Ref: NCRP-2026-884192

4. Prayer:
   It is respectfully requested that an FIR under Section 66D IT Act and Sections 318(4)/319(2) BNS be registered immediately, and a Section 91 CrPC freeze directive be issued to the identified cryptocurrency exchange to secure the stolen funds before off-ramping.`;

  const sec65b = `CERTIFICATE UNDER SECTION 65B OF THE INDIAN EVIDENCE ACT, 1872
(FOR ADMISSIBILITY OF ELECTRONIC FORENSIC RECORDS)

I, the undersigned Forensic Analyst / Investigating Officer, hereby certify:

1. The electronic cryptographic ledger records, multi-hop transaction graphs, and VASP deposit cluster attribution reports bearing Case Ref: NCRP-2026-884192 were produced by the automated computerized system known as 'Coin UTXO Forensics Engine'.
2. Throughout the material period, the computer system was operating properly and under lawful operational custody.
3. The cryptographic hashes (SHA-256) of the blockchain transaction data, mempool timestamps, and cluster signatures accurately represent the immutable digital ledger state without tampering or unauthorized modification.

Electronic Fingerprint (SHA-256): 8f9b4c2a7e1d5032b904cf3189a055be2f6d013e8e52a6a8c42b914d79e62c11
Date: ${new Date().toLocaleDateString()}`;

  const currentNoticeText = 
    activeLegalTab === 'crpc' ? crpcNotice :
    activeLegalTab === 'bnss' ? bnssNotice :
    activeLegalTab === 'preservation' ? preservationNotice :
    activeLegalTab === 'fir' ? firDraft : sec65b;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans">
      {/* Header Framing */}
      <div className="border-b border-zinc-200 dark:border-zinc-800 pb-6">
        <div className="flex items-center space-x-2 text-xs tracking-wider text-[#65A30D] dark:text-[#C6FF00] uppercase font-bold mb-2">
          <ShieldCheck className="w-4 h-4" />
          <span>Statutory Framework &amp; Legal Directives</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-950 dark:text-white">
          Court-Admissible Statutory Directives &amp; FIR Protocols
        </h2>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 max-w-3xl">
          Instantly generate compliant Section 91/102 CrPC freeze directives, Section 94 BNSS orders, 72-hour emergency international preservation notices, and Section 65B Indian Evidence Act certificates.
        </p>
      </div>

      {/* Interactive Statutory Notice Generator Card */}
      <div className="bg-white/95 dark:bg-[#0D111A]/95 backdrop-blur-md rounded-2xl border border-zinc-200/90 dark:border-zinc-800 shadow-md overflow-hidden">
        {/* Tabs Bar */}
        <div className="p-3 bg-zinc-50 dark:bg-zinc-900/60 border-b border-zinc-200 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-1 overflow-x-auto pb-1 sm:pb-0">
            {[
              { id: 'crpc', label: 'Sec 91/102 CrPC Notice' },
              { id: 'bnss', label: 'Sec 94 BNSS (2023)' },
              { id: 'preservation', label: '72h Emergency Preservation' },
              { id: 'fir', label: 'Victim FIR Complaint Draft' },
              { id: 'sec65b', label: 'Sec 65B Evidence Certificate' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveLegalTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  activeLegalTab === tab.id
                    ? 'bg-slate-900 text-white dark:bg-[#C6FF00] dark:text-black shadow-xs'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleCopyNotice(currentNoticeText)}
              className="px-3 py-1.5 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500 text-slate-900 dark:text-white text-xs font-medium flex items-center space-x-1.5 shadow-2xs cursor-pointer transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Copied to Clipboard</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Complete Legal Order</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Notice Preview Body */}
        <div className="p-5 font-mono text-xs text-slate-800 dark:text-zinc-200 bg-zinc-50/50 dark:bg-black/40 overflow-x-auto leading-relaxed border-b border-zinc-100 dark:border-zinc-800/80">
          <pre className="whitespace-pre-wrap font-mono text-xs">
            {currentNoticeText}
          </pre>
        </div>

        {/* Notice Footer Guidelines */}
        <div className="p-4 bg-white dark:bg-[#0D111A] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-zinc-500 dark:text-zinc-400">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Cryptographically sealed for direct transmission to Law Enforcement compliance portals</span>
          </div>
          <span className="font-mono text-[11px] text-zinc-400">
            Ref: NCRP-2026-884192
          </span>
        </div>
      </div>

      {/* 5-Stage Technical Pipeline Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white/95 dark:bg-[#0D111A]/95 backdrop-blur-md rounded-2xl border border-zinc-200/90 dark:border-zinc-800 p-6 shadow-xs space-y-3">
          <div className="w-8 h-8 rounded-lg bg-[#C6FF00] text-black flex items-center justify-center font-bold text-xs shadow-xs font-mono">
            01
          </div>
          <h3 className="text-sm font-bold text-black dark:text-white">
            NCRP Complaint Ingestion &amp; Normalization
          </h3>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans">
            Parses heterogeneous citizen inputs (BTC, ETH, TRON, SOL, USDT) received via the National Cybercrime Reporting Portal. Normalizes addresses and generates an immutable cryptographic case reference.
          </p>
        </div>

        <div className="bg-white/95 dark:bg-[#0D111A]/95 backdrop-blur-md rounded-2xl border border-zinc-200/90 dark:border-zinc-800 p-6 shadow-xs space-y-3">
          <div className="w-8 h-8 rounded-lg bg-[#C6FF00] text-black flex items-center justify-center font-bold text-xs shadow-xs font-mono">
            02
          </div>
          <h3 className="text-sm font-bold text-black dark:text-white">
            Multi-Hop Lineage &amp; Clustering
          </h3>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans">
            Crawls directional transfer graphs up to 5 hops deep. Identifies automated peeling chains, change-output asymmetries, and intermediary mule addresses.
          </p>
        </div>

        <div className="bg-white/95 dark:bg-[#0D111A]/95 backdrop-blur-md rounded-2xl border border-zinc-200/90 dark:border-zinc-800 p-6 shadow-xs space-y-3">
          <div className="w-8 h-8 rounded-lg bg-[#C6FF00] text-black flex items-center justify-center font-bold text-xs shadow-xs font-mono">
            03
          </div>
          <h3 className="text-sm font-bold text-black dark:text-white">
            Deposit Sweeper Attribution
          </h3>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans">
            Cross-references deposit behavior with our indexed database of over 140+ licensed and offshore Virtual Asset Service Providers (VASPs).
          </p>
        </div>

        <div className="bg-white/95 dark:bg-[#0D111A]/95 backdrop-blur-md rounded-2xl border border-zinc-200/90 dark:border-zinc-800 p-6 shadow-xs space-y-3">
          <div className="w-8 h-8 rounded-lg bg-[#C6FF00] text-black flex items-center justify-center font-bold text-xs shadow-xs font-mono">
            04
          </div>
          <h3 className="text-sm font-bold text-black dark:text-white">
            Temporal Freeze Window (&lt;45m)
          </h3>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans">
            Calculates the active 45-minute &ldquo;Golden Freeze Window&rdquo; based on transaction confirmation velocity to alert investigators before funds leave hot sweepers.
          </p>
        </div>

        <div className="bg-white/95 dark:bg-[#0D111A]/95 backdrop-blur-md rounded-2xl border border-zinc-200/90 dark:border-zinc-800 p-6 shadow-xs space-y-3">
          <div className="w-8 h-8 rounded-lg bg-[#C6FF00] text-black flex items-center justify-center font-bold text-xs shadow-xs font-mono">
            05
          </div>
          <h3 className="text-sm font-bold text-black dark:text-white">
            Cross-Border Jurisdiction Radar &amp; MLAT
          </h3>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans">
            Evaluates offshore friction indices and outlines bilateral Mutual Legal Assistance Treaty (MLAT) channels through CBI Interpol NCB New Delhi.
          </p>
        </div>

        <div className="bg-white/95 dark:bg-[#0D111A]/95 backdrop-blur-md rounded-2xl border border-zinc-200/90 dark:border-zinc-800 p-6 shadow-xs space-y-3">
          <div className="w-8 h-8 rounded-lg bg-[#C6FF00] text-black flex items-center justify-center font-bold text-xs shadow-xs font-mono">
            LAW
          </div>
          <h3 className="text-sm font-bold text-black dark:text-white">
            Evidentiary Rigor (Sec 65B IEA)
          </h3>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans">
            Every attribution package generates an immutable chain-of-custody cryptographic report compatible with Section 65B of the Indian Evidence Act for court admissibility.
          </p>
        </div>
      </div>
    </div>
  );
};
