/* =========================================================
   CÓDIGO SECRETO DE FIGURINHAS (proteção do perfil)
   Cada jogador cria um código com 3 figurinhas (ex.: 🐶 🚀 ⭐).
   Sem o código, ninguém apaga o perfil nem zera o progresso desse jogador.
   - O código fica guardado só como "impressão" (hash) no perfil, nunca em texto.
   - Esqueceu? O professor/responsável usa o CÓDIGO MESTRE (PARENT_MASTER_CODE,
     em js/config/game-config.js).
========================================================= */
const LOCK_EMOJIS = ['🐶','🐱','🦊','🐸','🐼','🦁','🐵','🐰','🐢','🦄','🚀','⭐'];
const LOCK_LEN = 3;
const LOCK_MAX_TRIES = 3;
const LOCK_WAIT_MS = 30000;

let lock = null;                 /* conversa atual: {id, mode, typed, first, onOk, onMaster, onSetup, msg} */
const lockFails = {};            /* id -> {n, until} (tentativas erradas nesta sessão) */

function codeHash(id, arr){
  let h = 5381;
  const s = id + '|' + arr.join('');
  for(let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) >>> 0;
  return 'c' + h.toString(36);
}
function profileHasCode(id){ const p = findProfile(id); return !!(p && p.pin); }

/* ---------- ENTRADA PRINCIPAL ----------
   requireProfileCode(id, onOk, opts): pede o código do perfil e, se estiver certo, chama onOk.
   opts.onMaster: o que fazer quando o adulto usar o código mestre (padrão: onOk)
   opts.onSetup:  o que fazer depois de criar o código de um perfil que ainda não tinha (padrão: fechar) */
function requireProfileCode(id, onOk, opts){
  opts = opts || {};
  if(!findProfile(id)) return;
  lock = {id, onOk, onMaster: opts.onMaster || onOk, onSetup: opts.onSetup || closeModal,
          mode:'ask', typed:[], first:[], msg:''};
  if(!profileHasCode(id)){ showNoCodeIntro(); return; }
  const f = lockFails[id];
  if(f && f.until > Date.now()){ showLockWait(); return; }
  renderLock();
}

function showNoCodeIntro(){
  showModal(`
    <div class="modal-card">
      <div class="center-emoji">🔒</div>
      <h3>Crie o código secreto</h3>
      <p>Para proteger este jogador, escolha <b>3 figurinhas secretas</b>. Só quem souber o código poderá apagar ou zerar o jogo dele.</p>
      <div class="stack">
        <button class="btn btn-primary" onclick="startCreateCode()">Criar código 🔑</button>
        <button class="btn btn-outline" onclick="closeModal()">Agora não</button>
      </div>
    </div>`);
}
function startCreateCode(){
  sfxClick();
  lock.mode = 'create'; lock.typed = []; lock.first = []; lock.msg = '';
  renderLock();
}

function showLockWait(){
  showModal(`
    <div class="modal-card">
      <div class="center-emoji">⏳</div>
      <h3>Espere um pouquinho</h3>
      <p>Você errou o código algumas vezes. Tente de novo daqui a pouco.</p>
      <div class="stack"><button class="btn btn-outline" onclick="closeModal()">Ok</button></div>
    </div>`);
}

/* ---------- TELA DO CÓDIGO ---------- */
function renderLock(){
  const L = lock;
  const confirming = L.mode === 'create' && L.first.length === LOCK_LEN;
  let title, text;
  if(L.mode === 'create'){
    title = confirming ? 'Repita o código' : 'Escolha 3 figurinhas';
    text  = confirming ? 'Toque nas mesmas figurinhas, na mesma ordem.' : 'Esse será o seu código secreto. Não conte para ninguém! 🤫';
  } else {
    title = 'Qual é o seu código?';
    text  = 'Toque nas 3 figurinhas secretas do seu perfil.';
  }
  const slots = Array.from({length:LOCK_LEN}, (_, i)=>
    `<span class="lock-slot ${L.typed[i] ? 'filled':''}">${L.typed[i] ? L.typed[i] : ''}</span>`).join('');
  const grid = LOCK_EMOJIS.map((e, i)=>
    `<button class="lock-key" aria-label="Figurinha ${i+1}" onclick="lockPick(${i})">${e}</button>`).join('');
  showModal(`
    <div class="modal-card lock-card">
      <div class="center-emoji">${L.mode === 'create' ? '🔑' : '🔒'}</div>
      <h3>${title}</h3>
      <p>${text}</p>
      <div class="lock-slots ${L.shake ? 'shake':''}">${slots}</div>
      <div class="lock-msg">${L.msg || ''}</div>
      <div class="lock-grid">${grid}</div>
      <div class="lock-actions">
        <button class="btn btn-outline btn-sm" style="width:auto;" onclick="lockBack()">⌫ Apagar</button>
        ${L.required ? '' : `<button class="btn btn-ghost btn-sm" style="width:auto;" onclick="lockCancel()">${L.mode === 'create' ? 'Cancelar' : 'Voltar'}</button>`}
      </div>
      ${L.mode === 'ask' ? '<button class="lock-forgot" onclick="lockForgot()">Esqueci o código (professor ou responsável)</button>' : ''}
    </div>`);
  L.shake = false;
}

