'use client';
import { useState } from 'react';
import type { Requirement } from '../../lib/domain';

const labels: Record<string,string> = {scope:'Scope',service:'Service',resource:'Resource',role:'Role',sla_kpi:'SLA / KPI',deliverable:'Deliverable',milestone:'Milestone',transition:'Transition',kt:'Knowledge Transfer',governance:'Governance',coverage:'Coverage',responsibility:'Responsibility',dependency:'Dependency',assumption:'Assumption',risk:'Risk'};

export default function ReviewClient({ initial }: { initial: Requirement[] }) {
  const [items,setItems]=useState(initial);
  const [saving,setSaving]=useState<string|null>(null);
  const approve=async(id:string,reviewState:'approved'|'needs_review')=>{
    setSaving(id);
    const res=await fetch(`/api/requirements/${id}`,{method:'PATCH',headers:{'content-type':'application/json'},body:JSON.stringify({reviewState})});
    if(res.ok) setItems(prev=>prev.map(r=>r.id===id?{...r,reviewState}:r));
    setSaving(null);
  };
  const approved=items.filter(i=>i.reviewState==='approved').length;
  return <>
    <div className="grid"><article><small>Extracted</small><strong>{items.length}</strong><span>Proposal baseline</span></article><article><small>Approved</small><strong>{approved}</strong><span>Human approved</span></article><article><small>Need review</small><strong>{items.length-approved}</strong><span>Pending decision</span></article></div>
    <section className="panel"><h3>Extracted requirements</h3><div className="table">{items.map(r=><div className="row" key={r.id}><div><span className="tag">{labels[r.category]}</span><h4>{r.title}</h4><p>{r.detail}</p><div className="actions"><button disabled={saving===r.id||r.reviewState==='approved'} onClick={()=>approve(r.id,'approved')}>{r.reviewState==='approved'?'Approved':'Approve'}</button><button className="secondary" disabled={saving===r.id} onClick={()=>approve(r.id,'needs_review')}>Needs Review</button></div></div><div className="source"><b>{Math.round(r.confidence*100)}%</b><span>confidence</span><small>{r.source.document}<br/>Page {r.source.page}<br/>{r.source.section}</small><em>{r.reviewState.replaceAll('_',' ')}</em></div></div>)}</div></section>
    <style jsx>{`.table{display:grid;gap:12px}.row{display:grid;grid-template-columns:1fr 190px;gap:18px;background:#091522;border:1px solid #1b3047;border-radius:14px;padding:18px}.row h4{margin:8px 0 4px}.row p{margin:0}.tag{font-size:11px;border:1px solid #31506d;border-radius:20px;padding:4px 8px;color:#63d5c4}.source{display:flex;flex-direction:column;gap:4px;border-left:1px solid #1b3047;padding-left:16px}.source b{font-size:22px}.source span,.source small{color:#8195ad}.source em{text-transform:capitalize;font-size:12px;color:#63d5c4;margin-top:8px}.actions{display:flex;gap:8px;margin-top:14px}.actions button{padding:9px 12px;border:0;border-radius:9px;font-weight:700;cursor:pointer}.actions .secondary{background:#13243a;color:#d7e3f2;border:1px solid #29415d}@media(max-width:760px){.row{grid-template-columns:1fr}.source{border-left:0;border-top:1px solid #1b3047;padding:12px 0 0}}`}</style>
  </>;
}
