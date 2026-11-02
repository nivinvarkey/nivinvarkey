/* Nivin Varkey engineering portfolio — progressive enhancement, no dependencies */
(()=>{'use strict';
  const root=document.documentElement;
  root.classList.add('js-ready');
  const header=document.getElementById('siteHeader');
  const progress=document.getElementById('scrollProgress');
  const menu=document.getElementById('menuToggle');
  const mobile=document.getElementById('mobileNav');
  const motion=window.matchMedia('(prefers-reduced-motion: reduce)');
  const updateScroll=()=>{
    if(header)header.classList.toggle('scrolled',scrollY>15);
    if(progress){const height=Math.max(1,root.scrollHeight-innerHeight);progress.style.width=`${Math.min(100,Math.max(0,scrollY/height*100))}%`}
  };
  window.addEventListener('scroll',updateScroll,{passive:true});updateScroll();
  if(menu&&mobile){
    const close=()=>{menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Open navigation');mobile.hidden=true;document.body.classList.remove('menu-open')};
    menu.addEventListener('click',()=>{const opening=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(opening));menu.setAttribute('aria-label',opening?'Close navigation':'Open navigation');mobile.hidden=!opening;document.body.classList.toggle('menu-open',opening)});
    mobile.querySelectorAll('a').forEach(a=>a.addEventListener('click',close));
    document.addEventListener('keydown',e=>{if(e.key==='Escape')close()});
    window.addEventListener('resize',()=>{if(innerWidth>860)close()},{passive:true});
  }
  document.querySelectorAll('.year').forEach(el=>el.textContent=String(new Date().getFullYear()));
  if('IntersectionObserver' in window&&!motion.matches){
    const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
      if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target)}
    }),{rootMargin:'0px 0px -45px 0px',threshold:.08});
    document.querySelectorAll('.reveal:not(.visible)').forEach(el=>observer.observe(el));
  }else{document.querySelectorAll('.reveal').forEach(el=>el.classList.add('visible'))}
  // Accessible fabrication animation. Stage changes are user controllable and pauseable.
  const stage=document.getElementById('fabricationStage');
  if(stage){
    const buttons=[...document.querySelectorAll('.fab-step')];
    const toggle=document.getElementById('sequenceToggle');
    const status=document.getElementById('sequenceState');
    let current=0,timer=null,playing=!motion.matches;
    const choose=n=>{
      current=n;stage.dataset.stage=String(n);
      buttons.forEach((button,i)=>{const active=i===n;button.classList.toggle('is-active',active);button.setAttribute('aria-pressed',String(active))});
    };
    const stop=()=>{if(timer!==null)clearInterval(timer);timer=null;playing=false;stage.classList.add('is-paused');toggle.textContent='▶ PLAY';toggle.setAttribute('aria-label','Play fabrication animation');toggle.setAttribute('aria-pressed','true');status.textContent='PAUSED'};
    const play=()=>{if(timer!==null)clearInterval(timer);playing=true;stage.classList.remove('is-paused');toggle.textContent='Ⅱ PAUSE';toggle.setAttribute('aria-label','Pause fabrication animation');toggle.setAttribute('aria-pressed','false');status.textContent='AUTO PLAYING';timer=setInterval(()=>choose((current+1)%buttons.length),3400)};
    buttons.forEach((button,i)=>button.addEventListener('click',()=>{choose(i);stop()}));
    toggle.addEventListener('click',()=>playing?stop():play());
    choose(0);
    if(playing)play();else stop();
    // Don't run the sequence in hidden tabs; preserve the user's explicit pause.
    document.addEventListener('visibilitychange',()=>{if(document.hidden&&timer!==null){clearInterval(timer);timer=null}else if(!document.hidden&&playing&&timer===null)play()});
  }
  // Tool catalogue filter: combine category + text query and update visible result state.
  const search=document.getElementById('toolSearch');
  const filters=[...document.querySelectorAll('.filter-btn[data-filter]')];
  if(search&&filters.length){
    const cards=[...document.querySelectorAll('#toolGrid .tool-card')];
    const empty=document.getElementById('toolsEmpty');
    let category='all';
    const apply=()=>{
      const query=search.value.trim().toLocaleLowerCase();let hits=0;
      for(const card of cards){const visible=(category==='all'||card.dataset.category===category)&&(!query||card.dataset.search.includes(query));card.hidden=!visible;if(visible)hits++}
      if(empty)empty.hidden=hits!==0;
    };
    filters.forEach(filter=>filter.addEventListener('click',()=>{category=filter.dataset.filter;filters.forEach(f=>{const active=f===filter;f.classList.toggle('active',active);f.setAttribute('aria-pressed',String(active))});apply()}));
    search.addEventListener('input',apply);
    apply();
  }
  // Stage animations should freeze when paused, including SVG paths.
  if(!document.getElementById('nvPauseStyle')){
    const style=document.createElement('style');style.id='nvPauseStyle';style.textContent='.fabrication-stage.is-paused .fabrication-svg *{animation-play-state:paused!important}';document.head.appendChild(style);
  }
})();
