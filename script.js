/* ============================================================
   BIRTHDAY WEBSITE – MARIAM
   script.js – GSAP + Canvas Confetti + Custom animations
   ============================================================ */

gsap.registerPlugin(TextPlugin);

/* ── Utility: transition between scenes ── */
function goToScene(fromId, toId, cb) {
  const from = document.getElementById(fromId);
  const to   = document.getElementById(toId);
  if (!from || !to) return;

  // Fade out current
  gsap.to(from, {
    opacity: 0, duration: 0.6, ease: 'power2.inOut',
    onComplete: () => {
      from.classList.remove('active');
      from.style.opacity = '';
      to.classList.add('active');
      gsap.fromTo(to, { opacity: 0 }, { opacity: 1, duration: 0.8, ease: 'power2.out' });
      if (cb) cb();
    }
  });
}

/* ============================================================
   SCENE 1 INIT – sparkles + petals + envelope
============================================================ */
(function initScene1() {
  // Sparkle dots
  const field = document.getElementById('sparkleField');
  for (let i = 0; i < 35; i++) {
    const dot = document.createElement('div');
    dot.className = 'sparkle-dot';
    dot.style.cssText = `
      left: ${Math.random() * 100}%;
      top:  ${Math.random() * 100}%;
      --dur:   ${2 + Math.random() * 3}s;
      --delay: ${Math.random() * 4}s;
      width: ${3 + Math.random() * 5}px;
      height: ${3 + Math.random() * 5}px;
    `;
    field.appendChild(dot);
  }

  // Floating SVG petals in background
  const petalsBg = document.getElementById('petalsBg');
  const petalEmojis = ['🌸', '🌼', '🌸', '🌼', '🌸'];
  for (let i = 0; i < 18; i++) {
    const p = document.createElement('div');
    p.className = 'fp';
    p.textContent = petalEmojis[i % petalEmojis.length];
    p.style.cssText = `
      left: ${Math.random() * 100}%;
      --fp-dur:   ${7 + Math.random() * 8}s;
      --fp-delay: ${Math.random() * 9}s;
      --fp-dx:    ${(Math.random() - 0.5) * 120}px;
      --fp-op:    ${0.25 + Math.random() * 0.35};
      --fp-size:  ${0.8 + Math.random() * 0.8}rem;
    `;
    petalsBg.appendChild(p);
  }
})();

/* ── Open envelope ── */
document.getElementById('openBtn').addEventListener('click', openEnvelope);
document.getElementById('envelope').addEventListener('click', openEnvelope);

function openEnvelope() {
  const wrapper = document.getElementById('envelopeWrapper');
  const env     = document.getElementById('envelope');

  // Disable repeat click
  document.getElementById('openBtn').disabled = true;

  const tl = gsap.timeline();
  tl
    .to(env, { scale: 1.12, duration: 0.25, ease: 'power2.out' })
    .to(env, { scale: 0.9, duration: 0.2, ease: 'power2.in' })
    // Burst sparkles
    .call(() => burstSparkles(wrapper))
    // Zoom up
    .to(wrapper, {
      scale: 1.3, opacity: 0, y: -60,
      duration: 0.7, ease: 'power3.in'
    })
    .call(() => goToScene('scene-1', 'scene-2', initScene2));
}

/* Burst sparkles at element position */
function burstSparkles(el) {
  const rect = el.getBoundingClientRect();
  const cx   = rect.left + rect.width  / 2;
  const cy   = rect.top  + rect.height / 2;
  for (let i = 0; i < 20; i++) {
    const s = document.createElement('div');
    s.style.cssText = `
      position:fixed; left:${cx}px; top:${cy}px;
      width:7px; height:7px; border-radius:50%;
      background: hsl(${Math.random()*60+30},100%,70%);
      z-index:999; pointer-events:none;
    `;
    document.body.appendChild(s);
    gsap.to(s, {
      x: (Math.random() - 0.5) * 260,
      y: (Math.random() - 0.5) * 260,
      opacity: 0, scale: 0,
      duration: 0.9 + Math.random() * 0.6,
      ease: 'power2.out',
      onComplete: () => s.remove()
    });
  }
}

