function phaseFeedbackText(correct, wrong){
  const total = correct+wrong;
  const acc = total>0 ? correct/total : 1;
  if(acc>=1) return {emoji:'🏆', title:'Perfeito!', msg:'Você acertou todas as perguntas! Desempenho incrível, parabéns!'};
  if(acc>=0.9) return {emoji:'🌟', title:'Desempenho incrível!', msg:'Você acertou quase tudo! Está dominando essa matemática muito bem.'};
  if(acc>=0.7) return {emoji:'🎉', title:'Muito bom!', msg:'Você acertou a maior parte das perguntas. Continue assim!'};
  if(acc>=0.5) return {emoji:'💪', title:'Bom trabalho!', msg:'Você está no caminho certo. Praticando mais um pouco, vai ficar ainda melhor.'};
  return {emoji:'🌤️', title:'Você conseguiu!', msg:'Essa fase foi mais difícil, mas você não desistiu. Vamos praticar mais essas contas na próxima tentativa?'};
}

/* ---- VICTORY ---- */
function endBubbleHTML(emojiTitle, fb){
  const ch = currentVoiceChar();
  return `
  <div class="mascot-row" style="margin-top:14px; text-align:left;">
    <div class="mascot live" aria-hidden="true">${ch.emoji}</div>
    <div class="speech"><strong>${emojiTitle} ${fb.title}</strong><br>${fb.msg}</div>
    <div class="say-col">
      <button class="btn btn-icon btn-outline listen-btn" onclick="sayKey('end')" aria-label="Ouvir novamente">🔊</button>
      <button class="btn btn-icon btn-coral stop-btn" onclick="stopSpeaking()" aria-label="Parar">⏹</button>
    </div>
  </div>`;
}
SCREENS.victory = function(data){
  data = data || {};
  const s = session;
  const fb = phaseFeedbackText(s.correct, s.wrong);
  const spoken = endSpeech('win', s, fb, data);
  SPEECH_REG.end = spoken;
  speakSoon(spoken, 'victory', 300);
  const backDest = (data.isTopic || s.kind==='topic') ? 'activities' : 'map';
  return `
  <div class="screen">
    <div class="cloud-card" style="text-align:center;">
      <div class="center-emoji">🎉</div>
      <h2>${(data.isTopic || s.kind==='topic') ? 'Atividade concluída!' : 'Fase concluída!'}</h2>
      <div class="big-stars">${starsHTML(data.stars || starsFor(s.wrong))}</div>
      ${data.record ? '<div class="record-badge">🏅 Novo recorde nesta fase!</div>' : ''}
      <div class="stat-grid">
        <div class="stat-box"><div class="num">${s.score}</div><div class="lab">Pontos</div></div>
        <div class="stat-box"><div class="num">${s.correct}</div><div class="lab">Acertos</div></div>
        <div class="stat-box"><div class="num">${s.wrong}</div><div class="lab">Erros</div></div>
        <div class="stat-box"><div class="num">${s.lives}</div><div class="lab">Vidas restantes</div></div>
      </div>
      ${endBubbleHTML(fb.emoji, fb)}
      ${reviewHTML(s.log)}
      <button class="btn btn-primary" style="margin-top:16px;" onclick="session=null; goto('${backDest}');">Continuar</button>
    </div>
  </div>`;
};

