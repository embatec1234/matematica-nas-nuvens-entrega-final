/* ---------- QUESTION GENERATION ---------- */
function numRange(diff){
  if(diff==='facil') return {p1:10, p2mul:5, p2div:20, p3:20, p4:20};
  if(diff==='dificil') return {p1:50, p2mul:12, p2div:100, p3:100, p4:100};
  return {p1:20, p2mul:10, p2div:50, p3:50, p4:50}; // medio
}

function mkMultipla(text, answer, distractors, visual, topic, spoken){
  const opts = shuffle([answer, ...distractors].map(String));
  return {type:'multipla', text, answer:String(answer), options:opts, visual, topic, spoken};
}
function mkNumerica(text, answer, visual, topic, spoken){
  return {type:'numerica', text, answer:String(answer), visual, topic, spoken};
}
/* como a voz deve ler "Quantos ⭐ você vê?" (o emoji não é lido) */
const COUNT_WORDS = {'☁️':['nuvens','f'], '⭐':['estrelas','f'], '🍎':['maçãs','f'], '🎈':['balões','m'], '🐦':['passarinhos','m']};
function distractorsNear(answer, count, spread){
  const set = new Set();
  let guard=0;
  while(set.size<count && guard<50){
    guard++;
    const d = answer + rand(-spread,spread);
    if(d!==answer && d>=0) set.add(d);
  }
  while(set.size<count) set.add(answer + set.size + 1);
  return [...set].slice(0,count);
}

