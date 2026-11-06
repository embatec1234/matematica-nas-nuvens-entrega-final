/* ---- painel de progresso (tela inicial) ---- */
function phaseChipsHTML(){
  const p = SAVE.progress.phases, b = SAVE.progress.bonus;
  const chips = [1,2,3,4].map(n=>{
    const st = p[n].status;
    const cls = st === 'completed' ? 'done' : (st === 'locked' ? 'locked' : 'current');
    const ico = st === 'locked' ? '🔒' : PHASE_INFO[n].icon;
    const extra = st === 'completed'
      ? (p[n].bestStars > 0 ? starsHTML(p[n].bestStars) : '<span class="pc-ok">✅</span>')
      : (st === 'unlocked' ? '<span class="pc-ok">▶️</span>' : '');
    return `<div class="pchip ${cls}"><span class="pc-ico">${ico}</span><span class="pc-lab">Fase ${n}</span>${extra}</div>`;
  });
  const bc = b.status === 'completed' ? 'done' : (b.status === 'locked' ? 'locked' : 'current');
  const bStars = (b.status === 'completed' && b.result && b.result.stars) ? starsHTML(b.result.stars)
    : (b.status === 'completed' ? '<span class="pc-ok">✅</span>' : (b.status === 'unlocked' ? '<span class="pc-ok">▶️</span>' : ''));
  chips.push(`<div class="pchip ${bc}"><span class="pc-ico">${b.status==='locked'?'🔒':'🏆'}</span><span class="pc-lab">Bônus</span>${bStars}</div>`);
  return `<div class="phase-chips">${chips.join('')}</div>`;
}
function narratorRowHTML(msg){
  const ch = currentVoiceChar();
  return `
  <div class="mascot-row narrator">
    <div class="mascot live" aria-hidden="true">${ch.emoji}</div>
    <div class="speech"><strong>${esc(ch.name)}</strong><br>${esc(msg)}</div>
  </div>`;
}
function dashboardHTML(o, msg){
  const pct = Math.round(o.steps / 5 * 100);
  return `
  <div class="cloud-card dash">
    <div class="dash-head">
      <div class="dash-avatar" aria-hidden="true">${SAVE.profile.avatar}</div>
      <div class="dash-who">
        <div class="dash-name">${esc(o.name)}</div>
        <div class="dash-rank">${o.rank.icon} ${o.rank.name}</div>
      </div>
      <div class="pill">${DIFF_LABEL[SAVE.difficulty] || ''}</div>
    </div>
    <div class="dash-journey">
      <div class="dash-jl"><span>Minha jornada</span><b>${o.steps} de 5 etapas</b></div>
      <div class="progress-track" role="progressbar" aria-valuemin="0" aria-valuemax="5" aria-valuenow="${o.steps}"><div class="progress-fill" style="width:${pct}%;"></div></div>
    </div>
    ${phaseChipsHTML()}
    <div class="mini-stats">
      <div class="mini"><div class="m-ico">⭐</div><div class="m-num">${o.score}</div><div class="m-lab">Pontos</div></div>
      <div class="mini"><div class="m-ico">🎯</div><div class="m-num">${o.acc !== null ? o.acc + '%' : '—'}</div><div class="m-lab">Acertos</div></div>
      <div class="mini"><div class="m-ico">🔥</div><div class="m-num">${o.streak || '—'}</div><div class="m-lab">Sequência</div></div>
    </div>
    ${narratorRowHTML(msg)}
    <div class="row dash-actions">
      <button class="btn btn-outline btn-sm listen-btn" onclick="sayKey('home')">🔊 Ouvir</button>
      <button class="btn btn-coral btn-sm stop-btn" onclick="stopSpeaking()">⏹ Parar</button>
      <button class="btn btn-outline btn-sm" onclick="openVoices('start')">🎭 Trocar voz</button>
      <button class="btn btn-primary btn-sm" onclick="openProgress('start')">📊 Ver tudo</button>
    </div>
  </div>`;
}
function welcomeHTML(msg){
  return `
  <div class="cloud-card dash">
    ${narratorRowHTML(msg)}
    <div class="row dash-actions">
      <button class="btn btn-outline btn-sm listen-btn" onclick="sayKey('home')">🔊 Ouvir</button>
      <button class="btn btn-coral btn-sm stop-btn" onclick="stopSpeaking()">⏹ Parar</button>
      <button class="btn btn-outline btn-sm" onclick="openVoices('start')">🎭 Trocar voz</button>
    </div>
  </div>`;
}

/* a fala da tela inicial só toca sozinha depois do 1º toque do jogador (regra do navegador) */
let lastHomeSpeechAt = 0;
function maybeSpeakHome(msg){
  SPEECH_REG.home = msg;
  if(!userInteracted || !SAVE.settings.readAloudOn) return;
  if(Date.now() - lastHomeSpeechAt < 15000) return; // não repete se voltou rápido
  lastHomeSpeechAt = Date.now();
  speakSoon(msg, 'start', 350);
}

SCREENS.start = function(){
  const canContinue = hasSavedGame && SAVE.profile && SAVE.profile.name;
  let top;
  if(canContinue){
    const o = overview();
    const msg = progressMessage(o, false);
    top = dashboardHTML(o, msg);
    maybeSpeakHome(msg);
  } else {
    const ch = currentVoiceChar();
    const msg = `👋 Oi! Eu sou ${ch.art} ${ch.name}. Toque em Novo Jogo para começar a sua aventura!`;
    top = welcomeHTML(msg);
    maybeSpeakHome(msg);
  }
  return `
  <div class="screen">
    <div class="logo-wrap">
      <h1>☁️ Matemática nas Nuvens</h1>
      <div class="sub">Voe entre as nuvens aprendendo matemática!</div>
    </div>
    ${top}
    <div class="cloud-card stack">
      <button class="btn btn-primary" onclick="onNewGame()">${canContinue ? '🚀 Novo jogador' : '🚀 Novo Jogo'}</button>
      <button class="btn btn-mint" ${canContinue?'':'disabled'} onclick="onContinue()">▶️ Continuar</button>
      <button class="btn btn-sun" ${canContinue?'':'disabled'} onclick="sfxClick(); goto('activities')">🎯 Escolher atividade</button>
      ${PROFILES.list.length ? '<button class="btn btn-outline" onclick="openPlayers()">👥 Trocar de jogador</button>' : ''}
      <button class="btn btn-outline" onclick="goto('settings',{from:'start'})">⚙️ Configurações</button>
      <button class="btn btn-outline" onclick="onMultiplayerEntry()">👫 Multiplayer local</button>
    </div>
  </div>`;
};

/* "Novo Jogo" = um jogador novo. Os jogadores que já existem neste computador continuam guardados. */
function onNewGame(){ onNewPlayer(); }
function onContinue(){
  sfxClick();
  if(SAVE.currentPhaseInProgress){
    resumePhase();
  } else {
    goto('map');
  }
}

