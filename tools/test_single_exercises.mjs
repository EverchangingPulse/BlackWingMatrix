#!/usr/bin/env node
/* Exercises are standalone: generate exactly the puzzles used by practice mode
   and render every matrix/answer tile without a browser DOM. */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const source=fs.readFileSync(path.join(root,'index.html'),'utf8');
const scripts=[...source.matchAll(/<script(?:[^>]*)>([\s\S]*?)<\/script>/g)].map(match=>match[1]);
const core=scripts[0],coreEnd=core.indexOf('let puzzle,selected=-1');
if(coreEnd<0)throw new Error('Could not locate the exercise generator.');
const practiceStart=core.indexOf('const PRACTICE_DIFFICULTY_RANGES='),practiceEnd=core.indexOf('const ADAPTIVE_FAMILY_POOLS=',practiceStart);
if(practiceStart<0||practiceEnd<0)throw new Error('Could not locate the single-exercise difficulty selector.');
const progressiveStart=core.indexOf('const EMPIRICAL_FAMILY_LEVELS='),progressiveEnd=core.indexOf('// The 1–60 scale is product-wide.',progressiveStart);
if(progressiveStart<0||progressiveEnd<0)throw new Error('Could not locate the progressive-test planner.');

const sandbox={console,window:{},document:{getElementById:()=>null,querySelector:()=>null,querySelectorAll:()=>[],createElement:()=>({}),body:{}},localStorage:{getItem:()=>null,setItem:()=>{}},navigator:{},setTimeout:()=>{},clearTimeout:()=>{},Math,JSON,Date};
sandbox.window=sandbox;
vm.createContext(sandbox);
vm.runInContext(core.slice(0,coreEnd)+'\n'+core.slice(practiceStart,practiceEnd)+'\n'+core.slice(progressiveStart,progressiveEnd)+'\nglobalThis.__makeBalancedPuzzle=makeBalancedPuzzle;globalThis.__makePracticePuzzle=makePracticePuzzle;globalThis.__practiceRange=difficultyRangeForTier;globalThis.__practiceScore=practiceDifficultyForSeed;globalThis.__generatorTier=generatorTierForDifficulty;globalThis.__familyGeneratorTier=familyGeneratorTierForDifficulty;globalThis.__familyProfile=familyDifficultyProfile;globalThis.__progressiveSteps=PROGRESSIVE_DIFFICULTY_STEPS;globalThis.__progressiveFamiliesAtStep=progressiveFamiliesAtStep;globalThis.__progressiveSurveyPlan=progressiveSurveyPlan;globalThis.__progressiveSpectrum=progressiveFamilyDifficulties;globalThis.__progressiveRangeSpectrum=progressiveDifficultiesForRange;globalThis.__progressiveSpectrumPlan=progressiveFamilySpectrumPlan;globalThis.__familyGenerationRange=familyGenerationDifficultyRange;globalThis.__empiricalFamilies=Object.keys(EMPIRICAL_FAMILY_LEVELS);globalThis.__renderFigure=renderFigure;',sandbox);

const families=['custom','logical','affine','outline','outline-relations','marker-grid','carrier-token','dot-arrangement','line-assembly','spatial-tokens','grid-logic','ternary-carry','polyomino','shape-fill','split-fill','symbol-order','composition','spoke-pattern','motif-count','radial-flower','fill-grid','paired-polygons','block-balance','axis-symbols','horizontal-anchors','dot-balance','xor-blocks','lane-matching','line-xor','line-perimeter-logic','operator-transfer','minkowski-dilation','convex-hull','kronecker-product','cartesian-product','reference-mix','mixed','simple','progression','cycle'];
const regressionCases=[{family:'custom',level:1,seed:'single-render-custom-1-2'}];
const failures=[];
let puzzles=0,figures=0;

