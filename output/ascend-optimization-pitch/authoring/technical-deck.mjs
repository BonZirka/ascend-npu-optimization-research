import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import {createRequire} from 'node:module';
import {pathToFileURL} from 'node:url';

const moduleRoot=process.env.RUNTIME_NODE_MODULES;
const skill=process.env.PRESENTATIONS_SKILL_DIR;
const python=process.env.RUNTIME_PYTHON;
if(!moduleRoot||!skill||!python) throw new Error('Set RUNTIME_NODE_MODULES, PRESENTATIONS_SKILL_DIR and RUNTIME_PYTHON from the Codex workspace dependencies.');
const runtimeRequire=createRequire(path.join(moduleRoot,'package.json'));
const {Presentation,PresentationFile}=await import(pathToFileURL(runtimeRequire.resolve('@oai/artifact-tool')).href);
const {finalizePresentation}=await import(pathToFileURL(path.join(skill,'container_tools/artifact_tool_utils.mjs')).href);
const root=process.env.PITCH_BUILD_ROOT?path.resolve(process.env.PITCH_BUILD_ROOT):await fs.mkdtemp(path.join(os.tmpdir(),'ascend-pitch-'));
const out=process.env.PITCH_OUTPUT||path.join(root,'final','ascend-optimization-technical.pptx');
const P={bg:'#FCFDFF',ink:'#203248',blue:'#245994',muted:'#4B6178',line:'#B8C8D9',tint:'#EDF3F9',amber:'#85530B',pale:'#FFF0CF',green:'#246553',lightGreen:'#EDF7F2',purple:'#645184',lightPurple:'#F2EFF8',red:'#9C3F36',lightRed:'#FBEFEC'};
const deck=Presentation.create({slideSize:{width:1600,height:900}});
const FONT='Arial',MONO='Courier New',noLine={width:0,fill:'none',style:'solid'};
const LPO='https://arxiv.org/abs/2508.16125v2',PRAGMA='https://arxiv.org/abs/2511.06345v2';
const source=[];
function t(s,name,value,x,y,w,h,o={}){
 const sh=s.shapes.add({name,geometry:o.geometry||'textbox',position:{left:x,top:y,width:w,height:h},fill:o.bg||'none',line:o.border?{style:o.dash?'dashed':'solid',fill:o.border,width:o.stroke||1.3}:noLine});
 sh.text=value;sh.text.style={typeface:o.mono?MONO:FONT,fontSize:o.size||27,color:o.color||P.ink,bold:!!o.bold,alignment:o.center?'center':'left',verticalAlignment:o.middle?'middle':'top',wrap:o.nowrap?'none':'square',autoFit:'none',insets:o.pad??0};return sh;
}
function bar(s,x,y,w,color=P.line,h=1.4){return s.shapes.add({name:'Rule',geometry:'rect',position:{left:x,top:y,width:w,height:h},fill:color,line:noLine});}
function slide(title,notes,refs='',size=45){
 const s=deck.slides.add();s.background.fill=P.bg;t(s,'Title',title,60,36,1480,82,{size,bold:true});bar(s,60,130,1480,P.blue);
 s.speakerNotes.text=notes+(refs?'\n\nSources\n'+refs:'');source.push({slide:deck.slides.items.length,title,notes,refs});return s;
}
function foot(s,value){t(s,'Source or applicability condition',value,60,846,1480,40,{size:18,color:P.muted});}
function box(s,name,value,x,y,w,h,o={}){return t(s,name,value,x,y,w,h,{geometry:'rect',bg:o.bg||P.tint,border:o.color||P.line,size:o.size||24,bold:o.bold??true,center:true,middle:true,pad:9,...o});}
function frame(s,label,x,y,w,h,color=P.blue){const r=t(s,label+' boundary','',x,y,w,h,{geometry:'rect',border:color,dash:true});t(s,label+' label',label,x+12,y-30,w-24,30,{size:21,color,bold:true});return r;}
function a(s,from,to,{fromSide='right',toSide='left',kind='straight',color=P.blue,dash=false,arrow=true}={}){
 return s.shapes.connect(from,to,{kind,fromSide,toSide,line:{style:dash?'dashed':'solid',fill:color,width:2},tail:{type:arrow?'triangle':'none',width:'med',length:'med'}});
}
function point(s,name,x,y){return s.shapes.add({name,geometry:'rect',position:{left:x,top:y,width:1,height:1},fill:'none',line:noLine});}
function label(s,str,x,y,w,color=P.muted,size=20){t(s,str,str,x,y,w,44,{color,size});}
function section(s,title,body,x,y,w,h=120){t(s,title,title,x,y,w,42,{size:28,bold:true,color:P.blue});t(s,title+' body',body,x,y+48,w,h,{size:26});}
function tbl(s,values,widths,y,heights,size=24){
 const table=s.tables.add({rows:values.length,columns:widths.length,left:60,top:y,width:1480,height:heights.reduce((a,b)=>a+b,0),columnWidths:widths,values});
 table.styleOptions={headerRow:false,bandedRows:false};table.borders.assign({style:'solid',fill:P.line,width:.65});
 values.forEach((row,r)=>{table.rows[r].height=heights[r];row.forEach((v,c)=>{const cell=table.getCell(r,c);cell.fill=r===0?P.blue:(r%2===0?P.tint:P.bg);cell.text.style={typeface:FONT,fontSize:r===0?22:size,color:r===0?'#FFFFFF':P.ink,bold:r===0||c===0};});});return table;
}
{
const s=slide('Optimized kernels can still contain avoidable work','The performance problem concerns opportunities that remain after the configured optimizations. A stable regression baseline can already contain such opportunities. The examples are candidate problem classes. A concrete Ascend case must establish semantic conditions and observe whether later compilation preserves a useful difference.','H01; H02; research/Candidate optimization families.md');
t(s,'Problem','A stable performance baseline can still contain\nredundant computation or inefficient target code.',60,173,1450,133,{size:43,bold:true});
section(s,'Scalar / vector expressions','Clamp and predicate chains may admit a smaller equivalent expression.',60,378,440);
section(s,'Memory and layout','Adjacent loads or conversion sequences may admit a more efficient representation.',580,378,440);
section(s,'Execution mapping','Reduction structure and vectorization choices can change target utilization.',1100,378,440);
bar(s,60,650,1480);
t(s,'Investigation obligation','For each case, establish a legal alternative and compare the resulting artifacts under the same target settings.',60,689,1450,108,{size:31});
}
{
const s=slide('[REWORK] How optimization opportunities reach engineers today','Current practices come from the project owner’s observations. Nightly performance testing helps keep significant regressions out of upstream. Broader optimization tasks and kernel-specific work may be informed by cross-platform comparisons, whose role in prioritization remains uncertain.','H02; Q02–Q04',40);
tbl(s,[['Current mechanism','Trigger and engineering work'],['Nightly performance regression testing','Detect a deterioration against the baseline; investigate or revert the offending change.'],['Performance issue tickets','Investigate slow cases discovered in already merged code.'],['Kernel-specific tasks','Inspect generated code and profiling data to make a specified kernel faster.'],['Optimization epics','Improve an optimization class; task selection and prioritization need clarification.']],[445,1035],174,[55,102,91,102,102],26);
t(s,'Proactive search claim','No proactive search for missed optimizations is currently performed in the project. (To my knowledge)',60,691,1480,112,{size:31,bold:true,bg:P.pale,pad:16});
}
{
const s=slide('Proactive discovery currently depends on engineer investigation','The intended gap is a repeatable search over existing compiled code, including cases that have not triggered a regression or a specific optimization task. These activities currently require choosing transformations, assembling checks and retaining evidence. The project hypothesis concerns how much of that repeated work can be offloaded.','H01; H02; H03 §4',42);
const n1=box(s,'Code','Existing compiled\nMLIR / kernels',60,213,260,92),n2=box(s,'Expert review','Inspect IR and\nform a hypothesis',450,213,300,92),n3=box(s,'Alternative','Construct a\nlegal alternative',880,213,280,92),n4=box(s,'Result','Compare and\nprepare evidence',1280,213,260,92);a(s,n1,n2);a(s,n2,n3);a(s,n3,n4);
label(s,'Representative repeated investigation activities',60,352,1480,P.blue,26);
tbl(s,[['Work','Material an engineer needs'],['Understand the region','Definitions, uses, effects, aliasing, shape/layout and numeric constraints.'],['Test an alternative','Compiler entry point, enclosing module, target settings, harness and inputs.'],['Assess the result','Comparable output artifacts, selected metric, conditions and reproduction steps.']],[320,1160],410,[53,93,93,93],26);
}
{
const s=slide('Build a framework for reproducible optimization discovery','The framework uses an LLM to propose MLIR alternatives and coordinates compilation, selected checks and metric comparison. The same target supplies the original and candidate references. A finding identifies what might be improved. Root-cause analysis and optimization-pass implementation can follow engineer review.','H01; H03 §1',42);
t(s,'Proposal','Develop a framework that searches for beneficial MLIR rewrites and returns a reproducible original / candidate comparison for AscendNPU-IR.',60,180,1450,173,{size:43,bold:true});
const n1=box(s,'Request','Code + context +\nprofiles + budget',60,444,350,100),n2=box(s,'Framework','Bounded investigation\nwith LLM-proposed edits',590,444,420,100,{bg:P.blue,color:'#FFFFFF'}),n3=box(s,'Finding','Runnable experiment\nfor compiler review',1190,444,350,100);a(s,n1,n2);a(s,n2,n3);
t(s,'Benefit','Offload variant construction, repeated checks and reproduction packaging; measure whether the resulting findings justify preparation and review effort.',60,660,1460,107,{size:29});
}
{
const s=slide('Research directions and planned comparisons','This matrix is an open research agenda derived from H03, not completed experiments. Q06 and Q08 establish a feasible comparison route. Q09/Q10 and selector/feedback studies improve a baseline. The implementation does not depend on completing every optional comparison.','H03 §5; Q06–Q10; research backlog');
tbl(s,[['Direction','Baseline or required work','Comparison / question','Evidence to retain'],['Metrics · Q06','Select one meaningful evaluator.','Static indicator, target model or runtime measurement?','Coverage, later-pass survival and collection cost.'],['Routes · Q08','Exercise one compile / check route.','Which checkpoints, stops and validation modes compose?','Compatibility matrix and reproducible probes.'],['Context · Q09','Versioned dialect pack + supplied IR.','Direct context vs on-demand docs or added analyses.','Useful findings, invalid proposals and retrieval cost.'],['Tools · Q10','Ordinary reading / file editing.','IR-aware editor, restricted rewrites or check tools.','Validity, expressible transformations and total cost.'],['Discovery · Q07','Engineer supplies code or range.','Prompted selection vs static / cost-model selectors.','Region coverage, useful yield and selection cost.'],['Feedback / policy','Same conversation; first qualifying finding.','History detail, continuation and budget allocation.','Attempt traces, useful yield and expensive checks.']],[235,395,450,400],168,[54,89,89,89,89,89,89],23);
foot(s,'Optional studies use the same cases, model, checking policy and comparable resource budgets.');
}
{
const s=slide('Two paper workflows inform the experiment','The top workflow is reconstructed from LPO Figure 2 and §3.2–3.3. Its extractor wraps dependent sequences, reoptimizes and deduplicates. opt -O3 preprocesses candidates; interestingness screens before Alive2 refinement checking. The lower workflow is reconstructed from PRAGMA Figures 1–2 and §III. A deterministic verifier compares outputs; a profiler gathers counters; the conductor reasons over code, logs, metric documentation and best history. The Ascend baseline can use one session; these papers motivate responsibilities and feedback signals.','LPO Figure 2 and §3.2–3.3: '+LPO+'\nPRAGMA Figures 1–2 and §III: '+PRAGMA);
label(s,'LPO — LLVM peephole discovery',60,161,1480,P.blue,26);
const lp=[['Corpus',60,130],['Extract / wrap\nreoptimize / dedup',230,235],['LLM',505,140],['opt -O3',685,165],['Interestingness',890,185],['Alive2',1115,165],['Retain pair',1320,220]].map(([v,x,w])=>box(s,'LPO '+v,v,x,230,w,84,{size:22}));
lp.slice(0,-1).forEach((n,i)=>a(s,n,lp[i+1]));
const lf=box(s,'LPO feedback','Compiler diagnostic / refinement counterexample',500,365,780,54,{size:21,bg:P.pale,color:P.amber});a(s,lp[3],lf,{fromSide:'bottom',toSide:'top',kind:'elbow',color:P.amber});a(s,lp[5],lf,{fromSide:'bottom',toSide:'top',kind:'elbow',color:P.amber});a(s,lf,lp[2],{fromSide:'left',toSide:'bottom',kind:'elbow',color:P.amber});
label(s,'Screen uses instruction count or llvm-mca estimates; syntactic alternatives may also be retained.',60,436,1480,P.muted,21);
bar(s,60,495,1480);
label(s,'PRAGMA — profiling-informed kernel refinement',60,518,1480,P.blue,26);
const coder=box(s,'Coder','Coder\nLLM',60,615,225,84,{bg:P.lightPurple,color:P.purple}),verifier=box(s,'Verifier','Verifier\ncompile + compare outputs',380,615,330,84),profiler=box(s,'Profiler','Profiler\nNCU / perf counters',805,615,310,84),conductor=box(s,'Conductor','Conductor\nLLM guidance',1210,615,330,84,{bg:P.lightPurple,color:P.purple});a(s,coder,verifier);a(s,verifier,profiler);a(s,profiler,conductor);
const history=box(s,'PRAGMA history','Code + verifier logs + metric docs + best history',805,754,735,52,{size:20,bg:P.pale,color:P.amber});a(s,history,conductor,{fromSide:'top',toSide:'bottom',kind:'elbow',color:P.amber});a(s,verifier,history,{fromSide:'bottom',toSide:'left',kind:'elbow',color:P.amber});const gp1=point(s,'Guidance turn',1374,591),gp2=point(s,'Guidance return',172,591);a(s,conductor,gp1,{fromSide:'top',toSide:'bottom',color:P.amber,arrow:false});a(s,gp1,gp2,{color:P.amber,arrow:false});a(s,gp2,coder,{fromSide:'bottom',toSide:'top',color:P.amber});label(s,'Guidance for the next edit',585,555,510,P.amber,20);
foot(s,'Editable reconstructions of LPO Fig. 2 and PRAGMA Figs. 1–2. LLVM and CPU/GPU tool assumptions belong to the papers.');
}
{
const s=slide('Proposed Ascend investigation architecture','H03 defines stage contracts and a default search policy. Read-only input snapshots remain distinct from candidate working copies. A single agent session edits the copy. The adapters compile and assess original/candidate artifacts through a saved recipe. Typed feedback returns independent outcomes and evidence pointers to the same conversation. The durable store records intent and completion plus budget usage at every stage.','H03 §§2.1–2.6; ASC-43');
frame(s,'Prepared case',60,205,330,360);
frame(s,'Agent session',440,205,335,360,P.purple);
frame(s,'Execution recipe and adapters',825,205,715,360);
const orig=box(s,'Original','Immutable input snapshot\n+ enclosing context',85,236,280,87,{size:22});
const spec=box(s,'Configuration','Editing scope\ncompiler / check / metric\nshared limits',85,391,280,125,{size:21});
const ctx=box(s,'Knowledge pack','Versioned dialect docs\n+ selected task context',466,236,282,87,{size:22,bg:P.lightPurple,color:P.purple});
const agent=box(s,'Agent','Read / reason / edit\ncandidate working copy',466,391,282,101,{size:23,bg:P.lightPurple,color:P.purple});
const compile=box(s,'Compilation','Compile original and candidate\nretain requested checkpoints',853,240,657,75,{size:23});
const checks=box(s,'Validation','Validation adapter\npolicy + coverage',853,410,300,90,{size:22});
const metric=box(s,'Evaluator','Metric evaluator\ncriterion + observations',1210,410,300,90,{size:22});
a(s,ctx,agent,{fromSide:'bottom',toSide:'top'});a(s,spec,agent);const op1=point(s,'Baseline turn 1',224,163),op2=point(s,'Baseline turn 2',1570,163),op3=point(s,'Baseline turn 3',1570,277);a(s,orig,op1,{fromSide:'top',toSide:'bottom',arrow:false});a(s,op1,op2,{arrow:false});a(s,op2,op3,{fromSide:'bottom',toSide:'top',arrow:false});a(s,op3,compile,{fromSide:'left',toSide:'right'});a(s,agent,compile,{kind:'elbow'});a(s,compile,checks,{fromSide:'bottom',toSide:'top',kind:'elbow'});a(s,compile,metric,{fromSide:'bottom',toSide:'top',kind:'elbow'});
const fb=box(s,'Typed feedback','Structured feedback + evidence references + remaining budget',440,635,1100,62,{bg:P.pale,color:P.amber,size:23});a(s,checks,fb,{fromSide:'bottom',toSide:'top',kind:'elbow',color:P.amber});a(s,metric,fb,{fromSide:'bottom',toSide:'top',kind:'elbow',color:P.amber});a(s,fb,agent,{fromSide:'left',toSide:'bottom',kind:'elbow',color:P.amber});
t(s,'Persistence','Persist snapshots, candidates, operations, feedback delivery state and budget reservations across every stage.',60,753,1480,66,{size:24,bg:P.tint,pad:12});
foot(s,'Finding eligibility = required checks pass + selected criterion met + complete runnable bundle.');
}
{
const s=slide('Candidate transformations and applicability conditions','LPO provides LLVM clamp, memory and floating-point examples. PRAGMA supplies kernel vectorization and reduction-tuning examples. The layout-conversion family is a project candidate. These establish search families to investigate in MLIR. Exact Ascend support and benefit must be checked at the selected checkpoint and after continuation.','Candidate optimization families; LPO §4.3 '+LPO+'; PRAGMA §IV-D '+PRAGMA);
tbl(s,[['Family','Candidate change','Conditions / checkpoint information'],['Arithmetic and clamps','Remove a clamp subsumed by later operations.','Integer width, signedness, overflow flags; exact sequence.'],['Predicates / selects','Remove a NaN guard before ordered equality.','FP predicate semantics; other uses of the sanitized value.'],['Memory sequences','Adjacent narrow loads → one wider load.','Bounds, alignment, endianness, memory space and effects.'],['Vectorization / lowering','Restructure conditions to expose target instructions.','Vector width, legal operations, contraction permissions.'],['Reduction organization','Change reduction structure or target mapping.','Shape, neutral element, NaN handling, numeric order.'],['Layout conversions','Eliminate an inverse pair or retain one layout.','Physical layout, aliasing and requirements of consumers.']],[300,530,650],174,[55,83,83,83,83,83,83],24);
foot(s,'LPO motivates the first three families. PRAGMA motivates vectorization/reduction. Layout conversion is our additional candidate.');
}
{
const s=slide('MLIR case — redundant NaN handling','This is an illustrative MLIR adaptation of LPO Figure 4(c)/(f). It assumes that the shown equality is the observed result, and that no other use requires retaining the sanitizing value. For NaN, the original selects zero and compares it with one; the candidate ordered equality is also false. For ordinary values both compare x with one. The arith rewrite and subsequent Ascend output have not been exercised locally.','LPO §4.3 / Fig. 4(c,f): '+LPO+'; Candidate optimization families');
label(s,'Shared operands   %x : f32    %zero = 0.0 : f32    %one = 1.0 : f32',60,161,1480,P.muted,24);
label(s,'Original',60,227,1480,P.blue,27);
['%ordinary = arith.cmpf ord, %x, %x : f32','%safe = arith.select %ordinary, %x, %zero : f32','%equal = arith.cmpf oeq, %safe, %one : f32'].forEach((v,i)=>t(s,'Original instruction '+i,v,60,275+i*54,1480,54,{mono:true,size:31,bg:i<2?P.pale:P.tint,pad:{left:14,top:7,right:0,bottom:0},nowrap:true}));
label(s,'Candidate',60,465,1480,P.blue,27);
t(s,'Candidate instruction','%equal = arith.cmpf oeq, %x, %one : f32',60,513,1480,57,{mono:true,size:31,bg:P.tint,pad:{left:14,top:8,right:0,bottom:0},nowrap:true});
tbl(s,[['Input class','Original result','Candidate result'],['NaN','select zero; 0.0 == 1.0 → false','ordered equality → false'],['Ordinary value','x == 1.0','x == 1.0']],[350,565,565],626,[43,60,60],23);
foot(s,'LPO Figure 4(c,f), adapted to MLIR. Inspect post-continuation output and the selected checks before retaining a finding.');
}
{
const s=slide('Request resolution and dialect knowledge delivery','The input and configuration fields are based on H03 §2.1. The YAML-like view is an interface illustration, with profile names awaiting selection. The concrete dialect support task is part of MVP. Provide versioned authoritative operation/type/attribute semantics and representative examples as context or readable files. Capture information actually supplied or retrieved and report unknown semantics. Q09 evaluates richer instruction and retrieval methods; Q10 evaluates tools and editing restrictions.','H03 §§2.1–2.3; Q09; Q10; ASC-43');
label(s,'Illustrative request shape',60,166,660,P.blue,26);
t(s,'Request fields','input: module.mlir\nmode: specified_range\nregion: operation_range\ncheckpoint: input_profile\npipeline: continuation_profile\nchecking: validation_profile\nobjective: evaluator_profile\nlimits: request_budget',60,226,610,375,{mono:true,size:26,bg:P.tint,pad:15});
t(s,'Resolution','Defaults → request → per-input overrides\nShared request limits stay upper bounds.',60,653,610,106,{size:25});
const docs=box(s,'Sources','Dialect specs / compiler definitions\nengineer-reviewed examples',750,225,790,82,{size:24}),pack=box(s,'Pack','Versioned reference pack\nops · types · attributes · effects · target constraints',750,382,790,101,{size:24,bg:P.lightPurple,color:P.purple}),agent=box(s,'Model material','Task prompt + relevant context / readable docs\nrecord material exposed to the model',750,567,790,101,{size:24,bg:P.lightPurple,color:P.purple});a(s,docs,pack,{fromSide:'bottom',toSide:'top'});a(s,pack,agent,{fromSide:'bottom',toSide:'top'});
foot(s,'Q09 examines public coding and specialist harness prompts. Compare direct dialect context, retrieval and added analyses.');
}
{
const s=slide('Compilation checkpoints determine route compatibility','This is an illustrative route diagram, not a claim that Ascend accepts the depicted checkpoints. Q08 must establish input state restoration, prerequisite passes and exact output boundaries. A metric observation may occur earlier than the artifact consumed by execution validation. An explicit stop before the required lowering makes that runtime policy incompatible. Record the exact compiler version, pipeline, metadata, target and required resources for each demonstrated route.','H03 §2.4; Q08; Q06');
label(s,'Illustrative continuation for both original and candidate',60,165,1480,P.blue,27);
const n1=box(s,'Start','K_in\naccepted IR + restored state',60,259,320,94),n2=box(s,'Continuation','Configured passes',520,259,300,94),n3=box(s,'Observation','K_metric\nintermediate snapshot',960,259,315,94),n4=box(s,'Executable','Runnable device artifact\n+ host harness',1150,536,390,98);
a(s,n1,n2);a(s,n2,n3);
const evaluator=box(s,'Observe','Static evaluator\nif stage / operations supported',550,536,410,98,{bg:P.lightGreen,color:P.green});
const split=point(s,'Snapshot branch',1117,378),stat=point(s,'Static branch turn',755,378),run1=point(s,'Runtime lower turn',1117,445),run2=point(s,'Runtime artifact turn',1345,445);
a(s,n3,split,{fromSide:'bottom',toSide:'top',arrow:false});
a(s,split,stat,{color:P.green,arrow:false});a(s,stat,evaluator,{fromSide:'bottom',toSide:'top',color:P.green});
a(s,split,run1,{fromSide:'bottom',toSide:'top',color:P.red,dash:true,arrow:false});a(s,run1,run2,{color:P.red,dash:true,arrow:false});a(s,run2,n4,{fromSide:'bottom',toSide:'top',color:P.red,dash:true});
label(s,'Further lowering / link / load',1158,463,370,P.red,23);
bar(s,1076,403,420,P.red,3);label(s,'Optional hard stop here',1150,360,390,P.red,23);
t(s,'Compatibility condition','Runtime validation needs a runnable artifact. A hard stop before its required lowering blocks this policy. The metric checkpoint can remain earlier if continuation is allowed.',60,696,1480,108,{size:28,bg:P.pale,pad:14});
foot(s,'Q08 output — checkpoint catalog + validation-mode records + demonstrated / incompatible / unknown route matrix.');
}
{
const s=slide('Validation outcomes remain independent of improvement','Each selected check declares inputs, tolerances, assumptions and coverage. Parse/verify/compile checks validate structural properties. Execution compares selected observables on supplied cases. A semantic checker requires demonstrated representation and operation support. Alive2 supplies LLVM refinement checks in LPO; that does not establish an Ascend checker. A mismatch, unsupported operation and unavailable device are separate outcomes and must lead to different feedback.','H03 §2.4; Q08; LPO §3.3 '+LPO);
tbl(s,[['Checking route','Required material','Evidence / feasibility question'],['Parse, verify and compile','IR, enclosing module, target and pipeline.','Accepted structure and invariants at reached checkpoints.'],['Execution comparison','Runnable artifacts, inputs, harness, reference and tolerances.','Matching selected outputs on the recorded cases. Which hardware?'],['Semantic validation','Supported IR / operations / FP and memory model.','Equivalence or refinement within demonstrated checker coverage.']],[310,580,590],170,[54,87,108,108],24);
label(s,'Finding eligibility',60,598,1480,P.blue,27);
tbl(s,[['Selected checks','Metric comparison','Action'],['Pass','Criterion met','Retain if the replay bundle is complete.'],['Pass','Criterion not met','Keep attempt; return comparison feedback.'],['Fail or incomplete','Any result','Retain reason; repair, investigate coverage or recover setup.']],[350,400,730],647,[43,53,53,53],22);
}
{
const s=slide('Metric selection controls execution cost and interpretation','Q06 compares structural indicators, model-based estimates and runtime measurements. No metric is selected yet. The evaluator records its version, units, observation stage, operation coverage, target assumptions and raw outputs. LPO uses instruction count and llvm-mca as interestingness filters; these screen local cases. PRAGMA gathers target execution and profiling information. Validation cost remains separate. Lower scores before a later pass may be erased, reversed or caused by moving work outside the measured scope.','Q06; H03 §2.4; LPO §3.3 '+LPO+'; PRAGMA §III '+PRAGMA);
tbl(s,[['Candidate metric','Inputs / resources','Supported interpretation and open checks'],['Structural indicator','Chosen IR snapshot; host-side analysis.','Op counts or data-movement estimates. Check unmodeled ops and moved work.'],['Target cost model','Target parameters and scheduling / hardware model.','Estimated cost within model coverage. llvm-mca is a CPU reference from LPO.'],['Runtime measurement','Executable, workload, NPU/runtime, warm-up and repeats.','Observed execution time under the recorded conditions and aggregation.']],[310,535,635],173,[54,126,126,126],25);
const cheap=box(s,'Screen','Cheap candidate screen',60,677,330,72),check=box(s,'Required check','Required correctness checks',580,677,440,72),retain=box(s,'Retain','Finding criterion',1210,677,330,72);a(s,cheap,check);a(s,check,retain);
foot(s,'Screening order is configurable. Finding eligibility still requires every check in the selected policy.');
}
{
const s=slide('Feedback, stopping rules and crash recovery','The default is same-session feedback, each candidate compared to the unchanged original, stopping at the first qualifying result or a resource limit. Infrastructure retry is separate from candidate repair. Before each operation, persist intent and reserve budget. Retain complete evidence before marking completion. On restart, reuse completed applicable work and reconcile uncertain external jobs by identifiers or retrievable outputs. Preserve already spent budget and best eligible results. Exact model-response replay is unnecessary.','H03 §2.5; Q09');
tbl(s,[['Observed outcome','Feedback / next action'],['Compilation rejection or behavior mismatch','Send diagnostics or failing input with original/candidate identities. Agent may repair.'],['No qualifying improvement','Send metric values, stage, units, criterion and evidence references.'],['Unsupported check / unavailable hardware','Expose coverage or infrastructure cause; retain an unresolved operation.']],[460,1020],174,[49,86,86,86],25);
label(s,'Durable operation protocol',60,532,1480,P.blue,27);
const phases=[['Record intent\nreserve budget',60,265],['Launch operation\nrecord external ID',455,300],['Persist artifacts\nand result',885,300],['Mark complete\nadvance checkpoint',1310,230]].map(([v,x,w])=>box(s,v,v,x,590,w,87,{size:23}));
phases.slice(0,-1).forEach((n,i)=>a(s,n,phases[i+1]));
t(s,'Recovery','Restart → reconcile in-flight work → reuse completed stages → restore or reconstruct agent context → continue with recorded budget.',60,739,1480,79,{size:26,bg:P.pale,pad:13});
foot(s,'Preserve each submitted candidate and the best eligible finding independently of the current working file.');
}
{
const s=slide('The finding is a replayable experiment','Initial comparison and replay use the same versioned execution recipe. The saved bundle includes code, case material, manifest and environment bindings. A relocated bundle should run independently of the generating worker and live agent session. Replay produces new evidence and preserves original observations. Interrupted export can be regenerated from durable records. The command shown is a proposed interface.','H03 §§2.4 and 2.6; H08');
t(s,'Bundle','finding-ID/\n  report.md\n  manifest.json\n  original/\n  candidate/\n  changes.diff\n  evidence/\n  reproduce/\n  replays/',60,188,575,470,{mono:true,size:28,bg:P.tint,pad:17});
const initial=box(s,'Initial run','Initial original / candidate comparison',770,196,770,65,{size:24}),recipe=box(s,'Saved recipe','One saved execution recipe\ncompiler · pipeline · target · checks · evaluator',770,349,770,107,{size:24}),replay=box(s,'Replay','Replay saved versions\nresolve declared environment bindings',770,550,770,90,{size:24});a(s,initial,recipe,{fromSide:'bottom',toSide:'top'});a(s,recipe,replay,{fromSide:'bottom',toSide:'top'});
t(s,'Proposed command','Proposed interface\nframework replay ./finding-ID',60,714,575,90,{size:26,mono:true});
t(s,'Replay result','Each replay stores fresh check results, metric samples and resource usage linked to the original finding.',770,724,770,90,{size:26});
}
{
const s=slide('Constraints resolve into an explicit experiment profile','Request resolution must establish a jointly supported route before search. The profile records scope, numeric assumptions, evidence requirements and budgets. Agent-proposed assumptions remain unresolved until established by checking or review. The stored environment and compiler identities determine whether original results may be reused.','H03 §§2.1 and 2.4; Q06; Q08');
tbl(s,[['Constraint','Resolved setting','Failure or boundary to expose'],['Editing scope','Whole artifact or complete operation range; context outside scope read-only.','Out-of-scope edits reject the candidate.'],['Semantics','Types, shapes, layouts, effects, aliasing, FP behavior and tolerances.','Additional agent assumptions need evidence.'],['Compilation','Start checkpoint, compiler build, pass configuration, outputs and hard stop.','Unsupported entry or incompatible continuation.'],['Evidence','Required checks; metric stage, units, target and improvement threshold.','Unsupported coverage and inconclusive outcomes.'],['Resources','Candidates, shared request limits, model calls/tokens and host/NPU jobs.','Stop scheduling beyond the remaining budget.']],[290,730,460],179,[56,104,104,104,104,104],24);
}
{
const s=slide('MVP scope and implementation stages','The MVP target remains month 4 in a six-month horizon, assuming one developer, part-time compiler support and required environment access. The baseline includes dialect knowledge delivery, durable state and replay. Month 5 evaluates it. Month 6 selects one refinement supported by those observations.','H06; H07; ASC-43; implementation backlog');
t(s,'Scope','One engineer-supplied input mode, one demonstrated compilation route, one checking policy and one evaluator.',60,170,1450,112,{size:36,bold:true});
const rows=[['Month 1','Establish compiler entry / continuation; direct agent experiments on real cases.'],['Months 2–3','Implement profiles, snapshots, dialect pack, agent edits, runners, feedback and durable state.'],['Month 4 · MVP','Complete budget enforcement, interrupted-work resume, finding export and relocated replay.'],['Month 5','Evaluate held-out cases with agreed usefulness criteria, repeats and resource budgets.'],['Month 6','Implement and compare one context, tool, discovery or feedback refinement.']];
tbl(s,[['Stage','Deliverable'],...rows],[310,1170],329,[49,79,94,94,79,79],26);
foot(s,'Resources — one developer, part-time compiler expertise, model/host capacity and NPU access when the selected route requires it.');
}
{
const s=slide('Primary risks concern finding yield and integration effort','H05 orders the risks by severity and puts useful finding yield first, integration costs second. Their probability remains unknown. Expert-effort savings and evidence quality are additional concerns considered manageable by the project owner, with provisional assessments.','H05; H08');
section(s,'Too few useful findings','Rewrites may be invalid, trivial, narrowly applicable or already handled by a later compiler stage.',60,177,695,160);
section(s,'Integration costs dominate','Saved IR may require state restoration, custom harnesses, checking coverage or scarce device access.',850,177,690,160);
bar(s,60,425,1480);
tbl(s,[['Additional risk','Failure to watch for'],['Expert effort','Preparation, reviewing assumptions and maintaining the harness consume the time saved.'],['Metric relevance','A lower score fails to improve relevant downstream code or workloads.'],['Correctness coverage','Selected checks miss behavior changed by the rewrite.']],[355,1125],478,[52,89,89,89],26);
foot(s,'Useful findings are the primary outcome. Effort saving and evidence limits are measured alongside finding quality.');
}
{
const s=slide('Evaluation protocol and controlled refinement studies','The proposed MVP target is at least one real replayable finding worth engineer investigation. Main evaluation uses representative held-out cases, separate from development. Agree usefulness criteria, limits and repeat counts in advance. Report every attempted case including duplicates, rejected, unsupported and inconclusive outcomes. Controlled refinement studies change one component while keeping cases, model, checks, objective and relevant budgets comparable. A comparable engineer workflow is needed to claim expert-effort saving.','H08; research backlog R07–R17');
const corpus=box(s,'Cases','Fixed held-out corpus\nseparate development cases',60,198,380,100,{size:25}),baseline=box(s,'Baseline','MVP baseline',600,175,330,77,{size:25}),variant=box(s,'Refinement','One selected refinement',600,332,330,77,{size:25,bg:P.pale,color:P.amber}),ledger=box(s,'Ledger','All outcomes + costs\nversioned run history',1110,254,430,100,{size:25});a(s,corpus,baseline,{kind:'elbow'});a(s,corpus,variant,{kind:'elbow',color:P.amber});a(s,baseline,ledger,{kind:'elbow'});a(s,variant,ledger,{kind:'elbow',color:P.amber});
tbl(s,[['Primary evidence','Additional outcomes'],['Engineer-reviewed useful findings','Rejected, duplicate, unsupported and inconclusive cases.'],['Replays of retained findings','Coverage, check outcomes and metric changes per replay.'],['At least one real case for MVP','Preparation/review effort, model use and host/NPU usage.']],[650,830],492,[52,80,80,80],25);
t(s,'Protocol condition','Before the study, agree case selection, usefulness criteria, search budgets and repeats. Any effort-saving claim identifies its reference workflow.',60,817,1480,65,{size:22});
}
await fs.mkdir(path.join(root,'.codex-finalizer'),{recursive:true});
await fs.mkdir(path.dirname(out),{recursive:true});
const candidate=path.join(root,'.codex-finalizer','technical-candidate.pptx');
await(await PresentationFile.exportPptx(deck)).save(candidate);
await finalizePresentation({workspaceDir:root,candidatePath:candidate,finalPath:out,explicitTotalSlideCount:19,requiredNativeTableOwnerSlides:[2,3,5,8,9,12,13,16,17,18,19],requiredNativeChartOwnerSlides:[],pythonExecutable:python,integrityValidatorPath:path.join(skill,'container_tools/inspect_presentation_package_integrity.py'),layoutValidatorPath:path.join(skill,'container_tools/inspect_presentation_layout_geometry.py'),layoutArgs:['--expected-slide-size-emu','15240000,8572500','--validate-heading-fit',...[2,3,5,8,9,12,13,16,17,18,19].flatMap(n=>['--require-native-table-slide',String(n)])],fontPolicy:{basis:'design',families:[FONT,MONO]},verifyArtifactToolImport:true,receiptPath:path.join(root,'.codex-finalizer',path.basename(out)+'.validation.json')});
await fs.writeFile(path.join(root,'technical-outline.json'),JSON.stringify(source,null,2)+'\n');
console.log('Created '+deck.slides.items.length+' editable technical slides.');
