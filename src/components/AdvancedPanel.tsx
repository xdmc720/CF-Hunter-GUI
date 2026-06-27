import React, { useState } from 'react';
import type { AppState } from '../types';
import { ChevronDown, ChevronUp, ShieldAlert, ShieldCheck, Info } from 'lucide-react';

interface Props {
  state: AppState;
  dispatch: any;
}

export const AdvancedPanel: React.FC<Props> = ({ state, dispatch }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-xl shadow-slate-200/40 dark:shadow-none border border-white/60 dark:border-slate-700/50 relative z-10 transition-all">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-5 flex items-center justify-between text-left font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50/50 dark:hover:bg-slate-700/30 rounded-2xl transition-colors focus:outline-none"
      >
        <div className="flex items-center">
          <span className="w-2 h-6 bg-gradient-to-b from-slate-400 to-slate-600 rounded-full mr-3 shadow-sm"></span>
          高阶极客选项 (Advanced)
        </div>
        {isOpen ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
      </button>

      {isOpen && (
        <div className="p-6 border-t border-slate-100/50 dark:border-slate-700/50 space-y-8 animate-in slide-in-from-top-2 duration-300">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Signature */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 flex items-center group relative w-max">
                特征匹配模式
                <Info className="w-4 h-4 ml-2 text-slate-400 cursor-help" />
                <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-64 p-2 bg-slate-800 text-white text-xs rounded shadow-lg z-10 font-normal">
                  选1003能直接剔除掉那些建站的机器，找出来的 100% 是纯净的代理中转机。
                </div>
              </h3>
              <label className="flex items-start space-x-3 cursor-pointer group/1003 relative">
                <input 
                  type="radio" 
                  checked={state.signature === '1003'}
                  onChange={() => dispatch({ type: 'SET_SIGNATURE', payload: '1003' })}
                  className="mt-1 text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <div className="font-medium text-sm dark:text-slate-200 flex items-center">
                    1003 拦截特征 <ShieldCheck className="w-4 h-4 text-emerald-500 ml-1 inline" />
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex items-center">
                    精准识别边缘节点，误判极低
                    <Info className="w-3.5 h-3.5 ml-1 text-slate-400 cursor-help" />
                  </div>
                </div>

                <div className="absolute left-8 bottom-full mb-2 hidden group-hover/1003:block w-80 p-4 bg-slate-800/95 backdrop-blur text-white text-xs rounded-xl shadow-2xl z-50 font-normal border border-slate-700 pointer-events-none">
                  <div className="font-semibold text-emerald-400 mb-2">小白避坑：为什么搜不到 IP？</div>
                  <p className="opacity-90 leading-relaxed mb-2">
                    <strong>1003</strong> (Direct IP access not allowed) 通常是 Cloudflare 边缘节点较强的识别特征，误判概率远低于 403。
                  </p>
                  <p className="opacity-90 leading-relaxed text-rose-300 mb-3">
                    但在部分地区或冷门 ASN 中，满足此严苛特征的 IP 数量可能极少，甚至没有结果。
                  </p>
                  <div className="bg-slate-900/50 p-2 rounded-lg border border-slate-700 mb-3">
                    <div className="grid grid-cols-3 gap-1 text-[10px] text-slate-300 text-center">
                      <div className="font-semibold text-slate-400">模式</div>
                      <div className="font-semibold text-slate-400">精准度</div>
                      <div className="font-semibold text-slate-400">数量</div>
                      <div className="text-emerald-400">1003</div><div>★★★★★</div><div>★</div>
                      <div className="text-amber-400">403</div><div>★★★</div><div>★★★★★</div>
                      <div className="text-blue-400">403+ASN</div><div>★★★★</div><div>★★★</div>
                    </div>
                  </div>
                  <p className="opacity-90 leading-relaxed">
                    <strong>建议：</strong>若搜索为空，请切回下方「经典 403 特征」初筛，再结合 ASN、NextTrace 回程和测速进行二次筛选。
                  </p>
                </div>
              </label>
              <label className="flex items-start space-x-3 cursor-pointer">
                <input 
                  type="radio" 
                  checked={state.signature === '403'}
                  onChange={() => dispatch({ type: 'SET_SIGNATURE', payload: '403' })}
                  className="mt-1 text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <div className="font-medium text-sm dark:text-slate-200 flex items-center">
                    经典 403 特征 <ShieldAlert className="w-4 h-4 text-amber-500 ml-1 inline" />
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">可能包含部分建站机器，适用范围广</div>
                </div>
              </label>
            </div>

            {/* Time Window */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400">IP 新鲜度 (时间窗口)</h3>
              <div className="flex flex-wrap gap-2">
                {[
                  { value: '1', label: '近 1 天' },
                  { value: '7', label: '近 7 天' },
                  { value: '30', label: '近 30 天' },
                  { value: 'all', label: '不限' }
                ].map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => dispatch({ type: 'SET_TIME_WINDOW', payload: opt.value })}
                    className={`text-sm py-1.5 px-3 rounded border transition-colors ${
                      state.timeWindow === opt.value
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium'
                        : 'border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="h-px bg-slate-100 dark:bg-slate-700"></div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <label className="flex items-center space-x-3 cursor-pointer p-3 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/30 transition">
              <input 
                type="checkbox" 
                checked={state.ipv4Only}
                onChange={() => dispatch({ type: 'TOGGLE_IPV4_ONLY' })}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <div className="text-sm dark:text-slate-200">仅限 IPv4</div>
            </label>

            <label className={`flex items-start space-x-3 p-3 border border-slate-200 dark:border-slate-700 rounded-lg transition cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/30 group/excludedomain relative`}>
              <input 
                type="checkbox" 
                checked={state.excludeDomain}
                onChange={() => dispatch({ type: 'TOGGLE_EXCLUDE_DOMAIN' })}
                className="w-4 h-4 mt-0.5 text-blue-600 rounded"
              />
              <div>
                <div className="text-sm dark:text-slate-200 flex items-center">
                  纯 IP 扫描 (去域名)
                  <Info className="w-3.5 h-3.5 ml-1 text-slate-400 cursor-help" />
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">FOFA: is_domain=false / Censys: not name:* (实验性)</div>
              </div>

              <div className="absolute left-8 bottom-full mb-2 hidden group-hover/excludedomain:block w-80 p-4 bg-slate-800/95 backdrop-blur text-white text-xs rounded-xl shadow-2xl z-50 font-normal border border-slate-700 pointer-events-none">
                <div className="font-semibold text-blue-400 mb-2">资产测绘抽象层：纯 IP 近似过滤</div>
                <div className="bg-slate-900/50 p-2 rounded-lg border border-slate-700 mb-2 space-y-2">
                  <div>
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-emerald-400">FOFA (is_domain=false)</span>
                      <span className="text-emerald-400">★★★★★</span>
                    </div>
                    <p className="opacity-80 text-[10px] mt-1">精确过滤。FOFA 已在服务端完成严格的域名资产归一化。</p>
                  </div>
                  
                  <div className="h-px bg-slate-700 w-full"></div>
                  
                  <div>
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-amber-400">Censys (not name: *) 🧪 实验性</span>
                      <span className="text-amber-400">★★★☆☆</span>
                    </div>
                    <p className="opacity-80 text-[10px] mt-1">近似过滤。尝试暴力排除带 PTR、TLS SAN 或 Host 的资产。属于“宁可错杀不可漏网”，但无法绝对保证纯净。</p>
                  </div>
                </div>
                <p className="opacity-90 leading-relaxed text-rose-300">
                  <strong>注意：</strong>由于引擎底层设计差异，此选项在 Censys 中可能误杀较多隐蔽节点，若无结果建议关闭。
                </p>
              </div>
            </label>

            <label className="flex items-center space-x-3 cursor-pointer p-3 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/30 transition relative group">
              <input 
                type="checkbox" 
                checked={state.excludeOfficial}
                onChange={() => dispatch({ type: 'TOGGLE_EXCLUDE_OFFICIAL' })}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <div className="flex-1 flex items-center justify-between">
                <div>
                  <div className="text-sm dark:text-slate-200 text-rose-600 dark:text-rose-400 font-medium flex items-center">
                    剔除官方 CF 节点
                    <Info className="w-3.5 h-3.5 ml-1.5 text-slate-400 cursor-help transition-colors group-hover:text-rose-400" />
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">屏蔽官方自带 AS，寻找“野生套壳”</div>
                </div>
              </div>
              
              <div className="absolute right-0 bottom-full mb-3 hidden group-hover:block w-72 p-3 bg-slate-800 text-white text-xs rounded-xl shadow-2xl z-50 font-normal border border-slate-700 pointer-events-none">
                <div className="mb-1.5 font-semibold text-rose-300">为什么要排除官方 ASN？</div>
                <div className="space-y-1.5 opacity-90 leading-relaxed">
                  <p>CF 官方 IP（如 AS13335）大多已被严重拥堵或阻断。</p>
                  <p>我们实际上是在找那些特征表现得像 CF（例如返回 403 Forbidden），但 IP 却属于第三方机房（如 DMIT, Evoxt）的<strong>“野生套壳 / 旁路反代”</strong>服务器。</p>
                  <p>这种非官方节点，若其本身回国路由优质，就是所谓的“神仙 IP”。</p>
                </div>
              </div>
            </label>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-2">自定义拉黑 ASN (万人骑过滤)</h3>
            <input
              type="text"
              value={state.customAsns}
              onChange={(e) => dispatch({ type: 'SET_CUSTOM_ASNS', payload: e.target.value })}
              placeholder="多个 ASN 用空格或逗号隔开，例如：13335, 209242"
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-slate-200 placeholder-slate-400"
            />
          </div>

        </div>
      )}
    </div>
  );
};
