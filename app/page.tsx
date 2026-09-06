import { cmaRequirements } from '@/data/cma-baseline';

const cards = [
  ['Overall Readiness','Baseline Building','Proposal intelligence'],
  ['Staffing','2 key roles extracted','Resource plan'],
  ['Transition','2 requirements extracted','Mobilization & handover'],
  ['Knowledge Transfer','2 requirements extracted','KT evidence'],
  ['Service Readiness','Not assessed','Go-live gates'],
  ['Review Queue',`${cmaRequirements.length} items`,'Human approval required']
];
const modules = ['Proposal Intelligence','Project Baseline','Scope & Deliverables','Resource Plan','Recruitment','Transition & KT','Operating Model','RAID','Service Readiness','Executive Dashboard'];
export default function Home(){return <main>
  <header><div><p className="eyebrow">CMA MANAGED SERVICES</p><h1>ManagedOps Control Center</h1><p>Managed Services Readiness Intelligence</p></div><span className="badge">MVP · CMA</span></header>
  <section className="hero"><div><p className="eyebrow">PRIMARY QUESTION</p><h2>Are we ready to take over this service safely?</h2><p>The CMA winning proposal is now seeded as the current source of truth. Every extracted requirement remains traceable and requires review before approval.</p></div><div className="actions"><a href="/review">Review AI Extraction →</a><a className="secondary" href="/ingest">Add Documents</a></div></section>
  <section className="grid">{cards.map(([a,b,c])=><article key={a}><small>{a}</small><strong>{b}</strong><span>{c}</span></article>)}</section>
  <section className="panel"><h3>Delivery flow</h3><div className="flow">{modules.map((m,i)=><div key={m}><b>{i+1}</b><span>{m}</span></div>)}</div></section>
  <section className="panel"><h3>Current CMA source</h3><p><b>TP-CMA(1).pdf</b> · Winning Technical Proposal · Proposal commitments are not treated as contractual obligations until a contract is added and reviewed.</p></section>
  <section className="panel"><h3>AI review policy</h3><p>Upload / Connect → AI Extract → Review Changes → Approve → Dashboard. AI never silently converts proposal language into contractual facts. Missing data stays <b>To Be Confirmed</b>.</p></section>
  <style jsx>{`.actions{display:flex;gap:10px;flex-wrap:wrap}.actions a{background:#eef4ff;color:#07111f;text-decoration:none;font-weight:700;padding:14px 18px;border-radius:12px}.actions .secondary{background:transparent;color:#eef4ff;border:1px solid #29415d}`}</style>
</main>}
