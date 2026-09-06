export type SourceType='proposal'|'contract'|'sow'|'rfp'|'boq';
export type ReviewState='ai_extracted'|'needs_review'|'approved'|'rejected'|'conflict'|'to_be_confirmed';
export type RequirementCategory='scope'|'service'|'resource'|'role'|'sla_kpi'|'deliverable'|'milestone'|'transition'|'kt'|'governance'|'coverage'|'responsibility'|'dependency'|'assumption'|'risk';
export interface SourceRef{document:string;sourceType:SourceType;page?:number;section?:string;quote?:string}
export interface Requirement{id:string;projectId:string;category:RequirementCategory;title:string;detail:string;confidence:number;reviewState:ReviewState;source:SourceRef}
export interface ReadinessItem{id:string;projectId:string;service:string;factor:'people'|'access'|'documentation'|'kt'|'monitoring'|'sop'|'sla'|'backup_dr'|'risk'|'dependency';status:'ready'|'partial'|'blocked'|'unknown';critical:boolean;evidenceIds:string[]}
export interface ProjectBaseline{projectId:string;name:string;sourceOfTruth:'proposal'|'contract';requirements:Requirement[];approvedAt?:string}
