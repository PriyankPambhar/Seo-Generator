import React, { useState } from 'react';
export default function Suggestions({ apiKey }){
  const [desc,setDesc]=useState(''); const [res,setRes]=useState(''); const [loading,setLoading]=useState(false);
  const run=async ()=>{
    if(!apiKey){ alert('Set API key in Settings'); return; }
    setLoading(true);
    try{
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
      const payload = { contents:[{ parts:[{ text: `Business: "${desc}"` }] }], systemInstruction:{ parts:[{ text:'You are a world-class SEO consultant. Provide actionable SEO suggestions.' }] } };
      const r = await fetch(apiUrl,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
      if(!r.ok) throw new Error('API error');
      const data = await r.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      setRes(text);
    }catch(e){ alert(e.message); } finally { setLoading(false); }
  };
  return (<div className='grid grid-cols-1 lg:grid-cols-2 gap-6'><div className='bg-white dark:bg-slate-800 p-6 rounded shadow'><h3 className='text-xl mb-4'>Get Suggestions</h3><textarea className='w-full p-2 border rounded mb-3' rows={6} value={desc} onChange={e=>setDesc(e.target.value)}></textarea><button className='bg-red-600 text-white px-4 py-2 rounded' onClick={run} disabled={loading}>{loading?'Getting...':'Get Suggestions'}</button></div><div className='bg-white dark:bg-slate-800 p-6 rounded shadow'><h3 className='text-xl mb-4'>Suggestions</h3>{res? <div className='prose' dangerouslySetInnerHTML={{__html: res.replace(/\n/g,'<br/>')}}/> : <div className='text-slate-400'>Suggestions appear here</div>}</div></div>);
}
