#!/usr/bin/env node
/* Generates a reproducible player-facing explanation audit from real puzzles. */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const source=fs.readFileSync(path.join(root,'index.html'),'utf8');
const scripts=[...source.matchAll(/<script(?:[^>]*)>([\s\S]*?)<\/script>/g)].map(match=>match[1]);
const core=scripts[0];
const explanationScript=scripts.find(script=>script.includes('HUMAN_EXPLANATION_COPY'));
const coreEnd=core.indexOf('let puzzle,selected=-1');
/* Start at the saved player-facing generator, not at the later copy table.
   The latter made this audit silently exercise a generic fallback instead of
   the detailed explanations displayed by the page. */
const explanationStart=explanationScript.indexOf('const explanationLinesBeforeGlossary');
const explanationEnd=explanationScript.indexOf('\nfunction localizeAbout()');
if(coreEnd<0||explanationStart<0||explanationEnd<0)throw new Error('The explanation audit could not locate the browser generators.');

const sandbox={console,window:{},document:{getElementById:()=>null,querySelector:()=>null,querySelectorAll:()=>[],createElement:()=>({}),body:{}},localStorage:{getItem:()=>null,setItem:()=>{}},navigator:{},setTimeout:()=>{},clearTimeout:()=>{},Math,JSON,Date};
sandbox.window=sandbox;
vm.createContext(sandbox);
vm.runInContext(core.slice(0,coreEnd)+'\n'+explanationScript.slice(explanationStart,explanationEnd)+'\nglobalThis.__makePuzzle=makePuzzle;\nglobalThis.__setLanguage=value=>activeLanguage=value;\nglobalThis.__explanationLines=explanationLines;\nglobalThis.__answerDifferenceLines=answerDifferenceLines;\nglobalThis.__differenceFields=typeof detailDifferenceFields===\'function\'?detailDifferenceFields:humanDifferenceFields;\nglobalThis.__mistakeCount=typeof logicalMistakeCount===\'function\'?logicalMistakeCount:null;\nglobalThis.__grammarText=(shape,fill,token)=>({shapeFill:describeShapeWithFill(shape,fill),carrierToken:carrierTokenTileText({carrier:shape,outerFill:fill,token})});',sandbox);

const languages=['it','en','fr','de','es','pt','nl','pl'];
const families=['custom','logical','affine','outline','outline-relations','marker-grid','carrier-token','dot-arrangement','line-assembly','spatial-tokens','grid-logic','polyomino','shape-fill','split-fill','symbol-order','composition','spoke-pattern','motif-count','radial-flower','fill-grid','paired-polygons','block-balance','axis-symbols','horizontal-anchors','dot-balance','lane-matching','line-xor','operator-transfer','minkowski-dilation','convex-hull','kronecker-product','cartesian-product','reference-mix','mixed','simple'];
const internalTerms=/\b(?:Boolean|affine|Kronecker|Minkowski|rototranslation|rototraslazione|permutation|permutazione|technical terms|termini tecnici|generator|occluder|layer|carrier|bead|token|slot)\b/i;
const internalOperatorNames=/\b(?:AND|OR|XOR)\b/;
const csv=value=>'"'+String(value??'').replaceAll('"','""').replaceAll('\r\n','\n').replaceAll('\r','\n')+'"';
const rows=[];
const samplesPerLevel=Number(process.env.EXPLANATION_AUDIT_SAMPLES||3);
if(!Number.isInteger(samplesPerLevel)||samplesPerLevel<1)throw new Error('EXPLANATION_AUDIT_SAMPLES must be a positive integer');
vm.runInContext('globalThis.__review=explanationReview; globalThis.__compositionFacts=compositionReasoning;',sandbox);
const add=row=>rows.push(row.map(csv).join(','));
add(['language','family','type','level','seed','selected_option','correct_option','result','near_miss','visible_difference_count','logical_mistake_count','validation','personalized_explanation','clarity_violations','explanation','actual_family','semantic_review','handler','visible_evidence_cells','explained_properties']);

