import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  Copy, 
  Check, 
  RotateCw,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { TraceResult } from '../types';

interface BitcaseAiCopilotProps {
  activeTrace?: TraceResult | null;
  className?: string;
  defaultExpanded?: boolean;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export const BitcaseAiCopilot: React.FC<BitcaseAiCopilotProps> = ({
  activeTrace,
  className = '',
  defaultExpanded = true
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [inputQuery, setInputQuery] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const topVasp = activeTrace?.topCandidates[0];
  const targetVaspName = topVasp?.name || 'Bybit Exchange';
  const confidence = topVasp?.confidenceScore || 94;
  const refToken = activeTrace?.complaint.complaintRef || 'NCRP-2026-98214';

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init-1',
      role: 'assistant',
      text: `Case ${refToken} analyzed. Funds are routed toward ${targetVaspName} (${confidence}% confidence). Select a quick action below or ask a question.`,
      timestamp: '12:04'
    }
  ]);

  const quickPrompts = [
    {
      label: 'Hop Path Summary',
      query: 'Summarize the multi-hop routing and why this VASP is attributed.'
    },
    {
      label: 'Draft Seizure Memo',
      query: 'Draft a Section 91/102 CrPC account freeze request memo.'
    },
    {
      label: 'Peel-Chain Analysis',
      query: 'Check change addresses and detect peeling anomalies.'
    },
    {
      label: 'Freeze Window',
      query: 'How much time remains before internal exchange consolidation?'
    },
    {
      label: 'MLAT & Border Trap',
      query: 'Analyze cross-border jurisdiction friction and MLAT treaty route.'
    }
  ];

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const generateAiResponse = (userPrompt: string) => {
    setIsAnalyzing(true);

    const userMsg: Message = {
      id: `usr-${Date.now()}`,
      role: 'user',
      text: userPrompt,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);

    setTimeout(() => {
      let responseText = '';
      const promptLower = userPrompt.toLowerCase();

      if (promptLower.includes('hop') || promptLower.includes('summarize')) {
        responseText = `• Destination VASP: ${targetVaspName} (${confidence}% heuristic confidence).
• Route: 2 intermediate mule hops via high-velocity peeling.
• Depository: Matching deposit address cluster with known exchange sweeper patterns.`;
      } else if (promptLower.includes('seizure') || promptLower.includes('memo') || promptLower.includes('freeze request')) {
        responseText = `LEGAL PRESERVATION NOTICE (Sec 91/102 CrPC)
To: Compliance & Law Enforcement Desk, ${targetVaspName}
Case Ref: ${refToken}

Urgent request to freeze associated account credits linked to incoming transfer from suspect staging cluster. Transaction hashes and timestamp telemetry are cryptographically verified.`;
      } else if (promptLower.includes('peel') || promptLower.includes('mixer')) {
        responseText = `• Peeling Anomaly: Change output amounts show structured 0.88 asymmetry.
• Mixer Flags: None active; syndicate relied on direct rapid sweep transactions.
• Velocity: Intermediate hops were executed within 14 blocks.`;
      } else if (promptLower.includes('freeze') || promptLower.includes('window') || promptLower.includes('time')) {
        responseText = `• Remaining Window: ~28 minutes before internal omnibus pooling.
• Urgency Level: Critical action recommended.
• Action: Issue instant freeze notice to VASP compliance portal.`;
      } else if (promptLower.includes('jurisdiction') || promptLower.includes('mlat') || promptLower.includes('border') || promptLower.includes('trap')) {
        responseText = `• Cross-Border Trap: Funds crossed domestic borders into ${targetVaspName} offshore hub.
• Direct LE Portal Turnaround: 4–8 hours for 72-hour voluntary preservation.
• Mutual Legal Assistance (MLAT): Transmit via CBI Interpol NCB New Delhi (14–28 days).
• Recommendation: Serve immediate digital freeze notice before internal pooling.`;
      } else {
        responseText = `Analysis for "${userPrompt}":
• Case ${refToken} remains linked to ${targetVaspName}.
• Evidence packets are verified and ready for export.`;
      }

      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMsg]);
      setIsAnalyzing(false);
    }, 450);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputQuery.trim() || isAnalyzing) return;
    const query = inputQuery.trim();
    setInputQuery('');
    generateAiResponse(query);
  };

  return (
    <div className={`rounded-md border border-zinc-300 dark:border-zinc-800 bg-white dark:bg-[#070A11] shadow-2xs overflow-hidden font-mono ${className}`}>
      {/* Terminal Header */}
      <div className="px-3.5 py-2 bg-zinc-100 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-xs">
        <div className="flex items-center space-x-2">
          <div className="w-5 h-5 rounded-xs bg-zinc-900 text-[#C6FF00] flex items-center justify-center border border-zinc-700">
            <Bot className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-bold text-zinc-900 dark:text-white uppercase tracking-wider text-[11px]">
                BITCASE FORENSIC COPILOT
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#65A30D] dark:bg-[#C6FF00] animate-pulse" />
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-1 text-zinc-400">
          <button
            onClick={() => setMessages(messages.slice(0, 1))}
            className="p-1 hover:text-black dark:hover:text-white rounded-xs transition-colors cursor-pointer"
            title="Reset conversation"
          >
            <RotateCw className="w-3 h-3" />
          </button>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 hover:text-black dark:hover:text-white rounded-xs transition-colors cursor-pointer"
          >
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Expanded Interactive Body */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="p-3 space-y-2.5"
          >
            {/* Conversation Log */}
            <div className="max-h-56 overflow-y-auto space-y-2 pr-1 text-xs">
              {messages.map((msg) => {
                const isAssistant = msg.role === 'assistant';
                const isCopied = copiedId === msg.id;

                return (
                  <div
                    key={msg.id}
                    className={`rounded-xs p-2.5 transition-colors ${
                      isAssistant
                        ? 'bg-zinc-50 dark:bg-[#0A0E17] border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-200'
                        : 'bg-zinc-900 text-white ml-6 border border-zinc-700'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] text-zinc-400 mb-1 border-b border-zinc-200/50 dark:border-zinc-800/60 pb-1">
                      <span className={`font-bold uppercase tracking-wider ${isAssistant ? 'text-[#65A30D] dark:text-[#C6FF00]' : 'text-zinc-300'}`}>
                        {isAssistant ? 'COPILOT // SYNTHESIS' : 'INVESTIGATOR // DISPATCH'}
                      </span>
                      <div className="flex items-center space-x-1.5">
                        <span>{msg.timestamp}</span>
                        {isAssistant && (
                          <button
                            onClick={() => handleCopy(msg.text, msg.id)}
                            className="p-0.5 rounded text-zinc-400 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
                            title="Copy text"
                          >
                            {isCopied ? <Check className="w-3 h-3 text-[#65A30D] dark:text-[#C6FF00]" /> : <Copy className="w-3 h-3" />}
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="text-[11px] leading-relaxed whitespace-pre-line font-mono">
                      {msg.text}
                    </div>
                  </div>
                );
              })}

              {isAnalyzing && (
                <div className="p-2.5 rounded-xs bg-zinc-50 dark:bg-[#0A0E17] border border-zinc-200 dark:border-zinc-800 text-[11px] text-zinc-600 dark:text-zinc-400 flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#65A30D] dark:bg-[#C6FF00] animate-ping" />
                  <span>SYNTHESIZING FORENSIC BLOCKCHAIN EVIDENCE...</span>
                </div>
              )}
            </div>

            {/* Quick Action Chips */}
            <div className="flex flex-wrap gap-1.5 pt-0.5">
              {quickPrompts.map((p) => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => generateAiResponse(p.query)}
                  className="px-2 py-1 rounded-xs bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 border border-zinc-300 dark:border-zinc-800 text-zinc-800 dark:text-zinc-300 text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* Input Box */}
            <form onSubmit={handleFormSubmit} className="flex gap-1.5 pt-0.5">
              <input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                placeholder="QUERY CASE HOPS, VASP DEPOSIT PATTERNS, OR FREEZE NOTICES..."
                className="flex-1 px-2.5 py-1.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-xs text-xs text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:border-zinc-900 dark:focus:border-zinc-500 font-mono transition-colors"
              />

              <button
                type="submit"
                disabled={!inputQuery.trim() || isAnalyzing}
                className="px-3 py-1.5 rounded-xs bg-zinc-900 hover:bg-black disabled:opacity-50 text-[#C6FF00] text-xs font-bold uppercase tracking-wider flex items-center space-x-1 transition-colors cursor-pointer border border-zinc-700 shadow-2xs"
              >
                <span>QUERY</span>
                <Send className="w-2.5 h-2.5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
