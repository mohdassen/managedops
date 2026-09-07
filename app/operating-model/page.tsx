'use client';
import { useEffect, useState } from 'react';

type Evidence={id:string;title:string;detail:string;reviewState:string;sourceDocument:string;sourcePage:number|null;sourceSection:string|null};
type Layer={id:string;name:string;detail:string;approvedEvidence:number;evidence:Evidence[]};

export default function OperatingModel(){
 const [layers,setLayers]=useState<Layer[]>([]); const [loading,setLoading]=useState(true); const [error,setError]=useState('');
 async function load(){setLoading(true);setError('');try{const r=await fetch('/api/operating-model',{cache:'no-store'});const d=await r.json();if(!r.ok)throw new Error(d.error||'Unable to load operating model');setLayers(d.layers||[]);}catch(e){setError(e instanceof Error?e.message:'Unable to load operating model')}finally{setLoading(false)}}
 useEffect(()=>{load()},[]);
 async function setReview(id:string,state:'approved'|'needs_review'){try{const r=await fetch(`/api/requirements/${id}`,{method:'PATCH',headers:{'content-type':'application/json'},body:JSON.stringify({reviewState:state})});if(!r.ok)throw new Error('Review update failed');await load();}catch(e){setError(e instanceof Error?e.message:'Review update failed')}}
 const approved=layers.reduce((sum,l)=>sum+l.approvedEvidence,0); const total=layers.reduce((sum,l)=>sum+l.evidence.length,0);
 return <main>
 <a className="eyebrow" href="/">← CONTROL CENTER</a>
 <section className="panel"><p className="eyebrow">OPERATING MODEL</p><h1>CMA Managed Services Governance</h1><p>The governance model is derived from the winning proposal. Each layer shows the proposal evidence behind it and remains provisional until the relevant requirement is human-approved.</p></section>
 <section className="panel"><div className="summary"><div><b>{layers.length}</b><span>Governance layers</span></div><div><b>{approved}/{total}</b><span>Approved source requirements</span></div></div></section>
 {error&&<section className="panel"><p className="error">{error}</p></section>}
 <section className="panel"><h3>Governance layers</h3>{loading?<p>Loading governance evidence…</p>:<div className="table">{layers.map((layer,i)=><div className="row" key={layer.id}><b>{i+1}</b><div><h4>{layer.name}</h4><p>{layer.detail}</p><div className="evidence">{layer.evidence.length?layer.evidence.map(e=><div className="evidenceItem" key={e.id}><div><strong>{e.title}</strong><small>{e.sourceDocument}{e.sourcePage?` · Page ${e.sourcePage}`:''}{e.sourceSection?` · ${e.sourceSection}`:''}</small><span className={`state ${e.reviewState}`}>{e.reviewState.replace('_',' ')}</span></div><div className="actions"><button onClick={()=>setReview(e.id,'approved')}>Approve</button><button onClick={()=>setReview(e.id,'needs_review')}>Needs Review</button></div></div>):<small>No mapped proposal evidence yet.</small>}</div></div></div>)}</div>}</section>
 <section className="panel"><h3>Control principles</h3><p>RACI clarity · SLA/OLA alignment · periodic reporting · Steering Committee oversight · documented escalation · human-approved decisions · source traceability.</p></section>
 <style jsx>{`.summary{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.summary div,.row{padding:15px;background:#091522;border:1px solid #1b3047;border-radius:12px}.summary b{display:block;font-size:26px}.summary span{color:#8195ad}.table{display:grid;gap:10px}.row{display:grid;grid-template-columns:42px 1fr;gap:12px}.row>b{color:#63d5c4}.row h4,.row p{margin:0}.row p{color:#8195ad}.evidence{display:grid;gap:8px;margin-top:12px}.evidenceItem{display:flex;justify-content:space-between;gap:12px;align-items:center;padding:10px;background:#07111f;border-radius:9px}.evidenceItem small{display:block;color:#8195ad;margin-top:3px}.state{display:inline-block;margin-top:5px;font-size:11px;text-transform:uppercase}.approved{color:#63d5c4}.needs_review,.ai_extracted{color:#ffd27d}.actions{display:flex;gap:8px}button{padding:8px 10px;border:1px solid #31506d;border-radius:8px;background:#0d2032;color:white;cursor:pointer}.error{color:#ff8d8d}@media(max-width:700px){.evidenceItem{align-items:flex-start;flex-direction:column}.summary{grid-template-columns:1fr}}`}</style>
 </main>
}
