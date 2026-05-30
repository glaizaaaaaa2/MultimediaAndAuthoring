// Animated starfield — shared across all pages
(function(){
  const canvas = document.createElement('canvas');
  canvas.id = 'starfield';
  canvas.style.cssText = 'position:fixed;inset:0;z-index:-1;pointer-events:none;';
  document.body.prepend(canvas);
  const ctx = canvas.getContext('2d');
  let stars = [];
  function resize(){ canvas.width=innerWidth; canvas.height=innerHeight; }
  function init(){
    resize();
    stars = Array.from({length:220}, () => ({
      x: Math.random()*canvas.width,
      y: Math.random()*canvas.height,
      r: Math.random()*1.4+0.2,
      speed: Math.random()*0.18+0.04,
      alpha: Math.random()*0.7+0.2,
      twinkle: Math.random()*Math.PI*2
    }));
  }
  function draw(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    stars.forEach(s=>{
      s.twinkle += 0.012;
      const a = s.alpha * (0.6 + 0.4*Math.sin(s.twinkle));
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI*2);
      ctx.fillStyle = `rgba(242,228,248,${a})`;
      ctx.fill();
      s.y += s.speed;
      if(s.y > canvas.height){ s.y = -2; s.x = Math.random()*canvas.width; }
    });
    requestAnimationFrame(draw);
  }
  window.addEventListener('resize', ()=>{ resize(); stars.forEach(s=>{ s.x*=canvas.width/(canvas.width||1); }); });
  init(); draw();
})();