function verifyPuzzle(puzzle,context){
 if(!Array.isArray(puzzle.cells)||puzzle.cells.length!==9)throw new Error('Expected nine matrix cells.');
 const expectedOptions=Number.isInteger(puzzle.answerOptionCount)?puzzle.answerOptionCount:8;
 if(!Array.isArray(puzzle.options)||puzzle.options.length!==expectedOptions)throw new Error('Expected '+expectedOptions+' answers.');
 if(!Number.isInteger(puzzle.answer)||puzzle.answer<0||puzzle.answer>=puzzle.options.length)throw new Error('The correct answer is missing.');
 for(const tile of [...puzzle.cells,...puzzle.options]){const svg=sandbox.__renderFigure(tile);if(typeof svg!=='string'||!svg.includes('<svg'))throw new Error('A tile did not render to SVG.');figures++}
 puzzles++;
}
function verifySingleExerciseDifficultySelection(){
 for(let tier=1;tier<=6;tier++){
  const range=sandbox.__practiceRange(tier),scores=[];
  for(let variant=0;variant<16;variant++){
   const seed='single-difficulty-span|'+tier+'|'+variant,score=Number(sandbox.__practiceScore(seed,tier));
   if(!Number.isFinite(score)||score<range.min||score>range.max)throw new Error('Single-exercise score falls outside its selected tier.');
   if(sandbox.__practiceScore(seed,tier)!==score)throw new Error('Single-exercise score is not reproducible for the same seed.');
   scores.push(score);
  }
  if(new Set(scores).size<12)throw new Error('Single-exercise difficulty selection does not vary inside its tier.');
  const seed='single-difficulty-propagation|'+tier,puzzle=sandbox.__makePracticePuzzle(seed,tier,'marker-grid'),replay=sandbox.__makePracticePuzzle(seed,tier,'marker-grid');
  if(replay.requestedDifficulty!==puzzle.requestedDifficulty||puzzle.targetDifficulty!==puzzle.requestedDifficulty||puzzle.generator?.difficulty?.requested!==puzzle.requestedDifficulty)throw new Error('Single-exercise score was not propagated to puzzle metadata.');
 }
}
function verifyProgressivePlanning(){
 const expectedSteps=Array.from({length:21},(_,index)=>index*3),actualSteps=[...sandbox.__progressiveSteps];
 if(JSON.stringify(actualSteps)!==JSON.stringify(expectedSteps))throw new Error('Progressive test steps must be 0, 3, 6 through 60.');
 const survey=sandbox.__progressiveSurveyPlan(),coveredFamilies=new Set();
 let previousStep=-1;
 for(const step of expectedSteps){
  const expectedFamilies=[...sandbox.__progressiveFamiliesAtStep(step)],planned=survey.filter(item=>item.step===step),plannedFamilies=planned.map(item=>item.family);
  if(JSON.stringify(plannedFamilies)!==JSON.stringify(expectedFamilies))throw new Error('Progressive survey does not include exactly the available families for step '+step+'.');
  for(const item of planned){
   if(item.step<previousStep)throw new Error('Progressive survey is not ordered by increasing difficulty step.');
   if(item.target!==step)throw new Error('Progressive survey target must equal its exact 3-point step.');
   coveredFamilies.add(item.family);previousStep=item.step;
  }
 }
 for(const family of sandbox.__empiricalFamilies)if(!coveredFamilies.has(family))throw new Error('Progressive survey never schedules '+family+'.');
 for(const family of ['shape-fill','minkowski-dilation','convex-hull','custom','xor-blocks','lane-matching','line-xor']){
  const range=sandbox.__familyGenerationRange(family),profile=[...sandbox.__familyProfile(family)],spectrum=[...sandbox.__progressiveSpectrum(family)],plan=sandbox.__progressiveSpectrumPlan(family),expectedSpectrum=[...new Set(profile.map(value=>+Number(value).toFixed(1)))].sort((left,right)=>left-right);
  if(!spectrum.length||spectrum[0]!==range.min||spectrum.at(-1)!==range.max)throw new Error('Family spectrum omits a calibrated endpoint for '+family+'.');
  if(JSON.stringify(spectrum)!==JSON.stringify(expectedSpectrum))throw new Error('Family spectrum must contain each calibrated generator level for '+family+'.');
  if(plan.length!==spectrum.length||plan.some((item,index)=>item.family!==family||item.target!==spectrum[index]))throw new Error('Family spectrum plan is incomplete for '+family+'.');
 }
 const shapeFillSpectrum=[...sandbox.__progressiveSpectrum('shape-fill')];
 if(shapeFillSpectrum.length<6||shapeFillSpectrum[0]!==8||shapeFillSpectrum.at(-1)!==28)throw new Error('Shape-and-fill family test must expose the full expanded 8–28 spectrum.');
 if(sandbox.__progressiveFamiliesAtStep(0).includes('shape-fill')||!sandbox.__progressiveFamiliesAtStep(9).includes('shape-fill'))throw new Error('The progressive overview must schedule shape-and-fill only once its calibrated range begins.');
 for(const target of [shapeFillSpectrum[0],shapeFillSpectrum.at(-1)]){
  const generatorTier=sandbox.__familyGeneratorTier('shape-fill',target),puzzle=sandbox.__makeBalancedPuzzle('family-spectrum-shape-fill|'+target,generatorTier,'shape-fill','mixed',undefined,{requestedDifficulty:target,targetDifficulty:target,generatorTier,progressive:true});
  verifyPuzzle(puzzle,{family:'shape-fill',target});
  if(puzzle.targetDifficulty!==target||puzzle.generator?.difficulty?.target!==target)throw new Error('Family spectrum target was not propagated for shape-and-fill '+target+'.');
 }
 const decimalSpectrum=[...sandbox.__progressiveRangeSpectrum(18.25,20.6)],expectedDecimalSpectrum=[18.25,19.25,20.25,20.6];
 if(JSON.stringify(decimalSpectrum)!==JSON.stringify(expectedDecimalSpectrum))throw new Error('Family spectrum does not preserve decimal endpoints.');
}
function xorCellsFromPositions(a,b){
 const state=Array(16).fill(1);
 const toggle=position=>{
  for(let y=0;y<4;y++)for(let x=0;x<4;x++){
   const covered=x>=position.x&&x<position.x+2&&y>=position.y&&y<position.y+2;
   if(covered)state[y*4+x]^=1;
  }
 };
 // Literal construction: start with all sixteen cells filled, then XOR each
 // moving 2×2 square. A double hit is toggled twice and stays filled.
 toggle(a);toggle(b);
 return state.flatMap((value,slot)=>value?[slot]:[]);
}
function verifyXorBinaryReference(){
 const expect=(actual,want,label)=>{
  if(JSON.stringify(actual)!==JSON.stringify(want))throw new Error('XOR binary reference failed for '+label+': got '+JSON.stringify(actual)+', expected '+JSON.stringify(want)+'.');
 };
 // In the supplied diagram, (3,3) denotes the lower-right 2×2 placement;
 // a 4×4 board stores that square by its legal top-left anchor, (2,2).
 expect(xorCellsFromPositions({x:0,y:0},{x:2,y:2}),[2,3,6,7,8,9,12,13],'opposite-corner squares');
 expect(xorCellsFromPositions({x:0,y:0},{x:1,y:0}),[1,3,5,7,8,9,10,11,12,13,14,15],'overlapping top-row squares');
}
function xorCellKey(tile){return (tile.cells||[]).slice().sort((left,right)=>left-right).join(',');}
function xorSamePosition(left,right){return left.x===right.x&&left.y===right.y;}
function xorRectangle(cells){
 if(!cells.length)return false;
 const columns=cells.map(slot=>slot%4),rows=cells.map(slot=>Math.floor(slot/4)),minX=Math.min(...columns),maxX=Math.max(...columns),minY=Math.min(...rows),maxY=Math.max(...rows);
 return cells.length===(maxX-minX+1)*(maxY-minY+1);
}
function xorMotionPositionAtPhase(motion,phase){
 if(motion.kind==='static')return motion.position;
 if(motion.kind==='circle'){
  const ring=[[0,0],[1,0],[2,0],[2,1],[2,2],[1,2],[0,2],[0,1]];
  return {x:ring[((motion.start+motion.direction*phase)%ring.length+ring.length)%ring.length][0],y:ring[((motion.start+motion.direction*phase)%ring.length+ring.length)%ring.length][1]};
 }
 if(motion.kind==='serpentine'){
  const base=[[0,0],[1,0],[2,0],[2,1],[1,1],[0,1],[0,2],[1,2],[2,2],[1,2],[0,2],[0,1],[1,1],[2,1],[2,0],[1,0]],path=motion.mirrorX?base.map(([x,y])=>[2-x,y]):base,index=((motion.start+motion.direction*phase)%path.length+path.length)%path.length;
  return {x:path[index][0],y:path[index][1]};
 }
 const bounce=[0,1,2,1][((motion.start+motion.direction*phase)%4+4)%4];
 return motion.axis==='horizontal'?{x:bounce,y:motion.fixed}:{x:motion.fixed,y:bounce};
}
function xorMotionPosition(motion,row,column){return xorMotionPositionAtPhase(motion,row*3+column);}
function xorMatrixPhase(model,slot){return (Number.isInteger(model.projectionPhase)?model.projectionPhase:8)-(8-slot);}
function xorSerpentineProjectionIsReadable(motion,targetPhase){
 if(motion.kind!=='serpentine')return true;
 const before=xorMotionPositionAtPhase(motion,targetPhase-2),previous=xorMotionPositionAtPhase(motion,targetPhase-1),current=xorMotionPositionAtPhase(motion,targetPhase),first={x:previous.x-before.x,y:previous.y-before.y},second={x:current.x-previous.x,y:current.y-previous.y};
 return Boolean(first.x||first.y)&&first.x===second.x&&first.y===second.y;
}
function xorSerpentineRetracesAtEnds(motion){
 if(motion.kind!=='serpentine')return true;
 const endpoints=motion.mirrorX?['2,0','0,2']:['0,0','2,2'],key=position=>position.x+','+position.y;
 for(let phase=0;phase<32;phase++){const previous=xorMotionPositionAtPhase(motion,phase-1),current=xorMotionPositionAtPhase(motion,phase),next=xorMotionPositionAtPhase(motion,phase+1);if(endpoints.includes(key(current))&&!xorSamePosition(previous,next))return false;}
 return true;
}
function xorMotionRespectsMomentum(motion){
 const lastDirection={x:0,y:0},edge=2;let previous=xorMotionPositionAtPhase(motion,0);
 for(let phase=1;phase<=32;phase++){
  const current=xorMotionPositionAtPhase(motion,phase),delta={x:current.x-previous.x,y:current.y-previous.y};
  if(Math.abs(delta.x)+Math.abs(delta.y)>1)return false;
  for(const axis of ['x','y']){const change=delta[axis];if(!change)continue;const direction=Math.sign(change);if(lastDirection[axis]&&direction!==lastDirection[axis]&&previous[axis]!==0&&previous[axis]!==edge)return false;lastDirection[axis]=direction}
  previous=current;
 }
 return true;
}
function xorMotionMatchesCanonicalPath(motion){
 const paths={circle:[[0,0],[1,0],[2,0],[2,1],[2,2],[1,2],[0,2],[0,1]],serpentine:[[0,0],[1,0],[2,0],[2,1],[1,1],[0,1],[0,2],[1,2],[2,2],[1,2],[0,2],[0,1],[1,1],[2,1],[2,0],[1,0]],linear:[0,1,2,1]};
 if(motion.kind==='static')return true;
 for(let phase=0;phase<32;phase++){
  const actual=xorMotionPositionAtPhase(motion,phase);let expected;
  if(motion.kind==='linear'){const value=paths.linear[((motion.start+motion.direction*phase)%paths.linear.length+paths.linear.length)%paths.linear.length];expected=motion.axis==='horizontal'?{x:value,y:motion.fixed}:{x:motion.fixed,y:value}}
  else{const base=paths[motion.kind];if(!base)return false;const path=motion.kind==='serpentine'&&motion.mirrorX?base.map(([x,y])=>[2-x,y]):base,point=path[((motion.start+motion.direction*phase)%path.length+path.length)%path.length];expected={x:point[0],y:point[1]}}
  if(!xorSamePosition(actual,expected))return false;
 }
 return true;
}
function verifyXorBlocksFamily(){
 const plans=[null,['static','linear'],['static','circle'],['linear','linear'],['circle','linear'],['serpentine','linear'],['serpentine','circle']];
 const starts=[new Set(),new Set()],circleDirections=new Set(),linearAxes=new Set(),serpentineDirections=new Set(),serpentineMirrors=new Set();let nonRectangularStates=0;
 for(let level=1;level<=6;level++)for(let variant=0;variant<24;variant++){
  const puzzle=sandbox.__makeBalancedPuzzle('xor-family-semantics|'+level+'|'+variant,level,'xor-blocks');
  verifyPuzzle(puzzle,{family:'xor-blocks',level,variant});
  const model=puzzle.generator?.xorBlocks;
  if(!model)throw new Error('XOR-block metadata is missing.');
  if(model.boardSize!==4||model.squareSize!==2)throw new Error('XOR-blocks must be two 2×2 squares on a fixed 4×4 board.');
  if(!Number.isInteger(model.projectionPhase))throw new Error('XOR-block projection phase is missing.');
  const expectedPlan=plans[level];
  if(model.first.kind!==expectedPlan[0]||model.second.kind!==expectedPlan[1])throw new Error('XOR-block movement plan does not match its tier.');
  const expectedMovers=level<=2?1:2;
  if(model.activeMovers!==expectedMovers)throw new Error('XOR-block active-mover count does not match its tier.');
  if(expectedMovers===2&&JSON.stringify(model.first)===JSON.stringify(model.second))throw new Error('Two moving XOR blocks must use distinct patterns.');
  for(const motion of [model.first,model.second]){
   if(!xorMotionMatchesCanonicalPath(motion))throw new Error('XOR-block motion is not one of the declared continuous canonical paths.');
   if(!xorMotionRespectsMomentum(motion))throw new Error('XOR-block motion reverses an axis before reaching the corresponding board edge.');
   if(!xorSerpentineRetracesAtEnds(motion))throw new Error('XOR-block serpentine path does not retrace immediately after an endpoint.');
   if(!xorSerpentineProjectionIsReadable(motion,model.projectionPhase))throw new Error('XOR-block missing panel follows a serpentine corner before its direction is visible.');
   if(motion.kind==='circle')circleDirections.add(motion.direction);
   if(motion.kind==='linear')linearAxes.add(motion.axis);
   if(motion.kind==='serpentine'){serpentineDirections.add(motion.direction);serpentineMirrors.add(Boolean(motion.mirrorX));}
  }
  const seenOptions=new Set();
  for(let row=0;row<3;row++)for(let column=0;column<3;column++){
   const slot=row*3+column,tile=puzzle.cells[slot];
   const first=xorMotionPositionAtPhase(model.first,xorMatrixPhase(model,slot)),second=xorMotionPositionAtPhase(model.second,xorMatrixPhase(model,slot));
   if(!xorSamePosition(tile.a,first)||!xorSamePosition(tile.b,second))throw new Error('XOR-block cell does not follow its declared motion.');
   if(slot>0)for(const [name,motion,current] of [['first',model.first,first],['second',model.second,second]]){
    const previousSlot=slot-1,previous=xorMotionPositionAtPhase(motion,xorMatrixPhase(model,previousSlot)),distance=Math.abs(current.x-previous.x)+Math.abs(current.y-previous.y);
    if(distance>1)throw new Error('XOR-block '+name+' jumps '+distance+' anchors between consecutive row-major matrix cells.');
   }
   const expected=xorCellsFromPositions(first,second),actual=xorCellKey(tile);
   if(actual!==expected.join(','))throw new Error('XOR-block cell does not render its filled-board two-toggle pattern.');
   if(xorSamePosition(first,second)&&expected.length!==16)throw new Error('Equal moving-square positions must return the full filled 4×4 board after two XOR toggles.');
   if(!xorRectangle(expected))nonRectangularStates++;
   if(slot===0){starts[0].add(first.x+','+first.y);starts[1].add(second.x+','+second.y);}
  }
  const solutionKey=xorCellKey(puzzle.options[puzzle.answer]);
  if(solutionKey!==xorCellKey(puzzle.cells[8]))throw new Error('XOR-block answer does not equal the projected missing cell.');
  for(let index=0;index<puzzle.options.length;index++){
   const key=xorCellKey(puzzle.options[index]);
   if(seenOptions.has(key))throw new Error('XOR-block answer options are visually duplicated.');
   seenOptions.add(key);
   if(index!==puzzle.answer&&key===solutionKey)throw new Error('XOR-block wrong answer has no visible difference.');
  }
  if(seenOptions.size!==8)throw new Error('XOR-block exercise must present eight visibly distinct options.');
 }
 if(starts.some(set=>set.size<3))throw new Error('XOR-block starting positions are not sufficiently varied across seeds.');
 if(!circleDirections.has(1)||!circleDirections.has(-1))throw new Error('XOR-block circles must cover both clockwise and counter-clockwise movement.');
 if(!linearAxes.has('horizontal')||!linearAxes.has('vertical'))throw new Error('XOR-block linear paths must cover both axes.');
 if(!serpentineDirections.has(1)||!serpentineDirections.has(-1))throw new Error('XOR-block serpentine paths must cover both directions.');
 if(!serpentineMirrors.has(true)||!serpentineMirrors.has(false))throw new Error('XOR-block serpentine paths must cover both horizontal mirror variants.');
 if(nonRectangularStates<120)throw new Error('XOR-block output has collapsed into rectangles instead of the source grid patterns.');
}
function laneCompose(after,before){return before.map(target=>after[target]);}
function laneIsMatching(mapping){return Array.isArray(mapping)&&mapping.length===3&&[...mapping].sort((a,b)=>a-b).join(',')==='0,1,2';}
function verifyLaneMatchingFamily(){
 const expectedVariants=['independent-rows','independent-rows','shared-vertical-orbit','local-edit-chain','counter-rotating-columns','counter-rotating-columns'],variants=new Set(),allMappings=new Set();
 for(let level=1;level<=6;level++)for(let variant=0;variant<24;variant++){
  const puzzle=sandbox.__makeBalancedPuzzle('lane-matching-semantics|'+level+'|'+variant,level,'lane-matching');
  verifyPuzzle(puzzle,{family:'lane-matching',level,variant});
  if(puzzle.options.length!==6||puzzle.answerOptionCount!==6)throw new Error('Three-lane matching must expose exactly the six legal one-to-one answers.');
  const model=puzzle.generator?.laneMatching;
  if(!model||model.lanes!==3||model.entryAndExitHorizontalFraction!==.15||model.rowClosure!=='inverse(second o first)')throw new Error('Three-lane generator metadata is incomplete.');
  if(model.variant!==expectedVariants[level-1])throw new Error('Three-lane variant does not match its tier.');
  variants.add(model.variant);
  const optionKeys=new Set();
  for(const option of puzzle.options){
   if(option?.kind!=='lane-matching'||!laneIsMatching(option.mapping))throw new Error('A three-lane answer is not a one-to-one matching.');
   const key=option.mapping.join(',');if(optionKeys.has(key))throw new Error('Three-lane answers contain a visual duplicate.');optionKeys.add(key);allMappings.add(key);
   const svg=sandbox.__renderFigure(option);if(svg.includes('<text'))throw new Error('Three-lane tiles must not expose internal A/B/C labels.');
   if(option.mapping.some((target,source)=>target!==source)&&(!svg.includes('H30.6')||!svg.includes(' 89.4 ')))throw new Error('A curved three-lane connection does not keep its 15% horizontal entry and exit.');
  }
  if(optionKeys.size!==6)throw new Error('Three-lane answers do not cover the full legal answer space.');
  for(let row=0;row<3;row++){
   const [first,second,third]=puzzle.cells.slice(row*3,row*3+3);
   if(![first,second,third].every(tile=>tile?.kind==='lane-matching'&&laneIsMatching(tile.mapping)))throw new Error('A matrix cell is not a valid three-lane matching.');
   if(laneCompose(third.mapping,laneCompose(second.mapping,first.mapping)).join(',')!=='0,1,2')throw new Error('A three-lane matrix row does not return every path to its original height.');
  }
  if(puzzle.options[puzzle.answer].mapping.join(',')!==puzzle.cells[8].mapping.join(','))throw new Error('The three-lane answer does not equal the missing visible matching.');
 }
 if(allMappings.size!==6)throw new Error('The three-lane family did not render all six legal matchings.');
 for(const required of new Set(expectedVariants))if(!variants.has(required))throw new Error('The three-lane family did not cover '+required+'.');
}

