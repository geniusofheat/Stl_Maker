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

const DEFAULT_CAM =
  new THREE.Vector3(90,70,110);

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


export const PLATE_SIZE = 100;
export const GRID_SQUARE = 5;
export const half = PLATE_SIZE / 2;


/* GRID — X/Y PLANE */

const grid =
  new THREE.GridHelper(
    PLATE_SIZE,
    PLATE_SIZE / GRID_SQUARE,
    0xc8a96e,
    0x34355a
  );

grid.material.transparent = true;
grid.material.opacity = .4;

grid.rotation.x = Math.PI / 2;

scene.add(grid);


/* PLATE BORDER */

const borderGeometry =
  new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(-half,-half,0),
    new THREE.Vector3(half,-half,0),
    new THREE.Vector3(half,half,0),
    new THREE.Vector3(-half,half,0)
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
    -half-4,
    -half-4,
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
    v<=PLATE_SIZE;
    v+=step
  ){

    const sx =
      makeLabelSprite(String(v));

    sx.position.set(
      -half+v,
      -half-5,
      .2
    );

    S.mmLabelGroup.add(sx);


    const sy =
      makeLabelSprite(String(v));

    sy.position.set(
      -half-5,
      -half+v,
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
      Math.PI/2,
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

    xArrow.position.set(
      -half-4,
      -half-4,
      .1
    );

    xArrow.setDirection(
      new THREE.Vector3(1,0,0)
    );

    yArrow.position.set(
      -half-4,
      -half-4,
      .1
    );

    yArrow.setDirection(
      new THREE.Vector3(0,1,0)
    );

    zArrow.visible=false;
    zLabel.visible=false;

    xLabel.position.set(
      -half-4+10,
      -half-4,
      .1
    );

    yLabel.position.set(
      -half-4,
      -half-4+10,
      .1
    );

    xLabel.visible=true;
    yLabel.visible=true;

    camera.position.set(
      0,
      0,
      140
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
      Math.PI/2,
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

    // the corner arrows are only used in 2D now; 3D shows the
    // centered axis HUD from stl_maker_grid_rotate.js instead
    xArrow.visible=false;
    yArrow.visible=false;
    zArrow.visible=false;

    xLabel.visible=false;
    yLabel.visible=false;
    zLabel.visible=false;

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

  renderer.render(
    scene,
    camera
  );

})();
