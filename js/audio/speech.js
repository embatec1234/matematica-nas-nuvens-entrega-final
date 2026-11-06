/* ---------- LEITURA EM VOZ ALTA (Text-to-Speech) ----------
   Usa a Web Speech API do próprio navegador (sem internet e sem arquivos
   de áudio). O jogador escolhe um personagem narrador (VOICE_CHARS); cada
   um muda o tom e a velocidade da voz, e tenta usar uma voz feminina ou
   masculina do aparelho quando existir. ------------------------------- */
function ttsSupported(){
  return ('speechSynthesis' in window) && (typeof SpeechSynthesisUtterance !== 'undefined');
}
function currentVoiceChar(){
  return VOICE_CHARS.find(v=>v.id===SAVE.settings.voiceChar) || VOICE_CHARS[0];
}
const FEMALE_HINT = /female|feminin|maria|francisca|luciana|vit[oó]ria|thalita|brenda|giovanna|leila|fernanda|camila|raquel|helena|yara|joana|google portugu/i;
const MALE_HINT = /\bmale\b|masculin|daniel|anton?io|antônio|felipe|donato|fabio|fábio|humberto|val[eé]rio|ricardo|jorge|thiago|j[uú]lio|cristiano/i;

/* vozes em português disponíveis (pt-BR primeiro) */
function ptVoices(){
  if(!ttsSupported()) return [];
  const all = window.speechSynthesis.getVoices() || [];
  const br = all.filter(v=>/^pt[-_]br/i.test(v.lang));
  const other = all.filter(v=>/^pt/i.test(v.lang) && !/^pt[-_]br/i.test(v.lang));
  return br.concat(other);
}
/* nota de qualidade da voz: quanto maior, mais natural. Vozes neurais/online (Edge "Natural", Google, Apple Premium)
   ganham das vozes antigas "de computador". */
function voiceQuality(v){
  const n = (v.name || '') + ' ' + (v.voiceURI || '');
  let s = 0;
  if(/natural|neural/i.test(n)) s += 100;
  if(/premium|enhanced|siri/i.test(n)) s += 70;
  if(/online|network/i.test(n) || v.localService === false) s += 40;
  if(/google/i.test(n)) s += 30;
  if(/desktop/i.test(n)) s -= 20;
  return s;
}
/* a melhor voz em português do aparelho, só se ela for do tipo natural/IA (senão null) */
function bestNaturalVoice(){
  const ranked = ptVoices()
    .map(v=>({v, s: voiceQuality(v) + (/^pt[-_]br/i.test(v.lang) ? 15 : 0)}))
    .filter(x=>voiceQuality(x.v) >= 30)
    .sort((a,b)=>b.s - a.s);
  return ranked.length ? ranked[0].v : null;
}
function pickVoiceFor(ch){
  const voices = ptVoices();
  if(!voices.length) return null;
  const uri = SAVE.settings.voiceURI;
  if(uri && uri !== 'auto'){
    const chosen = voices.find(v=>v.voiceURI === uri);
    if(chosen) return chosen;
  }
  /* personagem de IA: sempre a voz mais natural que o aparelho tiver */
  if(ch && ch.ai){
    const best = bestNaturalVoice();
    if(best) return best;
  }
  // Prefere vozes neurais/online, quando o navegador disponibiliza uma.
  const naturalHints = /online|neural|natural|google.*portugu|microsoft.*(francisca|antonio|raquel|brenda)|francisca.*online/i;
  const natural = voices.filter(v => naturalHints.test(v.name));
  if(natural.length) return natural.find(v => /^pt[-_]br/i.test(v.lang)) || natural[0];
  const google = voices.find(v => /google/i.test(v.name) && /^pt[-_]br/i.test(v.lang));
  if(google) return google;
  return voices.find(v => /^pt[-_]br/i.test(v.lang)) || voices[0];
}
if(ttsSupported()){
  window.speechSynthesis.onvoiceschanged = ()=>{
    if(currentScreen === 'voices'){
      const box = $('#deviceVoiceBox');
      if(box) box.innerHTML = deviceVoiceSelectHTML();
      const ai = $('#aiVoiceStatus');
      if(ai) ai.innerHTML = aiVoiceStatusHTML();
    }
  };
}

