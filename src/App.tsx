import { useReducer, useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { Network, Moon, Sun, Clock } from 'lucide-react';
import { appReducer } from './store/useAppReducer';
import { defaultState } from './types';
import { EngineSwitch } from './components/EngineSwitch';
import { RegionSelector } from './components/RegionSelector';
import { PortSelector } from './components/PortSelector';
import { AsnSelector } from './components/AsnSelector';
import { AdvancedPanel } from './components/AdvancedPanel';
import { PreviewBoard } from './components/PreviewBoard';
import { serializeStateToHash, deserializeStateFromHash, getHistory } from './utils/storage';

function App() {
  const [state, dispatch] = useReducer(appReducer, defaultState);
  const [darkMode, setDarkMode] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const history = getHistory();

  // Load from hash or system pref on mount
  useEffect(() => {
    const fromHash = deserializeStateFromHash();
    if (fromHash) {
      dispatch({ type: 'LOAD_STATE', payload: fromHash });
    }

    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDarkMode(true);
    }
  }, []);

  // Sync dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Sync hash
  useEffect(() => {
    serializeStateToHash(state);
  }, [state]);

  const loadHistory = (hState: any) => {
    dispatch({ type: 'LOAD_STATE', payload: { ...defaultState, ...hState } });
    setShowHistory(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-slate-50 to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950 pb-20 transition-colors duration-500 relative overflow-x-hidden">
      {/* Decorative background blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-purple-400/20 dark:bg-purple-900/20 rounded-full blur-3xl opacity-60 dark:opacity-40 animate-pulse"></div>
        <div className="absolute top-40 -left-20 w-[400px] h-[400px] bg-blue-400/20 dark:bg-blue-900/20 rounded-full blur-3xl opacity-60 dark:opacity-40 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <Toaster position="top-center" toastOptions={{ className: 'backdrop-blur-md bg-white/90 dark:bg-slate-800/90 text-slate-800 dark:text-slate-200' }} />
      
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 border-b border-white/40 dark:border-slate-800/60 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
              <Network className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 hidden sm:block drop-shadow-sm">
                Cloudflare 优选 IP 生成器
              </h1>
              <h1 className="text-lg font-black text-slate-800 dark:text-slate-100 sm:hidden">
                CF IP Generator
              </h1>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <button 
                onClick={() => setShowHistory(!showHistory)}
                className="p-2 text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition relative"
                title="查询历史"
              >
                <Clock className="w-5 h-5" />
                {history.length > 0 && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full"></span>}
              </button>

              {showHistory && (
                <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden z-50">
                  <div className="px-4 py-3 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 font-semibold text-sm">
                    最近查询历史 (本地缓存)
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {history.length === 0 ? (
                      <div className="p-4 text-center text-sm text-slate-500">暂无历史记录</div>
                    ) : (
                      history.map((h, i) => (
                        <button 
                          key={i} 
                          onClick={() => loadHistory(h)}
                          className="w-full text-left px-4 py-3 border-b border-slate-100 dark:border-slate-700/50 hover:bg-blue-50 dark:hover:bg-slate-700 transition"
                        >
                          <div className="flex items-center justify-between">
                            <span className={`text-xs px-1.5 py-0.5 rounded ${h.engine === 'fofa' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' : 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300'}`}>
                              {h.engine.toUpperCase()}
                            </span>
                            <span className="text-xs text-slate-400">{h.timeWindow === 'all' ? '不限时' : `近${h.timeWindow}天`}</span>
                          </div>
                          <div className="mt-1 text-xs text-slate-600 dark:text-slate-300 truncate">
                            {h.regions.length ? h.regions.join(',') : '不限区'} | {h.providers.length ? h.providers.join(',') : '不限商'} | 端口:{h.ports.length}
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <button 
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        
        {/* Top Bar: Engine & Quick Templates */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 bg-white/40 dark:bg-slate-800/40 p-4 rounded-2xl backdrop-blur-md border border-white/50 dark:border-slate-700/50 shadow-sm">
          <EngineSwitch 
            engine={state.engine} 
            onChange={(e) => dispatch({ type: 'SET_ENGINE', payload: e })} 
          />
          
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm font-bold text-slate-500 dark:text-slate-400 py-1.5 mr-1 hidden sm:inline-block">极速预设：</span>
            <button onClick={() => dispatch({ type: 'LOAD_STATE', payload: { ...defaultState, regions: ['HK'], providers: ['DMIT'] } })} className="px-3 py-1.5 text-sm bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 rounded-full hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition font-medium">
              香港 + DMIT
            </button>
            <button onClick={() => dispatch({ type: 'LOAD_STATE', payload: { ...defaultState, regions: ['JP', 'KR'], ports: [443, 8443] } })} className="px-3 py-1.5 text-sm bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 rounded-full hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition font-medium">
              日韩 + 安全端口
            </button>
            <button onClick={() => dispatch({ type: 'LOAD_STATE', payload: { ...defaultState, signature: '403', timeWindow: '30' } })} className="px-3 py-1.5 text-sm bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 rounded-full hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition font-medium">
              盲扫 (403放宽)
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column - Form */}
          <div className="lg:col-span-7 space-y-6">
            <RegionSelector 
              selectedRegions={state.regions} 
              customRegions={state.customRegions}
              onToggle={(r) => dispatch({ type: 'TOGGLE_REGION', payload: r })}
              onToggleGroup={(rs, s) => dispatch({ type: 'TOGGLE_REGION_GROUP', payload: { regions: rs, selected: s } })}
              onCustomChange={(val) => dispatch({ type: 'SET_CUSTOM_REGIONS', payload: val })}
            />
            
            <AsnSelector 
              selectedProviders={state.providers}
              customIncludeAsns={state.customIncludeAsns}
              onToggle={(p) => dispatch({ type: 'TOGGLE_PROVIDER', payload: p })}
              onCustomChange={(val) => dispatch({ type: 'SET_CUSTOM_INCLUDE_ASNS', payload: val })}
            />

            <PortSelector 
              selectedPorts={state.ports}
              customPorts={state.customPorts}
              onToggle={(p) => dispatch({ type: 'TOGGLE_PORT', payload: p })}
              onToggleGroup={(ps, s) => dispatch({ type: 'TOGGLE_PORT_GROUP', payload: { ports: ps, selected: s } })}
              onClear={() => dispatch({ type: 'CLEAR_PORTS' })}
              onCustomChange={(val) => dispatch({ type: 'SET_CUSTOM_PORTS', payload: val })}
            />

            <AdvancedPanel 
              state={state}
              dispatch={dispatch}
            />
          </div>

          {/* Right Column - Preview */}
          <div className="lg:col-span-5">
            <div className="sticky top-24">
              <PreviewBoard state={state} />
              
              <div className="mt-6 text-sm text-slate-600 dark:text-slate-300 p-5 bg-gradient-to-br from-blue-50/80 to-indigo-50/80 dark:from-blue-900/20 dark:to-indigo-900/20 backdrop-blur-md rounded-2xl border border-blue-100 dark:border-blue-800/50 shadow-lg shadow-blue-500/5">
                <h3 className="font-bold text-blue-700 dark:text-blue-400 mb-4 flex items-center">
                  <span className="text-lg mr-2">💡</span> 专家提示与进阶玩法
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2 mt-0.5">•</span>
                    <span><strong>防漏斗机制：</strong>未选中的分类将被视为“全局不限”，帮您最大化捕获潜藏的节点。</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2 mt-0.5">•</span>
                    <span><strong>专属分享链接：</strong>所有的配置已实时压缩至浏览器地址栏，复制 URL 即可一键分享给群友。</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2 mt-0.5">•</span>
                    <span><strong>特征对比：</strong><code className="bg-blue-100 dark:bg-blue-800/50 px-1 py-0.5 rounded text-xs mx-1 font-mono">1003</code> 报错特征专门用于定位纯净的 Direct IP 节点，而 <code className="bg-blue-100 dark:bg-blue-800/50 px-1 py-0.5 rounded text-xs mx-1 font-mono">403</code> 涵盖了更广的拦截范围。</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2 mt-0.5">•</span>
                    <span><strong>双擎优劣：</strong>FOFA 在国内访问极速且对边缘节点探测灵敏；Censys 全球覆盖率更高，适合挖掘隐藏的深层节点。</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-500 mr-2 mt-0.5">•</span>
                    <span><strong>快捷键提示：</strong>在任意面板点击标题栏即可快速折叠/展开，保持视线清爽。</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

export default App;
