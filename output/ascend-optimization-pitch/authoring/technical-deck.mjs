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
const {finalizePresentation,makeNativeBulletParagraphs}=await import(pathToFileURL(path.join(skill,'container_tools/artifact_tool_utils.mjs')).href);
const root=process.env.PITCH_BUILD_ROOT?path.resolve(process.env.PITCH_BUILD_ROOT):await fs.mkdtemp(path.join(os.tmpdir(),'ascend-pitch-'));
const out=process.env.PITCH_OUTPUT||path.join(root,'final','ascend-optimization-technical.pptx');
const P={bg:'#FCFDFF',ink:'#203248',blue:'#245994',muted:'#4B6178',line:'#B8C8D9',tint:'#EDF3F9',amber:'#85530B',pale:'#FFF0CF',green:'#246553',lightGreen:'#EDF7F2',purple:'#645184',lightPurple:'#F2EFF8',red:'#9C3F36',lightRed:'#FBEFEC'};
const deck=Presentation.create({slideSize:{width:1600,height:900}});
const FONT='Arial',MONO='Courier New',noLine={width:0,fill:'none',style:'solid'};
const LPO='https://arxiv.org/abs/2508.16125v2',PRAGMA='https://arxiv.org/abs/2511.06345v2';
const REF={
 canonical:'https://mlir.llvm.org/docs/Canonicalization/',
 passes:'https://mlir.llvm.org/docs/PassManagement/',
 ub:'https://llvm.org/docs/UndefinedBehavior.html',
 load:'https://llvm.org/docs/LangRef.html#load-instruction',
 codex:'https://developers.openai.com/cookbook/examples/gpt-5/codex_prompting_guide',
 claude:'https://code.claude.com/docs/en/sub-agents',
 opencode:'https://opencode.ai/docs/agents/',
 sql:'https://docs.langchain.com/oss/python/langchain/sql-agent',
 paperqa:'https://github.com/Future-House/paper-qa/blob/main/src/paperqa/prompts.py',
 alive:'https://github.com/AliveToolkit/alive2',
 mlirtv:'https://github.com/aqjune/mlir-tv',
 xdsl:'https://github.com/opencompl/xdsl-smt',
 mlirtool:'https://mlir.llvm.org/docs/Tutorials/MlirOpt/',
 stats:'https://mlir.llvm.org/docs/Passes/#-print-op-stats',
 tti:'https://llvm.org/doxygen/classllvm_1_1TargetTransformInfo.html',
 mca:'https://www.llvm.org/docs/CommandGuide/llvm-mca.html',
 msprof:'https://www.hiascend.com/doc_center/source/en/CANNCommunityEdition/850/devaids/optool/atlasopdev_16_0082.html'
};
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
 values.forEach((row,r)=>{table.rows[r].height=heights[r];row.forEach((v,c)=>{const cell=table.getCell(r,c);cell.fill=r===0?P.blue:(r%2===0?P.tint:P.bg);cell.text.style={verticalAlignment:'middle',typeface:FONT,fontSize:r===0?22:size,color:r===0?'#FFFFFF':P.ink,bold:r===0||c===0};});});return table;
}
{
const s=slide('Compilers miss useful optimizations','The upper pipeline is a schematic dependency, not a trace diagnosing a particular compiler. A legality condition can hold while an implemented pattern fails to recognize the IR. A later pass can execute without applying a dependent rewrite because the enabling form was not produced. Misordering is another possible mechanism. The lower excerpt is a real documented LLVM missed-optimization case from LPO Figure 1(b,c), originating from a Rust clamp. SSA names are renamed and calls reflowed; the omitted function signature takes i32 x and returns i8 r. The alternative replaces comparison/select with signed max, followed by unsigned min and truncation. Four versus three counts only the shown IR operations, not runtime speedup. The generic cascade is not asserted as this case’s diagnosed cause.','Documented LLVM case: LPO §2.2, Figure 1(b,c): '+LPO+'\nLocal PDF: attachments/papers/LPO-2508.16125v2.pdf\nPass dependency illustration is schematic.');
const input=box(s,'IR input','IR input',60,201,150,118,{size:25}),pa=box(s,'Pass A','Pass A\nEarlier transforms',255,201,180,118,{size:24}),pb=box(s,'Pass B','Pass B\nLegal rewrite\nnot matched',480,201,325,118,{size:25,bg:P.pale,color:P.amber}),pc=box(s,'Pass C','Pass C\nEnabling form absent\nrewrite not applied',850,201,325,118,{size:24,bg:P.pale,color:P.amber}),out=box(s,'Codegen','Suboptimal\ncodegen',1220,201,320,118,{size:27,bg:P.lightRed,color:P.red});
a(s,input,pa);a(s,pa,pb);a(s,pb,pc,{color:P.amber});a(s,pc,out,{color:P.red});
t(s,'Pattern heading','Pattern recognition',60,350,440,43,{size:31,bold:true,color:P.blue});
t(s,'Pattern explanation','An existing transformation may not recognize an equivalent IR form, even when its legality conditions hold.',60,405,440,110,{size:26});
t(s,'Ordering heading','Pass placement / ordering',580,350,440,43,{size:31,bold:true,color:P.blue});
t(s,'Ordering explanation','A transformation may expose a useful IR form or property after the pass that could exploit it has already run.',580,405,440,110,{size:26});
t(s,'Logic heading','Missing transformations',1100,350,440,43,{size:31,bold:true,color:P.blue});
t(s,'Logic explanation','Exploiting an opportunity may require extending a rule or analysis, or implementing another transformation.',1100,405,440,110,{size:26});
bar(s,60,532,1480);
t(s,'IR case heading','LLVM IR excerpt: clamp i32 to [0, 255], then cast to i8',60,551,1480,38,{size:26,color:P.blue,bold:true});
t(s,'Original heading','Observed sequence (4 operations)',60,601,710,33,{size:23,bold:true});
t(s,'Alternative heading','Equivalent form (3 operations)',830,601,710,33,{size:23,bold:true});
t(s,'Original LLVM','%neg = icmp slt i32 %x, 0\n%hi = call i32 @llvm.umin.i32(\n        i32 %x, i32 255)\n%v = trunc nuw i32 %hi to i8\n%r = select i1 %neg, i8 0, i8 %v',60,644,710,207,{mono:true,size:24,bg:P.tint,pad:12});
t(s,'Alternative LLVM','%lo = call i32 @llvm.smax.i32(\n        i32 %x, i32 0)\n%hi = call i32 @llvm.umin.i32(\n        i32 %lo, i32 255)\n%r = trunc nuw i32 %hi to i8',830,644,710,207,{mono:true,size:24,bg:P.lightGreen,pad:12});
}
{
const s=slide('How performance work starts in AscendNPU-IR','Current practices come from the project owner’s observations. Nightly testing helps prevent significant regressions reaching upstream. Optimization epics can proactively explore an optimization class, usually after a performance problem has already been noticed. The intended gap is routine discovery before a problem is noticed, not an assertion that the team never works proactively. The role of cross-platform comparisons in task selection remains uncertain.','Current practices and uncertainties',40);
tbl(s,[['Entry point','Trigger and engineering work'],['Nightly performance regression testing','Detect deterioration against a baseline to help keep regressions out of upstream. Investigate or revert offending changes.'],['Performance issue tickets','Investigate slow cases discovered in already merged code.'],['Kernel-specific tasks','Investigate a selected kernel through generated-code inspection and profiling where feasible.'],['Optimization epics','Proactively improve related compiler optimizations, for example vectorization or redundant-check elimination.']],[445,1035],174,[55,102,91,102,102],26);
const gap=t(s,'Discovery gap','The gap: routine discovery of optimization opportunities before a performance problem is noticed.',60,691,1480,112,{size:30,bg:P.pale,pad:16,middle:true});
gap.text.get('The gap:').bold=true;
gap.text.get('The gap:').fill=P.blue;
}
{
const s=slide("[REWORK] Where compiler engineers spend time finding optimizations","The diagram shows the investigation workflow. The four rows explain sources of search effort rather than experiment administration. The central difficulty is finding a useful alternative when none has been supplied. A slow kernel alone does not distinguish an unavoidable hardware cost, an algorithmic choice or a compiler opportunity. For example, a suspected redundant check requires connecting earlier value constraints, casts, available compiler facts and downstream code effects. An LLM can assist with all four sources of effort already. The proposed framework aims to sustain a bounded search using configured tools and evidence to guide subsequent attempts. The MVP relies on engineers to supply applicable assumptions and evaluation policy; it does not promise to replace all engineering decisions. Useful findings and reduced expert involvement remain evaluation goals.",'Goal and intended value; human investigation and search effort; project-owner slide review, 2026-11-12',40);
const input=box(s,'Inputs','Existing\nkernels / IR',60,230,230,106,{size:24}),inspect=box(s,'Reason','Inspect IR and\nform a hypothesis',350,230,240,106,{size:24}),propose=box(s,'Candidate','Propose an IR or\npipeline change',650,230,250,106,{size:24}),check=box(s,'Check and assess','Compile, check\nand compare',960,230,280,106,{size:24}),retain=box(s,'Retain','Retain a\nreproducible case',1300,230,240,106,{size:24,bg:P.lightGreen,color:P.green});
a(s,input,inspect);a(s,inspect,propose);a(s,propose,check);a(s,check,retain,{color:P.green});
t(s,'Acceptance condition','Meets correctness and\nimprovement criteria',1050,151,490,58,{size:23,color:P.green,center:true,middle:true});
const conditionTop=point(s,'Acceptance label anchor',1270,209),conditionBottom=point(s,'Acceptance path anchor',1270,282);
a(s,conditionTop,conditionBottom,{fromSide:'bottom',toSide:'top',color:P.green,arrow:false});
const retryDown=point(s,'Retry down',1100,382),retryBack=point(s,'Retry return',470,382);
a(s,check,retryDown,{fromSide:'bottom',toSide:'top',color:P.amber,arrow:false});a(s,retryDown,retryBack,{color:P.amber,arrow:false});a(s,retryBack,inspect,{fromSide:'top',toSide:'bottom',color:P.amber});
t(s,'Retry condition','Rejected candidate or insufficient improvement',350,397,890,42,{size:23,color:P.amber,center:true,middle:true});
t(s,"Effort heading 1","Locating a promising opportunity",60,462,410,84,{size:28,bold:true,color:P.blue,middle:true});
t(s,"Effort body 1","Which parts of the generated code might admit a useful improvement, among many ordinary or already well-optimized sequences?",520,462,1020,84,{size:26,middle:true});
bar(s,60,552,1480);
t(s,"Effort heading 2","Constructing a better alternative",60,558,410,84,{size:28,bold:true,color:P.blue,middle:true});
t(s,"Effort body 2","Which equivalent IR form or pass arrangement could avoid the suspected inefficiency, using information available to the compiler?",520,558,1020,84,{size:26,middle:true});
bar(s,60,648,1480);
t(s,"Effort heading 3","Following the effect through compilation",60,654,410,84,{size:28,bold:true,color:P.blue,middle:true});
t(s,"Effort body 3","Does the alternative produce a useful downstream difference, or does later compilation erase its benefit or introduce another cost?",520,654,1020,84,{size:26,middle:true});
bar(s,60,744,1480);
t(s,"Effort heading 4","Navigating unsuccessful hypotheses",60,750,410,84,{size:28,bold:true,color:P.blue,middle:true});
t(s,"Effort body 4","When an attempt fails, what should be changed or investigated next, and when is further investigation no longer worthwhile?",520,750,1020,84,{size:26,middle:true});
}

