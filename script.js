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

  setVeil(toId);

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

  SFX.paper();      // #5 paper rustle
  haptic(18);       // #13 haptics

  const tl = gsap.timeline();
  tl
    // gentle lift
    .to(env, { scale: 1.05, duration: 0.32, ease: 'power2.out' })
    // #5 flap opens gradually
    .to('#envFlap', { scaleY: -1, duration: 0.7, ease: 'power2.inOut', transformOrigin: '50% 0%' }, '<0.05')
    .call(() => { SFX.paper(); burstSparkles(wrapper); }, null, '-=0.15')
    // letter lifts out
    .to('.env-label', { y: -26, opacity: 0, duration: 0.4, ease: 'power2.out' }, '-=0.25')
    // zoom up into the surprise
    .to(wrapper, { scale: 1.25, opacity: 0, y: -60, duration: 0.7, ease: 'power3.in' })
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
  tl.timeScale(1.45);

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
  { body: '#4fb3e8', top: '#9ed9f7' },
  { body: '#ef6fa4', top: '#f9b3d0' },
  { body: '#b487dd', top: '#d5b8f0' },
  { body: '#4fb3e8', top: '#9ed9f7' },
  { body: '#ef6fa4', top: '#f9b3d0' },
];
const CANDLE_HEIGHTS = [50, 58, 64, 58, 50];

let candlesLeft = 5;

function initScene4() {
  candlesLeft = 5;
  document.getElementById('candleCount').textContent = candlesLeft;
  const row = document.getElementById('candlesRow');
  row.innerHTML = '';

  // reset the two-stage state (candles -> cap toss)
  const heading = document.querySelector('#scene-4 .wish-text');
  const sub     = document.querySelector('#scene-4 .wish-sub');
  const counter = document.querySelector('#scene-4 .candle-counter');
  const stage   = document.getElementById('capTossStage');
  if (heading) heading.textContent = 'Blow Out the Candles ✨';
  if (sub)     sub.textContent = 'Tap each candle to blow it out';
  if (counter) counter.style.display = '';
  if (stage)   stage.classList.add('hidden');
  gsap.set(row, { opacity: 1, y: 0 });

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
    haptic(20);
    candlesLeft--;
    document.getElementById('candleCount').textContent = candlesLeft;
    if (candlesLeft === 0) setTimeout(revealCapToss, 650);
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
let capBobTween = null;
function revealCapToss() {
  const heading = document.querySelector('#scene-4 .wish-text');
  const sub     = document.querySelector('#scene-4 .wish-sub');
  const counter = document.querySelector('#scene-4 .candle-counter');
  const stage   = document.getElementById('capTossStage');
  const cap     = document.getElementById('tossCap');

  if (heading) heading.textContent = 'Now toss your cap! 🎓';
  if (sub)     sub.textContent = 'Tap the cap to celebrate';
  if (counter) counter.style.display = 'none';

  gsap.to('#candlesRow', { opacity: 0.35, y: 6, duration: 0.4 });

  stage.classList.remove('hidden');
  gsap.fromTo(cap,
    { scale: 0, y: 20, opacity: 0, rotation: -18 },
    { scale: 1, y: 0, opacity: 1, rotation: 0, duration: 0.6, ease: 'back.out(1.7)',
      onComplete: () => {
        capBobTween = gsap.to(cap, { y: -8, duration: 1.1, repeat: -1, yoyo: true, ease: 'sine.inOut' });
      }
    }
  );
  cap.addEventListener('click', tossCap, { once: true });
}

function tossCap() {
  const cap = document.getElementById('tossCap');
  if (capBobTween) capBobTween.kill();
  haptic([15, 40, 15]);

  const rect = cap.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;

  gsap.to(cap, { y: -window.innerHeight * 0.6, rotation: 420, scale: 0.7, opacity: 0, duration: 1.1, ease: 'power2.in' });

  for (let i = 0; i < 7; i++) {
    const fc = document.createElement('div');
    fc.className = 'flying-cap';
    fc.textContent = '🎓';
    fc.style.left = cx + 'px';
    fc.style.top = cy + 'px';
    document.body.appendChild(fc);
    gsap.to(fc, {
      x: (Math.random() - 0.5) * 280,
      y: -(150 + Math.random() * 280),
      rotation: (Math.random() - 0.5) * 560,
      opacity: 0,
      duration: 1 + Math.random() * 0.6,
      ease: 'power2.out',
      onComplete: () => fc.remove(),
    });
  }

  confetti({
    particleCount: 60, spread: 100, startVelocity: 45, origin: { y: 0.6 },
    colors: ['#c9a24b', '#e7cd8a', '#4fb3e8', '#ef6fa4', '#b487dd', '#ffffff'],
  });

  setTimeout(triggerCelebration, 900);
}

function triggerCelebration() {
  goToScene('scene-4', 'scene-5', () => {
    startCelebration();
    setTimeout(() => goToScene('scene-5', 'scene-6', initScene6), 4200);
  });
}

function startCelebration() {
  // Canvas confetti
  const end = Date.now() + 3500;
  const colors = ['#4fb3e8', '#ef6fa4', '#b487dd', '#f2c14e', '#ffffff', '#f9b3d0'];

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

  // #1 rising balloons
  const balloonBox = document.getElementById('balloons');
  if (balloonBox && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    balloonBox.innerHTML = '';
    const cols = ['#ef6fa4', '#4fb3e8', '#b487dd', '#f2c14e', '#f9b3d0', '#5ecfa0'];
    for (let i = 0; i < 8; i++) {
      const bl = document.createElement('div');
      bl.className = 'balloon';
      bl.style.setProperty('--c', cols[i % cols.length]);
      bl.style.left = (5 + Math.random() * 88) + '%';
      balloonBox.appendChild(bl);
      const sc = 0.7 + Math.random() * 0.6;
      gsap.set(bl, { scale: sc });
      gsap.to(bl, {
        y: -(window.innerHeight + 240),
        x: (Math.random() - 0.5) * 80,
        rotation: (Math.random() - 0.5) * 16,
        duration: 4.6 + Math.random() * 2.2,
        ease: 'power1.out',
        delay: 0.15 + i * 0.22,
        onComplete: () => bl.remove(),
      });
    }
  }
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
    goToScene('scene-6', 'scene-photos', initPhotos);
  }, { once: true });
}

