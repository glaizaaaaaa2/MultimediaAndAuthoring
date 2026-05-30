(function(){
  const canvas = document.createElement('canvas');
  canvas.id = 'starfield';
  canvas.style.cssText = 'position:fixed;inset:0;z-index:-1;pointer-events:none;';
  document.body.prepend(canvas);
  const ctx = canvas.getContext('2d');
  let stars = [], W, H;

  function resize(){
    W = canvas.width = innerWidth;
    H = canvas.height = innerHeight;
  }
  function init(){
    resize();
    stars = Array.from({length:260}, () => ({
      x: Math.random()*W, y: Math.random()*H,
      r: Math.random()*1.5+0.2,
      speed: Math.random()*0.15+0.03,
      alpha: Math.random()*0.75+0.2,
      phase: Math.random()*Math.PI*2
    }));
  }
  function getStarColor(){
    const el = document.documentElement;
    const mode = el.getAttribute('data-theme');
    return mode === 'light' ? 'rgba(15,23,60,' : 'rgba(242,228,248,';
  }
  function draw(){
    ctx.clearRect(0,0,W,H);
    const base = getStarColor();
    stars.forEach(s=>{
      s.phase += 0.009;
      const a = s.alpha*(0.5+0.5*Math.sin(s.phase));
      ctx.beginPath();
      ctx.arc(s.x,s.y,s.r,0,Math.PI*2);
      ctx.fillStyle = base+a+')';
      ctx.fill();
      s.y += s.speed;
      if(s.y > H){ s.y=-2; s.x=Math.random()*W; }
    });
    requestAnimationFrame(draw);
  }
  window.addEventListener('resize',()=>{ resize(); });
  init(); draw();
})();
