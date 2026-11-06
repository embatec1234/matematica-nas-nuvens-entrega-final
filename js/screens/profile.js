/* ---- PROFILE: escolher nome e sobrenome do banco de nomes + avatar ----
   Não existe campo de texto para o nome: só dá para escolher itens da lista.
   (O campo de busca apenas filtra a lista; o que se digita nele nunca vira nome.) */
let nameDraft = null;   /* rascunho enquanto o jogador escolhe */

/* mode: 'new' = jogador novo · 'rename' = jogador que já existe e precisa escolher um nome da lista */
function startNameDraft(mode){
  const cur = SAVE.profile || {};
  const renaming = mode === 'rename';
  nameDraft = {
    mode,
    first: '', last: '', lastChosen: false,
    avatar: renaming ? (cur.avatar || AVATARS[0]) : AVATARS[0],
    tab: 'first', letter: '', q: '', msg: ''
  };
}
function onNewPlayer(){
  sfxClick();
  if(PROFILES.list.length >= MAX_PROFILES){
    showModal(`<div class="modal-card"><div class="center-emoji">👥</div><h3>Computador cheio</h3><p>Já existem ${MAX_PROFILES} jogadores neste computador. Apague algum jogador que não joga mais para criar um novo.</p><div class="stack"><button class="btn btn-primary" onclick="closeModal()">Entendi</button></div></div>`);
    return;
  }
  startNameDraft('new');
  goto('profile');
}

/* ----- partes da tela (cada uma vira HTML; refreshNamePicker troca só elas) ----- */
function namePreviewHTML(){
  const d = nameDraft;
  const label = d.first ? esc(composeName(d.first, d.last)) : '<span class="np-empty">Escolha seu nome</span>';
  return `<span class="np-avatar" aria-hidden="true">${d.avatar}</span><span class="np-name">${label}</span>`;
}
function letterChipsHTML(){
  const d = nameDraft;
  return bankLetters(d.tab).map(L=>
    `<button class="letter-chip ${d.letter===L && !d.q ? 'active':''}" onclick="setNameLetter('${L}')">${L}</button>`).join('');
}
function nameListHTML(){
  const d = nameDraft, kind = d.tab;
  const sel = kind === 'first' ? d.first : d.last;
  let html = '';
  if(kind === 'last'){
    html += `<button class="name-opt name-none ${d.lastChosen && !d.last ? 'selected':''}" onclick="pickNoSurname()">Sem sobrenome</button>`;
  }
  if(!d.q && !d.letter){
    html += `<p class="note name-hint">👆 Toque na primeira letra ${kind==='first'?'do seu nome':'do seu sobrenome'}, ou escreva acima para procurar.</p>`;
    return html;
  }
  const items = bankItems(kind, d.letter, d.q);
  if(!items.length){
    return html + `<p class="note name-hint">Não achei na lista. Tente outra letra ou escolha um nome parecido 😊</p>`;
  }
  return html + items.map(it=>
    `<button class="name-opt ${it.name===sel ? 'selected':''}" onclick="pickName('${kind}',${it.i})">${esc(it.name)}</button>`).join('');
}
function nameCanConfirm(){ const d = nameDraft; return !!(d.first && d.lastChosen); }

function refreshNamePicker(){
  const d = nameDraft; if(!d) return;
  const set = (id, html)=>{ const el = $(id); if(el) el.innerHTML = html; };
  set('#namePreview', namePreviewHTML());
  set('#letterChips', letterChipsHTML());
  set('#nameList', nameListHTML());
  const tf = $('#tabFirst'), tl = $('#tabLast'), inp = $('#nameFilter'), btn = $('#confirmNameBtn'), msg = $('#nameMsg');
  if(tf) tf.classList.toggle('active', d.tab === 'first');
  if(tl) tl.classList.toggle('active', d.tab === 'last');
  if(inp && inp.value !== d.q) inp.value = d.q;
  if(inp) inp.placeholder = d.tab === 'first' ? '🔍 Procure seu nome' : '🔍 Procure seu sobrenome';
  if(btn) btn.disabled = !nameCanConfirm();
  if(msg){ msg.textContent = d.msg || ''; msg.style.display = d.msg ? 'block' : 'none'; }
}
function setNameTab(tab){
  sfxClick();
  nameDraft.tab = tab; nameDraft.letter = ''; nameDraft.q = '';
  refreshNamePicker();
}
function setNameLetter(L){
  sfxClick();
  nameDraft.letter = L; nameDraft.q = '';
  refreshNamePicker();
}
function setNameQuery(v){
  nameDraft.q = String(v || '').slice(0, 12); /* só filtra a lista */
  refreshNamePicker();
}
function pickName(kind, i){
  const name = NAME_BANK[kind] && NAME_BANK[kind][i];
  if(!name) return;
  sfxClick();
  const d = nameDraft;
  d.msg = '';
  if(kind === 'first'){
    d.first = name;
    d.tab = 'last'; d.letter = ''; d.q = '';   /* já passa para o sobrenome */
  } else {
    d.last = name; d.lastChosen = true;
  }
  refreshNamePicker();
}
function pickNoSurname(){
  sfxClick();
  nameDraft.last = ''; nameDraft.lastChosen = true; nameDraft.msg = '';
  refreshNamePicker();
}
function pickAvatar(a){
  if(!AVATARS.includes(a)) return;
  sfxClick();
  nameDraft.avatar = a;
  document.querySelectorAll('.avatar-opt').forEach(el=>el.classList.toggle('selected', el.dataset.av===a));
  refreshNamePicker();
}