{
const s=slide('Proposition',"The three objectives define the intended technical capabilities: explore alternative IR forms and pass arrangements in existing AscendNPU-IR kernels, establish correctness checks and improvement criteria, and automate recurring experimentation with reproducible findings for compiler engineers. These are project objectives, not achieved results. Independent verification is limited by the selected checking methods and their supported coverage. Useful findings and reduced expert effort remain to be evaluated. Implementation stages and detailed architecture are presented later.",'Goal and intended value; framework investigation objectives; project-owner slide review, 2026-11-12');
const goal=t(s,'Goal','Goal: Build an LLM-assisted framework for systematic discovery of missed optimizations in AscendNPU-IR and verification of findings.',60,174,1480,152,{size:44,bold:true});
goal.text.get('Goal:').fill=P.blue;
t(s,"Explore opportunities heading","Explore optimization opportunities",60,386,410,100,{size:33,bold:true,color:P.blue,middle:true});
t(s,"Explore opportunities body","Search alternative IR forms and pass arrangements\nin existing AscendNPU-IR kernels.",520,386,1020,100,{size:31,middle:true});
bar(s,60,510,1480);
t(s,"Acceptance criteria heading","Establish reliable acceptance criteria",60,548,410,100,{size:33,bold:true,color:P.blue,middle:true});
t(s,"Acceptance criteria body","Determine how to check correctness\nand demonstrate improvement.",520,548,1020,100,{size:31,middle:true});
bar(s,60,672,1480);
t(s,"Offload investigation heading","Offload recurring investigation work",60,710,410,100,{size:33,bold:true,color:P.blue,middle:true});
t(s,"Offload investigation body","Automate experiments and produce reproducible findings\nfor compiler engineers.",520,710,1020,100,{size:31,middle:true});
}

