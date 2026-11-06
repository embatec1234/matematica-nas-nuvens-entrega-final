/* ---- revisão de acertos e erros (fim de fase) ---- */
let reviewData = [];
let reviewFilter = 'all';
function spokenQ(e){
  const q = e.spoken || e.q;
  return /[.!?]$/.test(q) ? q : q + '.';
}
function reviewLine(e, i){
  const q = spokenQ(e);
  if(e.ok) return `Pergunta ${i+1}. ${q} Você acertou! A resposta é ${e.answer}.`;
  if(e.timedOut) return `Pergunta ${i+1}. ${q} O tempo acabou. A resposta certa é ${e.answer}.`;
  return `Pergunta ${i+1}. ${q} Você respondeu ${e.given}. A resposta certa é ${e.answer}.`;
}
function reviewSpeak(i){ if(reviewData[i]) speak(reviewLine(reviewData[i], i), {force:true}); }
function reviewSpeakAll(){
  const list = reviewData.map((e,i)=>({e,i})).filter(x=>
    reviewFilter === 'all' || (reviewFilter === 'ok' && x.e.ok) || (reviewFilter === 'bad' && !x.e.ok));
  if(!list.length) return;
  speak(list.map(x=>reviewLine(x.e, x.i)).join(' '), {force:true});
}
function reviewItemHTML(e, i){
  const badge = e.ok ? '✅' : (e.timedOut ? '⏰' : '❌');
  let ans;
  if(e.ok) ans = `<span class="rv-mine">Você respondeu <b>${esc(e.given)}</b></span>`;
  else if(e.timedOut) ans = `<span class="rv-mine">Tempo esgotado</span><span class="rv-right">Certo: <b>${esc(e.answer)}</b></span>`;
  else ans = `<span class="rv-mine">Você: <b>${esc(e.given)}</b></span><span class="rv-right">Certo: <b>${esc(e.answer)}</b></span>`;
  return `
  <div class="rv-item ${e.ok?'ok':'bad'}" data-ok="${e.ok?1:0}">
    <div class="rv-num">${i+1}</div>
    <div class="rv-body">
      <div class="rv-q">${esc(e.q)}</div>
      ${e.visual ? `<div class="rv-vis">${esc(e.visual)}</div>` : ''}
      <div class="rv-ans">${ans}</div>
    </div>
    <div class="rv-side">
      <span class="rv-badge" aria-hidden="true">${badge}</span>
      <button class="rv-say" onclick="reviewSpeak(${i})" aria-label="Ouvir a pergunta ${i+1}">🔊</button>
    </div>
  </div>`;
}
function reviewHTML(log){
  reviewData = log || [];
  reviewFilter = 'all';
  if(!reviewData.length) return '';
  const ok = reviewData.filter(e=>e.ok).length, bad = reviewData.length - ok;
  return `
  <div class="review">
    <div class="rv-head">
      <h3 class="rv-title">📋 Acertos e erros</h3>
      <div class="rv-actions">
        <button class="btn btn-outline btn-sm listen-btn" onclick="reviewSpeakAll()">🔊 Ouvir a lista</button>
        <button class="btn btn-coral btn-sm stop-btn" onclick="stopSpeaking()">⏹ Parar</button>
      </div>
    </div>
    <div class="rv-chips">
      <button class="rv-chip active" data-f="all" onclick="setReviewFilter('all')">Todas (${reviewData.length})</button>
      <button class="rv-chip" data-f="ok" onclick="setReviewFilter('ok')">✅ Acertos (${ok})</button>
      <button class="rv-chip" data-f="bad" onclick="setReviewFilter('bad')">❌ Erros (${bad})</button>
    </div>
    <div class="rv-list">${reviewData.map(reviewItemHTML).join('')}</div>
    <div class="rv-empty" id="rvEmpty"></div>
  </div>`;
}
function setReviewFilter(f){
  sfxClick();
  reviewFilter = f;
  document.querySelectorAll('.rv-chip').forEach(c=>c.classList.toggle('active', c.dataset.f === f));
  let visible = 0;
  document.querySelectorAll('.rv-item').forEach(it=>{
    const ok = it.dataset.ok === '1';
    const show = f === 'all' || (f === 'ok' && ok) || (f === 'bad' && !ok);
    it.classList.toggle('hide', !show);
    if(show) visible++;
  });
  const empty = $('#rvEmpty');
  if(empty){
    empty.classList.toggle('show', visible === 0);
    empty.textContent = f === 'bad' ? 'Nenhum erro! Você foi incrível! 🎉' : 'Nenhum acerto desta vez. Vamos tentar de novo! 💪';
  }
}

