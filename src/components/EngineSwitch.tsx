import React from 'react';
import type { Engine } from '../types';

interface Props {
  engine: Engine;
  onChange: (engine: Engine) => void;
}

export const EngineSwitch: React.FC<Props> = ({ engine, onChange }) => {
  return (
    <div className="flex items-center space-x-3">
      <span className="text-sm font-bold text-slate-700 dark:text-slate-300">搜索引擎：</span>
      <div className="bg-slate-200/50 dark:bg-slate-800/80 backdrop-blur-md p-1 rounded-xl flex shadow-inner border border-white/20 dark:border-slate-700/50">
        <button
          onClick={() => onChange('fofa')}
          className={`py-1.5 px-6 rounded-lg text-sm font-bold transition-all duration-300 ${
            engine === 'fofa' 
              ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-md ring-1 ring-black/5 dark:ring-white/10' 
              : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
        >
          FOFA
        </button>
        <button
          onClick={() => onChange('censys')}
          className={`py-1.5 px-6 rounded-lg text-sm font-bold transition-all duration-300 ${
            engine === 'censys' 
              ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-md ring-1 ring-black/5 dark:ring-white/10' 
              : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
          }`}
        >
          Censys <span className="text-[10px] opacity-60 ml-1 font-normal">(CenQL)</span>
        </button>
      </div>
    </div>
  );
};
