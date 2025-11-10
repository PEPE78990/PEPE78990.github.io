// Cargar sprite sheet
const npcSpriteSheet = new Image();
npcSpriteSheet.src = '/mnt/data/865f9023-4248-4e64-88b9-3d3946d97b16.png';

// NPCs
function spawnNPC(x, y){
  npcs.push({
    id: npcId++,
    x, y,
    width: 32,
    height: 32,
    state: 'idle', // idle, dying
    frame: 0,
    frameTimer: 0,
    alpha: 1
  });
}

// Actualizar NPCs
function updateNPCs(dt){
  for(const n of npcs){
    n.frameTimer += dt;
    const frameDuration = 0.15; // tiempo por frame en segundos

    if(n.state === 'idle'){
      if(n.frameTimer > frameDuration){
        n.frame = (n.frame + 1) % 5; // fila superior tiene 5 frames
        n.frameTimer = 0;
      }
    } else if(n.state === 'dying'){
      if(n.frameTimer > frameDuration){
        n.frame++;
        n.frameTimer = 0;
        if(n.frame >= 5){ n.alpha = 0; } // fin de animación
      }
    }
  }
}

// Dibujar NPCs
function renderNPCs(){
  const left = camera.x - (canvas.clientWidth/2)*camera.zoom;
  const top = camera.y - (canvas.clientHeight/2)*camera.zoom;

  for(const n of npcs){
    if(n.alpha <= 0){ npcs.splice(npcs.indexOf(n),1); continue; }
    ctx.globalAlpha = n.alpha;

    const sx = n.frame * 32;
    const sy = (n.state === 'idle' ? 0 : 32); // fila superior idle, fila inferior muerte
    ctx.drawImage(
      npcSpriteSheet,
      sx, sy, 32, 32,
      (n.x-16-left)/camera.zoom,
      (n.y-16-top)/camera.zoom,
      32/camera.zoom, 32/camera.zoom
    );

    ctx.globalAlpha = 1;
  }
}

// Cuando un NPC recibe un disparo:
function hitNPC(n){
  n.state = 'dying';
  n.frame = 0;
  n.frameTimer = 0;
}
