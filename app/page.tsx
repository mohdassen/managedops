'use client';
import {useEffect,useState} from 'react';

type Dashboard={requirements:{total:number;approved:number;pending:number};staffing:{required:number;filled:number;gap:number;shortlisted:number};readiness:{score:number;decision:string;criticalGaps:Array<{factor:string}>;totalFactors:number};raid:{open:number;critical:number;total:number};generatedAt:string};
const modules = ['Proposal Intelligence','Project Baseline','Scope & Deliverables','Resource Plan','Recruitment','Transition & KT','Operating Model','RAID','Service Readiness','Executive Dashboard'];
export default function Home(){
 const [d,setD]=useState<Dashboard|null>(null);const [error,setError]=useState('');
 useEffect(()=>{fetch('/api/dashboard',{cache:'no-store'}).then(async r=>{if(!r.ok)throw new Error('Dashboard unavailable');setD(await r.json())}).catch(e=>setError(e.message))},[]);
 const cards=[
  ['Overall Readiness',d?`${d.readiness.score}% · ${d.readiness.decision}`:'Loading...','Evidence-based go-live decision'],
  ['Staffing',d?`${d.staffing.filled}/${d.staffing.required} filled`:'Loading...',d?`${d.staffing.gap} gap · ${d.staffing.shortlisted} shortlisted`:'Resource plan'],
  ['Requirements Review',d?`${d.requirements.approved}/${d.requirements.total} approved`:'Loading...',d?`${d.requirements.pending} pending human review`:'Human approval required'],
  ['Critical Readiness Gaps',d?String(d.readiness.criticalGaps.length):'—',d?.readiness.criticalGaps.map(g=>g.factor).join(' · ')||'No critical gaps'],
  ['RAID',d?`${d.raid.open} open`:'Loading...',d?`${d.raid.critical} critical · ${d.raid.total} total`:'Operational risk control'],
  ['Source of Truth','TP-CMA(1).pdf','Proposal commitments, not contract obligations']
 ];
 return <main>
  <header><div><p className="eyebrow">CMA MANAGED SERVICES</p><h1>ManagedOps Control Center</h1><p>Managed Services Readiness Intelligence</p></div><span className="badge">MVP · CMA</span></header>
  <section className="hero"><div><p className="eyebrow">PRIMARY QUESTION</p><h2>Are we ready to take over this service safely?</h2><p>The dashboard now reads live project state from Neon. AI extraction remains evidence, while approvals, readiness statuses and go-live control remain human governed.</p>{error&&<p><b>{error}</b></p>}</div><div className="actions"><a href="/review">Review AI Extraction →</a><a className="secondary" href="/ingest">Add Documents</a></div></section>
  <section className="grid">{cards.map(([a,b,c])=><article key={a}><small>{a}</small><strong>{b}</strong><span>{c}</span></article>)}</section>
  <section className="panel"><h3>Workspaces</h3><div className="quick"><a href="/review">Proposal Intelligence</a><a href="/recruitment">Resource & Recruitment</a><a href="/transition">Transition & KT</a><a href="/operating-model">Operating Model</a><a href="/raid">RAID</a><a href="/readiness">Service Readiness</a></div></section>
  <section className="panel"><h3>Delivery flow</h3><div className="flow">{modules.map((m,i)=><div key={m}><b>{i+1}</b><span>{m}</span></div>)}</div></section>
  <section className="panel"><h3>AI review policy</h3><p>Upload / Connect → AI Extract → Review Changes → Approve → Dashboard. Missing data stays <b>To Be Confirmed</b>; AI never silently converts proposal language into contractual facts or a go-live approval.</p></section>
  <style jsx>{`.actions,.quick{display:flex;gap:10px;flex-wrap:wrap}.actions a{background:#eef4ff;color:#07111f;text-decoration:none;font-weight:700;padding:14px 18px;border-radius:12px}.actions .secondary{background:transparent;color:#eef4ff;border:1px solid #29415d}.quick a{color:#eef4ff;text-decoration:none;background:#091522;border:1px solid #29415d;padding:12px 14px;border-radius:10px}`}</style>
 </main>}
