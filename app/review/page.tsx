import { cmaRequirements, cmaBaselineSummary } from '../../data/cma-baseline';
import ReviewClient from './ReviewClient';

export default function ReviewPage(){return <main>
  <a className="eyebrow" href="/">← CONTROL CENTER</a>
  <section className="panel"><p className="eyebrow">AI EXTRACTION REVIEW</p><h1>{cmaBaselineSummary.name}</h1><p>Source of truth for this MVP: <b>Winning Technical Proposal</b>. Every extracted item remains reviewable until a human approves it.</p></section>
  <ReviewClient initial={cmaRequirements}/>
</main>}
