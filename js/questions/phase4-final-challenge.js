/* ---------- FASE 4 — DESAFIO FINAL ----------
   Perguntas próprias, mais difíceis que as das fases 1, 2 e 3:
   - expressões com mais de uma operação (ordem das contas e parênteses)
   - descobrir o número que falta (□ + 17 = 45)
   - probleminhas de dois passos
   - multiplicação com números maiores e divisão com quocientes maiores
   - sequências com regra mais difícil (passo que cresce, ×2, ×3, decrescente)
   - comparação entre duas contas
   A maioria pede resposta digitada (sem chute). Todas as respostas são
   números inteiros, pois o campo de resposta só aceita inteiros. */
function phase4Params(diff){
  if(diff==='facil')   return {m:6,  s:30,  t:5,  big:[11,15], small:[2,5]};
  if(diff==='dificil') return {m:12, s:100, t:10, big:[15,40], small:[3,9]};
  return                      {m:9,  s:60,  t:8,  big:[12,25], small:[2,6]}; // médio
}
/* alternativas diferentes entre si e da resposta; "extras" são os erros mais prováveis */
function uniqueOpts(answer, extras, count, spread){
  const set = new Set();
  extras.forEach(v=>{ if(Number.isFinite(v) && v!==answer && v>=0) set.add(v); });
  let guard = 0;
  while(set.size<count && guard<80){
    guard++;
    const d = answer + rand(-spread,spread);
    if(d!==answer && d>=0) set.add(d);
  }
  let k = 1;
  while(set.size<count){ const d = answer + k++; set.add(d); }
  return [...set].slice(0,count);
}
const P4_NAMES = ['Ana','Bia','Caio','Davi','Lia','Pedro','Júlia','Theo','Rita','Léo'];
/* g = gênero, para concordar "quantas/quantos" */
const P4_ITEMS = [{n:'figurinhas',g:'f'},{n:'balões',g:'m'},{n:'biscoitos',g:'m'},{n:'maçãs',g:'f'},{n:'livros',g:'m'},{n:'bolinhas de gude',g:'f'}];
function spokenParens(t){ return t.replace(/\(/g,'abre parênteses ').replace(/\)/g,' fecha parênteses'); }

function p4Expressao(P){
  const m = P.m;
  const kind = pick(['soma_mult','mult_menos','parenteses_mult','menos_mult','parenteses_div']);
  let text, ans;
  if(kind==='soma_mult'){
    const a=rand(2,Math.floor(P.s/2)), b=rand(2,m), c=rand(2,m);
    text = `${a} + ${b} × ${c} = ?`; ans = a + b*c;
  } else if(kind==='mult_menos'){
    const a=rand(2,m), b=rand(2,m), prod=a*b, c=rand(1,Math.min(prod-1, Math.floor(P.s/2)));
    text = `${a} × ${b} − ${c} = ?`; ans = prod - c;
  } else if(kind==='parenteses_mult'){
    const a=rand(1,P.t), b=rand(1,P.t), c=rand(2,Math.min(m,9));
    text = `(${a} + ${b}) × ${c} = ?`; ans = (a+b)*c;
  } else if(kind==='menos_mult'){
    const b=rand(2,m), c=rand(2,m), prod=b*c, a=rand(prod+1, prod+Math.floor(P.s/2));
    text = `${a} − ${b} × ${c} = ?`; ans = a - prod;
  } else { // parenteses_div: (a + b) ÷ c, sempre exato
    const c=rand(2,Math.min(m,9)), q=rand(2,Math.min(m,9)), total=c*q, a=rand(1,total-1), b=total-a;
    text = `(${a} + ${b}) ÷ ${c} = ?`; ans = q;
  }
  const spoken = text.indexOf('(')>=0 ? spokenParens(text) : null;
  return mkNumerica(text, ans, null, 'combinada', spoken);
}

function p4Faltante(P){
  const m = P.m;
  const kind = pick(['soma','subtracao','mult','div']);
  if(kind==='soma'){
    const a=rand(5,P.s), b=rand(5,P.s), c=a+b;
    return mkNumerica(`Qual número falta? ___ + ${b} = ${c}`, a, null, 'soma',
      `Qual número falta? Um número mais ${b} é igual a ${c}.`);
  }
  if(kind==='subtracao'){
    const b=rand(5,P.s), c=rand(5,P.s), a=b+c;
    return mkNumerica(`Qual número falta? ${a} − ___ = ${c}`, b, null, 'subtracao',
      `Qual número falta? ${a} menos um número é igual a ${c}.`);
  }
  if(kind==='mult'){
    const a=rand(2,m), b=rand(2,m), c=a*b;
    return mkNumerica(`Qual número falta? ___ × ${b} = ${c}`, a, null, 'mult',
      `Qual número falta? Um número vezes ${b} é igual a ${c}.`);
  }
  const b=rand(2,m), q=rand(2,m), a=b*q;
  return mkNumerica(`Qual número falta? ${a} ÷ ___ = ${q}`, b, null, 'div',
    `Qual número falta? ${a} dividido por um número é igual a ${q}.`);
}

