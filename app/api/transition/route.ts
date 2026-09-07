import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../lib/db';

const gateDefinitions = [
  { id:'r-transition-plan', label:'Handover plan', factor:'documentation', requirementIds:['req-transition-plan'], critical:true },
  { id:'r-raci', label:'RACI matrix', factor:'documentation', requirementIds:['req-raci'], critical:false },
  { id:'r-sla', label:'SLA/KPI monitoring mechanism', factor:'sla', requirementIds:['req-sla-monitoring','req-sla-compliance'], critical:true },
  { id:'r-kt', label:'Knowledge transfer plan', factor:'kt', requirementIds:['req-kt-plan','req-knowledge'], critical:true },
  { id:'r-people', label:'Team readiness', factor:'people', requirementIds:['req-start','req-sdm','req-infra-lead'], critical:true },
  { id:'r-access', label:'Privileged access', factor:'access', requirementIds:[], critical:true },
  { id:'r-doc', label:'Operational documentation', factor:'documentation', requirementIds:['req-knowledge'], critical:false },
  { id:'r-dr', label:'Backup / DR evidence', factor:'backup_dr', requirementIds:['req-dr'], critical:true }
] as const;

export async function GET() {
  const sql = db();
  if (!sql) return NextResponse.json({ error:'DATABASE_URL not configured' }, { status:503 });

  const requirements = await sql`
    select id, title, detail, review_state, source_document, source_page, source_section
    from requirements
    where project_id = 'cma'
  `;
  const readiness = await sql`
    select id, factor, status, critical, evidence_ids
    from readiness_items
    where project_id = 'cma'
  `;

  const reqMap = new Map(requirements.map((r) => [String(r.id), r]));
  const readyMap = new Map(readiness.map((r) => [String(r.id), r]));

  const gates = gateDefinitions.map((gate) => {
    const evidence = gate.requirementIds.map((id) => reqMap.get(id)).filter(Boolean).map((row) => ({
      id:String(row!.id),
      title:String(row!.title),
      detail:String(row!.detail),
      reviewState:String(row!.review_state),
      sourceDocument:String(row!.source_document),
      sourcePage:row!.source_page == null ? null : Number(row!.source_page),
      sourceSection:row!.source_section == null ? null : String(row!.source_section)
    }));
    const state = readyMap.get(gate.id) ?? readiness.find((r) => String(r.factor) === gate.factor);
    return {
      id:gate.id,
      label:gate.label,
      factor:gate.factor,
      critical:gate.critical,
      status:state ? String(state.status) : 'unknown',
      evidenceIds:state && Array.isArray(state.evidence_ids) ? state.evidence_ids.map(String) : [],
      evidence
    };
  });

  return NextResponse.json({ projectId:'cma', gates });
}

export async function PATCH(request: NextRequest) {
  const sql = db();
  if (!sql) return NextResponse.json({ error:'DATABASE_URL not configured' }, { status:503 });

  const body = await request.json();
  const gateId = String(body.gateId ?? '');
  const status = String(body.status ?? '');
  const evidenceId = body.evidenceId ? String(body.evidenceId) : null;
  const gate = gateDefinitions.find((item) => item.id === gateId);
  if (!gate) return NextResponse.json({ error:'Unknown transition gate' }, { status:400 });
  if (!['unknown','partial','ready','blocked'].includes(status)) {
    return NextResponse.json({ error:'Invalid readiness status' }, { status:400 });
  }

  const existing = await sql`
    select evidence_ids from readiness_items where id = ${gate.id} and project_id = 'cma' limit 1
  `;
  const currentEvidence = existing[0] && Array.isArray(existing[0].evidence_ids) ? existing[0].evidence_ids.map(String) : [];
  const evidenceIds = evidenceId && !currentEvidence.includes(evidenceId) ? [...currentEvidence, evidenceId] : currentEvidence;

  await sql`
    insert into readiness_items (id, project_id, service, factor, status, critical, evidence_ids, updated_at)
    values (${gate.id}, 'cma', 'CMA Managed Services', ${gate.factor}, ${status}, ${gate.critical}, ${sql.json(evidenceIds)}, now())
    on conflict (id) do update set
      status = excluded.status,
      critical = excluded.critical,
      evidence_ids = excluded.evidence_ids,
      updated_at = now()
  `;

  return NextResponse.json({ ok:true, gateId:gate.id, status, evidenceIds, humanApprovalRequired:true });
}
