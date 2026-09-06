'use client';
const factors=[
 ['People','Partial','Critical'],['Access','Unknown','Critical'],['Documentation','Partial','Standard'],['Knowledge Transfer','Unknown','Critical'],['Monitoring','Partial','Standard'],['SOP / Runbooks','Unknown','Standard'],['SLA / OLA','Partial','Critical'],['Backup / DR','Unknown','Critical']
];
export default function Readiness(){return <main>
<a className="eyebrow" href="/">← CONTROL CENTER</a>
<section className="panel"><p className="eyebrow">SERVICE READINESS ENGINE</p><h1>CMA Go-Live Readiness</h1><p>Readiness is evidence-based. Proposal commitments define required controls; operational evidence determines whether a service is safe to take over.</p></section>
<section className="grid"><article><small>Current decision</small><strong>INSUFFICIENT EVIDENCE</strong><span>No defensible Go/No-Go yet</span></article><article><small>Critical unknowns</small><strong>3</strong><span>Access · KT · Backup/DR</span></article><article><small>Evidence standard</small><strong>Human approved</strong><span>No AI-only go-live decision</span></article></section>
<section className="panel"><h3>Readiness factors</h3><div className="table">{factors.map(([name,status,critical])=><div className="row" key={name}><b>{name}</b><span>{status}</span><small>{critical}</small></div>)}</div></section>
<section className="panel"><h3>Decision rule</h3><p><b>GO</b>: sufficient approved evidence and no critical blocker. <b>CONDITIONAL GO</b>: threshold met with controlled non-critical gaps. <b>NO-GO</b>: critical blocker exists. <b>INSUFFICIENT EVIDENCE</b>: evidence is not yet enough to judge safely.</p></section>
<style jsx>{`.table{display:grid;gap:9px}.row{display:grid;grid-template-columns:2fr 1fr 1fr;gap:10px;padding:14px;background:#091522;border:1px solid #1b3047;border-radius:10px}.row span,.row small{color:#9fb0c8}`}</style>
</main>}
