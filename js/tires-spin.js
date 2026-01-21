// tires-spin.js
// Toggle spinning on hover/click and add a blue/green glow effect while spinning
(function(){
  const wheels = Array.from(document.querySelectorAll('.wheel'));
  const largeInner = document.querySelector('.large-image-inner');

  // Helper to start color toggling (blue/green) while spinning
  function startColorToggle(el){
    if(!el) return;
    // avoid creating multiple intervals
    if(el._colorInterval) return;
    let toggle = 0;
    el._colorInterval = setInterval(()=>{
      toggle = (toggle + 1) % 2;
      if(toggle === 0){
        el.classList.remove('tire-green');
        el.classList.add('tire-blue');
      } else {
        el.classList.remove('tire-blue');
        el.classList.add('tire-green');
      }
    }, 350); // switch colors every 350ms while spinning
  }

  function stopColorToggle(el){
    if(!el) return;
    if(el._colorInterval){
      clearInterval(el._colorInterval);
      el._colorInterval = null;
    }
    el.classList.remove('tire-blue','tire-green');
  }

  // Attach hover and click handlers for each wheel
  wheels.forEach(wheel=>{
    // click/touch toggles persistent spinning state (no color toggle here)
    wheel.addEventListener('click', function(e){
      e.preventDefault && e.preventDefault();
      wheel._toggled = !wheel._toggled;
      wheel.classList.toggle('spinning', wheel._toggled);
      // do not start color here; color is triggered only by clicking the car area
      if(!wheel._toggled) stopColorToggle(wheel);
    });

    wheel.addEventListener('touchstart', function(e){ e.stopPropagation(); }, {passive:false});
    wheel.addEventListener('touchend', function(e){
      e.preventDefault && e.preventDefault();
      wheel._toggled = !wheel._toggled;
      wheel.classList.toggle('spinning', wheel._toggled);
      if(!wheel._toggled) stopColorToggle(wheel);
    }, {passive:false});
  });

  // Clicking the large car (outside the wheels) toggles both wheels on touch devices
  if(largeInner){
    // Click toggles both wheels (keeps previous behavior)
    largeInner.addEventListener('click', function(e){
      if(e.target.closest('.wheel')) return;
      wheels.forEach(w=>{
        w._toggled = !w._toggled;
        w.classList.toggle('spinning', w._toggled);
        if(w._toggled) startColorToggle(w); else stopColorToggle(w);
      });
    });
    largeInner.addEventListener('touchend', function(e){
      if(e.target.closest('.wheel')) return;
      wheels.forEach(w=>{
        w._toggled = !w._toggled;
        w.classList.toggle('spinning', w._toggled);
        if(w._toggled) startColorToggle(w); else stopColorToggle(w);
      });
    }, {passive:false});

    // Hovering the car should show multi-color effect on both wheels (blue -> green -> red)
    let hoverInterval = null;
    let hoverIndex = 0;
    function startHoverCycle(){
      if(hoverInterval) return;
      // ensure wheels are spinning while hovered
      wheels.forEach(w=>w.classList.add('spinning'));
      hoverInterval = setInterval(()=>{
        hoverIndex = (hoverIndex + 1) % 3;
        wheels.forEach(w=>{
          w.classList.remove('tire-blue','tire-green','tire-red');
          if(hoverIndex === 0) w.classList.add('tire-blue');
          if(hoverIndex === 1) w.classList.add('tire-green');
          if(hoverIndex === 2) w.classList.add('tire-red');
        });
      }, 350);
    }
    function stopHoverCycle(){
      if(hoverInterval){
        clearInterval(hoverInterval);
        hoverInterval = null;
      }
      wheels.forEach(w=>{
        w.classList.remove('tire-blue','tire-green','tire-red');
        // if a wheel wasn't toggled on click, stop spinning
        if(!w._toggled) w.classList.remove('spinning');
      });
    }

    largeInner.addEventListener('mouseenter', function(e){
      if(e.target.closest('.wheel')) return;
      startHoverCycle();
    });
    largeInner.addEventListener('mouseleave', function(e){
      if(e.target.closest('.wheel')) return;
      stopHoverCycle();
    });
    // touch: start on touchstart and stop on touchend (tap outside wheel)
    largeInner.addEventListener('touchstart', function(e){ if(e.target.closest('.wheel')) return; startHoverCycle(); }, {passive:true});
    largeInner.addEventListener('touchend', function(e){ if(e.target.closest('.wheel')) return; stopHoverCycle(); }, {passive:false});
  }

})();
