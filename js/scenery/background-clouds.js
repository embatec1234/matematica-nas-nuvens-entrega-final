/* ---------- BACKGROUND CLOUDS / CENÁRIO ---------- */
function paintClouds(){
  const layer = $('#cloud-layer'); if(!layer) return;
  const isBonus = sceneIsBonus();
  const scene = isBonus ? 'space' : 'sky';
  if(layer.dataset.scene === scene && layer.childElementCount) return; /* mesmo cenário: não recria (evita reiniciar animações a cada pergunta) */
  const changed = !!layer.dataset.scene;
  layer.dataset.scene = scene;
  layer.innerHTML='';
  layer.className = isBonus ? 'space-scene' : 'sky-scene';
  if(changed){ layer.style.animation='none'; void layer.offsetWidth; layer.style.animation='sceneFade .9s ease both'; }

  if(isBonus){
    paintSpace(layer);
  }else{
    /* --- NUVENS --- */
    const N_CLOUDS = 9;
    const cloudTops = spreadBands(N_CLOUDS, 2, 84, 4);
    for(let i=0;i<N_CLOUDS;i++){
      const dur = rand(26,44);
      const cloud = document.createElement('div');
      cloud.className='bgcloud';
      cloud.innerHTML = cloudSVG();
      cloud.style.top = cloudTops[i].toFixed(1)+'%';
      cloud.style.setProperty('--scale', (0.45 + rand(0,70)/100).toFixed(2));
      cloud.style.opacity = (0.6 + rand(0,35)/100).toFixed(2);
      cloud.style.animationDuration = dur+'s';
      // atraso distribuído: espalha as nuvens ao longo de toda a largura
      cloud.style.animationDelay = `-${(dur * (i + Math.random()*0.6) / N_CLOUDS).toFixed(1)}s`;
      layer.appendChild(cloud);
    }

    /* --- AVIÕES --- */
    const N_PLANES = 2;
    const planeTops = spreadBands(N_PLANES, 8, 44, 4);
    for(let i=0;i<N_PLANES;i++){
      const dur = rand(24,36);
      const plane = document.createElement('div');
      plane.className='sky-plane';
      plane.innerHTML = `<div class="plane-inner">${planeSVG()}</div>`;
      plane.style.top = planeTops[i].toFixed(1)+'%';
      plane.style.setProperty('--scale', (0.62 + rand(0,38)/100).toFixed(2));
      plane.style.animationDuration = dur+'s';
      plane.style.animationDelay = `-${(dur * (i + Math.random()*0.5) / N_PLANES).toFixed(1)}s`;
      layer.appendChild(plane);
    }

    /* --- PÁSSAROS --- */
    const N_BIRDS = 5;
    const birdTops = spreadBands(N_BIRDS, 10, 66, 5);
    for(let i=0;i<N_BIRDS;i++){
      const dur = rand(16,26);
      const bird = document.createElement('div');
      bird.className='sky-bird';
      bird.innerHTML = `<div class="bird-inner">${birdSVG()}</div>`;
      bird.style.top = birdTops[i].toFixed(1)+'%';
      bird.style.setProperty('--scale', (0.55 + rand(0,45)/100).toFixed(2));
      bird.style.setProperty('--flap', (0.34 + rand(0,16)/100).toFixed(2)+'s');
      bird.style.animationDuration = dur+'s';
      bird.style.animationDelay = `-${(dur * (i + Math.random()*0.5) / N_BIRDS).toFixed(1)}s`;
      layer.appendChild(bird);
    }
  }
}

function refreshScene(){ paintClouds(); }