/* ============================================================
   SCENE 2 – TYPEWRITER
============================================================ */
function initScene2() {
  spawnFloatingPetals('floatingPetals2', 14);

  const card = document.getElementById('typewriterCard');
  const text = document.getElementById('typewriterText');
  const nextBtn = document.getElementById('scene2Next');

  gsap.fromTo(card,
    { y: 40, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.8, ease: 'back.out(1.4)' }
  );

  const message = `Hey Mariam 🌼\n\nBefore your birthday celebration starts...\nthere's something waiting for you ✨`;
  const chars = Array.from(message);

  let i = 0;
  let finished = false;
  text.textContent = '';

  const scene2 = document.getElementById('scene-2');

  function finishTyping() {
    if (finished) return;
    finished = true;
    clearInterval(interval);
    text.textContent = message;
    scene2.removeEventListener('click', skipHandler);
    setTimeout(() => {
      nextBtn.classList.remove('hidden');
      gsap.fromTo(nextBtn,
        { y: 16, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: 'back.out(1.4)' }
      );
    }, 300);
  }

  function skipHandler(e) {
    if (e.target.closest('button')) return;
    finishTyping();
  }
  scene2.addEventListener('click', skipHandler);

  const interval = setInterval(() => {
    if (i < chars.length) {
      text.textContent += chars[i++];
    } else {
      finishTyping();
    }
  }, 42);

  document.getElementById('scene2Next').addEventListener('click', () => {
    goToScene('scene-2', 'scene-3', initScene3);
  }, { once: true });
}

/* ============================================================
   SCENE 3 – CAKE BUILDING
============================================================ */
function initScene3() {
  const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });

  tl
    // Stand
    .to('#cakeStand', { opacity: 1, y: 0, duration: 0.5 })
    // Bottom layer rises with bounce
    .fromTo('#cakeBottom',
      { opacity: 0, scaleY: 0, transformOrigin: 'bottom center' },
      { opacity: 1, scaleY: 1, duration: 0.6, ease: 'back.out(2)' }
    )
    .to('#cakeBottom', {}, '+=0.15')
    // Bottom cream
    .fromTo('#bottomCream',
      { opacity: 0, scaleX: 0.4, transformOrigin: 'center center' },
      { opacity: 1, scaleX: 1, duration: 0.45, ease: 'back.out(1.8)' }
    )
    // Middle layer
    .fromTo('#cakeMiddle',
      { opacity: 0, scaleY: 0, transformOrigin: 'bottom center' },
      { opacity: 1, scaleY: 1, duration: 0.55, ease: 'back.out(2)' }
    )
    .to('#cakeMiddle', {}, '+=0.1')
    // Middle cream
    .fromTo('#middleCream',
      { opacity: 0, scaleX: 0.4, transformOrigin: 'center center' },
      { opacity: 1, scaleX: 1, duration: 0.4, ease: 'back.out(1.8)' }
    )
    // Top layer
    .fromTo('#cakeTop',
      { opacity: 0, scaleY: 0, transformOrigin: 'bottom center' },
      { opacity: 1, scaleY: 1, duration: 0.5, ease: 'back.out(2)' }
    )
    // Top cream
    .fromTo('#topCream',
      { opacity: 0, scaleX: 0.3, transformOrigin: 'center center' },
      { opacity: 1, scaleX: 1, duration: 0.4, ease: 'back.out(1.8)' }
    )
    // Daisies pop in
    .fromTo('#cakeDaisies',
      { opacity: 0, scale: 0, transformOrigin: '170px 235px' },
      { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(2.2)' }
    )
    // Sparkles
    .fromTo('#cakeSparkles',
      { opacity: 0 },
      { opacity: 1, duration: 0.4 }
    )
    // Candles pop in one by one
    .fromTo('#cakeCandles3 .s3-candle',
      { opacity: 0, scaleY: 0, transformOrigin: 'bottom center' },
      { opacity: 1, scaleY: 1, duration: 0.3, ease: 'back.out(2)', stagger: 0.12 }
    )
    // Show next button
    .call(() => {
      const footer = document.getElementById('scene3Footer');
      footer.classList.remove('hidden');
      gsap.fromTo(footer,
        { y: 16, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5 }
      );
    });

  document.getElementById('scene3Next').addEventListener('click', () => {
    goToScene('scene-3', 'scene-4', initScene4);
  }, { once: true });
}

