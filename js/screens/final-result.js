/* ---- BONUS FINAL RESULT ---- */
SCREENS.finalResult = function(data){
  data = data || {};
  const r = SAVE.progress.bonus.result;
  const allDone = [1,2,3,4].every(n=>SAVE.progress.phases[n].status==='completed');
  const fb = r ? phaseFeedbackText(r.correct, r.wrong) : {emoji:'🏆', title:'Jornada concluída!', msg:'Você chegou até o final. Muito bem!'};
  const s = (session && session.kind === 'bonus') ? session : null;
  const stars = data.stars || (r && r.stars) || 0;
  const spoken = s ? endSpeech('win', s, fb, {stars}) : `${fb.title} ${fb.msg}`;
  SPEECH_REG.end = spoken;
  speakSoon(spoken, 'finalResult', 300);
  return `
  <div class="screen">
    <div class="cloud-card" style="text-align:center;">
      <div class="center-emoji">☁️🏆☁️</div>
      <h2>PARABÉNS!</h2>
      <p style="font-weight:700;">Você completou sua jornada matemática!</p>
      ${stars ? `<div class="big-stars">${starsHTML(stars)}</div>` : ''}
      <div class="stat-grid">
        <div class="stat-box"><div class="num">${SAVE.totalScore}</div><div class="lab">Pontuação total</div></div>
        <div class="stat-box"><div class="num">${SAVE.bestScore}</div><div class="lab">Melhor pontuação</div></div>
        <div class="stat-box"><div class="num">${allDone?'4/4':'—'}</div><div class="lab">Fases concluídas</div></div>
        <div class="stat-box"><div class="num">${r?r.correct+'/'+(r.correct+r.wrong):'—'}</div><div class="lab">Resultado do bônus</div></div>
      </div>
      ${endBubbleHTML(fb.emoji, fb)}
      ${s ? reviewHTML(s.log) : ''}
      <button class="btn btn-primary" style="margin-top:16px;" onclick="session=null; goto('map')">Voltar ao mapa</button>
    </div>
  </div>`;
};