/* ============================================================
   SCENE 7 – FINAL
============================================================ */
const QUOTES = [
  'Keep smiling and shining ✨',
  'So proud of the engineer you are now 🎓',
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

let mariamWish = '';
let wishLaunched = false;

/* ============================================================
   #9 SCENE WISH – write a wish, send it to the stars
============================================================ */
function initWish() {
  wishLaunched = false;
  const layer = document.getElementById('wishStars');
  layer.innerHTML = '';
  for (let i = 0; i < 70; i++) {
    const s = document.createElement('div');
    s.className = 'star-dot';
    const sz = 1 + Math.random() * 2.4;
    s.style.cssText =
      'width:' + sz + 'px;height:' + sz + 'px;left:' + (Math.random() * 100) +
      '%;top:' + (Math.random() * 100) + '%;--dur:' + (2 + Math.random() * 4) +
      's;--delay:' + (Math.random() * 5) + 's;';
    layer.appendChild(s);
  }
  gsap.fromTo('.wish-content',
    { y: 40, opacity: 0 },
    { y: 0, opacity: 1, duration: 1, ease: 'back.out(1.4)', delay: 0.2 });

  const input = document.getElementById('wishInput');
  const send  = document.getElementById('wishSend');
  const skip  = document.getElementById('wishSkip');
  setTimeout(() => { try { input.focus(); } catch (e) {} }, 700);

  function launch(text) {
    if (wishLaunched) return;
    wishLaunched = true;
    haptic(20);
    mariamWish = (text || '').trim();

    if (mariamWish) {
      const fly = document.createElement('div');
      fly.className = 'wish-fly';
      fly.textContent = '\u201c' + mariamWish + '\u201d';
      const r = input.getBoundingClientRect();
      fly.style.left = '50%';
      fly.style.top = r.top + 'px';
      fly.style.transform = 'translateX(-50%)';
      document.body.appendChild(fly);
      gsap.to(fly, {
        y: -window.innerHeight * 0.5, opacity: 0, scale: 0.8,
        duration: 1.6, ease: 'power1.in', onComplete: () => fly.remove(),
      });
    }
    confetti({ particleCount: 24, spread: 70, startVelocity: 30,
      origin: { y: 0.55 }, colors: ['#fff8e7', '#f2c14e', '#b487dd', '#4fb3e8'] });

    setTimeout(() => goToScene('scene-wish', 'scene-7', initScene7), mariamWish ? 750 : 200);
  }

  send.addEventListener('click', () => launch(input.value), { once: true });
  skip.addEventListener('click', () => launch(''), { once: true });
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); launch(input.value); }
  });
}

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

  // #9 reveal the wish among the stars
  const echoWrap = document.getElementById('wishEchoWrap');
  const echo = document.getElementById('wishEcho');
  const ss = document.getElementById('shootingStar');
  if (mariamWish) {
    echo.textContent = '\u201c' + mariamWish + '\u201d';
    echoWrap.classList.remove('hidden');
    gsap.fromTo(echoWrap, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 1, delay: 1.5 });
    if (ss) {
      gsap.set(ss, { opacity: 0, x: 0, y: 0 });
      gsap.timeline({ delay: 0.7 })
        .set(ss, { opacity: 1 })
        .fromTo(ss, { x: -80, y: -50 },
          { x: window.innerWidth * 0.72, y: window.innerHeight * 0.22, duration: 1.1, ease: 'power1.in' })
        .to(ss, { opacity: 0, duration: 0.3 }, '-=0.28');
    }
  } else if (echoWrap) {
    echoWrap.classList.add('hidden');
  }

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
      colors: ['#4fb3e8', '#ef6fa4', '#f2c14e', '#b487dd'],
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
   SCENE PHOTOS – graduation polaroids