/* ============================================================
   SCENE 4 – BLOW THE CANDLES
============================================================ */
const CANDLE_COLORS = [
  { body: '#87CEEB', top: '#b8e4f9' },
  { body: '#f4a7c7', top: '#f9c6da' },
  { body: '#c8a7e7', top: '#ddc6f3' },
  { body: '#87CEEB', top: '#b8e4f9' },
  { body: '#f4a7c7', top: '#f9c6da' },
];
const CANDLE_HEIGHTS = [50, 58, 64, 58, 50];

let candlesLeft = 5;

function initScene4() {
  candlesLeft = 5;
  document.getElementById('candleCount').textContent = candlesLeft;
  const row = document.getElementById('candlesRow');
  row.innerHTML = '';

  CANDLE_COLORS.forEach((col, i) => {
    const wrap = document.createElement('div');
    wrap.className = 'candle-wrap';
    wrap.style.position = 'relative';

    const h = CANDLE_HEIGHTS[i];

    wrap.innerHTML = `
      <div class="candle-glow"></div>
      <div class="candle-flame" data-idx="${i}"></div>
      <div class="candle-wick"></div>
      <div class="candle-body" style="height:${h}px; background:${col.body}; box-shadow: inset -3px 0 8px rgba(0,0,0,0.08);">
        <div style="position:absolute;top:0;left:0;right:0;height:12px;background:${col.top};border-radius:6px 6px 0 0;"></div>
      </div>
    `;

    wrap.addEventListener('click', () => blowCandle(wrap, i));
    row.appendChild(wrap);

    // Entrance animation
    gsap.fromTo(wrap,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, ease: 'back.out(1.8)', delay: i * 0.1 }
    );
  });
}

function blowCandle(wrap, idx) {
  if (wrap.dataset.blown === 'true') return;
  wrap.dataset.blown = 'true';

  const flame = wrap.querySelector('.candle-flame');
  const glow  = wrap.querySelector('.candle-glow');

  // Wobble then extinguish
  gsap.to(flame, { scaleX: 1.4, scaleY: 0.3, duration: 0.15, ease: 'power2.out', onComplete: () => {
    gsap.to(flame, { opacity: 0, scaleY: 0, duration: 0.2, onComplete: () => flame.remove() });
    gsap.to(glow, { opacity: 0, duration: 0.3, onComplete: () => glow.remove() });
    spawnSmoke(wrap);
    candlesLeft--;
    document.getElementById('candleCount').textContent = candlesLeft;
    if (candlesLeft === 0) setTimeout(triggerCelebration, 700);
  }});
}

function spawnSmoke(wrap) {
  for (let i = 0; i < 5; i++) {
    const smoke = document.createElement('div');
    smoke.className = 'smoke-particle';
    smoke.style.cssText = `
      position: absolute;
      top: 0; left: 50%;
      transform: translateX(-50%);
      animation-delay: ${i * 0.15}s;
    `;
    wrap.appendChild(smoke);
    setTimeout(() => smoke.remove(), 1500);
  }
}

/* ============================================================
   SCENE 5 – CELEBRATION
============================================================ */
function triggerCelebration() {
  goToScene('scene-4', 'scene-5', () => {
    startCelebration();
    setTimeout(() => goToScene('scene-5', 'scene-6', initScene6), 4200);
  });
}

