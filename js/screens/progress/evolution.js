/* ---------- EVOLUÇÃO (gráfico simples das últimas partidas) ---------- */
function evolutionInfo(){
  /* da partida mais antiga para a mais recente; usa % de acertos porque cada partida tem um número diferente de perguntas */
  const games = SAVE.history.slice(0,8).map(h=>{
    const c = Number(h.correct)||0, w = Number(h.wrong)||0, n = c+w;
    return n > 0 ? {h, acc:Math.round(c/n*100)} : null;
  }).filter(Boolean).reverse();
  let msg;
  if(games.length === 0){
    msg = 'Quando você jogar, eu mostro como está a sua evolução!';
  } else if(games.length === 1){
    msg = `Na sua primeira partida você acertou ${games[0].acc}%. Jogue de novo para ver a sua evolução!`;
  } else {
    const a = games[games.length-1].acc, b = games[games.length-2].acc, d = a - b;
    if(d >= 5)       msg = `🚀 Você melhorou! Na última partida acertou ${a}% e na anterior acertou ${b}%.`;
    else if(d <= -5) msg = `💪 Na última partida você acertou ${a}% e na anterior ${b}%. Vamos tentar superar?`;
    else if(a >= 80) msg = `👏 Você continua mandando bem: ${a}% de acertos na última partida!`;
    else             msg = `🙂 Você manteve o ritmo: ${a}% de acertos na última partida.`;
    if(games.length >= 4){
      const half = Math.floor(games.length/2);
      const avg = arr => arr.reduce((t,g)=>t+g.acc, 0) / arr.length;
      if(avg(games.slice(-half)) - avg(games.slice(0,half)) >= 5) msg += ' No geral, você está evoluindo!';
    }
  }
  return {games, msg};
}
function evolutionHTML(info){
  if(!info.games.length) return '<p class="note">Jogue uma partida para ver o seu gráfico de evolução.</p>';
  const MAXH = 110; // altura (px) de uma barra com 100% de acertos
  const bars = info.games.map((g,i)=>{
    const h = g.h;
    const tone = g.acc >= 80 ? 'good' : g.acc >= 50 ? 'mid' : 'low';
    const ico = h.kind === 'bonus' ? '🏆'
      : h.kind === 'topic' ? ((TOPICS[h.topic]||{}).emoji || '🎯')
      : ((PHASE_INFO[h.phase]||{}).icon || '');
    const last = i === info.games.length - 1;
    return `
    <div class="evo-col${last?' evo-last':''}" role="listitem" aria-label="Partida ${i+1}: ${g.acc}% de acertos">
      <div class="evo-pct">${g.acc}%</div>
      <div class="evo-bar ${tone}" style="height:${Math.max(8, Math.round(g.acc/100*MAXH))}px; animation-delay:${(i*0.06).toFixed(2)}s"></div>
      <div class="evo-ico" aria-hidden="true">${ico}</div>
    </div>`;
  }).join('');
  return `
    <div class="evo-chart" role="list" aria-label="Porcentagem de acertos nas últimas partidas">${bars}</div>
    <div class="evo-legend">
      <span><i class="evo-dot good"></i>Muito bem</span>
      <span><i class="evo-dot mid"></i>Bom</span>
      <span><i class="evo-dot low"></i>Vamos treinar</span>
    </div>
    <p class="note">Cada barra é uma partida: quanto mais alta, mais acertos. A última barra (com borda) é a mais recente.</p>`;
}

