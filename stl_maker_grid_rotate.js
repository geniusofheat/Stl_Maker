import * as THREE from 'three';
import { S } from './stl_maker_state.js';
import { camera, canvas, controls, onFrame } from './stl_maker_three.js';
import { clearHistoryKind, pushHistory } from './stl_maker_h2.js';
import { scene } from './stl_maker_three.js';
import { half, PLATE_SIZE } from './stl_maker_three.js';


/* ─────────────────────────────────────────────────────────────
   GRID ROTATE
   Turns the whole grid (and everything on it) in 3D mode.

   Axis buttons:
     Z = spin around the origin (0,0, the center of the grid)  ← default
     X = tip the grid forward / back
     Y = flip the grid left / right

   Degree buttons turn the grid by a fixed amount on the chosen axis.
   With the grid unlocked, dragging a finger turns it on that axis.
───────────────────────────────────────────────────────────── */

const DRAG_SPEED = 0.012;      // radians per pixel of finger travel (X / Y)
const ANIM_MS    = 280;        // length of a 90° / 180° turn

const AXES = {
  X: new THREE.Vector3(1,0,0),
  Y: new THREE.Vector3(0,1,0),
  Z: new THREE.Vector3(0,0,1)
};

let gridAxis = 'Z';


/* ── grid axis tripod ──
   A small X/Y/Z tripod for the GRID (the grid is what owns the
   axes — a shape just sits on it). It hovers above the plate, at
   a fixed spot, so its lines never mix with whatever's on the
   grid. It's built in real 3D space, not attached to the screen,
   so as the grid/camera orbits it turns right along with
   everything else. Visible any time you're in 3D mode, on load
   and with or without a shape selected. */

const AXIS_COLOR = {
  X:0xd9534f,
  Y:0x5cb85c,
  Z:0x4a90d9
};

const shapeHud = new THREE.Group();

let shapeHudAdded=false;


function makeHudLabel(text, color){

  const cvs=
    document.createElement(
      'canvas'
    );

  cvs.width=64;
  cvs.height=64;

  const ctx=cvs.getContext('2d');

  ctx.fillStyle=color;
  ctx.font=
    'bold 46px "JetBrains Mono", monospace';
  ctx.textAlign='center';
  ctx.textBaseline='middle';
  ctx.fillText(text,32,34);

  const spr=
    new THREE.Sprite(
      new THREE.SpriteMaterial({
        map:
          new THREE.CanvasTexture(
            cvs
          ),
        depthTest:false
      })
    );

  spr.renderOrder=999;

  return spr;
}

function hudArm(color, dir){

  const g=new THREE.Group();

  const line=
    new THREE.Line(
      new THREE.BufferGeometry()
        .setFromPoints([
          new THREE.Vector3(0,0,0),
          dir
        ]),
      new THREE.LineBasicMaterial({
        color,
        depthTest:false
      })
    );

  line.renderOrder=998;

  g.add(line);

  const head=
    new THREE.Mesh(
      new THREE.ConeGeometry(.18,.5,10),
      new THREE.MeshBasicMaterial({
        color,
        depthTest:false
      })
    );

  head.position.copy(dir);

  head.quaternion.setFromUnitVectors(
    new THREE.Vector3(0,1,0),
    dir.clone().normalize()
  );

  head.renderOrder=998;

  g.add(head);

  return g;
}

// tripod shape: Z straight up, X down-left, Y down-right (matches Jeff's sketch)
shapeHud.add(
  hudArm(
    AXIS_COLOR.Z,
    new THREE.Vector3(0,0,1)
  )
);

shapeHud.add(
  hudArm(
    AXIS_COLOR.X,
    new THREE.Vector3(-.8,0,-.6)
  )
);

shapeHud.add(
  hudArm(
    AXIS_COLOR.Y,
    new THREE.Vector3(.8,0,-.6)
  )
);

