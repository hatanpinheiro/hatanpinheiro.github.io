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
