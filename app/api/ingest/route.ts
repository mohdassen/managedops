import { NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { extractPdfPages } from '../../../lib/pdf';
import { extractRequirements } from '../../../lib/ai/extract';
import { db } from '../../../lib/db';

export const runtime = 'nodejs';
export const maxDuration = 300;

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const file = form.get('file');
    const projectId = String(form.get('projectId') || 'cma');
    const sourceType = String(form.get('sourceType') || 'proposal');

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'A PDF file is required.' }, { status: 400 });
    }
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      return NextResponse.json({ error: 'Phase 1 currently supports PDF documents.' }, { status: 400 });
    }
    if (file.size > 30 * 1024 * 1024) {
      return NextResponse.json({ error: 'PDF exceeds the 30 MB MVP upload limit.' }, { status: 413 });
    }

    const pages = await extractPdfPages(await file.arrayBuffer());
    const nonEmptyPages = pages.filter((p) => p.text.length > 0);
    if (!nonEmptyPages.length) {
      return NextResponse.json({ error: 'No extractable text found in the PDF.' }, { status: 422 });
    }

    const requirements = await extractRequirements(file.name, nonEmptyPages);
    const sql = db();
    let persisted = false;

    if (sql) {
      const documentId = randomUUID();
      await sql.begin(async (tx) => {
        await tx`
          insert into documents (id, project_id, name, source_type, version)
          values (${documentId}, ${projectId}, ${file.name}, ${sourceType}, 1)
          on conflict (id) do nothing
        `;
        for (const item of requirements) {
          await tx`
            insert into requirements (
              id, project_id, category, title, detail, confidence, review_state,
              source_document, source_type, source_page, source_section
            ) values (
              ${randomUUID()}, ${projectId}, ${item.category}, ${item.title}, ${item.detail},
              ${item.confidence}, 'ai_extracted', ${file.name}, ${sourceType}, ${item.page}, ${item.section || null}
            )
          `;
        }
      });
      persisted = true;
    }

    return NextResponse.json({
      document: { name: file.name, pages: pages.length, sourceType },
      extracted: requirements.length,
      persisted,
      requirements,
      reviewState: 'ai_extracted',
      message: persisted
        ? 'Extraction completed and saved for human review.'
        : 'Extraction completed. Configure DATABASE_URL to persist results.',
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Document ingestion failed.' },
      { status: 500 },
    );
  }
}