function startCelebration() {
  // Canvas confetti
  const end = Date.now() + 3500;
  const colors = ['#87CEEB', '#f4a7c7', '#c8a7e7', '#FFF9C4', '#ffffff', '#f9c6da'];

  function launchConfetti() {
    confetti({
      particleCount: 6,
      angle: 60,
      spread: 70,
      origin: { x: 0, y: 0.75 },
      colors,
      scalar: 1.2,
    });
    confetti({
      particleCount: 6,
      angle: 120,
      spread: 70,
      origin: { x: 1, y: 0.75 },
      colors,
      scalar: 1.2,
    });
    if (Date.now() < end) requestAnimationFrame(launchConfetti);
  }
  launchConfetti();

  // Petal canvas rain
  const canvas = document.getElementById('petalCanvas');
  const ctx    = canvas.getContext('2d');
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;

  const petalTypes = ['🌸', '🌼', '🌺', '✨', '⭐'];
  const petalObjs = Array.from({ length: 40 }, () => ({
    x:    Math.random() * canvas.width,
    y:    -40 - Math.random() * canvas.height,
    size: 16 + Math.random() * 18,
    speed: 1.5 + Math.random() * 2.5,
    sway: (Math.random() - 0.5) * 2,
    rot:  Math.random() * 360,
    rotSpeed: (Math.random() - 0.5) * 4,
    emoji: petalTypes[Math.floor(Math.random() * petalTypes.length)],
  }));

  let animRunning = true;
  function animPetals() {
    if (!animRunning) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    petalObjs.forEach(p => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot * Math.PI / 180);
      ctx.font = `${p.size}px serif`;
      ctx.textAlign = 'center';
      ctx.fillText(p.emoji, 0, 0);
      ctx.restore();
      p.y   += p.speed;
      p.x   += p.sway;
      p.rot += p.rotSpeed;
      if (p.y > canvas.height + 50) {
        p.y = -50;
        p.x = Math.random() * canvas.width;
      }
    });
    requestAnimationFrame(animPetals);
  }
  animPetals();
  setTimeout(() => { animRunning = false; }, 5000);

  // Celebration text entrance
  gsap.fromTo('.celebration-text',
    { scale: 0.6, opacity: 0 },
    { scale: 1, opacity: 1, duration: 0.9, ease: 'back.out(2)', delay: 0.3 }
  );
}

/* ============================================================
   SCENE 6 – BIRTHDAY CARD
============================================================ */
function initScene6() {
  spawnFloatingPetals('floatingPetals6', 16);

  const card = document.getElementById('birthdayCard');
  gsap.fromTo(card,
    { y: 50, opacity: 0, scale: 0.92 },
    { y: 0, opacity: 1, scale: 1, duration: 1, ease: 'back.out(1.5)' }
  );

  document.getElementById('scene6Next').addEventListener('click', () => {
    goToScene('scene-6', 'scene-notes', initNotes);
  }, { once: true });
}

/* ============================================================
   SCENE 7 – FINAL
============================================================ */
const QUOTES = [
  'Keep smiling and shining ✨',
  'Hope your coffee is always perfect ☕',
  'Have the happiest birthday ever 🌼',
  'Today is all about you 🎂',
  'Wishing you the best year yet 🌸',
  'May every day feel as special as today 🌙',
  'You deserve all the good things ☀️',
  'Cheers to you, the most amazing friend 🥂',
  'May your life be as sweet as your smile 🌼',
  'Always stay as wonderful as you are ✨',
];
let lastQuoteIdx = 0;

