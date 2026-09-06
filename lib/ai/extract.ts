import { z } from 'zod';
import type { PdfPage } from '../pdf';

const Category = z.enum(['scope','service','resource','role','sla_kpi','deliverable','milestone','transition','kt','governance','coverage','responsibility','dependency','assumption','risk']);
const ExtractedRequirement = z.object({
  category: Category,
  title: z.string().min(1),
  detail: z.string().min(1),
  confidence: z.number().min(0).max(1),
  page: z.number().int().positive(),
  section: z.string().optional(),
});
const Extraction = z.object({ requirements: z.array(ExtractedRequirement) });
export type ExtractedItem = z.infer<typeof ExtractedRequirement>;

function aiConfig() {
  const provider = process.env.AI_PROVIDER || 'openai';
  const apiKey = process.env.AI_API_KEY;
  const model = process.env.AI_MODEL;
  const endpoint = process.env.AI_ENDPOINT;
  if (!apiKey || !model) throw new Error('AI credentials are not configured. Customer-owned AI_API_KEY and AI_MODEL are required.');
  return { provider, apiKey, model, endpoint, apiVersion: process.env.AI_API_VERSION || '2024-10-21' };
}

function buildPrompt(documentName: string, pages: PdfPage[]) {
  const source = pages.map((p) => `\n--- PAGE ${p.page} ---\n${p.text}`).join('');
  return `You are extracting a managed-services project baseline from ${documentName}. Return JSON only with a top-level \"requirements\" array. Every item must contain category, title, detail, confidence (0-1), page, and optional section. Use only facts explicitly present in the supplied pages. Never invent missing facts. Categories allowed: scope, service, resource, role, sla_kpi, deliverable, milestone, transition, kt, governance, coverage, responsibility, dependency, assumption, risk. Preserve quantities, dates, percentages, SLA/KPI thresholds and role qualifications exactly when present. The page must be the source page number shown in the input.\n${source}`;
}

async function callModel(prompt: string) {
  const cfg = aiConfig();
  let url: string;
  let headers: Record<string,string>;
  let body: unknown;

  if (cfg.provider === 'azure_openai') {
    if (!cfg.endpoint) throw new Error('AI_ENDPOINT is required for Azure OpenAI.');
    url = `${cfg.endpoint.replace(/\/$/, '')}/openai/deployments/${encodeURIComponent(cfg.model)}/chat/completions?api-version=${encodeURIComponent(cfg.apiVersion)}`;
    headers = { 'content-type': 'application/json', 'api-key': cfg.apiKey };
    body = { messages: [{ role: 'user', content: prompt }], temperature: 0, response_format: { type: 'json_object' } };
  } else {
    url = `${(cfg.endpoint || 'https://api.openai.com').replace(/\/$/, '')}/v1/chat/completions`;
    headers = { 'content-type': 'application/json', authorization: `Bearer ${cfg.apiKey}` };
    body = { model: cfg.model, messages: [{ role: 'user', content: prompt }], temperature: 0, response_format: { type: 'json_object' } };
  }

  const response = await fetch(url, { method: 'POST', headers, body: JSON.stringify(body) });
  if (!response.ok) throw new Error(`AI extraction failed (${response.status}): ${await response.text()}`);
  const data = await response.json() as { choices?: Array<{ message?: { content?: string } }> };
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error('AI extraction returned no content.');
  return Extraction.parse(JSON.parse(content)).requirements;
}

function chunkPages(pages: PdfPage[], maxChars = 18000) {
  const chunks: PdfPage[][] = [];
  let current: PdfPage[] = [];
  let size = 0;
  for (const page of pages) {
    const pageSize = page.text.length + 40;
    if (current.length && size + pageSize > maxChars) {
      chunks.push(current);
      current = [];
      size = 0;
    }
    current.push(page);
    size += pageSize;
  }
  if (current.length) chunks.push(current);
  return chunks;
}

export async function extractRequirements(documentName: string, pages: PdfPage[]) {
  const chunks = chunkPages(pages);
  const results: ExtractedItem[] = [];
  for (const chunk of chunks) {
    results.push(...await callModel(buildPrompt(documentName, chunk)));
  }
  return results;
}
