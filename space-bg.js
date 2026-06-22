
/* space-bg.js — floating rockets, comets & meteors background
   Drop <canvas id="space-canvas"></canvas> anywhere in <body>
   and include this script. Works on all pages. */
(function () {
  /* ── canvas setup ── */
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

  /* ── helpers ── */
  const rand    = (a, b) => a + Math.random() * (b - a);
  const randInt = (a, b) => Math.floor(rand(a, b + 1));

  /* ── STARS (static twinkle) ── */
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

  /* ── ROCKETS ── */
  class Rocket {
    constructor() { this.reset(); }
    reset() {
      this.x        = rand(50, W - 50);
      this.y        = H + rand(20, 60);
      this.vx       = rand(-0.8, 0.8);
      this.vy       = -rand(1.4, 3.2);
      this.size     = rand(14, 22);
      this.rotation = Math.atan2(this.vy, this.vx) - Math.PI / 2;
      this.particles= [];
      this.tick     = 0;
      this.color    = ['#f472b6', '#a78bfa', '#60a5fa', '#fb923c'][randInt(0, 3)];
    }
    update() {
      this.x += this.vx; this.y += this.vy; this.tick++;
      if (this.tick % 3 === 0) {
        this.particles.push({
          x: this.x, y: this.y + this.size * 0.6,
          vx: rand(-0.6, 0.6), vy: rand(0.5, 2),
          life: 0, maxLife: rand(18, 32), r: rand(2, 5)
        });
      }
      this.particles = this.particles.filter(p => { p.x += p.vx; p.y += p.vy; p.life++; return p.life < p.maxLife; });
      if (this.y < -120) this.reset();
    }
    draw() {
      this.particles.forEach(p => {
        const pct = 1 - p.life / p.maxLife;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r * pct, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,160,60,${0.6 * pct})`; ctx.fill();
      });
      ctx.save();
      ctx.translate(this.x, this.y); ctx.rotate(this.rotation);
      const s = this.size;
      ctx.beginPath();
      ctx.moveTo(0, -s);
      ctx.quadraticCurveTo(s * 0.55, -s * 0.2, s * 0.45, s * 0.45);
      ctx.lineTo(-s * 0.45, s * 0.45);
      ctx.quadraticCurveTo(-s * 0.55, -s * 0.2, 0, -s);
      ctx.fillStyle = this.color; ctx.fill();
      ctx.beginPath(); ctx.arc(0, -s * 0.2, s * 0.18, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,255,255,0.85)'; ctx.fill();
      ctx.globalAlpha = 0.75;
      ctx.beginPath(); ctx.moveTo(-s*0.45,s*0.3); ctx.lineTo(-s*0.85,s*0.7); ctx.lineTo(-s*0.45,s*0.55);
      ctx.fillStyle = this.color; ctx.fill();
      ctx.beginPath(); ctx.moveTo(s*0.45,s*0.3); ctx.lineTo(s*0.85,s*0.7); ctx.lineTo(s*0.45,s*0.55);
      ctx.fill();
      ctx.globalAlpha = 1; ctx.restore();
    }
  }

  /* ── Instantiate ── */
  const comets  = Array.from({ length: 5 }, () => { const c = new Comet();  c.y = rand(0, H); return c; });
  const meteors = Array.from({ length: 6 }, () => { const m = new Meteor(); m.y = rand(0, H * 0.5); m.life = randInt(0, m.maxLife); return m; });
  const rockets = Array.from({ length: 4 }, () => { const r = new Rocket(); r.y = rand(-H, 0); return r; });

  setInterval(() => { if (comets.length  < 7) comets.push(new Comet());   }, 4000);
  setInterval(() => { if (meteors.length < 9) meteors.push(new Meteor());  }, 2500);
  setInterval(() => { if (rockets.length < 6) rockets.push(new Rocket());  }, 6000);

  /* ── Render loop ── */
  let raf;
  function loop(t) {
    t /= 1000;
    ctx.clearRect(0, 0, W, H);
    drawStars(t);
    comets.forEach(c  => { c.update();  c.draw(); });
    meteors.forEach(m => { m.update(); m.draw(); });
    rockets.forEach(r => { r.update();  r.draw(); });
    raf = requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(raf);
    else requestAnimationFrame(loop);
  });
})();
