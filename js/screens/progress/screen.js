SCREENS.progress = function(){
  const o = overview();
  const msg = progressMessage(o, true);
  SPEECH_REG.progress = msg;
  const evo = evolutionInfo();
  SPEECH_REG.evolution = evo.msg;
  speakSoon(msg, 'progress', 350);
  const st = SAVE.stats;
  return `
  <div class="screen">
    <div class="top-bar">
      <div class="pill">${SAVE.profile.avatar} ${esc(o.name)}</div>
      <div class="pill">${o.rank.icon} ${o.rank.name}</div>
    </div>
    <h2 style="color:#fff; text-shadow:0 3px 0 rgba(35,50,86,.25); margin:0;">📊 Meu progresso</h2>

    <div class="cloud-card">
      ${narratorRowHTML(msg)}
      <div class="row dash-actions" style="margin-top:12px;">
        <button class="btn btn-outline btn-sm listen-btn" onclick="sayKey('progress')">🔊 Ouvir</button>
        <button class="btn btn-coral btn-sm stop-btn" onclick="stopSpeaking()">⏹ Parar</button>
        <button class="btn btn-outline btn-sm" onclick="openVoices('start')">🎭 Trocar voz</button>
      </div>
    </div>

    <div class="cloud-card">
      <h3 class="sec-title">📈 Minha evolução</h3>
      <div class="evo-msg">
        <p>${esc(evo.msg)}</p>
        <button class="btn btn-outline btn-sm" onclick="sayKey('evolution')" aria-label="Ouvir a frase">🔊 Ouvir</button>
      </div>
      ${evolutionHTML(evo)}
    </div>

    <div class="cloud-card">
      <h3 class="sec-title">Resumo</h3>
      <div class="stat-grid">
        ${tileHTML('⭐', o.score, 'Pontos totais')}
        ${tileHTML('🏆', SAVE.bestScore, 'Melhor pontuação')}
        ${tileHTML('✅', o.correct, 'Acertos')}
        ${tileHTML('❌', o.wrong, 'Erros')}
        ${tileHTML('🎯', o.acc !== null ? o.acc + '%' : '—', 'Aproveitamento')}
        ${tileHTML('⏱️', o.avgSec !== null ? fmtSec(o.avgSec) + 's' : '—', 'Tempo por resposta')}
        ${tileHTML('🔥', o.streak || '—', 'Maior sequência')}
        ${tileHTML('🎮', st.sessions ? `${st.wins}/${st.sessions}` : '—', 'Fases vencidas')}
      </div>
    </div>

    <div class="cloud-card">
      <h3 class="sec-title">Minhas fases</h3>
      <div class="ph-list">
        ${[1,2,3,4].map(phaseCardHTML).join('')}
        ${bonusCardHTML()}
      </div>
    </div>

    <div class="cloud-card">
      <h3 class="sec-title">Como estou em cada assunto</h3>
      ${topicsHTML(o)}
    </div>

    <div class="cloud-card">
      <h3 class="sec-title">Últimas jogadas</h3>
      ${historyHTML()}
    </div>

    <div class="cloud-card stack">
      <button class="btn btn-primary" onclick="goto('${progressBack}')">${progressBack==='map' ? '🗺️ Voltar ao mapa' : '⌂ Tela inicial'}</button>
    </div>
  </div>`;
};

