/* ---- MULTIPLAYER (local, priority 3 — simple) ---- */
function onMultiplayerEntry(){
  sfxClick();
  goto('mpSetup');
}
/* nomes do multiplayer: só da lista (jogadores deste computador + banco de nomes) */
function mpProfileNames(){
  return PROFILES.list.filter(p=>!p.needsRename && p.first).map(p=>p.first);
}
function mpNameOptionsHTML(n){
  const mine = mpProfileNames();
  const def = (n === 1 && SAVE.profile && SAVE.profile.first && mine.includes(SAVE.profile.first)) ? SAVE.profile.first : '';
  const opt = (v, label)=>`<option value="${esc(v)}" ${v===def && v!=='' ? 'selected':''}>${esc(label)}</option>`;
  return `<option value="">Jogador ${n}</option>`
    + (mine.length ? `<optgroup label="Jogadores deste computador">${Array.from(new Set(mine)).map(v=>opt(v,v)).join('')}</optgroup>` : '')
    + `<optgroup label="Outros nomes">${NAME_BANK.first.map(v=>opt(v,v)).join('')}</optgroup>`;
}
function mpValidName(v, n){
  v = String(v || '').trim();
  const allowed = NAME_BANK.first.includes(v) || mpProfileNames().includes(v);
  return allowed ? v : 'Jogador ' + n;
}
SCREENS.mpSetup = function(){
  return `
  <div class="screen">
    <h2 style="color:#fff;">Multiplayer local 👫</h2>
    <div class="cloud-card stack">
      <p style="color:var(--ink-soft); font-weight:600;">Dois jogadores no mesmo aparelho competem respondendo perguntas por turno.</p>
      <label class="diff-title" for="mp1">Jogador 1</label>
      <select id="mp1" class="name-select">${mpNameOptionsHTML(1)}</select>
      <label class="diff-title" for="mp2">Jogador 2</label>
      <select id="mp2" class="name-select">${mpNameOptionsHTML(2)}</select>
      <button class="btn btn-primary" onclick="startMultiplayer()">Começar disputa 🏁</button>
      <button class="btn btn-ghost" onclick="goto('start')">Voltar</button>
    </div>
  </div>`;
};
function startMultiplayer(){
  const n1 = mpValidName($('#mp1').value, 1);
  const n2 = mpValidName($('#mp2').value, 2);
  sfxClick();
  const QN = 6;
  mp = {
    players:[
      {name:n1, correct:0, wrong:0, totalTime:0, questions: buildQuestionSet(pick([1,2,3]), SAVE.difficulty||'facil', QN)},
      {name:n2, correct:0, wrong:0, totalTime:0, questions: buildQuestionSet(pick([1,2,3]), SAVE.difficulty||'facil', QN)}
    ],
    turn:0, index:0, qStart:Date.now(), answered:false
  };
  goto('mpPlay');
}
SCREENS.mpPlay = function(){
  const p = mp.players[mp.turn];
  const q = p.questions[mp.index];
  let answerArea='';
  if(q.type==='multipla'){
    answerArea = `<div class="options-grid">${q.options.map(o=>`<button class="opt-btn" data-val="${esc(o)}" onclick="mpSubmit('${esc(o)}', this)">${esc(o)}</button>`).join('')}</div>`;
  } else {
    answerArea = `<div class="numeric-row"><input type="text" inputmode="numeric" id="mpNumInput" placeholder="?"><button class="btn btn-primary" style="width:auto;" onclick="mpSubmitNumeric()">Responder</button></div>`;
  }
  return `
  <div class="screen">
    <div class="top-bar"><div class="pill">Vez de: ${esc(p.name)}</div><div class="pill">Pergunta ${mp.index+1}/${p.questions.length}</div></div>
    <div class="cloud-card question-box">
      ${timerRowHTML()}
      <div class="q-text">${esc(q.text)} <button class="btn btn-icon btn-outline" style="width:36px;height:36px;min-height:36px;font-size:16px;vertical-align:middle;" onclick="sayQuestion(mp.players[mp.turn].questions[mp.index])" aria-label="Ouvir a pergunta">🔊</button></div>
      ${q.visual?`<div class="q-visual">${q.visual}</div>`:''}
      ${answerArea}
    </div>
  </div>`;
};
function mpResolve(correct, timedOut){
  clearQuestionTimer();
  const p = mp.players[mp.turn];
  const q = p.questions[mp.index];
  const elapsed = Date.now()-mp.qStart;
  p.totalTime += elapsed;
  let delay = 1200;
  if(correct){
    p.correct++; sfxCorrect();
    const okMsg = pick(CORRECT_MSGS);
    showFeedback(okMsg, true, delay, okMsg);
  } else {
    p.wrong++; sfxWrong();
    delay = 2400;
    const msg = timedOut
      ? `⏰ Tempo esgotado! A resposta certa era ${q.answer}.`
      : `${pick(WRONG_MSGS)} A resposta certa era ${q.answer}.`;
    showFeedback(msg, false, delay);
  }
  setTimeout(()=>{
    mp.turn = mp.turn===0?1:0;
    if(mp.turn===0) mp.index++;
    mp.qStart = Date.now();
    mp.answered = false;
    if(mp.index>=mp.players[0].questions.length){ goto('mpResult'); }
    else goto('mpPlay');
  }, delay);
}
function mpSubmit(val, btnEl){
  if(mp.answered) return;
  mp.answered = true;
  const p = mp.players[mp.turn]; const q = p.questions[mp.index];
  document.querySelectorAll('.opt-btn').forEach(b=>b.disabled=true);
  mpResolve(String(val)===String(q.answer));
}
function mpSubmitNumeric(){
  if(mp.answered) return;
  const input = $('#mpNumInput'); const val=(input.value||'').trim(); if(val==='')return;
  mp.answered = true;
  const p = mp.players[mp.turn]; const q = p.questions[mp.index];
  input.disabled=true;
  mpResolve(String(val)===String(q.answer));
}
function handleMpTimeUp(){
  if(!mp || mp.answered) return;
  mp.answered = true;
  const p = mp.players[mp.turn]; const q = p.questions[mp.index];
  document.querySelectorAll('.opt-btn').forEach(b=>{
    b.disabled = true;
    if(b.dataset.val===String(q.answer)) b.classList.add('correct');
  });
  const input = $('#mpNumInput'); if(input) input.disabled = true;
  mpResolve(false, true);
}
SCREENS.mpResult = function(){
  const [a,b] = mp.players;
  let winner;
  if(a.correct!==b.correct) winner = a.correct>b.correct?a:b;
  else winner = a.totalTime<=b.totalTime?a:b;
  return `
  <div class="screen">
    <div class="cloud-card" style="text-align:center;">
      <div class="center-emoji">🏆</div>
      <h2>${esc(winner.name)} venceu!</h2>
      <div class="row">
        ${mp.players.map(p=>`
          <div class="stat-box" style="flex:1;">
            <div class="lab">${esc(p.name)}</div>
            <div class="num">${p.correct} ✅</div>
            <div class="lab">${p.wrong} erros · ${(p.totalTime/1000).toFixed(1)}s</div>
          </div>`).join('')}
      </div>
      <button class="btn btn-primary" style="margin-top:16px;" onclick="mp=null; goto('start');">Voltar ao início</button>
    </div>
  </div>`;
};

