#!/usr/bin/env node
/* Compare the former inventory-style feedback with the current plain-language
   explanation, using real correct and wrong answers from every family. */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const source=fs.readFileSync(path.join(root,'index.html'),'utf8');
const scripts=[...source.matchAll(/<script(?:[^>]*)>([\s\S]*?)<\/script>/g)].map(match=>match[1]);
const core=scripts[0],explanationScript=scripts.find(script=>script.includes('HUMAN_EXPLANATION_COPY'));
const coreEnd=core.indexOf('let puzzle,selected=-1');
const explanationStart=explanationScript.indexOf('const explanationLinesBeforeGlossary');
const explanationEnd=explanationScript.indexOf('\nfunction localizeAbout()');
if(coreEnd<0||explanationStart<0||explanationEnd<0)throw new Error('The report could not locate the explanation generators.');

const sandbox={console,window:{},document:{getElementById:()=>null,querySelector:()=>null,querySelectorAll:()=>[],createElement:()=>({}),body:{}},localStorage:{getItem:()=>null,setItem:()=>{}},navigator:{},setTimeout:()=>{},clearTimeout:()=>{},Math,JSON,Date};
sandbox.window=sandbox;vm.createContext(sandbox);
vm.runInContext(core.slice(0,coreEnd)+'\n'+explanationScript.slice(explanationStart,explanationEnd)+`\nObject.assign(globalThis,{__makePuzzle:makePuzzle,__setLanguage:value=>activeLanguage=value,__before:explanationLinesBeforeGlossary,__after:explanationLines,__afterDiagnosis:answerDifferenceLines,__detailMatrixEvidence:detailMatrixEvidence,__detailTile:detailTile,__detailDifferenceFields:detailDifferenceFields,__detailDifferenceSentence:detailDifferenceSentence,__selectedFalsification:selectedFalsification,__pack:humanExplanationPack,__detailText:detailText});`,sandbox);

const families=['custom','logical','affine','outline','outline-relations','marker-grid','carrier-token','dot-arrangement','line-assembly','spatial-tokens','grid-logic','polyomino','shape-fill','split-fill','symbol-order','composition','spoke-pattern','motif-count','radial-flower','fill-grid','paired-polygons','block-balance','axis-symbols','horizontal-anchors','dot-balance','line-xor','operator-transfer','minkowski-dilation','convex-hull','kronecker-product','cartesian-product','reference-mix','mixed','simple'];
const csv=value=>'"'+String(value??'').replaceAll('"','""').replaceAll('\r\n','\n').replaceAll('\r','\n')+'"';
vm.runInContext('globalThis.__review=explanationReview;',sandbox);
const rows=[['language','family','type','level','seed','result','selected_option','correct_option','before','after','semantic_review','handler','baseline_commit']];
// Compare with the actual previously delivered implementation. Reconstructing
// an invented old explanation by appending inventories distorts the comparison.
const baselineRef=process.env.EXPLANATION_BASE_REF||'bf6d7ae';
const baselineSource=execFileSync('git',['show',baselineRef+':index.html'],{cwd:root,encoding:'utf8',maxBuffer:16*1024*1024});
const baselineScripts=[...baselineSource.matchAll(/<script(?:[^>]*)>([\s\S]*?)<\/script>/g)].map(match=>match[1]);
const baselineCore=baselineScripts[0],baselineExtra=baselineScripts.find(s=>s.includes('HUMAN_EXPLANATION_COPY'));
const baseline={console,window:{},document:sandbox.document,localStorage:sandbox.localStorage,navigator:{},setTimeout:()=>{},clearTimeout:()=>{},Math,JSON,Date};
baseline.window=baseline;vm.createContext(baseline);
vm.runInContext(baselineCore.slice(0,baselineCore.indexOf('let puzzle,selected=-1'))+'\n'+baselineExtra.slice(baselineExtra.indexOf('const explanationLinesBeforeGlossary'),baselineExtra.indexOf('\nfunction localizeAbout()'))+'\nObject.assign(globalThis,{setLanguage:value=>activeLanguage=value,guide:explanationLines,diagnosis:answerDifferenceLines});',baseline);

for(const [familyIndex,family] of families.entries()){
 for(let level=1;level<=6;level++){
 const seed=960000+familyIndex*10+level;
 const puzzle=sandbox.__makePuzzle(seed,level,family);
 const wrong=puzzle.options.findIndex((_,index)=>index!==puzzle.answer);
 for(const language of ['it','en']){
  sandbox.__setLanguage(language);
  baseline.setLanguage(language);
  for(const [result,index] of [['correct',puzzle.answer],['wrong',wrong]]){
   const before=baseline.diagnosis(puzzle,index).concat(baseline.guide(puzzle,index)).join('\n\n');
   const after=(sandbox.__after(puzzle,index).concat(sandbox.__afterDiagnosis(puzzle,index))).join('\n\n');
   const review=sandbox.__review(puzzle);
   rows.push([language,family,puzzle.type||'',level,seed,result,index+1,puzzle.answer+1,before,after,review.status,review.handler,baselineRef]);
  }
 }
 }
}
const out=path.join(root,'docs','explanation-before-after.csv');
fs.writeFileSync(out,rows.map(row=>row.map(csv).join(',')).join('\n')+'\n');
console.log(JSON.stringify({rows:rows.length-1,file:out,baselineRef,families:families.length,levels:6,languages:2,correctAndWrongPerFamilyAndLevel:true},null,2));
