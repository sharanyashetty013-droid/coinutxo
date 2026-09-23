import React, { useState } from 'react';
import { 
  X, 
  Send, 
  ShieldCheck, 
  Check, 
  Copy, 
  Terminal, 
  Building2,
  Clock,
  Zap
} from 'lucide-react';
import { TraceResult } from '../types';

interface InvestigatorAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  traceResult: TraceResult;
}

export const InvestigatorAlertModal: React.FC<InvestigatorAlertModalProps> = ({
  isOpen,
  onClose,
  traceResult
}) => {
  const [isSending, setIsSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);
  const [dispatchReceiptId, setDispatchReceiptId] = useState<string | null>(null);
  const [copiedPayload, setCopiedPayload] = useState(false);

  if (!isOpen) return null;

  const topVasp = traceResult.topCandidates[0];

  const payload = {
    header: {
      sourceNode: 'NCRP-CENTRAL-DISPATCH-DL04',
      destinationPortal: `${topVasp?.name.toUpperCase()} LAW ENFORCEMENT COMPLIANCE DESK`,
      routingProtocol: 'INTERPOL I-24/7 / FIU-IND MLAT BRIDGE v3.1',
      transmissionTimestamp: new Date().toISOString()
    },
    caseDetails: {
      traceId: traceResult.traceId,
      complaintRef: traceResult.complaint.complaintRef,
      fraudType: traceResult.complaint.fraudType,
      walletAddress: traceResult.complaint.walletAddress,
      reportedChain: traceResult.complaint.chain,
      amountEstimated: traceResult.complaint.amountEstimated
    },
    attributionFinding: {
      matchedVasp: topVasp?.name,
      confidenceScore: `${topVasp?.confidenceScore}%`,
      clusterType: topVasp?.clusterType,
      depositAddress: topVasp?.depositAddress,
      hopsCount: topVasp?.hopsCount
    },
    riskAssessment: {
      caseRisk: traceResult.caseRisk,
      launderingFlag: traceResult.launderingRisk.detected ? traceResult.launderingRisk.type : 'None',
      urgencyStatus: traceResult.urgency.status,
      lastMovement: traceResult.urgency.lastMovementText
    },
    statutoryActionMandate: {
      requestedOrder: topVasp?.freezeProtocol.recommendedOrderType,
      legalAuthority: 'Section 91/102 CrPC (Preservation of Electronic Stored Records)',
      urgencyWindow: 'Requesting immediate 72-hour administrative hold on internal sweep'
    }
  };

  const handleConfirmAndSend = () => {
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setSentSuccess(true);
      setDispatchReceiptId(`NCRP-ACK-${Math.floor(100000 + Math.random() * 900000)}`);
    }, 1100);
  };

  const copyPayloadJson = () => {
    navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
    setCopiedPayload(true);
    setTimeout(() => setCopiedPayload(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 font-mono">
      <div className="bg-white dark:bg-[#070A11] rounded-md border border-zinc-400 dark:border-zinc-700 shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in duration-150">
        {/* Modal Header */}
        <div className="px-4 py-2.5 bg-zinc-900 text-white flex items-center justify-between border-b border-zinc-800">
          <div className="flex items-center space-x-2">
            <Send className="w-3.5 h-3.5 text-[#C6FF00]" />
            <span className="text-xs font-bold tracking-wider uppercase text-white">
              DISPATCH PREVIEW // ROUTE TO INVESTIGATION SYSTEM
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white p-0.5 rounded-xs transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {sentSuccess ? (
          <div className="p-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-xs bg-[#C6FF00]/20 border border-[#84CC16] text-[#65A30D] dark:text-[#C6FF00] flex items-center justify-center mx-auto shadow-2xs">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold uppercase tracking-wider text-zinc-900 dark:text-white">
                STATUTORY FREEZE DIRECTIVE DISPATCHED
              </h3>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1 max-w-md mx-auto">
                Cryptographic preservation packet transmitted to <strong className="text-black dark:text-white uppercase">{topVasp?.name}</strong> Law Enforcement
                Compliance Desk under Section 91/102 CrPC.
              </p>
            </div>

            <div className="p-3 bg-zinc-50 dark:bg-[#05070B] rounded-xs border border-zinc-200 dark:border-zinc-800 max-w-sm mx-auto text-xs">
              <div className="text-zinc-400 text-[10px] uppercase">TRANSMISSION RECEIPT TOKEN</div>
              <div className="text-sm font-bold text-zinc-900 dark:text-white mt-0.5 tabular-nums">{dispatchReceiptId}</div>
              <div className="text-[10px] text-[#65A30D] dark:text-[#C6FF00] font-bold mt-0.5 uppercase">STATUS: ACK_DELIVERED_72HR_HOLD</div>
            </div>

            <div className="pt-1">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xs bg-zinc-900 hover:bg-black text-[#C6FF00] text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-2xs border border-zinc-700"
              >
                CLOSE &amp; RETURN TO CONSOLE
              </button>
            </div>
          </div>
        ) : (
          <div className="p-4 space-y-3.5 max-h-[80vh] overflow-y-auto text-zinc-900 dark:text-zinc-200 text-xs">
            {/* Target Destination Banner */}
            <div className="p-2.5 bg-zinc-50 dark:bg-[#05070B] rounded-xs border border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <Building2 className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
                <div>
                  <div className="text-[9px] text-zinc-400 uppercase">TARGET COMPLIANCE ENTITY</div>
                  <div className="font-bold text-zinc-900 dark:text-white uppercase">{topVasp?.name} LE COMPLIANCE DESK</div>
                </div>
              </div>
              <div className="text-right text-[10px]">
                <div className="text-zinc-400 uppercase">STATUTORY FRAMEWORK</div>
                <div className="font-bold text-[#65A30D] dark:text-[#C6FF00] uppercase">FATF REC 16 / SEC 91 CrPC</div>
              </div>
            </div>

            {/* Structured Field Overview */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <div className="p-2.5 rounded-xs border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-[#05070B]">
                <div className="text-[9px] text-zinc-400 uppercase">COMPLAINT REF</div>
                <div className="font-bold text-zinc-900 dark:text-white mt-0.5 truncate">{traceResult.complaint.complaintRef}</div>
              </div>

              <div className="p-2.5 rounded-xs border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-[#05070B]">
                <div className="text-[9px] text-zinc-400 uppercase">MODUS OPERANDI</div>
                <div className="font-bold text-zinc-900 dark:text-white mt-0.5 truncate">{traceResult.complaint.fraudType}</div>
              </div>

              <div className="p-2.5 rounded-xs border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-[#05070B]">
                <div className="text-[9px] text-zinc-400 uppercase">CASE RISK</div>
                <div className="font-bold text-red-600 dark:text-red-400 mt-0.5 uppercase">{traceResult.caseRisk} RISK</div>
              </div>

              <div className="p-2.5 rounded-xs border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-[#05070B]">
                <div className="text-[9px] text-zinc-400 uppercase">MATCHED VASP</div>
                <div className="font-bold text-zinc-900 dark:text-white mt-0.5 truncate">{topVasp?.name} ({topVasp?.confidenceScore}%)</div>
              </div>

              <div className="p-2.5 rounded-xs border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-[#05070B]">
                <div className="text-[9px] text-zinc-400 uppercase">LAST MOVEMENT</div>
                <div className="font-bold text-zinc-900 dark:text-white mt-0.5 truncate">{traceResult.urgency.lastMovementText}</div>
              </div>

              <div className="p-2.5 rounded-xs border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-[#05070B]">
                <div className="text-[9px] text-zinc-400 uppercase">TRACE ID</div>
                <div className="font-bold text-zinc-500 mt-0.5 truncate">{traceResult.traceId}</div>
              </div>
            </div>

            {/* Raw JSON Payload Inspector */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold uppercase text-zinc-400 flex items-center space-x-1.5">
                  <Terminal className="w-3 h-3 text-zinc-400" />
                  <span>OUTGOING CRYPTOGRAPHIC PAYLOAD (JSON PREVIEW)</span>
                </span>
                <button
                  onClick={copyPayloadJson}
                  className="text-[10px] text-zinc-900 dark:text-[#C6FF00] hover:underline flex items-center space-x-1 cursor-pointer font-bold uppercase"
                >
                  {copiedPayload ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedPayload ? 'COPIED' : 'COPY JSON'}</span>
                </button>
              </div>

              <pre className="p-3 bg-zinc-900 dark:bg-[#05070B] text-[#C6FF00] text-[10px] rounded-xs overflow-x-auto max-h-44 border border-zinc-800 font-mono leading-tight">
                {JSON.stringify(payload, null, 2)}
              </pre>
            </div>

            {/* Bottom Actions */}
            <div className="pt-2 flex items-center justify-end space-x-2 border-t border-zinc-200 dark:border-zinc-800">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 text-xs font-bold text-zinc-500 hover:text-black dark:hover:text-white uppercase cursor-pointer"
              >
                CANCEL
              </button>

              <button
                type="button"
                disabled={isSending}
                onClick={handleConfirmAndSend}
                className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider rounded-xs transition-colors flex items-center space-x-1.5 cursor-pointer disabled:opacity-50 shadow-2xs border border-red-700"
              >
                <Zap className="w-3 h-3 fill-current" />
                <span>{isSending ? 'TRANSMITTING...' : 'DISPATCH DIRECTIVE'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
