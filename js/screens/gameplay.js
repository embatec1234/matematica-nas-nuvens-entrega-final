/* ---- GAMEPLAY (PHASE) ---- */
function startPhase(n){
  session = {
    kind:'phase', phase:n, index:0, lives:START_LIVES, score:0,
    correct:0, wrong:0, questions: buildQuestionSet(n, SAVE.difficulty, QUESTIONS_PER_PHASE),
    log:[], startedAt: Date.now(), qStartedAt: Date.now(), answered:false, retriedThisQuestion:false
  };
  persistSession();
  goto('play');
}
function startBonus(){
  session = {
    kind:'bonus', phase:'bonus', index:0, lives:START_LIVES, score:0,
    correct:0, wrong:0, questions: buildBonusSet(SAVE.difficulty, BONUS_QUESTIONS),
    log:[], startedAt: Date.now(), qStartedAt: Date.now(), answered:false, retriedThisQuestion:false
  };
  persistSession();
  goto('play');
}
function resumePhase(){
  const s = SAVE.currentPhaseInProgress;
  if(!s){ goto('map'); return; }
  session = s;
  session.log = session.log || []; // saves antigos não tinham o registro de respostas
  session.qStartedAt = Date.now();
  if(session.answered){
    /* o jogador saiu logo depois de responder: a resposta já valeu, segue para a próxima */
    session.answered = false;
    if(session.lives <= 0){ recordSessionEnd('lose'); goto('defeat'); return; }
    session.index++;
    if(session.index >= session.questions.length){ finishSession(); return; }
  }
  goto('play');
}
  function persistSession(){
  if(!session) return;
  SAVE.currentPhaseInProgress = {
  ...session,
  questions: session.questions.map(q=>({...q, options:q.options ? [...q.options] : undefined}))
  };
  hasSavedGame = !!(SAVE.profile && SAVE.profile.name);
  persistNow();
  }
  function returnToMap(){
  sfxClick();
  persistSession();
  showModal(`<div class="modal-card"><div class="center-emoji">🗺️</div><h3>Voltar ao mapa?</h3><p>Seu progresso nesta fase será salvo para você continuar depois.</p><div class="stack"><button class="btn btn-mint" onclick="closeModal(); goto('map');">Voltar ao mapa</button><button class="btn btn-outline" onclick="closeModal();">Continuar jogando</button></div></div>`);
  }
  function returnToStart(){
  sfxClick();
  persistSession();
  showModal(`<div class="modal-card"><div class="center-emoji">🏠</div><h3>Voltar à tela inicial?</h3><p>Seu progresso nesta fase será salvo. Você poderá continuar depois pelo botão Continuar.</p><div class="stack"><button class="btn btn-mint" onclick="closeModal(); goto('start');">Voltar ao início</button><button class="btn btn-outline" onclick="closeModal();">Continuar jogando</button></div></div>`);
  }
  
  SCREENS.play = function(){
  if(!session) return SCREENS.map();
  const q = session.questions[session.index];
  const total = session.questions.length;
  const pct = Math.round((session.index/total)*100);
  const title = session.kind==='bonus' ? 'Desafio Bônus'
    : session.kind==='topic' ? `${(TOPICS[session.topic]||{}).emoji||'🎯'} ${(TOPICS[session.topic]||{}).label||'Atividade'}`
    : `Fase ${session.phase} — ${PHASE_INFO[session.phase].name}`;

  let answerArea = '';
  if(q.type==='multipla'){
    answerArea = `<div class="options-grid">
      ${q.options.map(o=>`<button class="opt-btn" data-val="${esc(o)}" onclick="submitAnswer('${esc(o)}', this)">${esc(o)}</button>`).join('')}
    </div>`;
  } else {
    answerArea = `<div class="numeric-row">
      <input type="text" inputmode="numeric" pattern="[0-9\\-]*" id="numInput" placeholder="?" onkeydown="if(event.key==='Enter'){submitNumeric();}">
      <button class="btn btn-primary" style="width:auto; padding:16px 22px;" onclick="submitNumeric()">Responder</button>
    </div>`;
  }

  return `
  <div class="screen">
    <div class="top-bar">
  <div class="game-actions">
  <button class="btn btn-icon btn-outline" onclick="returnToStart()" aria-label="Voltar à tela inicial" title="Tela inicial">⌂</button>
  <button class="btn btn-icon btn-outline" onclick="returnToMap()" aria-label="Voltar ao mapa" title="Voltar ao mapa">←</button>
  <button class="btn btn-icon btn-outline" onclick="pauseGame()" aria-label="Pausar">⏸️</button>
  </div>
      <div class="pill">${title}</div>
      <div class="lives" aria-label="Vidas restantes: ${session.lives} de 3">
        ${[0,1,2].map(i=>`<span class="heart ${i<session.lives?'':'lost'}">❤️</span>`).join('')}
      </div>
    </div>
    <div class="cloud-card question-box">
      <div class="progress-track"><div class="progress-fill" style="width:${pct}%;"></div></div>
      <div class="pill" style="display:inline-flex; margin:0 auto 2px;">${SAVE.profile.avatar} ${esc(SAVE.profile.name||'Jogador')}</div>
      ${timerRowHTML()}
      <div class="q-badge">Pergunta ${session.index+1} de ${total} · ⭐ ${session.score} pts</div>
      <div class="q-text">${esc(q.text)} <button class="btn btn-icon btn-outline" style="width:36px;height:36px;min-height:36px;font-size:16px;vertical-align:middle;" onclick="sayQuestion(session.questions[session.index])" aria-label="Ouvir a pergunta">🔊</button></div>
      ${q.visual?`<div class="q-visual">${q.visual}</div>`:''}
      ${answerArea}
      <div class="row" id="retryActions" style="display:none; margin-top:6px;"></div>
    </div>
  </div>`;
};