shapeHud.add(
  makeHudLabel('Z','#4a90d9')
    .translateOnAxis(
      new THREE.Vector3(0,0,1),
      1.35
    )
);

shapeHud.add(
  makeHudLabel('X','#d9534f')
    .translateOnAxis(
      new THREE.Vector3(-.8,0,-.6)
        .normalize(),
      1.55
    )
);

shapeHud.add(
  makeHudLabel('Y','#5cb85c')
    .translateOnAxis(
      new THREE.Vector3(.8,0,-.6)
        .normalize(),
      1.55
    )
);

shapeHud
  .children
  .filter(c => c.isSprite)
  .forEach(spr =>
    spr.scale.set(2,2,1)
  );


const HUD_SCALE = PLATE_SIZE*.12;

// fixed above the grid's origin corner — added lazily (not at module
// load) so this file doesn't need "scene" before three.js finishes loading
function updateShapeHud(){

  if(!shapeHudAdded){

    scene.add(shapeHud);

    shapeHud.scale.setScalar(HUD_SCALE);

    shapeHud.position.set(
      -half,
      -half,
      HUD_SCALE
    );

    shapeHudAdded=true;
  }

  shapeHud.visible=
    S.shapeMode==='3d';
}


/* ── buttons over the grid ── */

const bar =
  document.createElement('div');

bar.id='gridRotBar';

bar.innerHTML=
  `<div class="grp">`+
    `<button data-ga="X">X</button>`+
    `<button data-ga="Y">Y</button>`+
    `<button data-ga="Z" title="Spin around the origin">Z</button>`+
  `</div>`+
  `<div class="grp">`+
    `<button data-deg="-90">−90°</button>`+
    `<button data-deg="90">90°</button>`+
    `<button data-deg="180">180°</button>`+
  `</div>`;

document
  .getElementById('plate')
  .appendChild(bar);


function refreshAxisButtons(){

  bar
    .querySelectorAll('[data-ga]')
    .forEach(b =>
      b.classList.toggle(
        'toggle-active',
        b.dataset.ga===gridAxis
      )
    );
}

function refreshBarVisibility(){

  bar.style.display =
    S.shapeMode==='3d'
      ? 'flex'
      : 'none';
}

// three.js announces 2D / 3D changes (the camera resets, so old turns can't be undone)
document.addEventListener(
  'stlmodechange',
  () => {

    refreshBarVisibility();

    clearHistoryKind('grid');
  }
);

refreshAxisButtons();
refreshBarVisibility();


bar
  .querySelectorAll('[data-ga]')
  .forEach(b => {

    b.addEventListener(
      'click',
      () => {

        gridAxis=b.dataset.ga;

        refreshAxisButtons();
      }
    );
  });

bar
  .querySelectorAll('[data-deg]')
  .forEach(b => {

    b.addEventListener(
      'click',
      () => {

        const axis=gridAxis;

        const angle=
          THREE.MathUtils.degToRad(
            parseFloat(b.dataset.deg)
          );

        spinGrid(axis,angle);

        recordTurn(axis,angle);
      }
    );
  });


/* ── turning the grid ──
   The grid is turned by moving the camera the opposite way around
   the origin, so nothing on the grid changes position. */

function turnGrid(axisName, angle){

  const a = AXES[axisName];

  camera.position.applyAxisAngle(a,-angle);
  camera.up.applyAxisAngle(a,-angle);
  controls.target.applyAxisAngle(a,-angle);

  camera.lookAt(controls.target);

  controls.update();
}


// undo / redo for grid turns
function recordTurn(axis, angle){

  pushHistory({
    kind:'grid',
    undo:() => spinGrid(axis,-angle),
    redo:() => spinGrid(axis,angle)
  });
}


let anim = null;

function finishAnim(){

  if(!anim)
    return;

  turnGrid(
    anim.axis,
    anim.total-anim.done
  );

  anim=null;
}

