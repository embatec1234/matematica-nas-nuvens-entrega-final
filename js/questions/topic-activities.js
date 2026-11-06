/* ---------- GERADORES POR ATIVIDADE (Seleção de Atividades) ----------
   Mesma lógica de pergunta usada dentro das fases, mas isolada por
   assunto, para o jogador poder escolher e praticar um conteúdo
   específico fora da jornada linear das fases. --------------------- */
function genTopicContagem(diff){
  const r = numRange(diff);
  const n = rand(3, Math.min(10, r.p1));
  const emoji = pick(['☁️','⭐','🍎','🎈','🐦']);
  const cw = COUNT_WORDS[emoji];
  return mkMultipla('Quantos '+emoji+' você vê?', n, distractorsNear(n,3,3), emoji.repeat(n), 'contagem',
    `Quant${cw[1]==='f'?'as':'os'} ${cw[0]} você vê?`);
}
function genTopicVizinhos(diff){
  const r = numRange(diff);
  const a = rand(1,r.p1); const dir = pick(['antes','depois']);
  const ans = dir==='antes'? a-1 : a+1;
  return mkNumerica('Qual número vem '+dir+' do '+a+'?', ans, null, 'vizinhos');
}
function genTopicSoma(diff){
  const r = numRange(diff);
  const a = rand(1,r.p1), b = rand(1,r.p1);
  return mkMultipla(a+' + '+b+' = ?', a+b, distractorsNear(a+b,3,4), null, 'soma');
}
function genTopicSubtracao(diff){
  const r = numRange(diff);
  let a = rand(1,r.p1), b = rand(0,a);
  return mkNumerica(a+' − '+b+' = ?', a-b, null, 'subtracao');
}
function genTopicMult(diff){
  const r = numRange(diff);
  const a=rand(1,r.p2mul), b=rand(1,r.p2mul);
  return mkMultipla(a+' × '+b+' = ?', a*b, distractorsNear(a*b,3,Math.max(4,a)), null, 'mult');
}
function genTopicDiv(diff){
  const r = numRange(diff);
  const b = rand(2, Math.max(2,Math.floor(r.p2mul))); const q = rand(1, Math.max(2,Math.floor(r.p2div/b)));
  const a = b*q;
  return mkMultipla(a+' ÷ '+b+' = ?', q, distractorsNear(q,3,3), null, 'div');
}
function genTopicCombinada(diff){
  const r = numRange(diff);
  const a=rand(2,Math.min(20,r.p3)), b=rand(1,Math.min(10,r.p3)), c=rand(1,Math.min(10,r.p3));
  const useMinus = Math.random()<0.5;
  const ans = useMinus ? a+b-c : a-b+c;
  return mkNumerica(useMinus? `${a} + ${b} − ${c} = ?` : `${a} − ${b} + ${c} = ?`, ans, null, 'combinada');
}
function genTopicSequencia(diff){
  const r = numRange(diff);
  const step = rand(2, diff==='facil'?3:6);
  const start = rand(1, Math.min(20,r.p3));
  const seq = [start, start+step, start+2*step, start+3*step];
  return mkMultipla('Complete a sequência: '+seq.join(', ')+', ?', start+4*step, distractorsNear(start+4*step,3,step*2), null, 'sequencia');
}
function genTopicComparacao(diff){
  const r = numRange(diff);
  const a=rand(1,r.p3), b=rand(1,r.p3);
  const ans = a>b?'>': a<b? '<' : '=';
  return mkMultipla(`Qual sinal completa: ${a} ___ ${b} ?`, ans, ['>','<','='].filter(s=>s!==ans), null, 'comparacao');
}
function genTopicProblema(diff){
  const r = numRange(diff);
  const a=rand(2,Math.min(15,r.p3)), b=rand(1,Math.min(10,r.p3));
  const names = ['maçãs','balões','estrelinhas','figurinhas','biscoitos'];
  const n = pick(names);
  return mkNumerica(`Ana tinha ${a} ${n} e ganhou mais ${b}. Quantas ela tem agora?`, a+b, null, 'problema');
}
const TOPIC_GEN = {
  contagem: genTopicContagem, vizinhos: genTopicVizinhos, soma: genTopicSoma,
  subtracao: genTopicSubtracao, mult: genTopicMult, div: genTopicDiv,
  combinada: genTopicCombinada, sequencia: genTopicSequencia,
  comparacao: genTopicComparacao, problema: genTopicProblema
};