function initScene7() {
  // Stars
  const starsLayer = document.getElementById('starsLayer');
  for (let i = 0; i < 90; i++) {
    const star = document.createElement('div');
    star.className = 'star-dot';
    const size = 1 + Math.random() * 3;
    star.style.cssText = `
      width: ${size}px; height: ${size}px;
      left: ${Math.random() * 100}%;
      top:  ${Math.random() * 100}%;
      --dur:   ${2 + Math.random() * 4}s;
      --delay: ${Math.random() * 5}s;
    `;
    starsLayer.appendChild(star);
  }

  // Final content entrance
  gsap.fromTo('.final-content',
    { y: 40, opacity: 0 },
    { y: 0, opacity: 1, duration: 1, ease: 'back.out(1.4)', delay: 0.3 }
  );

  // Show first quote
  showQuote(0);

  document.getElementById('surpriseBtn').addEventListener('click', () => {
    let idx;
    do { idx = Math.floor(Math.random() * QUOTES.length); } while (idx === lastQuoteIdx);
    lastQuoteIdx = idx;
    showQuote(idx);

    // Mini confetti burst
    confetti({
      particleCount: 30,
      spread: 80,
      origin: { y: 0.7 },
      colors: ['#87CEEB', '#f4a7c7', '#FFF9C4', '#c8a7e7'],
    });
  });
}

function showQuote(idx) {
  const el = document.getElementById('quoteText');
  gsap.to(el, { opacity: 0, y: -10, duration: 0.25, onComplete: () => {
    el.textContent = QUOTES[idx];
    gsap.to(el, { opacity: 1, y: 0, duration: 0.35 });
  }});
}

/* ============================================================
   HELPER – Floating petals for scenes 2 & 6
============================================================ */
function spawnFloatingPetals(containerId, count) {
  const c = document.getElementById(containerId);
  if (!c) return;
  c.innerHTML = '';
  const emojis = ['🌸', '🌼', '🌸', '🌺', '✨', '🌼'];
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'fp';
    p.textContent = emojis[i % emojis.length];
    p.style.cssText = `
      left: ${Math.random() * 100}%;
      --fp-dur:   ${6 + Math.random() * 7}s;
      --fp-delay: ${Math.random() * 8}s;
      --fp-dx:    ${(Math.random() - 0.5) * 100}px;
      --fp-op:    ${0.18 + Math.random() * 0.28};
      --fp-size:  ${0.75 + Math.random() * 0.75}rem;
    `;
    c.appendChild(p);
  }
}

/* ============================================================
   SCENE NOTES – three languages typed for Mariam
============================================================ */
const NOTES = [
  { text: 'Doğum günün kutlu olsun Kraliçe', meaning: 'Happy birthday, my Queen' },
  { text: 'Mutlu yıllar Uğurum',             meaning: 'Many happy years, my lucky charm' },
  { text: 'マリアム、誕生日おめでとう！',        meaning: 'Mariam, happy birthday!' },
];

let notesDone = false;

