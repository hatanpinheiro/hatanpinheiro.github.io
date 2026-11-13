/* Alternância de tema (claro por padrão) e utilidades comuns das aulas */
(function(){
  var KEY='sr-theme', root=document.documentElement;
  var ICON={dark:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>',
            light:'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4.5"/><path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8"/></svg>'};
  function current(){return root.getAttribute('data-theme')==='dark'?'dark':'light';}
  function paint(){var t=current();document.querySelectorAll('[data-theme-toggle]').forEach(function(b){
    b.innerHTML=(t==='dark'?ICON.light+'Modo claro':ICON.dark+'Modo escuro');b.setAttribute('aria-pressed',t==='dark'?'true':'false');});}
  function set(t){root.setAttribute('data-theme',t);try{localStorage.setItem(KEY,t);}catch(e){}paint();
    document.dispatchEvent(new CustomEvent('sr-theme',{detail:t}));}
  document.addEventListener('DOMContentLoaded',function(){paint();
    document.querySelectorAll('[data-theme-toggle]').forEach(function(b){b.addEventListener('click',function(){set(current()==='dark'?'light':'dark');});});});
})();

/* Modo slides: divide cada etapa (section.step) em telas cheias com encaixe de rolagem. */
(function(){
  var KEY='sr-slides', root=document.documentElement;
  function build(){
    var steps=document.querySelectorAll('main .step'); if(!steps.length) return;
    var all=[];
    steps.forEach(function(sec){
      var head=sec.querySelector('.step-head'), num=head?head.querySelector('.step-n').textContent.trim():'', title=head?head.querySelector('h2').textContent.trim():'';
      var kids=Array.prototype.slice.call(sec.children), groups=[[]];
      kids.forEach(function(el){ if(el.classList.contains('block')) groups.push([el]); else groups[groups.length-1].push(el); });
      if(!groups[0].length) groups.shift();
      groups.forEach(function(g,i){
        var s=document.createElement('div'); s.className='slide'+(i===0?' intro':'');
        if(i===0&&g.length===1&&g[0]===head) s.classList.add('divider');
        if(i>0){ var c=document.createElement('p'); c.className='slide-ctx'; c.innerHTML='<b>'+num+'</b><span>'+title+'</span>'; s.appendChild(c); }
        g.forEach(function(el){ s.appendChild(el); });
        sec.appendChild(s);
        var h=i===0?title:((g[0].querySelector('.panel-title h3, h3')||{}).textContent||title);
        all.push({el:s,label:(num&&num.length<3?num+' · ':'')+h.trim()});
      });
    });
    return all;
  }
  var slides=build(); if(!slides) return;
  var nav=document.querySelector('.nav'), top=document.querySelector('.topbar');
  function measure(){ if(nav) root.style.setProperty('--navh',nav.offsetHeight+'px'); if(top) root.style.setProperty('--topbarh',top.offsetHeight+'px'); }
  measure(); window.addEventListener('resize',measure);
  /* Barra de progresso e paginador */
  var prog=document.createElement('div'); prog.className='slide-progress'; prog.innerHTML='<span></span>'; if(nav) nav.appendChild(prog);
  var pager=document.createElement('div'); pager.className='slide-pager'; pager.setAttribute('role','navigation'); pager.setAttribute('aria-label','Navegação entre telas');
  pager.innerHTML='<span class="label" aria-live="polite"></span><button type="button" data-d="-1" aria-label="Tela anterior"><svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7"/></svg></button><span class="count"></span><button type="button" data-d="1" aria-label="Próxima tela"><svg viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"/></svg></button>';
  document.body.appendChild(pager);
  var cur=-1, lbl=pager.querySelector('.label'), cnt=pager.querySelector('.count'), bPrev=pager.querySelector('[data-d="-1"]'), bNext=pager.querySelector('[data-d="1"]');
  function show(i){ cur=i; var s=slides[Math.max(0,i)]; cnt.textContent=(i<0?'–':(i+1))+' / '+slides.length; lbl.textContent=i<0?'Capa':s.label; bPrev.disabled=i<0; bNext.disabled=i>=slides.length-1; prog.firstChild.style.width=((i+1)/slides.length*100)+'%'; }
  function go(i){ i=Math.max(-1,Math.min(slides.length-1,i)); var smooth=!(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches);
    if(i<0) window.scrollTo({top:0,behavior:smooth?'smooth':'auto'}); else slides[i].el.scrollIntoView({behavior:smooth?'smooth':'auto',block:'start'}); }
  bPrev.addEventListener('click',function(){go(cur-1);}); bNext.addEventListener('click',function(){go(cur+1);});
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting){ for(var k=0;k<slides.length;k++) if(slides[k].el===e.target){ show(k); break; } } }); },{rootMargin:'-40% 0px -55% 0px'});
    slides.forEach(function(s){ io.observe(s.el); });
    var hero=document.querySelector('.hero'); if(hero) new IntersectionObserver(function(es){ if(es[0].isIntersecting) show(-1); },{rootMargin:'-40% 0px -55% 0px'}).observe(hero);
  }
  show(-1);
  document.addEventListener('keydown',function(e){
    if(!root.classList.contains('slides-on')||e.altKey||e.ctrlKey||e.metaKey) return;
    var t=e.target, tag=(t.tagName||'').toLowerCase();
    if(tag==='input'||tag==='textarea'||tag==='select'||t.isContentEditable) return;
    if(e.key==='ArrowRight'){ e.preventDefault(); go(cur+1); } else if(e.key==='ArrowLeft'){ e.preventDefault(); go(cur-1); }
  });
  /* Alternância entre slides e rolagem contínua */
  var on=true; try{ on=localStorage.getItem(KEY)!=='off'; }catch(e){}
  function apply(){ root.classList.toggle('slides-on',on); document.querySelectorAll('[data-slides-toggle]').forEach(function(b){ b.setAttribute('aria-pressed',on?'true':'false'); b.textContent=on?'Rolagem contínua':'Modo slides'; }); measure(); }
  var tb=document.querySelector('.topbar .theme-btn');
  if(tb){ var b=document.createElement('button'); b.type='button'; b.className='theme-btn'; b.setAttribute('data-slides-toggle',''); tb.parentNode.insertBefore(b,tb);
    b.addEventListener('click',function(){ on=!on; try{localStorage.setItem(KEY,on?'on':'off');}catch(e){} apply(); var s=slides[Math.max(0,cur)]; if(cur>=0) s.el.scrollIntoView({block:'start'}); }); }
  apply();
})();
