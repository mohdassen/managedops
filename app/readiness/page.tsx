'use client';
import { useEffect, useState } from 'react';

type Evidence={id:string;title:string;reviewState:string;sourceDocument:string;sourceType:string;sourcePage:number|null};
type Item={id:string;factor:string;status:'ready'|'partial'|'blocked'|'unknown';critical:boolean;evidence:Evidence[]};
type Payload={score:number;decision:string;criticalGaps:Item[];blocked:Item[];unknown:Item[];evidenceSummary:{approved:number;pending:number};items:Item[];source:string};

const labels:Record<string,string>={people:'People',access:'Access',documentation:'Documentation',kt:'Knowledge Transfer',monitoring:'Monitoring',sop:'SOP / Runbooks',sla:'SLA / OLA',backup_dr:'Backup / DR',risk:'Risks',dependency:'Dependencies'};

export default function Readiness(){
 const [data,setData]=useState<Payload|null>(null); const [busy,setBusy]=useState(''); const [error,setError]=useState('');
 async function load(){setError('');const r=await fetch('/api/readiness',{cache:'no-store'});if(!r.ok){setError('Unable to load readiness data');return;}setData(await r.json());}
 useEffect(()=>{void load()},[]);
 async function setStatus(id:string,status:Item['status']){setBusy(id);setError('');const r=await fetch('/api/readiness',{method:'PATCH',headers:{'content-type':'application/json'},body:JSON.stringify({id,status})});setBusy('');if(!r.ok){const body=await r.json().catch(()=>({}));setError(body.error||'Update failed');return;}await load();}
 return <main>
 <a className="eyebrow" href="/">← CONTROL CENTER</a>
 <section className="panel"><p className="eyebrow">SERVICE READINESS ENGINE</p><h1>CMA Go-Live Readiness</h1><p>Readiness is evidence-based. Proposal commitments define required controls; explicit human actions determine operational status. AI-extracted evidence is never treated as approval.</p></section>
 {error&&<section className="panel"><b>{error}</b></section>}
 <section className="grid"><article><small>Current decision</small><strong>{data?.decision||'LOADING'}</strong><span>{data?`${data.score}% readiness score`:'Loading from Neon...'}</span></article><article><small>Critical gaps</small><strong>{data?.criticalGaps.length??'—'}</strong><span>{data?.criticalGaps.map(x=>labels[x.factor]||x.factor).join(' · ')||'None'}</span></article><article><small>Evidence approvals</small><strong>{data?`${data.evidenceSummary.approved}/${data.evidenceSummary.approved+data.evidenceSummary.pending}`:'—'}</strong><span>Human-approved requirement evidence</span></article></section>
 <section className="panel"><h3>Readiness factors</h3><div className="table">{data?.items.map(item=><div className="row" key={item.id}><div><b>{labels[item.factor]||item.factor}</b><small>{item.critical?'Critical':'Standard'}</small></div><div><span className={`status ${item.status}`}>{item.status.toUpperCase()}</span><div className="actions">{(['ready','partial','blocked','unknown'] as const).map(s=><button disabled={busy===item.id||item.status===s} onClick={()=>void setStatus(item.id,s)} key={s}>{s}</button>)}</div></div><div>{item.evidence.length?item.evidence.map(e=><div className="evidence" key={e.id}><b>{e.title}</b><small>{e.sourceDocument} · {e.sourceType}{e.sourcePage?` · p.${e.sourcePage}`:''} · {e.reviewState}</small></div>):<small>No linked evidence — operational confirmation required</small>}</div></div>)||<p>Loading...</p>}</div></section>
 <section className="panel"><h3>Decision rule</h3><p><b>GO</b>: score ≥85% with no critical gap. <b>CONDITIONAL GO</b>: score 70–84% with no critical gap. <b>NO-GO</b>: any critical gap or score below 70%. Status changes are explicit human actions and evidence review remains separate.</p></section>
 <style jsx>{`.table{display:grid;gap:10px}.row{display:grid;grid-template-columns:1.1fr 1.4fr 2fr;gap:14px;padding:14px;background:#091522;border:1px solid #1b3047;border-radius:10px;align-items:start}.row>div{display:grid;gap:7px}.row small{color:#9fb0c8}.actions{display:flex;gap:5px;flex-wrap:wrap}.actions button{font-size:11px;padding:6px 8px;border-radius:7px;border:1px solid #29415d;background:#0d1b2a;color:#c9d7e6;cursor:pointer}.actions button:disabled{opacity:.45;cursor:default}.status{font-weight:800}.ready{color:#74d49b}.partial{color:#f0c36b}.blocked{color:#ff7b7b}.unknown{color:#9fb0c8}.evidence{padding:8px;border-left:2px solid #29415d}.evidence b{font-size:12px}`}</style>
 </main>}
