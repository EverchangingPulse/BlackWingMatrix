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

const sandbox={console,window:{},document:{getElementById:()=>null,querySelector:()=>null,querySelectorAll:()=>[],createElement:()=>({}),body:{}},localStorage:{getItem:()=>null,setItem:()=>{}},navigator:{},setTimeout:()=>{},clearTimeout:()=>{},Math,JSON,Date};
sandbox.window=sandbox;
vm.createContext(sandbox);
vm.runInContext(core.slice(0,coreEnd)+'\n'+core.slice(practiceStart,practiceEnd)+'\nglobalThis.__makeBalancedPuzzle=makeBalancedPuzzle;globalThis.__makePracticePuzzle=makePracticePuzzle;globalThis.__practiceRange=difficultyRangeForTier;globalThis.__practiceScore=practiceDifficultyForSeed;globalThis.__renderFigure=renderFigure;',sandbox);

const families=['custom','logical','affine','outline','outline-relations','marker-grid','carrier-token','dot-arrangement','line-assembly','spatial-tokens','grid-logic','ternary-carry','polyomino','shape-fill','split-fill','symbol-order','composition','spoke-pattern','motif-count','radial-flower','fill-grid','paired-polygons','block-balance','axis-symbols','horizontal-anchors','dot-balance','line-xor','line-perimeter-logic','operator-transfer','minkowski-dilation','convex-hull','kronecker-product','cartesian-product','reference-mix','mixed','simple','progression','cycle'];
const regressionCases=[{family:'custom',level:1,seed:'single-render-custom-1-2'}];
const failures=[];
let puzzles=0,figures=0;

function verifyPuzzle(puzzle,context){
 if(!Array.isArray(puzzle.cells)||puzzle.cells.length!==9)throw new Error('Expected nine matrix cells.');
 if(!Array.isArray(puzzle.options)||puzzle.options.length!==8)throw new Error('Expected eight answers.');
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

for(const {family,level,seed} of regressionCases)try{verifyPuzzle(sandbox.__makeBalancedPuzzle(seed,level,family),{family,level,seed})}catch(error){failures.push({family,level,seed,message:error.message})}
try{verifySingleExerciseDifficultySelection()}catch(error){failures.push({family:'single-exercise-difficulty-selection',message:error.message})}
for(const family of families)for(let level=1;level<=6;level++)for(let variant=0;variant<3;variant++){
 const seed='single-exercise|'+family+'|'+level+'|'+variant;
 try{verifyPuzzle(sandbox.__makeBalancedPuzzle(seed,level,family),{family,level,seed})}
 catch(error){failures.push({family,level,seed,message:error.message})}
}

console.log(JSON.stringify({puzzles,figures,failures},null,2));
if(failures.length)process.exitCode=1;
