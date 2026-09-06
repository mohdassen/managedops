const cards = [
  ['Overall Readiness','Baseline Pending','Proposal ingestion'],
  ['Staffing','To Be Confirmed','Resource plan'],
  ['Transition','To Be Confirmed','Mobilization & handover'],
  ['Knowledge Transfer','To Be Confirmed','KT evidence'],
  ['Service Readiness','To Be Confirmed','Go-live gates'],
  ['Critical Gaps','0 confirmed','AI review queue']
];
const modules = ['Proposal Intelligence','Project Baseline','Scope & Deliverables','Resource Plan','Recruitment','Transition & KT','Operating Model','RAID','Service Readiness','Executive Dashboard'];
export default function Home(){return <main>
  <header><div><p className="eyebrow">CMA MANAGED SERVICES</p><h1>ManagedOps Control Center</h1><p>Managed Services Readiness Intelligence</p></div><span className="badge">MVP · CMA</span></header>
  <section className="hero"><div><p className="eyebrow">PRIMARY QUESTION</p><h2>Are we ready to take over this service safely?</h2><p>Build the project baseline from the winning proposal, trace every requirement to its source, and turn evidence into a defensible go-live decision.</p></div><a href="/ingest">Create Project from Documents →</a></section>
  <section className="grid">{cards.map(([a,b,c])=><article key={a}><small>{a}</small><strong>{b}</strong><span>{c}</span></article>)}</section>
  <section className="panel"><h3>Delivery flow</h3><div className="flow">{modules.map((m,i)=><div key={m}><b>{i+1}</b><span>{m}</span></div>)}</div></section>
  <section className="panel"><h3>AI review policy</h3><p>Upload / Connect → AI Extract → Review Changes → Approve → Dashboard. AI never silently converts proposal language into contractual facts. Missing data stays <b>To Be Confirmed</b>.</p></section>
</main>}
