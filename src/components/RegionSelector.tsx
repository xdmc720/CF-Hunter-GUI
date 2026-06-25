import React, { useState } from 'react';
import { REGIONS } from '../data/constants';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface Props {
  selectedRegions: string[];
  customRegions: string;
  onToggle: (fofaCode: string) => void;
  onToggleGroup: (regions: string[], selected: boolean) => void;
  onCustomChange: (val: string) => void;
}

export const RegionSelector: React.FC<Props> = ({ selectedRegions, customRegions, onToggle, onToggleGroup, onCustomChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl p-6 rounded-2xl shadow-xl shadow-slate-200/40 dark:shadow-none border border-white/60 dark:border-slate-700/50 relative z-10 transition-all hover:shadow-2xl hover:shadow-slate-200/50">
      <div 
        className="flex justify-between items-center mb-6 cursor-pointer group"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center">
          <h2 className="text-lg font-bold flex items-center text-slate-800 dark:text-slate-100 group-hover:text-emerald-600 transition-colors">
            <span className="w-2 h-6 bg-gradient-to-b from-emerald-400 to-emerald-600 rounded-full mr-3 shadow-sm"></span>
            目标区域 (Regions)
          </h2>
          {selectedRegions.length === 0 && (
            <span className="ml-3 text-sm px-2 py-1 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 rounded">
              不限 (全局盲扫)
            </span>
          )}
        </div>
        <button className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
          {isOpen ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
        </button>
      </div>
      
      {isOpen && (
        <div className="space-y-6 animate-in slide-in-from-top-2 duration-300">
          {REGIONS.map((group) => {
            const groupCodes = group.countries.map(c => c.fofa);
            const allSelected = groupCodes.every(code => selectedRegions.includes(code));
            
            return (
              <div key={group.group}>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400">{group.group}</h3>
                  <button
                    onClick={() => onToggleGroup(groupCodes, !allSelected)}
                    className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    {allSelected ? '取消全选' : '全选此区'}
                  </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {group.countries.map((country) => {
                    const isSelected = selectedRegions.includes(country.fofa);
                    return (
                      <button
                        key={country.fofa}
                        onClick={() => onToggle(country.fofa)}
                        className={`text-sm py-2 px-3 rounded border transition-colors flex items-center justify-between ${
                          isSelected 
                            ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300' 
                            : 'border-slate-200 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-600 text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        <span className="truncate">{country.label.split(' ')[0]}</span>
                        <span className="text-xs opacity-50">{country.fofa}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
          
          <div className="pt-4 border-t border-slate-100 dark:border-slate-700">
            <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-2 flex items-center">
              自定义地区 (手动输入)
              <div className="group/regtip relative ml-2">
                <span className="w-4 h-4 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-500 text-[10px] flex items-center justify-center cursor-help">?</span>
                <div className="absolute left-0 bottom-full mb-2 hidden group-hover/regtip:block w-64 p-2 bg-slate-800 text-white text-xs rounded shadow-lg z-10 font-normal">
                  支持直接输入中文国家名 (如"新西兰", "阿根廷") 或两字母代码 (如"NZ", "AR")。系统会自动为您在底层进行双引擎的翻译。
                </div>
              </div>
            </h3>
            <input
              type="text"
              value={customRegions}
              onChange={(e) => onCustomChange(e.target.value)}
              placeholder="请输入国家中文名或代码，如：新西兰, US, 日本 (用空格或逗号隔开)"
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:text-slate-200 placeholder-slate-400"
            />
          </div>
        </div>
      )}
    </div>
  );
};
