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

  const messages = [
  { text: "Doğum günün kutlu olsun Kraliçe 👑", className: "royal-message" },
  { text: "Mutlu yıllar Uğurum ☀️", className: "sun-message" },
  { text: "マリアム、誕生日おめでとう！🌸", className: "japan-message" }
];

let current = 0;
function playMessages(){
  if(current >= messages.length){
    nextBtn.classList.remove('hidden');
    return;
  }
  text.innerHTML = `<span class="${messages[current].className}">${messages[current].text}</span>`;
  gsap.fromTo(text,{opacity:0,y:20},{opacity:1,y:0,duration:1.4});
  current++;
  setTimeout(playMessages,3500);
}
playMessages();

  let i = 0;
  text.textContent = '';
  const interval = setInterval(() => {
    if (i < message.length) {
      text.textContent += message[i++];
    } else {
      clearInterval(interval);
      // Remove cursor, show button
      text.style.cssText += ''; // trigger repaint
      setTimeout(() => {
        nextBtn.classList.remove('hidden');
        gsap.fromTo(nextBtn,
          { y: 16, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, ease: 'back.out(1.4)' }
        );
      }, 400);
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
      { opacity: 0, scale: 0, transformOrigin: '170px 160px' },
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
    goToScene('scene-6', 'scene-7', initScene7);
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
