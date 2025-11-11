// Simple carousel that cycles images every 1 second
(function(){
  const slides = document.querySelector('.slides');
  if(!slides) return;
  const imgs = Array.from(slides.querySelectorAll('img'));
  const dotsWrap = document.querySelector('.carousel-dots');
  const carousel = document.querySelector('.hero-carousel');
  let idx = 0;
  const total = imgs.length;

  if(!dotsWrap || !carousel) return;

  // Respect reduced motion preference: disable autoplay if user prefers reduced motion
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // create dots (tabs) with accessibility
  imgs.forEach((img, i) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'carousel-dot';
    btn.setAttribute('aria-label', `Show slide ${i+1}`);
    btn.setAttribute('role', 'tab');
    btn.setAttribute('aria-selected', 'false');
    btn.addEventListener('click', ()=>{
      idx = i;
      go();
      resetTimer();
      img.focus();
    });
    dotsWrap.appendChild(btn);
  });
  const dots = Array.from(dotsWrap.querySelectorAll('button'));

  // create arrows
  const prev = document.querySelector('.carousel-prev');
  const next = document.querySelector('.carousel-next');

  if(prev){
    prev.addEventListener('click', ()=>{ idx = (idx-1+total)%total; go(); resetTimer(); prev.blur(); });
  }
  if(next){
    next.addEventListener('click', ()=>{ idx = (idx+1)%total; go(); resetTimer(); next.blur(); });
  }

  // caption element
  const captionEl = document.querySelector('.carousel-caption');

  function updateDots(){
    dots.forEach((d,i)=>{
      const active = i===idx;
      d.classList.toggle('active', active);
      d.setAttribute('aria-selected', active ? 'true' : 'false');
      d.setAttribute('tabindex', active ? '0' : '-1');
    });
  }

  function updateCaption(){
    if(!captionEl) return;
    const caption = imgs[idx].dataset.caption || imgs[idx].alt || '';
    captionEl.textContent = caption;
    // hide from AT when empty
    captionEl.setAttribute('aria-hidden', caption ? 'false' : 'true');
  }

  function go(){
    slides.style.transform = `translateX(-${idx*100}%)`;
    updateDots();
    updateCaption();
    // announce slide to screen readers
    carousel.setAttribute('aria-roledescription', `Slide ${idx+1} of ${total}`);
  }

  // autoplay control: default ON, can disable by adding data-autoplay="false" to .hero-carousel
  const autoplayAttr = carousel.dataset.autoplay;
  const autoplay = autoplayAttr !== 'false'; // default true

  // sensible default interval (1s by default, longer when user prefers reduced motion)
  const INTERVAL = prefersReduced ? 8000 : 1000;

  let timer = null;
  function startTimer(){
    if(!autoplay) return;
    clearInterval(timer);
    timer = setInterval(()=>{
      idx = (idx+1)%total;
      go();
    }, INTERVAL);
  }

  function resetTimer(){
    clearInterval(timer);
    startTimer();
  }

  // pause on hover / focus for better UX
  carousel.addEventListener('mouseenter', ()=> clearInterval(timer));
  carousel.addEventListener('mouseleave', ()=> resetTimer());
  carousel.addEventListener('focusin', ()=> clearInterval(timer));
  carousel.addEventListener('focusout', ()=> resetTimer());

  // keyboard navigation (left/right while carousel has focus)
  carousel.addEventListener('keydown', (e)=>{
    if(e.key === 'ArrowLeft'){
      idx = (idx-1+total)%total; go(); resetTimer();
    } else if(e.key === 'ArrowRight'){
      idx = (idx+1)%total; go(); resetTimer();
    }
  });

  // touch swipe support
  let touchStartX = 0;
  slides.addEventListener('touchstart', (e)=>{ touchStartX = e.touches[0].clientX; clearInterval(timer); });
  slides.addEventListener('touchend', (e)=>{
    const dx = e.changedTouches[0].clientX - touchStartX;
    if(Math.abs(dx) > 40){
      if(dx > 0) idx = (idx-1+total)%total;
      else idx = (idx+1)%total;
      go();
    }
    resetTimer();
  });

  // lazy loading: add loading="lazy" if supported
  imgs.forEach(img => img.loading = 'lazy');

  // initial
  go();
  startTimer();
})();