============================================================ */
function initPhotos() {
  const stack = document.getElementById('polaroidStack');
  const cards = Array.from(stack.querySelectorAll('.flip-card'));
  const nextBtn = document.getElementById('photosNext');

  nextBtn.addEventListener('click', () => {
    goToScene('scene-photos', 'scene-notes', initNotes);
  }, { once: true });

  cards.forEach((c, i) => {
    // photo availability -> fallback art if missing
    const mini = c.querySelector('.polaroid-mini');
    const img = mini.querySelector('img');
    const probe = new Image();
    probe.onerror = () => mini.classList.add('noimg');
    probe.src = img.getAttribute('src');

    // flip on tap (toggle back and forth)
    if (!c.dataset.wired) {
      c.dataset.wired = '1';
      c.addEventListener('click', () => {
        haptic(12);
        c.classList.toggle('flipped');
      });
    }

    // entrance
    gsap.fromTo(c,
      { opacity: 0, y: 30, scale: 0.88 },
      { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'back.out(1.6)', delay: 0.15 + i * 0.18 }
    );
  });

  setTimeout(() => {
    nextBtn.classList.remove('hidden');
    gsap.fromTo(nextBtn, { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'back.out(1.4)' });
  }, 1100);
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
  spawnFloatingPetals('floatingPetalsNotes', 12);

  const row       = document.getElementById('giftRow');
  const reveal    = document.getElementById('giftReveal');
  const nextBtn   = document.getElementById('notesNext');
  const subtitle  = document.getElementById('notesSubtitle');
  const openedGifts = new Set();
  const culturalLayer = document.getElementById('culturalLayer');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let sakuraTimer = null;

  const NAZAR_SVG =
    '<svg class="nazar-charm" viewBox="0 0 40 62" xmlns="http://www.w3.org/2000/svg">' +
      '<g class="nazar-swing">' +
        '<line x1="20" y1="2" x2="20" y2="18" stroke="#c9a24b" stroke-width="1.6"/>' +
        '<circle cx="20" cy="34" r="14" fill="#1f6fb2"/>' +
        '<circle cx="20" cy="34" r="10" fill="#8fd0f0"/>' +
        '<circle cx="20" cy="34" r="6"  fill="#ffffff"/>' +
        '<circle cx="20" cy="34" r="3"  fill="#0d2a44"/>' +
        '<circle cx="16" cy="30" r="1.6" fill="#ffffff" opacity="0.85"/>' +
      '</g>' +
    '</svg>';

  function stopSakura() {
    if (sakuraTimer) { clearInterval(sakuraTimer); sakuraTimer = null; }
  }
  function startSakura() {
    stopSakura();
    if (reduceMotion || !culturalLayer) return;
    sakuraTimer = setInterval(() => {
      const petal = document.createElement('div');
      petal.className = 'sakura';
      const size = 8 + Math.random() * 10;
      petal.style.left = Math.random() * 100 + '%';
      petal.style.width = size + 'px';
      petal.style.height = size + 'px';
      petal.style.opacity = (0.5 + Math.random() * 0.4).toFixed(2);
      culturalLayer.appendChild(petal);
      const fall = (culturalLayer.clientHeight || window.innerHeight) + 50;
      gsap.to(petal, {
        y: fall, x: (Math.random() - 0.5) * 130,
        rotation: (Math.random() - 0.5) * 360,
        duration: 4 + Math.random() * 3, ease: 'none',
        onComplete: () => petal.remove(),
      });
    }, 240);
  }

  const NOTE_META = [
    { lang: 'Türkçe&nbsp;🇹🇷', cls: 'note-tr-text', lng: 'tr', theme: 'nazar' },
    { lang: 'Türkçe&nbsp;🇹🇷', cls: 'note-tr-text', lng: 'tr', theme: 'nazar' },
    { lang: '日本語&nbsp;🇯🇵',  cls: 'note-jp-text', lng: 'ja', theme: 'sakura' },
  ];
  const GIFT_COLORS = [
    { body: '#ef6fa4', dark: '#d94f8b' },
    { body: '#4fb3e8', dark: '#2f97d4' },
    { body: '#b487dd', dark: '#9a66cc' },
  ];
  function giftSVG(c) {
    return `<svg viewBox="0 0 100 104" xmlns="http://www.w3.org/2000/svg">
      <rect class="gift-body" x="16" y="46" width="68" height="50" rx="7" fill="${c.body}"/>
      <rect x="43" y="46" width="14" height="50" fill="#e7cd8a"/>
      <rect x="43" y="46" width="14" height="50" fill="#c9a24b" opacity="0.22"/>
      <g class="gift-lid">
        <rect x="10" y="32" width="80" height="20" rx="6" fill="${c.dark}"/>
        <rect x="43" y="32" width="14" height="20" fill="#e7cd8a"/>
        <ellipse cx="42" cy="26" rx="9" ry="6" fill="#efd9a0" transform="rotate(-18 42 26)"/>
        <ellipse cx="58" cy="26" rx="9" ry="6" fill="#efd9a0" transform="rotate(18 58 26)"/>
        <circle cx="50" cy="30" r="4.5" fill="#d9b45c"/>
      </g>
    </svg>`;
  }

  // reset
  reveal.classList.add('hidden');
  reveal.innerHTML = '';
  nextBtn.classList.add('hidden');
  row.style.display = '';
  row.innerHTML = '';
  if (subtitle) subtitle.style.visibility = '';

  GIFT_COLORS.forEach((c, i) => {
    const b = document.createElement('button');
    b.className = 'gift-box';
    b.dataset.i = i;
    b.innerHTML = giftSVG(c);
    b.addEventListener('click', () => openGift(i));
    row.appendChild(b);
    gsap.fromTo(b,
      { y: 24, opacity: 0, scale: 0.9 },
      { y: 0, opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.7)', delay: i * 0.12 }
    );
  });

  function revealNext() {
    if (!nextBtn.classList.contains('hidden')) return;
    nextBtn.classList.remove('hidden');
    gsap.fromTo(nextBtn,
      { y: 16, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, ease: 'back.out(1.4)' }
    );
  }

  function openGift(i) {
    const box = row.querySelector('.gift-box[data-i="' + i + '"]');
    if (!openedGifts.has(i)) {
      const lid = box.querySelector('.gift-lid');
      gsap.to(lid, { y: -18, rotation: -12, opacity: 0, duration: 0.4, ease: 'power2.out' });
      gsap.to(box, { scale: 1.06, duration: 0.18, yoyo: true, repeat: 1 });
      confetti({
        particleCount: 28, spread: 72, startVelocity: 26,
        origin: { y: 0.55 },
        colors: ['#4fb3e8', '#ef6fa4', '#b487dd', '#f2c14e', '#e7cd8a'],
      });
      haptic(30);
      box.classList.add('opened');
      openedGifts.add(i);
      setTimeout(() => showNote(i), 280);
    } else {
      showNote(i);
    }
  }

  function showNote(i) {
    const meta = NOTE_META[i];
    reveal.innerHTML =
      '<div class="note-card open-note">' +
        '<span class="note-lang">' + meta.lang + '</span>' +
        '<p class="note-text ' + meta.cls + '" lang="' + meta.lng + '"></p>' +
        '<p class="note-meaning"></p>' +
      '</div>' +
      '<button class="reveal-close" id="revealClose">↩ back to the boxes</button>';

    reveal.classList.remove('hidden');
    gsap.fromTo(reveal, { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, ease: 'power2.out' });
    row.style.display = 'none';
    if (subtitle) subtitle.style.visibility = 'hidden';

    // #8 cultural touch per language
    const card = reveal.querySelector('.note-card');
    stopSakura();
    if (culturalLayer) culturalLayer.innerHTML = '';
    if (meta.theme === 'nazar' && card) {
      card.insertAdjacentHTML('beforeend', NAZAR_SVG);
    } else if (meta.theme === 'sakura') {
      startSakura();
      if (card && 'speechSynthesis' in window) {
        const sb = document.createElement('button');
        sb.className = 'note-speak';
        sb.innerHTML = '🔊 hear it';
        sb.addEventListener('click', () => speak(NOTES[i].text, 'ja-JP', sb));
        card.appendChild(sb);
      }
    }

    const textEl = reveal.querySelector('.note-text');
    const meanEl = reveal.querySelector('.note-meaning');
    const chars  = Array.from(NOTES[i].text);
    const speed  = chars.length > 16 ? 55 : 80;
    let k = 0;
    textEl.classList.add('typing');
    const iv = setInterval(() => {
      if (k < chars.length) {
        textEl.textContent += chars[k++];
      } else {
        clearInterval(iv);
        textEl.classList.remove('typing');
        meanEl.textContent = NOTES[i].meaning;
        meanEl.classList.add('show');
        if (openedGifts.size >= 3) revealNext();
      }
    }, speed);

    reveal.querySelector('#revealClose').addEventListener('click', () => {
      clearInterval(iv);
      gsap.to(reveal, { opacity: 0, duration: 0.25, onComplete: () => {
        stopSakura();
        if (culturalLayer) culturalLayer.innerHTML = '';
        reveal.classList.add('hidden');
        reveal.innerHTML = '';
        row.style.display = '';
        if (subtitle) subtitle.style.visibility = '';
        if (openedGifts.size >= 3) revealNext();
      }});
    });
  }

  nextBtn.addEventListener('click', () => {
    stopSakura();
    if (culturalLayer) culturalLayer.innerHTML = '';
    goToScene('scene-notes', 'scene-wish', initWish);
  }, { once: true });
}

