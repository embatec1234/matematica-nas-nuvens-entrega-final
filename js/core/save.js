/* ---------- SAVE PADRÃO ---------- */
function defaultPhase(status){
  return {status, bestScore:0, attempts:0, plays:0, bestStars:0, lastCorrect:null, lastWrong:null};
}
function defaultSave(){
  return {
    profile:{name:'', first:'', last:'', avatar:AVATARS[0]},
    difficulty:'facil',
    tutorialSeen:false,
    progress:{
      phases:{
        1:defaultPhase('unlocked'),
        2:defaultPhase('locked'),
        3:defaultPhase('locked'),
        4:defaultPhase('locked')
      },
      bonus:{status:'locked', result:null, plays:0}
    },
    totalScore:0,
    bestScore:0,
    settings:{musicOn:true, sfxOn:true, musicVol:0.5, sfxVol:0.7, musicTrack:'random', fullscreen:false, readAloudOn:true, voiceChar:'nino', voiceURI:'auto'},
    /* desempenho geral do jogador (alimenta o feedback da tela inicial) */
    stats:{answered:0, totalCorrect:0, totalWrong:0, totalTimeouts:0, totalAnswerMs:0, bestStreak:0, sessions:0, wins:0, losses:0, topics:{}},
    history:[], /* últimas jogadas: {t, kind, phase, diff, result, score, correct, wrong, ms} */
    currentPhaseInProgress:null /* {phase, index, lives, score, correct, wrong, log} para retomar */
  };
}

/* SAVE = o jogo do jogador ATUAL. Cada jogador (perfil) tem o seu próprio save (veja js/core/profiles.js). */
let SAVE = defaultSave();
let hasSavedGame = false;
let storageWorks = true;

const SAVE_KEY = 'matematica-nas-nuvens-save'; /* chave antiga (um só jogador) — usada só para migrar */

function applySave(raw){
  if(!raw) return false;
  const parsed = (typeof raw === 'string' ? JSON.parse(raw) : raw) || {};
  const d = defaultSave();
  SAVE = Object.assign({}, d, parsed);
  SAVE.profile = Object.assign({}, d.profile, parsed.profile||{});
  SAVE.settings = Object.assign({}, d.settings, parsed.settings||{});
  if(SAVE.settings.voiceChar === 'robo') SAVE.settings.voiceChar = 'ia'; /* o Robozinho Bip virou a Nuvi (IA) */
  if(!VOICE_CHARS.some(v=>v.id===SAVE.settings.voiceChar)) SAVE.settings.voiceChar = 'nino';
  /* saves antigos não têm "stats"/"history": completa sem perder nada */
  SAVE.stats = Object.assign({}, d.stats, parsed.stats||{});
  SAVE.stats.topics = Object.assign({}, (parsed.stats && parsed.stats.topics) || {});
  SAVE.history = Array.isArray(parsed.history) ? parsed.history.slice(0, HISTORY_MAX) : [];
  const pr = parsed.progress || {};
  SAVE.progress = {phases:{}, bonus:Object.assign({}, d.progress.bonus, pr.bonus||{})};
  [1,2,3,4].forEach(n=>{
    SAVE.progress.phases[n] = Object.assign({}, d.progress.phases[n], (pr.phases && pr.phases[n]) || {});
  });
  hasSavedGame = !!(SAVE.profile && SAVE.profile.name);
  return hasSavedGame;
}

/* ---------- ARMAZENAMENTO (localStorage; window.storage quando existir) ---------- */
async function storeGet(key){
  let raw = null;
  try{
    if(window.storage){
      const res = await window.storage.get(key, false);
      raw = res && res.value;
    }
  }catch(e){ /* chave inexistente ou storage indisponível: tenta o localStorage */ }
  try{
    if(!raw) raw = window.localStorage.getItem(key);
  }catch(e){ storageWorks = false; }
  return raw;
}
function storeSet(key, value){
  try{ window.localStorage.setItem(key, value); }catch(e){ storageWorks = false; }
  try{
    if(window.storage) window.storage.set(key, value, false).catch(()=>{ storageWorks = false; });
  }catch(e){ storageWorks = false; }
}
function storeRemove(key){
  try{ window.localStorage.removeItem(key); }catch(e){}
  try{
    if(window.storage) window.storage.delete(key, false).catch(()=>{});
  }catch(e){}
}

/* ---------- SALVAR (sempre no perfil do jogador atual) ---------- */
let saveTimer=null;
function persistNow(){
  clearTimeout(saveTimer);
  if(!currentProfileId) return; /* ainda não existe jogador: não há onde salvar */
  storeSet(profileKey(currentProfileId), JSON.stringify(SAVE));
  const e = findProfile(currentProfileId);
  if(e){
    const ph = SAVE.progress.phases;
    e.name = SAVE.profile.name; e.first = SAVE.profile.first || ''; e.last = SAVE.profile.last || '';
    e.avatar = SAVE.profile.avatar; e.needsRename = !!SAVE.profile.needsRename;
    e.done = [1,2,3,4].filter(n=>ph[n].status === 'completed').length;
    e.bonusDone = SAVE.progress.bonus.status === 'completed';
    e.updated = Date.now();
  }
  PROFILES.last = currentProfileId;
  saveProfilesIndex();
}
function persist(){
  clearTimeout(saveTimer);
  saveTimer = setTimeout(persistNow, 150);
}
window.addEventListener('pagehide', persistNow);
window.addEventListener('beforeunload', persistNow);
