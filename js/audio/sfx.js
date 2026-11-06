/* simple audio via WebAudio, no external assets */
let audioCtx=null;
function ac(){ if(!audioCtx){ try{audioCtx = new (window.AudioContext||window.webkitAudioContext)();}catch(e){} } return audioCtx; }
function beep(freq, dur, type, vol){
  if(!SAVE.settings.sfxOn) return;
  const ctx = ac(); if(!ctx) return;
  const o = ctx.createOscillator(); const g = ctx.createGain();
  o.type = type||'sine'; o.frequency.value = freq;
  g.gain.value = (vol!=null?vol:1) * SAVE.settings.sfxVol * 0.25;
  o.connect(g); g.connect(ctx.destination);
  o.start();
  g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime+dur);
  o.stop(ctx.currentTime+dur);
}
function sfxCorrect(){ beep(523.25,0.12,'sine',1); setTimeout(()=>beep(783.99,0.18,'sine',1),100); }
function sfxWrong(){ beep(180,0.25,'sawtooth',0.7); }
function sfxClick(){ beep(440,0.05,'square',0.4); }
/* Estouro do coração: um "bum" grave que desce de tom + um chiado curto de ruído (tudo gerado aqui, sem arquivo de áudio). */
function sfxExplosion(){
  if(!SAVE.settings.sfxOn) return;
  const ctx = ac(); if(!ctx) return;
  if(ctx.state==='suspended' && ctx.resume){ try{ const pr = ctx.resume(); if(pr && pr.catch) pr.catch(()=>{}); }catch(e){} }
  const t = ctx.currentTime, vol = SAVE.settings.sfxVol;
  // chiado: ruído que vai sumindo, passando por um filtro que "abafa" aos poucos
  const len = Math.floor(ctx.sampleRate*0.35);
  const buf = ctx.createBuffer(1, len, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for(let i=0;i<len;i++) data[i] = (Math.random()*2-1) * Math.pow(1-i/len, 2);
  const noise = ctx.createBufferSource(); noise.buffer = buf;
  const lp = ctx.createBiquadFilter(); lp.type = 'lowpass';
  lp.frequency.setValueAtTime(2600, t); lp.frequency.exponentialRampToValueAtTime(300, t+0.35);
  const ng = ctx.createGain();
  ng.gain.setValueAtTime(vol*0.28, t); ng.gain.exponentialRampToValueAtTime(0.001, t+0.35);
  noise.connect(lp); lp.connect(ng); ng.connect(ctx.destination);
  noise.start(t);
  // bum: tom grave que cai rápido
  const o = ctx.createOscillator(); o.type = 'sine';
  o.frequency.setValueAtTime(170, t); o.frequency.exponentialRampToValueAtTime(40, t+0.28);
  const og = ctx.createGain();
  og.gain.setValueAtTime(vol*0.36, t); og.gain.exponentialRampToValueAtTime(0.001, t+0.3);
  o.connect(og); og.connect(ctx.destination);
  o.start(t); o.stop(t+0.32);
}
function sfxWin(){ [523,659,784,1046].forEach((f,i)=>setTimeout(()=>beep(f,0.2,'sine',1), i*110)); }