function spinGrid(axisName, total){

  finishAnim();

  anim={
    axis:axisName,
    total,
    done:0,
    start:performance.now()
  };

  (function step(now){

    if(!anim)
      return;

    const t=
      Math.min(
        1,
        (now-anim.start)/ANIM_MS
      );

    const eased=
      1-Math.pow(1-t,3);

    const target=
      total*eased;

    turnGrid(
      anim.axis,
      target-anim.done
    );

    anim.done=target;

    if(t<1)
      requestAnimationFrame(step);
    else
      anim=null;

  })(anim.start);
}


/* ── finger drag ── */

const pointers = new Set();

let drag = null;


function canDrag(){

  return (
    S.shapeMode==='3d' &&
    !S.rotationLocked &&
    !S.crosshairActive &&
    !S.manipulationActive
  );
}

function toScreen(v3){

  const rect=
    canvas.getBoundingClientRect();

  const p=
    v3.clone().project(camera);

  return new THREE.Vector2(
    rect.left+(p.x+1)*rect.width/2,
    rect.top+(1-p.y)*rect.height/2
  );
}

function originAngle(x,y){

  const c=
    toScreen(
      new THREE.Vector3(0,0,0)
    );

  return Math.atan2(
    y-c.y,
    x-c.x
  );
}

function wrap(a){

  while(a>Math.PI)
    a-=Math.PI*2;

  while(a<-Math.PI)
    a+=Math.PI*2;

  return a;
}


canvas.addEventListener(
  'pointerdown',
  e => {

    pointers.add(e.pointerId);

    if(!canDrag() || pointers.size!==1){

      drag=null;

      return;
    }

    finishAnim();

    drag={
      id:e.pointerId,
      x:e.clientX,
      y:e.clientY,
      angle:originAngle(
        e.clientX,
        e.clientY
      ),
      total:0
    };
  }
);


canvas.addEventListener(
  'pointermove',
  e => {

    if(!drag || e.pointerId!==drag.id)
      return;

    if(!canDrag() || pointers.size!==1){

      finishDrag();

      return;
    }

    const a=AXES[gridAxis];

    const viewSide=
      camera.position.dot(a)>=0
        ? 1
        : -1;

    let plateAngle=0;


    if(gridAxis==='Z'){

      // circular drag around the origin
      const ang=
        originAngle(
          e.clientX,
          e.clientY
        );

      plateAngle=
        -wrap(ang-drag.angle)*
        viewSide;

      drag.angle=ang;

    }else{

      // follow the finger on the side of the grid facing the camera
      const dx=e.clientX-drag.x;
      const dy=e.clientY-drag.y;

      const near=
        camera.position.clone()
          .addScaledVector(
            a,
            -camera.position.dot(a)
          );

      if(near.length()>1e-3){

        near
          .normalize()
          .multiplyScalar(60);

        const tangent=
          new THREE.Vector3()
            .crossVectors(a,near)
            .normalize()
            .multiplyScalar(5);

        const p0=toScreen(near);

        const p1=
          toScreen(
            near.clone().add(tangent)
          );

        const s=
          new THREE.Vector2(
            p1.x-p0.x,
            p1.y-p0.y
          );

        const len=s.length();

        if(len>1e-4){

          s.divideScalar(len);

          plateAngle=
            (dx*s.x+dy*s.y)*
            DRAG_SPEED;
        }
      }
    }

    drag.x=e.clientX;
    drag.y=e.clientY;

    if(plateAngle){

      turnGrid(gridAxis,plateAngle);

      drag.total+=plateAngle;
      drag.axis=gridAxis;
    }
  }
);


// one undo step for the whole finger drag
function finishDrag(){

  if(drag && Math.abs(drag.total)>0.02)
    recordTurn(drag.axis,drag.total);

  drag=null;
}

function endPointer(e){

  pointers.delete(e.pointerId);

  if(drag && drag.id===e.pointerId)
    finishDrag();
}

canvas.addEventListener('pointerup',endPointer);
canvas.addEventListener('pointercancel',endPointer);

onFrame(updateShapeHud);
