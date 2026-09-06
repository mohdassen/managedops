'use client';
const items=[
 {type:'Risk',title:'Privileged access not yet evidenced',impact:'Could block operational takeover',status:'Open'},
 {type:'Risk',title:'KT completion not yet evidenced',impact:'Critical knowledge gap at go-live',status:'Open'},
 {type:'Dependency',title:'CMA user/email/project access provisioning',impact:'Required for mobilization',status:'Open'},
 {type:'Decision',title:'Proposal is temporary MVP source of truth',impact:'Reassess when contract/RFP is available',status:'Active'}
];
export default function RAID(){return <main>
<a className="eyebrow" href="/">← CONTROL CENTER</a>
<section className="panel"><p className="eyebrow">RAID MANAGEMENT</p><h1>Risks · Actions · Issues · Decisions</h1><p>AI can propose RAID items from documents and meeting minutes, but ownership and acceptance remain human controlled.</p></section>
<section className="panel"><div className="table">{items.map(i=><div className="row" key={i.title}><span className="tag">{i.type}</span><div><h4>{i.title}</h4><p>{i.impact}</p></div><b>{i.status}</b></div>)}</div></section>
<style jsx>{`.table{display:grid;gap:10px}.row{display:grid;grid-template-columns:110px 1fr 100px;gap:14px;align-items:center;padding:16px;background:#091522;border:1px solid #1b3047;border-radius:12px}.row h4,.row p{margin:0}.row p{color:#8195ad}.tag{font-size:11px;color:#63d5c4;border:1px solid #31506d;border-radius:20px;padding:5px 9px;width:max-content}@media(max-width:760px){.row{grid-template-columns:1fr}.row div{grid-row:2}}`}</style>
</main>}
