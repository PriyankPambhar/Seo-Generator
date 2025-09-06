import React, { useState } from 'react';
export default function Settings({ apiKey, setApiKey }){
  const [key, setKey] = useState(apiKey || '');
  const save = ()=>{ setApiKey(key); alert('API key saved to localStorage (kept private on this device)'); };
  return (<div className='bg-white dark:bg-slate-800 p-6 rounded shadow'><h2 className='text-2xl mb-4'>Settings</h2><label className='block mb-2'>Gemini API Key (will be stored locally)</label><input className='w-full p-2 border rounded mb-3' value={key} onChange={e=>setKey(e.target.value)} /><div className='flex gap-2'><button className='bg-red-600 text-white px-4 py-2 rounded' onClick={save}>Save</button></div></div>);
}