/* Nova tentativa: só quando errou por escolha, ainda sobra vida depois do erro
   e a tentativa extra desta pergunta ainda não foi usada. (Aqui a vida ainda
   não foi descontada, por isso "> 1".) */
function willOfferRetry(correct, timedOut){
  return !correct && !timedOut && session.lives>1 && !session.retriedThisQuestion;
}
function submitAnswer(val, btnEl){
  if(session.answered) return;
  session.answered = true;
  const q = session.questions[session.index];
  const correct = String(val)===String(q.answer);
  const hideAnswer = willOfferRetry(correct, false); // se dá para tentar de novo, não entrega a resposta
  document.querySelectorAll('.opt-btn').forEach(b=>{
    b.disabled = true;
    if(b.dataset.val===String(q.answer)){ if(!hideAnswer) b.classList.add('correct'); }
    else if(b===btnEl && !correct) b.classList.add('wrong');
  });
  resolveAnswer(correct, false, val);
}
function submitNumeric(){
  if(session.answered) return;
  const input = $('#numInput');
  const val = (input.value||'').trim();
  if(val==='') { input.focus(); return; }
  session.answered = true;
  const q = session.questions[session.index];
  const correct = String(val)===String(q.answer);
  input.disabled = true;
  resolveAnswer(correct, false, val);
}

function handleTimeUp(){
  if(!session || session.answered) return;
  session.answered = true;
  const q = session.questions[session.index];
  document.querySelectorAll('.opt-btn').forEach(b=>{
    b.disabled = true;
    if(b.dataset.val===String(q.answer)) b.classList.add('correct');
  });
  const input = $('#numInput'); if(input) input.disabled = true;
  resolveAnswer(false, true, null);
}
function advanceAfterAnswer(){
  if(!session) return; // o jogador já saiu da fase
  if(session.lives<=0){ recordSessionEnd('lose'); goto('defeat'); return; }
  session.index++;
  session.answered=false;
  session.retriedThisQuestion = false;
  if(session.index>=session.questions.length){
    finishSession();
  } else {
    session.qStartedAt = Date.now();
    persistSession();
    goto('play');
  }
}
function showRetryActions(){
  const box = $('#retryActions');
  if(!box) return;
  box.style.display = 'flex';
  box.innerHTML = `
    <button class="btn btn-mint" onclick="retryQuestion()">🔁 Tentar de novo</button>
    <button class="btn btn-outline" onclick="skipRetryAndAdvance()">➡️ Próxima pergunta</button>
  `;
}
/* Pequena explosão no coração que acabou de ser perdido.
   A vida já foi descontada em session.lives, mas o coração dessa posição ainda
   aparece cheio na tela (ele só é redesenhado na tela seguinte). Os corações são
   perdidos da direita para a esquerda, então o que explode é o de índice session.lives.
   Quando a animação termina, chama done(). */
