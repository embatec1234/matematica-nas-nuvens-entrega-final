/* ---------- ESTATÍSTICAS E FEEDBACK ---------- */
function plural(n, one, many){ return n === 1 ? one : many; }
function starsFor(wrong){ return wrong <= 0 ? 3 : (wrong === 1 ? 2 : 1); }
function starsHTML(n, max){
  max = max || 3; let h = '';
  for(let i=1;i<=max;i++) h += `<img class="st ${i<=n?'on':''}" src="${i<=n?STAR_ON:STAR_OFF}" alt="" draggable="false">`;
  return `<span class="stars" role="img" aria-label="${n} de ${max} estrelas">${h}</span>`;
}
function rankFor(steps, bonusDone){
  if(bonusDone) return {icon:'👑', name:'Lenda das Nuvens'};
  if(steps >= 4) return {icon:'🏆', name:'Mestre das Nuvens'};
  if(steps >= 2) return {icon:'🚀', name:'Capitão do Céu'};
  if(steps >= 1) return {icon:'🛩️', name:'Piloto de Nuvens'};
  return {icon:'🎈', name:'Explorador do Céu'};
}
function fmtSec(sec){ return sec.toFixed(1).replace('.', ','); }
function fmtDate(t){
  const d = new Date(t); const z = n=>String(n).padStart(2,'0');
  return `${z(d.getDate())}/${z(d.getMonth()+1)} ${z(d.getHours())}:${z(d.getMinutes())}`;
}

/* chamado a cada pergunta respondida */
function recordAnswerStats(topic, ok, timedOut, ms){
  const st = SAVE.stats;
  st.answered++;
  st.totalAnswerMs += ms;
  if(ok) st.totalCorrect++; else { st.totalWrong++; if(timedOut) st.totalTimeouts++; }
  const t = st.topics[topic] || (st.topics[topic] = {correct:0, wrong:0});
  if(ok) t.correct++; else t.wrong++;
}
/* chamado uma vez quando a fase termina (vitória ou derrota) */
function recordSessionEnd(result){
  const s = session; if(!s) return;
  const st = SAVE.stats;
  st.sessions++;
  if(result === 'win') st.wins++; else st.losses++;
  let run = 0, best = 0;
  (s.log||[]).forEach(e=>{ run = e.ok ? run+1 : 0; best = Math.max(best, run); });
  st.bestStreak = Math.max(st.bestStreak, best);
  if(s.kind === 'phase'){
    const ph = SAVE.progress.phases[s.phase];
    ph.plays = (ph.plays||0) + 1;
    ph.lastCorrect = s.correct; ph.lastWrong = s.wrong;
  } else if(s.kind === 'bonus'){
    SAVE.progress.bonus.plays = (SAVE.progress.bonus.plays||0) + 1;
  }
  SAVE.history.unshift({
    t:Date.now(), kind:s.kind, phase:s.phase, topic:s.topic||null, diff:SAVE.difficulty, result,
    score:s.score, correct:s.correct, wrong:s.wrong,
    ms:(s.log||[]).reduce((a,e)=>a+e.ms, 0)
  });
  SAVE.history.length = Math.min(SAVE.history.length, HISTORY_MAX);
}

/* resumo de tudo que o jogador já fez (usado na tela inicial e no progresso) */
function overview(){
  const st = SAVE.stats, ph = SAVE.progress.phases, bonus = SAVE.progress.bonus;
  const doneCount = [1,2,3,4].filter(n=>ph[n].status === 'completed').length;
  const bonusDone = bonus.status === 'completed';
  const steps = doneCount + (bonusDone ? 1 : 0);
  const total = st.totalCorrect + st.totalWrong;
  const acc = total > 0 ? Math.round(st.totalCorrect / total * 100) : null;
  const avgSec = st.answered > 0 ? st.totalAnswerMs / st.answered / 1000 : null;
  const topics = Object.keys(TOPICS).map(id=>{
    const t = st.topics[id] || {correct:0, wrong:0};
    const n = t.correct + t.wrong;
    return Object.assign({id}, TOPICS[id], {correct:t.correct, wrong:t.wrong, n, acc: n ? Math.round(t.correct/n*100) : null});
  }).filter(t=>t.n > 0);
  const ranked = topics.filter(t=>t.n >= 3); // só opina com pelo menos 3 perguntas do assunto
  const best = ranked.filter(t=>t.acc >= 80).sort((a,b)=>b.acc-a.acc || b.n-a.n)[0] || null;
  const worst = ranked.filter(t=>t.acc < 70 && (!best || t.id !== best.id)).sort((a,b)=>a.acc-b.acc || b.n-a.n)[0] || null;
  const nextPhase = [1,2,3,4].find(n=>ph[n].status === 'unlocked') || null;
  return {
    name: SAVE.profile.name || 'Jogador', doneCount, bonusDone, steps, total, acc, avgSec, topics, best, worst,
    nextPhase, allDone: doneCount === 4, rank: rankFor(steps, bonusDone), score: SAVE.totalScore,
    correct: st.totalCorrect, wrong: st.totalWrong, streak: st.bestStreak
  };
}

/* texto do narrador: aparece no balão e é lido em voz alta */
function progressMessage(o, detailed){
  const n = SAVE.profile.first || o.name; /* o narrador chama só pelo primeiro nome */
  if(o.steps === 0 && o.total === 0){
    return `👋 Oi, ${n}! Sua aventura ainda vai começar. Toque em Continuar para jogar a primeira fase!`;
  }
  const p = [];
  p.push(`👋 Oi, ${n}! Você é ${o.rank.name}.`);
  if(o.bonusDone) p.push('Você completou as 4 fases e o desafio bônus!');
  else if(o.doneCount === 0) p.push(`Você ainda não completou nenhuma fase, mas já respondeu ${o.total} ${plural(o.total,'pergunta','perguntas')}!`);
  else p.push(`Você completou ${o.doneCount} de 4 fases.`);
  p.push(`Você tem ${o.score} pontos.`);
  if(o.acc !== null) p.push(`🎯 Você acerta ${o.acc}% das perguntas.`);
  if(o.best) p.push(`💪 Você é craque em ${o.best.say}.`);
  if(o.worst) p.push(`🌱 Vamos treinar mais ${o.worst.say}?`);
  if(detailed){
    if(o.total > 0) p.push(`No total, foram ${o.correct} ${plural(o.correct,'acerto','acertos')} e ${o.wrong} ${plural(o.wrong,'erro','erros')}.`);
    if(o.avgSec !== null) p.push(`⏱️ Você leva em média ${fmtSec(o.avgSec)} segundos para responder.`);
    if(o.streak >= 2) p.push(`🔥 Sua maior sequência de acertos foi de ${o.streak}.`);
  }
  if(!o.allDone && o.nextPhase) p.push(`Sua próxima aventura é a fase ${o.nextPhase}.`);
  else if(o.allDone && !o.bonusDone) p.push('Que tal jogar o desafio bônus?');
  else if(o.bonusDone) p.push('Jogue de novo para bater seus recordes!');
  return p.join(' ');
}

