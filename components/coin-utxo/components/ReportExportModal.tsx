import React, { useState } from 'react';
import { 
  X, 
  Download, 
  Printer, 
  Copy, 
  Check, 
  FileText, 
  ShieldCheck
} from 'lucide-react';
import { TraceResult } from '../types';

interface ReportExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  traceResult: TraceResult;
}

export const ReportExportModal: React.FC<ReportExportModalProps> = ({
  isOpen,
  onClose,
  traceResult
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const topVasp = traceResult.topCandidates[0];

  const generateReportText = () => {
    return `================================================================================
NATIONAL CYBER CRIME REPORTING PORTAL (NCRP) // FORENSIC VASP TRACE REPORT
CYBER CRIME CELL • SPECIAL INVESTIGATION PROTOCOL SIH26183
================================================================================
CASE REFERENCE NUMBER : ${traceResult.complaint.complaintRef}
TRACE IDENTIFIER      : ${traceResult.traceId}
DATE OF TRACE         : ${traceResult.timestamp}
STATION NODE          : NCR-DELHI-CYBER-CELL-DL04
EVALUATION STANDARD   : FATF REC 16 (TRAVEL RULE) / SECTION 91/102 CrPC
================================================================================

1. COMPLAINT & INGESTION DETAILS
--------------------------------------------------------------------------------
Reported Scam Wallet  : ${traceResult.complaint.walletAddress}
Blockchain Protocol   : ${traceResult.complaint.chain}
Fraud Classification  : ${traceResult.complaint.fraudType}
Incident Timestamp    : ${traceResult.complaint.transactionDate}
Reported Loss Volume  : ${traceResult.complaint.amountEstimated}
Victim Statement      : ${traceResult.complaint.victimNotes || 'N/A'}

2. PRIMARY VASP ATTRIBUTION FINDINGS
--------------------------------------------------------------------------------
Attributed Entity     : ${topVasp?.name}
Attribution Confidence: ${topVasp?.confidenceScore}%
Graph Hop Distance    : ${topVasp?.hopsCount} Hops
Destination Cluster   : ${topVasp?.clusterType}
Sweep Deposit Address : ${topVasp?.depositAddress}
Jurisdiction Registry : ${topVasp?.vaspJurisdiction} (${topVasp?.leiOrLicence})

3. FORENSIC HEURISTIC EXPLAINABILITY
--------------------------------------------------------------------------------
* Graph Hops Analysis : ${topVasp?.heuristics.hopsAnalysis}
* Timing Correlation  : ${topVasp?.heuristics.timingCorrelation}
* Cluster Behavior    : ${topVasp?.heuristics.clusterBehavior}
* Sweeping Pattern    : ${topVasp?.heuristics.depositPattern}

4. CASE RISK & URGENCY CLASSIFICATION
--------------------------------------------------------------------------------
Overall Case Risk     : ${traceResult.caseRisk}
Laundering Obfuscation: ${traceResult.launderingRisk.detected ? `DETECTED (${traceResult.launderingRisk.type})` : 'NONE'}
Temporal Urgency      : ${traceResult.urgency.status} (Last movement: ${traceResult.urgency.lastMovementText})
Statutory Action      : ${traceResult.urgency.freezeRecommendation}

5. RANKED CANDIDATE AUDIT TRAIL
--------------------------------------------------------------------------------
${traceResult.topCandidates.map((c, i) => `#${i + 1} ${c.name.padEnd(14)} | Conf: ${c.confidenceScore}% | Hops: ${c.hopsCount} | Risk: ${c.riskLabel.padEnd(8)} | ${c.clusterType}`).join('\n')}

================================================================================
STATUTORY ORDER REQUEST (SECTION 91 / 102 CrPC):
To Compliance Officer, ${topVasp?.name}:
Take notice that funds arising from reported cyber scam ref ${traceResult.complaint.complaintRef}
have been attributed to your deposit infrastructure. You are hereby ordered to 
immediately preserve all transaction records, KYC documents, and place a 72-hour 
administrative debit freeze on target account ${topVasp?.depositAddress}.
================================================================================
END OF OFFICIAL INVESTIGATION SUMMARY`;
  };

  const handleDownloadTxt = () => {
    const text = generateReportText();
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Investigator-Dossier-${traceResult.complaint.complaintRef}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadJson = () => {
    const jsonBlob = new Blob([JSON.stringify(traceResult, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(jsonBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Forensic-Telemetry-${traceResult.complaint.complaintRef}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateReportText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 font-mono">
      <div className="bg-white dark:bg-[#070A11] rounded-md border border-zinc-400 dark:border-zinc-700 shadow-2xl w-full max-w-3xl overflow-hidden animate-in fade-in duration-150">
        {/* Modal Header */}
        <div className="px-4 py-2.5 bg-zinc-900 text-white flex items-center justify-between border-b border-zinc-800">
          <div className="flex items-center space-x-2">
            <FileText className="w-3.5 h-3.5 text-[#C6FF00]" />
            <span className="text-xs font-bold tracking-wider uppercase text-white">
              OFFICIAL INVESTIGATION DOSSIER EXPORT // SUMMARY REPORT
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white p-0.5 rounded-xs transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-3.5 max-h-[80vh] overflow-y-auto text-zinc-900 dark:text-zinc-200 text-xs">
          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center space-x-1.5 text-[11px] text-zinc-600 dark:text-zinc-400">
              <ShieldCheck className="w-3.5 h-3.5 text-[#65A30D] dark:text-[#C6FF00]" />
              <span className="font-bold text-zinc-900 dark:text-white uppercase">NCRP CERTIFIED CRYPTOGRAPHIC AUDIT LEDGER</span>
            </div>

            <div className="flex items-center space-x-1.5">
              <button
                onClick={handleCopy}
                className="px-2.5 py-1 rounded-xs text-xs border border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-900 dark:text-zinc-200 flex items-center space-x-1 transition-colors cursor-pointer font-bold uppercase"
              >
                {copied ? <Check className="w-3 h-3 text-[#65A30D] dark:text-[#C6FF00]" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'COPIED' : 'COPY'}</span>
              </button>

              <button
                onClick={handleDownloadTxt}
                className="px-2.5 py-1 rounded-xs text-xs bg-zinc-900 hover:bg-black text-[#C6FF00] font-bold flex items-center space-x-1 transition-colors cursor-pointer border border-zinc-700 shadow-2xs uppercase"
              >
                <Download className="w-3 h-3" />
                <span>.TXT DOSSIER</span>
              </button>

              <button
                onClick={handleDownloadJson}
                className="px-2.5 py-1 rounded-xs text-xs border border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-900 dark:text-zinc-200 flex items-center space-x-1 transition-colors cursor-pointer font-bold uppercase"
              >
                <Download className="w-3 h-3 text-[#65A30D] dark:text-[#C6FF00]" />
                <span>JSON</span>
              </button>

              <button
                onClick={handlePrint}
                className="px-2.5 py-1 rounded-xs text-xs border border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-900 dark:text-zinc-200 flex items-center space-x-1 transition-colors cursor-pointer font-bold uppercase"
              >
                <Printer className="w-3 h-3" />
                <span>PRINT</span>
              </button>
            </div>
          </div>

          {/* Formatted Report Preview Box */}
          <div className="bg-zinc-50 dark:bg-[#05070B] rounded-xs border border-zinc-200 dark:border-zinc-800 p-4 text-xs text-zinc-800 dark:text-zinc-200 space-y-4 leading-normal">
            {/* Header Title Block */}
            <div className="border-b border-zinc-200 dark:border-zinc-800 pb-3 space-y-1">
              <div className="text-[10px] text-zinc-500 tracking-wider uppercase font-bold">
                NATIONAL CYBER CRIME REPORTING PORTAL • CYBER INVESTIGATION CELL
              </div>
              <div className="text-sm font-bold text-zinc-900 dark:text-white uppercase">
                Cryptocurrency Fraud Attribution &amp; Evidence Summary
              </div>
              <div className="text-[10px] text-zinc-500 flex flex-wrap gap-x-3 uppercase">
                <span>CASE REF: <strong className="text-zinc-900 dark:text-white">{traceResult.complaint.complaintRef}</strong></span>
                <span>TRACE ID: <strong className="text-zinc-700 dark:text-zinc-300">{traceResult.traceId}</strong></span>
                <span>DATE: {traceResult.timestamp}</span>
              </div>
            </div>

            {/* Section 1: Complaint Ingestion */}
            <div className="space-y-1.5">
              <div className="text-[10px] font-bold text-zinc-900 dark:text-white uppercase border-b border-zinc-200 dark:border-zinc-800 pb-0.5">
                1. COMPLAINT &amp; INGESTION PARAMETERS
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px]">
                <div>Reported Wallet: <span className="font-bold text-zinc-900 dark:text-white">{traceResult.complaint.walletAddress}</span></div>
                <div>Network Protocol: <span className="font-bold text-zinc-900 dark:text-white">{traceResult.complaint.chain}</span></div>
                <div>Fraud Classification: <span className="font-bold text-zinc-900 dark:text-white">{traceResult.complaint.fraudType}</span></div>
                <div>Reported Loss: <span className="font-bold text-[#65A30D] dark:text-[#C6FF00]">{traceResult.complaint.amountEstimated}</span></div>
              </div>
            </div>

            {/* Section 2: Attribution Findings */}
            <div className="space-y-1.5">
              <div className="text-[10px] font-bold text-zinc-900 dark:text-white uppercase border-b border-zinc-200 dark:border-zinc-800 pb-0.5">
                2. PRIMARY ATTRIBUTION EVIDENCE
              </div>
              <div className="p-3 bg-white dark:bg-[#070A11] rounded-xs border border-zinc-200 dark:border-zinc-800 space-y-1 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-zinc-500 uppercase">Attributed VASP Entity:</span>
                  <strong className="text-zinc-900 dark:text-white font-bold uppercase">{topVasp?.name}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500 uppercase">Confidence Score:</span>
                  <strong className="text-[#65A30D] dark:text-[#C6FF00] font-bold tabular-nums">{topVasp?.confidenceScore}%</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500 uppercase">Graph Hop Distance:</span>
                  <span className="font-bold text-zinc-900 dark:text-white">{topVasp?.hopsCount} Hops</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500 uppercase">Sweep Deposit Wallet:</span>
                  <span className="font-bold text-zinc-900 dark:text-white truncate max-w-xs">{topVasp?.depositAddress}</span>
                </div>
              </div>
            </div>

            {/* Section 3: Ranked Candidates Table */}
            <div className="space-y-1.5">
              <div className="text-[10px] font-bold text-zinc-900 dark:text-white uppercase border-b border-zinc-200 dark:border-zinc-800 pb-0.5">
                3. RANKED CANDIDATE SIGNALS
              </div>
              <div className="overflow-x-auto bg-white dark:bg-[#070A11] rounded-xs border border-zinc-200 dark:border-zinc-800 p-2">
                <table className="w-full text-left text-[11px]">
                  <thead>
                    <tr className="border-b border-zinc-200 dark:border-zinc-800 text-zinc-400 font-bold uppercase text-[9px]">
                      <th className="py-1">Rank</th>
                      <th className="py-1">VASP</th>
                      <th className="py-1">Confidence</th>
                      <th className="py-1">Hops</th>
                      <th className="py-1">Risk Label</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/80">
                    {traceResult.topCandidates.map((c, i) => (
                      <tr key={c.name}>
                        <td className="py-1.5 font-bold text-zinc-900 dark:text-white">#{i + 1}</td>
                        <td className="py-1.5 font-semibold text-zinc-900 dark:text-white uppercase">{c.name}</td>
                        <td className="py-1.5 text-[#65A30D] dark:text-[#C6FF00] font-bold tabular-nums">{c.confidenceScore}%</td>
                        <td className="py-1.5 text-zinc-600 dark:text-zinc-400">{c.hopsCount}</td>
                        <td className="py-1.5 text-zinc-600 dark:text-zinc-400 uppercase">{c.riskLabel}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Section 4: Statutory Preservation Draft */}
            <div className="p-3 bg-white dark:bg-[#070A11] rounded-xs border border-zinc-200 dark:border-zinc-800 text-[11px] space-y-1">
              <div className="font-bold text-zinc-900 dark:text-white uppercase text-[10px]">
                STATUTORY FREEZE &amp; PRESERVATION NOTICE CLAUSE:
              </div>
              <p className="text-zinc-600 dark:text-zinc-400 leading-normal">
                Pursuant to Section 91/102 CrPC and FATF Recommendation 16, {topVasp?.name} is placed on formal
                notice to preserve all customer identity records (KYC) and implement a provisional freeze order on
                account {topVasp?.depositAddress} pending court authorization.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