function lockPick(i){
  if(!lock || lock.busy) return;
  const e = LOCK_EMOJIS[i]; if(!e) return;
  if(lock.typed.length >= LOCK_LEN) return;
  sfxClick();
  lock.typed.push(e);
  lock.msg = '';
  renderLock();
  if(lock.typed.length === LOCK_LEN){
    lock.busy = true;
    setTimeout(lockEvaluate, 280);   /* deixa a criança ver a 3ª figurinha */
  }
}
function lockBack(){
  if(!lock || lock.busy) return;
  sfxClick();
  lock.typed.pop(); lock.msg = '';
  renderLock();
}
function lockCancel(){
  sfxClick();
  lock = null;
  closeModal();
}

function lockEvaluate(){
  const L = lock; if(!L) return;
  L.busy = false;
  const typed = L.typed.slice();
  if(L.mode === 'create'){
    if(L.first.length !== LOCK_LEN){            /* 1ª vez: guarda e pede de novo */
      L.first = typed; L.typed = []; L.msg = '';
      renderLock(); return;
    }
    if(typed.join('') !== L.first.join('')){    /* não bateu: recomeça */
      L.first = []; L.typed = []; L.msg = '😅 Não ficaram iguais. Vamos de novo!'; L.shake = true;
      renderLock(); return;
    }
    const p = findProfile(L.id);
    if(!p){ lock = null; closeModal(); return; }
    p.pin = codeHash(L.id, typed);
    saveProfilesIndex();
    const done = L.onSetup;
    lock = null;
    showCodeSaved(typed, done);
    return;
  }
  /* mode 'ask' */
  const p = findProfile(L.id);
  if(p && p.pin === codeHash(L.id, typed)){
    delete lockFails[L.id];
    const ok = L.onOk;
    lock = null;
    closeModal();
    sfxClick();
    ok();
    return;
  }
  const f = lockFails[L.id] || (lockFails[L.id] = {n:0, until:0});
  f.n++;
  if(f.n >= LOCK_MAX_TRIES){
    f.n = 0; f.until = Date.now() + LOCK_WAIT_MS;
    lock = null;
    showLockWait();
    return;
  }
  L.typed = []; L.msg = '❌ Código errado. Tente de novo!'; L.shake = true;
  renderLock();
}

function showCodeSaved(code, done){
  lockDoneCb = done;
  showModal(`
    <div class="modal-card">
      <div class="center-emoji">✅</div>
      <h3>Código guardado!</h3>
      <div class="lock-slots">${code.map(e=>`<span class="lock-slot filled">${e}</span>`).join('')}</div>
      <p>Lembre-se dessas 3 figurinhas, na ordem. Só você deve saber! 🤫</p>
      <div class="stack"><button class="btn btn-primary" onclick="lockSavedOk()">Entendi!</button></div>
    </div>`);
}
let lockDoneCb = null;
function lockSavedOk(){
  sfxClick();
  closeModal();
  const cb = lockDoneCb; lockDoneCb = null;
  if(cb) cb();
}

/* ---------- ESQUECI O CÓDIGO: código mestre do adulto ---------- */
function lockForgot(){
  sfxClick();
  showModal(`
    <div class="modal-card">
      <div class="center-emoji">🧑‍🏫</div>
      <h3>Professor ou responsável</h3>
      <p>Digite o código mestre para continuar.</p>
      <input type="password" id="masterInput" class="name-filter" inputmode="numeric" autocomplete="off" maxlength="12" placeholder="Código mestre" onkeydown="if(event.key==='Enter')lockMaster()">
      <div class="lock-msg" id="masterMsg"></div>
      <div class="stack">
        <button class="btn btn-primary" onclick="lockMaster()">Entrar</button>
        <button class="btn btn-outline" onclick="lockCancel()">Cancelar</button>
      </div>
    </div>`);
  setTimeout(()=>{ const i = document.getElementById('masterInput'); if(i) i.focus(); }, 50);
}
function lockMaster(){
  const i = document.getElementById('masterInput');
  const v = i ? i.value.trim() : '';
  const f = lockFails.__master || (lockFails.__master = {n:0, until:0});
  if(f.until > Date.now()){ showLockWait(); return; }
  if(v && v === String(PARENT_MASTER_CODE)){
    f.n = 0;
    const L = lock; lock = null;
    closeModal();
    if(L) L.onMaster();
    return;
  }
  f.n++;
  if(f.n >= 5){ f.n = 0; f.until = Date.now() + LOCK_WAIT_MS * 2; showLockWait(); return; }
  const m = document.getElementById('masterMsg');
  if(m) m.textContent = '❌ Código mestre errado.';
}

/* adulto entrou com o código mestre num perfil: apagar ou trocar o código */
function showMasterChoice(id){
  const p = findProfile(id); if(!p) return;
  const nm = p.needsRename ? 'este jogador' : esc(p.name);
  showModal(`
    <div class="modal-card">
      <div class="center-emoji">🧑‍🏫</div>
      <h3>O que fazer com ${nm}?</h3>
      <div class="stack">
        <button class="btn btn-coral" onclick="closeModal(); showDeleteConfirm('${p.id}')">🗑️ Apagar este jogador</button>
        <button class="btn btn-primary" onclick="masterNewCode('${p.id}')">🔑 Criar um novo código</button>
        <button class="btn btn-outline" onclick="closeModal()">Cancelar</button>
      </div>
    </div>`);
}
function masterNewCode(id){
  sfxClick();
  lock = {id, mode:'create', typed:[], first:[], msg:'',
          onSetup: ()=> goto('players', {back:playersBack})};
  renderLock();
}
