/* ---- PAUSE ---- */
function pauseGame(){
  sfxClick();
  clearQuestionTimer();
  showModal(`
    <div class="modal-card">
      <div class="center-emoji">⏸️</div>
      <h3>Jogo pausado</h3>
      <div class="stack">
        <button class="btn btn-mint" onclick="closeModal(); resumeQuestionTimer();">Continuar</button>
        <button class="btn btn-outline" onclick="closeModal(); goto('settings',{from:'play'});">⚙️ Configurações</button>
        <button class="btn btn-outline" onclick="closeModal(); persistSession(); goto('map');">💾 Salvar e sair</button>
      </div>
    </div>`);
}

