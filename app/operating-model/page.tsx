const governance=[
 ['Steering Committee','Strategic approvals, resource allocation, blockers'],
 ['Service Delivery Management','Overall managed-services coordination and reporting'],
 ['Operations / EOC','24x7 monitoring, event and incident coordination'],
 ['L1 Service Desk','SPOC, incidents and service requests'],
 ['L2/L3 Technical Teams','Escalations, root cause analysis, platform operations'],
 ['Knowledge Management','Documentation, KB and knowledge transfer'],
 ['Continuous Improvement','Automation, process optimization and service improvement']
];
export default function OperatingModel(){return <main>
<a className="eyebrow" href="/">← CONTROL CENTER</a>
<section className="panel"><p className="eyebrow">OPERATING MODEL</p><h1>CMA Managed Services Governance</h1><p>This MVP baseline is derived from the winning proposal. Final roles, meeting cadence and accountability must be validated against the signed contract and client approvals when available.</p></section>
<section className="panel"><h3>Governance layers</h3><div className="table">{governance.map(([name,detail],i)=><div className="row" key={name}><b>{i+1}</b><div><h4>{name}</h4><p>{detail}</p></div></div>)}</div></section>
<section className="panel"><h3>Control principles</h3><p>RACI clarity · SLA/OLA alignment · periodic reporting · Steering Committee oversight · documented escalation · human-approved decisions · traceability back to proposal/contract source.</p></section>
<style jsx>{`.table{display:grid;gap:10px}.row{display:grid;grid-template-columns:42px 1fr;gap:12px;align-items:center;padding:15px;background:#091522;border:1px solid #1b3047;border-radius:12px}.row>b{color:#63d5c4}.row h4,.row p{margin:0}.row p{color:#8195ad}`}</style>
</main>}
