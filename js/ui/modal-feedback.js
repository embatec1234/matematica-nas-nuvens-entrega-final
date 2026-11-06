/* ---------- MODAL / FEEDBACK helpers ---------- */
function showModal(html){
  $('#modal-root').innerHTML = `<div class="modal-overlay" id="modalOverlay">${html}</div>`;
}
function closeModal(){ $('#modal-root').innerHTML=''; }
function feedbackTextForSpeech(value){
  return String(value || '')
    // Ler só a mensagem, nunca a resposta correta nem a pontuação exibida.
    .split(/\s+A resposta certa era\s+/i)[0]
    .replace(/\s*[+＋]\s*\d+(?:[.,]\d+)?\s*(?:pontos?|pts?)?/gi, ' ')
    .replace(/\b(?:pontuação|pontos ganhos|score)\s*[:：]?\s*\d+\b/gi, ' ')
    .replace(/[⭐☆★✩✦✧🌟✨🎉👏💭🤔💙🌤️⏰]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}
function showFeedback(text, ok, duration=1200, spoken){
  const root = $('#feedback-root');
  root.innerHTML = `<div class="feedback-banner ${ok?'correct':'wrong'}" id="fbBanner">${text}</div>`;
  requestAnimationFrame(()=> $('#fbBanner') && $('#fbBanner').classList.add('show'));
  setTimeout(()=>{ const b=$('#fbBanner'); if(b) b.classList.remove('show'); }, duration-100);
  const messageOnly = feedbackTextForSpeech(spoken != null ? spoken : text);
  if(messageOnly) speak(messageOnly);
}
