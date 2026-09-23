import React from 'react';
import { Shield, User } from 'lucide-react';
import { motion } from 'motion/react';
import { PRESET_COMPLAINTS } from '../data/mockPresets';
import { ComplaintData, TraceResult } from '../types';
import { WorkspaceTab } from './Header';

export type UserRole = 'investigator' | 'citizen';

interface InvestigationWorkflowBarProps {
  currentTab: WorkspaceTab;
  onTabChange: (tab: WorkspaceTab) => void;
  userRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  hasActiveTrace: boolean;
  activeTrace: TraceResult | null;
  onSelectPreset: (complaint: ComplaintData, presetId: string) => void;
  onOpenAlertModal: () => void;
  onOpenReportModal: () => void;
}

export const InvestigationWorkflowBar: React.FC<InvestigationWorkflowBarProps> = ({
  currentTab,
  onTabChange,
  userRole,
  onRoleChange,
  hasActiveTrace,
  activeTrace,
  onSelectPreset,
  onOpenAlertModal,
  onOpenReportModal
}) => {
  const steps = [
    {
      id: 'step-intake',
      stepNum: '1',
      title: 'Incident Intake',
      subtitle: userRole === 'investigator' ? 'NCRP / Wallet Ingestion' : 'Paste Scammer Address',
      targetTab: 'desk' as WorkspaceTab,
      isCompleted: hasActiveTrace,
      isActive: currentTab === 'desk'
    },
    {
      id: 'step-trace',
      stepNum: '2',
      title: 'Multi-Hop Trace',
      subtitle: userRole === 'investigator' ? 'Peel-Chain & Clusters' : 'Track Where Money Moved',
      targetTab: 'intelligence' as WorkspaceTab,
      isCompleted: hasActiveTrace,
      isActive: currentTab === 'intelligence'
    },
    {
      id: 'step-unmask',
      stepNum: '3',
      title: 'VASP Unmasking',
      subtitle: userRole === 'investigator' ? 'Heuristic Attribution' : 'Identify Receiving Exchange',
      targetTab: 'intelligence' as WorkspaceTab,
      isCompleted: hasActiveTrace,
      isActive: currentTab === 'intelligence'
    },
    {
      id: 'step-action',
      stepNum: '4',
      title: 'Freeze & Evidence',
      subtitle: userRole === 'investigator' ? 'Sec 91/102 & MLAT' : 'Get FIR / Freeze Notice',
      targetTab: 'pass' as WorkspaceTab,
      isCompleted: false,
      isActive: currentTab === 'pass'
    }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 py-5">
      {/* Compact workspace toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="sr-only">View as:</span>
          <div className="flex items-center p-0.5 rounded-lg bg-zinc-100 dark:bg-zinc-800">
            <button
              onClick={() => onRoleChange('investigator')}
              className={`px-3 py-1 rounded-md text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                userRole === 'investigator'
                  ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm'
                  : 'text-zinc-500 dark:text-zinc-400'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              Investigator
            </button>
            <button
              onClick={() => onRoleChange('citizen')}
              className={`px-3 py-1 rounded-md text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                userRole === 'citizen'
                  ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm'
                  : 'text-zinc-500 dark:text-zinc-400'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              Citizen
            </button>
          </div>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
          <span className="sr-only">Try a scenario:</span>
          {PRESET_COMPLAINTS.map((preset) => {
            const isCurrent = activeTrace?.complaint.complaintRef === preset.complaint.complaintRef;
            return (
              <button
                key={preset.id}
                onClick={() => onSelectPreset(preset.complaint, preset.id)}
                className={`px-2.5 py-1 rounded-md whitespace-nowrap transition-colors cursor-pointer ${
                  isCurrent
                    ? 'bg-zinc-900 text-white dark:bg-[#C6FF00] dark:text-black font-medium'
                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                }`}
                title={preset.label}
              >
                {preset.label.split(' ')[0]} · {preset.complaint.chain}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4-step navigation */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {steps.map((step) => {
          return (
            <motion.div
              key={step.id}
              whileHover={{ y: -1 }}
              onClick={() => onTabChange(step.targetTab)}
              className={`p-3 rounded-lg border transition-colors cursor-pointer flex items-center gap-3 select-none ${
                step.isActive
                  ? 'bg-zinc-900 text-white dark:bg-zinc-800 border-zinc-900 dark:border-zinc-700'
                  : 'bg-white dark:bg-[#0D111A] text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'
              }`}
            >
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 ${
                step.isActive
                  ? 'bg-[#C6FF00] text-black'
                  : step.isCompleted
                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                  : 'bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400'
              }`}>
                {step.stepNum}
              </div>

              <div className="min-w-0">
                <div className="text-sm font-medium truncate">{step.title}</div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
