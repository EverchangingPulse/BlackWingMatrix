#!/usr/bin/env node
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const source=fs.readFileSync(new URL('../index.html',import.meta.url),'utf8');
const scripts=[...source.matchAll(/<script(?:[^>]*)>([\s\S]*?)<\/script>/g)].map(x=>x[1]);
const core=scripts[0],extra=scripts.find(s=>s.includes('HUMAN_EXPLANATION_COPY'));
const ctx={console,window:{},document:{getElementById:()=>null,querySelector:()=>null,querySelectorAll:()=>[]},localStorage:{getItem:()=>null},navigator:{},setTimeout:()=>{},clearTimeout:()=>{}};
ctx.window=ctx;vm.createContext(ctx);
vm.runInContext(core.slice(0,core.indexOf('let puzzle,selected=-1'))+'\n'+extra.slice(extra.indexOf('const explanationLinesBeforeGlossary'),extra.indexOf('\nfunction localizeAbout()'))+'\nObject.assign(globalThis,{make:makePuzzle,guide:explanationLines,diagnosis:answerDifferenceLines,facts:compositionReasoning,carrierFacts:carrierTokenReasoning,setLanguage:x=>activeLanguage=x});',ctx);
const languages=['it','en','fr','de','es','pt','nl','pl'];
let tested=0;
const parts=(tile,kind)=>tile.parts.find(p=>p.kind===kind);
for(let level=1;level<=6;level++)for(let seed=0;seed<12;seed++){
 const puzzle=ctx.make('composition-explanation|'+seed,level,'composition');
 const expectedShape=parts(puzzle.cells[6],'shape'),expectedMark=parts(puzzle.cells[7],'mark');
 assert.deepEqual(parts(puzzle.options[puzzle.answer],'shape'),expectedShape);
 assert.deepEqual(parts(puzzle.options[puzzle.answer],'mark'),expectedMark);
 for(const language of languages){
  ctx.setLanguage(language);
  for(let index=0;index<puzzle.options.length;index++){
   const paragraphs=ctx.guide(puzzle,index),diagnosis=ctx.diagnosis(puzzle,index);
   assert.ok(paragraphs.length>=3);
   assert.doesNotMatch(paragraphs.concat(diagnosis).join(' '),/undefined|null|\{\w+\}|senza bisogno|prendere quadrato/);
   const actual=ctx.facts(puzzle,index).differences;
   assert.equal(actual.length===0,index===puzzle.answer);
   assert.equal(diagnosis.length===0,index===puzzle.answer);
   tested++;
  }
 }
 // Compound errors must not be called a near miss or stop at the first field.
 const broken=JSON.parse(JSON.stringify(puzzle)),wrong=broken.answer===0?1:0;
 broken.options[wrong]=JSON.parse(JSON.stringify(broken.options[broken.answer]));
 parts(broken.options[wrong],'shape').fill='gray';
 broken.options[wrong].parts=broken.options[wrong].parts.filter(p=>p.kind!=='mark');
 ctx.setLanguage('it');
 assert.equal(ctx.facts(broken,wrong).differences.length,2);
 const diagnosis=ctx.diagnosis(broken,wrong).join(' ');
 assert.doesNotMatch(diagnosis,/Ci sei quasi/);
 assert.match(diagnosis,/riempimento/);
 assert.match(diagnosis,/manca il simbolo/);
 // Do not justify a stored answer when visible inputs contradict it.
 const inconsistent=JSON.parse(JSON.stringify(puzzle));
 parts(inconsistent.options[inconsistent.answer],'shape').fill='gray';
 assert.throws(()=>ctx.guide(inconsistent,inconsistent.answer),/contradicts the visible inputs/);
}
console.log(JSON.stringify({family:'composition',levels:6,seedsPerLevel:12,languages:8,answerExplanations:tested,compoundErrors:'passed',contradictoryAnswer:'rejected'},null,2));
let carrierTested=0;
vm.runInContext('globalThis.gridFacts=copiedGridReasoning;',ctx);
for(let level=1;level<=6;level++)for(let seed=0;seed<12;seed++){
 const puzzle=ctx.make('carrier-explanation|'+seed,level,'carrier-token');
 const expected={carrier:puzzle.cells[6].carrier,token:puzzle.cells[2].token,outerFill:level<3?puzzle.cells[0].outerFill:puzzle.cells[1].outerFill};
 for(const key of Object.keys(expected))assert.equal(puzzle.options[puzzle.answer][key],expected[key]);
 // The hidden ninth cell must never serve as evidence for the explanation.
 puzzle.cells[8]={};
 for(const language of languages){
  ctx.setLanguage(language);
  for(let index=0;index<puzzle.options.length;index++){
   const guide=ctx.guide(puzzle,index),diagnosis=ctx.diagnosis(puzzle,index);
   assert.equal(guide.length,4);
   assert.doesNotMatch(guide.concat(diagnosis).join(' '),/undefined|null|\{\w+\}|cerchio bianca|;\s*(?:white|bianco|dot)/);
   const facts=ctx.carrierFacts(puzzle,index);
   assert.equal(facts.constant,level<3);
   assert.equal(facts.differences.length===0,index===puzzle.answer);
   assert.equal(diagnosis.length===0,index===puzzle.answer);
   carrierTested++;
  }
 }
 const broken=JSON.parse(JSON.stringify(puzzle)),wrong=broken.answer===0?1:0;
 broken.options[wrong]={...broken.options[broken.answer],carrier:'star',token:'square',outerFill:'cross'};
 ctx.setLanguage('it');
 assert.equal(ctx.carrierFacts(broken,wrong).differences.length,3);
 const diagnosis=ctx.diagnosis(broken,wrong).join(' ');
 assert.doesNotMatch(diagnosis,/Ci sei quasi/);
 for(const term of ['riga','colonna','riempimento'])assert.ok(diagnosis.includes(term));
 const inconsistent=JSON.parse(JSON.stringify(puzzle));
 inconsistent.options[inconsistent.answer].carrier='star';
 assert.throws(()=>ctx.guide(inconsistent),/contradicts the visible inputs/);
 const invalidEvidence=JSON.parse(JSON.stringify(puzzle));
 invalidEvidence.cells[5].token='square';
 assert.throws(()=>ctx.guide(invalidEvidence),/visible evidence breaks/);
}
console.log(JSON.stringify({family:'carrier-token',levels:6,seedsPerLevel:12,languages:8,answerExplanations:carrierTested,compoundErrors:'passed',hiddenAnswer:'not used',contradictoryAnswer:'rejected'},null,2));
vm.runInContext('globalThis.outlineFacts=outlineRelationsReasoning;',ctx);
let outlineTested=0;
for(let level=1;level<=6;level++)for(let seed=0;seed<12;seed++){
 const puzzle=ctx.make('outline-explanation|'+seed,level,'outline-relations');
 puzzle.cells[8]={};
 for(const language of languages){
  ctx.setLanguage(language);
  for(let index=0;index<puzzle.options.length;index++){
   const guide=ctx.guide(puzzle,index),diagnosis=ctx.diagnosis(puzzle,index),facts=ctx.outlineFacts(puzzle,index);
   assert.equal(guide.length,level===1?4:5);
   assert.doesNotMatch(guide.concat(diagnosis).join(' '),/undefined|null|\{\w+\}|\b(?:carrier|bead|token)\b|a arrow/);
   assert.equal(facts.differences.length===0,index===puzzle.answer);
   assert.equal(diagnosis.length===0,index===puzzle.answer);
   outlineTested++;
  }
 }
 const wrong=puzzle.options.findIndex(t=>t.carrier!==puzzle.options[puzzle.answer].carrier&&t.bead===puzzle.options[puzzle.answer].bead&&t.fill===puzzle.options[puzzle.answer].fill);
 assert.ok(wrong>=0);
 ctx.setLanguage('it');
 const diagnosis=ctx.diagnosis(puzzle,wrong).join(' ');
 assert.match(diagnosis,/contorno/);
 assert.doesNotMatch(diagnosis,/piccole figure scelte hanno la forma sbagliata/);
 const inconsistent=JSON.parse(JSON.stringify(puzzle));
 inconsistent.options[inconsistent.answer].fill='invalid';
 assert.throws(()=>ctx.guide(inconsistent),/contradicts the visible inputs/);
}
console.log(JSON.stringify({family:'outline-relations',levels:6,seedsPerLevel:12,languages:8,answerExplanations:outlineTested,outlineOnlyError:'correctly identified',hiddenAnswer:'not used',contradictoryAnswer:'rejected'},null,2));
for(const family of ['kronecker-product','minkowski-dilation']){
 let gridTested=0;
 for(let level=1;level<=6;level++)for(let seed=0;seed<6;seed++){
  const puzzle=ctx.make('grid-explanation|'+seed,level,family),correct=puzzle.options[puzzle.answer];
  puzzle.cells[8]={};
  for(const language of languages){
   ctx.setLanguage(language);
   for(let index=0;index<puzzle.options.length;index++){
    const guide=ctx.guide(puzzle,index),diagnosis=ctx.diagnosis(puzzle,index),facts=ctx.gridFacts(puzzle,index);
    assert.equal(guide.length,3);
    assert.doesNotMatch(guide.concat(diagnosis).join(' '),/undefined|null|\{\w+\}|\b(?:Kronecker|Minkowski|cells|slot)\b/);
    assert.equal(facts.differences===0,index===puzzle.answer);
    assert.equal(diagnosis.length===0,index===puzzle.answer);
    gridTested++;
   }
  }
  const broken=JSON.parse(JSON.stringify(puzzle)),wrong=broken.answer===0?1:0;
  const removed=correct.cells[0],added=Array.from({length:correct.n**2},(_,i)=>i).find(i=>!correct.cells.includes(i));
  broken.options[wrong]={...correct,cells:correct.cells.filter(i=>i!==removed).concat(added)};
  ctx.setLanguage('it');
  const facts=ctx.gridFacts(broken,wrong),text=ctx.diagnosis(broken,wrong).join(' ');
  assert.equal(facts.differences,2);
  assert.ok(facts.missing.includes(removed)&&facts.extra.includes(added));
  assert.doesNotMatch(text,/Ci sei quasi/);
  assert.match(text,/manca il quadratino/);
  assert.match(text,/bianco/);
  const inconsistent=JSON.parse(JSON.stringify(puzzle));
  inconsistent.options[inconsistent.answer].cells.pop();
  assert.throws(()=>ctx.guide(inconsistent),/contradicts the visible inputs/);
 }
 console.log(JSON.stringify({family,levels:6,seedsPerLevel:6,languages:8,answerExplanations:gridTested,compoundErrors:'passed',hiddenAnswer:'not used',contradictoryAnswer:'rejected'},null,2));
}
vm.runInContext('globalThis.shapeFillFacts=shapeFillReasoning; globalThis.splitFillFacts=splitFillReasoning;',ctx);
for(const family of ['shape-fill','split-fill']){
 let cycleTested=0;
 for(let level=1;level<=6;level++)for(let seed=0;seed<12;seed++){
  const puzzle=ctx.make('cycle-explanation|'+seed,level,family),factsFn=family==='shape-fill'?ctx.shapeFillFacts:ctx.splitFillFacts;
  puzzle.cells[8]={};
  for(const language of languages){
   ctx.setLanguage(language);
   for(let index=0;index<puzzle.options.length;index++){
    const guide=ctx.guide(puzzle,index),diagnosis=ctx.diagnosis(puzzle,index),facts=factsFn(puzzle,index);
    assert.equal(guide.length,family==='shape-fill'&&level>=4?4:3);
    assert.doesNotMatch(guide.concat(diagnosis).join(' '),/undefined|null|\{\w+\}|\b(?:shape|fill|rotation|direction)\s*:/i);
    assert.equal(facts.differences.length===0,index===puzzle.answer);
    assert.equal(diagnosis.length===0,index===puzzle.answer);
    cycleTested++;
   }
  }
  const broken=JSON.parse(JSON.stringify(puzzle)),wrong=broken.answer===0?1:0;
  broken.options[wrong]=JSON.parse(JSON.stringify(broken.options[broken.answer]));
  if(family==='shape-fill'){broken.options[wrong].shape=broken.options[wrong].shape==='star'?'circle':'star';broken.options[wrong].fill=broken.options[wrong].fill==='white'?'gray':'white';if(level>=4)broken.options[wrong].rotation=(broken.options[wrong].rotation+45)%360}
  else {broken.options[wrong].direction=(broken.options[wrong].direction+1)%4;broken.options[wrong].fill=broken.options[wrong].fill==='white'?'gray':'white'};
  ctx.setLanguage('it');
  const facts=factsFn(broken,wrong),text=ctx.diagnosis(broken,wrong).join(' ');
  assert.ok(facts.differences.length>=2);
  assert.doesNotMatch(text,/Ci sei quasi/);
  const inconsistent=JSON.parse(JSON.stringify(puzzle));
  inconsistent.options[inconsistent.answer].fill=inconsistent.options[inconsistent.answer].fill==='white'?'gray':'white';
  assert.throws(()=>ctx.guide(inconsistent),/contradicts the visible inputs/);
 }
 console.log(JSON.stringify({family,levels:6,seedsPerLevel:12,languages:8,answerExplanations:cycleTested,compoundErrors:'passed',hiddenAnswer:'not used',contradictoryAnswer:'rejected'},null,2));
}
vm.runInContext('globalThis.markerFacts=markerGridReasoning;',ctx);
let markerTested=0;
for(let level=1;level<=6;level++)for(let seed=0;seed<12;seed++){
 const puzzle=ctx.make('marker-explanation|'+seed,level,'marker-grid');
 puzzle.cells[8]={};
 for(const language of languages){
  ctx.setLanguage(language);
  for(let index=0;index<puzzle.options.length;index++){
   const guide=ctx.guide(puzzle,index),diagnosis=ctx.diagnosis(puzzle,index),facts=ctx.markerFacts(puzzle,index);
   assert.equal(guide.length,3);
   assert.doesNotMatch(guide.concat(diagnosis).join(' '),/undefined|null|\{\w+\}|\b(?:cells|slots)\b/i);
   assert.equal(facts.differences===0,index===puzzle.answer);
   assert.equal(diagnosis.length===0,index===puzzle.answer);
   markerTested++;
  }
 }
 const broken=JSON.parse(JSON.stringify(puzzle)),wrong=broken.answer===0?1:0,correct=broken.options[broken.answer];
 const missing=correct.cells[0],extra=Array.from({length:9},(_,i)=>i).find(i=>!correct.cells.includes(i));
 broken.options[wrong]={...correct,cells:correct.cells.filter(slot=>slot!==missing).concat(extra)};
 ctx.setLanguage('it');
 const facts=ctx.markerFacts(broken,wrong),text=ctx.diagnosis(broken,wrong).join(' ');
 assert.equal(facts.differences,2);assert.match(text,/Manca un quadratino nero/);assert.match(text,/non può esserci/);assert.doesNotMatch(text,/Ci sei quasi/);
 const inconsistent=JSON.parse(JSON.stringify(puzzle));
 inconsistent.options[inconsistent.answer].cells=[0];
 assert.throws(()=>ctx.guide(inconsistent),/contradicts the visible inputs/);
}
console.log(JSON.stringify({family:'marker-grid',levels:6,seedsPerLevel:12,languages:8,answerExplanations:markerTested,compoundErrors:'passed',hiddenAnswer:'not used',contradictoryAnswer:'rejected'},null,2));
vm.runInContext('globalThis.spatialFacts=spatialTokensReasoning;',ctx);
let spatialTested=0;
for(let level=1;level<=6;level++)for(let seed=0;seed<12;seed++){
 const puzzle=ctx.make('spatial-explanation|'+seed,level,'spatial-tokens');
 puzzle.cells[8]={};
 for(const language of languages){
  ctx.setLanguage(language);
  for(let index=0;index<puzzle.options.length;index++){
   const guide=ctx.guide(puzzle,index),diagnosis=ctx.diagnosis(puzzle,index),facts=ctx.spatialFacts(puzzle,index);
   assert.equal(guide.length,5);
   assert.doesNotMatch(guide.concat(diagnosis).join(' '),/undefined|null|\{\w+\}|\b(?:marks|point)\s*:/i);
   assert.equal(facts.differences.length===0,index===puzzle.answer);
   assert.equal(diagnosis.length===0,index===puzzle.answer);
   spatialTested++;
  }
 }
 const broken=JSON.parse(JSON.stringify(puzzle)),wrong=broken.answer===0?1:0,correct=broken.options[broken.answer];
 broken.options[wrong]=JSON.parse(JSON.stringify(correct));
 broken.options[wrong].marks[0].point=[1,-1];broken.options[wrong].marks[1].point=[1,1];broken.options[wrong].marks[1].fill=broken.options[wrong].marks[1].fill==='white'?'gray':'white';
 ctx.setLanguage('it');
 const facts=ctx.spatialFacts(broken,wrong),text=ctx.diagnosis(broken,wrong).join(' ');
 assert.ok(facts.differences.length>=2);assert.match(text,/punto nero scelto/);assert.match(text,/quadratino scelto/);assert.doesNotMatch(text,/Ci sei quasi/);
 const inconsistent=JSON.parse(JSON.stringify(puzzle));
 inconsistent.options[inconsistent.answer].marks[0].type='ring';
 assert.throws(()=>ctx.guide(inconsistent),/contradicts the visible inputs/);
}
console.log(JSON.stringify({family:'spatial-tokens',levels:6,seedsPerLevel:12,languages:8,answerExplanations:spatialTested,compoundErrors:'passed',hiddenAnswer:'not used',contradictoryAnswer:'rejected'},null,2));
vm.runInContext('globalThis.symbolFacts=symbolOrderReasoning;',ctx);
let symbolsTested=0;
for(let level=1;level<=6;level++)for(let seed=0;seed<12;seed++){
 const puzzle=ctx.make('symbols-explanation|'+seed,level,'symbol-order');
 puzzle.cells[8]={};
 for(const language of languages){
  ctx.setLanguage(language);
  for(let index=0;index<puzzle.options.length;index++){
   const guide=ctx.guide(puzzle,index),diagnosis=ctx.diagnosis(puzzle,index),facts=ctx.symbolFacts(puzzle,index);
   assert.equal(guide.length,level>=4?3:2);
   assert.doesNotMatch(guide.concat(diagnosis).join(' '),/undefined|null|\{\w+\}|\bitems\b/i);
   assert.equal(facts.differences.length===0,index===puzzle.answer);
   assert.equal(diagnosis.length===0,index===puzzle.answer);
   symbolsTested++;
  }
 }
 const broken=JSON.parse(JSON.stringify(puzzle)),wrong=broken.answer===0?1:0,correct=broken.options[broken.answer];
 broken.options[wrong]=JSON.parse(JSON.stringify(correct));broken.options[wrong].items=[...correct.items].reverse();if(level>=4)broken.options[wrong].fill=correct.fill==='white'?'gray':'white';
 ctx.setLanguage('it');
 const facts=ctx.symbolFacts(broken,wrong),text=ctx.diagnosis(broken,wrong).join(' ');
 assert.ok(facts.differences.length>=1);assert.match(text,/ordine scelto/);if(level>=4)assert.match(text,/riempimento scelto/);
 const inconsistent=JSON.parse(JSON.stringify(puzzle));inconsistent.options[inconsistent.answer].items.reverse();
 assert.throws(()=>ctx.guide(inconsistent),/contradicts the visible inputs/);
}
console.log(JSON.stringify({family:'symbol-order',levels:6,seedsPerLevel:12,languages:8,answerExplanations:symbolsTested,compoundErrors:'passed',hiddenAnswer:'not used',contradictoryAnswer:'rejected'},null,2));
vm.runInContext('globalThis.dotFacts=dotArrangementReasoning;',ctx);
let dotsTested=0;
for(let level=1;level<=6;level++)for(let seed=0;seed<12;seed++){
 const puzzle=ctx.make('dots-explanation|'+seed,level,'dot-arrangement');
 puzzle.cells[8]={};
 for(const language of languages){
  ctx.setLanguage(language);
  for(let index=0;index<puzzle.options.length;index++){
   const guide=ctx.guide(puzzle,index),diagnosis=ctx.diagnosis(puzzle,index),facts=ctx.dotFacts(puzzle,index);
   assert.equal(guide.length,4);
   assert.doesNotMatch(guide.concat(diagnosis).join(' '),/undefined|null|\{\w+\}|\bpoints\s*:/i);
   assert.equal(facts.differences.length===0,index===puzzle.answer);
   assert.equal(diagnosis.length===0,index===puzzle.answer);
   dotsTested++;
  }
 }
 const broken=JSON.parse(JSON.stringify(puzzle)),wrong=broken.answer===0?1:0,correct=broken.options[broken.answer];
 broken.options[wrong]=JSON.parse(JSON.stringify(correct));broken.options[wrong].points=correct.points.slice(0,-1);broken.options[wrong].dotType=correct.dotType==='dot'?'ring':'dot';
 ctx.setLanguage('it');
 const facts=ctx.dotFacts(broken,wrong),text=ctx.diagnosis(broken,wrong).join(' ');
 assert.equal(facts.differences.length,2);assert.match(text,/disposizione scelta/);assert.match(text,/stile scelto/);assert.doesNotMatch(text,/Ci sei quasi/);
 const inconsistent=JSON.parse(JSON.stringify(puzzle));inconsistent.options[inconsistent.answer].points.pop();
 assert.throws(()=>ctx.guide(inconsistent),/contradicts the visible inputs/);
}
console.log(JSON.stringify({family:'dot-arrangement',levels:6,seedsPerLevel:12,languages:8,answerExplanations:dotsTested,compoundErrors:'passed',hiddenAnswer:'not used',contradictoryAnswer:'rejected'},null,2));
vm.runInContext('globalThis.lineFacts=lineAssemblyReasoning;',ctx);
let linesTested=0;
for(let level=1;level<=6;level++)for(let seed=0;seed<12;seed++){
 const puzzle=ctx.make('line-assembly-explanation|'+seed,level,'line-assembly');
 puzzle.cells[8]={};
 for(const language of languages){
  ctx.setLanguage(language);
  for(let index=0;index<puzzle.options.length;index++){
   const guide=ctx.guide(puzzle,index),diagnosis=ctx.diagnosis(puzzle,index),facts=ctx.lineFacts(puzzle,index);
   assert.equal(guide.length,4);
   assert.doesNotMatch(guide.concat(diagnosis).join(' '),/undefined|null|\{\w+\}|\b(?:segments|marks|endpoint)\b/i);
   assert.equal(facts.differences.length===0,index===puzzle.answer);
   assert.equal(diagnosis.length===0,index===puzzle.answer);
   linesTested++;
  }
 }
 const broken=JSON.parse(JSON.stringify(puzzle)),wrong=broken.answer===0?1:0,correct=broken.options[broken.answer];
 broken.options[wrong]=JSON.parse(JSON.stringify(correct));
 broken.options[wrong].segments=correct.segments.slice(0,2);
 broken.options[wrong].marks[0].type=correct.marks[0].type==='dot'?'square':'dot';
 broken.options[wrong].marks[0].point=[0,0];
 ctx.setLanguage('it');
 const facts=ctx.lineFacts(broken,wrong),text=ctx.diagnosis(broken,wrong).join(' ');
 assert.equal(facts.differences.length,3);assert.match(text,/bracci scelti/);assert.match(text,/piccolo segno scelto/);assert.doesNotMatch(text,/Ci sei quasi/);
 const inconsistent=JSON.parse(JSON.stringify(puzzle));
 inconsistent.options[inconsistent.answer].segments=[];
 assert.throws(()=>ctx.guide(inconsistent),/contradicts visible inputs/);
}
console.log(JSON.stringify({family:'line-assembly',levels:6,seedsPerLevel:12,languages:8,answerExplanations:linesTested,compoundErrors:'passed',hiddenAnswer:'not used',contradictoryAnswer:'rejected'},null,2));
vm.runInContext('globalThis.spokeFacts=spokePatternReasoning;',ctx);
let spokesTested=0;
for(let level=1;level<=6;level++)for(let seed=0;seed<12;seed++){
 const puzzle=ctx.make('spoke-pattern-explanation|'+seed,level,'spoke-pattern');
 puzzle.cells[8]={};
 for(const language of languages){
  ctx.setLanguage(language);
  for(let index=0;index<puzzle.options.length;index++){
   const guide=ctx.guide(puzzle,index),diagnosis=ctx.diagnosis(puzzle,index),facts=ctx.spokeFacts(puzzle,index);
   assert.equal(guide.length,4);
   assert.doesNotMatch(guide.concat(diagnosis).join(' '),/undefined|null|\{\w+\}|\b(?:segments|marks|slots|cells)\b/i);
   assert.equal(facts.differences.length===0,index===puzzle.answer);
   assert.equal(diagnosis.length===0,index===puzzle.answer);
   spokesTested++;
  }
 }
 const broken=JSON.parse(JSON.stringify(puzzle)),wrong=broken.answer===0?1:0,correct=broken.options[broken.answer];
 broken.options[wrong]=JSON.parse(JSON.stringify(correct));
 broken.options[wrong].segments=correct.segments.slice(0,-1);
 broken.options[wrong].marks=[{type:'ring',point:[0,0],fill:'solid'}];
 ctx.setLanguage('it');
 const facts=ctx.spokeFacts(broken,wrong),text=ctx.diagnosis(broken,wrong).join(' ');
 assert.equal(facts.differences.length,2);assert.match(text,/numero di raggi scelto/);assert.match(text,/punto centrale/);assert.doesNotMatch(text,/Ci sei quasi/);
 const inconsistent=JSON.parse(JSON.stringify(puzzle));
 inconsistent.options[inconsistent.answer].segments=[];
 assert.throws(()=>ctx.guide(inconsistent),/contradicts visible inputs/);
}
console.log(JSON.stringify({family:'spoke-pattern',levels:6,seedsPerLevel:12,languages:8,answerExplanations:spokesTested,compoundErrors:'passed',hiddenAnswer:'not used',contradictoryAnswer:'rejected'},null,2));
vm.runInContext('globalThis.motifFacts=motifCountReasoning;',ctx);
let motifsTested=0;
for(let level=1;level<=6;level++)for(let seed=0;seed<12;seed++){
 const puzzle=ctx.make('motif-count-explanation|'+seed,level,'motif-count');
 puzzle.cells[8]={};
 for(const language of languages){
  ctx.setLanguage(language);
  for(let index=0;index<puzzle.options.length;index++){
   const guide=ctx.guide(puzzle,index),diagnosis=ctx.diagnosis(puzzle,index),facts=ctx.motifFacts(puzzle,index);
   assert.equal(guide.length,4);
   assert.doesNotMatch(guide.concat(diagnosis).join(' '),/undefined|null|\{\w+\}|\b(?:items|cells|slots)\b/i);
   assert.equal(facts.differences.length===0,index===puzzle.answer);
   assert.equal(diagnosis.length===0,index===puzzle.answer);
   motifsTested++;
  }
 }
 const broken=JSON.parse(JSON.stringify(puzzle)),wrong=broken.answer===0?1:0,correct=broken.options[broken.answer];
 broken.options[wrong]=JSON.parse(JSON.stringify(correct));
 broken.options[wrong].items=correct.items.slice(0,-1);
 broken.options[wrong].fill=correct.fill==='solid'?'gray':'solid';
 ctx.setLanguage('it');
 const facts=ctx.motifFacts(broken,wrong),text=ctx.diagnosis(broken,wrong).join(' ');
 assert.equal(facts.differences.length,2);assert.match(text,/numero di figure scelto/);assert.match(text,/riempimento scelto/);assert.doesNotMatch(text,/Ci sei quasi/);
 const inconsistent=JSON.parse(JSON.stringify(puzzle));
 inconsistent.options[inconsistent.answer].items=[];
 assert.throws(()=>ctx.guide(inconsistent),/contradicts visible inputs/);
}
console.log(JSON.stringify({family:'motif-count',levels:6,seedsPerLevel:12,languages:8,answerExplanations:motifsTested,compoundErrors:'passed',hiddenAnswer:'not used',contradictoryAnswer:'rejected'},null,2));
vm.runInContext('globalThis.polyFacts=polyominoReasoning;',ctx);
let polyTested=0;
for(let level=1;level<=6;level++)for(let seed=0;seed<12;seed++){
 const puzzle=ctx.make('polyomino-explanation|'+seed,level,'polyomino');
 puzzle.cells[8]={};
 for(const language of languages){
  ctx.setLanguage(language);
  for(let index=0;index<puzzle.options.length;index++){
   const guide=ctx.guide(puzzle,index),diagnosis=ctx.diagnosis(puzzle,index),facts=ctx.polyFacts(puzzle,index);
   assert.equal(guide.length,4);
   assert.doesNotMatch(guide.concat(diagnosis).join(' '),/undefined|null|\{\w+\}|\b(?:cells|slots|polyomino)\b/i);
   assert.equal(facts.differences.length===0,index===puzzle.answer);
   assert.equal(diagnosis.length===0,index===puzzle.answer);
   polyTested++;
  }
 }
 const broken=JSON.parse(JSON.stringify(puzzle)),wrong=broken.answer===0?1:0,correct=broken.options[broken.answer];
 broken.options[wrong]=JSON.parse(JSON.stringify(correct));
 broken.options[wrong].cells=correct.cells.slice(0,-1);
 broken.options[wrong].fill=correct.fill==='solid'?'gray':'solid';
 ctx.setLanguage('it');
 const facts=ctx.polyFacts(broken,wrong),text=ctx.diagnosis(broken,wrong).join(' ');
 assert.equal(facts.differences.length,2);assert.match(text,/figura scelta non contiene/);assert.match(text,/riempimento scelto/);assert.doesNotMatch(text,/Ci sei quasi/);
 const inconsistent=JSON.parse(JSON.stringify(puzzle));
 inconsistent.options[inconsistent.answer].cells=[];
 assert.throws(()=>ctx.guide(inconsistent),/contradicts visible inputs/);
}
console.log(JSON.stringify({family:'polyomino',levels:6,seedsPerLevel:12,languages:8,answerExplanations:polyTested,compoundErrors:'passed',hiddenAnswer:'not used',contradictoryAnswer:'rejected'},null,2));
vm.runInContext('globalThis.cartesianFacts=cartesianReasoning;',ctx);
let cartesianTested=0;
for(let level=1;level<=6;level++)for(let seed=0;seed<12;seed++){
 const puzzle=ctx.make('cartesian-explanation|'+seed,level,'cartesian-product');
 puzzle.cells[8]={};
 for(const language of languages){
  ctx.setLanguage(language);
  for(let index=0;index<puzzle.options.length;index++){
   const guide=ctx.guide(puzzle,index),diagnosis=ctx.diagnosis(puzzle,index),facts=ctx.cartesianFacts(puzzle,index);
   assert.equal(guide.length,3);
   assert.doesNotMatch(guide.concat(diagnosis).join(' '),/undefined|null|\{\w+\}|\b(?:xValues|yValues|span|cells)\b/i);
   assert.equal(facts.differences.length===0,index===puzzle.answer);
   assert.equal(diagnosis.length===0,index===puzzle.answer);
   cartesianTested++;
  }
 }
 const broken=JSON.parse(JSON.stringify(puzzle)),wrong=broken.answer===0?1:0,correct=broken.options[broken.answer];
 broken.options[wrong]=JSON.parse(JSON.stringify(correct));
 broken.options[wrong].xValues=correct.xValues.slice(0,-1);
 broken.options[wrong].yValues=correct.yValues.slice(0,-1);
 ctx.setLanguage('it');
 const facts=ctx.cartesianFacts(broken,wrong),text=ctx.diagnosis(broken,wrong).join(' ');
 assert.equal(facts.differences.length,2);assert.match(text,/colonne usate/);assert.match(text,/righe usate/);assert.doesNotMatch(text,/Ci sei quasi/);
 const inconsistent=JSON.parse(JSON.stringify(puzzle));
 inconsistent.options[inconsistent.answer].xValues=[];
 assert.throws(()=>ctx.guide(inconsistent),/contradicts visible inputs/);
}
console.log(JSON.stringify({family:'cartesian-product',levels:6,seedsPerLevel:12,languages:8,answerExplanations:cartesianTested,compoundErrors:'passed',hiddenAnswer:'not used',contradictoryAnswer:'rejected'},null,2));
vm.runInContext('globalThis.balanceFacts=blockBalanceReasoning;',ctx);
let balancesTested=0;
for(let level=1;level<=6;level++)for(let seed=0;seed<12;seed++){
 const puzzle=ctx.make('block-balance-explanation|'+seed,level,'block-balance');
 puzzle.cells[8]={};
 for(const language of languages){
  ctx.setLanguage(language);
  for(let index=0;index<puzzle.options.length;index++){
   const guide=ctx.guide(puzzle,index),diagnosis=ctx.diagnosis(puzzle,index),facts=ctx.balanceFacts(puzzle,index);
   assert.equal(guide.length,3);
   assert.doesNotMatch(guide.concat(diagnosis).join(' '),/\bundefined\b|\bnull\b|\{\w+\}|\b(?:values|slots|channels)\b/i);
   assert.equal(facts.differences.length===0,index===puzzle.answer);
   assert.equal(diagnosis.length===0,index===puzzle.answer);
   balancesTested++;
  }
 }
 const broken=JSON.parse(JSON.stringify(puzzle)),wrong=broken.answer===0?1:0,correct=broken.options[broken.answer];
 broken.options[wrong]=JSON.parse(JSON.stringify(correct));
 broken.options[wrong].values.black=correct.values.black===3?2:correct.values.black+1;
 broken.options[wrong].values.white=correct.values.white===-3?-2:correct.values.white-1;
 ctx.setLanguage('it');
 const facts=ctx.balanceFacts(broken,wrong),text=ctx.diagnosis(broken,wrong).join(' ');
 assert.equal(facts.differences.length,2);assert.match(text,/blocchi neri/);assert.match(text,/blocchi bianchi/);assert.doesNotMatch(text,/Ci sei quasi/);
 const inconsistent=JSON.parse(JSON.stringify(puzzle));
 inconsistent.options[inconsistent.answer].values.black=99;
 assert.throws(()=>ctx.guide(inconsistent),/contradicts visible inputs/);
}
console.log(JSON.stringify({family:'block-balance',levels:6,seedsPerLevel:12,languages:8,answerExplanations:balancesTested,compoundErrors:'passed',hiddenAnswer:'not used',contradictoryAnswer:'rejected'},null,2));
vm.runInContext('globalThis.axisFacts=axisSymbolsReasoning;',ctx);
let axisTested=0;
for(let level=1;level<=6;level++)for(let seed=0;seed<12;seed++){
 const puzzle=ctx.make('axis-symbols-explanation|'+seed,level,'axis-symbols');
 puzzle.cells[8]={};
 for(const language of languages){
  ctx.setLanguage(language);
  for(let index=0;index<puzzle.options.length;index++){
   const guide=ctx.guide(puzzle,index),diagnosis=ctx.diagnosis(puzzle,index),facts=ctx.axisFacts(puzzle,index);
   assert.equal(guide.length,3);
   assert.doesNotMatch(guide.concat(diagnosis).join(' '),/\bundefined\b|\bnull\b|\{\w+\}|\b(?:slots|values|topLeft|bottomRight)\b/i);
   assert.equal(facts.differences.length===0,index===puzzle.answer);
   assert.equal(diagnosis.length===0,index===puzzle.answer);
   axisTested++;
  }
 }
 const broken=JSON.parse(JSON.stringify(puzzle)),wrong=broken.answer===0?1:0,correct=broken.options[broken.answer];
 broken.options[wrong]=JSON.parse(JSON.stringify(correct));
 broken.options[wrong].slots.top.left=correct.slots.top.left===2?1:2;
 broken.options[wrong].slots.bottom.right=correct.slots.bottom.right===1?2:1;
 ctx.setLanguage('it');
 const facts=ctx.axisFacts(broken,wrong),text=ctx.diagnosis(broken,wrong).join(' ');
 assert.equal(facts.differences.length,2);assert.match(text,/posizione/);assert.match(text,/alto a sinistra/);assert.doesNotMatch(text,/Ci sei quasi/);
 const inconsistent=JSON.parse(JSON.stringify(puzzle));
 inconsistent.options[inconsistent.answer].slots.top.left=9;
 assert.throws(()=>ctx.guide(inconsistent),/contradicts visible inputs/);
}
console.log(JSON.stringify({family:'axis-symbols',levels:6,seedsPerLevel:12,languages:8,answerExplanations:axisTested,compoundErrors:'passed',hiddenAnswer:'not used',contradictoryAnswer:'rejected'},null,2));
vm.runInContext('globalThis.dotBalanceFacts=dotBalanceReasoning;',ctx);
let dotBalancesTested=0;
for(let level=1;level<=6;level++)for(let seed=0;seed<12;seed++){
 const puzzle=ctx.make('dot-balance-explanation|'+seed,level,'dot-balance');
 puzzle.cells[8]={};
 for(const language of languages){
  ctx.setLanguage(language);
  for(let index=0;index<puzzle.options.length;index++){
   const guide=ctx.guide(puzzle,index),diagnosis=ctx.diagnosis(puzzle,index),facts=ctx.dotBalanceFacts(puzzle,index);
   assert.equal(guide.length,3);
   assert.doesNotMatch(guide.concat(diagnosis).join(' '),/\bundefined\b|\bnull\b|\{\w+\}|\b(?:values|slots|channels)\b/i);
   assert.equal(facts.differences.length===0,index===puzzle.answer);
   assert.equal(diagnosis.length===0,index===puzzle.answer);
   dotBalancesTested++;
  }
 }
 const broken=JSON.parse(JSON.stringify(puzzle)),wrong=broken.answer===0?1:0,correct=broken.options[broken.answer];
 broken.options[wrong]=JSON.parse(JSON.stringify(correct));
 broken.options[wrong].values.filled=correct.values.filled===3?2:correct.values.filled+1;
 broken.options[wrong].values.hollow=correct.values.hollow===-3?-2:correct.values.hollow-1;
 ctx.setLanguage('it');
 const facts=ctx.dotBalanceFacts(broken,wrong),text=ctx.diagnosis(broken,wrong).join(' ');
 assert.equal(facts.differences.length,2);assert.match(text,/punti neri pieni/);assert.match(text,/cerchietti vuoti/);assert.doesNotMatch(text,/Ci sei quasi/);
 const inconsistent=JSON.parse(JSON.stringify(puzzle));
 inconsistent.options[inconsistent.answer].values.filled=99;
 assert.throws(()=>ctx.guide(inconsistent),/contradicts visible inputs/);
}
console.log(JSON.stringify({family:'dot-balance',levels:6,seedsPerLevel:12,languages:8,answerExplanations:dotBalancesTested,compoundErrors:'passed',hiddenAnswer:'not used',contradictoryAnswer:'rejected'},null,2));
