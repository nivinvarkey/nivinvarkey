/* Fabrication Process Explorer v2 — accessible interactive schematic + optional Flow video */
(()=>{'use strict';
const app=document.getElementById('fabricationExperience');if(!app)return;
const byId=id=>document.getElementById(id);
const stages=[
  {name:'Isometric review & planning',tag:'ENGINEERING CONTROL',short:'ENGINEERING REVIEW',lead:'Review the issued spool isometric and release a coordinated fabrication package. Confirm that scope, revision, dimensions, fittings and material requirements agree before work begins.',inputs:'Isometric · BOM · Line class',output:'Verified fabrication package',checks:['Confirm approved drawing and current revision','Cross-check dimensions, orientation and spool breaks','Review material descriptions and quantities','Identify weld joints and fabrication scope']},
  {name:'Cutting & end preparation',tag:'MATERIAL PREPARATION',short:'CUTTING & PREP',lead:'Translate drawing dimensions into material preparation. Identify components, measure cut lengths, prepare weld ends and retain traceability through the cutting process.',inputs:'Cut list · Pipe marks · Material IDs',output:'Identified prepared components',checks:['Confirm material grade, size and identification','Measure and mark cut lengths to the approved cut list','Cut, deburr and prepare ends as specified','Preserve component and heat traceability as required']},
  {name:'Fit-up & tack assembly',tag:'DIMENSIONAL CONTROL',short:'FIT-UP & TACK',lead:'Assemble the pipe, long-radius elbow and welding-neck flanges on suitable supports. Verify joint alignment, gap, rotation and spool orientation before progressing to welding.',inputs:'Prepared parts · Fit-up drawing',output:'Aligned and secured spool',checks:['Check dimensional orientation against the isometric','Verify flange facing and bolt-hole rotation','Confirm joint fit-up, gap and alignment per procedure','Secure assembly and record relevant fit-up checks']},
  {name:'Welding & traceability',tag:'WELD EXECUTION',short:'WELDING',lead:'Complete the joints under the approved welding procedure, with the required identification, controls and documentation to support weld quality and traceability.',inputs:'Approved WPS · Joint map · Welder ID',output:'Welded, traceable assembly',checks:['Verify applicable WPS and welder qualifications','Identify weld number and record welding details','Follow specified welding and interpass controls','Perform visual checks and record weld completion']},
  {name:'Inspection & release',tag:'QUALITY ASSURANCE',short:'QC & RELEASE',lead:'Verify the completed spool against the fabrication package. Record dimensional checks, required examinations and quality status before controlled release or handover.',inputs:'Fabrication records · Inspection plan',output:'Verified spool release package',checks:['Verify dimensions, orientation and flange condition','Complete required visual and specified NDT checks','Review identification, weld records and traceability','Complete release documentation and handover status']}
];
const components={
  flange:{title:'Welding-neck flanges',body:'The ends use welding-neck flanges in this representative geometry. Check facing condition, orientation, bolt-hole rotation and applicable class against the project drawing.'},
  elbow:{title:'Long-radius 90° elbow',body:'The elbow changes the pipe direction from horizontal to vertical. Verify size, wall specification, center-to-end dimensions and orientation against the approved isometric.'},
  joint:{title:'Circumferential weld joint',body:'The pipe-to-elbow connection is a representative butt-weld location. Fit-up, applicable WPS, weld identification and inspection requirements depend on the approved project documents.'}
};
const q={
  video:byId('fxVideo'),diagram:byId('fxDiagram'),viewer:byId('fxViewport'),mode:byId('fxModeLabel'),pill:byId('fxViewportPill'),overlay:byId('fxOverlayStage'),
  title:byId('fxStageTitle'),lead:byId('fxStageDescription'),tag:byId('fxPhaseTag'),number:byId('fxPhaseNumber'),count:byId('fxStageCount'),inputs:byId('fxStageInputs'),output:byId('fxStageOutput'),checks:byId('fxStageChecks'),
  scrub:byId('fxScrubber'),elapsed:byId('fxElapsed'),total:byId('fxTotal'),play:byId('fxPlay'),playSymbol:byId('fxPlaySymbol'),playText:byId('fxPlayText'),prev:byId('fxPrev'),next:byId('fxNext'),restart:byId('fxRestart'),mute:byId('fxMute'),fullscreen:byId('fxFullscreen'),hint:byId('fxPlaybackHint'),part:byId('fxPartExplorer'),partTitle:byId('fxPartTitle'),partBody:byId('fxPartBody')
};
const stageButtons=[...document.querySelectorAll('[data-fx-step]')];
const hotspots=[...app.querySelectorAll('.fx-hotspot')];
const prefersReducedMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
let isVideo=false,videoLength=40,simTime=0,playing=!prefersReducedMotion,frame=0,lastStamp=0,currentIndex=-1,userStopped=prefersReducedMotion;
const duration=()=>isVideo?videoLength:40;
const pad=n=>String(Math.max(0,n)).padStart(2,'0');
const stamp=s=>{const v=Math.floor(Math.max(0,s));return pad(Math.floor(v/60))+':'+pad(v%60)};
const time=()=>isVideo?(q.video.currentTime||0):simTime;
const indexFor=t=>Math.min(4,Math.max(0,Math.floor((Math.min(t,Math.max(0,duration()-.001))/duration())*5)));
function updateStage(i){if(i===currentIndex)return;currentIndex=i;const s=stages[i];q.diagram.dataset.stage=String(i);q.number.textContent=pad(i+1);q.count.textContent=pad(i+1)+' / 05';q.tag.textContent=s.tag;q.title.textContent=s.name;q.lead.textContent=s.lead;q.inputs.textContent=s.inputs;q.output.textContent=s.output;q.overlay.textContent=pad(i+1)+' — '+s.short;
 q.checks.replaceChildren(...s.checks.map(label=>{const li=document.createElement('li');li.textContent=label;return li}));
 stageButtons.forEach((b,j)=>{const active=j===i;b.classList.toggle('is-current',active);b.classList.toggle('is-complete',j<i);b.setAttribute('aria-selected',String(active));b.tabIndex=active?0:-1});
}
function updateTime(){const t=Math.min(duration(),time());q.elapsed.textContent=stamp(t);q.total.textContent=stamp(duration());q.scrub.max=String(duration());q.scrub.value=String(t);q.scrub.style.setProperty('--fx-seek',((t/duration())*100).toFixed(2)+'%');updateStage(indexFor(t))}
function syncButtons(){q.playSymbol.textContent=playing?'Ⅱ':'▶';q.playText.textContent=playing?'Pause':'Play';q.play.setAttribute('aria-label',playing?'Pause sequence':'Play sequence');q.play.setAttribute('aria-pressed',String(playing));q.diagram.classList.toggle('is-paused',!playing);}
function stopTick(){if(frame)cancelAnimationFrame(frame);frame=0;lastStamp=0}
function tick(now){if(!playing||isVideo)return;if(lastStamp)simTime+=(now-lastStamp)/1000;lastStamp=now;if(simTime>=40)simTime%=40;updateTime();frame=requestAnimationFrame(tick)}
async function setPlay(value,explicit=true){playing=!!value;if(explicit)userStopped=!value;
 if(isVideo){if(playing){try{await q.video.play()}catch(e){playing=false;userStopped=true}}else q.video.pause();}else{stopTick();if(playing&&!document.hidden)frame=requestAnimationFrame(tick)}
 syncButtons();}
function goTo(t){const n=Math.min(Math.max(0,t),duration()-.001);if(isVideo){try{q.video.currentTime=n}catch(e){}}else simTime=n;updateTime();}
function seekStep(i){goTo((Math.max(0,Math.min(4,i))/5)*duration())}
stageButtons.forEach((button,i)=>{
 button.addEventListener('click',()=>{seekStep(i);setPlay(false)});
 button.addEventListener('keydown',e=>{let j=i;if(e.key==='ArrowRight')j=(i+1)%5;else if(e.key==='ArrowLeft')j=(i+4)%5;else if(e.key==='Home')j=0;else if(e.key==='End')j=4;else return;e.preventDefault();stageButtons[j].focus();seekStep(j);setPlay(false)})
});
q.scrub.addEventListener('input',()=>goTo(Number(q.scrub.value)));
q.scrub.addEventListener('change',()=>setPlay(false));
q.prev.addEventListener('click',()=>{const now=indexFor(time());const atStart=Math.abs(time()-now/5*duration())<.7;seekStep(atStart?Math.max(0,now-1):now);setPlay(false)});
q.next.addEventListener('click',()=>{seekStep(Math.min(4,indexFor(time())+1));setPlay(false)});
q.restart.addEventListener('click',()=>{goTo(0);setPlay(true)});
q.play.addEventListener('click',()=>setPlay(!playing));
q.mute.addEventListener('click',()=>{if(!isVideo)return;q.video.muted=!q.video.muted;q.mute.textContent=q.video.muted?'♪':'♫';q.mute.setAttribute('aria-label',q.video.muted?'Unmute video':'Mute video')});
q.fullscreen.addEventListener('click',async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else if(q.viewer.requestFullscreen)await q.viewer.requestFullscreen()}catch(e){}});
hotspots.forEach(h=>h.addEventListener('click',()=>{const data=components[h.dataset.part];if(!data)return;hotspots.forEach(x=>x.classList.toggle('is-selected',x===h));q.part.classList.add('is-inspecting');q.partTitle.textContent=data.title;q.partBody.textContent=data.body;setPlay(false)}));
document.addEventListener('visibilitychange',()=>{if(document.hidden){stopTick();if(isVideo)q.video.pause()}else if(playing){if(isVideo)q.video.play().catch(()=>{playing=false;syncButtons()});else{stopTick();frame=requestAnimationFrame(tick)}}});
q.video.addEventListener('timeupdate',()=>{if(isVideo)updateTime()});q.video.addEventListener('ended',()=>{if(isVideo){playing=false;syncButtons()}});
q.video.addEventListener('play',()=>{if(isVideo){playing=true;syncButtons()}});q.video.addEventListener('pause',()=>{if(isVideo){playing=false;syncButtons()}});
function enableVideo(){if(isVideo)return;const d=q.video.duration;if(!Number.isFinite(d)||d<=1)return;videoLength=d;isVideo=true;stopTick();q.video.hidden=false;q.diagram.hidden=true;q.diagram.style.display='none';q.mode.textContent='CINEMATIC VIDEO';q.pill.textContent='3D FABRICATION FILM';q.hint.textContent='FLOW VIDEO PLAYBACK';q.mute.disabled=false;q.mute.title='Toggle video sound';q.video.currentTime=Math.min((simTime/40)*d,d-.001);if(playing)setPlay(true,false);updateTime()}
q.video.addEventListener('loadedmetadata',enableVideo);
q.video.addEventListener('error',()=>{if(!isVideo){q.mode.textContent='ENGINEERING MODEL';q.pill.textContent='ILLUSTRATIVE SVG MODE'}});
// Only request the video when it exists: the static site works unchanged before a Flow export is added.
const videoPath='assets/video/spool-fabrication.mp4';
if(location.protocol==='http:'||location.protocol==='https:'){
 fetch(videoPath,{method:'HEAD',cache:'no-store'}).then(r=>{if(r.ok&&((r.headers.get('content-type')||'').includes('video')||r.url.endsWith('.mp4'))) {q.video.src=videoPath;q.video.load()}}).catch(()=>{});
}
updateTime();syncButtons();if(playing)frame=requestAnimationFrame(tick);
})();
