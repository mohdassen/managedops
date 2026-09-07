'use client';
import { useEffect, useState } from 'react';

type Evidence = { id:string; title:string; review_state:string; source_document:string; source_type:string; source_page:number|null; source_section:string|null };
type RaidItem = { id:string; kind:string; title:string; detail:string; severity:string|null; owner:string|null; status:string; due_date:string|null; evidence:Evidence[] };

export default function RAID(){
  const [items,setItems]=useState<RaidItem[]>([]);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState('');

  async function load(){
    setLoading(true); setError('');
    const res=await fetch('/api/raid',{cache:'no-store'});
    const data=await res.json().catch(()=>({}));
    if(!res.ok){setError(data.error||'Unable to load RAID register');setLoading(false);return;}
    setItems(data.items||[]); setLoading(false);
  }

  useEffect(()=>{void load()},[]);

  async function decide(id:string,status:string){
    const res=await fetch('/api/raid',{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({id,status})});
    if(!res.ok){const data=await res.json().catch(()=>({}));setError(data.error||'Update failed');return;}
    await load();
  }

  return <main>
    <a className="eyebrow" href="/">← CONTROL CENTER</a>
    <section className="panel"><p className="eyebrow">RAID MANAGEMENT</p><h1>Risks · Actions · Issues · Decisions</h1><p>AI may propose RAID items from project evidence. Nothing becomes accepted governance record until a human approves it.</p></section>
    <section className="panel">
      {loading&&<p>Loading RAID register…</p>}
      {error&&<p className="error">{error}</p>}
      <div className="table">{items.map(i=><div className="row" key={i.id}>
        <div><span className="tag">{i.kind}</span><span className="severity">{i.severity||'n/a'}</span></div>
        <div><h4>{i.title}</h4><p>{i.detail}</p>{i.evidence.length>0&&<div className="evidence">{i.evidence.map(e=><small key={e.id}>Source: {e.source_document} · {e.source_type}{e.source_page?` · page ${e.source_page}`:''} · {e.review_state}</small>)}</div>}{i.evidence.length===0&&<small className="muted">No document evidence linked yet — operational confirmation required.</small>}</div>
        <div className="decision"><b>{i.status}</b>{i.status==='proposed'?<><button onClick={()=>decide(i.id,'accepted')}>Accept</button><button className="secondary" onClick={()=>decide(i.id,'rejected')}>Reject</button></>:<button className="secondary" onClick={()=>decide(i.id,'proposed')}>Reopen Review</button>}</div>
      </div>)}</div>
    </section>
    <style jsx>{`.table{display:grid;gap:10px}.row{display:grid;grid-template-columns:140px 1fr 150px;gap:14px;align-items:start;padding:16px;background:#091522;border:1px solid #1b3047;border-radius:12px}.row h4,.row p{margin:0}.row p{color:#8195ad;margin-top:6px}.tag{font-size:11px;color:#63d5c4;border:1px solid #31506d;border-radius:20px;padding:5px 9px;width:max-content;text-transform:uppercase}.severity{display:block;margin-top:8px;font-size:11px;color:#9fb0c8}.decision{display:grid;gap:8px}.decision button{padding:8px 10px;border:0;border-radius:8px;font-weight:700;cursor:pointer}.decision .secondary{background:#13253a;color:#c8d4e3}.evidence{display:grid;gap:4px;margin-top:10px}.evidence small,.muted{color:#6f89a5}.error{color:#ff9e9e}@media(max-width:760px){.row{grid-template-columns:1fr}.row div{grid-row:auto}}`}</style>
  </main>
}
