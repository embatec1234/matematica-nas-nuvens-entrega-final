/* ---- MAP ---- */
/* ---------- MAPA DE ILHAS FLUTUANTES ---------- */
function starPts(cx,cy,R,r){
  const pts=[];
  for(let i=0;i<10;i++){
    const ang = -Math.PI/2 + i*Math.PI/5, rad = i%2 ? r : R;
    pts.push((cx+rad*Math.cos(ang)).toFixed(1)+','+(cy+rad*Math.sin(ang)).toFixed(1));
  }
  return pts.join(' ');
}
/* ---------- BALÕES E DIRIGÍVEIS (acessos às fases) ---------- */
function skySparkle(x,y,r){
  return `<path d="M${x} ${y-r} L${x+r*.3} ${y-r*.3} L${x+r} ${y} L${x+r*.3} ${y+r*.3} L${x} ${y+r} L${x-r*.3} ${y+r*.3} L${x-r} ${y} L${x-r*.3} ${y-r*.3} Z" fill="#fff" opacity=".92"/>`;
}
function balloonSVG(o){
  const u = uid('bl');
  const env = 'M80 8 C28 8 10 52 22 86 C30 108 50 124 62 134 L98 134 C110 124 130 108 138 86 C150 52 132 8 80 8 Z';
  return `
<svg class="art-svg" viewBox="0 0 160 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <defs><clipPath id="${u}-c"><path d="${env}"/></clipPath></defs>
  <path d="M66 141 L69 170 M94 141 L91 170" stroke="#233256" stroke-width="2" fill="none" stroke-linecap="round"/>
  <path d="M80 147 Q71 159 80 170 Q89 159 80 147 Z" fill="#FF9F1C" stroke="#233256" stroke-width="1.6" stroke-linejoin="round"/>
  <path d="M80 157 Q76 164 80 170 Q84 164 80 157 Z" fill="#FFE66D"/>
  <rect x="64" y="169" width="32" height="23" rx="4" fill="#C98A4B" stroke="#233256" stroke-width="2.5"/>
  <path d="M65 177 H95 M65 184 H95" stroke="#8A5A2B" stroke-width="1.6" opacity=".7"/>
  <rect x="61" y="166" width="38" height="7" rx="3.5" fill="#E0A85F" stroke="#233256" stroke-width="2.5"/>
  <path d="M62 134 L98 134 L95 143 L65 143 Z" fill="${o.skirt}" stroke="#233256" stroke-width="2.5" stroke-linejoin="round"/>
  <path d="${env}" fill="${o.c1}"/>
  <g clip-path="url(#${u}-c)">
    <path d="M80 8 Q19 60 70 134 L80 134 Z" fill="${o.c2}"/>
    <path d="M80 8 Q141 60 90 134 L170 134 L170 8 Z" fill="${o.c2}"/>
    ${o.deco||''}
    <ellipse cx="50" cy="42" rx="12" ry="26" fill="#fff" opacity=".22" transform="rotate(18 50 42)"/>
  </g>
  <path d="M80 8 Q19 60 70 134 M80 8 L80 134 M80 8 Q141 60 90 134" fill="none" stroke="#233256" stroke-width="1.6" opacity=".4"/>
  <path d="${env}" fill="none" stroke="#233256" stroke-width="3" stroke-linejoin="round"/>
  <circle cx="80" cy="68" r="17" fill="#fff" stroke="#233256" stroke-width="2.5"/>
  <text x="80" y="77.5" text-anchor="middle" font-family="'Baloo 2',Nunito,sans-serif" font-weight="800" font-size="26" fill="${o.symColor}">${o.sym}</text>
</svg>`;
}
function blimpSVG(o){
  const u = uid('bz');
  return `
<svg class="art-svg" viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <defs><clipPath id="${u}-c"><ellipse cx="100" cy="50" rx="82" ry="36"/></clipPath></defs>
  <path d="M30 36 L14 8 L58 22 Z" fill="${o.fin}" stroke="#233256" stroke-width="2.5" stroke-linejoin="round"/>
  <path d="M30 64 L14 92 L58 78 Z" fill="${o.fin}" stroke="#233256" stroke-width="2.5" stroke-linejoin="round"/>
  <ellipse cx="100" cy="50" rx="82" ry="36" fill="${o.body}"/>
  <g clip-path="url(#${u}-c)">
    <path d="M62 10 Q50 50 62 92 L78 92 Q66 50 78 10 Z" fill="${o.band}"/>
    <path d="M126 10 Q114 50 126 92 L142 92 Q130 50 142 10 Z" fill="${o.band}"/>
    <ellipse cx="86" cy="30" rx="46" ry="9" fill="#fff" opacity=".28"/>
  </g>
  <ellipse cx="100" cy="50" rx="82" ry="36" fill="none" stroke="#233256" stroke-width="3"/>
  <rect x="78" y="82" width="44" height="21" rx="7" fill="#E4E8F5" stroke="#233256" stroke-width="2.5"/>
  <rect x="86" y="88" width="9" height="8" rx="2" fill="#7FD1FF" stroke="#233256" stroke-width="1.6"/>
  <rect x="105" y="88" width="9" height="8" rx="2" fill="#7FD1FF" stroke="#233256" stroke-width="1.6"/>
  <ellipse cx="72" cy="94" rx="2.8" ry="10" fill="#B9C2DC" stroke="#233256" stroke-width="1.8"/>
  <circle cx="100" cy="50" r="17" fill="#fff" stroke="#233256" stroke-width="2.5"/>
  <text x="100" y="59" text-anchor="middle" font-family="'Baloo 2',Nunito,sans-serif" font-weight="800" font-size="26" fill="${o.symColor}">${o.sym}</text>
</svg>`;
}
const SKY_VEHICLES = {
  balloon1:{kind:'balloon', c1:'#FF6F6F', c2:'#FFFFFF', skirt:'#FFD93D', sym:'+', symColor:'#E24B4B'},
  blimp2:  {kind:'blimp',   body:'#5BA8FF', band:'#FFFFFF', fin:'#3A7FDB', sym:'÷', symColor:'#3A7FDB'},
  balloon3:{kind:'balloon', c1:'#3FCE8E', c2:'#FFD93D', skirt:'#8C6FF7', sym:'×', symColor:'#25A96E'},
  blimp4:  {kind:'blimp',   body:'#FF9F43', band:'#FFE08A', fin:'#E5702A', sym:'=', symColor:'#E5702A'},
  cosmic:  {kind:'balloon', c1:'#8C6FF7', c2:'#4B2FAE', skirt:'#FFD93D', sym:'★', symColor:'#8C6FF7',
            deco: skySparkle(46,60,6)+skySparkle(118,42,5)+skySparkle(60,104,4.5)+skySparkle(108,108,4)+skySparkle(94,24,4)}
};
function isleSVG(theme){
  const t = SKY_VEHICLES[theme] || SKY_VEHICLES.balloon1;
  return t.kind==='blimp' ? blimpSVG(t) : balloonSVG(t);
}
function medalSVG(label, state, stars, isBonus){
  const u = uid('md');
  const cols = state==='locked' ? ['#E6EAF5','#9AA5C4','#6C7799']
             : isBonus ? ['#FFC26B','#FF5E7E','#A8324B']
             : ['#FFE680','#F2A900','#8A5A00'];
  const starsSvg = [[14,18],[32,10],[50,18]].map((sp,i)=>{
    const on = i < stars;
    return `<image href="${on?STAR_ON:STAR_OFF}" x="${sp[0]-9.5}" y="${sp[1]-9.5}" width="19" height="19"/>`;
  }).join('');
  const txt = isBonus
    ? `<text x="32" y="49" text-anchor="middle" font-size="19">${label}</text>`
    : `<text x="32" y="50.5" text-anchor="middle" font-family="'Baloo 2',Nunito,sans-serif" font-weight="800" font-size="23" fill="#fff" stroke="${cols[2]}" stroke-width="3.2" paint-order="stroke" stroke-linejoin="round">${label}</text>`;
  return `
<svg class="art-svg" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <defs><linearGradient id="${u}-g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${cols[0]}"/><stop offset="1" stop-color="${cols[1]}"/></linearGradient></defs>
  ${starsSvg}
  <circle cx="32" cy="42" r="19" fill="url(#${u}-g)" stroke="${cols[2]}" stroke-width="3"/>
  <circle cx="32" cy="42" r="14" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="1.8"/>
  ${txt}
</svg>`;
}
function isleHTML(o){
  return `
  <button class="isle ${o.state} vehicle-${(SKY_VEHICLES[o.theme]||{}).kind||'balloon'}${o.bonus?' isle-bonus':''}" style="left:${o.x}%; top:${o.y}%; width:${o.w}%; --d:-${o.delay}s;" ${o.state==='locked'?'disabled':''} onclick="${o.onclick}" aria-label="${o.aria}">
    <span class="isle-float">
      ${o.state==='current' ? '<span class="isle-halo" aria-hidden="true"></span>' : ''}
      <span class="isle-art">${isleSVG(o.theme)}</span>
      ${o.state==='current' ? '<span class="isle-cta" aria-hidden="true">▶ Jogar!</span><span class="isle-spark sp1" aria-hidden="true">✦</span><span class="isle-spark sp2" aria-hidden="true">✦</span><span class="isle-spark sp3" aria-hidden="true">✦</span>' : ''}
      <span class="isle-medal">${medalSVG(o.num, o.state, o.stars, o.bonus)}</span>
      ${o.state==='locked' ? '<span class="isle-lock">🔒</span>' : ''}
    </span>
    <span class="node-label">${o.label}</span>
  </button>`;
}
function mapPathSeg(a, b, lit){
  const x1=a.x*4, y1=a.y*8.8, x2=b.x*4, y2=b.y*8.8, my=(y1+y2)/2;
  return `<path class="${lit?'lit':''}" d="M${x1} ${y1} C${x1} ${my} ${x2} ${my} ${x2} ${y2}"/>`;
}

