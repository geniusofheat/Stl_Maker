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

  scene.add(S.mmLabelGroup);
}

buildMmLabels(5);


/* AXIS EDGE INDICATORS (3D only) —
   short flat X/Y indicators centered on the grid edges.

   X indicators:
   - one above the grid and one below it
   - each is one-third of the grid's X length
   - left/right 2D arrowheads point in opposite directions
   - X is centered on each indicator

   Y indicators:
   - one left of the grid and one right of it
   - each is one-third of the grid's Y length
   - up/down 2D arrowheads point in opposite directions
   - Y is centered on each indicator

   The entire indicator group is rotated with the grid so the
   indicators remain flat in the same plane as the 3D build plate. */

function makeFlatArrowHead(
  position,
  direction,
  color
){

  const head =
    new THREE.Mesh(
      new THREE.ConeGeometry(1.8,5,3),
      new THREE.MeshBasicMaterial({color})
    );

  head.position.copy(position);

  // A cone is created along local +Y. Rotate it so its point
  // faces the requested 2D direction in the indicator plane.
  head.quaternion.setFromUnitVectors(
    new THREE.Vector3(0,1,0),
    direction.clone().normalize()
  );

  return head;
}

function edgeIndicator(
  p1,
  p2,
  direction,
  color,
  labelText
){

  const g = new THREE.Group();

  const line =
    new THREE.Line(
      new THREE.BufferGeometry()
        .setFromPoints([p1,p2]),
      new THREE.LineBasicMaterial({color})
    );

  g.add(line);

  g.add(
    makeFlatArrowHead(
      p1,
      direction.clone().negate(),
      color
    )
  );

  g.add(
    makeFlatArrowHead(
      p2,
      direction.clone(),
      color
    )
  );

  const mid =
    p1.clone().lerp(p2,.5);

  const label =
    makeLabelSprite(
      labelText,
      '#'+color.toString(16).padStart(6,'0'),
      32
    );

  label.position.copy(mid);
  label.renderOrder=999;

  g.add(label);

  return g;
}

const axisEdgeGroup = new THREE.Group();

const EDGE_GAP = 8;

// Each indicator is centered on its corresponding grid edge
// and is only one-third of that edge's total length.
const X_INDICATOR_HALF = PLATE_W / 6;
const Y_INDICATOR_HALF = PLATE_L / 6;

// X indicators — horizontal in the grid's local XY plane.
axisEdgeGroup.add(
  edgeIndicator(
    new THREE.Vector3(
      -X_INDICATOR_HALF,
      -halfY-EDGE_GAP,
      0
    ),
    new THREE.Vector3(
      X_INDICATOR_HALF,
      -halfY-EDGE_GAP,
      0
    ),
    new THREE.Vector3(1,0,0),
    0xd9534f,
    'X'
  )
);

axisEdgeGroup.add(
  edgeIndicator(
    new THREE.Vector3(
      -X_INDICATOR_HALF,
      halfY+EDGE_GAP,
      0
    ),
    new THREE.Vector3(
      X_INDICATOR_HALF,
      halfY+EDGE_GAP,
      0
    ),
    new THREE.Vector3(1,0,0),
    0xd9534f,
    'X'
  )
);

// Y indicators — vertical in the grid's local XY plane.
axisEdgeGroup.add(
  edgeIndicator(
    new THREE.Vector3(
      -halfX-EDGE_GAP,
      -Y_INDICATOR_HALF,
      0
    ),
    new THREE.Vector3(
      -halfX-EDGE_GAP,
      Y_INDICATOR_HALF,
      0
    ),
    new THREE.Vector3(0,1,0),
    0x5cb85c,
    'Y'
  )
);

axisEdgeGroup.add(
  edgeIndicator(
    new THREE.Vector3(
      halfX+EDGE_GAP,
      -Y_INDICATOR_HALF,
      0
    ),
    new THREE.Vector3(
      halfX+EDGE_GAP,
      Y_INDICATOR_HALF,
      0
    ),
    new THREE.Vector3(0,1,0),
    0x5cb85c,
    'Y'
  )
);

/*
   Z corner indicators are retained from the original file.
   They are separate from the X/Y flat indicator lines described above.
*/
[
  [-halfX,-halfY],
  [halfX,-halfY],
  [halfX,halfY],
  [-halfX,halfY]
].forEach(([cx,cy]) => {

  const corner = new THREE.Group();

  corner.add(
    new THREE.Line(
      new THREE.BufferGeometry()
        .setFromPoints([
          new THREE.Vector3(cx,cy,0),
          new THREE.Vector3(cx,cy,10)
        ]),
      new THREE.LineBasicMaterial({
        color:0x4a90d9
      })
    )
  );

  const head=
    new THREE.Mesh(
      new THREE.ConeGeometry(1.6,4,10),
      new THREE.MeshBasicMaterial({
        color:0x4a90d9
      })
    );

  head.position.set(cx,cy,10);
  head.rotation.x=Math.PI/2;

  corner.add(head);

  axisEdgeGroup.add(corner);
});

/*
   The grid is rotated 90° about X in the current 3D scene so its
   build surface becomes the X/Z plane. Rotate the complete X/Y
   indicator group by the same amount. This is what keeps the flat
   indicators physically coplanar with the visible grid instead of
   leaving them standing in the original world XY plane.
*/
axisEdgeGroup.rotation.set(Math.PI/2,0,0);

scene.add(axisEdgeGroup);


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

    axisEdgeGroup.visible=false;

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
    // axis edge indicators instead
    xArrow.visible=false;
    yArrow.visible=false;
    zArrow.visible=false;

    xLabel.visible=false;
    yLabel.visible=false;
    zLabel.visible=false;

    axisEdgeGroup.visible=true;

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

  const aspect =
    rect.width /
    rect.height;

  camera.aspect = aspect;

  /*
     Keep the complete build plate and its axis indicators inside
     the mobile viewport.  Changing camera.aspect alone is not
     enough on a narrow phone screen because the horizontal field
     of view becomes much smaller.
  */
  const margin = 1.10;
  const fitWidth = PLATE_W + 2 * 8 + 12;
  const fitHeight = PLATE_L + 2 * 8 + 12;

  const vFov =
    THREE.MathUtils.degToRad(camera.fov);

  const hFov =
    2 * Math.atan(
      Math.tan(vFov / 2) * aspect
    );

  const distanceForHeight =
    (fitHeight / 2) /
    Math.tan(vFov / 2);

  const distanceForWidth =
    (fitWidth / 2) /
    Math.tan(hFov / 2);

  const fitDistance =
    Math.max(
      distanceForHeight,
      distanceForWidth
    ) * margin;

  if(S.shapeMode==='2d'){

    camera.position.set(
      0,
      0,
      fitDistance
    );

    camera.up.set(
      0,
      1,
      0
    );

  }else{

    const direction =
      DEFAULT_CAM.clone().normalize();

    camera.position.copy(
      direction.multiplyScalar(
        fitDistance
      )
    );

    camera.up.set(
      0,
      1,
      0
    );
  }

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