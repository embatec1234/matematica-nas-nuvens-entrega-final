/* ---- DEFEAT ---- */
SCREENS.defeat = function(){
  persistDefeat();
  const s = session || {correct:0, wrong:0, score:0, log:[], kind:'phase'};
  const fb = {title:'Vamos treinar!', msg: s.correct > 0
    ? `Você acertou ${s.correct} ${plural(s.correct,'pergunta','perguntas')} antes de acabarem as vidas. Veja abaixo o que dá para melhorar.`
    : 'Veja abaixo o que aconteceu. Errar faz parte de aprender!'};
  const spoken = endSpeech('lose', s, fb);
  SPEECH_REG.end = spoken;
  speakSoon(spoken, 'defeat', 300);
  return `
  <div class="screen">
    <div class="cloud-card" style="text-align:center;">
      <div class="center-emoji">☁️💧</div>
      <h2>Você perdeu todas as suas vidas!</h2>
      <p style="color:var(--ink-soft); font-weight:600;">Sem problemas, todo mundo erra! Tente de novo.</p>
      <div class="stat-grid">
        <div class="stat-box"><div class="num">${s.correct}</div><div class="lab">Acertos</div></div>
        <div class="stat-box"><div class="num">${s.wrong}</div><div class="lab">Erros</div></div>
      </div>
      ${endBubbleHTML('🌱', fb)}
      ${reviewHTML(s.log)}
      <div class="stack" style="margin-top:16px;">
        <button class="btn btn-mint" onclick="retrySession()">🔁 Tentar novamente</button>
        <button class="btn btn-outline" onclick="const d=(session&&session.kind==='topic')?'activities':'map'; session=null; SAVE.currentPhaseInProgress=null; persist(); goto(d);">🗺️ ${(session&&session.kind==='topic')?'Voltar às atividades':'Voltar ao mapa'}</button>
      </div>
    </div>
  </div>`;
};
function persistDefeat(){ SAVE.currentPhaseInProgress=null; persist(); }
function retrySession(){
  sfxClick();
  if(session.kind==='phase') startPhase(session.phase);
  else if(session.kind==='topic') startTopicActivity(session.topic);
  else startBonus();
}

