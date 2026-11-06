SCREENS.map = function(){
  const p = SAVE.progress.phases;
  const bonus = SAVE.progress.bonus;
  /* posição de cada ilha no mapa (centro da superfície, em % da largura/altura do mapa) */
  const spots = [
    {x:30, y:87,   w:34, theme:'balloon1', n:1},
    {x:70, y:70,   w:38, theme:'blimp2',   n:2},
    {x:30, y:53,   w:34, theme:'balloon3', n:3},
    {x:70, y:36,   w:38, theme:'blimp4',   n:4}
  ];
  const bonusSpot = {x:50, y:14, w:40, theme:'cosmic'};
  let isles = '', segs = '';
  spots.forEach((sp, i)=>{
    const st = p[sp.n].status;
    const state = st==='locked' ? 'locked' : st==='completed' ? 'done' : 'current';
    const stars = st==='completed' ? (p[sp.n].bestStars||0) : 0;
    isles += isleHTML({
      x:sp.x, y:sp.y, w:sp.w, theme:sp.theme, state, stars, num:String(sp.n), label:`Fase ${sp.n}`, delay:(i*0.9).toFixed(1),
      onclick:`openPhaseInfo(${sp.n})`,
      aria:`Fase ${sp.n}: ${PHASE_INFO[sp.n].name}, ${st==='locked'?'bloqueada':st==='completed'?'concluída':'disponível'}`
    });
    segs += mapPathSeg(sp, spots[i+1] || bonusSpot, st==='completed');
  });
  const bst = bonus.status;
  isles += isleHTML({
    x:bonusSpot.x, y:bonusSpot.y, w:bonusSpot.w, theme:bonusSpot.theme, bonus:true,
    state: bst==='locked' ? 'locked' : bst==='completed' ? 'done' : 'current',
    stars: (bst==='completed' && bonus.result && bonus.result.stars) ? bonus.result.stars : 0,
    num:'🏆', label:'Bônus', delay:'0.4',
    onclick:'openBonusInfo()',
    aria:`Desafio Bônus, ${bst==='locked'?'bloqueado':bst==='completed'?'concluído':'disponível'}`
  });

  return `
  <div class="screen">
    <div class="top-bar">
      <div class="pill">${SAVE.profile.avatar} ${esc(SAVE.profile.name)}</div>
      <div class="pill">🏆 ${SAVE.bestScore}</div>
      <div class="game-actions">
        <button class="btn btn-icon btn-outline" onclick="openProgress('map')" aria-label="Meu progresso" title="Meu progresso">📊</button>
        <button class="btn btn-icon btn-outline" onclick="goto('settings',{from:'map'})" aria-label="Configurações">⚙️</button>
        <button class="btn btn-outline" style="width:auto; min-height:52px; padding:10px 16px;" onclick="goto('start')">⌂ Tela inicial</button>
      </div>
    </div>
    <div class="map-head">
      <div class="row">
        <div class="pill" style="flex:none;">Pontos: ${SAVE.totalScore}</div>
        <button class="btn btn-sun" style="flex:none; width:auto; min-height:44px; padding:8px 16px;" onclick="goto('activities')">🎯 Escolher atividade</button>
        <button class="btn btn-ghost" style="flex:none; padding:6px 10px;" onclick="goto('tutorial')">❔ Como jogar</button>
      </div>
    </div>
    <div class="isle-map">
      <svg class="isle-path" viewBox="0 0 400 880" aria-hidden="true">${segs}</svg>
      ${isles}
    </div>
  </div>`;
};



/* Ao abrir o mapa, leva a tela até a fase que o jogador deve jogar agora
   (sem isso, ela ficava fora da tela, embaixo, e o jogador precisava descobrir que era só rolar). */
function scrollMapToCurrent(){
  setTimeout(()=>{
    if(currentScreen !== 'map') return;
    const cur = document.querySelector('.isle.current');
    if(!cur) return;
    const reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
    cur.scrollIntoView({block:'center', behavior: reduce ? 'auto' : 'smooth'});
  }, 450);
}
