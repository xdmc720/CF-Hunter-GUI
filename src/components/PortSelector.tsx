import React, { useState } from 'react';
import { PORTS } from '../data/constants';
import { Info, ChevronDown, ChevronUp } from 'lucide-react';

interface Props {
  selectedPorts: number[];
  customPorts: string;
  onToggle: (port: number) => void;
  onToggleGroup: (ports: number[], selected: boolean) => void;
  onClear: () => void;
  onCustomChange: (val: string) => void;
}

export const PortSelector: React.FC<Props> = ({ 
  selectedPorts, customPorts, onToggle, onToggleGroup, onClear, onCustomChange 
}) => {
  const [isOpen, setIsOpen] = useState(false); // Closed by default

  const handleRecommend = () => {
    onClear();
    onToggleGroup([80, 443, 8080, 8443], true);
  };

  const isBlindScan = selectedPorts.length === 0 && customPorts.trim() === '';

  return (
    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl p-6 rounded-2xl shadow-xl shadow-slate-200/40 dark:shadow-none border border-white/60 dark:border-slate-700/50 relative z-10 transition-all hover:shadow-2xl hover:shadow-slate-200/50">
      <div 
        className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3 cursor-pointer group"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center">
          <h2 className="text-lg font-bold flex items-center relative text-slate-800 dark:text-slate-100 group-hover:text-purple-600 transition-colors">
            <span className="w-2 h-6 bg-gradient-to-b from-purple-400 to-purple-600 rounded-full mr-3 shadow-sm"></span>
            服务端口 (Ports)
            <div className="group/tooltip relative ml-2">
              <Info className="w-4 h-4 text-slate-400 cursor-help transition-colors group-hover/tooltip:text-purple-500" />
              <div className="absolute left-0 bottom-full mb-3 hidden group-hover/tooltip:block w-64 p-3 bg-slate-800/95 backdrop-blur text-white text-xs rounded-xl shadow-2xl z-50 font-normal border border-slate-700 pointer-events-none">
                除了 80 和 443 外的特殊端口，通常封锁力度小、不拥堵，属于隐藏宝藏。
              </div>
            </div>
          </h2>
        </div>
        <div className="flex items-center" onClick={(e) => e.stopPropagation()}>
          <div className="flex flex-wrap gap-2 text-xs">
            <button onClick={handleRecommend} className="px-2 py-1 bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 rounded hover:bg-purple-200 dark:hover:bg-purple-800 transition">推荐组</button>
            <button onClick={() => onToggleGroup(PORTS.http, true)} className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded hover:bg-slate-200 dark:hover:bg-slate-600 transition">全选 HTTP</button>
            <button onClick={() => onToggleGroup(PORTS.https, true)} className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded hover:bg-slate-200 dark:hover:bg-slate-600 transition">全选 HTTPS</button>
            <button onClick={onClear} className="px-2 py-1 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded hover:bg-red-100 dark:hover:bg-red-900/50 transition">清空</button>
          </div>
          <button onClick={() => setIsOpen(!isOpen)} className="ml-3 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
            {isOpen ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="animate-in slide-in-from-top-2 duration-300">
          {isBlindScan && (
            <div className="mb-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg flex items-start text-amber-800 dark:text-amber-400 text-sm">
              <Info className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
              <p>未限制端口，将扫描全部端口。可能会引入 SSH、RDP 等非 Web 服务杂质。</p>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-2">HTTP 组</h3>
              <div className="flex flex-wrap gap-2">
                {PORTS.http.map(port => (
                  <button
                    key={port}
                    onClick={() => onToggle(port)}
                    className={`text-sm py-1.5 px-3 rounded-full border transition-colors ${
                      selectedPorts.includes(port)
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-medium'
                        : 'border-slate-200 dark:border-slate-700 hover:border-purple-300 dark:hover:border-purple-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {port}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-2">HTTPS 组</h3>
              <div className="flex flex-wrap gap-2">
                {PORTS.https.map(port => (
                  <button
                    key={port}
                    onClick={() => onToggle(port)}
                    className={`text-sm py-1.5 px-3 rounded-full border transition-colors ${
                      selectedPorts.includes(port)
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-medium'
                        : 'border-slate-200 dark:border-slate-700 hover:border-purple-300 dark:hover:border-purple-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {port}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-2">自定义端口</h3>
              <input
                type="text"
                value={customPorts}
                onChange={(e) => onCustomChange(e.target.value)}
                placeholder="支持输入多个端口，用空格或逗号隔开，如：12345, 67890"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 dark:text-slate-200 placeholder-slate-400"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
