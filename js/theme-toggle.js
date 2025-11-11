// theme-toggle.js
// Adds a theme toggle button to the header and persists choice in localStorage
(function(){
  const STORAGE_KEY = 'mustang_theme';

  function applyTheme(theme){
    if(theme === 'light') document.documentElement.setAttribute('data-theme','light');
    else document.documentElement.removeAttribute('data-theme');
  }

  function createButton(){
    const btn = document.createElement('button');
    btn.className = 'theme-toggle';
    btn.setAttribute('aria-pressed','false');
    btn.title = 'Toggle light / dark theme';
    btn.innerHTML = '<span class="icon">☼</span><span class="label">Theme</span>';
    return btn;
  }

  // insert once header is present
  function init(){
    const header = document.querySelector('.site-header');
    if(!header) return;
    const btn = createButton();
    header.appendChild(btn);

    // load pref
    const saved = localStorage.getItem(STORAGE_KEY);
    applyTheme(saved === 'light' ? 'light' : 'dark');
    btn.setAttribute('aria-pressed', saved === 'light' ? 'true' : 'false');

    btn.addEventListener('click', ()=>{
      const isLight = document.documentElement.getAttribute('data-theme') === 'light';
      const next = isLight ? 'dark' : 'light';
      applyTheme(next);
      localStorage.setItem(STORAGE_KEY, next === 'light' ? 'light' : 'dark');
      btn.setAttribute('aria-pressed', next === 'light' ? 'true' : 'false');
    });
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
