import React, { useState } from 'react';
export default function Analyze({ apiKey }){
  const [q,setQ]=useState(''); const [res,setRes]=useState(null); const [loading,setLoading]=useState(false);
  const run=async ()=>{
    if(!apiKey){ alert('Set API key in Settings'); return; }
    setLoading(true);
    try{
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
      const system = 'You are an SEO Tag Analyzer. Return a JSON object: {"tags":[{"tag":"","volume":"Low/Medium/High","competition":"Low/Medium/High"}]}.';
      const payload = { contents:[{ parts:[{ text: `Analyze topic: "${q}" and provide 10 tags.` }] }], systemInstruction:{ parts:[{ text: system }] }, generationConfig:{ responseMimeType: 'application/json' } };
      const r = await fetch(apiUrl,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
      if(!r.ok) throw new Error('API error');
      const data = await r.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      const clean = text.replace(/```json|```/g,'').trim();
      setRes(JSON.parse(clean));
    }catch(e){ alert(e.message); } finally { setLoading(false); }
  };
  return (<div className='grid grid-cols-1 lg:grid-cols-2 gap-6'><div className='bg-white dark:bg-slate-800 p-6 rounded shadow'><h3 className='text-xl mb-4'>Analyze Tags</h3><input className='w-full p-2 border rounded mb-3' value={q} onChange={e=>setQ(e.target.value)} placeholder='e.g., ai in marketing' /><button className='bg-red-600 text-white px-4 py-2 rounded' onClick={run} disabled={loading}>{loading?'Analyzing...':'Analyze'}</button></div><div className='bg-white dark:bg-slate-800 p-6 rounded shadow'><h3 className='text-xl mb-4'>Results</h3>{res?.tags? <table className='w-full text-left'><thead><tr><th>Tag</th><th>Volume</th><th>Competition</th></tr></thead><tbody>{res.tags.map((t,i)=>(<tr key={i}><td>{t.tag}</td><td>{t.volume}</td><td>{t.competition}</td></tr>))}</tbody></table>: <div className='text-slate-400'>Results appear here</div>}</div></div>);
}
