/* ---------- NOMES: lógica do banco de nomes (dados em js/config/name-bank.js) ---------- */
function normName(s){
  return String(s).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
}
function nameLetter(s){ return normName(s).charAt(0).toUpperCase(); }

/* listas sem repetição e em ordem alfabética (português) */
const NAME_BANK = {
  first: Array.from(new Set(FIRST_NAMES)).sort((a,b)=>a.localeCompare(b,'pt-BR')),
  last:  Array.from(new Set(SURNAMES)).sort((a,b)=>a.localeCompare(b,'pt-BR'))
};

/* letras que existem na lista (kind = 'first' ou 'last') */
function bankLetters(kind){
  return Array.from(new Set(NAME_BANK[kind].map(nameLetter))).sort();
}
/* itens para mostrar: por letra, ou pela busca (a busca só filtra a lista, nunca vira nome) */
function bankItems(kind, letter, query){
  const q = normName(query || '');
  const out = [];
  NAME_BANK[kind].forEach((name, i)=>{
    if(q){ if(normName(name).includes(q)) out.push({i, name}); }
    else if(letter && nameLetter(name) === letter){ out.push({i, name}); }
  });
  return out;
}

function composeName(first, last){ return last ? first + ' ' + last : first; }

/* confere se um nome inteiro é feito só com itens do banco; devolve {first,last} ou null */
function parseBankName(full){
  const s = String(full || '').trim().replace(/\s+/g,' ');
  if(!s) return null;
  const firsts = NAME_BANK.first.slice().sort((a,b)=>b.length-a.length); // "Ana Clara" antes de "Ana"
  for(const f of firsts){
    if(s === f) return {first:f, last:''};
    if(s.startsWith(f + ' ')){
      const rest = s.slice(f.length + 1);
      if(NAME_BANK.last.includes(rest)) return {first:f, last:rest};
    }
  }
  return null;
}
