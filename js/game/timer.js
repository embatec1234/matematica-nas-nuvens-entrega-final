/* ---------- CRONÔMETRO POR PERGUNTA ---------- */
const TIME_LIMIT = 35; // segundos disponíveis para responder cada pergunta
let timerInterval = null;
let currentTimeLeft = TIME_LIMIT;
let timerExpireCb = null;
function clearQuestionTimer(){ if(timerInterval){ clearInterval(timerInterval); timerInterval=null; } }
function startQuestionTimer(onExpire){
  clearQuestionTimer();
  currentTimeLeft = TIME_LIMIT;
  timerExpireCb = onExpire;
  updateTimerUI();
  timerInterval = setInterval(tickQuestionTimer, 1000);
}
function resumeQuestionTimer(){
  if(!timerExpireCb || timerInterval) return;
  updateTimerUI();
  timerInterval = setInterval(tickQuestionTimer, 1000);
}
function tickQuestionTimer(){
  currentTimeLeft--;
  updateTimerUI();
  if(currentTimeLeft<=0){
    clearQuestionTimer();
    const cb = timerExpireCb; timerExpireCb=null;
    if(cb) cb();
  }
}
function updateTimerUI(){
  const fill = $('#timerFill'); const num = $('#timerNum');
  if(fill){ fill.style.width = Math.max(0,(currentTimeLeft/TIME_LIMIT*100))+'%'; fill.classList.toggle('low', currentTimeLeft<=5); }
  if(num) num.textContent = Math.max(0,currentTimeLeft)+'s';
}
function timerRowHTML(){
  return `<div class="timer-row" aria-label="Tempo restante para responder">
    <span aria-hidden="true">⏱️</span>
    <div class="timer-track"><div class="timer-fill" id="timerFill" style="width:100%;"></div></div>
    <div class="timer-num" id="timerNum">${TIME_LIMIT}s</div>
  </div>`;
}