function p4Problema(P){
  const m = P.m, it = pick(P4_ITEMS), item = it.n, qtd = it.g==='f' ? 'quantas' : 'quantos', Qtd = it.g==='f' ? 'Quantas' : 'Quantos';
  const [n1, n2] = shuffle(P4_NAMES);
  const kind = pick(['ganha_da','pacotes_da','reparte_ganha','compara_soma']);
  if(kind==='ganha_da'){
    const A=rand(10,10+Math.floor(P.s/2)), B=rand(3,Math.max(5,Math.floor(P.s/4)));
    const C=rand(2, Math.min(A+B-1, Math.max(6,Math.floor(P.s/3))));
    return mkNumerica(`${n1} tinha ${A} ${item}, ganhou mais ${B} e depois deu ${C} para um colega. Com ${qtd} ${item} ${n1} ficou?`, A+B-C, null, 'problema');
  }
  if(kind==='pacotes_da'){
    const G=rand(3,m), N=rand(2,m), E=rand(2, Math.min(G*N-1, Math.max(4,Math.floor(P.s/3))));
    return mkNumerica(`${n1} comprou ${G} pacotes com ${N} ${item} cada. Depois, deu ${E} ${item} para um colega. Com ${qtd} ${item} ${n1} ficou?`, G*N-E, null, 'problema');
  }
  if(kind==='reparte_ganha'){
    const K=rand(2,Math.min(m,6)), q=rand(3,m+2), T=K*q, M=rand(2,Math.max(4,Math.floor(P.s/6)));
    return mkNumerica(`${n1} repartiu ${T} ${item} igualmente entre ${K} amigos. Depois, cada amigo ganhou mais ${M}. ${Qtd} ${item} cada amigo tem agora?`, q+M, null, 'problema');
  }
  const A=rand(5,Math.max(10,Math.floor(P.s/3))), B=rand(2,Math.max(5,Math.floor(P.s/6)));
  return mkNumerica(`${n1} tem ${A} ${item}. ${n2} tem ${B} ${item} a mais que ${n1}. ${Qtd} ${item} os dois têm juntos?`, A+(A+B), null, 'problema');
}

function p4MultGrande(P){
  const a=rand(P.big[0],P.big[1]), b=rand(P.small[0],P.small[1]), ans=a*b;
  return mkMultipla(`${a} × ${b} = ?`, ans, uniqueOpts(ans,[ans+10,ans-10,ans+b,ans-b],3,Math.max(6,b)), null, 'mult');
}

function p4DivGrande(P){
  const b=rand(3,P.m), q=rand(6,Math.min(15,P.m+6)), a=b*q;
  return mkNumerica(`${a} ÷ ${b} = ?`, q, null, 'div');
}

function p4Sequencia(P){
  const kind = pick(['passo_cresce','vezes','decrescente']);
  let seq, ans, wrong;
  if(kind==='passo_cresce'){ // ex.: 2, 3, 5, 8, 12, ?  (soma 1, 2, 3, 4, 5…)
    let t = rand(1,10), d = rand(1,3);
    seq = [t];
    for(let i=0;i<4;i++){ t += d; seq.push(t); d++; }
    ans = seq[4] + d;
    wrong = [seq[4] + (d-1), seq[4] + d + 1, seq[4] + d - 2];
  } else if(kind==='vezes'){ // ex.: 3, 6, 12, 24, ?
    const r = (P.m<=6) ? 2 : pick([2,3]);
    const s = (r===2) ? rand(1,5) : rand(1,3);
    seq = [s, s*r, s*r*r, s*r*r*r];
    ans = s*r*r*r*r;
    wrong = [seq[3] + (seq[3]-seq[2]), seq[3] + r, seq[3]*r + r];
  } else { // decrescente com passo maior
    const step = rand(4, P.m<=6 ? 7 : 12);
    const start = rand(step*5+5, step*5+60);
    seq = [0,1,2,3].map(i=>start - i*step);
    ans = start - 4*step;
    wrong = [ans+step, ans-step, ans+2];
  }
  return mkMultipla('Complete a sequência: '+seq.join(', ')+', ?', ans, uniqueOpts(ans, wrong, 3, 5), null, 'sequencia');
}

function p4Comparacao(P){
  const m = P.m;
  const side = ()=> Math.random()<0.5
    ? (()=>{ const x=rand(2,m), y=rand(2,m); return {txt:`${x} × ${y}`, val:x*y}; })()
    : (()=>{ const x=rand(2,Math.floor(P.s/2)), y=rand(2,Math.floor(P.s/2)); return {txt:`${x} + ${y}`, val:x+y}; })();
  let L = side(), R = side(), guard = 0;
  if(Math.random()<0.3){ // às vezes são iguais, para o "=" também aparecer
    const x=rand(2,m), y=rand(2,m), total=x*y, c=rand(1,Math.max(1,total-1));
    L = {txt:`${x} × ${y}`, val:total}; R = {txt:`${c} + ${total-c}`, val:total};
  }
  while((L.txt===R.txt || Math.abs(L.val-R.val)>25) && guard<40){ L = side(); R = side(); guard++; }
  const ans = L.val>R.val ? '>' : L.val<R.val ? '<' : '=';
  return mkMultipla(`Qual sinal completa: ${L.txt} ___ ${R.txt} ?`, ans, ['>','<','='].filter(s=>s!==ans), null, 'comparacao');
}

function genPhase4(diff){
  const P = phase4Params(diff);
  const gen = pick([
    p4Expressao, p4Expressao,
    p4Faltante, p4Faltante,
    p4Problema, p4Problema,
    p4MultGrande, p4DivGrande,
    p4Sequencia, p4Comparacao
  ]);
  return gen(P);
}
const PHASE_GEN = {1:genPhase1, 2:genPhase2, 3:genPhase3, 4:genPhase4};