function initNotes() {
  notesDone = false;
  spawnFloatingPetals('floatingPetalsNotes', 12);

  const stack   = document.getElementById('notesStack');
  const cards   = Array.from(stack.querySelectorAll('.note-card'));
  const nextBtn = document.getElementById('notesNext');
  const skip    = document.getElementById('notesSkip');
  const scene   = document.getElementById('scene-notes');

  const timeouts = [];
  const typers   = [];

  // reset state
  cards.forEach(c => {
    c.querySelector('.note-text').textContent = '';
    c.querySelector('.note-text').classList.remove('typing');
    const m = c.querySelector('.note-meaning');
    m.textContent = '';
    m.classList.remove('show');
    gsap.set(c, { opacity: 0, y: 26, scale: 0.97 });
  });
  nextBtn.classList.add('hidden');
  skip.classList.add('hidden');
  setTimeout(() => { if (!notesDone) skip.classList.remove('hidden'); }, 700);

  function revealNextBtn() {
    skip.classList.add('hidden');
    nextBtn.classList.remove('hidden');
    gsap.fromTo(nextBtn,
      { y: 16, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, ease: 'back.out(1.4)' }
    );
  }

  function finishAll() {
    if (notesDone) return;
    notesDone = true;
    timeouts.forEach(clearTimeout);
    typers.forEach(clearInterval);
    cards.forEach((c, idx) => {
      gsap.to(c, { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: 'power2.out' });
      const t = c.querySelector('.note-text');
      const m = c.querySelector('.note-meaning');
      t.classList.remove('typing');
      t.textContent = NOTES[idx].text;
      m.textContent = NOTES[idx].meaning;
      m.classList.add('show');
    });
    revealNextBtn();
  }

  function typeCard(idx, done) {
    const card    = cards[idx];
    const textEl  = card.querySelector('.note-text');
    const meanEl  = card.querySelector('.note-meaning');
    const chars   = Array.from(NOTES[idx].text);
    const speed   = chars.length > 16 ? 55 : 80;
    let i = 0;

    gsap.to(card, { opacity: 1, y: 0, scale: 1, duration: 0.55, ease: 'back.out(1.5)' });
    textEl.classList.add('typing');

    const iv = setInterval(() => {
      if (i < chars.length) {
        textEl.textContent += chars[i++];
      } else {
        clearInterval(iv);
        textEl.classList.remove('typing');
        meanEl.textContent = NOTES[idx].meaning;
        meanEl.classList.add('show');
        timeouts.push(setTimeout(done, 650));
      }
    }, speed);
    typers.push(iv);
  }

  function run(idx) {
    if (notesDone) return;
    if (idx >= cards.length) { revealNextBtn(); return; }
    typeCard(idx, () => run(idx + 1));
  }
  timeouts.push(setTimeout(() => run(0), 450));

  function skipHandler(e) {
    if (e.target.closest('button')) return;
    finishAll();
  }
  scene.addEventListener('click', skipHandler);

  nextBtn.addEventListener('click', () => {
    scene.removeEventListener('click', skipHandler);
    goToScene('scene-notes', 'scene-7', initScene7);
  }, { once: true });
}

