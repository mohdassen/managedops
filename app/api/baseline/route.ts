import { NextResponse } from 'next/server';
import { cmaRequirements, cmaBaselineSummary } from '@/data/cma-baseline';

export async function GET(){
  return NextResponse.json({summary:cmaBaselineSummary,requirements:cmaRequirements});
}
