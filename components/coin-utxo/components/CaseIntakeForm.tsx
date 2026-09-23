import React, { useState } from 'react';
import { 
  ShieldAlert, 
  ArrowRight, 
  Copy, 
  Check, 
  RotateCw,
  Zap,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { ComplaintData, CryptoChain, FraudType } from '../types';
import { PRESET_COMPLAINTS } from '../data/mockPresets';
import { motion } from 'motion/react';

interface CaseIntakeFormProps {
  onStartTrace: (complaint: ComplaintData, presetResultId?: string) => void;
  isTracing: boolean;
}

export const CaseIntakeForm: React.FC<CaseIntakeFormProps> = ({
  onStartTrace,
  isTracing
}) => {
  const [walletAddress, setWalletAddress] = useState('0x71C8395B2dE5b53eE2522Ac75f7823b184Ab6d1C');
  const [chain, setChain] = useState<CryptoChain>('ETH');
  const [fraudType, setFraudType] = useState<FraudType>('Task-Based Fraud');
  const [transactionDate, setTransactionDate] = useState('2026-09-21T09:30');
  const [complaintRef, setComplaintRef] = useState('NCRP-2026-884192');
  const [amountEstimated, setAmountEstimated] = useState('4.85 ETH (~$14,200 USD)');
  const [victimNotes, setVictimNotes] = useState('Victim lured into Telegram VIP Task Group. Sent funds to scammer staging wallet under promise of commission release.');
  const [selectedPresetId, setSelectedPresetId] = useState<string | undefined>('preset-telegram-task');
  const [copiedAddress, setCopiedAddress] = useState(false);

  const detectChain = (addr: string): CryptoChain => {
    const clean = addr.trim();
    if (clean.startsWith('0x') || clean.startsWith('0X')) return 'ETH';
    if (clean.startsWith('bc1') || clean.startsWith('1') || clean.startsWith('3')) return 'BTC';
    if (clean.startsWith('T') && clean.length >= 30) return 'TRON';
    if (clean.length >= 38 && !clean.startsWith('0x')) return 'SOL';
    return chain;
  };

  const handleAddressChange = (val: string) => {
    setWalletAddress(val);
    setSelectedPresetId(undefined);
    const detected = detectChain(val);
    if (detected !== chain) {
      setChain(detected);
    }
  };

  const fraudTypes: FraudType[] = [
    'Investment Scam',
    'Task-Based Fraud',
    'Sextortion',
    'Phishing',
    'Ransomware',
    'Darknet Transaction',
    'Other'
  ];

  const chains: { id: CryptoChain; label: string; badge: string }[] = [
    { id: 'BTC', label: 'Bitcoin', badge: 'BTC' },
    { id: 'ETH', label: 'Ethereum', badge: 'ERC-20' },
    { id: 'TRON', label: 'TRON', badge: 'TRC-20' },
    { id: 'SOL', label: 'Solana', badge: 'SOL' }
  ];

  const handleSelectPreset = (presetId: string) => {
    const preset = PRESET_COMPLAINTS.find(p => p.id === presetId);
    if (preset) {
      setSelectedPresetId(preset.id);
      setWalletAddress(preset.complaint.walletAddress);
      setChain(preset.complaint.chain);
      setFraudType(preset.complaint.fraudType);
      setTransactionDate(preset.complaint.transactionDate.substring(0, 16));
      setComplaintRef(preset.complaint.complaintRef);
      setAmountEstimated(preset.complaint.amountEstimated);
      setVictimNotes(preset.complaint.victimNotes || '');
    }
  };

  const handleLaunchPresetDirectly = (presetId: string) => {
    const preset = PRESET_COMPLAINTS.find(p => p.id === presetId);
    if (preset) {
      onStartTrace(preset.complaint, preset.id);
    }
  };

  const handleGenerateNewRef = () => {
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    setComplaintRef(`NCRP-2026-${randomNum}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!walletAddress.trim()) return;

    const complaint: ComplaintData = {
      walletAddress: walletAddress.trim(),
      chain,
      fraudType,
      transactionDate,
      complaintRef: complaintRef.trim() || 'NCRP-2026-789012',
      amountEstimated: amountEstimated.trim() || 'Amount Pending Verification',
      victimNotes
    };

    onStartTrace(complaint, selectedPresetId);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(walletAddress);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-8 font-sans">
      {/* Clean, Neat Hero Header */}
      <motion.div 
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="text-center max-w-2xl mx-auto space-y-3"
      >
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-zinc-200 bg-white shadow-xs text-xs text-zinc-600 font-medium">
          <span className="w-2 h-2 rounded-full bg-[#65A30D] animate-pulse" />
          <span>Active Intelligence Desk</span>
          <span className="text-zinc-300">•</span>
          <span>Sec 91 / 102 CrPC Ready</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-slate-900">
          Cryptocurrency Asset Attribution
        </h1>

        <p className="text-sm text-zinc-600 leading-relaxed">
          Trace illicit fund flows through peeling chains, mixer pools, and sweeper addresses to identify destination exchanges in real time.
        </p>
      </motion.div>

      {/* Verified Preset Cases */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
            Select a Case or Enter Custom Address
          </h2>
          <span className="text-xs text-zinc-400">
            {PRESET_COMPLAINTS.length} Verified Incidents Available
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {PRESET_COMPLAINTS.map((preset) => {
            const isSelected = selectedPresetId === preset.id;

            return (
              <div
                key={preset.id}
                onClick={() => handleSelectPreset(preset.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-white border-[#65A30D] shadow-md ring-2 ring-[#65A30D]/20'
                    : 'bg-white/80 border-zinc-200 hover:border-zinc-300 hover:bg-white shadow-xs'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-800">
                      {preset.complaint.chain}
                    </span>
                    <span className="text-xs font-medium text-zinc-500">
                      {preset.tag}
                    </span>
                  </div>

                  <h3 className="text-sm font-semibold text-slate-900 leading-snug line-clamp-1">
                    {preset.label}
                  </h3>

                  <div className="text-xs text-zinc-600 font-mono">
                    {preset.complaint.amountEstimated}
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-zinc-100 flex items-center justify-between text-xs">
                  <span className="font-mono text-zinc-400 text-[11px]">{preset.complaint.complaintRef}</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLaunchPresetDirectly(preset.id);
                    }}
                    className="font-semibold text-[#65A30D] hover:underline flex items-center space-x-0.5 cursor-pointer"
                  >
                    <span>Run Trace</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Clean Form Card */}
      <div className="bg-white rounded-2xl border border-zinc-200/90 shadow-sm overflow-hidden">
        <div className="px-5 py-3.5 bg-zinc-50/70 border-b border-zinc-100 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShieldAlert className="w-4 h-4 text-[#65A30D]" />
            <h3 className="text-sm font-semibold text-zinc-800">
              Transaction Details &amp; Evidence Intake
            </h3>
          </div>
          <span className="text-xs text-zinc-400 font-mono">
            {complaintRef}
          </span>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Wallet Address Input */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <label htmlFor="walletAddress" className="font-medium text-zinc-700">
                Suspect Wallet Address
              </label>
              <span className="text-zinc-400 font-mono text-[11px]">
                BTC, ETH, TRON, or SOL
              </span>
            </div>

            <div className="relative flex items-center">
              <input
                id="walletAddress"
                type="text"
                required
                value={walletAddress}
                onChange={(e) => handleAddressChange(e.target.value)}
                placeholder="Paste cryptocurrency address (0x..., bc1..., TYD...)"
                className="w-full font-mono text-sm px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#65A30D]/30 focus:border-[#65A30D] text-slate-900 transition-all pr-20"
              />
              <div className="absolute right-3 flex items-center space-x-2">
                <button
                  type="button"
                  onClick={copyToClipboard}
                  title="Copy Address"
                  className="p-1.5 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-200 rounded-lg transition-colors cursor-pointer"
                >
                  {copiedAddress ? <Check className="w-4 h-4 text-[#65A30D]" /> : <Copy className="w-4 h-4" />}
                </button>
                <span className="text-xs font-mono font-bold bg-[#C6FF00] text-black px-2 py-0.5 rounded-md">
                  {chain}
                </span>
              </div>
            </div>

            {/* Quick Sample Selector for Instant Testing */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs">
              <span className="text-zinc-500 font-medium">Quick Test Wallets:</span>
              <button
                type="button"
                onClick={() => {
                  handleAddressChange('0x71C8395B2dE5b53eE2522Ac75f7823b184Ab6d1C');
                  setChain('ETH');
                }}
                className="px-2 py-0.5 rounded bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-mono text-[11px] cursor-pointer transition-colors"
              >
                ETH (Pig Butchering)
              </button>
              <button
                type="button"
                onClick={() => {
                  handleAddressChange('bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq');
                  setChain('BTC');
                }}
                className="px-2 py-0.5 rounded bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-mono text-[11px] cursor-pointer transition-colors"
              >
                BTC (Ransomware)
              </button>
              <button
                type="button"
                onClick={() => {
                  handleAddressChange('TYDzsYUE28247z7fF21w3x737k9N9P182q');
                  setChain('TRON');
                }}
                className="px-2 py-0.5 rounded bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-mono text-[11px] cursor-pointer transition-colors"
              >
                TRON (USDT Task)
              </button>
              <button
                type="button"
                onClick={() => {
                  handleAddressChange('7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU');
                  setChain('SOL');
                }}
                className="px-2 py-0.5 rounded bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-mono text-[11px] cursor-pointer transition-colors"
              >
                SOL (Drainer)
              </button>
            </div>
          </div>

          {/* Network Selector */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-zinc-700">
              Blockchain Protocol
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {chains.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setChain(c.id)}
                  className={`px-3 py-2.5 text-xs rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                    chain === c.id
                      ? 'border-[#65A30D] bg-[#65A30D]/10 text-slate-900 font-semibold'
                      : 'border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300'
                  }`}
                >
                  <span>{c.label}</span>
                  <span className="text-[10px] text-zinc-400 font-mono">{c.badge}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Form Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="fraudType" className="block text-xs font-medium text-zinc-700">
                Fraud Modus Operandi
              </label>
              <select
                id="fraudType"
                value={fraudType}
                onChange={(e) => setFraudType(e.target.value as FraudType)}
                className="w-full text-xs px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#65A30D]/30 focus:border-[#65A30D] text-slate-900"
              >
                {fraudTypes.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <label htmlFor="complaintRef" className="font-medium text-zinc-700">
                  Complaint Reference
                </label>
                <button
                  type="button"
                  onClick={handleGenerateNewRef}
                  className="text-zinc-500 hover:text-black flex items-center space-x-1 cursor-pointer"
                >
                  <RotateCw className="w-3 h-3" />
                  <span>Generate</span>
                </button>
              </div>
              <input
                id="complaintRef"
                type="text"
                value={complaintRef}
                onChange={(e) => setComplaintRef(e.target.value)}
                className="w-full font-mono text-xs px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#65A30D]/30 focus:border-[#65A30D] text-slate-900"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="amountEstimated" className="block text-xs font-medium text-zinc-700">
                Estimated Loss Amount
              </label>
              <input
                id="amountEstimated"
                type="text"
                value={amountEstimated}
                onChange={(e) => setAmountEstimated(e.target.value)}
                placeholder="e.g. 2.45 BTC ($145,000 USD)"
                className="w-full text-xs px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#65A30D]/30 focus:border-[#65A30D] text-slate-900"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="transactionDate" className="block text-xs font-medium text-zinc-700">
                Transaction Date &amp; Time
              </label>
              <input
                id="transactionDate"
                type="datetime-local"
                value={transactionDate}
                onChange={(e) => setTransactionDate(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#65A30D]/30 focus:border-[#65A30D] text-slate-900"
              />
            </div>
          </div>

          {/* Victim Notes */}
          <div className="space-y-1.5">
            <label htmlFor="victimNotes" className="block text-xs font-medium text-zinc-700">
              Investigator Notes &amp; Evidence Context
            </label>
            <textarea
              id="victimNotes"
              rows={2}
              value={victimNotes}
              onChange={(e) => setVictimNotes(e.target.value)}
              placeholder="Enter brief description of victim communication or staging address behavior..."
              className="w-full text-xs px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#65A30D]/30 focus:border-[#65A30D] text-slate-900 leading-relaxed"
            />
          </div>

          {/* Action Button */}
          <button
            type="submit"
            disabled={isTracing}
            className="w-full py-3 px-6 rounded-xl bg-slate-900 hover:bg-black text-white font-medium text-sm flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-md"
          >
            {isTracing ? (
              <>
                <RotateCw className="w-4 h-4 animate-spin text-[#C6FF00]" />
                <span>Tracing Blockchain Peeling Chains...</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 text-[#C6FF00]" />
                <span>Start Forensic Trace &amp; VASP Attribution</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
