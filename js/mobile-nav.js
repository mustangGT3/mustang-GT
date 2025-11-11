// Simple mobile nav toggle with persistent state
(function(){
  const btn = document.querySelector('.mobile-nav-toggle');
  const nav = document.querySelector('.main-nav');
  if(!btn || !nav) return;

  const STORAGE_KEY = 'mustang_nav_open_v1';

  function setOpen(open){
    btn.setAttribute('aria-expanded', String(Boolean(open)));
    nav.classList.toggle('open', Boolean(open));
    try{ localStorage.setItem(STORAGE_KEY, open ? '1' : '0'); }catch(e){}
  }

  // initialize from storage (only apply on small screens)
  function initFromStorage(){
    try{
      const stored = localStorage.getItem(STORAGE_KEY);
      if(stored === '1'){
        setOpen(true);
      }
    }catch(e){}
  }

  btn.addEventListener('click', ()=>{
    const expanded = btn.getAttribute('aria-expanded') === 'true';
    setOpen(!expanded);
  });

  // When a nav link is clicked, persist open state (so after navigation it stays open).
  nav.addEventListener('click', function(e){
    const a = e.target.closest('a');
    if(!a) return;
    // keep state as-is; navigation will reload the page, initFromStorage will restore
  });

  // on load, try to restore
  document.addEventListener('DOMContentLoaded', ()=>{
    initFromStorage();
  });

})();
