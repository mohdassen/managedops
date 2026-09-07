import { NextResponse } from 'next/server';
import { db } from '../../../lib/db';

const layers = [
  { id:'steering', name:'Steering Committee', detail:'Strategic approvals, resource allocation and major blocker resolution', requirementIds:['req-steering'] },
  { id:'service-delivery', name:'Service Delivery Management', detail:'Managed-services coordination, governance and reporting', requirementIds:['req-sdm','req-dashboard'] },
  { id:'operations-eoc', name:'Operations / EOC', detail:'24x7 monitoring, event and incident coordination', requirementIds:['req-eoc','req-monitoring'] },
  { id:'service-desk', name:'L1 Service Desk', detail:'Single point of contact, incidents, requests and escalation', requirementIds:['req-servicenow'] },
  { id:'technical', name:'L2/L3 Technical Teams', detail:'Escalations, RCA and platform operations', requirementIds:['req-infra-lead'] },
  { id:'knowledge', name:'Knowledge Management', detail:'Documentation, knowledge base and knowledge transfer', requirementIds:['req-kt-plan','req-knowledge'] },
  { id:'governance-controls', name:'Governance Controls', detail:'RACI, SLA/KPI control and traceable accountability', requirementIds:['req-raci','req-sla-monitoring','req-sla-compliance'] }
];

export async function GET() {
  const sql = db();
  if (!sql) return NextResponse.json({ error:'DATABASE_URL not configured' }, { status:503 });
  const ids = [...new Set(layers.flatMap((layer) => layer.requirementIds))];
  const rows = await sql`
    select id, title, detail, review_state, source_document, source_page, source_section
    from requirements
    where project_id = 'cma' and id = any(${ids})
  `;
  const byId = new Map(rows.map((row) => [String(row.id), row]));
  const model = layers.map((layer) => {
    const evidence = layer.requirementIds.map((id) => byId.get(id)).filter(Boolean).map((row) => ({
      id:String(row!.id), title:String(row!.title), detail:String(row!.detail), reviewState:String(row!.review_state),
      sourceDocument:String(row!.source_document), sourcePage:row!.source_page == null ? null : Number(row!.source_page),
      sourceSection:row!.source_section == null ? null : String(row!.source_section)
    }));
    return { ...layer, evidence, approvedEvidence:evidence.filter((item) => item.reviewState === 'approved').length };
  });
  return NextResponse.json({ projectId:'cma', sourceOfTruth:'proposal', layers:model });
}
