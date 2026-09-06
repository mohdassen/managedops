'use client';
const gates=[
 {name:'Handover plan',status:'Required',source:'TP-CMA · transition activities'},
 {name:'RACI matrix',status:'Required',source:'TP-CMA · transition activities'},
 {name:'SLA/KPI monitoring mechanism',status:'Required',source:'TP-CMA · transition activities'},
 {name:'Knowledge transfer plan',status:'Required',source:'TP-CMA · KT commitment'},
 {name:'Team readiness',status:'Partial',source:'Proposal resource plan'},
 {name:'Privileged access',status:'Unknown',source:'Evidence not available'},
 {name:'Operational documentation',status:'Partial',source:'Proposal commitment only'},
 {name:'Backup / DR evidence',status:'Unknown',source:'Evidence not available'}
];
export default function Transition(){return <main>
<a className="eyebrow" href="/">← CONTROL CENTER</a>
<section className="panel"><p className="eyebrow">TRANSITION & KNOWLEDGE TRANSFER</p><h1>Go-Live Evidence Gates</h1><p>Proposal commitments define what must exist. Readiness stays unproven until evidence is attached and reviewed.</p></section>
<section className="panel"><div className="table">{gates.map(g=><div className="row" key={g.name}><div><h4>{g.name}</h4><small>{g.source}</small></div><span className={`status ${g.status.toLowerCase()}`}>{g.status}</span></div>)}</div></section>
<section className="panel"><h3>Current assessment</h3><p><b>INSUFFICIENT EVIDENCE</b> — we have proposal requirements, but not enough operational evidence yet to issue a defensible Go / Conditional Go / No-Go decision.</p></section>
<style jsx>{`.table{display:grid;gap:10px}.row{display:flex;justify-content:space-between;align-items:center;padding:16px;background:#091522;border:1px solid #1b3047;border-radius:12px}.row h4{margin:0 0 5px}.row small{color:#8195ad}.status{border:1px solid #31506d;border-radius:20px;padding:6px 10px;font-size:12px}.partial{color:#ffd27d}.unknown{color:#9fb0c8}.required{color:#63d5c4}`}</style>
</main>}
