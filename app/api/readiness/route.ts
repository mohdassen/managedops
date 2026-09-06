import { NextResponse } from 'next/server';
import { calculateReadiness } from '../../../lib/readiness';
import { db } from '../../../lib/db';
import type { ReadinessItem } from '../../../lib/domain';

const fallbackItems: ReadinessItem[] = [
  { id:'r-people', projectId:'cma', service:'CMA Managed Services', factor:'people', status:'partial', critical:true, evidenceIds:[] },
  { id:'r-access', projectId:'cma', service:'CMA Managed Services', factor:'access', status:'unknown', critical:true, evidenceIds:[] },
  { id:'r-doc', projectId:'cma', service:'CMA Managed Services', factor:'documentation', status:'partial', critical:false, evidenceIds:[] },
  { id:'r-kt', projectId:'cma', service:'CMA Managed Services', factor:'kt', status:'unknown', critical:true, evidenceIds:[] },
  { id:'r-monitor', projectId:'cma', service:'CMA Managed Services', factor:'monitoring', status:'partial', critical:false, evidenceIds:[] },
  { id:'r-sop', projectId:'cma', service:'CMA Managed Services', factor:'sop', status:'unknown', critical:false, evidenceIds:[] },
  { id:'r-sla', projectId:'cma', service:'CMA Managed Services', factor:'sla', status:'partial', critical:true, evidenceIds:[] },
  { id:'r-dr', projectId:'cma', service:'CMA Managed Services', factor:'backup_dr', status:'unknown', critical:true, evidenceIds:[] }
];

export async function GET() {
  const sql = db();
  if (!sql) {
    return NextResponse.json({ projectId:'cma', source:'fallback', ...calculateReadiness(fallbackItems), items:fallbackItems });
  }

  const rows = await sql`
    select id, project_id, service, factor, status, critical, evidence_ids
    from readiness_items
    where project_id = 'cma'
    order by factor, id
  `;

  const items: ReadinessItem[] = rows.map((row) => ({
    id: String(row.id),
    projectId: String(row.project_id),
    service: String(row.service),
    factor: row.factor as ReadinessItem['factor'],
    status: row.status as ReadinessItem['status'],
    critical: Boolean(row.critical),
    evidenceIds: Array.isArray(row.evidence_ids) ? row.evidence_ids.map(String) : []
  }));

  if (!items.length) {
    return NextResponse.json({ projectId:'cma', source:'fallback', ...calculateReadiness(fallbackItems), items:fallbackItems });
  }

  return NextResponse.json({ projectId:'cma', source:'database', ...calculateReadiness(items), items });
}