let errors=0,checks=0,nearMisses=0,grammarChecks=0,clarityFindings=0,reviewRequired=0,reviewed=0;
const claritySummary=new Map();
function recordClarity(language,family,level,issues,example){
  if(!issues.length)return;
  const key=[language,family,level,issues.join('; ')].join('|');
  const item=claritySummary.get(key)||{language,family,level,issues:issues.join('; '),count:0,example};
  item.count++;
  claritySummary.set(key,item);
}
function clarityViolations(language,family,explanation){
  const issues=[];
  if(/(?:configurazione dedotta|configuration deduced|tutte le previsioni indipendenti usate sopra|all the independent predictions above)/i.test(explanation))issues.push('generic-fallback');
  if(/\bproperty\s+cells\b|\bcells\s+deve\b/i.test(explanation))issues.push('internal-field-name');
  if(/(?:posizioni|positions)\s*:[^.]*\b(?:9|1\d|[2-9]\d)\b/i.test(explanation))issues.push('raw-grid-index');
  if(language==='it'&&/\b(?:configuration|panels|property|cells)\b/i.test(explanation))issues.push('english-leak');
  if(language==='it'&&/\bCi sei quasi\b/i.test(explanation))issues.push('present-tense-near-miss');
  if(language==='it'&&/\b(?:prendere|serve|hanno entrambe)\s+(?:quadrato|triangolo|cerchio|rombo|stella|croce)\b/i.test(explanation))issues.push('missing-article');
  if(/senza bisogno di cercare diagonali|without needing any diagonal/i.test(explanation))issues.push('irrelevant-aside');
  if(!['it','en'].includes(language)&&/\b(?:The chosen answer|The correct answer|In every row|For the bottom row|How to read this exercise|The missing cell)\b/i.test(explanation))issues.push('explanation-not-localized');
  if(['kronecker-product','minkowski-dilation','cartesian-product'].includes(family)&&/(?:Nella casella vuota serve: posizioni|The blank tile needs: positions)/i.test(explanation))issues.push('unexplained-large-grid');
  return issues;
}
/* Exercise every locale-owned grammar branch with the nouns that change its
   article, gender, case or word order.  These are regressions that a random
   puzzle sample may not happen to expose. */
