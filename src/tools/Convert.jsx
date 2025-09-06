import React, { useState } from 'react';
export default function Convert({ apiKey }){
  const [source,setSource]=useState('');
  const [result,setResult]=useState('');
  const [loading,setLoading]=useState(false);
  const run=async ()=>{
    if(!apiKey){ alert('Set API key in Settings'); return; }
    setLoading(true);
    try{
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
      const payload = { contents:[{ parts:[{ text: `Convert the text to a professional tone. Content: "${source}"` }] }], systemInstruction:{ parts:[{ text:'You are an expert content strategist.' }] } };
      const res = await fetch(apiUrl, { method:'POST', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify(payload) });
      if(!res.ok) throw new Error('API error');
      const data = await res.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      setResult(text);
    }catch(e){ alert(e.message); } finally { setLoading(false); }
  };
  return (<div className='grid grid-cols-1 lg:grid-cols-2 gap-6'><div className='bg-white dark:bg-slate-800 p-6 rounded shadow'><h3 className='text-xl mb-4'>Convert</h3><textarea className='w-full p-2 border rounded mb-3' rows={10} value={source} onChange={e=>setSource(e.target.value)}></textarea><button className='bg-red-600 text-white px-4 py-2 rounded' onClick={run} disabled={loading}>{loading?'Converting...':'Convert'}</button></div><div className='bg-white dark:bg-slate-800 p-6 rounded shadow'><h3 className='text-xl mb-4'>Result</h3>{result? <div className='prose' dangerouslySetInnerHTML={{__html: result.replace(/\n/g,'<br/>')}} /> : <div className='text-slate-400'>Results appear here</div>}</div></div>);
}