function cleanForSpeech(text){
  // remove emojis e símbolos que a leitura em voz alta não deve pronunciar
  return String(text)
    .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u2705\u2764\uFE0F]/gu,'')
    .replace(/\s+/g,' ')
    .trim();
}
/* troca símbolos de conta por palavras, para a voz ler "5 vezes 4" e não "5 x 4" */
function mathToSpeech(text){
  return String(text)
    .replace(/=\s*\?/g,' é igual a quanto? ')
    .replace(/_{2,}/g,', ')
    .replace(/\s*\+\s*/g,' mais ')
    .replace(/\s*[−–]\s*/g,' menos ')
    .replace(/(\d)\s*-\s*(\d)/g,'$1 menos $2')
    .replace(/\s*×\s*/g,' vezes ')
    .replace(/\s*÷\s*/g,' dividido por ')
    .replace(/\s*>\s*/g,' maior que ')
    .replace(/\s*<\s*/g,' menor que ')
    .replace(/\s*=\s*/g,' igual a ')
    .replace(/\s+/g,' ')
    .trim();
}
/* falas longas viram várias partes (o Chrome corta falas com mais de ~15s) */
function splitForSpeech(text){
  const parts = text.match(/[^.!?]+[.!?]*/g) || [text];
  const out = []; let cur = '';
  parts.forEach(p=>{
    p = p.trim(); if(!p) return;
    if(cur && (cur + ' ' + p).length > 170){ out.push(cur); cur = p; }
    else cur = cur ? cur + ' ' + p : p;
  });
  if(cur) out.push(cur);
  return out;
}

let speakToken = 0;
function setTalking(on){ document.body.classList.toggle('narrator-talking', !!on); }
function stopSpeaking(){
  speakToken++;
  setTalking(false);
  if(ttsSupported()){ try{ window.speechSynthesis.cancel(); }catch(e){} }
}
/* opts.force = fala mesmo com a narração desligada (botões 🔊 e prévia de voz) */
function speak(text, opts){
  opts = opts || {};
  if(!SAVE.settings.readAloudOn && !opts.force) return;
  if(!ttsSupported()) return;
  const clean = mathToSpeech(cleanForSpeech(text));
  if(!clean) return;
  const my = ++speakToken;
  try{ window.speechSynthesis.cancel(); }catch(e){}
  const ch = currentVoiceChar();
  const chunks = splitForSpeech(clean);
  setTimeout(()=>{
    if(my !== speakToken) return; // outra fala começou (ou foi interrompida) nesse meio tempo
    try{
      const voice = pickVoiceFor(ch);
      chunks.forEach((c,i)=>{
        const u = new SpeechSynthesisUtterance(c);
        if(voice){ u.voice = voice; u.lang = voice.lang; } else { u.lang = 'pt-BR'; }
        // Valores neutros evitam distorcer artificialmente a voz do aparelho.
        // A voz de IA fala em ritmo natural (1.0), que é como as vozes neurais soam melhor.
        u.rate = ch.ai ? 1.0 : 0.96;
        u.pitch = 1.0;
        if(i === 0) u.onstart = ()=>{ if(my === speakToken) setTalking(true); };
        if(i === chunks.length-1) u.onend = u.onerror = ()=>{ if(my === speakToken) setTalking(false); };
        window.speechSynthesis.speak(u);
      });
    }catch(e){ /* TTS indisponível neste navegador, apenas ignora */ }
  }, 40);
}
/* fala só depois de um instante e só se o jogador ainda estiver na mesma tela */
function speakSoon(text, screen, delay){
  setTimeout(()=>{ if(currentScreen === screen) speak(text); }, delay||300);
}
/* textos falados por botões ficam num registro, para não precisar escapar aspas no HTML */
const SPEECH_REG = {};
function sayKey(key){ speak(SPEECH_REG[key] || '', {force:true}); }
function sayQuestion(q){ if(q) speak(q.spoken || q.text, {force:true}); }

function toggleReadAloud(val){
  SAVE.settings.readAloudOn = val;
  persist();
  sfxClick();
  if(val) speak('Leitura em voz alta ativada.');
  else stopSpeaking();
}

/* o navegador só libera o áudio depois de um toque/clique do jogador */
let userInteracted = false;
['pointerdown','keydown','touchstart'].forEach(ev=>
  window.addEventListener(ev, ()=>{ userInteracted = true; }, {capture:true, passive:true}));

