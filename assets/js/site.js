(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const applicationOrder = ['engicore', 'checker', 'dwg', 'merger', 'support'];
  const applications = {
    engicore: {
      title:'EngiCore File Manager',kind:'ENGINEERING OPERATIONS / DESKTOP WORKSPACE',image:'assets/images/engicore.webp',
      summary:'An integrated engineering workspace for file operations, monthly reporting, drawing utilities and job-oriented document tasks.',
      category:'Integrated engineering utilities',
      problem:'Engineering teams often rely on separate tools for file operations, CAD-related utilities and recurring document-control reports.',
      capabilities:['Integrated functions for copying, moving, renaming and organizing engineering files.','Document utilities covering DWG, barcode, PDF and material-code operations.','Monthly reporting and job-wise engineering tracking in a shared desktop workspace.','Purpose-built navigation for multiple engineering activities.'],
      tags:['Python','File Automation','PDF / DWG','Reporting']
    },
    checker: {
      title:'Checker’s Tool',kind:'QUALITY CHECKING / ENGINEERING DATA',image:'assets/images/checkers-tool.webp',
      summary:'A multi-job checking environment connecting spool records, isometrics, PDF references and administrative controls.',
      category:'Spool quality and document workflows',
      problem:'Checking engineering packages requires reliable cross-references between JDE, isometrics, revisions, drawings and job-specific rules.',
      capabilities:['Job-specific checking environments with shared JDE source and controlled settings.','Line, barcode, spool and drawing search with related PDF lookup.','GO-BY references, checking instructions, user access and project administration.','Spool monitoring and searchable technical information for engineering users.'],
      tags:['Python','PySide6','Supabase','JDE / PDF']
    },
    dwg: {
      title:'DWG Batch Editor',kind:'CAD AUTOMATION / ENGINEERING DRAWINGS',image:'assets/images/dwg-editor.webp',
      summary:'A desktop utility for applying structured drawing modifications across batches of DWG files.',
      category:'Drawing automation and batch processing',
      problem:'Repeated manual editing of drawing identifiers, revisions and title-block information slows down engineering delivery.',
      capabilities:['Excel-driven mappings for spool identifiers, revisions, barcodes and drawing metadata.','Batch processing, progress tracking and error logging.','Drawing/PDF output workflows with AutoCAD-based automation.','User controls for Excel import, coordinate management, PDF setup and logs.'],
      tags:['Python','AutoCAD','Excel','Batch Processing']
    },
    merger: {
      title:'Multiple PDF Merger',kind:'DOCUMENT PROCESSING / PDF PACKAGES',image:'assets/images/pdf-merger.webp',
      summary:'A batch tool for assembling base spool PDFs with corresponding attachment or suffix sheets.',
      category:'PDF automation and traceable packages',
      problem:'Drawing sets often arrive as multiple PDFs per spool, making manual collation slow and prone to missing attachments.',
      capabilities:['Identify spool groups and associate related PDF suffix files.','Process an input folder with selectable output destination and merge rules.','Provide per-file results, missing-file visibility and processing logs.','Support repeatable attachment assembly for engineering handover.'],
      tags:['Python','PDF Processing','Batch Merge','Logging']
    },
    support: {
      title:'Spool Support Sync',kind:'SUPPORT ATTACHMENTS / SPOOL DRAWINGS',image:'assets/images/support-sync.webp',
      summary:'A practical desktop workflow for matching support information to spool drawings and handling batch attachments.',
      category:'Spool support document coordination',
      problem:'Support sheets and spool drawings may be stored separately and need reliable matching before document packages are released.',
      capabilities:['Use Excel-based support references and selected spool PDFs.','Attach, process and merge support drawing information in batch.','Display detailed status, counts, errors and logs for follow-up.','Dedicated controls for support data, material codes and PDF cleaning.'],
      tags:['Python','PySide6','PDF','Excel']
    },
    bom: {
      title:'BOM & Joint Data Sync',kind:'ENGINEERING DATA / AUTOMATION',category:'Controlled source-data reconciliation',
      summary:'Repeatable reconciliation of spool material and joint data across project source workbooks.',
      problem:'Manually keeping master BOM and joint information aligned with daily extracts creates inconsistency and difficult-to-audit changes.',
      capabilities:['Identify new and changed spool material entries using engineering keys.','Synchronize joint data and schedule-related reference fields.','Log modifications with backup and validation stages.'],
      tags:['PowerShell','Power Query','Excel']
    },
    report: {
      title:'Daily Progress & Aging Reports',kind:'REPORTING / ENGINEERING OPERATIONS',category:'Daily reporting and status intelligence',
      summary:'Automated reports that help teams understand engineering work, material status and daily progress.',
      problem:'Progress reporting is often assembled manually across source files, making follow-up slow and repetitive.',
      capabilities:['Consolidate daily progress and engineering status sources.','Apply job, status and aging criteria to actionable reports.','Produce reusable workbook reporting with automation and audit-friendly outputs.'],
      tags:['Excel','VBA','Power Automate','Power Query']
    },
    drawing: {
      title:'Spool & Shiploose Tools',kind:'EXPLORATORY DEVELOPMENT / ENGINEERING DOCUMENTS',category:'Engineering tooling under development',
      summary:'Exploratory workflows for drawing generation and structured shiploose document output.',
      problem:'Specialized fabrication documents can require repeated, precise layout work that benefits from consistent templates.',
      capabilities:['Explore symbol-based fabrication drawing workflows and PCF references.','Investigate adjustable shiploose layouts with barcode, spool and piecemark fields.','Prioritize accurate alignment against engineering reference templates.'],
      tags:['Python','CAD / PDF','Piping Standards']
    }
  };

  const tabs = [...document.querySelectorAll('.app-tab')];
  const featureImage=$('featureImage');
  let selected='engicore';
  function selectApplication(id, scroll=false) {
    if(!applications[id] || !applicationOrder.includes(id)) return;
    selected=id;const app=applications[id];
    tabs.forEach(btn=>{const is=btn.dataset.app===id;btn.classList.toggle('active',is);btn.setAttribute('aria-selected',String(is));btn.tabIndex=is?0:-1;});
    featureImage.src=app.image;featureImage.alt=app.title+' application screenshot';
    $('featureKind').textContent=app.kind;$('featureTitle').textContent=app.title;$('featureDescription').textContent=app.summary;
    $('featureTags').replaceChildren(...app.tags.map(tag=>{const el=document.createElement('span');el.textContent=tag;return el}));
    $('screenButton').setAttribute('aria-label','Open '+app.title+' screenshot in full screen');
    if(scroll)document.querySelector('.showcase').scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'center'});
  }
  tabs.forEach(btn=>btn.addEventListener('click',()=>selectApplication(btn.dataset.app)));
  $('appSelector').addEventListener('keydown',e=>{
    if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End'].includes(e.key))return;
    e.preventDefault();let i=applicationOrder.indexOf(selected);
    i=e.key==='Home'?0:e.key==='End'?applicationOrder.length-1:(i+(e.key==='ArrowRight'||e.key==='ArrowDown'?1:-1)+applicationOrder.length)%applicationOrder.length;
    selectApplication(applicationOrder[i]);tabs[i].focus();
  });
  document.querySelectorAll('[data-app-select]').forEach(btn=>btn.addEventListener('click',()=>selectApplication(btn.dataset.appSelect,true)));
  $('featureDetails').addEventListener('click',()=>showCase(selected));

  // Searchable / filterable gallery: all controls use live content, not placeholder interactions.
  let projectFilter='all';const projectCards=[...document.querySelectorAll('.project-card')];
  function filterProjects(){let visible=0;const q=$('projectSearch').value.trim().toLowerCase();projectCards.forEach(card=>{const match=(projectFilter==='all'||card.dataset.group===projectFilter)&&(!q||(card.textContent+' '+card.dataset.search).toLowerCase().includes(q));card.hidden=!match;if(match)visible++});$('emptyProjects').hidden=visible>0;}
  document.querySelectorAll('.filter').forEach(btn=>btn.addEventListener('click',()=>{projectFilter=btn.dataset.filter;document.querySelectorAll('.filter').forEach(b=>{const active=b===btn;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active))});filterProjects()}));
  $('projectSearch').addEventListener('input',filterProjects);
  document.addEventListener('keydown',e=>{if(e.key==='/'&&!e.ctrlKey&&!e.metaKey&&!e.altKey&&!/^(INPUT|TEXTAREA)$/.test(document.activeElement?.tagName)){e.preventDefault();$('projectSearch').focus()}});

  // Modal case studies and actual screenshot lightbox.
  const caseDialog=$('caseDialog'),imageDialog=$('imageDialog');let modalImageId=selected;let caseId='engicore';
  function showCase(id){const app=applications[id];if(!app)return;caseId=id;
    $('caseCategory').textContent=app.kind;$('caseTitle').textContent=app.title;$('caseIntro').textContent=app.summary;$('caseProblem').textContent=app.problem;
    $('caseBullets').replaceChildren(...app.capabilities.map(t=>{const li=document.createElement('li');li.textContent=t;return li}));
    $('caseTech').replaceChildren(...app.tags.map(t=>{const span=document.createElement('span');span.textContent=t;return span}));
    $('caseToPreview').hidden=!app.image;caseDialog.showModal();
  }
  document.querySelectorAll('[data-case]').forEach(btn=>btn.addEventListener('click',()=>showCase(btn.dataset.case)));
  $('closeCase').addEventListener('click',()=>caseDialog.close());$('caseCloseBottom').addEventListener('click',()=>caseDialog.close());
  caseDialog.addEventListener('click',e=>{if(e.target===caseDialog)caseDialog.close()});
  function displayImage(id){if(!applications[id]?.image)return;modalImageId=id;const app=applications[id];$('modalImage').src=app.image;$('modalImage').alt=app.title+' screenshot';$('imageModalTitle').textContent=app.title+' / Application screenshot';if(!imageDialog.open)imageDialog.showModal();}
  function changeImage(n){const i=applicationOrder.indexOf(modalImageId);displayImage(applicationOrder[(i+n+applicationOrder.length)%applicationOrder.length]);}
  $('screenButton').addEventListener('click',()=>displayImage(selected));$('expandScreen').addEventListener('click',()=>displayImage(selected));
  $('caseToPreview').addEventListener('click',()=>{caseDialog.close();displayImage(caseId)});
  $('previousImage').addEventListener('click',()=>changeImage(-1));$('nextImage').addEventListener('click',()=>changeImage(1));$('closeImage').addEventListener('click',()=>imageDialog.close());
  imageDialog.addEventListener('click',e=>{if(e.target===imageDialog)imageDialog.close()});
  document.addEventListener('keydown',e=>{if(imageDialog.open&&['ArrowLeft','ArrowRight'].includes(e.key)){e.preventDefault();changeImage(e.key==='ArrowRight'?1:-1)}});

  // Background introduction: never loop; request audible autoplay only when permitted.
  // Browser policy decides whether automatic playback may have sound. If denied,
  // continue a muted preview and make one-click playback with sound unmistakable.
  const backgroundVideo = $('heroBackgroundVideo');
  const audioToggle = $('backgroundAudioToggle');
  const videoStatus = $('backgroundVideoStatus');
  const launchButton = $('watchWelcome');
  const hero = $('home');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  backgroundVideo.loop = false;
  backgroundVideo.volume = 1;
  backgroundVideo.muted = false;
  backgroundVideo.defaultMuted = false;
  let userManuallyMuted = false;
  let playRequestId = 0;

  function status(message) { videoStatus.textContent = message; }
  function updateVideoButtons() {
    const needsSound = backgroundVideo.muted;
    launchButton.textContent = needsSound ? '▶ Play welcome with sound' : '↻ Replay welcome';
    launchButton.setAttribute('aria-label', needsSound ? 'Play the welcome video from the beginning with sound' : 'Replay the welcome video from the beginning');
    launchButton.classList.toggle('needs-sound', needsSound);
    audioToggle.textContent = needsSound ? '▶ Play with sound' : '♫ Mute sound';
    audioToggle.setAttribute('aria-label', needsSound ? 'Play welcome video from beginning with sound' : 'Mute background video');
    audioToggle.setAttribute('aria-pressed', String(!needsSound));
    audioToggle.classList.toggle('sound-cta', needsSound);
  }

  // Called only directly by a user click: this is what unlocks audio in browsers.
  function playWelcomeWithSound() {
    ++playRequestId; // Ignore late responses from any initial autoplay attempt.
    userManuallyMuted = false;
    hero.classList.add('allow-motion');
    backgroundVideo.pause();
    backgroundVideo.currentTime = 0;
    backgroundVideo.muted = false;
    backgroundVideo.defaultMuted = false;
    updateVideoButtons();
    status('Starting welcome with sound…');
    try {
      const promise = backgroundVideo.play();
      if (promise && typeof promise.then === 'function') {
        promise.then(() => status('Playing with sound · Once only'))
          .catch(() => status('Sound blocked by browser settings · Check site sound permission'));
      } else { status('Playing with sound · Once only'); }
    } catch (_) { status('Cannot start video · Check browser permissions'); }
  }

  async function autoplayOnce() {
    if (reducedMotion.matches) {
      status('Motion reduced by your preferences · Choose Play welcome with sound');
      updateVideoButtons();
      return;
    }
    const request = ++playRequestId;
    try {
      await backgroundVideo.play();
      if (playRequestId === request) status('Playing with sound · Once only');
    } catch (error) {
      if (playRequestId !== request) return; // Visitor already clicked Play.
      if (error && error.name === 'NotAllowedError') {
        // Most first-time visitors are not allowed audible autoplay.
        backgroundVideo.muted = true;
        backgroundVideo.defaultMuted = true;
        updateVideoButtons();
        try {
          await backgroundVideo.play();
          if (playRequestId === request) status('Muted preview · Click Play welcome with sound to hear it');
        } catch (_) {
          if (playRequestId === request) status('Click Play welcome with sound to start');
        }
      } else {
        status('Video unavailable · Confirm welcome.mp4 is uploaded');
      }
    }
  }

  backgroundVideo.addEventListener('ended', () => {
    backgroundVideo.pause(); // Keep final frame visible; no automatic restart.
    status(backgroundVideo.muted ? 'Finished · Replay with sound anytime' : 'Finished · Replay anytime');
    updateVideoButtons();
  });
  backgroundVideo.addEventListener('error', () => status('Video unavailable · Check welcome.mp4 path'));
  backgroundVideo.addEventListener('volumechange', updateVideoButtons);
  launchButton.addEventListener('click', playWelcomeWithSound);
  $('footerWelcome').addEventListener('click', playWelcomeWithSound);
  audioToggle.addEventListener('click', () => {
    if (backgroundVideo.muted) {
      // Real, direct click gesture: play with sound from frame one.
      playWelcomeWithSound();
    } else {
      ++playRequestId;
      userManuallyMuted = true;
      backgroundVideo.muted = true;
      backgroundVideo.defaultMuted = true;
      updateVideoButtons();
      status(backgroundVideo.ended ? 'Finished · Replay with sound anytime' : 'Sound off · Click Play welcome with sound to restart');
    }
  });
  updateVideoButtons();
  autoplayOnce();

  // Appearance preference; accessible mobile navigation.
  let theme='dark';try{theme=localStorage.getItem('nv-color-theme')||'dark'}catch(_){}
  function applyTheme(name){document.documentElement.dataset.theme=name;const btn=$('themeToggle');btn.textContent=name==='dark'?'☼':'☾';btn.setAttribute('aria-label',name==='dark'?'Switch to light mode':'Switch to dark mode');try{localStorage.setItem('nv-color-theme',name)}catch(_){}}
  applyTheme(theme==='light'?'light':'dark');$('themeToggle').addEventListener('click',()=>applyTheme(document.documentElement.dataset.theme==='dark'?'light':'dark'));
  const menu=$('menuToggle'),nav=$('mainNav');menu.addEventListener('click',()=>{const opened=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(opened));menu.textContent=opened?'✕':'☰'});nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menu.setAttribute('aria-expanded','false');menu.textContent='☰'}));
  const back=$('backTop');function updateScroll(){const max=Math.max(1,document.documentElement.scrollHeight-window.innerHeight);$('scrollProgress').style.width=(100*window.scrollY/max)+'%';back.classList.toggle('visible',window.scrollY>460)}window.addEventListener('scroll',updateScroll,{passive:true});updateScroll();back.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));
  if('IntersectionObserver' in window){const links=[...nav.querySelectorAll('a')];const obs=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting)links.forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+entry.target.id))}),{rootMargin:'-28% 0px -65% 0px'});links.forEach(a=>{const sec=document.querySelector(a.getAttribute('href'));if(sec)obs.observe(sec)})}
  $('copyEmail').addEventListener('click',async()=>{const el=$('copyEmail');try{await navigator.clipboard.writeText('nvnivinvarkey@outlook.com');el.textContent='✓ Copied';}catch(_){el.textContent='nvnivinvarkey@outlook.com'}setTimeout(()=>el.textContent='Copy email ⧉',2200)});
  $('currentYear').textContent=new Date().getFullYear();
})();
