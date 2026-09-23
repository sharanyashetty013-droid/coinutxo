import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Zap, 
  ArrowRight, 
  Filter, 
  Clock, 
  Building2, 
  ShieldAlert 
} from 'lucide-react';
import { PRESET_COMPLAINTS } from '../data/mockPresets';
import { ComplaintData } from '../types';

interface AlertsThreatFeedProps {
  onTriageIncident: (complaint: ComplaintData, presetId: string) => void;
  onOpenDesk: () => void;
}

export const AlertsThreatFeed: React.FC<AlertsThreatFeedProps> = ({
  onTriageIncident,
  onOpenDesk
}) => {
  const [filterType, setFilterType] = useState<'ALL' | 'CRITICAL' | 'ETH' | 'TRON' | 'BTC'>('ALL');

  const liveAlerts = [
    {
      id: 'pigbutchering-eth',
      ref: 'NCRP-2026-98214',
      title: 'Romance Scam (Pig Butchering) Liquidity Trap',
      chain: 'Ethereum (ERC-20)',
      amount: '4.85 ETH ($14,200 USD)',
      suspectWallet: '0x71C8395B2dE5b53eE2522Ac75f7823b184Ab6d1C',
      targetVasp: 'Bybit Hot Sweeper',
      urgency: 'Critical',
      minutesLeft: 28,
      status: 'Peeling Active',
      preset: PRESET_COMPLAINTS[0]
    },
    {
      id: 'ransomware-btc',
      ref: 'NCRP-2026-14022',
      title: 'Healthcare Ransomware Syndicate Extortion',
      chain: 'Bitcoin (UTXO)',
      amount: '1.24 BTC ($84,100 USD)',
      suspectWallet: 'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq',
      targetVasp: 'Binance Central Depository',
      urgency: 'High',
      minutesLeft: 41,
      status: 'Aggregation Phase',
      preset: PRESET_COMPLAINTS[1]
    },
    {
      id: 'taskfraud-tron',
      ref: 'NCRP-2026-66381',
      title: 'Part-Time Rating & Review Task Fraud',
      chain: 'TRON (TRC-20)',
      amount: '28,400 USDT',
      suspectWallet: 'TYDzsYUE28247z7fF21w3x737k9N9P182q',
      targetVasp: 'OKX Transit Pool',
      urgency: 'Moderate',
      minutesLeft: 54,
      status: 'Change Routing',
      preset: PRESET_COMPLAINTS[2]
    },
    {
      id: 'dexdrain-sol',
      ref: 'NCRP-2026-88419',
      title: 'Phishing Signature Permit Drainer',
      chain: 'Solana (SPL)',
      amount: '165.2 SOL ($24,800 USD)',
      suspectWallet: '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU',
      targetVasp: 'KuCoin Hot Sweeper',
      urgency: 'Critical',
      minutesLeft: 19,
      status: 'Sweep Detected',
      preset: PRESET_COMPLAINTS[3]
    }
  ];

  const filteredAlerts = liveAlerts.filter(alert => {
    if (filterType === 'ALL') return true;
    if (filterType === 'CRITICAL') return alert.urgency === 'Critical';
    if (filterType === 'ETH') return alert.chain.includes('Ethereum');
    if (filterType === 'TRON') return alert.chain.includes('TRON');
    if (filterType === 'BTC') return alert.chain.includes('Bitcoin');
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6 font-sans">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-blue-200 p-7 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-3">
          <div className="flex items-center space-x-2 text-xs font-medium text-red-600">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span>CRYPTO FORENSICS</span>
            <span className="text-zinc-300">•</span>
            <span className="text-zinc-500">LIVE MONITORING</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold leading-tight tracking-tight text-[#163b63]">
            Cryptocurrency Asset Attribution
          </h1>

          <p className="text-base text-[#4b6680] max-w-2xl leading-7">
            Trace illicit fund flows through peeling chains, mixer pools, and sweeper addresses to identify destination exchanges in real time.
          </p>
        </div>

        <button
          onClick={onOpenDesk}
          className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-semibold flex items-center space-x-2 transition-all cursor-pointer self-start md:self-auto shadow-sm"
        >
          <Zap className="w-3.5 h-3.5 text-[#C6FF00]" />
            <span>Open case desk</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between gap-3 border-b border-zinc-200 pb-3">
        <div className="flex items-center space-x-1.5 overflow-x-auto">
          <span className="text-xs text-zinc-400 font-medium mr-1 flex items-center space-x-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Filter:</span>
          </span>
          {(['ALL', 'CRITICAL', 'ETH', 'TRON', 'BTC'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilterType(f)}
              className={`px-3 py-1.5 text-xs rounded-lg transition-colors cursor-pointer font-medium ${
                filterType === f
                  ? 'bg-zinc-900 text-white font-semibold'
                  : 'bg-white text-zinc-600 border border-zinc-200 hover:border-zinc-300'
              }`}
            >
              {f === 'ALL' ? 'All Incidents' : f}
            </button>
          ))}
        </div>

        <span className="text-xs text-zinc-500 hidden sm:inline">
          {filteredAlerts.length} active alerts
        </span>
      </div>

      {/* Alert Feed Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredAlerts.map(alert => (
          <div
            key={alert.id}
            className="bg-white border border-zinc-200/90 rounded-2xl p-5 shadow-xs space-y-4 flex flex-col justify-between hover:border-zinc-300 transition-all"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                  alert.urgency === 'Critical'
                    ? 'bg-red-50 text-red-700 border border-red-200'
                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                }`}>
                  {alert.urgency} • &lt;{alert.minutesLeft}m freeze window
                </span>

                <span className="text-xs font-mono text-zinc-400">
                  {alert.ref}
                </span>
              </div>

              <div>
                <h3 className="text-base font-semibold text-slate-900 leading-snug">
                  {alert.title}
                </h3>
                <p className="text-xs text-zinc-500 mt-1">
                  Target: <strong className="text-zinc-800 font-medium">{alert.targetVasp}</strong> • {alert.amount}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-100 text-xs font-mono text-zinc-600 truncate">
                {alert.suspectWallet}
              </div>
            </div>

            <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
              <span className="text-xs text-zinc-400 font-mono font-medium">
                {alert.chain}
              </span>

              <button
                onClick={() => onTriageIncident(alert.preset.complaint, alert.preset.id)}
                className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-black dark:bg-[#C6FF00] dark:text-black dark:hover:bg-[#b0e600] text-white text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer shadow-xs"
              >
                <span>Triage &amp; Trace</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#C6FF00] dark:text-black" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
