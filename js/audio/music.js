let musicNodes=null;
function startMusic(){
  if(!SAVE.settings.musicOn) return;
  const ctx = ac(); if(!ctx) return;
  stopMusic();
  const selected = SAVE.settings.musicTrack === 'random'
    ? pick(MUSIC_TRACKS)
    : MUSIC_TRACKS[Number(SAVE.settings.musicTrack)] || MUSIC_TRACKS[0];
  const notes = selected.notes;
  let i=0;
  const g = ctx.createGain(); g.gain.value = SAVE.settings.musicVol*0.06; g.connect(ctx.destination);
  const id = setInterval(()=>{
    if(!SAVE.settings.musicOn) return;
    const o = ctx.createOscillator(); o.type='triangle'; o.frequency.value=notes[i%notes.length];
    const og = ctx.createGain(); og.gain.value=1;
    o.connect(og); og.connect(g);
    o.start(); og.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime+0.9);
    o.stop(ctx.currentTime+0.9);
    i++;
  }, 950);
  musicNodes = {id, g, trackName:selected.name};
}
function changeMusic(){
  sfxClick();
  const current = SAVE.settings.musicTrack === 'random' ? -1 : Number(SAVE.settings.musicTrack);
  SAVE.settings.musicTrack = String((current + 1) % MUSIC_TRACKS.length);
  persist();
  startMusic();
  goto(currentScreen, currentScreen === 'settings' ? {from:settingsBack} : undefined);
}
function stopMusic(){ if(musicNodes){ clearInterval(musicNodes.id); try{musicNodes.g.disconnect();}catch(e){} musicNodes=null; } }

