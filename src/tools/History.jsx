import React, { useEffect, useState } from 'react';
export default function History(){
  const [items,setItems]=useState([]);
  useEffect(()=>{ setItems(JSON.parse(localStorage.getItem('seo_history')||'[]')); },[]);
  const clear=()=>{ localStorage.removeItem('seo_history'); setItems([]); };
  return (<div><div className='flex justify-between items-center mb-4'><h2 className='text-2xl'>History</h2><button className='px-3 py-2 bg-red-600 text-white rounded' onClick={clear}>Clear</button></div>{items.length===0? <div className='text-slate-400'>No history yet</div> : items.map(it=>(<div key={it.id} className='p-3 bg-white dark:bg-slate-800 rounded shadow mb-3'><div className='font-medium'>{it.title}</div><div className='text-sm text-slate-500'>{new Date(it.id).toLocaleString()}</div><div className='mt-2'><strong>Keywords:</strong> {it.keywords.join(', ')}</div></div>))}</div>);
}
