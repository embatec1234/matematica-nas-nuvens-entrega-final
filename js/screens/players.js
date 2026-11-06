/* ---- JOGADORES: tela "Quem vai jogar?" (escolher, criar ou apagar perfis) ---- */
let playersBack = false;   /* true quando dá para voltar à tela inicial (quando não é a abertura do jogo) */

function openPlayers(){
  sfxClick();
  persistNow();
  playersBack = true;
  goto('players', {back:true});
}
function closePlayers(){
  sfxClick();
  goto('start');
}

SCREENS.players = function(data){
  playersBack = !!(data && data.back);
  const list = PROFILES.list.slice().sort((a,b)=>
    String(a.needsRename ? 'ÿ' : a.name).localeCompare(String(b.needsRename ? 'ÿ' : b.name), 'pt-BR'));
  const full = list.length >= MAX_PROFILES;
  const cards = list.map(p=>{
    const label = p.needsRename ? 'Jogador (escolher novo nome)' : p.name;
    const sub = p.needsRename ? 'Toque para escolher um nome da lista'
      : `Fases concluídas: ${p.done || 0}/4${p.bonusDone ? ' · 🏅 Bônus' : ''}`;
    return `
      <div class="player-row">
        <button class="player-card ${p.id===currentProfileId ? 'current':''}" onclick="selectProfile('${p.id}')">
          <span class="player-avatar" aria-hidden="true">${p.avatar || AVATARS[0]}</span>
          <span class="player-info">
            <span class="player-name">${esc(label)}</span>
            <span class="player-sub">${sub}</span>
          </span>
        </button>
        <button class="player-del" aria-label="Apagar jogador ${esc(label)}" title="Apagar jogador" onclick="confirmDeleteProfile('${p.id}')">🗑️</button>
      </div>`;
  }).join('');
  return `
  <div class="screen">
    <h2 style="color:#fff; text-shadow:0 3px 0 rgba(35,50,86,.25);">Quem vai jogar? 🎈</h2>
    <div class="cloud-card stack">
      <p class="voice-intro">Toque no seu nome para continuar o seu jogo. Cada jogador tem o seu próprio progresso.</p>
      <div class="player-list">${cards || '<p class="note">Ainda não tem ninguém por aqui.</p>'}</div>
      <button class="btn btn-mint" ${full?'disabled':''} onclick="onNewPlayer()">➕ Novo jogador</button>
      ${full ? `<p class="note warn">Limite de ${MAX_PROFILES} jogadores neste computador. Apague algum para criar outro.</p>` : ''}
      ${playersBack ? '<button class="btn btn-outline" onclick="closePlayers()">⌂ Tela inicial</button>' : ''}
    </div>
  </div>`;
};
