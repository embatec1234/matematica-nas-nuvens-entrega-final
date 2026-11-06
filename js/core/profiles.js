/* =========================================================
   PERFIS DE JOGADOR
   Vários jogadores no mesmo computador, cada um com o seu próprio progresso.
   - Lista de perfis (nome, avatar, resumo):  chave PROFILES_KEY
   - Jogo de cada perfil:                     chave SAVE_KEY + ':' + id
   Tudo fica no navegador DESTE computador.
========================================================= */
const PROFILES_KEY = 'matematica-nas-nuvens-profiles';
const MAX_PROFILES = 40;
let PROFILES = {list:[], last:null};   /* list: [{id,name,first,last,avatar,done,bonusDone,updated,needsRename}] */
let currentProfileId = null;           /* perfil que está jogando agora */
const DELETED_IDS = new Set();         /* perfis apagados nesta sessão (para não voltarem ao juntar abas) */

function profileKey(id){ return SAVE_KEY + ':' + id; }
function newProfileId(){ return 'p' + Date.now().toString(36) + Math.random().toString(36).slice(2,6); }
function findProfile(id){ return PROFILES.list.find(p=>p.id === id) || null; }

function saveProfilesIndex(){
  try{ /* junta perfis criados em outra aba aberta do mesmo navegador */
    const raw = window.localStorage.getItem(PROFILES_KEY);
    if(raw){
      const st = JSON.parse(raw);
      (st.list || []).forEach(p=>{
        if(p && p.id && !findProfile(p.id) && !DELETED_IDS.has(p.id)) PROFILES.list.push(p);
      });
    }
  }catch(e){}
  storeSet(PROFILES_KEY, JSON.stringify(PROFILES));
}

/* quem já jogava antes dos perfis (save único) vira o primeiro perfil, sem perder nada */
async function migrateLegacySave(){
  const raw = await storeGet(SAVE_KEY);
  if(!raw) return;
  let parsed;
  try{ parsed = JSON.parse(raw); }catch(e){ return; }
  const oldName = parsed && parsed.profile && parsed.profile.name;
  if(!oldName) return;
  const id = newProfileId();
  const bank = parseBankName(oldName);
  /* nome digitado à mão que não está no banco: não mostramos; o jogador escolhe um nome da lista */
  const prof = Object.assign({}, parsed.profile, bank
    ? {name:composeName(bank.first, bank.last), first:bank.first, last:bank.last, needsRename:false}
    : {name:'Jogador', first:'', last:'', needsRename:true});
  parsed.profile = prof;
  storeSet(profileKey(id), JSON.stringify(parsed));
  PROFILES.list.push({id, name:prof.name, first:prof.first, last:prof.last, avatar:prof.avatar || AVATARS[0],
    done:0, bonusDone:false, updated:Date.now(), needsRename:!!prof.needsRename});
  PROFILES.last = id;
  saveProfilesIndex();
}

/* carrega o jogo de um perfil. SAVE e currentProfileId só mudam juntos, depois da leitura. */
async function loadProfileSave(id){
  let raw = null;
  try{ raw = await storeGet(profileKey(id)); }catch(e){}
  let parsedOk = false;
  if(raw){ try{ applySave(raw); parsedOk = true; }catch(e){} }
  if(!parsedOk) SAVE = defaultSave(); /* save ausente ou corrompido: começa limpo, sem herdar dados de outro jogador */
  const e = findProfile(id);
  if(e && !SAVE.profile.name){
    SAVE.profile = Object.assign({}, SAVE.profile, {name:e.name, first:e.first || '', last:e.last || '', avatar:e.avatar || SAVE.profile.avatar});
  }
  if(e && e.needsRename) SAVE.profile.needsRename = true;
  hasSavedGame = !!SAVE.profile.name;
  currentProfileId = id;
  PROFILES.last = id;
  saveProfilesIndex();
}

async function loadSave(){
  PROFILES = {list:[], last:null};
  try{
    const rawIdx = await storeGet(PROFILES_KEY);
    if(rawIdx){
      const p = JSON.parse(rawIdx);
      if(p && Array.isArray(p.list)) PROFILES = {list:p.list.filter(x=>x && x.id), last:p.last || null};
    }
  }catch(e){}
  if(!PROFILES.list.length){ try{ await migrateLegacySave(); }catch(e){} }
  /* carrega o último jogador só para aproveitar som e voz; a tela "Quem vai jogar?" aparece em seguida */
  const lastId = findProfile(PROFILES.last) ? PROFILES.last : (PROFILES.list[0] && PROFILES.list[0].id);
  if(lastId){ await loadProfileSave(lastId); }
  else { SAVE = defaultSave(); hasSavedGame = false; currentProfileId = null; }
}

/* ---------- AÇÕES ---------- */
function createProfile(first, last, avatar){
  const id = newProfileId();
  const keepSettings = Object.assign({}, SAVE.settings); /* som e voz continuam como estavam */
  SAVE = defaultSave();
  SAVE.settings = Object.assign({}, SAVE.settings, keepSettings);
  const name = composeName(first, last);
  SAVE.profile = {name, first, last, avatar};
  PROFILES.list.push({id, name, first, last, avatar, done:0, bonusDone:false, updated:Date.now(), needsRename:false});
  currentProfileId = id;
  hasSavedGame = true;
  session = null; mp = null;
  persistNow();
}

async function selectProfile(id){
  if(!findProfile(id)) return;
  sfxClick();
  stopSpeaking();
  clearQuestionTimer();
  persistNow(); /* guarda o jogador anterior antes de trocar */
  await loadProfileSave(id);
  session = null; mp = null;
  lastHomeSpeechAt = 0;
  if(SAVE.settings.musicOn) startMusic(); else stopMusic();
  if(SAVE.profile.needsRename){ startNameDraft('rename'); goto('profile'); return; }
  goto('start');
}

/* apagar exige o código secreto do jogador (ou o código mestre do adulto) */
function confirmDeleteProfile(id){
  const p = findProfile(id); if(!p) return;
  sfxClick();
  requireProfileCode(id, ()=>showDeleteConfirm(id), {
    onMaster: ()=>showMasterChoice(id),
    onSetup:  ()=>goto('players', {back:playersBack})   /* perfil antigo sem código: cria o código e volta à lista */
  });
}
function showDeleteConfirm(id){
  const p = findProfile(id); if(!p) return;
  const nm = p.needsRename ? 'este jogador' : esc(p.name);
  showModal(`
    <div class="modal-card">
      <div class="center-emoji">🗑️</div>
      <h3>Apagar ${nm}?</h3>
      <p>Todo o progresso desse jogador será apagado deste computador e não dá para desfazer.</p>
      <div class="stack">
        <button class="btn btn-coral" onclick="deleteProfile('${p.id}')">Sim, apagar</button>
        <button class="btn btn-outline" onclick="closeModal()">Cancelar</button>
      </div>
    </div>`);
}
function deleteProfile(id){
  closeModal();
  DELETED_IDS.add(id);
  PROFILES.list = PROFILES.list.filter(p=>p.id !== id);
  storeRemove(profileKey(id));
  if(PROFILES.last === id) PROFILES.last = null;
  if(currentProfileId === id){
    const keepSettings = SAVE.settings;
    SAVE = defaultSave(); SAVE.settings = keepSettings;
    hasSavedGame = false; currentProfileId = null;
    session = null; mp = null;
    stopSpeaking(); clearQuestionTimer();
  }
  saveProfilesIndex();
  sfxClick();
  goto(PROFILES.list.length ? 'players' : 'start', PROFILES.list.length ? {back:playersBack} : undefined);
}