for(const {family,level,seed} of regressionCases)try{verifyPuzzle(sandbox.__makeBalancedPuzzle(seed,level,family),{family,level,seed})}catch(error){failures.push({family,level,seed,message:error.message})}
try{verifySingleExerciseDifficultySelection()}catch(error){failures.push({family:'single-exercise-difficulty-selection',message:error.message})}
try{verifyProgressivePlanning()}catch(error){failures.push({family:'progressive-test-planning',message:error.message})}
try{verifyXorBinaryReference()}catch(error){failures.push({family:'xor-blocks-binary-reference',message:error.message})}
try{verifyXorBlocksFamily()}catch(error){failures.push({family:'xor-blocks-semantics',message:error.message})}
try{verifyLaneMatchingFamily()}catch(error){failures.push({family:'lane-matching-semantics',message:error.message})}
for(const family of families)for(let level=1;level<=6;level++)for(let variant=0;variant<3;variant++){
 const seed='single-exercise|'+family+'|'+level+'|'+variant;
 try{verifyPuzzle(sandbox.__makeBalancedPuzzle(seed,level,family),{family,level,seed})}
 catch(error){failures.push({family,level,seed,message:error.message})}
}

console.log(JSON.stringify({puzzles,figures,failures},null,2));
if(failures.length)process.exitCode=1;
