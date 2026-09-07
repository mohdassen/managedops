import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../lib/db';

const evidenceMap: Record<string, string[]> = {
  'raid-access': [],
  'raid-kt': ['req-kt-plan', 'req-knowledge'],
  'raid-source': [],
  'raid-dr': ['req-dr']
};

export async function GET() {
  const sql = db();
  if (!sql) return NextResponse.json({ error: 'DATABASE_URL not configured' }, { status: 503 });

  const items = await sql`
    select id, kind, title, detail, severity, owner, status, due_date
    from raid_items
    where project_id = 'cma'
    order by case kind when 'risk' then 1 when 'issue' then 2 when 'action' then 3 else 4 end, id
  `;

  const requirementIds = [...new Set(items.flatMap((item) => evidenceMap[item.id as string] ?? []))];
  const evidence = requirementIds.length
    ? await sql`
        select id, title, detail, review_state, source_document, source_type, source_page, source_section
        from requirements
        where project_id = 'cma' and id = any(${requirementIds})
      `
    : [];

  const byId = new Map(evidence.map((row) => [row.id as string, row]));
  const enriched = items.map((item) => ({
    ...item,
    evidence: (evidenceMap[item.id as string] ?? []).map((id) => byId.get(id)).filter(Boolean)
  }));

  return NextResponse.json({ projectId: 'cma', items: enriched });
}

export async function PATCH(request: NextRequest) {
  const sql = db();
  if (!sql) return NextResponse.json({ error: 'DATABASE_URL not configured' }, { status: 503 });

  const body = await request.json().catch(() => null) as null | { id?: string; status?: string; owner?: string | null };
  const allowed = new Set(['proposed', 'accepted', 'open', 'mitigating', 'closed', 'rejected']);
  if (!body?.id || !body.status || !allowed.has(body.status)) {
    return NextResponse.json({ error: 'Invalid RAID update' }, { status: 400 });
  }

  const rows = await sql`
    update raid_items
    set status = ${body.status}, owner = ${body.owner ?? null}
    where id = ${body.id} and project_id = 'cma'
    returning id, kind, title, status, owner
  `;
  if (!rows.length) return NextResponse.json({ error: 'RAID item not found' }, { status: 404 });
  return NextResponse.json({ item: rows[0], decision: 'Human approved workflow update' });
}
