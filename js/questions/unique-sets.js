/* ---------- PERGUNTAS SEM REPETIÇÃO ----------
   Identifica uma pergunta pelo texto + desenho (ex.: quantidade de ⭐).
   Soma e multiplicação contam como a mesma pergunta se só trocar a ordem
   (6 + 7 e 7 + 6). Numa mesma partida, nenhuma pergunta aparece duas vezes. */
function questionKey(q){
  let t = String(q.text).replace(/\s+/g,' ').trim();
  const m = t.match(/^(\d+) ([+×]) (\d+) = \?$/);
  if(m){
    const nums = [+m[1], +m[3]].sort((x,y)=>x-y);
    t = nums[0]+' '+m[2]+' '+nums[1]+' = ?';
  }
  return t + '|' + (q.visual || '');
}
function buildUniqueSet(genFn, count){
  const qs = [], seen = new Set();
  let attempts = 0;
  const maxAttempts = count * 80; // segurança: se as combinações acabarem, aceita repetir em vez de travar
  while(qs.length < count){
    const q = genFn();
    attempts++;
    const k = questionKey(q);
    if(seen.has(k) && attempts < maxAttempts) continue;
    seen.add(k);
    qs.push(q);
  }
  return qs;
}

function buildTopicQuestionSet(topicId, diff, count){
  const gen = TOPIC_GEN[topicId] || genTopicSoma;
  return buildUniqueSet(()=>gen(diff), count);
}

function buildQuestionSet(phase, diff, count){
  return buildUniqueSet(()=>PHASE_GEN[phase](diff), count);
}
function buildBonusSet(diff, count){
  return buildUniqueSet(()=>pick([genPhase1,genPhase2,genPhase3,genPhase4])(diff), count);
}

