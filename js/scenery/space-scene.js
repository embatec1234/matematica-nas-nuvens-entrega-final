/* ---------- CENÁRIO ESPACIAL (Desafio Bônus) ---------- */
function rocketSVG(){
  const u = uid('rk');
  return `
<svg class="art-svg" viewBox="0 0 220 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <defs>
    <linearGradient id="${u}-b" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#C9D3F5"/>
    </linearGradient>
  </defs>
  <g class="rocket-flame">
    <path d="M44 50 L2 32 Q17 50 2 68 Z" fill="#FF8A00"/>
    <path d="M44 50 L20 40 Q29 50 20 60 Z" fill="#FFE66D"/>
  </g>
  <path d="M84 30 L46 5 L46 38 Z" fill="#E24B4B" stroke="#233256" stroke-width="2.5" stroke-linejoin="round"/>
  <path d="M84 70 L46 95 L46 62 Z" fill="#E24B4B" stroke="#233256" stroke-width="2.5" stroke-linejoin="round"/>
  <path d="M44 28 H128 Q184 28 206 50 Q184 72 128 72 H44 Q34 50 44 28 Z" fill="url(#${u}-b)"/>
  <path d="M150 29 Q188 33 206 50 Q188 67 150 71 Q166 50 150 29 Z" fill="#E24B4B"/>
  <rect x="62" y="28" width="9" height="44" fill="#E24B4B" opacity=".9"/>
  <path d="M44 28 H128 Q184 28 206 50 Q184 72 128 72 H44 Q34 50 44 28 Z" fill="none" stroke="#233256" stroke-width="3" stroke-linejoin="round"/>
  <circle cx="108" cy="50" r="14" fill="#7FD1FF" stroke="#233256" stroke-width="3"/>
  <circle cx="103" cy="45" r="4.5" fill="#FFFFFF" opacity=".85"/>
</svg>`;
}
function ringedPlanetSVG(){
  const u = uid('pr');
  return `
<svg class="art-svg" viewBox="0 0 220 140" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <defs>
    <radialGradient id="${u}-g" cx=".33" cy=".28" r=".95">
      <stop offset="0" stop-color="#FFD9A0"/><stop offset=".6" stop-color="#F2994A"/><stop offset="1" stop-color="#A85A1B"/>
    </radialGradient>
    <linearGradient id="${u}-r" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#FFE9B8"/><stop offset="1" stop-color="#C98A4B"/>
    </linearGradient>
    <clipPath id="${u}-c"><circle cx="110" cy="70" r="42"/></clipPath>
  </defs>
  <g transform="rotate(-16 110 70)">
    <ellipse cx="110" cy="70" rx="100" ry="22" fill="none" stroke="url(#${u}-r)" stroke-width="9"/>
    <circle cx="110" cy="70" r="42" fill="url(#${u}-g)"/>
    <g clip-path="url(#${u}-c)" opacity=".35">
      <rect x="60" y="48" width="100" height="7" fill="#8A4A14"/>
      <rect x="60" y="66" width="100" height="9" fill="#8A4A14"/>
      <rect x="60" y="86" width="100" height="6" fill="#8A4A14"/>
    </g>
    <path d="M10 70 A100 22 0 0 0 210 70" fill="none" stroke="url(#${u}-r)" stroke-width="9"/>
  </g>
</svg>`;
}
function earthSVG(){
  const u = uid('pe');
  return `
<svg class="art-svg" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <defs>
    <radialGradient id="${u}-g" cx=".32" cy=".28" r=".95">
      <stop offset="0" stop-color="#8FDDFF"/><stop offset=".65" stop-color="#2F86DE"/><stop offset="1" stop-color="#1B4F9C"/>
    </radialGradient>
    <clipPath id="${u}-c"><circle cx="60" cy="60" r="54"/></clipPath>
  </defs>
  <circle cx="60" cy="60" r="54" fill="url(#${u}-g)"/>
  <g clip-path="url(#${u}-c)">
    <path d="M22 40 Q36 24 58 34 Q64 50 48 58 Q34 66 24 54 Z" fill="#4CC36B"/>
    <path d="M70 66 Q90 56 98 74 Q92 96 72 92 Q62 80 70 66 Z" fill="#4CC36B"/>
    <ellipse cx="78" cy="30" rx="20" ry="6" fill="#FFFFFF" opacity=".65"/>
    <ellipse cx="38" cy="86" rx="18" ry="5" fill="#FFFFFF" opacity=".55"/>
  </g>
</svg>`;
}
function marsSVG(){
  const u = uid('pm');
  return `
<svg class="art-svg" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <defs>
    <radialGradient id="${u}-g" cx=".32" cy=".28" r=".95">
      <stop offset="0" stop-color="#FFAA8A"/><stop offset=".6" stop-color="#E5603F"/><stop offset="1" stop-color="#9C2F1D"/>
    </radialGradient>
  </defs>
  <circle cx="60" cy="60" r="54" fill="url(#${u}-g)"/>
  <circle cx="40" cy="44" r="9" fill="#B8412A" opacity=".6"/>
  <circle cx="78" cy="70" r="12" fill="#B8412A" opacity=".55"/>
  <circle cx="52" cy="84" r="6" fill="#B8412A" opacity=".6"/>
  <circle cx="84" cy="36" r="5" fill="#B8412A" opacity=".6"/>
</svg>`;
}
function gasGiantSVG(){
  const u = uid('pg');
  return `
<svg class="art-svg" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <defs>
    <radialGradient id="${u}-g" cx=".32" cy=".28" r=".95">
      <stop offset="0" stop-color="#D9C8FF"/><stop offset=".6" stop-color="#8C6FF7"/><stop offset="1" stop-color="#4B2FAE"/>
    </radialGradient>
    <clipPath id="${u}-c"><circle cx="60" cy="60" r="54"/></clipPath>
  </defs>
  <circle cx="60" cy="60" r="54" fill="url(#${u}-g)"/>
  <g clip-path="url(#${u}-c)">
    <rect x="0" y="30" width="120" height="9" fill="#FF9FD2" opacity=".55"/>
    <rect x="0" y="52" width="120" height="12" fill="#FFFFFF" opacity=".28"/>
    <rect x="0" y="76" width="120" height="8" fill="#FF9FD2" opacity=".5"/>
    <ellipse cx="80" cy="58" rx="11" ry="6" fill="#FF6F8E" opacity=".75"/>
  </g>
</svg>`;
}
function moonSVG(){
  return `
<svg class="art-svg" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <circle cx="60" cy="60" r="54" fill="#E8EAF2"/>
  <circle cx="60" cy="60" r="54" fill="none" stroke="#B9BED3" stroke-width="3"/>
  <circle cx="42" cy="46" r="10" fill="#C9CDE0"/>
  <circle cx="80" cy="64" r="13" fill="#C9CDE0"/>
  <circle cx="54" cy="86" r="7" fill="#C9CDE0"/>
  <circle cx="84" cy="34" r="5" fill="#C9CDE0"/>
</svg>`;
}
function ufoSVG(){
  const u = uid('uf');
  return `
<svg class="art-svg" viewBox="0 0 180 110" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <defs>
    <linearGradient id="${u}-s" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#D7DCEF"/><stop offset="1" stop-color="#8A93B8"/>
    </linearGradient>
  </defs>
  <ellipse cx="90" cy="64" rx="80" ry="20" fill="url(#${u}-s)" stroke="#233256" stroke-width="3"/>
  <circle cx="90" cy="38" r="12" fill="#6BE29B" stroke="#233256" stroke-width="2.5"/>
  <circle cx="85" cy="36" r="2.6" fill="#233256"/><circle cx="95" cy="36" r="2.6" fill="#233256"/>
  <path d="M60 52 Q60 12 90 12 Q120 12 120 52 Z" fill="#BFEFFF" fill-opacity=".55" stroke="#233256" stroke-width="3" stroke-linejoin="round"/>
  <circle class="ufo-light" cx="38" cy="68" r="5" fill="#FF6F6F"/>
  <circle class="ufo-light" style="animation-delay:-.3s" cx="64" cy="73" r="5" fill="#FFD93D"/>
  <circle class="ufo-light" style="animation-delay:-.6s" cx="90" cy="75" r="5" fill="#3FCE8E"/>
  <circle class="ufo-light" style="animation-delay:-.9s" cx="116" cy="73" r="5" fill="#FFD93D"/>
  <circle class="ufo-light" style="animation-delay:-1.2s" cx="142" cy="68" r="5" fill="#FF6F6F"/>
</svg>`;
}