const HEART_BOOM_MS = 650;
function explodeLostHeart(done){
  const finish = ()=>{ if(typeof done==='function') done(); };
  const h = session ? document.querySelectorAll('.lives .heart')[session.lives] : null;
  if(!h || h.classList.contains('lost')){ finish(); return; }
  const reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  sfxExplosion();
  if(reduce){ h.classList.add('lost'); finish(); return; } // sem animação para quem prefere menos movimento (o som continua)
  const colors = ['#FF5C7A','#FF8FA3','#FFD23F','#FF9F43','#FFFFFF'];
  const N = 9;
  for(let i=0;i<N;i++){
    const ang = (Math.PI*2*i/N) + Math.random()*0.5;
    const dist = 26 + Math.random()*16;
    const sp = document.createElement('span');
    sp.className = 'heart-spark';
    sp.style.setProperty('--dx', Math.round(Math.cos(ang)*dist)+'px');
    sp.style.setProperty('--dy', Math.round(Math.sin(ang)*dist)+'px');
    sp.style.background = colors[i%colors.length];
    h.appendChild(sp);
  }
  h.classList.add('boom');
  setTimeout(()=>{
    h.querySelectorAll('.heart-spark').forEach(s=>s.remove());
    h.classList.remove('boom');
    h.classList.add('lost','pop-in');
  }, 480);
  setTimeout(()=>{
    if(!document.body.contains(h)) return; // o jogador saiu da tela durante a animação
    finish();
  }, HEART_BOOM_MS);
}
function lockRetryButtons(){
  document.querySelectorAll('#retryActions button').forEach(b=>{ b.disabled = true; });
}
function retryQuestion(){
  sfxClick();
  lockRetryButtons();
  explodeLostHeart(()=>{
    if(!session) return;
    session.retriedThisQuestion = true;
    session.answered = false;
    session.qStartedAt = Date.now();
    persistSession();
    goto('play');
  });
}
function skipRetryAndAdvance(){
  sfxClick();
  lockRetryButtons();
  explodeLostHeart(advanceAfterAnswer);
}
function resolveAnswer(correct, timedOut, given){
  clearQuestionTimer();
  const q = session.questions[session.index];
  const elapsed = Date.now() - session.qStartedAt;
  const ms = Math.max(0, Math.min(elapsed, TIME_LIMIT*1000));
  /* guarda a resposta para o feedback (fim da fase e tela de progresso) */
  session.log = session.log || [];
  session.log.push({
    q:q.text, spoken:q.spoken||null, visual:q.visual||null, topic:q.topic||'outros',
    answer:String(q.answer), given:(timedOut || given==null) ? null : String(given),
    ok:!!correct, timedOut:!!timedOut, ms
  });
  recordAnswerStats(q.topic||'outros', !!correct, !!timedOut, ms);
  let delay = 1200;
  let offerRetry = false;
  if(correct){
    sfxCorrect();
    let pts = 100;
    if(elapsed < 5000) pts += 20;
    session.score += pts;
    session.correct++;
    const okMsg = pick(CORRECT_MSGS);
    showFeedback(okMsg+' +'+pts, true, delay, okMsg);
  } else {
    sfxWrong();
    session.lives--;
    session.wrong++;
    delay = 2400;
    // Nova tentativa só é oferecida quando a atividade permite: resposta errada
    // por escolha (não por tempo esgotado), com vidas restantes, e ainda não
    // usada nesta pergunta — respeitando as regras de vidas e pontuação.
    offerRetry = !timedOut && session.lives>0 && !session.retriedThisQuestion;
    const msg = timedOut
      ? `⏰ Tempo esgotado! A resposta certa era ${q.answer}.`
      : offerRetry
        ? pick(WRONG_MSGS) // ainda vai tentar de novo: não entrega a resposta certa
        : `${pick(WRONG_MSGS)} A resposta certa era ${q.answer}.`;
    showFeedback(msg, false, delay);
  }
  persistSession();
  if(offerRetry){
    setTimeout(showRetryActions, delay);
  } else if(correct){
    setTimeout(advanceAfterAnswer, delay);
  } else {
    setTimeout(()=>explodeLostHeart(advanceAfterAnswer), delay); // perdeu uma vida: explosão antes de seguir
  }
}

function finishSession(){
  sfxWin();
  if(session.kind==='phase'){
    const n = session.phase;
    const ph = SAVE.progress.phases[n];
    const prevBest = ph.bestScore || 0;
    const bonusPts = 100 + session.lives*30;
    session.score += bonusPts;
    const stars = starsFor(session.wrong);
    const record = prevBest > 0 && session.score > prevBest;
    SAVE.totalScore += session.score;
    SAVE.bestScore = Math.max(SAVE.bestScore, SAVE.totalScore);
    ph.status='completed';
    ph.bestScore = Math.max(prevBest, session.score);
    ph.bestStars = Math.max(ph.bestStars||0, stars);
    ph.attempts++;
    if(n<4 && SAVE.progress.phases[n+1].status==='locked') SAVE.progress.phases[n+1].status='unlocked';
    if(n===4) SAVE.progress.bonus.status='unlocked';
    recordSessionEnd('win');
    SAVE.currentPhaseInProgress = null;
    persist();
    goto('victory', {bonusPts, stars, record});
  } else if(session.kind==='topic'){
    // Prática livre por assunto: conta pontuação geral, mas não mexe
    // no progresso das fases nem no desafio bônus.
    const stars = starsFor(session.wrong);
    SAVE.totalScore += session.score;
    SAVE.bestScore = Math.max(SAVE.bestScore, SAVE.totalScore);
    recordSessionEnd('win');
    SAVE.currentPhaseInProgress = null;
    persist();
    goto('victory', {stars, isTopic:true});
  } else {
    const stars = starsFor(session.wrong);
    SAVE.totalScore += session.score;
    SAVE.bestScore = Math.max(SAVE.bestScore, SAVE.totalScore);
    SAVE.progress.bonus.status='completed';
    SAVE.progress.bonus.result = {score:session.score, correct:session.correct, wrong:session.wrong, stars, time: Date.now()-session.startedAt};
    recordSessionEnd('win');
    SAVE.currentPhaseInProgress = null;
    persist();
    goto('finalResult', {stars});
  }
}

