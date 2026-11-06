/* Personagens narradores. Cada um combina tom (pitch) e velocidade (rate) da
   voz do aparelho para soar diferente. "pref" é só uma preferência: tenta
   escolher uma voz feminina/masculina entre as que o navegador tiver. */
const VOICE_CHARS = [
  {id:'nino',    name:'Nino',               art:'o', emoji:'🐨', desc:'Voz amiga e calma',      pitch:1.05, rate:0.92, pref:'any',
   sample:'Oi! Eu sou o Nino, seu guia nas nuvens. Vamos aprender juntos?'},
  {id:'ratinho', name:'Ratinho Espertinho', art:'o', emoji:'🐭', desc:'Voz fininha e animada',  pitch:1.95, rate:1.12, pref:'female',
   sample:'Iupii! Eu sou o Ratinho Espertinho! Bora fazer contas bem rapidinho?'},
  {id:'fada',    name:'Fadinha Estrela',    art:'a', emoji:'🧚', desc:'Voz doce e brilhante',   pitch:1.6,  rate:0.98, pref:'female',
   sample:'Olá! Eu sou a Fadinha Estrela. Vou espalhar brilho na sua matemática!'},
  {id:'urso',    name:'Ursão Bonzinho',     art:'o', emoji:'🐻', desc:'Voz grossa e calma',     pitch:0.35, rate:0.82, pref:'male',
   sample:'Oi, amiguinho. Eu sou o Ursão Bonzinho. Vem comigo, que a gente vai longe!'},
  {id:'ia',      name:'Nuvi',               art:'a', emoji:'✨', desc:'Voz de IA, natural e fluida', pitch:1.0, rate:1.0, pref:'any', ai:true,
   sample:'Olá! Eu sou a Nuvi, uma inteligência artificial. Vou ler tudo com calma e de um jeito bem natural. Vamos aprender juntos?'},
  {id:'heroi',   name:'Capitão Nuvem',      art:'o', emoji:'🦸', desc:'Voz forte e corajosa',   pitch:0.7,  rate:1.0,  pref:'male',
   sample:'Atenção! Eu sou o Capitão Nuvem! Com a matemática, ninguém nos para!'},
  {id:'vovo',    name:'Vovô Tartaruga',     art:'o', emoji:'🐢', desc:'Voz lenta e sábia',      pitch:0.6,  rate:0.62, pref:'male',
   sample:'Olá, meu netinho. Eu sou o Vovô Tartaruga. Devagar e sempre, a gente aprende.'},
  {id:'alien',   name:'Alienzinho Zip',     art:'o', emoji:'👽', desc:'Voz aguda e maluquinha', pitch:1.75, rate:0.85, pref:'any',
   sample:'Zip zip! Eu sou o Alienzinho Zip. Vim de outro planeta para brincar de matemática!'}
];

