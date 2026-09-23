'use client';

import React, { useState } from 'react';
import { Header, WorkspaceTab } from './components/Header';
import { AlertsThreatFeed } from './components/AlertsThreatFeed';
import { CaseIntakeForm } from './components/CaseIntakeForm';
import { TraceSequence } from './components/TraceSequence';
import { GraphVisualizer } from './components/GraphVisualizer';
import { AttributionResults } from './components/AttributionResults';
import { BitcaseAiCopilot } from './components/BitcaseAiCopilot';
import { JurisdictionRadar } from './components/JurisdictionRadar';
import { HopFlowTimeline } from './components/HopFlowTimeline';
import { InvestigationWorkflowBar, UserRole } from './components/InvestigationWorkflowBar';
import { SilentWitnessModal } from './components/SilentWitnessModal';
import { InvestigatorAlertModal } from './components/InvestigatorAlertModal';
import { ReportExportModal } from './components/ReportExportModal';
import { MethodologyView } from './components/MethodologyView';
import { ComplaintData, TraceResult } from './types';
import { PRESET_COMPLAINTS, generateTraceForCustomAddress } from './data/mockPresets';
import { RotateCw, ArrowLeft, Shield, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [activeTab, setActiveTab] = useState<WorkspaceTab>('alerts');
  const [isTracing, setIsTracing] = useState(false);
  const [activeWalletForTrace, setActiveWalletForTrace] = useState<string>('0x71C8395B2dE5b53eE2522Ac75f7823b184Ab6d1C');
  const [pendingResult, setPendingResult] = useState<TraceResult | null>(null);
  
  // Default to the first preset trace so graph and attribution are populated
  const [currentTrace, setCurrentTrace] = useState<TraceResult | null>(PRESET_COMPLAINTS[0].result);
  const [userRole, setUserRole] = useState<UserRole>('investigator');
  
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isSilentWitnessOpen, setIsSilentWitnessOpen] = useState(false);

  const handleStartTrace = (complaint: ComplaintData, presetId?: string) => {
    setActiveWalletForTrace(complaint.walletAddress);

    let result: TraceResult;
    if (presetId) {
      const found = PRESET_COMPLAINTS.find(p => p.id === presetId);
      result = found ? found.result : generateTraceForCustomAddress(complaint);
    } else {
      result = generateTraceForCustomAddress(complaint);
    }

    setPendingResult(result);
    setIsTracing(true);
  };

  const handleTraceComplete = () => {
    if (pendingResult) {
      setCurrentTrace(pendingResult);
    }
    setIsTracing(false);
    setActiveTab('intelligence');
  };

  return (
    <div className="min-h-screen flex flex-col selection:bg-[#C6FF00] selection:text-black relative bg-editorial-wash bg-linen-pattern text-slate-900 transition-colors duration-500">
      {/* Precision Tactical Header Bar */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        hasActiveTrace={currentTrace !== null}
        onOpenSilentWitness={() => setIsSilentWitnessOpen(true)}
      />

      {/* Simple workspace controls */}
      <InvestigationWorkflowBar
        currentTab={activeTab}
        onTabChange={setActiveTab}
        userRole={userRole}
        onRoleChange={setUserRole}
        hasActiveTrace={currentTrace !== null}
        activeTrace={currentTrace}
        onSelectPreset={handleStartTrace}
        onOpenAlertModal={() => setIsAlertModalOpen(true)}
        onOpenReportModal={() => setIsReportModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-20">
        <AnimatePresence mode="wait">
          {isTracing ? (
            <motion.div
              key="tracing-view"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.28, ease: 'easeOut' }}
            >
              <TraceSequence
                walletAddress={activeWalletForTrace}
                onComplete={handleTraceComplete}
              />
            </motion.div>
          ) : (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.24, ease: 'easeOut' }}
            >
              {/* Tab 1: ALERTS // Real-Time Threat Feed */}
              {activeTab === 'alerts' && (
                <div className="space-y-6">
                  <AlertThreatsSection
                    onTriageIncident={handleStartTrace}
                    onOpenDesk={() => setActiveTab('desk')}
                  />
                  <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
                    <BitcaseAiCopilot
                      activeTrace={currentTrace}
                      defaultExpanded={false}
                    />
                  </div>
                </div>
              )}

              {/* Tab 2: DESK // Case Management & Transaction Intake */}
              {activeTab === 'desk' && (
                <div className="space-y-6">
                  <CaseIntakeForm
                    onStartTrace={handleStartTrace}
                    isTracing={isTracing}
                  />
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <BitcaseAiCopilot
                      activeTrace={currentTrace}
                      defaultExpanded={true}
                    />
                  </div>
                </div>
              )}

              {/* Tab 3: INTELLIGENCE // Forensic Graph & Attribution View */}
              {activeTab === 'intelligence' && currentTrace && (
                <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6 font-sans">
                  {/* Result Screen Navigation Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 pb-4">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => setActiveTab('desk')}
                        className="p-2 rounded-xl bg-white border border-zinc-200 hover:border-zinc-300 text-zinc-700 hover:text-black transition-colors cursor-pointer shadow-2xs"
                        title="Back to Case Desk"
                      >
                        <ArrowLeft className="w-4 h-4" />
                      </button>
                      <div>
                        <div className="flex items-center space-x-2 text-xs text-zinc-500 font-medium">
                          <span className="font-semibold text-[#65A30D]">Attribution Report</span>
                          <span>•</span>
                          <span className="font-mono">{currentTrace.traceId}</span>
                        </div>
                        <h2 className="text-xl font-bold tracking-tight text-slate-900">
                          Forensic Graph &amp; Exchange Attribution
                        </h2>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          handleStartTrace(currentTrace.complaint);
                        }}
                        className="px-3.5 py-2 rounded-xl bg-white hover:bg-zinc-50 border border-zinc-200 text-xs font-medium text-zinc-800 flex items-center space-x-1.5 transition-colors cursor-pointer shadow-2xs"
                      >
                        <RotateCw className="w-3.5 h-3.5 text-[#65A30D]" />
                        <span>Re-Run Trace</span>
                      </button>
                    </div>
                  </div>

                  {/* Visual Hop Flow Progression Timeline */}
                  <HopFlowTimeline
                    nodes={currentTrace.graph.nodes}
                    edges={currentTrace.graph.edges}
                    matchedVaspName={currentTrace.topCandidates[0]?.name || 'Unknown VASP'}
                  />

                  {/* Multi-Hop Interactive Graph Visualizer */}
                  <GraphVisualizer
                    nodes={currentTrace.graph.nodes}
                    edges={currentTrace.graph.edges}
                    matchedExchangeName={currentTrace.topCandidates[0]?.name || 'Unknown VASP'}
                  />

                  {/* Dedicated AI Investigative Co-Pilot Widget */}
                  <BitcaseAiCopilot
                    activeTrace={currentTrace}
                    defaultExpanded={true}
                  />

                  {/* Headline Attribution, Case Risk, Urgency, Explainability */}
                  <AttributionResults
                    traceResult={currentTrace}
                    onOpenAlertModal={() => setIsAlertModalOpen(true)}
                    onOpenReportModal={() => setIsReportModalOpen(true)}
                  />

                  {/* Interactive Jurisdiction Radar & Cross-Border Trap */}
                  <JurisdictionRadar
                    traceResult={currentTrace}
                  />
                </div>
              )}

              {/* Tab 4: PASS // Authorization, Statutory Framework & Sec 91 Protocol */}
              {activeTab === 'pass' && (
                <MethodologyView />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Forensic Modals */}
      {currentTrace && (
        <>
          <InvestigatorAlertModal
            isOpen={isAlertModalOpen}
            onClose={() => setIsAlertModalOpen(false)}
            traceResult={currentTrace}
          />

          <ReportExportModal
            isOpen={isReportModalOpen}
            onClose={() => setIsReportModalOpen(false)}
            traceResult={currentTrace}
          />
        </>
      )}

      {/* Tactical SILENT WITNESS Panic Lock & Burn Modal */}
      <SilentWitnessModal
        isOpen={isSilentWitnessOpen}
        onClose={() => setIsSilentWitnessOpen(false)}
        activeCaseRef={currentTrace?.complaint.complaintRef}
      />

      {/* Clean footer */}
      <footer className="border-t py-4 px-4 sm:px-6 text-xs text-zinc-500 border-zinc-200/80 bg-white/60">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-[#65A30D]" />
            <span className="font-semibold text-slate-800">Coin UTXO</span>
            <span className="text-zinc-300">•</span>
            <span>Cryptographic Asset Attribution &amp; Multi-Hop Tracing</span>
          </div>
          <div className="text-zinc-400 font-mono text-[11px]">
            Sec 91/102 CrPC Ready
          </div>
        </div>
      </footer>
    </div>
  );
}

// Wrapper for the alerts threat feed
function AlertThreatsSection({
  onTriageIncident,
  onOpenDesk
}: {
  onTriageIncident: (complaint: ComplaintData, presetId: string) => void;
  onOpenDesk: () => void;
}) {
  return (
    <AlertsThreatFeed
      onTriageIncident={onTriageIncident}
      onOpenDesk={onOpenDesk}
    />
  );
}

