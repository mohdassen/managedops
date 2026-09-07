import { NextResponse } from 'next/server';
import { healthcheck } from '../../../lib/db';

function aiStatus() {
  const provider = process.env.AI_PROVIDER || 'openai';
  const apiKey = process.env.AI_API_KEY;
  const model = process.env.AI_MODEL;
  const endpoint = process.env.AI_ENDPOINT;

  const configured = provider === 'azure_openai'
    ? Boolean(apiKey && model && endpoint)
    : Boolean(apiKey && model);

  return {
    provider,
    configured,
    missing: [
      !apiKey ? 'AI_API_KEY' : null,
      !model ? 'AI_MODEL' : null,
      provider === 'azure_openai' && !endpoint ? 'AI_ENDPOINT' : null,
    ].filter(Boolean),
  };
}

export async function GET() {
  const database = await healthcheck();
  const ai = aiStatus();
  const ready = database.connected && ai.configured;

  return NextResponse.json(
    {
      service: 'managedops-control-center',
      status: ready ? 'ready' : 'degraded',
      checks: { database, ai },
    },
    { status: ready ? 200 : 503 },
  );
}
