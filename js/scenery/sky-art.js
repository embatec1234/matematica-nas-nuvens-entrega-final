/* ---------- ARTE VETORIAL (avião e pássaro) ----------
   Ilustrações em SVG, estilo cartoon infantil com contorno preto,
   inspiradas nas referências de avião e passarinho.
------------------------------------------------------- */
let _artUid = 0;
const uid = (p)=> p + '-' + (++_artUid);

function planeSVG(){
  const u = uid('pl');
  return `
<svg class="art-svg plane-svg" viewBox="0 0 220 142" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Avião voando no céu">
  <defs>
    <clipPath id="${u}-hull">
      <path d="M34 66C34 48 64 38 114 38c40 0 72 10 84 24 6 7 0 16-12 21-26 10-98 12-132 1-14-5-20-11-20-18Z"/>
    </clipPath>
    <linearGradient id="${u}-hullFill" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#FFFFFF"/>
      <stop offset="1" stop-color="#DCE9F2"/>
    </linearGradient>
    <linearGradient id="${u}-red" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#F0525A"/>
      <stop offset="1" stop-color="#D62F3C"/>
    </linearGradient>
  </defs>
  <g stroke="#1F242C" stroke-width="3.4" stroke-linejoin="round" stroke-linecap="round">

    <!-- leme / cauda (atrás) -->
    <path d="M76 48C58 38 36 27 21 25c-2 12 10 26 30 37Z" fill="url(#${u}-red)"/>
    <path d="M52 44C44 39 34 33 28 31c1 7 7 15 18 22Z" fill="#F9C440" stroke-width="2.6"/>

    <!-- asa de trás (atrás do corpo) -->
    <path d="M140 50c14-16 34-30 54-34 6 10-2 28-24 42Z" fill="url(#${u}-red)"/>
    <path d="M153 47c10-10 22-19 32-23 2 7-5 18-20 27Z" fill="#F9C440" stroke-width="2.6"/>

    <!-- estabilizador inferior -->
    <path d="M52 73C36 76 20 83 14 90c10 5 26 2 40-5Z" fill="#F9C440" stroke-width="2.8"/>

    <!-- fuselagem -->
    <path d="M34 66C34 48 64 38 114 38c40 0 72 10 84 24 6 7 0 16-12 21-26 10-98 12-132 1-14-5-20-11-20-18Z" fill="url(#${u}-hullFill)"/>

    <!-- detalhes recortados dentro da fuselagem -->
    <g clip-path="url(#${u}-hull)" stroke="#1F242C" stroke-width="2.8">
      <path d="M185 47c9 5 16 11 15 18-1 10-8 17-17 22-7-13-6-27 2-40Z" fill="#F9C440"/>
      <path d="M38 76c34 15 114 15 150-2 1 6-1 10-6 13-32 12-108 10-140-3Z" fill="#3E90CE"/>
      <path d="M150 53c14-6 29-8 38-5 2 8-5 15-19 19-11 3-19-1-21-6Z" fill="#3E90CE"/>
      <circle cx="74" cy="63" r="5.4" fill="#3E90CE"/>
      <circle cx="94" cy="63" r="6.4" fill="#3E90CE"/>
      <circle cx="115" cy="62" r="7.4" fill="#3E90CE"/>
      <circle cx="137" cy="62" r="8.4" fill="#3E90CE"/>
    </g>

    <!-- contorno da fuselagem por cima, para silhueta limpa -->
    <path d="M34 66C34 48 64 38 114 38c40 0 72 10 84 24 6 7 0 16-12 21-26 10-98 12-132 1-14-5-20-11-20-18Z" fill="none"/>

    <!-- asa da frente (na frente do corpo) -->
    <path d="M147 78C117 88 79 104 55 120c-7 5-2 11 8 8 36-8 74-28 94-46Z" fill="url(#${u}-red)"/>
    <path d="M127 92c-22 8-46 20-60 30 24-5 48-17 64-28Z" fill="#F9C440" stroke-width="2.6"/>
  </g>
</svg>`;
}

