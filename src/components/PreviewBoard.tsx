import React, { useEffect, useState } from 'react';
import type { AppState } from '../types';
import { generateFofaQuery, generateCensysQuery, safeFofaBase64 } from '../utils/engine';
import { Copy, Download } from 'lucide-react';
import toast from 'react-hot-toast';
import { saveHistory } from '../utils/storage';

interface Props {
  state: AppState;
}

export const PreviewBoard: React.FC<Props> = ({ state }) => {
  const [query, setQuery] = useState('');
  const [base64, setBase64] = useState('');

  useEffect(() => {
    if (state.engine === 'fofa') {
      const q = generateFofaQuery(state);
      setQuery(q);
      const b64 = safeFofaBase64(q);
      setBase64(b64);
      
      // 容错与降级机制：长度拦截预警
      if (b64.length > 1800) {
        toast.error('语法过长 (Base64 超 1800 字符)，FOFA 可能请求失败 (414)。建议减少勾选项分批查询！', { 
          id: 'fofa-length-warning',
          duration: 4000
        });
      } else {
        toast.dismiss('fofa-length-warning');
      }
    } else {
      const q = generateCensysQuery(state);
      setQuery(q);
      setBase64('');
    }
  }, [state]);

  const handleCopy = (text: string) => {
    saveHistory(state);
    navigator.clipboard.writeText(text).then(() => {
      toast.success('已复制到剪贴板');
    }).catch(() => {
      toast.error('复制失败，请手动复制');
    });
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([query], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `query-${state.engine}-${new Date().getTime()}.txt`;
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
    document.body.removeChild(element);
    toast.success('已导出为 TXT');
  };

  return (
    <div className="bg-slate-900/95 backdrop-blur-xl rounded-2xl shadow-2xl shadow-blue-900/20 border border-slate-700/50 text-slate-300 relative z-10 overflow-hidden ring-1 ring-white/10">
      <div className="flex items-center justify-between px-5 py-4 bg-slate-950/80 border-b border-slate-800/80">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-amber-500"></div>
          <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
          <span className="ml-2 text-xs font-mono text-slate-500 tracking-wider font-semibold">
            {state.engine.toUpperCase()} SYNTAX PREVIEW
          </span>
        </div>
        <div className="flex space-x-2">
          <button onClick={() => handleCopy(query)} className="p-1.5 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition" title="复制原生语法">
            <Copy className="w-4 h-4" />
          </button>
          <button onClick={handleDownload} className="p-1.5 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition" title="导出查询为 TXT">
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div className="p-4 overflow-x-auto custom-scrollbar font-mono text-sm leading-relaxed whitespace-pre-wrap break-all text-emerald-400">
        {query}
      </div>

      {state.engine === 'fofa' && base64 && (
        <div className="p-4 bg-slate-950 border-t border-slate-800 rounded-b-xl">
          <div className="text-xs text-slate-500 mb-1 flex justify-between items-center">
            <span>qbase64 (可直接复制进 FOFA)</span>
            <button onClick={() => handleCopy(base64)} className="text-blue-400 hover:underline">复制</button>
          </div>
          <div className="font-mono text-xs text-slate-400 break-all opacity-70">
            {base64}
          </div>
        </div>
      )}
    </div>
  );
};
