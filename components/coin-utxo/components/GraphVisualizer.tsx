import React, { useState } from 'react';
import { 
  GraphNode, 
  GraphEdge 
} from '../types';
import { 
  Building2, 
  ShieldAlert, 
  Shuffle, 
  User, 
  Layers, 
  ExternalLink, 
  Copy, 
  Check, 
  ZoomIn, 
  ZoomOut, 
  Maximize2,
  Info,
  ArrowRight,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface GraphVisualizerProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
  matchedExchangeName: string;
}

export const GraphVisualizer: React.FC<GraphVisualizerProps> = ({
  nodes,
  edges,
  matchedExchangeName
}) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(
    nodes[nodes.length - 1]?.id || null
  );
  const [copied, setCopied] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);

  const selectedNode = nodes.find(n => n.id === selectedNodeId);

  const getNodeColorConfig = (type: GraphNode['type']) => {
    switch (type) {
      case 'victim':
        return {
          bg: '#0F2338',
          border: '#38BDF8',
          text: '#38BDF8',
          glow: 'rgba(56, 189, 248, 0.4)',
          badge: 'VICTIM'
        };
      case 'scam_root':
        return {
          bg: '#2A1215',
          border: '#EF4444',
          text: '#F87171',
          glow: 'rgba(239, 68, 68, 0.45)',
          badge: 'SCAM ROOT'
        };
      case 'mule_hop':
        return {
          bg: '#251D0F',
          border: '#F59E0B',
          text: '#FBBF24',
          glow: 'rgba(245, 158, 11, 0.4)',
          badge: 'MULE HOP'
        };
      case 'mixer':
        return {
          bg: '#23122B',
          border: '#C084FC',
          text: '#E879F9',
          glow: 'rgba(192, 132, 252, 0.45)',
          badge: 'MIXER / POOL'
        };
      case 'deposit_cluster':
        return {
          bg: '#0D271D',
          border: '#10B981',
          text: '#34D399',
          glow: 'rgba(16, 185, 129, 0.45)',
          badge: 'DEPOSIT SWEEPER'
        };
      case 'exchange':
        return {
          bg: '#062B1D',
          border: '#00FF9D',
          text: '#00FF9D',
          glow: 'rgba(0, 255, 157, 0.55)',
          badge: 'TARGET VASP'
        };
    }
  };

  const getNodeIcon = (type: GraphNode['type']) => {
    switch (type) {
      case 'victim':
        return <User className="w-4 h-4 text-sky-400" />;
      case 'scam_root':
        return <ShieldAlert className="w-4 h-4 text-red-400" />;
      case 'mule_hop':
        return <Layers className="w-4 h-4 text-amber-400" />;
      case 'mixer':
        return <Shuffle className="w-4 h-4 text-purple-400" />;
      case 'deposit_cluster':
      case 'exchange':
        return <Building2 className="w-4 h-4 text-[#00FF9D]" />;
    }
  };

  const copyAddress = (addr: string) => {
    navigator.clipboard.writeText(addr);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white dark:bg-[#070A11] rounded-md border border-zinc-300 dark:border-zinc-800 shadow-2xs overflow-hidden transition-colors">
      {/* Visualizer Top Bar */}
      <div className="px-3.5 py-2 bg-[#0A0A0C] text-white flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800">
        <div className="flex items-center space-x-2.5">
          <div className="flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-[#C6FF00] animate-ping" />
            <span className="font-mono text-xs font-bold text-white uppercase tracking-wider">
              MULTI-HOP GRAPH LINEAGE
            </span>
          </div>
          <span className="text-zinc-600 font-mono text-xs">•</span>
          <span className="text-[11px] font-mono text-zinc-400">
            {nodes.length} NODES RESOLVED ({edges.length} DIRECT TRANSFERS)
          </span>
        </div>

        {/* Legend Pills & Zoom Controls */}
        <div className="flex flex-wrap items-center gap-1.5 text-[9px] font-mono uppercase font-bold">
          <span className="px-1.5 py-0.2 rounded-xs bg-sky-950 text-sky-300 border border-sky-800">
            VICTIM
          </span>
          <span className="px-1.5 py-0.2 rounded-xs bg-red-950 text-red-300 border border-red-800">
            SCAM ROOT
          </span>
          <span className="px-1.5 py-0.2 rounded-xs bg-amber-950 text-amber-300 border border-amber-800">
            MULE
          </span>
          <span className="px-1.5 py-0.2 rounded-xs bg-purple-950 text-purple-300 border border-purple-800">
            MIXER
          </span>
          <span className="px-1.5 py-0.2 rounded-xs bg-[#C6FF00] text-black shadow-2xs">
            {matchedExchangeName} (VASP)
          </span>

          {/* Zoom controls */}
          <div className="flex items-center space-x-1 pl-2 border-l border-zinc-800">
            <button
              onClick={() => setZoomLevel(Math.min(zoomLevel + 0.1, 1.3))}
              className="p-1 rounded-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-300 cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="w-3 h-3" />
            </button>
            <button
              onClick={() => setZoomLevel(Math.max(zoomLevel - 0.1, 0.7))}
              className="p-1 rounded-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-300 cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="w-3 h-3" />
            </button>
            <button
              onClick={() => setZoomLevel(1)}
              className="p-1 rounded-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-300 cursor-pointer"
              title="Reset Zoom"
            >
              <Maximize2 className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* SVG Canvas & Node Overlay Container */}
      <div className="relative bg-[#06080D] bg-tactical-grid min-h-[380px] sm:min-h-[420px] overflow-x-auto flex items-center justify-center p-6">
        <div 
          className="relative w-full max-w-[960px] h-[340px] transition-transform duration-200"
          style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center center' }}
        >
          {/* SVG Canvas for Edges */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
            <defs>
              <linearGradient id="edgeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#F59E0B" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#00FF9D" stopOpacity="0.9" />
              </linearGradient>

              {/* Glowing Arrow Markers */}
              <marker
                id="arrowhead-emerald"
                markerWidth="8"
                markerHeight="8"
                refX="6"
                refY="4"
                orient="auto"
              >
                <polygon points="0 0, 8 4, 0 8" fill="#00FF9D" />
              </marker>

              <marker
                id="arrowhead-amber"
                markerWidth="8"
                markerHeight="8"
                refX="6"
                refY="4"
                orient="auto"
              >
                <polygon points="0 0, 8 4, 0 8" fill="#F59E0B" />
              </marker>
            </defs>

            {edges.map((edge) => {
              const sourceNode = nodes.find((n) => n.id === edge.source);
              const targetNode = nodes.find((n) => n.id === edge.target);
              if (!sourceNode || !targetNode) return null;

              // Quadratic curve path
              const midX = (sourceNode.x + targetNode.x) / 2;
              const midY = (sourceNode.y + targetNode.y) / 2 - 25;
              const pathD = `M ${sourceNode.x} ${sourceNode.y} Q ${midX} ${midY} ${targetNode.x} ${targetNode.y}`;

              return (
                <g key={edge.id}>
                  {/* Subtle edge background glow */}
                  <path
                    d={pathD}
                    fill="none"
                    stroke="#1E283D"
                    strokeWidth="4"
                    strokeOpacity="0.6"
                  />

                  {/* Flowing animated dash line */}
                  <path
                    d={pathD}
                    fill="none"
                    stroke="url(#edgeGradient)"
                    strokeWidth="2.5"
                    strokeDasharray="6 4"
                    className="animate-edge-dash"
                    markerEnd="url(#arrowhead-emerald)"
                  />

                  {/* Transfer Amount Badge on Edge */}
                  <g transform={`translate(${midX}, ${midY})`}>
                    <rect
                      x="-48"
                      y="-11"
                      width="96"
                      height="22"
                      rx="6"
                      fill="#0C101A"
                      stroke="#222C40"
                      strokeWidth="1"
                    />
                    <text
                      x="0"
                      y="4"
                      textAnchor="middle"
                      fill="#00FF9D"
                      fontSize="10"
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      {edge.amount}
                    </text>
                  </g>
                </g>
              );
            })}
          </svg>

          {/* Interactive Interactive Nodes */}
          {nodes.map((node) => {
            const config = getNodeColorConfig(node.type);
            const isSelected = selectedNodeId === node.id;
            const isDestination = node.type === 'exchange';

            return (
              <motion.div
                key={node.id}
                onClick={() => setSelectedNodeId(node.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                style={{
                  left: `${node.x}px`,
                  top: `${node.y}px`,
                  transform: 'translate(-50%, -50%)'
                }}
                className={`absolute z-10 cursor-pointer group select-none ${
                  isSelected ? 'scale-110 z-20' : ''
                }`}
              >
                {/* Destination Radar rings */}
                {isDestination && (
                  <>
                    <span className="absolute -inset-2 rounded-xl border border-[#00FF9D]/60 animate-radar-ring pointer-events-none" />
                    <span className="absolute -inset-4 rounded-xl border border-[#00FF9D]/30 animate-radar-ring pointer-events-none" style={{ animationDelay: '1s' }} />
                  </>
                )}

                {/* Node Card / Avatar */}
                <div
                  style={{
                    backgroundColor: config.bg,
                    borderColor: isSelected ? '#00FF9D' : config.border,
                    boxShadow: isSelected
                      ? `0 0 25px ${config.glow}`
                      : `0 0 12px ${config.glow}`
                  }}
                  className={`px-3 py-2 rounded-xl border-2 flex items-center space-x-2 transition-all ${
                    isDestination ? 'ring-2 ring-[#00FF9D]/40 ring-offset-2 ring-offset-[#06080D]' : ''
                  }`}
                >
                  <div className="shrink-0">{getNodeIcon(node.type)}</div>
                  <div className="text-left font-mono">
                    <div
                      style={{ color: config.text }}
                      className="text-[11px] font-bold tracking-tight flex items-center space-x-1"
                    >
                      <span>{node.label}</span>
                      {isDestination && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#00FF9D] animate-ping ml-1" />
                      )}
                    </div>
                    <div className="text-[10px] text-zinc-400 font-mono">
                      {node.address.substring(0, 6)}...{node.address.substring(node.address.length - 4)}
                    </div>
                  </div>
                </div>

                {/* Micro Badge for Node Role */}
                <div
                  style={{
                    backgroundColor: config.bg,
                    color: config.text,
                    borderColor: config.border
                  }}
                  className="mt-1 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded text-center border uppercase tracking-wider mx-auto w-max"
                >
                  {config.badge}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Selected Node Forensic Inspector Drawer */}
      <AnimatePresence>
        {selectedNode && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.15 }}
            className="px-3.5 py-2.5 bg-zinc-100 dark:bg-[#05070B] border-t border-zinc-200 dark:border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs font-mono text-zinc-900 dark:text-zinc-200"
          >
            <div className="flex items-center space-x-2.5">
              <div className="p-1.5 rounded-xs bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800">
                {getNodeIcon(selectedNode.type)}
              </div>
              <div>
                <div className="flex items-center space-x-2 text-[11px]">
                  <span className="text-zinc-500 uppercase">ENTITY:</span>
                  <span className="font-bold text-zinc-900 dark:text-white uppercase">
                    {selectedNode.label}
                  </span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded-xs bg-[#C6FF00] text-black uppercase font-bold">
                    {selectedNode.type.replace('_', ' ')}
                  </span>
                </div>
                <div className="flex items-center space-x-1.5 text-zinc-600 dark:text-zinc-400 text-[10px] mt-0.5">
                  <span className="text-zinc-500">ADDR:</span>
                  <span className="text-zinc-900 dark:text-white select-all font-mono">
                    {selectedNode.address}
                  </span>
                  <button
                    onClick={() => copyAddress(selectedNode.address)}
                    className="p-0.5 hover:text-black dark:hover:text-white text-zinc-400 rounded-xs transition-colors cursor-pointer"
                    title="Copy Address"
                  >
                    {copied ? <Check className="w-3 h-3 text-[#65A30D] dark:text-[#C6FF00]" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3 text-[10px] border-t md:border-t-0 pt-1.5 md:pt-0 border-zinc-200 dark:border-zinc-800">
              <div>
                <div className="text-zinc-400 uppercase">VOLUME</div>
                <div className="text-zinc-900 dark:text-white font-bold">{selectedNode.amount || '4.85 ETH'}</div>
              </div>
              <div className="h-4 w-[1px] bg-zinc-300 dark:bg-zinc-800" />
              <div>
                <div className="text-zinc-400 uppercase">CONFIDENCE</div>
                <div className="text-[#65A30D] dark:text-[#C6FF00] font-bold">98.4% DETERMINISTIC</div>
              </div>
              <div className="h-4 w-[1px] bg-zinc-300 dark:bg-zinc-800" />
              <a
                href={`https://etherscan.io/address/${selectedNode.address}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1 rounded-xs bg-zinc-900 hover:bg-black text-white flex items-center space-x-1 transition-colors border border-zinc-700 uppercase font-bold text-[10px]"
              >
                <span>EXPLORER</span>
                <ExternalLink className="w-2.5 h-2.5 text-[#C6FF00]" />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