SCREENS.profile = function(){
  if(!nameDraft) startNameDraft('new');
  const d = nameDraft;
  const renaming = d.mode === 'rename';
  return `
  <div class="screen">
    <h2 style="color:#fff; text-shadow:0 3px 0 rgba(35,50,86,.25);">${renaming ? 'Escolha seu nome ✏️' : 'Quem vai voar hoje? 🎈'}</h2>
    <div class="cloud-card stack">
      ${renaming ? '<p class="note warn">Agora os nomes são escolhidos de uma lista. Escolha o seu: o seu progresso continua guardado!</p>' : ''}
      <div class="name-preview" id="namePreview">${namePreviewHTML()}</div>
      <div class="name-tabs">
        <button class="name-tab ${d.tab==='first'?'active':''}" id="tabFirst" onclick="setNameTab('first')">1️⃣ Nome</button>
        <button class="name-tab ${d.tab==='last'?'active':''}" id="tabLast" onclick="setNameTab('last')">2️⃣ Sobrenome</button>
      </div>
      <input type="text" id="nameFilter" class="name-filter" maxlength="12" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="Procurar na lista" placeholder="🔍 Procure seu nome" oninput="setNameQuery(this.value)">
      <div class="letter-chips" id="letterChips">${letterChipsHTML()}</div>
      <div class="name-list" id="nameList">${nameListHTML()}</div>
      <div class="diff-title" style="margin-top:8px;">Escolha seu avatar</div>
      <div class="avatars" id="avatarGrid">
        ${AVATARS.map(a=>`<button class="avatar-opt ${a===d.avatar?'selected':''}" data-av="${a}" onclick="pickAvatar('${a}')">${a}</button>`).join('')}
      </div>
      <p class="note warn" id="nameMsg" style="display:none;"></p>
      <button class="btn btn-primary" id="confirmNameBtn" style="margin-top:10px;" ${nameCanConfirm()?'':'disabled'} onclick="confirmProfile()">Confirmar perfil ✅</button>
      <button class="btn btn-outline" onclick="cancelProfile()">${renaming ? '← Voltar' : '⌂ Voltar'}</button>
    </div>
  </div>`;
};

function cancelProfile(){
  sfxClick();
  const renaming = nameDraft && nameDraft.mode === 'rename';
  nameDraft = null;
  if(PROFILES.list.length) goto('players', {back: renaming ? false : playersBack});
  else goto('start');
}

function confirmProfile(){
  const d = nameDraft;
  if(!d || !nameCanConfirm()) return;
  /* confere de novo: só vale nome e sobrenome que estão no banco */
  const firstOk = NAME_BANK.first.includes(d.first);
  const lastOk = d.last === '' || NAME_BANK.last.includes(d.last);
  if(!firstOk || !lastOk){ d.msg = 'Escolha o nome e o sobrenome na lista.'; refreshNamePicker(); return; }
  const full = composeName(d.first, d.last);
  const exists = PROFILES.list.some(p=>p.id !== currentProfileId && !p.needsRename && normName(p.name) === normName(full));
  const existsNew = d.mode === 'new' && PROFILES.list.some(p=>!p.needsRename && normName(p.name) === normName(full));
  if(exists || existsNew){
    d.msg = 'Já existe um jogador com esse nome neste computador. Escolha outro sobrenome ou outro nome.';
    refreshNamePicker(); return;
  }
  sfxClick();
  if(d.mode === 'rename'){
    SAVE.profile = Object.assign({}, SAVE.profile, {name:full, first:d.first, last:d.last, avatar:d.avatar, needsRename:false});
    hasSavedGame = true;
    persistNow();
    nameDraft = null;
    goto('start');
  } else {
    createProfile(d.first, d.last, d.avatar);
    nameDraft = null;
    /* antes de jogar, a criança cria o código secreto de figurinhas do perfil */
    lock = {id:currentProfileId, mode:'create', typed:[], first:[], msg:'', required:true, onSetup:()=>goto('difficulty')};
    renderLock();
  }
}