/* ============================================================
   GLOBAL – cursor sparkle trail + tap bursts + music box
============================================================ */
(function globalMagic() {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const SPARK_COLORS = ['#87CEEB', '#f4a7c7', '#c8a7e7', '#FFF9C4', '#ffffff'];

  /* ---- Sparkle trail ---- */
  if (!reduce) {
    const canvas = document.getElementById('trailCanvas');
    const ctx = canvas.getContext('2d');
    let parts = [];

    function resize() { canvas.width = innerWidth; canvas.height = innerHeight; }
    resize();
    addEventListener('resize', resize);

    let last = 0;
    function emit(x, y) {
      const now = performance.now();
      if (now - last < 18) return;
      last = now;
      const n = 1 + (Math.random() > 0.6 ? 1 : 0);
      for (let k = 0; k < n; k++) {
        parts.push({
          x, y,
          vx: (Math.random() - 0.5) * 1.1,
          vy: (Math.random() - 0.5) * 1.1 - 0.35,
          life: 1,
          size: 1.8 + Math.random() * 2.8,
          col: SPARK_COLORS[(Math.random() * SPARK_COLORS.length) | 0],
        });
      }
      if (parts.length > 220) parts = parts.slice(-220);
    }
    addEventListener('mousemove', e => emit(e.clientX, e.clientY), { passive: true });
    addEventListener('touchmove', e => {
      const t = e.touches[0]; if (t) emit(t.clientX, t.clientY);
    }, { passive: true });

    (function loop() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = parts.length - 1; i >= 0; i--) {
        const p = parts[i];
        p.x += p.vx; p.y += p.vy; p.life -= 0.022;
        if (p.life <= 0) { parts.splice(i, 1); continue; }
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.col;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      requestAnimationFrame(loop);
    })();
  }

  /* ---- Tap burst of little flowers ---- */
  const TAP_EMOJIS = ['🌼', '🌸', '✨', '💛'];
  function tapBurst(x, y) {
    if (reduce) return;
    for (let i = 0; i < 6; i++) {
      const s = document.createElement('div');
      s.className = 'tap-spark';
      s.textContent = TAP_EMOJIS[i % TAP_EMOJIS.length];
      s.style.left = x + 'px';
      s.style.top = y + 'px';
      s.style.fontSize = (12 + Math.random() * 12) + 'px';
      document.body.appendChild(s);
      gsap.to(s, {
        x: (Math.random() - 0.5) * 150,
        y: (Math.random() - 0.5) * 150 - 30,
        rotation: (Math.random() - 0.5) * 200,
        opacity: 0, scale: 0.3,
        duration: 0.9 + Math.random() * 0.5,
        ease: 'power2.out',
        onComplete: () => s.remove(),
      });
    }
  }
  addEventListener('pointerdown', e => {
    if (e.target.closest('#musicToggle')) return;
    primeAudio();
    tapBurst(e.clientX, e.clientY);
  });

  /* ---- Generative music box ---- */
  let AC = null, master = null, musicTimer = null, musicOn = false;
  const N = { C5:523.25, D5:587.33, E5:659.25, F5:698.46, G5:783.99, A5:880, B5:987.77, C6:1046.5 };
  const MEL = [
    ['E5',1],['G5',1],['C6',1],['B5',0.5],['A5',0.5],['G5',1],
    ['E5',1],['F5',1],['A5',1],['G5',1.5],[null,0.5],
    ['D5',1],['F5',1],['A5',1],['G5',0.5],['F5',0.5],['E5',1],
    ['C5',1],['E5',1],['G5',1],['C5',1.5],[null,0.5],
  ];
  const BEAT = 0.44;

  function primeAudio() {
    if (!AC) {
      try {
        AC = new (window.AudioContext || window.webkitAudioContext)();
        master = AC.createGain();
        master.gain.value = 0;
        master.connect(AC.destination);
      } catch (e) { /* no audio */ }
    }
    if (AC && AC.state === 'suspended') AC.resume();
  }

  function tone(freq, start, dur, vol) {
    const o = AC.createOscillator(), g = AC.createGain(), lp = AC.createBiquadFilter();
    o.type = 'triangle'; o.frequency.value = freq;
    lp.type = 'lowpass'; lp.frequency.value = 2300;
    o.connect(lp); lp.connect(g); g.connect(master);
    g.gain.setValueAtTime(0.0001, start);
    g.gain.linearRampToValueAtTime(vol, start + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0008, start + dur);
    o.start(start); o.stop(start + dur + 0.05);
  }

  function playLoop() {
    if (!musicOn || !AC) return;
    let t = AC.currentTime + 0.06;
    MEL.forEach(([n, b]) => { if (n) tone(N[n], t, b * BEAT * 0.95, 0.42); t += b * BEAT; });
    const total = MEL.reduce((s, [, b]) => s + b, 0) * BEAT;
    musicTimer = setTimeout(playLoop, total * 1000 - 60);
  }

  function toggleMusic() {
    primeAudio();
    if (!AC) return;
    musicOn = !musicOn;
    const btn = document.getElementById('musicToggle');
    if (musicOn) {
      btn.classList.add('on');
      master.gain.cancelScheduledValues(AC.currentTime);
      master.gain.setValueAtTime(master.gain.value, AC.currentTime);
      master.gain.linearRampToValueAtTime(0.16, AC.currentTime + 0.8);
      if (!musicTimer) playLoop();
    } else {
      btn.classList.remove('on');
      master.gain.cancelScheduledValues(AC.currentTime);
      master.gain.linearRampToValueAtTime(0.0, AC.currentTime + 0.4);
      clearTimeout(musicTimer);
      musicTimer = null;
    }
  }

  document.getElementById('musicToggle').addEventListener('click', e => {
    e.stopPropagation();
    toggleMusic();
  });
})();