const grammarFixtures={
  it:[['circle','white','dot','cerchio bianco'],['cross','white','dot','croce bianca'],['arrow','solid','plus','freccia nera'],['circle','white','plus','un cerchio bianco con una crocetta al centro']],
  en:[['ellipse','white','dot','white ellipse'],['arrow','solid','plus','black arrow']],
  fr:[['circle','white','dot','cercle avec un remplissage blanc'],['cross','solid','plus','croix avec un remplissage noir']],
  de:[['circle','white','dot','Kreis mit weißer Füllung'],['cross','solid','plus','Kreuz mit schwarzer Füllung']],
  es:[['circle','white','dot','círculo con relleno blanco'],['cross','solid','plus','cruz con relleno negro']],
  pt:[['circle','white','dot','círculo com preenchimento branco'],['cross','solid','plus','cruz com preenchimento preto']],
  nl:[['circle','white','dot','cirkel met witte vulling'],['cross','solid','plus','kruis met zwarte vulling']],
  pl:[['circle','white','dot','koło z białym wypełnieniem'],['cross','solid','plus','krzyż z czarnym wypełnieniem']]
};
for(const [language,fixtures] of Object.entries(grammarFixtures)){
  sandbox.__setLanguage(language);
  for(const [shape,fill,token,expected] of fixtures){
    const phrase=sandbox.__grammarText(shape,fill,token);
    const actual=expected.startsWith('un ')||expected.startsWith('une ')||expected.startsWith('eine ')||expected.startsWith('una ')||expected.startsWith('um ')||expected.startsWith('een ')||expected.startsWith('zewnętrzny ')?phrase.carrierToken:phrase.shapeFill;
    grammarChecks++;
    if(!actual.includes(expected)||/undefined|null/i.test(phrase.shapeFill+' '+phrase.carrierToken)){
      errors++; console.error('Grammar fixture failed:',{language,shape,fill,token,expected,actual:phrase});
    }
  }
}
for(const [familyIndex,family] of families.entries()){
 for(let level=1;level<=6;level++){
  for(let sample=0;sample<samplesPerLevel;sample++){
  const seed=910000+sample*10000+familyIndex*100+level;
  let puzzle;
  try{puzzle=sandbox.__makePuzzle(seed,level,family)}catch(error){
   errors++;
   for(const language of languages)add([language,family,'',level,seed,'','','generator-error','','','','error: '+error.message,'no','generator-error','','','review-required','','','']);
   continue;
  }
  for(const language of languages){
   sandbox.__setLanguage(language);
   for(let selected=0;selected<puzzle.options.length;selected++){
    const correct=selected===puzzle.answer;
    const differences=correct?[]:sandbox.__differenceFields(puzzle.options[selected],puzzle.options[puzzle.answer],puzzle);
    const logicalMistakes=!correct&&sandbox.__mistakeCount?sandbox.__mistakeCount(puzzle,selected):differences.length;
    const nearMiss=!correct&&logicalMistakes===1;
    let explanation='',diagnosis='',explanationError='',review={status:'review-required',handler:'unknown',evidence:[],properties:[]};
    try{
      review=sandbox.__review(puzzle);
      explanation=sandbox.__explanationLines(puzzle,selected).join('\n\n');
      diagnosis=correct?'':sandbox.__answerDifferenceLines(puzzle,selected).join('\n\n');
    }catch(error){explanationError=String(error?.message||error)}
   const combined=[explanation,diagnosis].filter(Boolean).join('\n\n');
   const clarity=explanationError?['missing-dedicated-handler: '+explanationError]:clarityViolations(language,family,combined);
    const failures=[];
    if(review.status!=='reviewed-template'){
      reviewRequired++;
      failures.push(review.handler==='generic-localized-group'?'generic-family-group':'semantic-review-required');
    }else reviewed++;
    if(explanationError)failures.push('missing-dedicated-handler');
    if(!combined)failures.push('missing-text');
    if(!correct&&!differences.length)failures.push('no-visible-difference');
    if(/(?:needs|serve|contenir|benötigt|necesita|precisa de|hoort|potrzebna jest)\s+\./i.test(combined))failures.push('missing-solution-detail');
    if(internalTerms.test(combined)||internalOperatorNames.test(combined))failures.push('internal-term');
    if(language==='it'){
      if(/\bCi sei quasi\b/i.test(combined))failures.push('italian-near-miss-present-tense');
      if(/\bSupponiamo che\b/.test(combined))failures.push('unused-hypothesis-intro');
      if(/\b(?:cerchio|triangolo|quadrato|rettangolo|rombo|trapezio|esagono|trifoglio)\s+(?:bianca|nera|grigia)\b/i.test(combined))failures.push('italian-masculine-agreement');
      if(/\b(?:stella|croce|picca|freccia|ellisse)\s+(?:bianco|nero|grigio)\b/i.test(combined))failures.push('italian-feminine-agreement');
      if(/\bun\s+(?:ellisse|forma\s+a\s+T|croce|picca|freccia|stella|crocetta)\b/i.test(combined))failures.push('italian-indefinite-article');
    }
    const nearMissPhrase=({
      it:/C[’']eri quasi/i,
      en:/You were almost there/i,
      fr:/Vous y étiez presque/i,
      de:/Das war fast richtig/i,
      es:/Casi lo conseguiste/i,
      pt:/Quase acertou/i,
      nl:/Dat was bijna goed/i,
      pl:/Twoja odpowiedź była prawie poprawna/i
    }[language]||/You were almost there/i);
    if(nearMiss&&!nearMissPhrase.test(combined))failures.push('near-miss-not-acknowledged');
    if(!nearMiss&&nearMissPhrase.test(diagnosis))failures.push('false-near-miss');
    if(family==='outline-relations'){
      // A bracket or arrow is not evidence of a correct deduction. Until this
      // family has an evidence-backed handler, it must fail semantic review.
      if(review.status!=='reviewed-template'||!['carrier','bead','fill'].every(key=>review.properties.includes(key))||review.evidence.length<3)failures.push('outline-deduction-not-reviewed');
    }
    if(!correct){
      /* The player sees one concise falsification first, then the complete
         walkthrough and one final required-tile description.  Requiring the
         latter twice made the UI repetitive, so check the complete displayed
         explanation rather than prescribing duplicate wording in diagnosis. */
      if(!diagnosis)failures.push('missing-selected-answer-explanation');
      const directComparison=({it:/Confronto diretto:/i,en:/Direct comparison:/i,fr:/Comparaison directe\s*:/i,de:/Direkter Vergleich:/i,es:/Comparación directa:/i,pt:/Comparação direta:/i,nl:/Directe vergelijking:/i,pl:/Bezpośrednie porównanie:/i}[language]||/Direct comparison:/i);
      if(!directComparison.test(diagnosis))failures.push('missing-concrete-answer-comparison');
      /* A heading by itself is not enough: the displayed text must name both
         the required tile and the tile the person selected.  These checks are
         deliberately phrased per language because word order is part of a
         readable explanation. */
      const directContrast=({
        it:/Confronto diretto:\s*nella casella vuota deve comparire[\s\S]+?\.\s*La risposta \d+ mostra invece[\s\S]+?\./i,
        en:/Direct comparison:\s*the blank must show[\s\S]+?\.\s*Answer \d+ instead shows[\s\S]+?\./i,
        fr:/Comparaison directe\s*:\s*la case vide doit montrer[\s\S]+?\.\s*La réponse \d+ montre au contraire[\s\S]+?\./i,
        de:/Direkter Vergleich:\s*Im leeren Feld muss[\s\S]+? erscheinen\.\s*Antwort \d+ zeigt stattdessen[\s\S]+?\./i,
        es:/Comparación directa:\s*la casilla vacía debe mostrar[\s\S]+?\.\s*La respuesta \d+ muestra en cambio[\s\S]+?\./i,
        pt:/Comparação direta:\s*a célula vazia deve mostrar[\s\S]+?\.\s*A resposta \d+ mostra em vez disso[\s\S]+?\./i,
        nl:/Directe vergelijking:\s*in het lege vak moet[\s\S]+? staan\.\s*Antwoord \d+ toont in plaats daarvan[\s\S]+?\./i,
        pl:/Bezpośrednie porównanie:\s*w pustym polu powinno być[\s\S]+?\.\s*Odpowiedź \d+ pokazuje zamiast tego[\s\S]+?\./i
      }[language]||/Direct comparison:/i);
      if(!directContrast.test(diagnosis))failures.push('incomplete-concrete-answer-comparison');
      if(/(?:\b\d+\s+dettagli visibili sono diversi\b|\b\d+\s+visible details are different\b|\b\d+\s+détails visibles sont différents\b|\b\d+\s+sichtbare Details sind unterschiedlich\b|\b\d+\s+detalles visibles son diferentes\b|\b\d+\s+detalhes visíveis são diferentes\b|\b\d+\s+zichtbare details verschillen\b|\b\d+\s+widoczne szczegóły są różne\b)/i.test(diagnosis))failures.push('unexplained-difference-count');
    }
    const validation=failures.length?'check: '+failures.join('; '):'ok';
    if(failures.length)checks+=failures.length;
    if(nearMiss)nearMisses++;
   const reportIssues=[...new Set([...clarity,...failures])];
   if(clarity.length)clarityFindings+=clarity.length;
   if(reportIssues.length)recordClarity(language,family,level,reportIssues,combined||explanationError);
   add([language,family,puzzle.type||'',level,seed,selected+1,puzzle.answer+1,correct?'correct':'wrong',nearMiss?'yes':'no',differences.length,correct?0:logicalMistakes,validation,reportIssues.length?'unverified':'reviewed-template',reportIssues.join('; '),combined||explanationError,puzzle.family,review.status,review.handler,review.evidence.map(i=>i+1).join(' '),review.properties.join(' ')]);
   }
  }
 }
}
}

const out=path.join(root,'docs','explanation-audit.csv');
fs.writeFileSync(out,rows.join('\n')+'\n');
const summaryOut=path.join(root,'docs','explanation-clarity-summary.csv');
const summaryRows=[['language','family','level','quality_status','defects','affected_answers','example'].map(csv).join(',')];
for(const item of [...claritySummary.values()].sort((a,b)=>a.language.localeCompare(b.language)||a.family.localeCompare(b.family)||a.level-b.level))summaryRows.push([item.language,item.family,item.level,'needs-review',item.issues,item.count,item.example].map(csv).join(','));
fs.writeFileSync(summaryOut,summaryRows.join('\n')+'\n');
console.log(JSON.stringify({rows:rows.length-1,samplesPerLevel,file:out,summaryFile:summaryOut,generatorErrors:errors,validationFindings:checks,clarityFindings,grammarChecks,nearMisses,reviewed,reviewRequired,scope:'Finite reproducible sample; automated checks do not certify universal naturalness.'},null,2));
if(errors||checks||clarityFindings||reviewRequired)process.exitCode=1;
