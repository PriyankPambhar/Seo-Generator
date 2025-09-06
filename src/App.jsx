import React, { useState, useEffect } from 'react';
import Generate from './tools/Generate.jsx';
import Convert from './tools/Convert.jsx';
import Analyze from './tools/Analyze.jsx';
import Suggestions from './tools/Suggestions.jsx';
import History from './tools/History.jsx';
import Settings from './tools/Settings.jsx';
import logoLight from './assets/logo-light.png';
import logoDark from './assets/logo-dark.png';
import { Sun, Moon } from 'lucide-react';

export default function App(){
  const [active, setActive] = useState('generate');
  const [theme, setTheme] = useState(localStorage.getItem('seo_theme') || 'light');
  const [apiKey, setApiKey] = useState(localStorage.getItem('seo_gemini_key') || '');

  useEffect(()=>{ document.documentElement.classList.toggle('dark', theme==='dark'); localStorage.setItem('seo_theme', theme); }, [theme]);
  useEffect(()=>{ localStorage.setItem('seo_gemini_key', apiKey); }, [apiKey]);

  const logo = theme === 'dark' ? logoDark : logoLight;

  return (
    <div className={`min-h-screen flex ${theme==='dark' ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-900'}`}>
      <aside className="w-72 p-4 bg-slate-800 text-white hidden md:block">
        <div className="flex items-center gap-3 mb-6">
          <img src={logo} alt="logo" className="h-20" />
          <div className="text-xl font-bold"></div>
        </div>
        <nav className="space-y-2">
          <button className={`w-full text-left px-3 py-2 rounded ${active==='generate'?'bg-red-600':''}`} onClick={()=>setActive('generate')}>Generate</button>
          <button className={`w-full text-left px-3 py-2 rounded ${active==='convert'?'bg-red-600':''}`} onClick={()=>setActive('convert')}>Convert</button>
          <button className={`w-full text-left px-3 py-2 rounded ${active==='analyze'?'bg-red-600':''}`} onClick={()=>setActive('analyze')}>Analyze</button>
          <button className={`w-full text-left px-3 py-2 rounded ${active==='suggest'?'bg-red-600':''}`} onClick={()=>setActive('suggest')}>Suggestions</button>
          <button className={`w-full text-left px-3 py-2 rounded ${active==='history'?'bg-red-600':''}`} onClick={()=>setActive('history')}>History</button>
          <button className={`w-full text-left px-3 py-2 rounded ${active==='settings'?'bg-red-600':''}`} onClick={()=>setActive('settings')}>Settings</button>
        </nav>
        <div className="mt-6">
          <button className="w-full bg-slate-700 hover:bg-slate-600 py-2 rounded flex items-center justify-center gap-2" onClick={()=>setTheme(t=>t==='light'?'dark':'light')}>
            {theme==='light' ? <Moon size={16}/> : <Sun size={16}/>} Toggle Theme
          </button>
        </div>
      </aside>

      <main className="flex-1 p-6">
        <header className="flex items-center justify-between mb-6 md:hidden">
          <div className="flex items-center gap-3">
            <img src={logo} alt="logo" className="h-10" />
            <div className="text-lg font-bold">SEO GEN</div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={()=>setTheme(t=>t==='light'?'dark':'light')} className="p-2 rounded bg-slate-200 dark:bg-slate-700">
              {theme==='light' ? <Moon size={16}/> : <Sun size={16}/>}
            </button>
          </div>
        </header>

        <div className="max-w-6xl mx-auto">
          {active==='generate' && <Generate apiKey={apiKey} />}
          {active==='convert' && <Convert apiKey={apiKey} />}
          {active==='analyze' && <Analyze apiKey={apiKey} />}
          {active==='suggest' && <Suggestions apiKey={apiKey} />}
          {active==='history' && <History />}
          {active==='settings' && <Settings apiKey={apiKey} setApiKey={setApiKey} />}
        </div>
      </main>
    </div>
  );
}
