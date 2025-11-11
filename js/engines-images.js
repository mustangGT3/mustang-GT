// engines-images.js
// Allows selecting an image for each engine card, previewing it, and persisting the preview in localStorage.

(function(){
  const STORAGE_KEY = 'mustang_engine_images_v1';
  const selects = document.querySelectorAll('.engine-select');

  function loadStore(){
    try{ return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); }
    catch(e){ return {}; }
  }

  function saveStore(store){
    try{ localStorage.setItem(STORAGE_KEY, JSON.stringify(store)); }catch(e){ console.warn('Could not save engine images', e); }
  }

  function showPreview(key, src){
    const preview = document.querySelector(`[data-engine-preview="${key}"]`);
    if(!preview) return;
    preview.innerHTML = '';
    if(src){
      const img = document.createElement('img');
      img.src = src;
      img.alt = key + ' image';
      preview.appendChild(img);
      preview.setAttribute('aria-hidden','false');
    }else{
      preview.setAttribute('aria-hidden','true');
    }
  }

  function handleSelectChange(e){
    const sel = e.currentTarget;
    const key = sel.dataset.engine;
    const val = sel.value || null;
    const store = loadStore();
    if(val) store[key] = val;
    else delete store[key];
    saveStore(store);
    showPreview(key, val);
  }

  // attach listeners
  selects.forEach(s => s.addEventListener('change', handleSelectChange));

  // initialize from storage
  document.addEventListener('DOMContentLoaded', function(){
    const store = loadStore();
    Object.keys(store).forEach(k => showPreview(k, store[k]));
    // set selects to stored values
    selects.forEach(s => {
      const key = s.dataset.engine;
      if(store[key]) s.value = store[key];
    });
  });

})();