/* ============================================================
   GLOBAL – cursor sparkle trail + tap bursts + music box
============================================================ */
(function globalMagic() {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const SPARK_COLORS = ['#4fb3e8', '#ef6fa4', '#b487dd', '#f2c14e', '#ffffff'];

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


/* ============================================================
   SCENE PASS – passcode lock (code: 2307)
============================================================ */
function initPass() {
  const CODE = '2307';
  let entered = '';
  const dots  = document.getElementById('passDots');
  const cells = Array.from(document.querySelectorAll('#passDots .pass-cell'));
  const pad   = document.getElementById('keypad');
  if (!pad) return;

  function render() {
    cells.forEach((c, i) => {
      c.textContent = entered[i] || '';
      c.classList.toggle('filled', !!entered[i]);
      c.classList.remove('ok');
    });
  }
  function success() {
    cells.forEach(c => { c.classList.remove('filled'); c.classList.add('ok'); });
    haptic([12, 30, 12]);
    confetti({ particleCount: 40, spread: 70, origin: { y: 0.5 },
      colors: ['#4fb3e8', '#ef6fa4', '#b487dd', '#f2c14e'] });
    setTimeout(() => goToScene('scene-pass', 'scene-song', initSong), 500);
  }
  function fail() {
    dots.classList.add('shake');
    setTimeout(() => {
      dots.classList.remove('shake');
      entered = '';
      render();
    }, 440);
  }

  pad.addEventListener('click', (e) => {
    const btn = e.target.closest('.key');
    if (!btn || btn.classList.contains('key-blank')) return;
    const k = btn.dataset.key;
    if (k === 'del') { entered = entered.slice(0, -1); render(); return; }
    if (!/^[0-9]$/.test(k)) return;
    if (entered.length >= 4) return;
    entered += k;
    render();
    if (entered.length === 4) {
      if (entered === CODE) success();
      else setTimeout(fail, 180);
    }
  });

  // physical keyboard support
  window.addEventListener('keydown', (e) => {
    const sp = document.getElementById('scene-pass');
    if (!sp || !sp.classList.contains('active')) return;
    if (e.key === 'Backspace') { entered = entered.slice(0, -1); render(); }
    else if (/^[0-9]$/.test(e.key) && entered.length < 4) {
      entered += e.key; render();
      if (entered.length === 4) { if (entered === CODE) success(); else setTimeout(fail, 180); }
    }
  });

  render();
}
initPass();



/* ============================================================
   SCENE SONG – vinyl: double tap to play, keeps playing in background
============================================================ */
function initSong() {
  const stage = document.getElementById('vinylStage');
  const audio = document.getElementById('songAudio');
  const hint  = document.getElementById('songHint');
  const next  = document.getElementById('songNext');
  if (!stage || stage.dataset.wired) {
    // already wired (revisits) — nothing to reset, music keeps playing
  } else {
    stage.dataset.wired = '1';
    let lastTap = 0;
    let playing = false;

    function setUI() {
      stage.classList.toggle('playing', playing);
      hint.innerHTML = playing
        ? 'playing… 🎶 double&nbsp;tap to pause'
        : 'double&nbsp;tap the disc to play&nbsp;✨';
    }

    function stopMusicBoxIfOn() {
      const btn = document.getElementById('musicToggle');
      if (btn && btn.classList.contains('on')) btn.click(); // avoid two musics at once
    }

    function togglePlay() {
      haptic(15);
      if (!playing) {
        stopMusicBoxIfOn();
        audio.play().then(() => {
          playing = true; setUI();
        }).catch(() => {
          // song.mp3 not uploaded yet -> fall back to the music box so the moment still works
          const btn = document.getElementById('musicToggle');
          if (btn && !btn.classList.contains('on')) btn.click();
          playing = true; setUI();
        });
      } else {
        playing = false; setUI();
        if (!audio.paused) audio.pause();
        const btn = document.getElementById('musicToggle');
        if (btn && btn.classList.contains('on')) btn.click();
      }
    }

    stage.addEventListener('pointerdown', (e) => {
      const now = performance.now();
      if (now - lastTap < 380) { togglePlay(); lastTap = 0; }
      else lastTap = now;
    });
    stage.addEventListener('dblclick', (e) => e.preventDefault());

    next.addEventListener('click', () => {
      goToScene('scene-song', 'scene-1'); // music keeps playing in the background
    }, { once: true });
  }
}

/* ============================================================
   HELPERS – haptics, speech, paper SFX, night veil, time context
============================================================ */
function haptic(pattern) {
  if (navigator.vibrate) { try { navigator.vibrate(pattern); } catch (e) {} }
}

function speak(text, lang, btn) {
  if (!('speechSynthesis' in window)) return;
  try {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang; u.rate = 0.9; u.pitch = 1.05;
    const voices = window.speechSynthesis.getVoices() || [];
    const pref = lang.slice(0, 2).toLowerCase();
    const v = voices.find(x => x.lang && x.lang.toLowerCase().replace('_', '-').startsWith(pref));
    if (v) u.voice = v;
    if (btn) {
      btn.classList.add('speaking');
      u.onend = () => btn.classList.remove('speaking');
      u.onerror = () => btn.classList.remove('speaking');
    }
    window.speechSynthesis.speak(u);
  } catch (e) {}
}

/* #5 generative paper-rustle SFX (no audio files) */
const SFX = (function () {
  let ac = null;
  function ctx() {
    if (!ac) { try { ac = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { return null; } }
    if (ac && ac.state === 'suspended') ac.resume();
    return ac;
  }
  function noise(dur, freq, q, vol) {
    const c = ctx(); if (!c) return;
    const n = Math.max(1, Math.floor(c.sampleRate * dur));
    const buf = c.createBuffer(1, n, c.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / n);
    const src = c.createBufferSource(); src.buffer = buf;
    const bp = c.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = freq; bp.Q.value = q;
    const g = c.createGain(); g.gain.value = vol;
    src.connect(bp); bp.connect(g); g.connect(c.destination);
    src.start();
  }
  return {
    paper() { noise(0.18, 1800, 0.7, 0.16); setTimeout(() => noise(0.13, 2600, 0.9, 0.10), 110); },
  };
})();

/* #6 gradual day -> night veil per scene */
const SCENE_VEIL = {
  'scene-pass': 0, 'scene-song': 0, 'scene-1': 0, 'scene-2': 0.05, 'scene-3': 0.09,
  'scene-4': 0.13, 'scene-5': 0.10, 'scene-6': 0.18, 'scene-photos': 0.18, 'scene-notes': 0.22,
  'scene-wish': 0, 'scene-7': 0,
};
let nightBoost = 0;
function setVeil(id) {
  const v = document.getElementById('nightVeil'); if (!v) return;
  let o = SCENE_VEIL[id] || 0;
  if (id !== 'scene-wish' && id !== 'scene-7' && id !== 'scene-pass' && id !== 'scene-song') o += nightBoost;
  gsap.to(v, { opacity: Math.min(o, 0.5), duration: 0.9, ease: 'power2.inOut' });
}

/* #1 + #2 name / days-to-go / night-aware lock screen */
function initTimeContext() {
  const now = new Date();
  const M = now.getMonth(), D = now.getDate();
  const isBirthday = (M === 6 && D === 23);            // 23 July
  const today0 = new Date(now.getFullYear(), M, D);
  let target = new Date(now.getFullYear(), 6, 23);
  if (today0 > target) target = new Date(now.getFullYear() + 1, 6, 23);
  const days = Math.round((target - today0) / 86400000);

  const badge = document.getElementById('passBadge');
  if (badge) {
    badge.textContent = isBirthday
      ? '🎂 It\u2019s finally today!'
      : ('🌙 ' + days + ' day' + (days === 1 ? '' : 's') + ' to go');
  }

  const hr = now.getHours();
  const isNight = (hr >= 19 || hr < 6);
  if (isNight) {
    nightBoost = 0.16;
    document.body.classList.add('is-night');
    const ps = document.getElementById('passStars');
    if (ps) {
      for (let i = 0; i < 52; i++) {
        const s = document.createElement('div');
        s.className = 'star-dot';
        const sz = 1 + Math.random() * 2.2;
        s.style.cssText =
          'width:' + sz + 'px;height:' + sz + 'px;left:' + (Math.random() * 100) +
          '%;top:' + (Math.random() * 100) + '%;--dur:' + (2 + Math.random() * 4) +
          's;--delay:' + (Math.random() * 5) + 's;';
        ps.appendChild(s);
      }
    }
  }
  setVeil('scene-pass');
}
initTimeContext();

/* ============================================================
   #3 BOOT GATE – fade in once fonts are ready (no font flash)
============================================================ */
(function bootGate() {
  const gate = document.getElementById('bootGate');
  if (!gate) return;
  let done = false;
  function hide() {
    if (done) return;
    done = true;
    gate.classList.add('gone');
    setTimeout(() => { gate.style.display = 'none'; }, 650);
  }
  const fontsReady = (document.fonts && document.fonts.ready) ? document.fonts.ready : Promise.resolve();
  Promise.race([fontsReady, new Promise(r => setTimeout(r, 1600))]).then(() => setTimeout(hide, 120));
  setTimeout(hide, 2800); // absolute fallback
})();
