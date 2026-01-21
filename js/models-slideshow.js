// models-slideshow.js
// Autoplay slideshow for about page: image above, caption below. 1.5s per slide.
(function(){
  const slideshow = document.querySelector('.slideshow');
  if(!slideshow) {
    console.warn('models-slideshow: no .slideshow element found');
    return;
  }
  const slides = Array.from(slideshow.querySelectorAll('.slide'));
  if(!slides.length){
    console.warn('models-slideshow: no slides found inside .slideshow');
    return;
  }
  let idx = 0;
  let timer = null;
  const interval = 1500; // 1.5s

  // debug info
  console.info(`models-slideshow: starting with ${slides.length} slide(s), interval ${interval}ms`);

  function show(i){
    slides.forEach((s, j)=>{
      s.classList.toggle('active', j===i);
      // position offscreen left for previous, right for next for smoother feel
      if(j!==i){
        s.style.transform = 'translateX(100%)';
      } else {
        s.style.transform = 'translateX(0)';
      }
    });
  }

  function next(){
    idx = (idx+1) % slides.length;
    show(idx);
  }

  function start(){
    timer = setInterval(next, interval);
  }

  function stop(){
    clearInterval(timer);
    timer = null;
  }

  // pause on hover/focus
  slideshow.addEventListener('mouseenter', stop);
  slideshow.addEventListener('mouseleave', ()=>{ if(!timer) start(); });
  slideshow.addEventListener('focusin', stop);
  slideshow.addEventListener('focusout', ()=>{ if(!timer) start(); });

  // touch support
  let startX = 0;
  slideshow.addEventListener('touchstart', (e)=>{ startX = e.touches[0].clientX; stop(); });
  slideshow.addEventListener('touchend', (e)=>{
    const dx = e.changedTouches[0].clientX - startX;
    if(Math.abs(dx) > 40){
      if(dx > 0) idx = (idx-1+slides.length)%slides.length;
      else idx = (idx+1)%slides.length;
      show(idx);
    }
    if(!timer) start();
  });

  // initial
  show(idx);
  start();
})();
