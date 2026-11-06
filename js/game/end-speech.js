/* fala automática do fim de fase (vitória ou derrota) */
function endSpeech(result, s, fb, extra){
  const c = s.correct, w = s.wrong, log = s.log || [];
  const b = [];
  if(result === 'win') b.push(`${fb.title} ${fb.msg}`);
  else b.push('Ah, acabaram as suas vidas! Mas tudo bem, todo mundo erra.');
  if(c === 0) b.push(`Você errou ${w} ${plural(w,'pergunta','perguntas')}. Errar faz parte de aprender!`);
  else if(w === 0) b.push(`Você acertou ${c} ${plural(c,'pergunta','perguntas')} e não errou nenhuma!`);
  else b.push(`Você acertou ${c} ${plural(c,'pergunta','perguntas')} e errou ${w}.`);
  if(result === 'win' && extra && extra.stars) b.push(`Você ganhou ${extra.stars} ${plural(extra.stars,'estrela','estrelas')}!`);
  if(result === 'win' && extra && extra.record) b.push('Esse é um novo recorde nesta fase!');
  const errs = log.map((e,i)=>({e,i})).filter(x=>!x.e.ok);
  if(errs.length){
    b.push(result === 'win' ? 'Vamos ver o que você errou?' : 'Vamos ver o que aconteceu, para você treinar?');
    errs.slice(0,2).forEach(x=>b.push(reviewLine(x.e, x.i)));
    if(errs.length > 2){
      const more = errs.length - 2;
      b.push(`E teve mais ${more} ${plural(more,'pergunta','perguntas')} na lista. Toque no alto-falante para ouvir.`);
    }
  }
  if(result !== 'win') b.push('Tente de novo! Eu acredito em você.');
  return b.join(' ');
}

