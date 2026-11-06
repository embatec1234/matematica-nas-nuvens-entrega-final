/* ---- PROGRESSO COMPLETO ---- */
let progressBack = 'start';
function openProgress(from){
  sfxClick();
  progressBack = from === 'map' ? 'map' : 'start';
  goto('progress');
}
function tileHTML(ico, num, lab){
  return `<div class="stat-box"><div class="num">${ico} ${num}</div><div class="lab">${lab}</div></div>`;
}
function phaseCardHTML(n){
  const ph = SAVE.progress.phases[n], info = PHASE_INFO[n];
  const st = ph.status;
  const state = st === 'completed' ? '✅ Concluída' : (st === 'locked' ? '🔒 Bloqueada' : '▶️ Disponível');
  const stars = st === 'completed' && ph.bestStars > 0 ? starsHTML(ph.bestStars) : '';
  let detail = '';
  if(st !== 'locked'){
    const bits = [];
    if(ph.bestScore > 0) bits.push(`Melhor: <b>${ph.bestScore}</b> pts`);
    if(ph.plays > 0) bits.push(`Jogadas: <b>${ph.plays}</b>`);
    else if(ph.attempts > 0) bits.push(`Vitórias: <b>${ph.attempts}</b>`);
    if(ph.lastCorrect !== null && ph.lastCorrect !== undefined) bits.push(`Última: <b>${ph.lastCorrect}</b> ✅ <b>${ph.lastWrong}</b> ❌`);
    detail = bits.length ? bits.join(' · ') : 'Ainda não jogou esta fase.';
  }
  return `
  <div class="ph-card ${st}">
    <div class="ph-ico">${st==='locked'?'🔒':info.icon}</div>
    <div class="ph-body">
      <div class="ph-title">Fase ${n} — ${info.name}</div>
      <div class="ph-state">${state} ${stars}</div>
      ${detail ? `<div class="ph-detail">${detail}</div>` : ''}
    </div>
  </div>`;
}
function bonusCardHTML(){
  const b = SAVE.progress.bonus;
  const state = b.status === 'completed' ? '✅ Concluído' : (b.status === 'locked' ? '🔒 Bloqueado' : '▶️ Disponível');
  const r = b.result;
  const stars = (b.status === 'completed' && r && r.stars) ? starsHTML(r.stars) : '';
  let detail = '';
  if(r) detail = `Último: <b>${r.correct}</b> ✅ <b>${r.wrong}</b> ❌ · <b>${r.score}</b> pts` + (b.plays ? ` · Jogadas: <b>${b.plays}</b>` : '');
  else if(b.status !== 'locked') detail = 'Ainda não jogou o bônus.';
  return `
  <div class="ph-card ${b.status}">
    <div class="ph-ico">${b.status==='locked'?'🔒':'🏆'}</div>
    <div class="ph-body">
      <div class="ph-title">Desafio Bônus</div>
      <div class="ph-state">${state} ${stars}</div>
      ${detail ? `<div class="ph-detail">${detail}</div>` : ''}
    </div>
  </div>`;
}
function topicsHTML(o){
  if(!o.topics.length) return '<p class="note">Jogue uma fase e eu mostro aqui como você está em cada assunto!</p>';
  return `<div class="tp-list">${o.topics.map(t=>{
    const cls = t.acc >= 80 ? 'good' : (t.acc >= 50 ? 'mid' : 'low');
    return `
    <div class="tp-row">
      <div class="tp-name"><span aria-hidden="true">${t.emoji}</span> ${t.label}</div>
      <div class="tp-bar" role="img" aria-label="${t.acc}% de acertos em ${t.label}"><div class="tp-fill ${cls}" style="width:${Math.max(t.acc,4)}%;"></div></div>
      <div class="tp-val">${t.correct}/${t.n}</div>
    </div>`;}).join('')}</div>
    <div class="tp-legend"><span><i class="lg good"></i>Craque</span><span><i class="lg mid"></i>Quase lá</span><span><i class="lg low"></i>Vamos treinar</span></div>`;
}
function historyHTML(){
  if(!SAVE.history.length) return '<p class="note">Suas últimas jogadas vão aparecer aqui.</p>';
  return `<div class="hs-list">${SAVE.history.slice(0,8).map(h=>{
    const label = h.kind === 'bonus' ? '🏆 Bônus'
      : h.kind === 'topic' ? `${(TOPICS[h.topic]||{}).emoji||'🎯'} ${(TOPICS[h.topic]||{}).label||'Atividade'}`
      : `${(PHASE_INFO[h.phase]||{}).icon||''} Fase ${h.phase}`;
    const win = h.result === 'win';
    return `
    <div class="hs-item ${win?'win':'lose'}">
      <div class="hs-when">${fmtDate(h.t)}</div>
      <div class="hs-what"><b>${label}</b> · ${DIFF_LABEL[h.diff]||''}</div>
      <div class="hs-res">${win?'✅ Concluída':'❌ Perdeu'}</div>
      <div class="hs-nums">${h.correct} ✅ ${h.wrong} ❌ · ${h.score} pts</div>
    </div>`;}).join('')}</div>`;
}
