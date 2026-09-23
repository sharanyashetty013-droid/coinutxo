import React, { useState } from 'react';
import { 
  Search, 
  ExternalLink, 
  Database,
  ArrowRight,
  ShieldCheck,
  Filter
} from 'lucide-react';
import { HistoricalCase } from '../types';
import { HISTORICAL_CASES, PRESET_COMPLAINTS } from '../data/mockPresets';

interface CaseHistoryRegistryProps {
  onLoadCase: (presetId: string) => void;
}

export const CaseHistoryRegistry: React.FC<CaseHistoryRegistryProps> = ({
  onLoadCase
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const filteredCases = HISTORICAL_CASES.filter((c) => {
    const matchesSearch = 
      c.complaintRef.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.walletAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.matchedExchange.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.fraudType.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: HistoricalCase['status']) => {
    switch (status) {
      case 'FROZEN':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#C6FF00] text-black shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-black mr-1.5 animate-ping" />
            FROZEN (72HR)
          </span>
        );
      case 'UNDER_REVIEW':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-100 text-amber-900 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5" />
            UNDER REVIEW
          </span>
        );
      case 'FLAGGED':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-red-100 text-red-900 border border-red-200">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 mr-1.5" />
            FLAGGED
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-zinc-100 text-zinc-800 border border-zinc-200">
            COMPLETED
          </span>
        );
    }
  };

  const handleOpenPreset = (ref: string) => {
    const found = PRESET_COMPLAINTS.find(p => p.complaint.complaintRef === ref);
    if (found) {
      onLoadCase(found.id);
    } else {
      onLoadCase(PRESET_COMPLAINTS[0].id);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Editorial Header */}
      <div className="border-b border-zinc-200 dark:border-zinc-800 pb-6">
        <div className="flex items-center space-x-2 text-xs font-mono tracking-wider text-[#65A30D] dark:text-[#C6FF00] uppercase font-bold mb-1">
          <Database className="w-3.5 h-3.5" />
          <span>Case Registry &amp; Evidence Audit Trail</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-serif font-normal tracking-tight text-slate-950 dark:text-white">
          Cryptocurrency Complaint <span className="font-serif italic text-black dark:text-zinc-200">Historical Dossiers</span>
        </h2>
        <p className="mt-1 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 font-sans">
          Historical record of scam complaints ingested into the attribution engine, verified VASP matches, and asset preservation statuses.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white/95 dark:bg-[#0D111A]/95 backdrop-blur-md rounded-3xl border border-zinc-200/90 dark:border-zinc-800 p-5 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4 transition-colors duration-300">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search ref, wallet, or VASP..."
            className="w-full pl-10 pr-4 py-2 text-xs font-mono bg-zinc-50 dark:bg-[#07090E] border border-zinc-200 dark:border-zinc-700/80 rounded-full focus:outline-none focus:ring-2 focus:ring-[#84CC16] focus:border-[#84CC16] text-black dark:text-white"
          />
        </div>

        {/* Status Filter Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto w-full sm:w-auto font-mono">
          {['ALL', 'FROZEN', 'UNDER_REVIEW', 'FLAGGED', 'COMPLETED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3.5 py-1.5 text-xs rounded-full transition-colors cursor-pointer ${
                statusFilter === st
                  ? 'bg-black dark:bg-[#C6FF00] text-white dark:text-black font-bold shadow-xs'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-zinc-700'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Table of Cases */}
      <div className="bg-white/95 dark:bg-[#0D111A]/95 backdrop-blur-md rounded-3xl border border-zinc-200/90 dark:border-zinc-800 shadow-xl overflow-hidden transition-colors duration-300">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-zinc-50 dark:bg-[#07090E] border-b border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3.5 px-5">Complaint Ref</th>
                <th className="py-3.5 px-5">Fraud Type</th>
                <th className="py-3.5 px-5">Reported Wallet</th>
                <th className="py-3.5 px-5">Attributed VASP</th>
                <th className="py-3.5 px-5">Confidence</th>
                <th className="py-3.5 px-5">Movement</th>
                <th className="py-3.5 px-5">Status</th>
                <th className="py-3.5 px-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/80">
              {filteredCases.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-zinc-500 dark:text-zinc-400">
                    No historical cases match the search query.
                  </td>
                </tr>
              ) : (
                filteredCases.map((c) => (
                  <tr key={c.id} className="hover:bg-zinc-50/80 dark:hover:bg-zinc-800/40 transition-colors">
                    <td className="py-3.5 px-5 font-bold text-black dark:text-white">
                      {c.complaintRef}
                    </td>
                    <td className="py-3.5 px-5 text-zinc-700 dark:text-zinc-300">
                      {c.fraudType}
                    </td>
                    <td className="py-3.5 px-5 text-zinc-500 dark:text-zinc-400 truncate max-w-[140px]">
                      {c.walletAddress}
                    </td>
                    <td className="py-3.5 px-5 font-semibold text-black dark:text-white">
                      {c.matchedExchange}
                    </td>
                    <td className="py-3.5 px-5 font-bold text-[#65A30D] dark:text-[#C6FF00]">
                      {c.confidenceScore}%
                    </td>
                    <td className="py-3.5 px-5 text-zinc-500 dark:text-zinc-400">
                      {c.urgency}
                    </td>
                    <td className="py-3.5 px-5">
                      {getStatusBadge(c.status)}
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <button
                        onClick={() => handleOpenPreset(c.complaintRef)}
                        className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-black dark:bg-[#111726] hover:bg-zinc-800 dark:hover:bg-zinc-700 text-white font-mono text-[11px] font-bold cursor-pointer shadow-xs transition-colors border border-transparent dark:border-zinc-700"
                      >
                        <span>Inspect Graph</span>
                        <ArrowRight className="w-3 h-3 text-[#C6FF00]" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
