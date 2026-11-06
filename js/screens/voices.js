/* ---- ESCOLHA DE VOZ DO NARRADOR ---- */
let voicesReturn = {screen:'start', data:undefined};
function openVoices(from){
  sfxClick();
  if(from === 'settings') voicesReturn = {screen:'settings', data:{from:settingsBack}};
  else if(from === 'tutorial') voicesReturn = {screen:'tutorial', data:{keep:true}};
  else voicesReturn = {screen:'start', data:undefined};
  goto('voices');
}
function closeVoices(){
  sfxClick();
  goto(voicesReturn.screen, voicesReturn.data);
}
function escAttr(x){ return String(x).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;'); }
function deviceVoiceSelectHTML(){
  const list = ptVoices();
  if(!list.length){
    return '<p class="note">Não encontrei vozes em português neste aparelho ainda. O navegador vai usar a voz padrão dele.</p>';
  }
  return `<select id="deviceVoice" onchange="pickDeviceVoice(this.value)" aria-label="Voz do aparelho">
    <option value="auto">Automática (recomendado)</option>
    ${list.map(v=>`<option value="${escAttr(v.voiceURI)}" ${SAVE.settings.voiceURI===v.voiceURI?'selected':''}>${esc(v.name)} (${esc(v.lang)})${v.localService?'':' · online'}</option>`).join('')}
  </select>`;
}
/* mostra qual voz a Nuvi (IA) vai usar neste aparelho */
function aiVoiceStatusHTML(){
  if(!ttsSupported()) return '';
  const best = bestNaturalVoice();
  if(best) return `<div class="note">✨ A Nuvi vai usar a voz de IA do seu aparelho: <b>${esc(best.name)}</b>.</div>`;
  return `<div class="note warn">✨ Este aparelho não tem voz de IA natural instalada, então a Nuvi vai usar a melhor voz disponível. Para ouvir uma voz de IA mais natural, abra o jogo no Microsoft Edge (vozes “Natural”) ou no Chrome com internet.</div>`;
}
function pickVoiceChar(id){
  const ch = VOICE_CHARS.find(v=>v.id === id); if(!ch) return;
  SAVE.settings.voiceChar = id;
  persist();
  sfxClick();
  document.querySelectorAll('.voice-card').forEach(el=>{
    const on = el.dataset.id === id;
    el.classList.toggle('selected', on);
    el.setAttribute('aria-pressed', on ? 'true' : 'false');
  });
  speak(ch.sample, {force:true});
}
function pickDeviceVoice(uri){
  SAVE.settings.voiceURI = uri || 'auto';
  persist();
  sfxClick();
  speak(currentVoiceChar().sample, {force:true});
}
SCREENS.voices = function(){
  const cur = currentVoiceChar();
  const s = SAVE.settings;
  return `
  <div class="screen">
    <h2 style="color:#fff; text-shadow:0 3px 0 rgba(35,50,86,.25);">Voz do narrador 🎭</h2>
    <div class="cloud-card stack">
      <p class="voice-intro">Toque em um personagem para ouvir e escolher quem vai falar com você!</p>
      ${ttsSupported() ? '' : '<div class="note warn">Este navegador não tem voz falada. Tente abrir o jogo no Chrome ou no Edge.</div>'}
      <div class="setting-row">
        <label for="voiceReadOn">🔊 Narração ligada</label>
        <label class="switch"><input type="checkbox" id="voiceReadOn" ${s.readAloudOn?'checked':''} onchange="toggleReadAloud(this.checked)"><span class="slider-toggle"></span></label>
      </div>
      <div class="voice-grid">
        ${VOICE_CHARS.map(v=>`
          <button class="voice-card ${v.id===cur.id?'selected':''}" data-id="${v.id}" aria-pressed="${v.id===cur.id}" onclick="pickVoiceChar('${v.id}')">
            <span class="vc-emoji" aria-hidden="true">${v.emoji}</span>
            <span class="vc-name">${esc(v.name)}</span>
            <span class="vc-desc">${esc(v.desc)}</span>
          </button>`).join('')}
      </div>
      <div id="aiVoiceStatus">${aiVoiceStatusHTML()}</div>
      <details class="voice-adv">
        <summary>⚙️ Voz do aparelho (avançado)</summary>
        <div id="deviceVoiceBox">${deviceVoiceSelectHTML()}</div>
        <p class="note">Os personagens usam as vozes em português que o seu aparelho tem. Para mudar o som da voz, escolha outra voz aqui, ou abra o jogo em outro navegador (Edge e Chrome têm boas vozes em português).</p>
      </details>
      <button class="btn btn-primary" onclick="closeVoices()">Pronto ✅</button>
    </div>
  </div>`;
};

