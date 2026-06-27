import React from 'react';
import { X, Network, AlertTriangle } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const RoutingDictionaryModal: React.FC<Props> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}>
      <div 
        className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
          <h2 className="text-lg font-bold flex items-center text-slate-800 dark:text-slate-100">
            <Network className="w-5 h-5 mr-2 text-indigo-500" />
            极客路由追踪图鉴 (回程判定指南)
          </h2>
          <button onClick={onClose} className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full text-slate-500 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 max-h-[70vh] overflow-y-auto custom-scrollbar space-y-6 text-sm text-slate-600 dark:text-slate-300">
          
          <div className="bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-300 p-4 rounded-xl border border-amber-200 dark:border-amber-800/30 flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <div className="leading-relaxed text-xs sm:text-sm space-y-2">
              <strong className="block text-base mb-1">避坑指南：请严格区分「归属 ASN」与「路由 ASN」</strong>
              <p>此图鉴用于分析目标 IP 的<strong>回程路由质量</strong>。</p>
              <p>图中的 ASN（如 AS4809、AS58807、AS9929）通常表示数据包在回程中经过的骨干网络 (Transit ASN)，而非服务器本身所属的自治系统 (Origin ASN)。</p>
              <p>在 Censys、FOFA 等搜索引擎中，应首先搜索服务器实际所属的 ASN（例如 <code>AS54574 DMIT</code>、<code>AS400464 VMISS</code>、<code>AS212083 Evoxt</code>），获取候选 IP 后，再利用 NextTrace、BestTrace 等工具检测其回程路径是否经过下方图鉴中的优质骨干节点，从而判断线路质量。</p>
              <p>因此，直接在 Censys 中搜索 <code>AS58807</code>、<code>AS4809</code> 等回程骨干 ASN，一般无法找到对应机房服务器，因为这些 ASN 更多承担的是传输与中转功能，而不是终端服务器托管。</p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-base flex items-center text-slate-800 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-2">
              <span className="w-1.5 h-4 bg-blue-500 rounded-full mr-2"></span>
              中国移动 (China Mobile) 路由判定表
            </h3>

            {/* CMIN2 */}
            <div className="border border-blue-200 dark:border-blue-900/50 rounded-xl p-4 bg-blue-50/50 dark:bg-blue-900/10 relative overflow-hidden">
              <div className="absolute top-0 right-0 px-2 py-1 bg-blue-500 text-white text-[10px] font-bold rounded-bl-lg">精品网</div>
              <div className="font-bold text-blue-700 dark:text-blue-400 mb-2 flex items-center">
                CMIN2 (第五代精品网络)
                <code className="ml-2 bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 px-1.5 py-0.5 rounded text-xs">AS58807</code>
              </div>
              <p className="text-xs mb-3 opacity-90">移动最顶级出海网络，晚高峰极低丢包。判定依据：路由追踪链路中必须出现 <code>AS58807</code>。</p>
              <div className="text-[11px] font-mono bg-white dark:bg-slate-900 p-2 rounded border border-slate-200 dark:border-slate-800 break-all space-y-1">
                <div className="text-slate-400">常见完整路由示例：</div>
                <div className="text-blue-600 dark:text-blue-400">AS35041 / AS24445 / AS9808 / <span className="font-bold underline">AS58807</span> / AS140096 / AS400618</div>
                <div className="text-blue-600 dark:text-blue-400">AS35041 / AS9808 / <span className="font-bold underline">AS58807</span> / AS41378</div>
                <div className="text-blue-600 dark:text-blue-400">AS35041 / AS24445 / AS9808 / <span className="font-bold underline">AS58807</span> / AS906</div>
              </div>
            </div>

            {/* CMI */}
            <div className="border border-sky-200 dark:border-sky-900/50 rounded-xl p-4 bg-sky-50/50 dark:bg-sky-900/10">
              <div className="font-bold text-sky-700 dark:text-sky-400 mb-2 flex items-center">
                CMI (中国移动国际骨干网)
                <code className="ml-2 bg-sky-100 dark:bg-sky-900/50 text-sky-800 dark:text-sky-300 px-1.5 py-0.5 rounded text-xs">AS58453</code>
              </div>
              <p className="text-xs mb-3 opacity-90">移动主流出口网络，亚太方向直连体验优秀。判定依据：链路中出现 <code>AS58453</code> 且无 <code>AS58807</code>。</p>
              <div className="text-[11px] font-mono bg-white dark:bg-slate-900 p-2 rounded border border-slate-200 dark:border-slate-800 break-all space-y-1">
                <div className="text-slate-400">常见完整路由示例：</div>
                <div className="text-sky-600 dark:text-sky-400">AS35041 / AS24445 / <span className="font-bold underline">AS58453</span> / AS36002</div>
                <div className="text-sky-600 dark:text-sky-400">AS35041 / AS24445 / AS9808 / <span className="font-bold underline">AS58453</span> / AS8143</div>
                <div className="text-sky-600 dark:text-sky-400">AS9808 / <span className="font-bold underline">AS58453</span> / AS3356 / AS7578 / AS906</div>
              </div>
            </div>

            {/* 普通 */}
            <div className="border border-slate-200 dark:border-slate-700/50 rounded-xl p-4 bg-slate-50 dark:bg-slate-800/20 opacity-80">
              <div className="font-bold text-slate-700 dark:text-slate-300 mb-2">
                非精品线路 / 普通线路
              </div>
              <p className="text-xs mb-3 opacity-90">晚高峰容易拥堵卡顿。判定依据：路由未检出移动核心出口 (58807/58453)，而是直接绕至 NTT (2914) 或其他国际运营商。</p>
              <div className="text-[11px] font-mono bg-white dark:bg-slate-900 p-2 rounded border border-slate-200 dark:border-slate-800 break-all space-y-1">
                <div className="text-slate-400">常见完整路由示例：</div>
                <div className="text-slate-500">AS35041 / AS24445 / AS9808 / <span className="text-red-400">AS2914 (NTT)</span> / AS4229 / AS49304</div>
                <div className="text-slate-500">AS35041 / AS9808 / <span className="text-red-400">AS2914</span> / AS4229 / AS49304</div>
                <div className="text-slate-500">AS35041 / AS58453 / AS17676 / AS209554 <span className="text-slate-400">(部分绕路)</span></div>
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
             <h3 className="font-bold text-base flex items-center text-slate-800 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-2">
              <span className="w-1.5 h-4 bg-indigo-500 rounded-full mr-2"></span>
              电信与联通 精品网常识 (拓展)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="border border-slate-200 dark:border-slate-700/60 rounded-xl p-3.5 bg-slate-50 dark:bg-slate-800/20">
                <div className="font-semibold text-indigo-600 dark:text-indigo-400 mb-1 flex justify-between items-center">
                  <span>电信 CN2 GIA</span>
                  <code className="text-xs bg-indigo-100 dark:bg-indigo-900/30 px-1 rounded">AS4809</code>
                </div>
                <p className="text-[11px] opacity-80 leading-relaxed">回程/去程追踪出现 AS4809，且不经过 AS4134 (163)。</p>
              </div>
              <div className="border border-slate-200 dark:border-slate-700/60 rounded-xl p-3.5 bg-slate-50 dark:bg-slate-800/20">
                <div className="font-semibold text-orange-600 dark:text-orange-400 mb-1 flex justify-between items-center">
                  <span>联通 9929 (CUPM)</span>
                  <code className="text-xs bg-orange-100 dark:bg-orange-900/30 px-1 rounded">AS9929</code>
                </div>
                <p className="text-[11px] opacity-80 leading-relaxed">路由途经联通 A 网 (AS9929)，且通常不拥堵。</p>
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
             <h3 className="font-bold text-base flex items-center text-slate-800 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-2">
              <span className="w-1.5 h-4 bg-rose-500 rounded-full mr-2"></span>
              🔥 高阶排雷：看到神仙 ASN 就稳了吗？ (半程绕路陷阱)
            </h3>
            <div className="bg-slate-50 dark:bg-slate-800/30 p-4 rounded-xl border border-slate-200 dark:border-slate-700/50 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed space-y-3">
              <p>很多新手以为，只要在路由里看到 <strong>AS58807 (CMIN2)</strong> 或 <strong>AS4809 (CN2 GIA)</strong>，就一定是神仙线路。实际未必！</p>
              
              <div>
                <strong className="text-slate-700 dark:text-slate-200 block mb-1">1. 迟到的精品网 (绕路后再进入)</strong>
                <p>例如：<code>AS174(Cogent) → AS3356(Level3) → AS2914(NTT) → AS9808 → AS58807</code></p>
                <p className="mt-0.5 opacity-80">前面已经在国际公网上绕了一大圈，即使最后进入了 CMIN2 回国，延迟也已经爆炸。与直达 <code>AS9808 → AS58807</code> 的体验天差地别。<strong>标准：越早进入精品网 ASN 越好！</strong></p>
              </div>

              <div>
                <strong className="text-slate-700 dark:text-slate-200 block mb-1">2. 半程 CN2 陷阱</strong>
                <p>很多所谓的 CN2 线路，会出现 <code>AS4134 → AS4809</code> 或反之，这属于半程 CN2，晚高峰依旧可能在 163 段拥堵。只有双向 AS4809 才是纯正的 GIA。</p>
              </div>

              <div>
                <strong className="text-slate-700 dark:text-slate-200 block mb-1">3. 避开拥堵 Transit</strong>
                <p>如果在路由中看到大量经过 <strong>NTT (AS2914)、Cogent (AS174)、HE (AS6939)</strong> 等国际廉价骨干网，晚高峰丢包率大概率会飙升。</p>
              </div>
              
              <div className="mt-2 p-3 bg-rose-50 dark:bg-rose-900/10 text-rose-800 dark:text-rose-300 rounded-lg border border-rose-100 dark:border-rose-900/30 font-medium">
                💡 最终结论：图鉴仅作为理论快筛工具。除观察 ASN 外，<strong>晚高峰的实际测速和丢包率，才是检验神仙节点的唯一真理！</strong>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};
