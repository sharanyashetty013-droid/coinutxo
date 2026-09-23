import React, { useState } from 'react';
import { GraphNode, GraphEdge } from '../types';
import { 
  ArrowRight, 
  Copy, 
  Check, 
  ExternalLink, 
  ShieldAlert, 
  User, 
  Building2, 
  Layers, 
  Clock, 
  Zap,
  HelpCircle
} from 'lucide-react';
import { motion } from 'motion/react';

interface HopFlowTimelineProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
  matchedVaspName: string;
  onSelectNode?: (nodeId: string) => void;
}

export const HopFlowTimeline: React.FC<HopFlowTimelineProps> = ({
  nodes,
  edges,
  matchedVaspName,
  onSelectNode
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getNodeColor = (type: GraphNode['type']) => {
    switch (type) {
      case 'victim':
        return {
          bg: 'bg-sky-50 dark:bg-sky-950/40',
          border: 'border-sky-300 dark:border-sky-700',
          text: 'text-sky-700 dark:text-sky-300',
          badge: 'VICTIM DISPATCH',
          badgeBg: 'bg-sky-100 text-sky-800 dark:bg-sky-900/60 dark:text-sky-200'
        };
      case 'scam_root':
        return {
          bg: 'bg-red-50 dark:bg-red-950/40',
          border: 'border-red-300 dark:border-red-700',
          text: 'text-red-700 dark:text-red-300',
          badge: 'PRIMARY STAGING',
          badgeBg: 'bg-red-100 text-red-800 dark:bg-red-900/60 dark:text-red-200'
        };
      case 'mule_hop':
        return {
          bg: 'bg-amber-50 dark:bg-amber-950/40',
          border: 'border-amber-300 dark:border-amber-700',
          text: 'text-amber-700 dark:text-amber-300',
          badge: 'MULE HOP',
          badgeBg: 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-200'
        };
      case 'mixer':
        return {
          bg: 'bg-purple-50 dark:bg-purple-950/40',
          border: 'border-purple-300 dark:border-purple-700',
          text: 'text-purple-700 dark:text-purple-300',
          badge: 'MIXER / TUMBLER',
          badgeBg: 'bg-purple-100 text-purple-800 dark:bg-purple-900/60 dark:text-purple-200'
        };
      case 'deposit_cluster':
      case 'exchange':
        return {
          bg: 'bg-emerald-50 dark:bg-emerald-950/40',
          border: 'border-emerald-300 dark:border-emerald-700',
          text: 'text-emerald-700 dark:text-emerald-300',
          badge: `TARGET: ${matchedVaspName}`,
          badgeBg: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200'
        };
    }
  };

  return (
    <div className="bg-white/95 dark:bg-[#0D111A]/95 backdrop-blur-md rounded-2xl border border-zinc-200/90 dark:border-zinc-800 p-5 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-100 dark:border-zinc-800/80 pb-3">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-[#C6FF00]/20 text-black dark:text-[#C6FF00]">
            <Zap className="w-4 h-4 fill-current" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <span>Fund Trajectory &amp; Multi-Hop Flow</span>
              <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
                {nodes.length} Stages Tracked
              </span>
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Deterministic sequence from initial victim loss to destination exchange depository
            </p>
          </div>
        </div>

        <div className="text-xs text-zinc-500 dark:text-zinc-400 font-mono flex items-center space-x-1.5">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Active Sweeper Trace</span>
        </div>
      </div>

      {/* Horizontal Flow Pipeline */}
      <div className="overflow-x-auto pb-3 pt-1">
        <div className="flex items-center space-x-3 min-w-[700px]">
          {nodes.map((node, index) => {
            const color = getNodeColor(node.type);
            const edge = edges.find(e => e.source === node.id);
            const isLast = index === nodes.length - 1;

            return (
              <React.Fragment key={node.id}>
                {/* Node Card */}
                <motion.div
                  whileHover={{ y: -3, scale: 1.01 }}
                  onClick={() => onSelectNode && onSelectNode(node.id)}
                  className={`flex-1 min-w-[200px] p-3.5 rounded-xl border ${color.bg} ${color.border} shadow-xs cursor-pointer transition-all hover:shadow-md relative group`}
                >
                  {/* Step Number Indicator */}
                  <div className="flex items-center justify-between gap-1 mb-2">
                    <span className="text-[10px] font-mono font-bold text-zinc-500 dark:text-zinc-400">
                      HOP #{index}
                    </span>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${color.badgeBg}`}>
                      {color.badge}
                    </span>
                  </div>

                  {/* Node Title & Balance */}
                  <div className="space-y-1">
                    <div className="text-xs font-bold text-slate-900 dark:text-white truncate" title={node.label}>
                      {node.label}
                    </div>
                    <div className="text-xs font-mono font-semibold text-slate-700 dark:text-zinc-300 tabular-nums">
                      {node.amount}
                    </div>
                  </div>

                  {/* Address Snippet */}
                  <div className="mt-2.5 pt-2 border-t border-zinc-200/60 dark:border-zinc-800/80 flex items-center justify-between text-[11px] font-mono text-zinc-500 dark:text-zinc-400">
                    <span className="truncate max-w-[110px]" title={node.address}>
                      {node.address.substring(0, 6)}...{node.address.substring(node.address.length - 4)}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopy(node.address, node.id);
                      }}
                      className="p-1 hover:text-slate-900 dark:hover:text-white transition-colors"
                      title="Copy Address"
                    >
                      {copiedId === node.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </motion.div>

                {/* Connector Arrow & Edge Info */}
                {!isLast && (
                  <div className="flex flex-col items-center justify-center shrink-0 px-1 text-zinc-400 dark:text-zinc-500">
                    <div className="text-[10px] font-mono font-semibold text-zinc-600 dark:text-zinc-300 bg-white dark:bg-zinc-800 px-1.5 py-0.5 rounded border border-zinc-200 dark:border-zinc-700 mb-1 shadow-2xs">
                      {edge?.amount || '→'}
                    </div>
                    <div className="w-8 h-0.5 bg-zinc-300 dark:bg-zinc-700 relative">
                      <div className="absolute right-0 -top-1 w-2 h-2 border-t-2 border-r-2 border-zinc-400 dark:border-zinc-500 transform rotate-45" />
                    </div>
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};
