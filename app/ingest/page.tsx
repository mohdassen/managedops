'use client';
import {FormEvent, useState} from 'react';

type Result = {extracted?:number; persisted?:boolean; message?:string; error?:string; document?:{name:string;pages:number}};

export default function Ingest(){
  const [name,setName]=useState('CMA Managed Services');
  const [file,setFile]=useState<File|null>(null);
  const [busy,setBusy]=useState(false);
  const [result,setResult]=useState<Result|null>(null);

  async function submit(e:FormEvent){
    e.preventDefault();
    if(!file){setResult({error:'Select a PDF document first.'});return;}
    setBusy(true);setResult(null);
    try{
      const form=new FormData();
      form.set('file',file);form.set('projectId','cma');form.set('sourceType','proposal');
      const response=await fetch('/api/ingest',{method:'POST',body:form});
      const data=await response.json();
      setResult(data);
    }catch(error){setResult({error:error instanceof Error?error.message:'Upload failed.'});}
    finally{setBusy(false);}
  }

  return <main>
    <a className="eyebrow" href="/">← CONTROL CENTER</a>
    <section className="panel">
      <p className="eyebrow">PHASE 1 · PROPOSAL INTELLIGENCE</p>
      <h1>Create Project from Documents</h1>
      <p>Upload the awarded proposal or contract. ManagedOps extracts the project baseline while preserving page-level source traceability. AI findings remain unapproved until a human reviews them.</p>
      <form onSubmit={submit}>
        <label>Project name</label>
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="CMA Managed Services"/>
        <label>Source PDF</label>
        <input type="file" accept="application/pdf,.pdf" onChange={e=>setFile(e.target.files?.[0]||null)}/>
        <button disabled={busy||!file}>{busy?'Analyzing document…':'Analyze Document'}</button>
      </form>
      {result&&<div className={`result ${result.error?'bad':'good'}`}>
        {result.error?<strong>{result.error}</strong>:<>
          <strong>{result.extracted} requirements extracted</strong>
          <p>{result.document?.pages} pages processed · {result.persisted?'Saved to project baseline':'Not persisted'}</p>
          <p>{result.message}</p>
          <a href="/review">Open Review & Approval →</a>
        </>}
      </div>}
    </section>
    <section className="panel"><h3>Extraction targets</h3><p>Scope · Services & Towers · Resources · Roles · SLA/KPI · Deliverables · Milestones · Transition · KT · Governance · Coverage · Responsibilities · Dependencies · Assumptions · Risks</p></section>
    <style jsx>{`form{display:grid;gap:12px;margin-top:28px}label{font-size:13px;color:#9fb0c8}input{padding:14px;border-radius:10px;border:1px solid #29415d;background:#07111f;color:white}button{padding:14px;border:0;border-radius:10px;font-weight:800;cursor:pointer;margin-top:8px}button:disabled{opacity:.55;cursor:not-allowed}.result{margin-top:20px;padding:16px;border-radius:12px;border:1px solid #29415d}.result.good{background:#0b1d19}.result.bad{background:#241016}.result p{margin:8px 0}.result a{font-weight:700}`}</style>
  </main>
}
