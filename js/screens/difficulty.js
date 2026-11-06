/* ---- DIFFICULTY ---- */
const DIFFS = [
  {id:'facil', label:'Fácil 🌤️', desc:'Números pequenos e mais ajuda visual.'},
  {id:'medio', label:'Médio ⛅', desc:'Questões um pouco mais desafiadoras.'},
  {id:'dificil', label:'Difícil 🌩️', desc:'Para quem já é craque em matemática!'}
];
SCREENS.difficulty = function(){
  return `
  <div class="screen">
    <h2 style="color:#fff; text-shadow:0 3px 0 rgba(35,50,86,.25);">Escolha a dificuldade</h2>
    <div class="cloud-card stack">
      ${DIFFS.map(d=>`
        <button class="diff-card ${SAVE.difficulty===d.id?'selected':''}" onclick="pickDifficulty('${d.id}')">
          <span class="diff-title">${d.label}</span>
          <span class="diff-desc">${d.desc}</span>
        </button>`).join('')}
      <button class="btn btn-primary" style="margin-top:8px;" onclick="afterDifficulty()">Continuar</button>
      <button class="btn btn-outline" onclick="goto('start')">⌂ Tela inicial</button>
    </div>
  </div>`;
};
function pickDifficulty(id){
  sfxClick();
  SAVE.difficulty = id;
  persist();
  document.querySelectorAll('.diff-card').forEach(el=>el.classList.remove('selected'));
  goto('difficulty');
}
function afterDifficulty(){
  sfxClick();
  if(!SAVE.tutorialSeen){ goto('tutorial'); } else { goto('map'); }
}

