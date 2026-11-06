/* ---------- INIT ---------- */
async function init(){
  paintClouds();
  await loadSave();
  if(SAVE.settings.musicOn) startMusic();
  // Se já existem jogadores neste computador, primeiro pergunta quem vai jogar.
  // Se não existe ninguém ainda, abre a tela inicial com o botão Novo Jogo.
  if(PROFILES.list.length) goto('players', {back:false});
  else goto('start');
}
init();