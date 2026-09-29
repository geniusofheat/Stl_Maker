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


/* GRID — X/Y PLANE (rectangular: PLATE_W × PLATE_L, true 5mm squares) */

function buildGrid(){

  const pts=[];

  for(
    let x=-halfX;
    x<=halfX+.001;
    x+=GRID_SQUARE
  ){

    pts.push(
      new THREE.Vector3(x,-halfY,0),
      new THREE.Vector3(x,halfY,0)
    );
  }

  for(
    let y=-halfY;
    y<=halfY+.001;
    y+=GRID_SQUARE
  ){

    pts.push(
      new THREE.Vector3(-halfX,y,0),
      new THREE.Vector3(halfX,y,0)
    );
  }

  const g=
    new THREE.LineSegments(
      new THREE.BufferGeometry()
        .setFromPoints(pts),
      new THREE.LineBasicMaterial({
        color:0x34355a,
        transparent:true,
        opacity:.4
      })
    );

  return g;
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

 