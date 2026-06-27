import React, { useState } from 'react';
import { PROVIDERS } from '../data/providers';
import { Info, ChevronDown, ChevronUp, BookOpen } from 'lucide-react';
import { RoutingDictionaryModal } from './RoutingDictionaryModal';

interface Props {
  selectedProviders: string[];
  customIncludeAsns: string;
  onToggle: (provider: string) => void;
  onCustomChange: (val: string) => void;
}

export const AsnSelector: React.FC<Props> = ({ selectedProviders, customIncludeAsns, onToggle, onCustomChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl p-6 rounded-2xl shadow-xl shadow-slate-200/40 dark:shadow-none border border-white/60 dark:border-slate-700/50 relative z-10 transition-all hover:shadow-2xl hover:shadow-slate-200/50">
        <div 
        className="flex items-center justify-between mb-6 cursor-pointer group"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center">
          <h2 className="text-lg font-bold flex items-center relative text-slate-800 dark:text-slate-100 group-hover:text-pink-600 transition-colors">
            <span className="w-2 h-6 bg-gradient-to-b from-pink-400 to-pink-600 rounded-full mr-3 shadow-sm"></span>
            优质线路 / 厂商 (ASN)
            <div className="group/tooltip relative ml-2">
              <Info className="w-4 h-4 text-slate-400 cursor-help transition-colors group-hover/tooltip:text-pink-500" />
              <div className="absolute left-0 bottom-full mb-3 hidden group-hover/tooltip:block w-64 p-3 bg-slate-800/95 backdrop-blur text-white text-xs rounded-xl shadow-2xl z-50 font-normal border border-slate-700 pointer-events-none">
                云服务器提供商。勾选即可专挑那些线路又快又稳的服务器去扫，底层会自动帮您映射所有的相关自治域(ASN)。
              </div>
            </div>
          </h2>
          {selectedProviders.length === 0 && (
            <span className="ml-3 text-sm px-2 py-1 bg-pink-100 dark:bg-pink-900/50 text-pink-700 dark:text-pink-300 rounded hidden sm:inline-block">
              不限 (全网撒网)
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2 sm:space-x-3">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setIsModalOpen(true);
            }}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-400 dark:hover:bg-indigo-900/50 transition-colors border border-indigo-100 dark:border-indigo-800/50 shadow-sm"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">极客路由图鉴</span>
            <span className="sm:hidden">图鉴</span>
          </button>
          <button className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
            {isOpen ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="space-y-4 animate-in slide-in-from-top-2 duration-300">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
            {PROVIDERS.map((p) => {
              const isSelected = selectedProviders.includes(p.name);
              return (
                <button
                  key={p.name}
                  onClick={() => onToggle(p.name)}
                  className={`text-left p-3 rounded-lg border transition-all h-auto flex flex-col justify-start items-start ${
                    isSelected
                      ? 'border-pink-500 bg-pink-50 dark:bg-pink-900/30 ring-1 ring-pink-500'
                      : 'border-slate-200 dark:border-slate-700 hover:border-pink-300 dark:hover:border-pink-700 bg-slate-50 dark:bg-slate-900'
                  }`}
                >
                  <div className={`font-medium text-sm w-full break-words whitespace-normal ${isSelected ? 'text-pink-700 dark:text-pink-300' : 'text-slate-700 dark:text-slate-200'}`}>
                    {p.name}
                  </div>
                  <div className="text-xs text-slate-400 dark:text-slate-500 mt-1 w-full break-words whitespace-normal">
                    AS{p.asns.join(', AS')}
                  </div>
                </button>
              );
            })}
          </div>
          
          <div className="pt-4 border-t border-slate-100 dark:border-slate-700">
            <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-2">自定义线路 (手动输入 ASN)</h3>
            <input
              type="text"
              value={customIncludeAsns}
              onChange={(e) => onCustomChange(e.target.value)}
              placeholder="例如：906, 54574 (输入目标机房 ASN，非路由 ASN)"
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 dark:text-slate-200 placeholder-slate-400 shadow-inner"
            />
          </div>
        </div>
      )}
      </div>
      <RoutingDictionaryModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};
