/* ---------- APP STATE / ROUTER ---------- */
let session = null; // active phase session
let mp = null; // multiplayer session
let currentScreen = 'loading';

/* ao sair dessas telas a narração é interrompida (na tela de jogo ela termina sozinha) */
const LONG_SPEECH_SCREENS = ['start','progress','victory','defeat','finalResult','voices','tutorial'];
function goto(screen, data){
  if(LONG_SPEECH_SCREENS.includes(currentScreen)) stopSpeaking();
  currentScreen = screen; render(screen, data); window.scrollTo(0,0);
  if(screen==='map') scrollMapToCurrent();
}

function render(screen, data){
  const app = $('#app');
  app.innerHTML = SCREENS[screen] ? SCREENS[screen](data) : '<p>Tela não encontrada.</p>';
  refreshScene();
  if(screen==='play' && session && !session.answered){
    startQuestionTimer(handleTimeUp);
  } else if(screen==='mpPlay' && mp && !mp.answered){
    startQuestionTimer(handleMpTimeUp);
  } else {
    clearQuestionTimer();
  }
}

