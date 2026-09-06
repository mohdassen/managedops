import { NextResponse } from 'next/server';
import { calculateReadiness } from '../../../lib/readiness';
import type { ReadinessItem } from '../../../lib/domain';

const demoItems: ReadinessItem[] = [
  { id:'r-people', projectId:'cma-2026', service:'CMA Managed Services', factor:'people', status:'partial', critical:true, evidenceIds:[] },
  { id:'r-access', projectId:'cma-2026', service:'CMA Managed Services', factor:'access', status:'unknown', critical:true, evidenceIds:[] },
  { id:'r-doc', projectId:'cma-2026', service:'CMA Managed Services', factor:'documentation', status:'partial', critical:false, evidenceIds:[] },
  { id:'r-kt', projectId:'cma-2026', service:'CMA Managed Services', factor:'kt', status:'unknown', critical:true, evidenceIds:[] },
  { id:'r-monitor', projectId:'cma-2026', service:'CMA Managed Services', factor:'monitoring', status:'partial', critical:false, evidenceIds:[] },
  { id:'r-sop', projectId:'cma-2026', service:'CMA Managed Services', factor:'sop', status:'unknown', critical:false, evidenceIds:[] },
  { id:'r-sla', projectId:'cma-2026', service:'CMA Managed Services', factor:'sla', status:'partial', critical:true, evidenceIds:[] },
  { id:'r-dr', projectId:'cma-2026', service:'CMA Managed Services', factor:'backup_dr', status:'unknown', critical:true, evidenceIds:[] }
];

export async function GET(){
  return NextResponse.json({ projectId:'cma-2026', ...calculateReadiness(demoItems), items: demoItems });
}