function birdSVG(){
  const u = uid('bd');
  return `
<svg class="art-svg bird-svg" viewBox="0 0 160 130" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Passarinho azul voando">
  <defs>
    <clipPath id="${u}-body">
      <path d="M30 72c0-20 16-36 40-40 18-3 36 0 46 10 12 12 14 30 4 44-10 13-32 19-52 16-24-4-38-14-38-30Z"/>
    </clipPath>
    <linearGradient id="${u}-blue" x1="0" y1="0" x2="0.3" y2="1">
      <stop offset="0" stop-color="#57C9F2"/>
      <stop offset="1" stop-color="#2AA6DF"/>
    </linearGradient>
    <linearGradient id="${u}-wing" x1="0" y1="0" x2="0.4" y2="1">
      <stop offset="0" stop-color="#8FDDF8"/>
      <stop offset="1" stop-color="#45B8EC"/>
    </linearGradient>
  </defs>
  <g stroke="#173A4E" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">

    <!-- topete (atrás da cabeça) -->
    <path d="M103 32c0-7 4-12 10-13 3 0 3 3 0 5-3 2-4 5-3 10Z" fill="#2AA6DF" stroke-width="2.6"/>

    <!-- cauda (atrás) -->
    <path d="M42 66C28 58 12 51 1 49c6 12 6 26 0 39 12-6 30-14 42-18Z" fill="#2AA6DF"/>

    <!-- asa de trás -->
    <g class="bird-wing bird-wing-far">
      <path d="M86 62C72 70 50 70 36 58 28 50 32 38 46 38c16 0 34 10 44 20Z" fill="#2795CC"/>
    </g>

    <!-- corpo -->
    <path d="M30 72c0-20 16-36 40-40 18-3 36 0 46 10 12 12 14 30 4 44-10 13-32 19-52 16-24-4-38-14-38-30Z" fill="url(#${u}-blue)"/>

    <!-- barriga e peito, recortados no corpo -->
    <g clip-path="url(#${u}-body)">
      <path d="M32 70c16 22 64 28 96 0 0 16-10 30-36 34-32 5-58-12-60-34Z" fill="#CFEEFB" stroke="none"/>
      <path d="M38 88c20 12 58 13 82-2-4 10-14 17-30 19-22 3-42-5-52-17Z" fill="#F7B733" stroke="none"/>
      <circle cx="88" cy="68" r="6.5" fill="#F7B733" stroke="none"/>
    </g>

    <!-- contorno do corpo por cima -->
    <path d="M30 72c0-20 16-36 40-40 18-3 36 0 46 10 12 12 14 30 4 44-10 13-32 19-52 16-24-4-38-14-38-30Z" fill="none"/>

    <!-- bico -->
    <path d="M122 50l26 8-26 9Z" fill="#F5901E" stroke-width="2.8"/>

    <!-- olho -->
    <circle cx="103" cy="47" r="12" fill="#FFFFFF" stroke-width="2.8"/>
    <circle cx="105" cy="48" r="7.5" fill="#12212E" stroke="none"/>
    <circle cx="108" cy="44" r="2.6" fill="#FFFFFF" stroke="none"/>

    <!-- asa da frente (bate) -->
    <g class="bird-wing bird-wing-near">
      <path d="M84 66C70 72 50 70 38 58 30 50 34 40 46 40c16 0 32 8 42 18 4 4 2 8-4 8Z" fill="url(#${u}-wing)"/>
      <path d="M50 45c8 4 18 10 28 16" fill="none" stroke="#3FAEE0" stroke-width="2.4"/>
      <path d="M44 51c9 5 19 10 30 14" fill="none" stroke="#3FAEE0" stroke-width="2.4"/>
      <path d="M40 58c9 4 18 7 28 10" fill="none" stroke="#3FAEE0" stroke-width="2.4"/>
    </g>

    <!-- pezinhos recolhidos -->
    <path d="M78 100c-2 6-7 9-13 10" fill="none" stroke="#E8622F" stroke-width="3"/>
    <path d="M90 99c-2 6-7 9-13 10" fill="none" stroke="#E8622F" stroke-width="3"/>
  </g>
</svg>`;
}

function cloudSVG(){
  const u = uid('cl');
  return `
<svg class="art-svg cloud-svg" viewBox="0 0 200 104" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <defs>
    <clipPath id="${u}-c">
      <path d="M26 92C10 92 2 80 6 68c3-10 12-16 22-15 2-19 18-33 38-33 16 0 30 9 36 22 7-8 18-12 29-10 19 3 32 18 31 36 14 0 24 9 24 17 0 4-3 7-8 7Z"/>
    </clipPath>
    <linearGradient id="${u}-f" x1="0" y1="0" x2="0.2" y2="1">
      <stop offset="0" stop-color="#FFFFFF"/>
      <stop offset="0.62" stop-color="#F4FAFE"/>
      <stop offset="1" stop-color="#D9EAF7"/>
    </linearGradient>
  </defs>
  <path d="M26 92C10 92 2 80 6 68c3-10 12-16 22-15 2-19 18-33 38-33 16 0 30 9 36 22 7-8 18-12 29-10 19 3 32 18 31 36 14 0 24 9 24 17 0 4-3 7-8 7Z" fill="url(#${u}-f)"/>
  <g clip-path="url(#${u}-c)">
    <path d="M-5 70c32 14 72 16 108 7 33-8 68-10 102-1v32H-5Z" fill="#C7DFF0" opacity=".5"/>
    <ellipse cx="62" cy="40" rx="28" ry="17" fill="#FFFFFF" opacity=".85"/>
    <ellipse cx="26" cy="70" rx="16" ry="11" fill="#FFFFFF" opacity=".7"/>
  </g>
</svg>`;
}

/* distribui n elementos em faixas iguais (com leve variação) e embaralha */
function spreadBands(n, min, max, jitter){
  const step = (max - min) / n, out = [];
  for(let i=0;i<n;i++) out.push(min + step*i + step/2 + (Math.random()*2-1)*jitter);
  for(let i=out.length-1;i>0;i--){ const j = Math.floor(Math.random()*(i+1)); [out[i],out[j]] = [out[j],out[i]]; }
  return out;
}

