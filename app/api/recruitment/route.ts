import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../lib/db';

export async function GET() {
  const sql = db();
  if (!sql) return NextResponse.json({ error: 'DATABASE_URL not configured' }, { status: 503 });

  const positions = await sql`
    select id, role_name, required_quantity, filled_quantity, status, requirements
    from positions
    where project_id = 'cma'
    order by role_name
  `;

  const candidates = await sql`
    select c.id, c.full_name, c.score, c.status, c.availability, c.assessment,
           p.role_name
    from candidates c
    left join positions p on p.id = c.position_id
    where c.project_id = 'cma'
    order by c.score desc nulls last, c.full_name
  `;

  return NextResponse.json({ projectId: 'cma', positions, candidates });
}

export async function PATCH(request: NextRequest) {
  const sql = db();
  if (!sql) return NextResponse.json({ error: 'DATABASE_URL not configured' }, { status: 503 });

  const body = await request.json().catch(() => null) as null | { candidateId?: string; status?: string };
  const allowed = new Set(['new','shortlisted','technical_interview','offer_pending','offer_accepted','rejected','selected']);
  if (!body?.candidateId || !body.status || !allowed.has(body.status)) {
    return NextResponse.json({ error: 'Invalid candidate status update' }, { status: 400 });
  }

  const rows = await sql`
    update candidates
    set status = ${body.status},
        assessment = coalesce(assessment, '{}'::jsonb) || jsonb_build_object(
          'decision', 'Human approved workflow update',
          'updatedAt', now()::text
        )
    where id = ${body.candidateId} and project_id = 'cma'
    returning id, full_name, status
  `;

  if (!rows.length) return NextResponse.json({ error: 'Candidate not found' }, { status: 404 });
  return NextResponse.json({ candidate: rows[0] });
}
