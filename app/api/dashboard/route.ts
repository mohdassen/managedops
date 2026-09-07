import { NextResponse } from 'next/server';
import { db } from '../../../lib/db';
import { calculateReadiness } from '../../../lib/readiness';
import type { ReadinessItem } from '../../../lib/domain';

export async function GET(){
  const sql=db();
  if(!sql) return NextResponse.json({error:'DATABASE_URL not configured'},{status:503});

  const [reqs,positions,candidates,readiness,raid]=await Promise.all([
    sql`select review_state, category from requirements where project_id='cma'`,
    sql`select required_quantity, filled_quantity, status from positions where project_id='cma'`,
    sql`select status from candidates where project_id='cma'`,
    sql`select id, project_id, service, factor, status, critical, evidence_ids from readiness_items where project_id='cma'`,
    sql`select kind, severity, status from raid_items where project_id='cma'`
  ]);

  const readinessItems:ReadinessItem[]=readiness.map(row=>({
    id:String(row.id),projectId:String(row.project_id),service:String(row.service),
    factor:row.factor as ReadinessItem['factor'],status:row.status as ReadinessItem['status'],
    critical:Boolean(row.critical),evidenceIds:Array.isArray(row.evidence_ids)?row.evidence_ids.map(String):[]
  }));
  const readinessResult=calculateReadiness(readinessItems);
  const required=positions.reduce((s,r)=>s+Number(r.required_quantity||0),0);
  const filled=positions.reduce((s,r)=>s+Number(r.filled_quantity||0),0);
  const approved=reqs.filter(r=>String(r.review_state)==='approved').length;
  const pending=reqs.filter(r=>String(r.review_state)!=='approved').length;
  const openRaid=raid.filter(r=>!['closed','rejected'].includes(String(r.status))).length;
  const criticalRaid=raid.filter(r=>String(r.severity)==='critical'&&!['closed','rejected'].includes(String(r.status))).length;

  return NextResponse.json({
    projectId:'cma',
    requirements:{total:reqs.length,approved,pending},
    staffing:{required,filled,gap:Math.max(required-filled,0),shortlisted:candidates.filter(c=>String(c.status)==='shortlisted').length},
    readiness:{...readinessResult,totalFactors:readinessItems.length},
    raid:{open:openRaid,critical:criticalRaid,total:raid.length},
    generatedAt:new Date().toISOString()
  });
}
