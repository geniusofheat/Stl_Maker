import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { S } from './stl_maker_state.js';
import { renderDrawingToolsHome } from './stl_maker_drawing_tools.js';
import { activeShape } from './stl_maker_layer_data.js';
import { goToLayersHome, goToShape } from './stl_maker_navigation.js';
import { svg } from './stl_maker_icons.js';


/* ─────────────────────────────────────────────────────────────
   THREE.JS
───────────────────────────────────────────────────────────── */

// lets other files (stl_maker_grid_rotate.js) hook into the render loop
// without three.js having to import them back (that would be circular)
const frameHooks = [];

export function onFrame(fn){
  frameHooks.push(fn);
}


export const canvas = document.getElementById('viewport3d');

const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias:true
});

renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
renderer.setClearColor(0x1a1a2e,1);

export const scene = new THREE.Scene();

export const camera = new THREE.PerspectiveCamera(
  45,
  1,
  .1,
  5000
);

// (90,70,110) framed the original 100mm plate; scaled up for the 175mm-long one
const DEFAULT_CAM =
  new THREE.Vector3(90,70,110).multiplyScalar(1.75);

camera.position.copy(DEFAULT_CAM);

// lets objects parented to the camera (the axis HUD in stl_maker_grid_rotate.js) render
scene.add(camera);

scene.add(
  new THREE.HemisphereLight(
    0xfff4e0,
    0x14141f,
    1.1
  )
);

const key =
  new THREE.DirectionalLight(
    0xffffff,
    1.4
  );

key.position.set(60,90,40);
scene.add(key);

const fillL =
  new THREE.DirectionalLight(
    0xc8a96e,
    .35
  );

fillL.position.set(-60,30,-40);
scene.add(fillL);


// build-plate size — matches the 3D printer's build volume
export const PLATE_W = 155;   // X (wide)
export const PLATE_L = 175;   // Y (long)
export const PLATE_H = 210;   // Z (high)
export const GRID_SQUARE = 5;

export const halfX = PLATE_W / 2;
export const halfY = PLATE_L / 2;

// kept so files that only need a rough/single value (like the
// paused grid-axis-indicator code) still work without changes
export const PLATE_SIZE = Math.max(PLATE_W, PLATE_L);
export const half = halfX;


/* GRID — X/Y PLANE. Same look as the original engine's GridHelper
   (gold center lines, dim blue-gray grid lines, 45% opacity), but
   rectangular for the 155 × 175 build plate. Lines sit on multiples
   of 5mm measured from the origin, so the origin is always on a
   crossing of two lines, exactly like the original. The plate edge
   isn't a multiple of 5 (155 and 175 are odd cell counts), so the
   outermost cells on each side are half-cells. Built flat in the XY
   plane already (Z is up) — do not rotate it. */

function buildGrid(){

  const CENTER = new THREE.Color(0xc8a96e);
  const LINE   = new THREE.Color(0x34355a);

  const nx = Math.floor(halfX/GRID_SQUARE);
  const ny = Math.floor(halfY/GRID_SQUARE);

  const pts=[];
  const cols=[];

  function seg(a,b,color){

    pts.push(a,b);
    cols.push(color.r,color.g,color.b);
    cols.push(color.r,color.g,color.b);
  }

  for(let i=-nx;i<=nx;i++){

    const x=i*GRID_SQUARE;

    seg(
      new THREE.Vector3(x,-halfY,0),
      new THREE.Vector3(x,halfY,0),
      i===0 ? CENTER : LINE
    );
  }

  for(let j=-ny;j<=ny;j++){

    const y=j*GRID_SQUARE;

    seg(
      new THREE.Vector3(-halfX,y,0),
      new THREE.Vector3(halfX,y,0),
      j===0 ? CENTER : LINE
    );
  }

  const geo=
    new THREE.BufferGeometry()
      .setFromPoints(pts);

  geo.setAttribute(
    'color',
    new THREE.Float32BufferAttribute(cols,3)
  );

  return new THREE.LineSegments(
    geo,
    new THREE.LineBasicMaterial({
      vertexColors:true,
      transparent:true,
      opacity:.45
    })
  );
}

const grid = buildGrid();

scene.add(grid);


/* PLATE BORDER */

const borderGeometry =
  new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(-halfX,-halfY,0),
    new THREE.Vector3(halfX,-halfY,0),
    new THREE.Vector3(halfX,halfY,0),
    new THREE.Vector3(-halfX,halfY,0)
  ]);

const plateBorder =
  new THREE.LineLoop(
    borderGeometry,
    new THREE.LineBasicMaterial({
      color:0xe0c48f
    })
  );

scene.add(plateBorder);


/* AXES */

