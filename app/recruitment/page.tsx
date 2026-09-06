'use client';
const positions=[
 {role:'Service Delivery Manager',required:1,status:'Open',source:'TP-CMA · p92'},
 {role:'Operation & Infrastructure Lead',required:1,status:'Shortlist ready',source:'TP-CMA · p92'}
];
const candidates=[
 {name:'Burhan H. Al-Ali',role:'Operation & Infrastructure Lead',score:'9.2/10',status:'Shortlisted',availability:'Immediate'},
 {name:'Fadi Adeeb',role:'Operation & Infrastructure Lead',score:'9.0/10',status:'Shortlisted',availability:'Immediate'},
 {name:'Ansar Ali',role:'Operation & Infrastructure Lead',score:'7.2/10',status:'Shortlisted',availability:'Immediate'}
];
export default function Recruitment(){return <main>
<a className="eyebrow" href="/">← CONTROL CENTER</a>
<section className="panel"><p className="eyebrow">RESOURCE & RECRUITMENT</p><h1>CMA Staffing Control</h1><p>Positions originate from the proposal baseline. Candidate decisions remain separate from proposal facts and require human approval.</p></section>
<section className="grid">{positions.map(p=><article key={p.role}><small>{p.role}</small><strong>{p.required} required</strong><span>{p.status} · {p.source}</span></article>)}</section>
<section className="panel"><h3>Infrastructure Lead shortlist</h3><div className="table">{candidates.map(c=><div className="row" key={c.name}><div><h4>{c.name}</h4><p>{c.role}</p></div><b>{c.score}</b><span>{c.status}</span><span>{c.availability}</span></div>)}</div></section>
<style jsx>{`.table{display:grid;gap:10px}.row{display:grid;grid-template-columns:2fr .7fr 1fr 1fr;gap:14px;align-items:center;padding:16px;background:#091522;border:1px solid #1b3047;border-radius:12px}.row h4,.row p{margin:0}.row p,.row span{color:#8195ad;font-size:13px}@media(max-width:760px){.row{grid-template-columns:1fr 1fr}.row div{grid-column:1/-1}}`}</style>
</main>}
