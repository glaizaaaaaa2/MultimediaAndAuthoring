/* space-bg.js — floating comets & meteors background (no rockets) */
(function () {
  let canvas = document.getElementById('space-canvas');
  if (!canvas) {
    canvas = document.createElement('canvas');
    canvas.id = 'space-canvas';
    document.body.prepend(canvas);
  }
  Object.assign(canvas.style, {
    position: 'fixed', inset: '0',
    pointerEvents: 'none', zIndex: '0',
    width: '100%', height: '100%'
  });

  const ctx = canvas.getContext('2d');
  let W, H;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const rand    = (a, b) => a + Math.random() * (b - a);
  const randInt = (a, b) => Math.floor(rand(a, b + 1));

  /* ── STARS ── */
  const stars = Array.from({ length: 180 }, () => ({
    x: rand(0, 1), y: rand(0, 1),
    r: rand(0.5, 1.8),
    base: rand(0.15, 0.6),
    phase: rand(0, Math.PI * 2),
    speed: rand(0.4, 1.2)
  }));

  function drawStars(t) {
    stars.forEach(s => {
      const alpha = s.base + 0.2 * Math.sin(s.phase + t * s.speed);
      ctx.beginPath();
      ctx.arc(s.x * W, s.y * H, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${alpha})`;
      ctx.fill();
    });
  }

  /* ── COMETS ── */
  class Comet {
    constructor() { this.reset(); }
    reset() {
      this.x     = rand(0, W);
      this.y     = rand(-80, -10);
      this.vx    = rand(-1.5, 1.5);
      this.vy    = rand(3, 7);
      this.len   = rand(80, 180);
      this.w     = rand(1.5, 3);
      this.alpha = rand(0.5, 0.9);
      this.color = Math.random() < 0.5 ? '168,120,255' : '244,114,182';
    }
    update() { this.x += this.vx; this.y += this.vy; if (this.y > H + 100) this.reset(); }
    draw() {
      const spd = Math.sqrt(this.vx ** 2 + this.vy ** 2);
      const nx = -this.vx / spd, ny = -this.vy / spd;
      const grad = ctx.createLinearGradient(this.x, this.y, this.x + nx * this.len, this.y + ny * this.len);
      grad.addColorStop(0, `rgba(${this.color},${this.alpha})`);
      grad.addColorStop(1, `rgba(${this.color},0)`);
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(this.x + nx * this.len, this.y + ny * this.len);
      ctx.strokeStyle = grad; ctx.lineWidth = this.w; ctx.lineCap = 'round';
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.w * 1.4, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color},${this.alpha})`;
      ctx.fill();
    }
  }

  /* ── METEORS ── */
  class Meteor {
    constructor() { this.reset(); }
    reset() {
      this.x       = rand(-100, W + 100);
      this.y       = rand(0, H * 0.65);
      this.vx      = rand(6, 14) * (Math.random() < 0.5 ? 1 : -1);
      this.vy      = rand(1, 3);
      this.len     = rand(60, 140);
      this.w       = rand(1, 2);
      this.alpha   = rand(0.3, 0.7);
      this.life    = 0;
      this.maxLife = rand(40, 80);
    }
    update() {
      this.x += this.vx; this.y += this.vy; this.life++;
      if (this.life > this.maxLife || this.x < -200 || this.x > W + 200) this.reset();
    }
    draw() {
      const pct  = 1 - this.life / this.maxLife;
      const sign = this.vx < 0 ? -1 : 1;
      const grad = ctx.createLinearGradient(this.x, this.y, this.x - sign * this.len, this.y);
      grad.addColorStop(0, `rgba(255,220,180,${this.alpha * pct})`);
      grad.addColorStop(1, `rgba(255,140,60,0)`);
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(this.x - sign * this.len, this.y - this.vy * (this.len / Math.abs(this.vx)));
      ctx.strokeStyle = grad; ctx.lineWidth = this.w; ctx.lineCap = 'round';
      ctx.stroke();
    }
  }

  /* ── Instantiate ── */
  const comets  = Array.from({ length: 5 }, () => { const c = new Comet();  c.y = rand(0, H); return c; });
  const meteors = Array.from({ length: 6 }, () => { const m = new Meteor(); m.y = rand(0, H * 0.5); m.life = randInt(0, m.maxLife); return m; });

  setInterval(() => { if (comets.length  < 7) comets.push(new Comet());  }, 4000);
  setInterval(() => { if (meteors.length < 9) meteors.push(new Meteor()); }, 2500);

  /* ── Render loop ── */
  let raf;
  function loop(t) {
    t /= 1000;
    ctx.clearRect(0, 0, W, H);
    drawStars(t);
    comets.forEach(c  => { c.update(); c.draw(); });
    meteors.forEach(m => { m.update(); m.draw(); });
    raf = requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(raf);
    else requestAnimationFrame(loop);
  });
})();
