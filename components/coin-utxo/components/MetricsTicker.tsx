import React from 'react';
import { SYSTEM_METRICS } from '../data/mockPresets';

export const MetricsTicker: React.FC = () => {
  return (
    <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 pt-2">
      <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-xs text-zinc-500 dark:text-zinc-400 px-1">
        <span className="flex items-center gap-1.5 text-zinc-700 dark:text-zinc-300 font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          Live
        </span>
        <span>
          <span className="font-semibold text-zinc-900 dark:text-zinc-100">{SYSTEM_METRICS.casesTraced}</span> traced
        </span>
        <span>
          <span className="font-semibold text-zinc-900 dark:text-zinc-100">{SYSTEM_METRICS.knownVaspsIndexed}</span> VASPs indexed
        </span>
        <span className="hidden sm:inline">
          <span className="font-semibold text-zinc-900 dark:text-zinc-100">{SYSTEM_METRICS.freezeSuccessRate}</span> freeze rate
        </span>
        <span className="hidden lg:inline ml-auto text-zinc-400 dark:text-zinc-600">
          Sec 91/102 CrPC · FIU-IND compliant
        </span>
      </div>
    </div>
  );
};


