/* ---- SETTINGS ---- */
let settingsBack = 'start';
SCREENS.settings = function(data){
  const back = (data&&data.from)||'start';
  settingsBack = back;
  const s = SAVE.settings;
  const vc = currentVoiceChar();
  return `
  <div class="screen">
    <h2 style="color:#fff;">Configurações</h2>
    <div class="cloud-card stack">
      <div class="settings-group">
        <h3>Áudio</h3>
        <div class="setting-row">
          <label for="musicOn">Música</label>
          <label class="switch"><input type="checkbox" id="musicOn" ${s.musicOn?'checked':''} onchange="toggleSetting('musicOn', this.checked)"><span class="slider-toggle"></span></label>
        </div>
        <div class="setting-row">
          <label for="musicVol">Volume da música</label>
          <input type="range" id="musicVol" min="0" max="1" step="0.05" value="${s.musicVol}" oninput="updateSetting('musicVol', parseFloat(this.value))">
        </div>
        <div class="setting-row music-choice-row">
          <label for="musicTrack">Melodia</label>
          <select id="musicTrack" onchange="updateMusicTrack(this.value)">
            <option value="random" ${s.musicTrack==='random'?'selected':''}>Aleatória</option>
            ${MUSIC_TRACKS.map((track, index)=>`<option value="${index}" ${String(s.musicTrack)===String(index)?'selected':''}>${track.name}</option>`).join('')}
          </select>
          <button class="btn btn-outline music-next" onclick="changeMusic()" aria-label="Trocar música">Próxima</button>
        </div>
        <div class="setting-row">
          <label for="sfxOn">Efeitos sonoros</label>
          <label class="switch"><input type="checkbox" id="sfxOn" ${s.sfxOn?'checked':''} onchange="toggleSetting('sfxOn', this.checked)"><span class="slider-toggle"></span></label>
        </div>
        <div class="setting-row">
          <label for="sfxVol">Volume dos efeitos</label>
          <input type="range" id="sfxVol" min="0" max="1" step="0.05" value="${s.sfxVol}" oninput="updateSetting('sfxVol', parseFloat(this.value))">
        </div>
        <div class="setting-row">
          <label for="readAloudOn">🔊 Ler feedbacks e tutorial em voz alta</label>
          <label class="switch"><input type="checkbox" id="readAloudOn" ${s.readAloudOn?'checked':''} onchange="toggleReadAloud(this.checked)"><span class="slider-toggle"></span></label>
        </div>
        <div class="setting-row">
          <label>🎭 Voz do narrador</label>
          <button class="btn btn-outline btn-sm" style="width:auto;" onclick="openVoices('settings')">${vc.emoji} ${esc(vc.name)}</button>
        </div>
      </div>
      <div class="settings-group">
        <h3>Tela</h3>
        <div class="setting-row">
          <label>Tela cheia</label>
          <button class="btn btn-outline" style="width:auto; padding:8px 16px; min-height:40px;" onclick="toggleFullscreen()">Ativar</button>
        </div>
      </div>
      <div class="settings-group">
        <h3>Jogadores neste computador</h3>
        <p style="color:var(--ink-soft); font-weight:600; font-size:14px; margin:0 0 10px;">Cada criança tem o seu perfil, com nome, avatar e progresso próprios. Para outra criança jogar, troque de jogador: o progresso de ninguém se perde.</p>
        <button class="btn btn-primary" style="margin-bottom:10px;" onclick="openPlayers()">👥 Trocar de jogador</button>
        <button class="btn btn-coral" onclick="confirmResetProgress()">🔄 Zerar o meu progresso</button>
      </div>
      <button class="btn btn-ghost" onclick="restoreDefaults()">↺ Restaurar configurações padrão</button>
      <button class="btn btn-primary" onclick="closeSettings('${back}')">Salvar e voltar</button>
    </div>
  </div>`;
};
function toggleSetting(key, val){ SAVE.settings[key]=val; persist(); if(key==='musicOn'){ val?startMusic():stopMusic(); } sfxClick(); }
function updateSetting(key, val){ SAVE.settings[key]=val; persist(); }
function updateMusicTrack(value){
  SAVE.settings.musicTrack = value;
  persist();
  startMusic();
  sfxClick();
}
function toggleFullscreen(){
  sfxClick();
  if(!document.fullscreenElement){ document.documentElement.requestFullscreen().catch(()=>{}); SAVE.settings.fullscreen=true; }
  else { document.exitFullscreen().catch(()=>{}); SAVE.settings.fullscreen=false; }
  persist();
}
function restoreDefaults(){
  sfxClick();
  SAVE.settings = defaultSave().settings;
  persist();
  goto('settings', {from: settingsBack});
}
/* zerar o progresso também exige o código secreto do jogador */
function confirmResetProgress(){
  sfxClick();
  if(!currentProfileId){ showResetConfirm(); return; }
  requireProfileCode(currentProfileId, showResetConfirm);
}
function showResetConfirm(){
  showModal(`
    <div class="modal-card">
      <div class="center-emoji">🔄</div>
      <h3>Zerar o seu progresso?</h3>
      <p>Isso apaga as fases, estrelas e pontos de <b>${esc(SAVE.profile.name || 'este jogador')}</b> para recomeçar do zero. O seu nome e avatar continuam, e os outros jogadores não mudam.</p>
      <div class="stack">
        <button class="btn btn-coral" onclick="resetProgress()">Sim, zerar o meu progresso</button>
        <button class="btn btn-outline" onclick="closeModal()">Cancelar</button>
      </div>
    </div>`);
}
function resetProgress(){
  const keepSettings = SAVE.settings;
  const keepProfile = SAVE.profile;
  SAVE = defaultSave();
  SAVE.settings = keepSettings;
  SAVE.profile = keepProfile;
  session = null;
  mp = null;
  persistNow();
  closeModal();
  sfxClick();
  goto('difficulty');
}
function closeSettings(back){
  sfxClick();
  goto(back==='play' && session ? 'play' : back);
}

