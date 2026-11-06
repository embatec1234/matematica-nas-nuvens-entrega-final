/* ---- TUTORIAL ---- */
const TUT_SLIDES = [
  'Oi! Eu sou {art} {nome}, seu guia nas nuvens! Vamos aprender juntos?',
  'Em cada fase, você responde perguntas de matemática tocando na resposta certa.',
  'Você começa cada fase com 3 corações ❤️❤️❤️. Errar tira um coração.',
  'Acertar te dá pontos ⭐! Complete a fase para liberar a próxima nuvem no mapa.',
  'No fim de cada fase eu mostro o que você acertou e o que errou, para você treinar. Seu progresso é salvo automaticamente!'
];
function tutText(i){
  const c = currentVoiceChar();
  return TUT_SLIDES[i].replace('{art}', c.art).replace('{nome}', c.name);
}
let tutIndex=0;
SCREENS.tutorial = function(data){
  if(!(data && data.keep)) tutIndex=0;
  return renderTutSlide();
};
function renderTutSlide(){
  const text = tutText(tutIndex);
  const ch = currentVoiceChar();
  SPEECH_REG.tut = text;
  setTimeout(()=>{ if(currentScreen==='tutorial') speak(text); }, 150); // pequena pausa para não cortar o clique/transição
  return `
  <div class="screen">
    <h2 style="color:#fff;">Como jogar</h2>
    <div class="cloud-card stack">
      <div class="mascot-row">
        <div class="mascot live">${ch.emoji}</div>
        <div class="speech">${text}</div>
        <button class="btn btn-icon btn-outline" onclick="sayKey('tut')" aria-label="Ouvir novamente">🔊</button>
      </div>
      <div class="tutorial-dots">
        ${TUT_SLIDES.map((_,i)=>`<span class="dot ${i===tutIndex?'active':''}"></span>`).join('')}
      </div>
      <button class="btn btn-ghost" onclick="openVoices('tutorial')">🎭 Trocar a voz do narrador</button>
      <div class="row">
        <button class="btn btn-ghost" onclick="skipTutorial()">Pular</button>
        <button class="btn btn-primary" onclick="nextTutSlide()">${tutIndex===TUT_SLIDES.length-1?'Vamos lá! 🚀':'Próximo'}</button>
      </div>
    </div>
  </div>`;
}
function nextTutSlide(){
  sfxClick();
  if(tutIndex<TUT_SLIDES.length-1){ tutIndex++; $('#app').innerHTML = renderTutSlide(); }
  else finishTutorial();
}
function skipTutorial(){ sfxClick(); stopSpeaking(); finishTutorial(); }
function finishTutorial(){ SAVE.tutorialSeen=true; persist(); goto('map'); }

