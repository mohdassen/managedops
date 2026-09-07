import { NextRequest, NextResponse } from 'next/server';
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

type Evidence = {
  id: string;
  title: string;
  reviewState: string;
  sourceDocument: string;
  sourceType: string;
  sourcePage: number | null;
};

type EnrichedItem = ReadinessItem & { evidence: Evidence[] };

async function loadItems(): Promise<EnrichedItem[]> {
  const sql = db();
  if (!sql) return fallbackItems.map(item => ({ ...item, evidence: [] }));

  const rows = await sql`
    select id, project_id, service, factor, status, critical, evidence_ids
    from readiness_items
    where project_id = 'cma'
    order by factor, id
  `;

  if (!rows.length) return fallbackItems.map(item => ({ ...item, evidence: [] }));

  const allEvidenceIds = Array.from(new Set(rows.flatMap(row => Array.isArray(row.evidence_ids) ? row.evidence_ids.map(String) : [])));
  const evidenceRows = allEvidenceIds.length
    ? await sql`
        select id, title, review_state, source_document, source_type, source_page
        from requirements
        where project_id = 'cma' and id = any(${allEvidenceIds})
      `
    : [];

  const evidenceMap = new Map<string, Evidence>();
  for (const row of evidenceRows) {
    evidenceMap.set(String(row.id), {
      id: String(row.id),
      title: String(row.title),
      reviewState: String(row.review_state),
      sourceDocument: String(row.source_document),
      sourceType: String(row.source_type),
      sourcePage: row.source_page == null ? null : Number(row.source_page)
    });
  }

  return rows.map(row => {
    const evidenceIds = Array.isArray(row.evidence_ids) ? row.evidence_ids.map(String) : [];
    return {
      id: String(row.id),
      projectId: String(row.project_id),
      service: String(row.service),
      factor: row.factor as ReadinessItem['factor'],
      status: row.status as ReadinessItem['status'],
      critical: Boolean(row.critical),
      evidenceIds,
      evidence: evidenceIds.map(id => evidenceMap.get(id)).filter((item): item is Evidence => Boolean(item))
    };
  });
}

export async function GET() {
  const items = await loadItems();
  const calculationItems: ReadinessItem[] = items.map(({ evidence: _evidence, ...item }) => item);
  const approvedEvidenceCount = items.reduce((sum, item) => sum + item.evidence.filter(e => e.reviewState === 'approved').length, 0);
  const unapprovedEvidenceCount = items.reduce((sum, item) => sum + item.evidence.filter(e => e.reviewState !== 'approved').length, 0);
  return NextResponse.json({
    projectId: 'cma',
    source: db() ? 'database' : 'fallback',
    ...calculateReadiness(calculationItems),
    evidenceSummary: { approved: approvedEvidenceCount, pending: unapprovedEvidenceCount },
    items
  });
}

export async function PATCH(request: NextRequest) {
  const sql = db();
  if (!sql) return NextResponse.json({ error: 'DATABASE_URL not configured' }, { status: 503 });

  const body = await request.json().catch(() => null) as { id?: string; status?: ReadinessItem['status'] } | null;
  const allowed = new Set<ReadinessItem['status']>(['ready', 'partial', 'blocked', 'unknown']);
  if (!body?.id || !body.status || !allowed.has(body.status)) {
    return NextResponse.json({ error: 'Valid readiness item id and status are required' }, { status: 400 });
  }

  const updated = await sql`
    update readiness_items
    set status = ${body.status}, updated_at = now()
    where project_id = 'cma' and id = ${body.id}
    returning id, factor, status, critical, evidence_ids, updated_at
  `;
  if (!updated.length) return NextResponse.json({ error: 'Readiness item not found' }, { status: 404 });

  return NextResponse.json({
    ok: true,
    note: 'Readiness status changed by explicit human action. Evidence remains independently reviewable.',
    item: updated[0]
  });
}
