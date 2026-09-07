'use client';
import { useEffect, useMemo, useState } from 'react';

type Position = {
  id: string;
  role_name: string;
  required_quantity: number;
  filled_quantity: number;
  status: string;
  requirements?: { source?: string };
};

type Candidate = {
  id: string;
  full_name: string;
  role_name?: string;
  score?: number;
  status: string;
  availability?: string;
};

export default function Recruitment(){
  const [positions,setPositions]=useState<Position[]>([]);
  const [candidates,setCandidates]=useState<Candidate[]>([]);
  const [error,setError]=useState('');
  const [saving,setSaving]=useState('');

  async function load(){
    const res=await fetch('/api/recruitment',{cache:'no-store'});
    const data=await res.json();
    if(!res.ok){setError(data.error||'Unable to load recruitment data');return;}
    setPositions(data.positions||[]);setCandidates(data.candidates||[]);setError('');
  }

  useEffect(()=>{void load();},[]);

  async function updateStatus(candidateId:string,status:string){
    setSaving(candidateId);
    const res=await fetch('/api/recruitment',{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({candidateId,status})});
    const data=await res.json();
    setSaving('');
    if(!res.ok){setError(data.error||'Unable to update candidate');return;}
    await load();
  }

  const summary=useMemo(()=>({
    required:positions.reduce((n,p)=>n+Number(p.required_quantity||0),0),
    filled:positions.reduce((n,p)=>n+Number(p.filled_quantity||0),0),
    shortlisted:candidates.filter(c=>c.status==='shortlisted').length
  }),[positions,candidates]);

  return <main>
    <a className="eyebrow" href="/">← CONTROL CENTER</a>
    <section className="panel"><p className="eyebrow">RESOURCE & RECRUITMENT</p><h1>CMA Staffing Control</h1><p>Positions are generated from the proposal baseline. Candidate decisions remain human-controlled and separate from proposal facts.</p></section>
    <section className="grid">
      <article><small>Total required</small><strong>{summary.required}</strong><span>Proposal baseline</span></article>
      <article><small>Filled</small><strong>{summary.filled}</strong><span>Approved hires only</span></article>
      <article><small>Shortlisted</small><strong>{summary.shortlisted}</strong><span>Human shortlist</span></article>
    </section>
    {error&&<section className="panel"><p>{error}</p></section>}
    <section className="panel"><h3>Resource plan</h3><div className="table">{positions.map(p=><div className="row" key={p.id}><div><h4>{p.role_name}</h4><p>{p.requirements?.source||'Proposal baseline'}</p></div><b>{p.required_quantity} required</b><span>{p.filled_quantity} filled</span><span>{p.status.replaceAll('_',' ')}</span></div>)}</div></section>
    <section className="panel"><h3>Infrastructure Lead shortlist</h3><div className="table">{candidates.map(c=><div className="row candidate" key={c.id}><div><h4>{c.full_name}</h4><p>{c.role_name||'Unassigned role'}</p></div><b>{c.score?`${c.score}/10`:'—'}</b><span>{c.status.replaceAll('_',' ')}</span><div className="actions"><button disabled={saving===c.id||c.status==='technical_interview'} onClick={()=>updateStatus(c.id,'technical_interview')}>Approve Technical Interview</button><button disabled={saving===c.id||c.status==='rejected'} className="secondary" onClick={()=>updateStatus(c.id,'rejected')}>Reject</button></div></div>)}</div></section>
    <style jsx>{`.table{display:grid;gap:10px}.row{display:grid;grid-template-columns:2fr .8fr .7fr 1fr;gap:14px;align-items:center;padding:16px;background:#091522;border:1px solid #1b3047;border-radius:12px}.row h4,.row p{margin:0}.row p,.row span{color:#8195ad;font-size:13px}.actions{display:flex;gap:8px;flex-wrap:wrap}.candidate{grid-template-columns:1.6fr .5fr .8fr 2fr}button{padding:9px 11px;border:0;border-radius:8px;font-weight:700;cursor:pointer}.secondary{background:#17283b;color:#d4dfeb}button:disabled{opacity:.5;cursor:not-allowed}@media(max-width:900px){.row,.candidate{grid-template-columns:1fr 1fr}.row div:first-child{grid-column:1/-1}.actions{grid-column:1/-1}}`}</style>
  </main>
}