function makeLabelSprite(
  text,
  color,
  fontSize=26
){

  const cvs =
    document.createElement('canvas');

  cvs.width = 64;
  cvs.height = 32;

  const ctx =
    cvs.getContext('2d');

  ctx.fillStyle =
    color || '#e0c48f';

  ctx.font =
    `bold ${fontSize}px monospace`;

  ctx.textAlign='center';
  ctx.textBaseline='middle';

  ctx.fillText(
    text,
    32,
    16
  );

  const spr =
    new THREE.Sprite(
      new THREE.SpriteMaterial({
        map:new THREE.CanvasTexture(cvs),
        depthTest:false
      })
    );

  spr.scale.set(6,3,1);

  return spr;
}


const axisOrigin =
  new THREE.Vector3(
    -halfX-4,
    -halfY-4,
    .1
  );


const xArrow =
  new THREE.ArrowHelper(
    new THREE.Vector3(1,0,0),
    axisOrigin,
    18,
    0xd9534f,
    4,
    3
  );

const yArrow =
  new THREE.ArrowHelper(
    new THREE.Vector3(0,1,0),
    axisOrigin,
    18,
    0x5cb85c,
    4,
    3
  );

const zArrow =
  new THREE.ArrowHelper(
    new THREE.Vector3(0,0,1),
    axisOrigin,
    18,
    0x4a90d9,
    4,
    3
  );

scene.add(xArrow);
scene.add(yArrow);
scene.add(zArrow);


const xLabel =
  makeLabelSprite(
    'X',
    '#d9534f',
    26
  );

const yLabel =
  makeLabelSprite(
    'Y',
    '#5cb85c',
    26
  );

const zLabel =
  makeLabelSprite(
    'Z',
    '#4a90d9',
    26
  );

scene.add(xLabel);
scene.add(yLabel);
scene.add(zLabel);


/* MM LABELS */


function buildMmLabels(step){

  if (S.mmLabelGroup)
    scene.remove(S.mmLabelGroup);

  S.mmLabelGroup =
    new THREE.Group();

  for (
    let v=0;
    v<=PLATE_W;
    v+=step
  ){

    const sx =
      makeLabelSprite(String(v));

    sx.position.set(
      -halfX+v,
      -halfY-5,
      .2
    );

    S.mmLabelGroup.add(sx);
  }

  for (
    let v=0;
    v<=PLATE_L;
    v+=step
  ){

    const sy =
      makeLabelSprite(String(v));

    sy.position.set(
      -halfX-5,
      -halfY+v,
      .2
    );

    S.mmLabelGroup.add(sy);
  }

  S.mmLabelGroup.visible=false;

  scene.add(S.mmLabelGroup);
}

buildMmLabels(5);


const mmBtn =
  document.createElement('button');

mmBtn.id='mmBtn';

document
  .getElementById('plate')
  .appendChild(mmBtn);


function refreshMmBtn(){

  mmBtn.innerHTML =
    `<span class="seg ${S.mmState==='5'?'on':''}">5</span>`+
    `<span class="sep">|</span>`+
    `<span class="seg ${S.mmState==='2.5'?'on':''}">2.5</span>`;
}


mmBtn.addEventListener(
  'click',
  () => {

    S.mmState =
      S.mmState==='off'
        ? '5'
        : S.mmState==='5'
          ? '2.5'
          : 'off';

    if(S.mmState==='off'){

      S.mmLabelGroup.visible=false;

    }else{

      buildMmLabels(
        S.mmState==='5'
          ? 5
          : 2.5
      );

      S.mmLabelGroup.visible=true;
    }

    refreshMmBtn();
  }
);

refreshMmBtn();


/* MODE */

const modeToggle =
  document.createElement('div');

modeToggle.id='modeToggle';

modeToggle.innerHTML =
  `<button data-m="2d">2D</button>`+
  `<button data-m="3d">3D</button>`;

document
  .getElementById('plate')
  .appendChild(modeToggle);


export const controls =
  new OrbitControls(
    camera,
    renderer.domElement
  );

controls.enableDamping=true;
controls.dampingFactor=.08;

controls.target.set(0,0,0);

controls.update();


controls.enableRotate=false;


/* WORKING PLANE */

export const dragGroundPlane =
  new THREE.Plane(
    new THREE.Vector3(0,0,1),
    0
  );


