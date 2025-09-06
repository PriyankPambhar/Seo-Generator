import React, { useState } from 'react';
import DOMPurify from 'dompurify';
import Papa from 'papaparse';

export default function Generate({ apiKey }){
  const [title,setTitle]=useState('');
  const [content,setContent]=useState('');
  const [numTags,setNumTags]=useState(10);
  const [keywords,setKeywords]=useState([]);
  const [meta,setMeta]=useState('');
  const [tags,setTags]=useState([]);
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState('');

  const callGemini = async (userQuery, systemPrompt='') => {
    if(!apiKey) throw new Error('Set Gemini API key in Settings');
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
    const payload = { contents:[{ parts:[{ text: userQuery }] }], systemInstruction:{ parts:[{ text: systemPrompt }] }, generationConfig:{ responseMimeType: "application/json" } };
    const res = await fetch(apiUrl, { method:'POST', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify(payload) });
    if(!res.ok) throw new Error('API error: '+res.statusText);
    const data = await res.json();
    return data;
  };

  const handleGenerate = async ()=>{
    if(!title.trim()||!content.trim()){ setError('Provide title and content'); return; }
    setLoading(true); setError('');
    try{
      const system = 'You are an expert SEO strategist. Return a valid JSON object with "keywords","metaDescription","tags".';
      const userQuery = `Title: "${title}"\nContent: "${content}"\nTags: ${numTags}`;
      const data = await callGemini(userQuery, system);
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      const clean = text.replace(/```json|```/g,'').trim();
      const parsed = JSON.parse(clean);
      setKeywords(parsed.keywords||[]);
      setMeta(parsed.metaDescription||'');
      setTags(parsed.tags||[]);
      // save to localStorage history
      const history = JSON.parse(localStorage.getItem('seo_history')||'[]');
      history.unshift({ id: Date.now(), title, keywords: parsed.keywords||[], meta: parsed.metaDescription||'', tags: parsed.tags||[] });
      localStorage.setItem('seo_history', JSON.stringify(history.slice(0,100)));
    }catch(e){ setError(e.message||'Error'); } finally { setLoading(false); }
  };

  const copy = async (text)=>{ try{ await navigator.clipboard.writeText(text); alert('Copied'); }catch(e){ alert('Copy failed'); } };

  const exportCSV = ()=>{
    const data = [{ title, keywords: keywords.join('|'), meta, tags: tags.join('|') }];
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = (title||'seo') + '.csv'; a.click(); URL.revokeObjectURL(url);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white dark:bg-slate-800 p-6 rounded shadow">
        <h3 className="text-xl font-semibold mb-4">Input</h3>
        <input className="w-full p-2 border rounded mb-3" placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} />
        <textarea className="w-full p-2 border rounded mb-3" rows={8} placeholder="Content" value={content} onChange={e=>setContent(e.target.value)}></textarea>
        <div className="flex gap-2">
          <input type="number" className="p-2 border rounded w-28" value={numTags} onChange={e=>setNumTags(parseInt(e.target.value)||10)} />
          <button className="bg-red-600 text-white px-4 py-2 rounded" onClick={handleGenerate} disabled={loading}>{loading? 'Generating...':'Generate'}</button>
          <button className="px-3 py-2 border rounded" onClick={exportCSV}>Export CSV</button>
        </div>
        {error && <div className="text-red-500 mt-3">{error}</div>}
      </div>
      <div className="bg-white dark:bg-slate-800 p-6 rounded shadow">
        <h3 className="text-xl font-semibold mb-4">Results</h3>
        <div className="mb-3">
          <h4 className="font-medium">Keywords <button className="ml-2 text-sm" onClick={()=>copy(keywords.join(', '))}>Copy</button></h4>
          <div className="mt-2 flex flex-wrap gap-2">{keywords.map((k,i)=>(<span key={i} className="bg-red-100 text-red-700 px-3 py-1 rounded-full">{k}</span>))}</div>
        </div>
        <div className="mb-3">
          <h4 className="font-medium">Meta <button className="ml-2 text-sm" onClick={()=>copy(meta)}>Copy</button></h4>
          <div className="mt-2 prose" dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(meta)}}></div>
        </div>
        <div>
          <h4 className="font-medium">Tags <button className="ml-2 text-sm" onClick={()=>copy(tags.join(', '))}>Copy</button></h4>
          <div className="mt-2 text-sm text-slate-600">{tags.join(', ')}</div>
        </div>
      </div>
    </div>
  );
}