function paintSpace(layer){
  /* estrelinhas cintilantes ao fundo */
  for(let i=0;i<70;i++){
    const d = document.createElement('div');
    d.className = 'space-dot';
    const sz = 1 + Math.random()*2.6;
    d.style.width = d.style.height = sz.toFixed(1)+'px';
    d.style.top = (Math.random()*100).toFixed(1)+'%';
    d.style.left = (Math.random()*100).toFixed(1)+'%';
    d.style.animationDuration = (1.8 + Math.random()*3.4).toFixed(1)+'s';
    d.style.animationDelay = '-'+(Math.random()*5).toFixed(1)+'s';
    layer.appendChild(d);
  }
  /* estrelas maiores atravessando a tela (já existiam) */
  for(let i=0;i<14;i++){
    const star = document.createElement('div');
    star.className='space-star';
    star.style.top = rand(2,98)+'%';
    star.style.left = rand(0,100)+'%';
    star.style.animationDelay = `-${rand(0,5)}s`;
    star.style.animationDuration = `${rand(9,18)}s`;
    star.textContent = i % 3 === 0 ? '★' : '✦';
    layer.appendChild(star);
  }
  /* estrelas cadentes */
  for(let i=0;i<3;i++){
    const sh = document.createElement('div');
    sh.className = 'shooting-star';
    sh.style.top = rand(4,40)+'%';
    sh.style.left = rand(35,95)+'%';
    sh.style.animationDuration = rand(6,10)+'s';
    sh.style.animationDelay = '-'+rand(0,9)+'s';
    layer.appendChild(sh);
  }
  /* planetas flutuando nas laterais */
  const planets = [
    {svg:ringedPlanetSVG, left:'1%',  top:'8%',  w:'clamp(120px,17vw,230px)', dur:12, ar:'220/140'},
    {svg:gasGiantSVG,     right:'7%', top:'7%',  w:'clamp(70px,10vw,150px)',  dur:13},
    {svg:earthSVG,        right:'4%', top:'58%', w:'clamp(64px,9vw,130px)',   dur:9},
    {svg:marsSVG,         left:'6%',  top:'66%', w:'clamp(44px,6.5vw,92px)',  dur:10},
    {svg:moonSVG,         left:'42%', top:'84%', w:'clamp(28px,4vw,56px)',    dur:8}
  ];
  planets.forEach(pl=>{
    const el = document.createElement('div');
    el.className = 'space-planet';
    el.innerHTML = pl.svg();
    if(pl.left) el.style.left = pl.left; else el.style.right = pl.right;
    el.style.top = pl.top;
    el.style.width = pl.w;
    if(pl.ar) el.style.aspectRatio = pl.ar;
    el.style.animationDuration = pl.dur+'s';
    el.style.animationDelay = '-'+rand(0,8)+'s';
    layer.appendChild(el);
  });
  /* foguetes */
  const N_ROCKETS = 3;
  const rTops = spreadBands(N_ROCKETS, 14, 74, 5);
  for(let i=0;i<N_ROCKETS;i++){
    const dur = rand(15,23);
    const el = document.createElement('div');
    el.className = 'space-rocket';
    el.innerHTML = `<div class="rocket-inner">${rocketSVG()}</div>`;
    el.style.top = rTops[i].toFixed(1)+'%';
    el.style.setProperty('--scale', (0.7 + rand(0,40)/100).toFixed(2));
    el.style.animationDuration = dur+'s';
    el.style.animationDelay = `-${(dur * (i + Math.random()*0.5) / N_ROCKETS).toFixed(1)}s`;
    layer.appendChild(el);
  }
  /* disco voador */
  const ufo = document.createElement('div');
  ufo.className = 'space-ufo';
  ufo.innerHTML = `<div class="ufo-inner">${ufoSVG()}</div>`;
  ufo.style.top = rand(26,48)+'%';
  ufo.style.animationDuration = '30s';
  ufo.style.animationDelay = '-'+rand(0,24)+'s';
  layer.appendChild(ufo);
}

/* O cenário muda para o espaço quando o jogador está no Desafio Bônus (fase final). */
function sceneIsBonus(){
  return !!session && session.kind === 'bonus' &&
         ['play','defeat','finalResult'].includes(currentScreen);
}