export function refreshModeScene(){

  if(S.shapeMode==='2d'){

    grid.rotation.set(
      0,
      0,
      0
    );

    grid.position.set(
      0,
      0,
      0
    );

    plateBorder.rotation.set(
      0,
      0,
      0
    );

    plateBorder.position.set(
      0,
      0,
      .06
    );

    xArrow.position.copy(axisOrigin);
    yArrow.position.copy(axisOrigin);

    xArrow.setDirection(
      new THREE.Vector3(1,0,0)
    );

    yArrow.setDirection(
      new THREE.Vector3(0,1,0)
    );

    xArrow.visible=true;
    yArrow.visible=true;
    zArrow.visible=false;
    zLabel.visible=false;

    xLabel.position.set(
      axisOrigin.x+10,
      axisOrigin.y,
      axisOrigin.z
    );

    yLabel.position.set(
      axisOrigin.x,
      axisOrigin.y+10,
      axisOrigin.z
    );

    xLabel.visible=true;
    yLabel.visible=true;

    // 140 framed the original 100mm plate; scaled up for the 175mm-long one
    camera.position.set(
      0,
      0,
      245
    );

    camera.up.set(
      0,
      1,
      0
    );

    controls.target.set(
      0,
      0,
      0
    );

    controls.enableRotate=false;

    dragGroundPlane.set(
      new THREE.Vector3(0,0,1),
      0
    );

  }else{

    grid.rotation.set(
      0,
      0,
      0
    );

    grid.position.set(
      0,
      0,
      0
    );

    plateBorder.rotation.set(
      0,
      0,
      0
    );

    plateBorder.position.set(
      0,
      0,
      .06
    );

    xArrow.position.copy(axisOrigin);
    yArrow.position.copy(axisOrigin);
    zArrow.position.copy(axisOrigin);

    xArrow.setDirection(
      new THREE.Vector3(1,0,0)
    );

    yArrow.setDirection(
      new THREE.Vector3(0,1,0)
    );

    zArrow.setDirection(
      new THREE.Vector3(0,0,1)
    );

    // all three visible — Z used to stay hidden after a visit to 2D
    xArrow.visible=true;
    yArrow.visible=true;
    zArrow.visible=true;

    xLabel.position.set(
      axisOrigin.x+10,
      axisOrigin.y,
      axisOrigin.z
    );

    yLabel.position.set(
      axisOrigin.x,
      axisOrigin.y+10,
      axisOrigin.z
    );

    zLabel.position.set(
      axisOrigin.x,
      axisOrigin.y,
      axisOrigin.z+10
    );

    xLabel.visible=true;
    yLabel.visible=true;
    zLabel.visible=true;

    camera.position.copy(
      DEFAULT_CAM
    );

    controls.target.set(
      0,
      0,
      0
    );

    camera.up.set(
      0,
      1,
      0
    );

    // finger turning of the grid is handled by stl_maker_grid_rotate.js
    controls.enableRotate =
      false;

    dragGroundPlane.set(
      new THREE.Vector3(0,0,1),
      0
    );
  }

  controls.update();

  if(S.mmState!=='off'){

    buildMmLabels(
      S.mmState==='5'
        ? 5
        : 2.5
    );

    S.mmLabelGroup.visible=true;
  }
}


export function refreshModeToggle(){

  modeToggle
    .querySelectorAll('button')
    .forEach(b => {

      b.classList.toggle(
        'toggle-active',
        b.dataset.m===S.shapeMode
      );
    });

  // lets the grid-rotate buttons show only in 3D
  document.dispatchEvent(
    new Event('stlmodechange')
  );
}


function setShapeMode(mode){

  S.shapeMode=mode;

  refreshModeScene();
  refreshModeToggle();

  if(S.activeModule==='tools'){
    renderDrawingToolsHome();

  }else if(S.activeModule==='layers'){

    const s=activeShape();

    if(s)
      goToShape();
    else
      goToLayersHome();
  }
}


modeToggle
  .querySelectorAll('button')
  .forEach(b => {

    b.addEventListener(
      'click',
      () => setShapeMode(
        b.dataset.m
      )
    );
  });


const lockBtn =
  document.createElement('button');

lockBtn.id='lockBtn';

document
  .getElementById('plate')
  .appendChild(lockBtn);


export function refreshLockBtn(){

  lockBtn.innerHTML =
    svg(
      S.rotationLocked
        ? 'lock'
        : 'unlock'
    );

  lockBtn.classList.toggle(
    'unlocked',
    !S.rotationLocked
  );
}


lockBtn.addEventListener(
  'click',
  () => {

    S.rotationLocked=
      !S.rotationLocked;

    // finger turning of the grid is handled by stl_maker_grid_rotate.js
    controls.enableRotate =
      false;

    refreshLockBtn();
  }
);

refreshLockBtn();


function fitCanvas(){

  const rect =
    document
      .getElementById('plate')
      .getBoundingClientRect();

  renderer.setSize(
    rect.width,
    rect.height,
    false
  );

  camera.aspect =
    rect.width /
    rect.height;

  camera.updateProjectionMatrix();
}


new ResizeObserver(
  fitCanvas
).observe(
  document.getElementById('plate')
);

setTimeout(
  fitCanvas,
  30
);


(function animate(){

  requestAnimationFrame(
    animate
  );

  controls.update();

  frameHooks.forEach(
    fn => fn()
  );

  renderer.render(
    scene,
    camera
  );

})();
