import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../lib/db';

const allowed = new Set(['approved','rejected','needs_review','conflict','to_be_confirmed','ai_extracted']);

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const body = await request.json();
  const reviewState = String(body.reviewState || '');
  if (!allowed.has(reviewState)) return NextResponse.json({ error: 'Invalid review state' }, { status: 400 });

  const sql = db();
  if (!sql) return NextResponse.json({ error: 'DATABASE_URL is not configured yet', id, reviewState }, { status: 503 });

  const rows = await sql`
    update requirements
       set review_state=${reviewState}, reviewed_at=now()
     where id=${id}
     returning id, review_state, reviewed_at
  `;
  if (!rows.length) return NextResponse.json({ error: 'Requirement not found' }, { status: 404 });
  return NextResponse.json(rows[0]);
}
