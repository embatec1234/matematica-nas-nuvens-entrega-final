/* =========================================================
   MATEMÁTICA NAS NUVENS — jogo educativo (single file)
========================================================= */

/* ---------- CONFIG ---------- */
const QUESTIONS_PER_PHASE = 8;
const BONUS_QUESTIONS = 10;
const START_LIVES = 3;
const AVATARS = ['👦','👧','🧒','👶','👦🏽','👧🏽','👦🏾','👧🏾'];
const PHASE_INFO = {
  1:{name:'Fundamentos', icon:'🔢', desc:'Números, contagem e as primeiras somas e subtrações.'},
  2:{name:'Operações', icon:'➗', desc:'Soma, subtração, multiplicação e divisão.'},
  3:{name:'Desafios', icon:'🧩', desc:'Sequências, comparações e probleminhas.'},
  4:{name:'Desafio Final', icon:'🏆', desc:'Contas com mais de uma operação, número que falta e probleminhas de dois passos.'}
};
const CORRECT_MSGS = ['🎉 Muito bem!','⭐ Excelente!','👏 Isso aí!','🌟 Mandou bem!','✨ Show de bola!'];
const WRONG_MSGS = ['💭 Quase! Tente de novo.','🤔 Não foi dessa vez, você consegue!','💙 Continue tentando!','🌤️ Foi por pouco!'];
/* Assuntos das perguntas (usados no feedback de desempenho) */
const TOPICS = {   /* "say" entra em frases como "Você é craque em ___" e "Vamos treinar mais ___?" */
  contagem:{label:'Contagem', emoji:'🔢', say:'contagem'},
  vizinhos:{label:'Antes e depois', emoji:'↔️', say:'achar o número de antes e de depois'},
  soma:{label:'Soma', emoji:'➕', say:'somas'},
  subtracao:{label:'Subtração', emoji:'➖', say:'subtrações'},
  mult:{label:'Multiplicação', emoji:'✖️', say:'multiplicações'},
  div:{label:'Divisão', emoji:'➗', say:'divisões'},
  combinada:{label:'Contas combinadas', emoji:'🧮', say:'contas combinadas'},
  sequencia:{label:'Sequências', emoji:'🔁', say:'sequências'},
  comparacao:{label:'Comparações', emoji:'⚖️', say:'comparações'},
  problema:{label:'Probleminhas', emoji:'📖', say:'probleminhas'}
};
const DIFF_LABEL = {facil:'Fácil', medio:'Médio', dificil:'Difícil'};
const HISTORY_MAX = 30;
/* CÓDIGO MESTRE do professor/responsável: serve quando a criança esquece o código secreto
   de figurinhas e é preciso apagar o perfil ou criar um novo código. TROQUE por um número seu! */
const PARENT_MASTER_CODE = '2580';
/* Estrelas de avaliação da fase (imagens da pasta img/). Para trocar o desenho, substitua os PNGs. */
const STAR_ON  = 'img/estrela.png';        // estrela conquistada (dourada)
const STAR_OFF = 'img/estrela-vazia.png';  // estrela não conquistada (cinza)