{
const s=slide('Research directions and concrete starting points','The studies remain open. New pass-ordering work compares fixed-pipeline IR rewrites, existing-pass pipeline variants and their combinations. A shared experiment format and continuation across environments are implementation requirements, with exact schemas and compatible execution bindings to design. Advanced selectors, richer context, tools and feedback policies remain comparisons after the baseline.','Framework research agenda; experiment records and continuation design\nProject-owner clarification, 2026-11-11');
tbl(s,[['Study','Concrete starting points','What to compare','Evidence to retain'],['Pass / rewrite search','MLIR textual pass pipelines.\nIR variants + scoped pass edits.','Rewrite only, ordering only and combined candidates.','Full pass sequences, checkpoints and paired results.'],['Improvement metrics','MLIR op statistics.\nLLVM TTI / llvm-mca.\nAscend msProf.','Cheap indicators vs downstream code or execution.','Coverage, downstream survival and collection cost.'],['Compilation / checks','MLIR verifier / Alive2.\nMLIR-TV / xdsl-smt.','Checkpoint compatibility and cross-pass semantic coverage.','Route matrix, assumptions and reproducible probes.'],['Agent context','Codex / Claude Code / OpenCode.\nSQL agents / PaperQA.','Direct dialect context vs retrieval or added analyses.','Useful findings, invalid edits and context cost.'],['Agent tools','File edits and diagnostics.\nOperation-aware editor.','IR / pipeline edit controls and checking tools.','Valid proposals, reachable changes and total cost.'],['Region discovery','Use-def / effect scans.\nCost or profile estimates.','Supplied range vs prompted, static or cost-guided selection.','Coverage, useful yield and selection cost.'],['Feedback / policy','LPO errors / counterexamples.\nPRAGMA profiles and history.','Feedback detail, continuation and budget allocation.','Attempt traces, useful yield and expensive checks.']],[235,415,440,390],168,[54,87,87,87,87,87,87,87],23);
foot(s,'Candidate tools and mechanisms to investigate. Ascend integration and useful semantic / metric coverage remain unestablished.');
}
{
const s=slide('Two paper workflows inform the experiment','The top workflow is reconstructed from LPO Figure 2 and §3.2–3.3. Its extractor wraps dependent sequences, reoptimizes and deduplicates. opt -O3 preprocesses candidates; interestingness screens before Alive2 refinement checking. The lower workflow is reconstructed from PRAGMA Figures 1–2 and §III. A deterministic verifier compares outputs; a profiler gathers counters; the conductor reasons over code, logs, metric documentation and best history. The Ascend baseline can use one session; these papers motivate responsibilities and feedback signals.','LPO Figure 2 and §3.2–3.3: '+LPO+'\nPRAGMA Figures 1–2 and §III: '+PRAGMA);
label(s,'LPO: Discovering Missed Peephole Optimizations with Large Language Models',60,161,1480,P.blue,26);
const lp=[['Corpus',60,130],['Extract / wrap\nreoptimize / dedup',230,235],['LLM',505,140],['opt -O3',685,165],['Interestingness',890,185],['Alive2',1115,165],['Retain pair',1320,220]].map(([v,x,w])=>box(s,'LPO '+v,v,x,230,w,84,{size:22}));
lp.slice(0,-1).forEach((n,i)=>a(s,n,lp[i+1]));
const lf=box(s,'LPO feedback','Compiler diagnostic / refinement counterexample',500,365,780,54,{size:21,bg:P.pale,color:P.amber});a(s,lp[3],lf,{fromSide:'bottom',toSide:'top',kind:'elbow',color:P.amber});a(s,lp[5],lf,{fromSide:'bottom',toSide:'top',kind:'elbow',color:P.amber});a(s,lf,lp[2],{fromSide:'left',toSide:'bottom',kind:'elbow',color:P.amber});
label(s,'Screen uses instruction count or llvm-mca estimates; syntactic alternatives may also be retained.',60,436,1480,P.muted,21);
bar(s,60,495,1480);
label(s,'PRAGMA: A Profiling-Reasoned Multi-Agent Framework for Automatic Kernel Optimization',60,518,1480,P.blue,26);
const coder=box(s,'Coder','Coder\nLLM',60,615,225,84,{bg:P.lightPurple,color:P.purple}),verifier=box(s,'Verifier','Verifier\ncompile + compare outputs',380,615,330,84),profiler=box(s,'Profiler','Profiler\nNCU / perf counters',805,615,310,84),conductor=box(s,'Conductor','Conductor\nLLM guidance',1210,615,330,84,{bg:P.lightPurple,color:P.purple});a(s,coder,verifier);a(s,verifier,profiler);a(s,profiler,conductor);
const history=box(s,'PRAGMA history','Code + verifier logs + metric docs + best history',805,754,735,52,{size:20,bg:P.pale,color:P.amber});a(s,history,conductor,{fromSide:'top',toSide:'bottom',kind:'elbow',color:P.amber});a(s,verifier,history,{fromSide:'bottom',toSide:'left',kind:'elbow',color:P.amber});const gp1=point(s,'Guidance turn',1374,591),gp2=point(s,'Guidance return',172,591);a(s,conductor,gp1,{fromSide:'top',toSide:'bottom',color:P.amber,arrow:false});a(s,gp1,gp2,{color:P.amber,arrow:false});a(s,gp2,coder,{fromSide:'bottom',toSide:'top',color:P.amber});label(s,'Guidance for the next edit',585,555,510,P.amber,20);
foot(s,'Editable reconstructions of LPO Fig. 2 and PRAGMA Figs. 1–2. LLVM and CPU/GPU tool assumptions belong to the papers.');
}
{
const s=slide('Proposed Ascend investigation architecture','Framework design defines stage contracts and a default search policy. Read-only input snapshots remain distinct from candidate working copies. A single agent session proposes candidate IR and permitted pipeline changes. Adapters compile the fixed baseline route and each candidate route through saved recipes. Candidate kernels and pipeline variants have separate identities. Typed feedback returns independent outcomes and evidence pointers to the same conversation. The durable store records intent and completion plus budget usage at every stage.','Framework design §§2.1–2.6; MVP dialect knowledge task');
frame(s,'Prepared case',60,205,330,360);
frame(s,'Agent session',440,205,335,360,P.purple);
frame(s,'Execution recipe and adapters',825,205,715,360);
const orig=box(s,'Original','Fixed baseline kernel\n+ pipeline + context',85,236,280,87,{size:22});
const spec=box(s,'Configuration','Permitted IR / pass edits\nchecks + metric policy\nshared limits',85,391,280,125,{size:21});
const ctx=box(s,'Knowledge pack','Versioned dialect docs\n+ selected task context',466,236,282,87,{size:22,bg:P.lightPurple,color:P.purple});
const agent=box(s,'Agent','Propose IR / pipeline edits\ncandidate working set',466,391,282,101,{size:23,bg:P.lightPurple,color:P.purple});
const compile=box(s,'Compilation','Compile baseline and candidate variants\nretain requested checkpoints',853,240,657,75,{size:23});
const checks=box(s,'Validation','Validation adapter\npolicy + coverage',853,410,300,90,{size:22});
const metric=box(s,'Evaluator','Metric evaluator\ncriterion + observations',1210,410,300,90,{size:22});
a(s,ctx,agent,{fromSide:'bottom',toSide:'top'});a(s,spec,agent);const op1=point(s,'Baseline turn 1',224,163),op2=point(s,'Baseline turn 2',1570,163),op3=point(s,'Baseline turn 3',1570,277);a(s,orig,op1,{fromSide:'top',toSide:'bottom',arrow:false});a(s,op1,op2,{arrow:false});a(s,op2,op3,{fromSide:'bottom',toSide:'top',arrow:false});a(s,op3,compile,{fromSide:'left',toSide:'right'});a(s,agent,compile,{kind:'elbow'});a(s,compile,checks,{fromSide:'bottom',toSide:'top',kind:'elbow'});a(s,compile,metric,{fromSide:'bottom',toSide:'top',kind:'elbow'});
const fb=box(s,'Typed feedback','Structured feedback + evidence references + remaining budget',440,635,1100,62,{bg:P.pale,color:P.amber,size:23});a(s,checks,fb,{fromSide:'bottom',toSide:'top',kind:'elbow',color:P.amber});a(s,metric,fb,{fromSide:'bottom',toSide:'top',kind:'elbow',color:P.amber});a(s,fb,agent,{fromSide:'left',toSide:'bottom',kind:'elbow',color:P.amber});
t(s,'Persistence','Persist kernels, pipelines, trials, results, agent reports, pending work and budgets across every stage.',60,753,1480,66,{size:24,bg:P.tint,pad:12});
foot(s,'Finding eligibility = required checks pass + selected criterion met + complete runnable bundle.');
}
{
const s=slide('Search combines kernel variants and pass pipelines','Treat the baseline kernel and pipeline as the fixed control. Candidate dimensions include kernel/IR rewrites, permitted existing-pass sequences/options and case configurations. This diagram is illustrative and does not claim the named relative order improves Ascend. Pass dependencies, nesting, analysis invalidation and available pipeline entry points must be checked. The product of dimensions defines the search space, not a requirement to enumerate it exhaustively.','Project-owner clarification, 2026-11-11\nMLIR pass pipelines and analysis management: '+REF.passes);
const kv=box(s,'Kernel variants','Kernel / IR variants\nK0 original, K1 rewritten',60,193,580,95,{size:26}),pv=box(s,'Pipeline variants','Permitted pass pipelines\nP0 baseline, P1 reordered',960,193,580,95,{size:26});
const trial=box(s,'Trial','Trial = kernel variant + pipeline variant + case\ncompile, check and assess the complete combination',425,374,750,96,{size:26,bg:P.pale,color:P.amber});a(s,kv,trial,{fromSide:'bottom',toSide:'left',kind:'elbow'});a(s,pv,trial,{fromSide:'bottom',toSide:'right',kind:'elbow'});
tbl(s,[['Experiment','Question / comparison'],['K0 + P0','Fixed baseline under recorded compiler, target and workload settings.'],['K0 + P1','Does pass placement / ordering expose an existing optimization?'],['K1 + P0, then K1 + P1','Does the IR change help alone or together with the pipeline change?']],[350,1130],527,[49,72,72,83],26);
foot(s,'Example: track ranges / cast precision, then run the consuming simplification. Check pass invariants and downstream output.');
}
{
const s=slide('Candidate transformations and applicability conditions','The arithmetic family focuses on tracking ranges and precision through casts, rather than only removing a clamp. Memory-access rewrites may require cross-pass reasoning about bounds, alignment, definedness and lowering assumptions. Keep these as a later/high-complexity study until the selected checking route covers them; this is not a commitment to a general UB planner. Pass placement and ordering are an explicit family alongside direct IR rewrites. The paper examples motivate cases but do not establish Ascend defects.','Candidate optimization families; project-owner clarification, 2026-11-11\nLPO §4.3: '+LPO+'\nPRAGMA §IV-D: '+PRAGMA+'\nLLVM definedness and loads: '+REF.ub+' '+REF.load);
tbl(s,[['Family','Opportunity to investigate','Conditions / checkpoint information'],['Value ranges / precision','Track ranges and precision through casts to expose simplifications.','Signedness, rounding / overflow, cast semantics and observed results.'],['Predicates / selects','Remove a NaN guard before ordered equality.','FP predicate semantics and other uses of the sanitized value.'],['Memory / UB across passes','Combine accesses only with covered cross-pass definedness assumptions.','Bounds, alignment, address space, effects and poison/undef or dialect semantics after lowering.'],['Vectorization / lowering','Expose a target instruction or change vectorization choices.','Vector width, legal operations and contraction permissions.'],['Reduction organization','Change reduction structure or target mapping.','Shape, neutral element, NaN handling and numeric order.'],['Layout conversions','Eliminate inverse changes or retain a layout across consumers.','Physical layout, aliasing and downstream requirements.'],['Pass placement / ordering','Move or repeat an existing pass after enabling facts / forms appear.','Pass invariants, required analyses / invalidation and remaining pipeline.']],[300,530,650],174,[54,84,75,101,75,75,75,85],23);
foot(s,'Memory / UB work is a later scope candidate until semantic coverage is demonstrated. Other families also require complete-route checks.');
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
const s=slide('Request resolution and dialect knowledge delivery','The input and configuration fields are based on Framework design §2.1. The YAML-like view is an interface illustration, with profile names awaiting selection. The baseline pipeline and permitted candidate pipeline space are explicit. The concrete dialect support task is part of MVP. Provide versioned authoritative operation/type/attribute semantics and representative examples as context or readable files. Capture information actually supplied or retrieved and report unknown semantics. Agent context study evaluates richer instruction and retrieval methods; Agent tools study evaluates tools and editing restrictions.','Framework design §§2.1–2.3; Agent context study; Agent tools study; MVP dialect knowledge task');
label(s,'Illustrative request shape',60,166,660,P.blue,26);
t(s,'Request fields','input: module.mlir\nmode: specified_range\nregion: operation_range\ncheckpoint: input_profile\npipelines: allowed_variants\nchecking: validation_profile\nobjective: evaluator_profile\nlimits: request_budget',60,226,610,375,{mono:true,size:26,bg:P.tint,pad:15});
t(s,'Resolution','Defaults → request → per-input overrides\nShared request limits stay upper bounds.',60,653,610,106,{size:25});
const docs=box(s,'Sources','Dialect specs / compiler definitions\nengineer-reviewed examples',750,225,790,82,{size:24}),pack=box(s,'Pack','Versioned reference pack\nops · types · attributes · effects · target constraints',750,382,790,101,{size:24,bg:P.lightPurple,color:P.purple}),agent=box(s,'Model material','Task prompt + relevant context / readable docs\nrecord material exposed to the model',750,567,790,101,{size:24,bg:P.lightPurple,color:P.purple});a(s,docs,pack,{fromSide:'bottom',toSide:'top'});a(s,pack,agent,{fromSide:'bottom',toSide:'top'});
foot(s,'Prompt/context study: inspect public harnesses, then compare direct dialect context, retrieval and added analyses.');
}
{
const s=slide('Agent context research: public harness starting points','Inspect published prompts and message-assembly mechanisms, rather than assuming access to complete proprietary system prompts. The Codex guide is a model-specific published example, Claude Code documents custom subagent instructions, and OpenCode documents configurable agents. SQL agents and PaperQA provide specialist examples for retrieval and evidence handling. These are study references, not a decision to adopt a product or multi-agent topology. Pin source versions before comparative experiments.','Codex: '+REF.codex+'\nClaude Code: '+REF.claude+'\nOpenCode: '+REF.opencode+'\nLangChain SQL agent: '+REF.sql+'\nPaperQA prompts: '+REF.paperqa);
tbl(s,[['Reference','Public mechanism to inspect','Possible Ascend experiment'],['Codex','Published starter prompt, repository instructions and tool use.','How to combine task instructions, dialect facts and compiler tools.'],['Claude Code','Custom subagent system prompts and scoped tool access.','Explicit IR-review role with a controlled tool set.'],['OpenCode','Agent definitions with custom prompts and tool permissions.','Separate reusable domain instructions from per-case context.'],['LangChain SQL agent','Schema retrieval and correction from database errors.','Retrieve operation semantics on demand and repair from diagnostics.'],['PaperQA','Evidence extraction and answer-synthesis prompt templates.','Summarize relevant dialect documentation while retaining sources.']],[250,610,620],174,[54,100,100,100,100,100],24);
t(s,'Controlled context study','Baseline: supplied IR + versioned dialect references. Compare direct context, retrieved documentation and targeted analyses under the same model and search budget.',60,764,1480,102,{size:25,bg:P.pale,middle:true,pad:14});
}
{
const s=slide('Compilation checkpoints determine route compatibility','This is an illustrative route diagram, not a claim that Ascend accepts the depicted checkpoints. Compilation and validation study must establish input state restoration, prerequisite passes and exact output boundaries. A metric observation may occur earlier than the artifact consumed by execution validation. An explicit stop before the required lowering makes that runtime policy incompatible. Record the exact compiler version, pass sequence/options, metadata, target and required resources for each demonstrated route. A pipeline candidate may differ intentionally from the baseline, while preserving agreed comparison conditions.','Framework design §2.4; Compilation and validation study; Metrics study');
label(s,'Illustrative continuation for each recorded baseline / candidate route',60,165,1480,P.blue,27);
const n1=box(s,'Start','K_in\naccepted IR + restored state',60,259,320,94),n2=box(s,'Continuation','Recorded pipeline variant',520,259,300,94),n3=box(s,'Observation','K_metric\nintermediate snapshot',960,259,315,94),n4=box(s,'Executable','Runnable device artifact\n+ host harness',1150,536,390,98);
a(s,n1,n2);a(s,n2,n3);
const evaluator=box(s,'Observe','Static evaluator\nif stage / operations supported',550,536,410,98,{bg:P.lightGreen,color:P.green});
const split=point(s,'Snapshot branch',1117,378),stat=point(s,'Static branch turn',755,378),run1=point(s,'Runtime lower turn',1117,445),run2=point(s,'Runtime artifact turn',1345,445);
a(s,n3,split,{fromSide:'bottom',toSide:'top',arrow:false});
a(s,split,stat,{color:P.green,arrow:false});a(s,stat,evaluator,{fromSide:'bottom',toSide:'top',color:P.green});
a(s,split,run1,{fromSide:'bottom',toSide:'top',color:P.red,dash:true,arrow:false});a(s,run1,run2,{color:P.red,dash:true,arrow:false});a(s,run2,n4,{fromSide:'bottom',toSide:'top',color:P.red,dash:true});
label(s,'Further lowering / link / load',1158,463,370,P.red,23);
bar(s,1076,403,420,P.red,3);label(s,'Optional hard stop here',1150,360,390,P.red,23);
t(s,'Compatibility condition','Runtime validation needs a runnable artifact. A hard stop before its required lowering blocks this policy. The metric checkpoint can remain earlier if continuation is allowed.',60,696,1480,108,{size:28,bg:P.pale,middle:true,pad:14});
foot(s,'Route study output: checkpoint catalog, validation coverage and a demonstrated / incompatible / unknown configuration matrix.');
}
{
const s=slide('Validation research: LLVM and MLIR starting points','The tools below offer different kinds of evidence and are not interchangeable. MLIR verification checks IR invariants. Alive2 checks LLVM refinement. MLIR-TV and xdsl-smt supply semantic checking for supported MLIR/xDSL subsets. Their exact operation, control-flow, memory and floating-point coverage must be probed before use. Translating custom Ascend operations into a supported representation creates an additional semantic obligation. Execution compares only the selected observable results on recorded cases.','MLIR tool: '+REF.mlirtool+'\nAlive2: '+REF.alive+'\nMLIR-TV: '+REF.mlirtv+'\nxdsl-smt: '+REF.xdsl+'\nFramework compilation and validation contract');
tbl(s,[['Starting point','Input / available evidence','What the study must establish'],['MLIR verifier / project driver','Registered dialect IR and operation invariants.','Parsing / verification / compilation success is structural evidence.'],['Alive2 (LLVM)','LLVM IR original/candidate refinement check.','A usable LLVM route and supported semantics. Custom lowering needs separate justification.'],['MLIR-TV','SMT-based translation validation for supported MLIR.','Supported operations, shapes, memory and FP semantics for selected cases.'],['xdsl-smt / xdsl-tv','Refinement checks for subsets of arith, comb and func.','Representation mapping and the cost of missing operation semantics.'],['Execution comparison','Project harness, recorded inputs and observable outputs.','Runnable route, NPU requirements, tolerances and test coverage.']],[300,550,630],174,[54,91,101,101,101,101],23);
t(s,'Eligibility','Retain a finding when the selected checks pass, the metric criterion is met and the replay bundle is complete. Record failed, unsupported and inconclusive checks separately.',60,765,1480,105,{size:26,bg:P.pale,middle:true,pad:13});
}
{
const s=slide('Metric research: concrete indicators and tools','Structural counts and logical-memory estimates are cheap screening candidates. MLIR print-op-stats provides operation counts, not a performance guarantee. LLVM TargetTransformInfo exposes target-dependent IR costs; llvm-mca estimates supported CPU assembly using scheduling models. Neither establishes an Ascend NPU model. Ascend documentation describes msProf / msprof op for operator profiling. Its local availability, permissions, artifacts and relevant counters must still be checked. Compare indicator rankings against later code or execution when feasible.','MLIR op statistics: '+REF.stats+'\nLLVM TargetTransformInfo: '+REF.tti+'\nllvm-mca: '+REF.mca+'\nAscend msProf: '+REF.msprof+'\nLPO interestingness: '+LPO);
tbl(s,[['Candidate metric','Starting point / resources','Interpretation and open checks'],['Operation counts','MLIR print-op-stats at a fixed checkpoint.','Cheap structural screen. Later lowering may erase or reverse the reduction.'],['Logical memory work','Shape/layout-based access and byte estimates.','Proposed indicator. Reuse, transfers and physical layout affect real traffic.'],['Target cost estimates','LLVM TTI for supported IR targets. llvm-mca for supported CPU assembly.','Study target / operation coverage. An equivalent Ascend model is not established.'],['Kernel time / counters','Ascend msProf / msprof op with a runnable operator.','Recorded durations / counter data. Check local tooling, warm-up, repeats and collection cost.']],[300,560,620],174,[54,113,113,113,113],24);
const cheap=box(s,'Screen','Cheap candidate screen',60,730,330,66),check=box(s,'Required check','Selected correctness checks',580,730,440,66),retain=box(s,'Retain','Finding criterion',1210,730,330,66);a(s,cheap,check);a(s,check,retain);
foot(s,'Metric improvement and preserved behavior require separate evidence. Static indicators alone do not establish runtime speedup.');
}
{
const s=slide('A common experiment format joins variants and evidence','The proposed storage contract covers whole investigations, not only successful findings. Kernel variants, pipeline variants and workload/configuration cases have stable IDs. A trial joins these with the compiler, checking policy and evaluator recipe. Each execution links its actual environment identity; changed trial semantics create a new linked trial rather than mutating old evidence. Typed check results, raw metric samples, usage, messages, tool outputs and agent-produced reports link to the exact trial. Proposed JSON/JSONL filenames illustrate the format; schema details and version migration remain design work. Private model reasoning is not an assumed artifact.','Proposed experiment records and continuation design; Framework design persistence / replay contracts');
const k=box(s,'Kernel','Kernel variant K_i\nIR + lineage + assumptions',60,177,380,86,{size:23}),p=box(s,'Pipeline','Pipeline variant P_j\npasses + options + checkpoints',610,177,380,86,{size:23}),c=box(s,'Case','Case C_k\nshape / type / layout / inputs',1160,177,380,86,{size:23}),trial=box(s,'Trial join','Trial T_n\nK_i + P_j + C_k + recipe / policy',485,322,630,90,{size:25,bg:P.pale,color:P.amber});a(s,k,trial,{fromSide:'bottom',toSide:'left',kind:'elbow'});a(s,p,trial,{fromSide:'bottom',toSide:'top'});a(s,c,trial,{fromSide:'bottom',toSide:'right',kind:'elbow'});
tbl(s,[['Record / proposed files','Contents linked through stable IDs'],['experiment.json + variants/','Schema version, baseline, kernel / pipeline / case variants and artifact hashes.'],['trials.jsonl + executions/','Trial combinations / recipes. Per-environment attempts, job state, dependencies and budgets.'],['evidence/','Check outcomes / coverage, metric samples / units, diagnostics and resource use.'],['agent/ + reports/','Supplied / retrieved context, exposed messages / tool results and agent-produced reports.']],[380,1100],480,[49,78,78,78,78],24);
foot(s,'Portable records use bundle-relative artifact paths and declared external bindings. Exact schemas and migrations remain to design.');
}
{
const s=slide('Feedback, stopping rules and crash recovery','The default is same-session feedback, each candidate kernel/pipeline combination compared to the fixed baseline, stopping at the first qualifying result or a resource limit. Infrastructure retry is separate from candidate repair. Before each operation, persist intent and reserve budget. Retain complete evidence before marking completion. On restart, reuse completed applicable work and reconcile uncertain external jobs by identifiers or retrievable outputs. Preserve already spent budget and best eligible results. Exact model-response replay is unnecessary.','Framework design §2.5; Agent context study');
tbl(s,[['Observed outcome','Feedback / next action'],['Compilation rejection or behavior mismatch','Send diagnostics or failing input with original/candidate identities. Agent may repair.'],['No qualifying improvement','Send kernel / pipeline / trial IDs, metric values and evidence references.'],['Unsupported check / unavailable hardware','Expose coverage or infrastructure cause; retain an unresolved operation.']],[460,1020],174,[49,86,86,86],25);
label(s,'Durable operation protocol',60,532,1480,P.blue,27);
const phases=[['Record intent\nreserve budget',60,265],['Launch operation\nrecord external ID',455,300],['Persist artifacts\nand result',885,300],['Mark complete\nadvance checkpoint',1310,230]].map(([v,x,w])=>box(s,v,v,x,590,w,87,{size:23}));
phases.slice(0,-1).forEach((n,i)=>a(s,n,phases[i+1]));
t(s,'Recovery','Restart → reconcile in-flight work → reuse completed stages → restore or reconstruct agent context → continue with recorded budget.',60,739,1480,79,{size:26,bg:P.pale,middle:true,pad:13});
foot(s,'Preserve each submitted candidate and the best eligible finding independently of the current working file.');
}
{
const s=slide('The finding is a replayable experiment','Initial comparison and replay use the same versioned execution recipe. A finding links to the experiment, trial, kernel variants, pipeline variants, results and agent reports that produced it. The saved bundle includes code, case material, manifest and environment bindings. A finding replay repeats a saved comparison independently of the generating worker. Resuming an ongoing experiment in another environment additionally restores pending work and the agent context. Replay produces new evidence and preserves original observations. Interrupted export can be regenerated from durable records. The command shown is a proposed interface.','Framework design §§2.4 and 2.6; Evaluation protocol');
t(s,'Bundle','finding-ID/\n  report.md\n  manifest.json\n  trial-reference.json\n  original/\n  candidate/\n  changes.diff\n  evidence/\n  reproduce/\n  replays/',60,188,575,470,{mono:true,size:28,bg:P.tint,pad:17});
const initial=box(s,'Initial run','Initial original / candidate comparison',770,196,770,65,{size:24}),recipe=box(s,'Saved recipe','One saved comparison recipe\nfixed baseline + candidate kernel / pipeline + checks',770,349,770,107,{size:24}),replay=box(s,'Replay','Replay saved versions\nresolve declared environment bindings',770,550,770,90,{size:24});a(s,initial,recipe,{fromSide:'bottom',toSide:'top'});a(s,recipe,replay,{fromSide:'bottom',toSide:'top'});
t(s,'Proposed command','Proposed interface\nframework replay ./finding-ID',60,714,575,90,{size:26,mono:true});
t(s,'Replay result','Each replay stores fresh check results, metric samples and resource usage linked to the original finding.',770,724,770,90,{size:26});
}
{
const s=slide('Continue the same experiment in another environment','Experiment continuation is distinct from replaying a completed finding. A host environment may prepare variants or perform cheap checks, while an NPU lab resolves compatible tool/runtime/data bindings and continues pending work. The portable record includes artifacts, operation state, budget usage and model-visible context/reports. Restore a harness session if supported; otherwise reconstruct it. Reuse only compatible completed operations and append new environment-specific results. Changed hardware or measurement conditions require a new paired baseline/candidate measurement. This is a proposed capability, not an implemented scheduler.','Proposed experiment records and continuation design; Framework design recovery contract');
const host=box(s,'Host environment','Environment A: host\nprepare variants / cheap checks',60,189,380,102,{size:24}),bundle=box(s,'Portable experiment','Versioned experiment record\nartifacts + pending work + reports',610,189,380,102,{size:24,bg:P.pale,color:P.amber}),lab=box(s,'NPU environment','Environment B: NPU lab\nresolve bindings / continue checks',1160,189,380,102,{size:24});a(s,host,bundle);a(s,bundle,lab);
tbl(s,[['Continuation step','Required behavior'],['Resolve environment','Map declared compiler / runtime / data / hardware requirements to available resources.'],['Restore progress','Keep IDs and budgets. Reconcile in-flight jobs, then resume compatible pending work.'],['Restore the agent','Resume a supported session or reconstruct context from saved messages, results and reports.'],['Reuse / append','Reuse compatible work only. New measurement conditions need a fresh paired comparison. Append environment-specific evidence.']],[350,1130],381,[49,85,85,85,85],25);
t(s,'Resume command','Proposed interface: framework resume ./experiment --environment npu-lab.yaml',60,807,1480,57,{size:25,mono:true});
}
{
const s=slide('Constraints resolve into an explicit experiment profile','Request resolution must establish a jointly supported route before search. The profile records scope, numeric assumptions, evidence requirements and budgets. Agent-proposed assumptions remain unresolved until established by checking or review. Compiler, pipeline, artifact, policy, input and environment identities determine reuse. Different hardware or measurement settings invalidate direct reuse of timing evidence.','Framework design §§2.1 and 2.4; Metrics study; Compilation and validation study');
tbl(s,[['Constraint','Resolved setting','Failure or boundary to expose'],['Editing scope','Permitted IR range and pass-pipeline edits. Baseline remains fixed.','Reject edits or pass sequences outside the configured scope.'],['Semantics','Types, shapes, layouts, effects, aliasing, FP behavior and tolerances.','Additional agent assumptions need evidence.'],['Compilation','Baseline / candidate pipelines, compiler build, checkpoints and hard stop.','Unsupported entry, invalid pass prerequisites or incompatible continuation.'],['Evidence','Required checks; metric stage, units, target and improvement threshold.','Unsupported coverage and inconclusive outcomes.'],['Resources','Candidates, shared request limits, model calls/tokens and host/NPU jobs.','Stop scheduling beyond the remaining budget.']],[290,730,460],179,[56,104,104,104,104,104],24);
}
{
const s=slide('MVP scope and implementation stages','The MVP target remains month 4 in a six-month horizon, assuming one developer, part-time compiler support and required environment access. The baseline includes dialect knowledge, common experiment records, durable state, relocation of pending work and finding replay. Pass-order exploration uses a bounded supported set after pipeline feasibility checks; no general pass synthesizer or UB planner is promised. Month 5 evaluates it. Month 6 selects one refinement supported by those observations.','Resource outline; Implementation stages; MVP dialect knowledge task; implementation backlog');
t(s,'Scope','One supplied-input mode, a bounded supported pipeline space, one checking policy, one evaluator and portable experiment records.',60,170,1450,112,{size:36,bold:true});
const rows=[['Month 1','Establish pipeline entry / pass controls and checks. Trial IR / ordering alternatives on real cases.'],['Months 2–3','Implement variant / trial records, dialect pack, scoped edits, runners, reports and durable state.'],['Month 4 · MVP','Complete budgets, cross-environment continuation of pending work, finding export and replay.'],['Month 5','Evaluate held-out cases with agreed usefulness criteria, repeats and resource budgets.'],['Month 6','Compare one pass-order, context, tool, discovery or feedback refinement.']];
tbl(s,[['Stage','Deliverable'],...rows],[310,1170],329,[49,79,94,94,79,79],26);
foot(s,'Resources — one developer, part-time compiler expertise, model/host capacity and NPU access when the selected route requires it.');
}
{
const s=slide('Primary risks concern finding yield and integration effort','Risk assessment orders the risks by severity and puts useful finding yield first, integration costs second. Their probability remains unknown. Expert-effort savings and evidence quality are additional concerns considered manageable by the project owner, with provisional assessments.','Risk assessment; Evaluation protocol');
section(s,'Too few useful findings','Rewrites may be invalid, trivial, narrowly applicable or already handled by a later compiler stage.',60,177,695,160);
section(s,'Integration costs dominate','Saved IR may require state restoration, custom harnesses, checking coverage or scarce device access.',850,177,690,160);
bar(s,60,425,1480);
tbl(s,[['Additional risk','Failure to watch for'],['Expert effort','Preparation, reviewing assumptions and maintaining the harness consume the time saved.'],['Metric relevance','A lower score fails to improve relevant downstream code or workloads.'],['Correctness coverage','Selected checks miss behavior changed by the rewrite.']],[355,1125],478,[52,89,89,89],26);
foot(s,'Useful findings are the primary outcome. Effort saving and evidence limits are measured alongside finding quality.');
}
{
const s=slide('Evaluation protocol and controlled refinement studies','The proposed MVP target is at least one real replayable finding worth engineer investigation. Main evaluation uses representative held-out cases, separate from development. Agree usefulness criteria, limits and repeat counts in advance. Report every kernel/pipeline/case trial, including duplicates, rejected, unsupported and inconclusive outcomes. Test that a checkpointed ongoing experiment can resume in a second declared environment, preserving completed compatible work, reports, budgets and unresolved operations. Controlled refinement studies change one component while keeping cases, model, checks, objective and relevant budgets comparable. A comparable engineer workflow is needed to claim expert-effort saving.','Evaluation protocol; research backlog planned comparison studies');
const corpus=box(s,'Cases','Fixed held-out corpus\nseparate development cases',60,198,380,100,{size:25}),baseline=box(s,'Baseline','MVP baseline',600,175,330,77,{size:25}),variant=box(s,'Refinement','One selected refinement',600,332,330,77,{size:25,bg:P.pale,color:P.amber}),ledger=box(s,'Ledger','All outcomes + costs\nversioned run history',1110,254,430,100,{size:25});a(s,corpus,baseline,{kind:'elbow'});a(s,corpus,variant,{kind:'elbow',color:P.amber});a(s,baseline,ledger,{kind:'elbow'});a(s,variant,ledger,{kind:'elbow',color:P.amber});
tbl(s,[['Primary evidence','Additional outcomes'],['Engineer-reviewed useful findings','Rejected, duplicate, unsupported and inconclusive cases.'],['Replay and environment continuation','Resume pending trials elsewhere, retain provenance and rerun incompatible measurements.'],['At least one real case for MVP','Preparation/review effort, model use and host/NPU usage.']],[650,830],492,[52,80,80,80],25);
t(s,'Protocol condition','Before the study, agree case selection, usefulness criteria, search budgets and repeats. Any effort-saving claim identifies its reference workflow.',60,817,1480,65,{size:22});
}
for(const [index,s] of deck.slides.items.entries()){
 const n=t(s,'Slide number',String(index+1)+' / '+deck.slides.items.length,1460,860,90,28,{size:18,color:P.muted,nowrap:true});
 n.text.style={alignment:'right'};
}
await fs.mkdir(path.join(root,'.codex-finalizer'),{recursive:true});
await fs.mkdir(path.dirname(out),{recursive:true});
const candidate=path.join(root,'.codex-finalizer','technical-candidate.pptx');
await(await PresentationFile.exportPptx(deck)).save(candidate);
await finalizePresentation({workspaceDir:root,candidatePath:candidate,finalPath:out,explicitTotalSlideCount:23,requiredNativeTableOwnerSlides:[2,3,5,8,9,10,12,14,15,16,17,19,20,21,22,23],requiredNativeChartOwnerSlides:[],pythonExecutable:python,integrityValidatorPath:path.join(skill,'container_tools/inspect_presentation_package_integrity.py'),layoutValidatorPath:path.join(skill,'container_tools/inspect_presentation_layout_geometry.py'),layoutArgs:['--expected-slide-size-emu','15240000,8572500','--validate-heading-fit',...[2,3,5,8,9,10,12,14,15,16,17,19,20,21,22,23].flatMap(n=>['--require-native-table-slide',String(n)])],fontPolicy:{basis:'design',families:[FONT,MONO]},verifyArtifactToolImport:true,receiptPath:path.join(root,'.codex-finalizer',path.basename(out)+'.validation.json')});
await fs.writeFile(path.join(root,'technical-outline.json'),JSON.stringify(source,null,2)+'\n');
console.log('Created '+deck.slides.items.length+' editable technical slides.');
