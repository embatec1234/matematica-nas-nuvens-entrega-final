/* ---- SELEÇÃO DE ATIVIDADES ---- */
SCREENS.activities = function(){
  const cardsHtml = Object.keys(TOPICS).map(id=>{
    const t = TOPICS[id];
    return `
      <button class="diff-card" style="align-items:center; text-align:center;" onclick="startTopicActivity('${id}')">
        <div style="font-size:32px;">${t.emoji}</div>
        <div class="diff-title">${t.label}</div>
      </button>`;
  }).join('');
  return `
  <div class="screen">
    <div class="top-bar">
      <div class="pill">${SAVE.profile.avatar} ${esc(SAVE.profile.name)}</div>
      <button class="btn btn-outline" style="width:auto; min-height:52px; padding:10px 16px;" onclick="goto('map')">← Voltar ao mapa</button>
    </div>
    <div class="cloud-card">
      <h2 style="margin-top:0;">🎯 Escolha uma atividade</h2>
      <p style="color:var(--ink-soft); font-weight:600; margin-top:-6px;">Pratique um assunto específico, no seu próprio ritmo!</p>
      <div class="options-grid">${cardsHtml}</div>
    </div>
  </div>`;
};
function startTopicActivity(topicId){
  sfxClick();
  session = {
    kind:'topic', topic:topicId, index:0, lives:START_LIVES, score:0,
    correct:0, wrong:0, questions: buildTopicQuestionSet(topicId, SAVE.difficulty, QUESTIONS_PER_PHASE),
    log:[], startedAt: Date.now(), qStartedAt: Date.now(), answered:false, retriedThisQuestion:false
  };
  persistSession();
  goto('play');
}

function openPhaseInfo(n){
  sfxClick();
  const st = SAVE.progress.phases[n].status;
  if(st==='locked') return;
  const info = PHASE_INFO[n];
  showModal(`
    <div class="modal-card">
      <div class="center-emoji">${info.icon}</div>
      <h3>Fase ${n} — ${info.name}</h3>
      <p>${info.desc}</p>
      <div class="stack">
        <button class="btn btn-mint" onclick="closeModal(); startPhase(${n});">Jogar ▶️</button>
        <button class="btn btn-outline" onclick="closeModal();">Fechar</button>
      </div>
    </div>`);
}
function openBonusInfo(){
  sfxClick();
  if(SAVE.progress.bonus.status==='locked') return;
  showModal(`
    <div class="modal-card">
      <div class="center-emoji">🏆</div>
      <h3>Desafio Bônus</h3>
      <p>Uma mistura de todas as fases! Mostre tudo o que aprendeu.</p>
      <div class="stack">
        <button class="btn btn-sun" onclick="closeModal(); startBonus();">Jogar ▶️</button>
        <button class="btn btn-outline" onclick="closeModal();">Fechar</button>
      </div>
    </div>`);
}

