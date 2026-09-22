import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { STLExporter } from 'three/addons/exporters/STLExporter.js';
import { ICONS, MODULES, SHAPES_3D, SWATCHES } from './stl_maker_data.js';


/* ─────────────────────────────────────────────────────────────
   STYLES
───────────────────────────────────────────────────────────── */

const style = document.createElement('style');

style.textContent = `
.module-btn.active-blue{
  background:#3a6fd8 !important;
  border-color:#3a6fd8 !important;
  color:#fff !important;
}
.module-btn.active-blue svg{color:#fff !important}

#slideMenu{transition:none !important}
#slideMenu.open{width:92px;min-width:92px}

.toggle-row2{
  display:flex;
  gap:4px;
  width:100%;
}

.toggle-row2 button{
  flex:1;
  padding:6px 1px;
  border-radius:7px;
  border:1px solid var(--line);
  background:var(--navy-3);
  color:var(--ink);
  font-size:9.5px;
  font-weight:700;
}

.toggle-row2 button.toggle-active{
  background:#3a6fd8;
  color:#fff;
  border-color:#3a6fd8;
}

.add-rect{
  width:100%;
  padding:6px 1px;
  border-radius:7px;
  border:1px solid var(--line);
  background:var(--navy-3);
  color:var(--gold-light);
  font-size:8.5px;
  font-weight:700;
  display:flex;
  align-items:center;
  justify-content:center;
  gap:3px;
}

.add-rect svg{
  width:12px;
  height:12px;
}

.h3-stack{
  display:flex;
  flex-direction:column;
  gap:6px;
  width:100%;
}

.menu-scroll{
  align-items:center;
}

.tile3{
  display:flex;
  flex-direction:column;
  align-items:center;
  justify-content:center;
  gap:3px;
  width:72px;
  aspect-ratio:1;
  border-radius:12px;
  background:var(--navy-3);
  border:1px solid var(--line);
  color:var(--ink);
  padding:4px 3px;
  position:relative;
}

.tile3 svg{
  width:16px;
  height:16px;
  color:var(--gold-light);
  flex:0 0 auto;
}

.tile3 span{
  font-size:8.5px;
  font-weight:600;
  text-align:center;
  line-height:1.1;
  display:block;
  overflow:hidden;
  text-overflow:ellipsis;
  max-height:2.2em;
}

.tile3.toggle-active{
  background:#3a6fd8;
  border-color:#3a6fd8;
  color:#fff;
}

.tile3.toggle-active svg{
  color:#fff;
}

.tile3.layer-active{
  background:#fff;
  border:2px solid #3a6fd8;
  color:#111;
}

.tile3.layer-active svg{
  color:#3a6fd8;
}

.tile3.layer-active span{
  color:#111;
}

.tile-num{
  position:absolute;
  top:-7px;
  right:-4px;
  background:var(--gold);
  color:var(--navy);
  font-size:9px;
  font-weight:800;
  width:17px;
  height:17px;
  border-radius:50%;
  display:flex;
  align-items:center;
  justify-content:center;
}

.tile-del{
  position:absolute;
  bottom:-7px;
  right:-7px;
  width:20px;
  height:20px;
  border-radius:6px;
  background:var(--navy);
  border:1px solid var(--line);
  color:var(--muted);
  display:flex;
  align-items:center;
  justify-content:center;
  z-index:2;
}

.tile-del svg{
  width:11px;
  height:11px;
}

.tile-del.armed{
  background:var(--danger);
  color:#fff;
  border-color:var(--danger);
}

.stepper-row{
  display:flex;
  align-items:center;
  gap:3px;
  width:100%;
  min-width:0;
  padding:0 3px;
  box-sizing:border-box;
}

.stepper-row .step-lbl{
  display:flex;
  align-items:center;
  justify-content:center;
  width:18px;
  min-width:18px;
  height:28px;
  font-family:'JetBrains Mono',monospace;
  font-size:8px;
  color:var(--gold);
  flex:0 0 auto;
  text-align:center;
  border:1px solid var(--line);
  border-radius:6px;
  background:var(--navy-3);
  cursor:pointer;
}

.stepper-row .step-lbl.axis-active{
  background:#3a6fd8;
  border-color:#3a6fd8;
  color:#fff;
}

.stepper-row button{
  width:28px;
  height:28px;
  flex:0 0 auto;
  background:var(--navy-3);
  border:1px solid var(--line);
  border-radius:6px;
  color:var(--gold-light);
  font-size:15px;
  font-weight:700;
  line-height:1;
  padding:0;
}

.stepper-row button:active{
  background:var(--gold);
  color:var(--navy);
}

.stepper-row input{
  flex:1 1 0;
  min-width:0;
  width:0;
  height:28px;
  box-sizing:border-box;
  background:#fff;
  color:#111;
  border:1px solid var(--line);
  border-radius:6px;
  font-family:'JetBrains Mono',monospace;
  font-size:9px;
  padding:3px 1px;
  text-align:center;
}

.stepper-row .value-button{
  flex:1 1 0;
  min-width:0;
  height:28px;
  background:#fff;
  color:#111;
  border:1px solid var(--line);
  border-radius:6px;
  font-family:'JetBrains Mono',monospace;
  font-size:8.5px;
  padding:0 2px;
  text-align:center;
}

.stepper-row.all-axes .step-lbl{
  width:28px;
  min-width:28px;
  font-size:7px;
  text-transform:uppercase;
}

.stepper-stack{
  display:flex;
  flex-direction:column;
  gap:5px;
  width:100%;
  padding:0;
  box-sizing:border-box;
}

.action-col{
  display:flex;
  flex-direction:column;
  gap:4px;
  width:100%;
}

.action-col button{
  display:flex;
  flex-direction:row;
  align-items:center;
  gap:6px;
  background:var(--navy-3);
  border:1px solid var(--line);
  border-radius:8px;
  color:var(--ink);
  padding:7px 6px;
  width:100%;
}

.action-col button svg{
  width:15px;
  height:15px;
  color:var(--gold-light);
  flex:0 0 auto;
}

.action-col button span{
  font-size:9px;
  font-weight:600;
}

.action-col button.active{
  border-color:#3a6fd8;
  background:#3a6fd8;
  color:#fff;
}

.action-col button.active svg{
  color:#fff;
}

.action-col button:disabled{
  opacity:.35;
}

.tile-row{
  display:flex;
  flex-wrap:wrap;
  gap:8px;
  justify-content:center;
  width:100%;
}

.swatch-row{
  display:flex;
  flex-wrap:wrap;
  gap:6px;
  justify-content:center;
  width:100%;
}

#lockBtn,
#mmBtn,
#modeToggle{
  position:absolute;
  top:10px;
  z-index:6;
  height:36px;
  background:rgba(32,33,58,.9);
  border:1px solid var(--line);
  border-radius:9px;
  color:var(--gold-light);
  display:flex;
  align-items:center;
  justify-content:center;
}

#modeToggle{
  left:10px;
  padding:3px;
  gap:3px;
}

#modeToggle button{
  height:100%;
  padding:0 10px;
  border-radius:6px;
  border:none;
  background:transparent;
  color:var(--muted);
  font-size:11px;
  font-weight:700;
}

#modeToggle button.toggle-active{
  background:#3a6fd8;
  color:#fff;
}

#mmBtn{
  left:118px;
  padding:0 9px;
  font-family:'JetBrains Mono',monospace;
  font-size:10.5px;
  font-weight:700;
  gap:5px;
}

#lockBtn{
  right:10px;
  width:36px;
}

#lockBtn svg{
  width:17px;
  height:17px;
}

#lockBtn.unlocked{
  color:var(--muted);
}

#mmBtn .seg{
  opacity:.4;
}

#mmBtn .seg.on{
  opacity:1;
  color:#fff;
}

#mmBtn .sep{
  opacity:.3;
}

#crosshairCursor{
  position:absolute;
  display:none;
  align-items:center;
  justify-content:center;
  width:34px;
  height:34px;
  pointer-events:none;
  z-index:7;
  color:#3a6fd8;
  font-size:30px;
  line-height:1;
  text-shadow:0 1px 2px #000;
}

#moveCursor{
  position:absolute;
  display:none;
  width:34px;
  height:34px;
  pointer-events:none;
  z-index:20;
  color:#3a6fd8;
  font-size:30px;
  line-height:30px;
  text-shadow:0 1px 2px #000;
}

#moveCursor span{
  display:block;
  transform:rotate(-8deg);
}

#confirmOverlay{
  position:absolute;
  inset:0;
  z-index:50;
  background:rgba(0,0,0,.55);
  display:flex;
  align-items:center;
  justify-content:center;
}

#confirmOverlay.hidden{
  display:none;
}

.confirm-box{
  background:var(--navy-2);
  border:1px solid var(--line);
  border-radius:12px;
  padding:18px;
  width:78%;
  max-width:280px;
  text-align:center;
}

.confirm-box p{
  font-size:13px;
  color:var(--ink);
  margin:0 0 14px;
}

.confirm-row{
  display:flex;
  gap:10px;
}

.confirm-row button{
  flex:1;
  padding:10px;
  border-radius:8px;
  font-size:13px;
  font-weight:700;
  border:1px solid var(--line);
}

.confirm-yes{
  background:var(--danger);
  color:#fff;
  border-color:var(--danger);
}

.confirm-no{
  background:var(--navy-3);
  color:var(--ink);
}

#h2Title{
  white-space:normal !important;
  word-break:break-word;
}
`;

document.head.appendChild(style);


/* ─────────────────────────────────────────────────────────────
   ICONS
───────────────────────────────────────────────────────────── */

function svg(name){
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${ICONS[name]||''}</svg>`;
}

Object.assign(ICONS,{
  lock:'<rect x="5" y="10.5" width="14" height="9.5" rx="1.5"/><path d="M8 10.5V7a4 4 0 0 1 8 0v3.5"/>',
  unlock:'<rect x="5" y="10.5" width="14" height="9.5" rx="1.5"/><path d="M8 10.5V7a4 4 0 0 1 7.5-2"/>',
  twod:'<rect x="4" y="4" width="16" height="16" rx="2"/>',
  threed:'<path d="M12 2 3 7.5 12 12l9-4.5L12 2Z"/><path d="M3 7.5v9L12 21l9-4.5v-9"/>',
  pencil:'<path d="m14 4 6 6-11 11H3v-6L14 4Z"/><path d="m13.5 5.5 5 5"/>',
  rotate:'<path d="M20 11a8 8 0 0 0-14.9-4L3 9"/><path d="M3 4v5h5"/><path d="M4 13a8 8 0 0 0 14.9 4L21 15"/><path d="M21 20v-5h-5"/>',
  move:'<path d="M12 2v20M2 12h20"/><path d="m8 6 4-4 4 4M8 18l4 4 4-4M6 8l-4 4 4 4M18 8l4 4-4 4"/>'
});


/* ─────────────────────────────────────────────────────────────
   THREE.JS
───────────────────────────────────────────────────────────── */

const canvas = document.getElementById('viewport3d');

const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias:true
});

renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
renderer.setClearColor(0x1a1a2e,1);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  45,
  1,
  .1,
  5000
);

const DEFAULT_CAM =
  new THREE.Vector3(90,70,110);

camera.position.copy(DEFAULT_CAM);

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


const PLATE_SIZE = 100;
const GRID_SQUARE = 5;
const half = PLATE_SIZE / 2;

let shapeMode = '2d';


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

let mmLabelGroup = null;

function buildMmLabels(step){

  if (mmLabelGroup)
    scene.remove(mmLabelGroup);

  mmLabelGroup =
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

    mmLabelGroup.add(sx);


    const sy =
      makeLabelSprite(String(v));

    sy.position.set(
      -half-5,
      -half+v,
      .2
    );

    mmLabelGroup.add(sy);
  }

  mmLabelGroup.visible=false;

  scene.add(mmLabelGroup);
}

buildMmLabels(5);

let mmState='off';

const mmBtn =
  document.createElement('button');

mmBtn.id='mmBtn';

document
  .getElementById('plate')
  .appendChild(mmBtn);


function refreshMmBtn(){

  mmBtn.innerHTML =
    `<span class="seg ${mmState==='5'?'on':''}">5</span>`+
    `<span class="sep">|</span>`+
    `<span class="seg ${mmState==='2.5'?'on':''}">2.5</span>`;
}


mmBtn.addEventListener(
  'click',
  () => {

    mmState =
      mmState==='off'
        ? '5'
        : mmState==='5'
          ? '2.5'
          : 'off';

    if(mmState==='off'){

      mmLabelGroup.visible=false;

    }else{

      buildMmLabels(
        mmState==='5'
          ? 5
          : 2.5
      );

      mmLabelGroup.visible=true;
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


const controls =
  new OrbitControls(
    camera,
    renderer.domElement
  );

controls.enableDamping=true;
controls.dampingFactor=.08;

controls.target.set(0,0,0);

controls.update();

let rotationLocked=true;

controls.enableRotate=false;


/* WORKING PLANE */

const dragGroundPlane =
  new THREE.Plane(
    new THREE.Vector3(0,0,1),
    0
  );


function refreshModeScene(){

  if(shapeMode==='2d'){

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
      10
    );

    controls.enableRotate =
      !rotationLocked;

    dragGroundPlane.set(
      new THREE.Vector3(0,0,1),
      0
    );
  }

  controls.update();

  if(mmState!=='off'){

    buildMmLabels(
      mmState==='5'
        ? 5
        : 2.5
    );

    mmLabelGroup.visible=true;
  }
}


function refreshModeToggle(){

  modeToggle
    .querySelectorAll('button')
    .forEach(b => {

      b.classList.toggle(
        'toggle-active',
        b.dataset.m===shapeMode
      );
    });
}


function setShapeMode(mode){

  shapeMode=mode;

  refreshModeScene();
  refreshModeToggle();

  if(activeModule==='tools'){
    renderDrawingToolsHome();

  }else if(activeModule==='layers'){

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


function refreshLockBtn(){

  lockBtn.innerHTML =
    svg(
      rotationLocked
        ? 'lock'
        : 'unlock'
    );

  lockBtn.classList.toggle(
    'unlocked',
    !rotationLocked
  );
}


lockBtn.addEventListener(
  'click',
  () => {

    rotationLocked=
      !rotationLocked;

    controls.enableRotate =
      shapeMode==='3d' &&
      !rotationLocked;

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


/* ─────────────────────────────────────────────────────────────
   DATA
───────────────────────────────────────────────────────────── */

const layers=[];

let nextLayerId=1;
let activeLayerId=null;
let activeShapeId=null;

const GRAY=0x777788;


function findLayer(id){
  return layers.find(
    l => l.id===id
  );
}


function activeLayer(){
  return findLayer(
    activeLayerId
  );
}


function activeShape(){

  const l=activeLayer();

  return l
    ? l.shapes.find(
        s => s.id===activeShapeId
      )
    : null;
}


function createLayer(){

  const l={
    id:nextLayerId++,
    name:`Layer ${layers.length+1}`,
    shapes:[]
  };

  layers.push(l);

  return l;
}


function refreshShapeVisuals(){

  layers.forEach(
    l => {

      l.shapes.forEach(
        s => {

          const active =
            l.id===activeLayerId &&
            s.id===activeShapeId;

          if(
            s.mesh.material &&
            s.mesh.material.color
          ){

            s.mesh.material.color.set(
              active
                ? s.color
                : GRAY
            );
          }

          if(
            s.mesh.userData.outline
          ){

            s.mesh.userData.outline.visible =
              !active;
          }
        }
      );
    }
  );
}


/* ─────────────────────────────────────────────────────────────
   GEOMETRY
───────────────────────────────────────────────────────────── */

function polygonGeometry(
  sides,
  radius
){

  const shape =
    new THREE.Shape();

  for(
    let i=0;
    i<sides;
    i++
  ){

    const a =
      Math.PI/2 +
      i/sides *
      Math.PI*2;

    const x =
      Math.cos(a)*radius;

    const y =
      Math.sin(a)*radius;

    if(i===0)
      shape.moveTo(x,y);
    else
      shape.lineTo(x,y);
  }

  shape.closePath();

  return new THREE.ShapeGeometry(
    shape
  );
}


function rotateGeometryToZ(
  geometry
){

  geometry.rotateX(
    Math.PI/2
  );

  return geometry;
}


function buildGeometry(
  shapeId,
  fields
){

  if(shapeMode==='2d'){

    if(shapeId==='circle')
      return new THREE.CircleGeometry(
        fields.D/2,
        64
      );

    if(shapeId==='square')
      return new THREE.PlaneGeometry(
        fields.W,
        fields.W
      );

    if(shapeId==='rectangle')
      return new THREE.PlaneGeometry(
        fields.W,
        fields.L
      );

    if(shapeId==='triangle')
      return polygonGeometry(
        3,
        fields.D/2
      );

    if(shapeId==='octagon')
      return polygonGeometry(
        8,
        fields.D/2
      );

    if(shapeId==='oval'){

      const g=
        new THREE.CircleGeometry(
          fields.D/2,
          64
        );

      g.scale(
        1,
        .6,
        1
      );

      return g;
    }

    return new THREE.PlaneGeometry(
      30,
      30
    );
  }


  if(shapeId==='circle')
    return new THREE.SphereGeometry(
      fields.D/2,
      32,
      24
    );

  if(shapeId==='square')
    return new THREE.BoxGeometry(
      fields.W,
      fields.W,
      fields.H ?? fields.W
    );

  if(shapeId==='rectangle')
    return new THREE.BoxGeometry(
      fields.W,
      fields.L,
      fields.H
    );

  if(shapeId==='cylinder')
    return rotateGeometryToZ(
      new THREE.CylinderGeometry(
        fields.D/2,
        fields.D/2,
        fields.H,
        32
      )
    );

  if(shapeId==='cone')
    return rotateGeometryToZ(
      new THREE.ConeGeometry(
        fields.D/2,
        fields.H,
        32
      )
    );

  if(shapeId==='triangle')
    return rotateGeometryToZ(
      new THREE.CylinderGeometry(
        fields.D/2,
        fields.D/2,
        fields.H,
        3
      )
    );

  if(shapeId==='octagon')
    return rotateGeometryToZ(
      new THREE.CylinderGeometry(
        fields.D/2,
        fields.D/2,
        fields.H,
        8
      )
    );

  if(shapeId==='oval'){

    const g=
      new THREE.SphereGeometry(
        fields.D/2,
        32,
        24
      );

    g.scale(
      1,
      .6,
      1
    );

    return g;
  }

  return new THREE.BoxGeometry(
    30,
    30,
    30
  );
}


function geometryDimensions(mesh){

  if(!mesh.geometry.boundingBox)
    mesh.geometry.computeBoundingBox();

  const bb=
    mesh.geometry.boundingBox;

  return {
    x:
      Math.abs(
        bb.max.x-bb.min.x
      ) * Math.abs(mesh.scale.x),

    y:
      Math.abs(
        bb.max.y-bb.min.y
      ) * Math.abs(mesh.scale.y),

    z:
      Math.abs(
        bb.max.z-bb.min.z
      ) * Math.abs(mesh.scale.z)
  };
}


function storeDimensions(
  mesh
){

  return geometryDimensions(
    mesh
  );
}


function clampToPlate(
  mesh,
  allowFloat
){

  if(!mesh.geometry.boundingBox)
    mesh.geometry.computeBoundingBox();

  const bb=
    mesh.geometry.boundingBox;

  const rx=
    (bb.max.x-bb.min.x) *
    Math.abs(mesh.scale.x);

  const ry=
    (bb.max.y-bb.min.y) *
    Math.abs(mesh.scale.y);

  const rz=
    (bb.max.z-bb.min.z) *
    Math.abs(mesh.scale.z);


  if(rx>PLATE_SIZE)
    mesh.scale.x *=
      PLATE_SIZE/rx;

  if(ry>PLATE_SIZE)
    mesh.scale.y *=
      PLATE_SIZE/ry;

  if(rz>PLATE_SIZE)
    mesh.scale.z *=
      PLATE_SIZE/rz;


  const hx=
    (bb.max.x-bb.min.x) *
    Math.abs(mesh.scale.x)/2;

  const hy=
    (bb.max.y-bb.min.y) *
    Math.abs(mesh.scale.y)/2;

  const hz=
    (bb.max.z-bb.min.z) *
    Math.abs(mesh.scale.z)/2;


  mesh.position.x=
    THREE.MathUtils.clamp(
      mesh.position.x,
      -half+hx,
      half-hx
    );

  mesh.position.y=
    THREE.MathUtils.clamp(
      mesh.position.y,
      -half+hy,
      half-hy
    );


  const floorZ=
    -bb.min.z *
    mesh.scale.z;


  if(!allowFloat){

    mesh.position.z=
      floorZ;

  }else if(
    mesh.position.z<floorZ
  ){

    mesh.position.z=
      floorZ;
  }


  if(
    mesh.position.z >
    PLATE_SIZE-hz
  ){

    mesh.position.z=
      PLATE_SIZE-hz;
  }
}


function attachOutline(mesh){

  if(!mesh.isMesh)
    return;

  const edges=
    new THREE.LineSegments(
      new THREE.EdgesGeometry(
        mesh.geometry
      ),
      new THREE.LineBasicMaterial({
        color:0xffffff
      })
    );

  mesh.add(edges);

  mesh.userData.outline=edges;
}


function centerMeshOnGrid(
  mesh
){

  mesh.position.x=0;
  mesh.position.y=0;

  clampToPlate(
    mesh,
    false
  );
}


function insertShape(
  layerId,
  shapeId,
  fields
){

  const l=
    findLayer(layerId);

  const geo=
    buildGeometry(
      shapeId,
      fields
    );

  const color=
    SWATCHES[0];

  const mesh=
    new THREE.Mesh(
      geo,
      new THREE.MeshStandardMaterial({
        color,
        metalness:.15,
        roughness:.55
      })
    );

  centerMeshOnGrid(mesh);

  attachOutline(mesh);

  scene.add(mesh);

  const rec={
    id:Date.now()+Math.random(),
    num:l.shapes.length+1,
    mesh,
    geomId:shapeId,
    fields:{...fields},
    color,
    baseDimensions:
      storeDimensions(mesh)
  };

  l.shapes.push(rec);

  return rec;
}


function deleteShape(
  layerId,
  shapeId
){

  const l=
    findLayer(layerId);

  if(!l)
    return;

  const idx=
    l.shapes.findIndex(
      s => s.id===shapeId
    );

  if(idx===-1)
    return;

  const s=
    l.shapes[idx];

  scene.remove(s.mesh);

  if(s.mesh.geometry)
    s.mesh.geometry.dispose();

  if(s.mesh.material){

    if(Array.isArray(
      s.mesh.material
    )){

      s.mesh.material.forEach(
        m => m.dispose()
      );

    }else{

      s.mesh.material.dispose();
    }
  }

  l.shapes.splice(
    idx,
    1
  );

  l.shapes.forEach(
    (s2,i) =>
      s2.num=i+1
  );

  if(
    activeShapeId===shapeId
  ){

    activeShapeId=null;
  }
}


function deleteLayer(
  layerId
){

  const l=
    findLayer(layerId);

  if(!l)
    return;

  l.shapes.forEach(
    s => {

      scene.remove(
        s.mesh
      );

      if(s.mesh.geometry)
        s.mesh.geometry.dispose();

      if(s.mesh.material){

        if(Array.isArray(
          s.mesh.material
        )){

          s.mesh.material.forEach(
            m => m.dispose()
          );

        }else{

          s.mesh.material.dispose();
        }
      }
    }
  );

  layers.splice(
    layers.indexOf(l),
    1
  );

  layers.forEach(
    (l2,i) =>
      l2.name=`Layer ${i+1}`
  );

  if(
    activeLayerId===layerId
  ){

    activeLayerId=null;
    activeShapeId=null;
  }
}


/* ─────────────────────────────────────────────────────────────
   SELECTION
───────────────────────────────────────────────────────────── */

const raycaster=
  new THREE.Raycaster();

const ndc=
  new THREE.Vector2();


function trySelectAt(
  clientX,
  clientY
){

  const rect=
    canvas.getBoundingClientRect();

  ndc.x=
    ((clientX-rect.left)/
      rect.width)*2-1;

  ndc.y=
    -((clientY-rect.top)/
      rect.height)*2+1;

  raycaster.setFromCamera(
    ndc,
    camera
  );

  const all=[];

  layers.forEach(
    l =>
      l.shapes.forEach(
        s =>
          all.push({l,s})
      )
  );

  const hits=
    raycaster.intersectObjects(
      all.map(
        x => x.s.mesh
      ),
      false
    );

  if(hits.length){

    const hit=
      all.find(
        x =>
          x.s.mesh===
          hits[0].object
      );

    activeLayerId=
      hit.l.id;

    activeShapeId=
      hit.s.id;

    refreshShapeVisuals();

    goToShape();

    return true;
  }

  return false;
}


let crosshairActive=false;

const crosshairEl=
  document.createElement(
    'div'
  );

crosshairEl.id=
  'crosshairCursor';

crosshairEl.textContent='➤';

document
  .getElementById('plate')
  .appendChild(
    crosshairEl
  );


function activateCrosshair(){

  crosshairActive=true;

  crosshairEl.style.display=
    'flex';

  showToast(
    'Tap a shape on the plate to select it'
  );

  function move(e){

    const rect=
      canvas.getBoundingClientRect();

    crosshairEl.style.left=
      (e.clientX-
       rect.left-
       17)+'px';

    crosshairEl.style.top=
      (e.clientY-
       rect.top-
       38)+'px';
  }

  function up(e){

    const found=
      trySelectAt(
        e.clientX,
        e.clientY
      );

    if(found)
      deactivate();
  }

  function deactivate(){

    crosshairActive=false;

    crosshairEl.style.display=
      'none';

    canvas.removeEventListener(
      'pointermove',
      move
    );

    canvas.removeEventListener(
      'pointerup',
      up
    );
  }

  canvas.addEventListener(
    'pointermove',
    move
  );

  canvas.addEventListener(
    'pointerup',
    up
  );
}


canvas.addEventListener(
  'pointerup',
  e => {

    if(!crosshairActive &&
       !manipulationActive){

      trySelectAt(
        e.clientX,
        e.clientY
      );
    }
  }
);


function shapeLabel(s){

  if(!s || !s.geomId)
    return 'Shape';

  return (
    s.geomId[0].toUpperCase()+
    s.geomId.slice(1)+
    ` #${s.num}`
  );
}


/* ─────────────────────────────────────────────────────────────
   MODULE / H1
───────────────────────────────────────────────────────────── */

const h1=
  document.getElementById('h1');

const MODULE_ORDER=[
  'tools',
  'layers',
  'settings',
  'help'
];

const MODULE_OVERRIDE={
  tools:{
    label:'Drawing Tools',
    icon:'pencil'
  }
};

let activeModule='tools';


function renderH1(){

  const mods=
    MODULE_ORDER
      .map(
        id =>
          MODULES.find(
            m => m.id===id
          )
      )
      .filter(Boolean);

  h1.innerHTML=
    mods.map(
      m => {

        const o=
          MODULE_OVERRIDE[m.id] ||
          {};

        return `
          <button
            class="module-btn ${
              m.id===activeModule
                ? 'active-blue'
                : ''
            }"
            data-module="${m.id}">
            ${svg(o.icon||m.icon)}
            <span>${
              o.label||m.label
            }</span>
          </button>
        `;
      }
    ).join('');


  h1
    .querySelectorAll(
      '[data-module]'
    )
    .forEach(
      btn => {

        btn.addEventListener(
          'click',
          () => {

            const id=
              btn.dataset.module;

            activeModule=id;

            if(id==='layers')
              goToLayersHome();

            else if(id==='tools')
              goToDrawingTools();

            else if(id==='settings'){

              crumbs=['Settings'];
              crumbBack=null;

              render('settings');

              renderH1();

            }else if(id==='help'){

              crumbs=['Help'];
              crumbBack=null;

              render('help');

              renderH1();
            }
          }
        );
      }
    );
}


/* ─────────────────────────────────────────────────────────────
   H2
───────────────────────────────────────────────────────────── */

const h2Title=
  document.getElementById(
    'h2Title'
  );

const h2Info=
  document.getElementById(
    'h2Info'
  );

const btnUndo=
  document.getElementById(
    'btnUndo'
  );

const btnRedo=
  document.getElementById(
    'btnRedo'
  );

btnUndo.innerHTML=
  svg('undo')+
  '<span>Undo</span>';

btnRedo.innerHTML=
  svg('redo')+
  '<span>Redo</span>';

btnUndo.disabled=true;
btnRedo.disabled=true;

let lastPlaced=null;


function armUndo(
  layerId,
  shapeId
){

  lastPlaced={
    layerId,
    shapeId
  };

  btnUndo.disabled=false;
}


btnUndo.addEventListener(
  'click',
  () => {

    if(!lastPlaced)
      return;

    deleteShape(
      lastPlaced.layerId,
      lastPlaced.shapeId
    );

    goToDrawingTools();

    showToast(
      'Shape removed'
    );

    lastPlaced=null;

    btnUndo.disabled=true;
  }
);


let crumbs=['Drawing Tools'];
let crumbBack=null;
let h2BackAttached=false;


function ensureH2Back(){

  if(h2BackAttached)
    return;

  const wrap=
    h2Title.parentElement
      .parentElement;

  const backBtn=
    document.createElement(
      'button'
    );

  backBtn.id='h2Back';

  backBtn.style.cssText=
    'background:none;border:none;color:var(--gold-light);width:26px;height:26px;display:flex;align-items:center;justify-content:center;flex:0 0 auto;';

  backBtn.innerHTML=
    svg('back');

  backBtn.addEventListener(
    'click',
    () => {

      if(crumbBack)
        crumbBack();
    }
  );

  wrap.insertBefore(
    backBtn,
    wrap.firstChild
  );

  h2BackAttached=true;
}


ensureH2Back();


function setH2(info){

  document
    .getElementById(
      'h2Back'
    )
    .style.display=
      crumbBack
        ? 'flex'
        : 'none';

  h2Title.textContent=
    crumbs.join(' - ');

  h2Info.textContent=
    info||'';
}


const menuScroll=
  document.getElementById(
    'menuScroll'
  );

const slideMenu=
  document.getElementById(
    'slideMenu'
  );

const expandTabEl=
  document.getElementById(
    'expandTab'
  );

if(expandTabEl)
  expandTabEl.remove();


/* ─────────────────────────────────────────────────────────────
   NAVIGATION
───────────────────────────────────────────────────────────── */

function goToLayersHome(){

  activeModule='layers';

  const l=
    activeLayer();

  crumbs=[
    l ? l.name : 'Layers'
  ];

  crumbBack=null;

  activeShapeId=null;

  render('layersHome');

  renderH1();
}


function goToLayer(){

  const l=
    activeLayer();

  if(!l){

    goToLayersHome();

    return;
  }

  crumbs=[l.name];

  crumbBack=() => {

    activeShapeId=null;

    goToDrawingTools();
  };

  render('layersHome');

  /*
    Layers H1 is intentionally NOT
    made active when returning from
    Drawing Tools.
  */

  renderH1();
}


function goToShape(){

  const l=
    activeLayer();

  const s=
    activeShape();

  if(!l || !s){

    goToDrawingTools();

    return;
  }

  crumbs=[
    'Drawing Tools',
    shapeLabel(s)
  ];

  crumbBack=() =>
    goToDrawingTools();

  render(
    'shapePanel',
    'select'
  );

  /*
    Keep Drawing Tools active.
    A shape is an H3 selection,
    not an H1 module change.
  */

  activeModule='tools';

  renderH1();
}


function goToSubtool(
  toolLabel
){

  const l=
    activeLayer();

  const s=
    activeShape();

  crumbs=[
    'Drawing Tools',
    shapeLabel(s),
    toolLabel
  ];

  crumbBack=() =>
    goToShape();

  render(
    'shapePanel',
    toolLabel.toLowerCase()
  );

  activeModule='tools';

  renderH1();
}


function goToDrawingTools(){

  activeModule='tools';

  crumbs=[
    'Drawing Tools'
  ];

  crumbBack=null;

  render(
    'drawingToolsHome'
  );

  renderH1();
}


function goToP2POptions(){

  crumbs=[
    'Drawing Tools',
    'P2P'
  ];

  crumbBack=() =>
    goToDrawingTools();

  render(
    'p2pHome'
  );
}


function goToP2PFillPick(
  shapeKey
){

  crumbs=[
    'Drawing Tools',
    'P2P',
    'Shape',
    shapeKey[0].toUpperCase()+
    shapeKey.slice(1)
  ];

  crumbBack=() =>
    goToP2POptions();

  render(
    'p2pFillPick',
    shapeKey
  );
}


/* ─────────────────────────────────────────────────────────────
   RENDER
───────────────────────────────────────────────────────────── */

function render(
  view,
  subtool
){

  slideMenu.classList.add(
    'open'
  );

  if(view==='layersHome')
    renderLayersHome();

  else if(view==='shapePanel')
    renderShapePanel(subtool);

  else if(view==='drawingToolsHome')
    renderDrawingToolsHome();

  else if(view==='p2pHome')
    renderP2PHome();

  else if(view==='p2pFillPick')
    renderP2PFillPick(subtool);

  else if(view==='p2pLineOptions')
    renderP2PLineOptions();

  else if(view==='p2pShapeOptions')
    renderP2PShapeOptions();

  else if(view==='booleanPick')
    renderBooleanPick();

  else if(view==='settings')
    renderSettings();

  else if(view==='help')
    renderHelp();

  else if(view==='drawShapePick')
    renderDrawShapePick(subtool);

  else if(view==='drawDivisionPick')
    renderDrawDivisionPick(
      subtool.method,
      subtool.shapeKey
    );
}


/* ─────────────────────────────────────────────────────────────
   LAYERS HOME
───────────────────────────────────────────────────────────── */

function renderLayersHome(){

  if(!layers.length){

    const l=
      createLayer();

    activeLayerId=l.id;
  }

  const active=
    activeLayer();

  setH2(
    active
      ? `${active.name} : ${active.shapes.length} shapes`
      : 'Tap Add Layer for a layer'
  );

  refreshModeToggle();


  const activeTile=
    active
      ? `
        <div
          class="tile3 layer-active"
          data-layer="${active.id}">
          ${svg('layers')}
          <span>${active.name}</span>
          <button
            class="tile-del"
            data-del="${active.id}">
            ${svg('trash')}
          </button>
        </div>
      `
      : '';


  const otherLayers=
    layers
      .filter(
        l =>
          !active ||
          l.id!==active.id
      )
      .map(
        l => `
          <div
            class="tile3"
            data-layer="${l.id}">
            ${svg('layers')}
            <span>${l.name}</span>
            <button
              class="tile-del"
              data-del="${l.id}">
              ${svg('trash')}
            </button>
          </div>
        `
      ).join('');


  const addLayer=
    `<button
      class="add-rect"
      id="addLayerTile">
      ${svg('add')}Add Layer +
    </button>`;


  let shapeTiles='';

  if(
    active &&
    active.shapes.length
  ){

    shapeTiles=
      active.shapes.map(
        s => `
          <div
            class="tile3"
            data-shape="${s.id}">
            ${svg('shapes')}
            <span>${s.geomId}</span>
            <span class="tile-num">
              ${s.num}
            </span>
          </div>
        `
      ).join('');
  }


  menuScroll.innerHTML=`
    <div class="h3-stack">

      ${activeTile}

      ${addLayer}

      ${
        otherLayers
          ? `<div class="tile-row">
              ${otherLayers}
            </div>`
          : ''
      }

      ${
        shapeTiles
          ? `<div class="tile-row">
              ${shapeTiles}
            </div>`
          : ''
      }

    </div>
  `;


  document
    .getElementById(
      'addLayerTile'
    )
    .addEventListener(
      'click',
      () => {

        const l=
          createLayer();

        activeLayerId=l.id;
        activeShapeId=null;

        goToLayer();
      }
    );


  menuScroll
    .querySelectorAll(
      '[data-layer]'
    )
    .forEach(
      el => {

        el.addEventListener(
          'click',
          e => {

            if(
              e.target.closest(
                '[data-del]'
              )
            )
              return;

            const id=
              parseInt(
                el.dataset.layer,
                10
              );

            activeLayerId=id;
            activeShapeId=null;

            refreshShapeVisuals();

            goToLayer();
          }
        );
      }
    );


  menuScroll
    .querySelectorAll(
      '[data-shape]'
    )
    .forEach(
      el => {

        el.addEventListener(
          'click',
          () => {

            activeShapeId=
              parseFloat(
                el.dataset.shape
              );

            refreshShapeVisuals();

            goToShape();
          }
        );
      }
    );


  wireLayerDelete();
}


/* ─────────────────────────────────────────────────────────────
   DRAWING TOOLS
───────────────────────────────────────────────────────────── */

function renderDrawingToolsHome(){

  if(!layers.length){

    const l=
      createLayer();

    activeLayerId=l.id;
  }

  const active=
    activeLayer();

  setH2(
    'Pick a drawing method'
  );


  const activeLayerTile=`
    <div
      class="tile3 layer-active"
      data-tool-layer="${active.id}">
      ${svg('layers')}
      <span>${active.name}</span>

      <button
        class="tile-del"
        data-del-tool="${active.id}">
        ${svg('trash')}
      </button>
    </div>
  `;


  menuScroll.innerHTML=`
    <div class="h3-stack">

      ${activeLayerTile}

      <div class="tile-row">

        <div
          class="tile3"
          data-dt="freehand">
          ${svg('shapes')}
          <span>Freehand</span>
        </div>

        <div
          class="tile3"
          data-dt="shapedrag">
          ${svg('shapes')}
          <span>Shape</span>
        </div>

        <div
          class="tile3"
          data-dt="p2p">
          ${svg('shapes')}
          <span>P2P</span>
        </div>

      </div>

    </div>
  `;


  menuScroll
    .querySelector(
      '[data-tool-layer]'
    )
    .addEventListener(
      'click',
      e => {

        if(
          e.target.closest(
            '[data-del-tool]'
          )
        )
          return;

        activeModule='layers';

        goToLayer();
      }
    );


  menuScroll
    .querySelector(
      '[data-dt="freehand"]'
    )
    .addEventListener(
      'click',
      startFreehand
    );


  menuScroll
    .querySelector(
      '[data-dt="shapedrag"]'
    )
    .addEventListener(
      'click',
      () => {

        crumbs=[
          'Drawing Tools',
          'Shape'
        ];

        crumbBack=
          () =>
            goToDrawingTools();

        render(
          'drawShapePick',
          'shapedrag'
        );
      }
    );


  menuScroll
    .querySelector(
      '[data-dt="p2p"]'
    )
    .addEventListener(
      'click',
      goToP2POptions
    );
}


/* ─────────────────────────────────────────────────────────────
   SHAPE DRAW
───────────────────────────────────────────────────────────── */

const DIVISIONS={
  circle:[
    ['full','Full'],
    ['half','Half'],
    ['quarter','Quarter']
  ],

  square:[
    ['full','Full'],
    ['quarter','Quarter']
  ],

  rectangle:[
    ['full','Full'],
    ['eighth','Eighth']
  ],

  triangle:[
    ['full','Full'],
    ['half','Half']
  ],

  octagon:[
    ['full','Full'],
    ['quarter','Quarter']
  ],

  oval:[
    ['full','Full'],
    ['half','Half']
  ]
};


function renderDrawShapePick(){

  setH2(
    'Pick a shape to divide, or use it whole'
  );

  menuScroll.innerHTML=`
    <div class="tile-row">
      ${
        Object.keys(DIVISIONS)
          .map(
            k => `
              <div
                class="tile3"
                data-dshape="${k}">
                ${svg('shapes')}
                <span>${
                  k[0].toUpperCase()+
                  k.slice(1)
                }</span>
              </div>
            `
          ).join('')
      }
    </div>
  `;


  menuScroll
    .querySelectorAll(
      '[data-dshape]'
    )
    .forEach(
      el => {

        el.addEventListener(
          'click',
          () => {

            const key=
              el.dataset.dshape;

            crumbs=[
              'Drawing Tools',
              key[0].toUpperCase()+
              key.slice(1)
            ];

            crumbBack=
              () =>
                goToDrawingTools();

            startDragToSize(
              key
            );
          }
        );
      }
    );
}


/* ─────────────────────────────────────────────────────────────
   PLATE HIT
───────────────────────────────────────────────────────────── */

function plateHit(
  clientX,
  clientY,
  plane=dragGroundPlane
){

  const rect=
    canvas.getBoundingClientRect();

  ndc.x=
    ((clientX-rect.left)/
      rect.width)*2-1;

  ndc.y=
    -((clientY-rect.top)/
      rect.height)*2+1;

  raycaster.setFromCamera(
    ndc,
    camera
  );

  const pt=
    new THREE.Vector3();

  if(
    !raycaster.ray.intersectPlane(
      plane,
      pt
    )
  )
    return null;

  return pt;
}


/* ─────────────────────────────────────────────────────────────
   DRAG GEOMETRY
───────────────────────────────────────────────────────────── */

function buildDragGeometry(
  shapeKey,
  sizeMM
){

  const H=
    Math.max(
      GRID_SQUARE,
      15
    );


  /* ─── 2D: XY PLANE ─── */

  if(shapeMode==='2d'){

    let geometry;


    if(shapeKey==='circle'){

      geometry=
        new THREE.CircleGeometry(
          sizeMM/2,
          64
        );

    }else if(shapeKey==='square'){

      geometry=
        new THREE.PlaneGeometry(
          sizeMM,
          sizeMM
        );

    }else if(shapeKey==='rectangle'){

      geometry=
        new THREE.PlaneGeometry(
          sizeMM,
          sizeMM*.5
        );

    }else if(shapeKey==='triangle'){

      geometry=
        polygonGeometry(
          3,
          sizeMM/2
        );

    }else if(shapeKey==='octagon'){

      geometry=
        polygonGeometry(
          8,
          sizeMM/2
        );

    }else if(shapeKey==='oval'){

      geometry=
        new THREE.CircleGeometry(
          sizeMM/2,
          64
        );

      geometry.scale(
        1,
        .6,
        1
      );

    }else{

      geometry=
        new THREE.PlaneGeometry(
          sizeMM,
          sizeMM
        );
    }


    /*
      All 2D drawing geometry must lie
      directly on the XY plane.

      Local Z must remain exactly 0.
    */

    geometry.computeBoundingBox();

    return geometry;
  }


  /* ─── 3D ─── */

  if(shapeKey==='circle'){

    return new THREE.SphereGeometry(
      sizeMM/2,
      32,
      24
    );

  }

  if(shapeKey==='square'){

    return new THREE.BoxGeometry(
      sizeMM,
      sizeMM,
      H
    );

  }

  if(shapeKey==='rectangle'){

    return new THREE.BoxGeometry(
      sizeMM,
      sizeMM*.5,
      H
    );

  }

  if(shapeKey==='cylinder'){

    return rotateGeometryToZ(
      new THREE.CylinderGeometry(
        sizeMM/2,
        sizeMM/2,
        H,
        32
      )
    );

  }

  if(shapeKey==='cone'){

    return rotateGeometryToZ(
      new THREE.ConeGeometry(
        sizeMM/2,
        H,
        32
      )
    );

  }

  if(shapeKey==='triangle'){

    return rotateGeometryToZ(
      new THREE.CylinderGeometry(
        sizeMM/2,
        sizeMM/2,
        H,
        3
      )
    );

  }

  if(shapeKey==='octagon'){

    return rotateGeometryToZ(
      new THREE.CylinderGeometry(
        sizeMM/2,
        sizeMM/2,
        H,
        8
      )
    );

  }

  if(shapeKey==='oval'){

    const geometry=
      new THREE.SphereGeometry(
        sizeMM/2,
        32,
        24
      );

    geometry.scale(
      1,
      .6,
      1
    );

    return geometry;
  }


  return new THREE.BoxGeometry(
    sizeMM,
    sizeMM,
    H
  );
}


/* ─────────────────────────────────────────────────────────────
   START DRAG TO SIZE
───────────────────────────────────────────────────────────── */

function startDragToSize(
  shapeKey
){

  const l=
    activeLayer();

  if(!l)
    return;


  const startPt=
    plateHit(
      window._lastPointerX,
      window._lastPointerY
    );

  if(!startPt)
    return;


  const size=
    GRID_SQUARE;


  const geometry=
    buildDragGeometry(
      shapeKey,
      size
    );


  const previewMesh=
    new THREE.Mesh(
      geometry,
      new THREE.MeshStandardMaterial({
        color:SWATCHES[0],
        transparent:true,
        opacity:.45,
        depthWrite:false
      })
    );


  /*
    2D geometry is already centered on
    its local origin and that origin is
    exactly on Z=0.

    Therefore the preview stays on
    the XY face of the plate.
  */

  previewMesh.position.set(
    startPt.x,
    startPt.y,
    shapeMode==='2d'
      ? 0
      : size/2
  );


  scene.add(
    previewMesh
  );


  let drawing=true;


  function move(e){

    if(!drawing)
      return;

    const p=
      plateHit(
        e.clientX,
        e.clientY
      );

    if(!p)
      return;


    const dx=
      p.x-startPt.x;

    const dy=
      p.y-startPt.y;

    const distance=
      Math.max(
        Math.abs(dx),
        Math.abs(dy)
      );


    const newSize=
      Math.max(
        GRID_SQUARE,
        distance
      );


    scene.remove(
      previewMesh
    );

    previewMesh.geometry.dispose();


    previewMesh.geometry=
      buildDragGeometry(
        shapeKey,
        newSize
      );


    /*
      Keep the 2D object's local origin
      directly on the XY plane.
    */

    previewMesh.position.set(
      startPt.x,
      startPt.y,
      shapeMode==='2d'
        ? 0
        : newSize/2
    );


    scene.add(
      previewMesh
    );
  }


  function finish(e){

    if(!drawing)
      return;

    drawing=false;


    canvas.removeEventListener(
      'pointermove',
      move
    );

    canvas.removeEventListener(
      'pointerup',
      finish
    );


    const p=
      plateHit(
        e.clientX,
        e.clientY
      );


    scene.remove(
      previewMesh
    );

    previewMesh.geometry.dispose();


    if(!p)
      return;


    const dx=
      p.x-startPt.x;

    const dy=
      p.y-startPt.y;


    const size=
      Math.max(
        GRID_SQUARE,
        Math.max(
          Math.abs(dx),
          Math.abs(dy)
        )
      );


    const fields=
      shapeMode==='2d'
        ? {
            D:size,
            W:size,
            L:size
          }
        : {
            D:size,
            W:size,
            L:size,
            H:size
          };


    const rec=
      insertShape(
        l.id,
        shapeKey,
        fields
      );


    /*
      2D object origin = XY plate face.

      Do not give a 2D object any Z
      offset.
    */

    if(shapeMode==='2d'){

      rec.mesh.position.z=0;

    }else{

      rec.mesh.position.z=
        geometryDimensions(
          rec.mesh
        ).z/2;
    }


    clampToPlate(
      rec.mesh,
      false
    );


    activeLayerId=
      l.id;

    activeShapeId=
      rec.id;


    refreshShapeVisuals();

    armUndo(
      l.id,
      rec.id
    );

    goToShape();
  }


  canvas.addEventListener(
    'pointermove',
    move
  );

  canvas.addEventListener(
    'pointerup',
    finish,
    {
      once:true
    }
  );
}
/* ─────────────────────────────────────────────────────────────
   SHAPE DRAG
───────────────────────────────────────────────────────────── */

function startDragToSize(
  shapeKey
){

  setH2(
    'Press on the grid, drag to size, release'
  );

  menuScroll.innerHTML=`
    <div style="
      padding:14px 6px;
      color:var(--muted);
      font-size:11px;
      text-align:center;
      max-width:220px;">
      Dragging on the grid now sizes the
      ${shapeKey}...
    </div>
  `;


  let startPt=null;
  let previewMesh=null;


  function onDown(e){

    startPt=
      plateHit(
        e.clientX,
        e.clientY
      );

    if(!startPt)
      return;

    rotationLocked=true;

    controls.enableRotate=false;

    refreshLockBtn();
  }


  function onMove(e){

    if(!startPt)
      return;

    const cur=
      plateHit(
        e.clientX,
        e.clientY
      );

    if(!cur)
      return;

    const size=
      Math.max(
        GRID_SQUARE,
        startPt.distanceTo(cur)
      );


    if(previewMesh){

      scene.remove(
        previewMesh
      );

      previewMesh.geometry.dispose();

      previewMesh.material.dispose();
    }


    previewMesh=
      new THREE.Mesh(
        buildDragGeometry(
          shapeKey,
          size
        ),
        new THREE.MeshStandardMaterial({
          color:0xe0c48f,
          transparent:true,
          opacity:.55
        })
      );


    previewMesh.position.set(
      startPt.x,
      startPt.y,
      shapeMode==='3d'
        ? size/2
        : 0
    );

    clampToPlate(
      previewMesh,
      false
    );

    scene.add(
      previewMesh
    );
  }


  function onUp(e){

    if(!startPt){

      cleanup();

      return;
    }

    const cur=
      plateHit(
        e.clientX,
        e.clientY
      );

    if(!cur){

      cleanup();

      return;
    }


    let size=
      Math.max(
        GRID_SQUARE,
        startPt.distanceTo(cur)
      );

    size=
      Math.round(
        size/GRID_SQUARE
      )*GRID_SQUARE;


    if(previewMesh){

      scene.remove(
        previewMesh
      );

      previewMesh.geometry.dispose();
      previewMesh.material.dispose();

      previewMesh=null;
    }


    const active=
      activeLayer();

    if(!active){

      cleanup();

      return;
    }


    const mesh=
      new THREE.Mesh(
        buildDragGeometry(
          shapeKey,
          size
        ),
        new THREE.MeshStandardMaterial({
          color:SWATCHES[0],
          metalness:.15,
          roughness:.55
        })
      );


    /*
      New objects snap to the
      center of the grid.
    */

    mesh.position.set(
      0,
      0,
      shapeMode==='3d'
        ? geometryDimensions(mesh).z/2
        : 0
    );

    clampToPlate(
      mesh,
      false
    );

    attachOutline(mesh);

    scene.add(mesh);


    const rec={
      id:Date.now()+Math.random(),
      num:active.shapes.length+1,
      mesh,
      geomId:shapeKey,
      fields:{
        size
      },
      color:SWATCHES[0],
      baseDimensions:
        storeDimensions(mesh)
    };


    active.shapes.push(rec);

    activeShapeId=
      rec.id;

    armUndo(
      active.id,
      rec.id
    );

    refreshShapeVisuals();

    showToast(
      `${shapeKey} placed at ${size}mm`
    );

    cleanup();

    goToShape();
  }


  function cleanup(){

    canvas.removeEventListener(
      'pointerdown',
      onDown
    );

    canvas.removeEventListener(
      'pointermove',
      onMove
    );

    canvas.removeEventListener(
      'pointerup',
      onUp
    );
  }


  canvas.addEventListener(
    'pointerdown',
    onDown
  );

  canvas.addEventListener(
    'pointermove',
    onMove
  );

  canvas.addEventListener(
    'pointerup',
    onUp
  );
}


/* ─────────────────────────────────────────────────────────────
   FREEHAND
───────────────────────────────────────────────────────────── */

function startFreehand(){

  setH2(
    'Press and hold on the grid, draw, then release'
  );

  menuScroll.innerHTML=`
    <div style="
      padding:14px 6px;
      color:var(--muted);
      font-size:11px;
      text-align:center;
      max-width:220px;">
      Draw directly on the grid with one finger.
    </div>
  `;


  let drawing=false;
  let points=[];


  function getPoint(e){

    const p=
      plateHit(
        e.clientX,
        e.clientY
      );

    if(!p)
      return null;

    if(shapeMode==='2d')
      p.z=0;
    else
      p.z=0;

    return p;
  }


  function onDown(e){

    const p=
      getPoint(e);

    if(!p)
      return;

    drawing=true;

    points=[p];

    rotationLocked=true;

    controls.enableRotate=false;

    refreshLockBtn();
  }


  function onMove(e){

    if(!drawing)
      return;

    const p=
      getPoint(e);

    if(!p)
      return;

    const last=
      points[
        points.length-1
      ];

    if(
      last &&
      last.distanceTo(p)<.8
    )
      return;

    points.push(p);
  }


  function onUp(){

    if(!drawing){

      cleanup();

      return;
    }

    drawing=false;


    if(points.length<2){

      cleanup();

      showToast(
        'Draw a longer path'
      );

      return;
    }


    const active=
      activeLayer();

    if(!active){

      cleanup();

      return;
    }


    let mesh;


    if(shapeMode==='2d'){

      const geo=
        new THREE.BufferGeometry()
          .setFromPoints(
            points
          );

      mesh=
        new THREE.Line(
          geo,
          new THREE.LineBasicMaterial({
            color:SWATCHES[0]
          })
        );

    }else{

      const curve=
        new THREE.CatmullRomCurve3(
          points
        );

      const geo=
        new THREE.TubeGeometry(
          curve,
          Math.max(
            8,
            points.length*2
          ),
          .8,
          8,
          false
        );

      mesh=
        new THREE.Mesh(
          geo,
          new THREE.MeshStandardMaterial({
            color:SWATCHES[0],
            metalness:.15,
            roughness:.55
          })
        );

      attachOutline(mesh);
    }


    scene.add(mesh);


    const rec={
      id:Date.now()+Math.random(),
      num:active.shapes.length+1,
      mesh,
      geomId:'freehand',
      fields:{
        points:
          points.map(
            p => p.toArray()
          )
      },
      color:SWATCHES[0],
      baseDimensions:
        storeDimensions(mesh)
    };


    active.shapes.push(rec);

    activeShapeId=rec.id;

    armUndo(
      active.id,
      rec.id
    );

    refreshShapeVisuals();

    showToast(
      'Freehand shape placed'
    );

    cleanup();

    goToShape();
  }


  function cleanup(){

    canvas.removeEventListener(
      'pointerdown',
      onDown
    );

    canvas.removeEventListener(
      'pointermove',
      onMove
    );

    canvas.removeEventListener(
      'pointerup',
      onUp
    );
  }


  canvas.addEventListener(
    'pointerdown',
    onDown
  );

  canvas.addEventListener(
    'pointermove',
    onMove
  );

  canvas.addEventListener(
    'pointerup',
    onUp
  );
}


/* ─────────────────────────────────────────────────────────────
   P2P
───────────────────────────────────────────────────────────── */

const P2P_SHAPES=[
  'rectangle',
  'square',
  'circle',
  'triangle',
  'octagon',
  'oval'
];

const LINE_TYPES=[
  ['straight','Straight'],
  ['arc','Arc'],
  ['wave','Wave']
];

let pendingP2P=null;


function renderP2PHome(){

  setH2(
    'Place two points, then choose what to create'
  );

  menuScroll.innerHTML=`
    <div class="tile-row">

      <div
        class="tile3"
        data-p2p="line">
        ${svg('shapes')}
        <span>Line</span>
      </div>

      <div
        class="tile3"
        data-p2p="shape">
        ${svg('shapes')}
        <span>Shape</span>
      </div>

    </div>
  `;


  menuScroll
    .querySelector(
      '[data-p2p="line"]'
    )
    .addEventListener(
      'click',
      startP2PLineCapture
    );


  menuScroll
    .querySelector(
      '[data-p2p="shape"]'
    )
    .addEventListener(
      'click',
      startP2PShapeCapture
    );
}


function startP2PLineCapture(){

  crumbs=[
    'Drawing Tools',
    'P2P',
    'Line'
  ];

  crumbBack=
    () => goToP2POptions();

  pendingP2P={
    type:'line',
    points:[]
  };

  startP2PPointCapture();
}


function startP2PShapeCapture(){

  crumbs=[
    'Drawing Tools',
    'P2P',
    'Shape'
  ];

  crumbBack=
    () => goToP2POptions();

  pendingP2P={
    type:'shape',
    points:[]
  };

  startP2PPointCapture();
}


function startP2PPointCapture(){

  setH2(
    'Tap the first point, then the second point'
  );

  menuScroll.innerHTML=`
    <div style="
      padding:14px 6px;
      color:var(--muted);
      font-size:11px;
      text-align:center;
      max-width:220px;">
      ${
        pendingP2P &&
        pendingP2P.type==='line'
          ? 'Place two endpoints.'
          : 'Place two opposite corners.'
      }
    </div>
  `;


  function onUp(e){

    const p=
      plateHit(
        e.clientX,
        e.clientY
      );

    if(!p)
      return;

    const point=
      p.clone();

    point.z=0;

    pendingP2P.points.push(
      point
    );


    if(
      pendingP2P.points.length>=2
    ){

      cleanup();

      if(
        pendingP2P.type==='line'
      )
        render(
          'p2pLineOptions'
        );
      else
        render(
          'p2pShapeOptions'
        );

      return;
    }

    setH2(
      'First point placed — tap the second point'
    );
  }


  function cleanup(){

    canvas.removeEventListener(
      'pointerup',
      onUp
    );
  }


  canvas.addEventListener(
    'pointerup',
    onUp
  );
}


function renderP2PLineOptions(){

  setH2(
    'Choose how the two points connect'
  );

  menuScroll.innerHTML=`
    <div class="tile-row">
      ${
        LINE_TYPES.map(
          ([id,label]) => `
            <div
              class="tile3"
              data-line="${id}">
              ${svg('shapes')}
              <span>${label}</span>
            </div>
          `
        ).join('')
      }
    </div>
  `;


  menuScroll
    .querySelectorAll(
      '[data-line]'
    )
    .forEach(
      el => {

        el.addEventListener(
          'click',
          () =>
            createP2PLine(
              el.dataset.line
            )
        );
      }
    );
}


function renderP2PShapeOptions(){

  setH2(
    'Choose the shape between the two points'
  );

  menuScroll.innerHTML=`
    <div class="tile-row">
      ${
        P2P_SHAPES.map(
          k => `
            <div
              class="tile3"
              data-pshape="${k}">
              ${svg('shapes')}
              <span>${
                k[0].toUpperCase()+
                k.slice(1)
              }</span>
            </div>
          `
        ).join('')
      }
    </div>
  `;


  menuScroll
    .querySelectorAll(
      '[data-pshape]'
    )
    .forEach(
      el => {

        el.addEventListener(
          'click',
          () =>
            goToP2PFillPick(
              el.dataset.pshape
            )
        );
      }
    );
}


function renderP2PFillPick(
  shapeKey
){

  setH2(
    'Filled or hollow'
  );

  menuScroll.innerHTML=`
    <div class="tile-row">

      <div
        class="tile3"
        data-fill="filled">
        ${svg('shapes')}
        <span>Filled</span>
      </div>

      <div
        class="tile3"
        data-fill="hollow">
        ${svg('shapes')}
        <span>Hollow</span>
      </div>

    </div>
  `;


  menuScroll
    .querySelectorAll(
      '[data-fill]'
    )
    .forEach(
      el => {

        el.addEventListener(
          'click',
          () =>
            createP2PShape(
              shapeKey,
              el.dataset.fill==='hollow'
            )
        );
      }
    );
}


function makeP2PCurve(
  p1,
  p2,
  type
){

  if(type==='straight')
    return new THREE.LineCurve3(
      p1,
      p2
    );


  const dx=
    p2.x-p1.x;

  const dy=
    p2.y-p1.y;

  const length=
    Math.sqrt(
      dx*dx+dy*dy
    );

  if(length<.001)
    return null;


  const nx=
    -dy/length;

  const ny=
    dx/length;

  const offset=
    Math.min(
      15,
      Math.max(
        5,
        length*.25
      )
    );


  if(type==='arc'){

    const mid=
      p1.clone()
        .lerp(p2,.5);

    mid.x+=nx*offset;
    mid.y+=ny*offset;

    return new THREE.QuadraticBezierCurve3(
      p1,
      mid,
      p2
    );
  }


  const points=[];

  for(
    let i=0;
    i<=24;
    i++
  ){

    const t=i/24;

    const base=
      p1.clone()
        .lerp(p2,t);

    const wave=
      Math.sin(
        t*Math.PI*4
      )*
      Math.min(
        5,
        Math.max(
          2,
          length*.08
        )
      );

    base.x+=nx*wave;
    base.y+=ny*wave;

    points.push(base);
  }

  return new THREE.CatmullRomCurve3(
    points
  );
}


function createP2PLine(
  type
){

  if(
    !pendingP2P ||
    pendingP2P.points.length<2
  )
    return;

  const p1=
    pendingP2P.points[0];

  const p2=
    pendingP2P.points[1];

  const curve=
    makeP2PCurve(
      p1,
      p2,
      type
    );

  if(!curve)
    return;

  const active=
    activeLayer();

  if(!active)
    return;


  let mesh;


  if(shapeMode==='2d'){

    const points=
      curve.getPoints(
        type==='straight'
          ? 1
          : 32
      );

    mesh=
      new THREE.Line(
        new THREE.BufferGeometry()
          .setFromPoints(
            points
          ),
        new THREE.LineBasicMaterial({
          color:SWATCHES[0]
        })
      );

  }else{

    mesh=
      new THREE.Mesh(
        new THREE.TubeGeometry(
          curve,
          type==='straight'
            ? 1
            : 32,
          .8,
          8,
          false
        ),
        new THREE.MeshStandardMaterial({
          color:SWATCHES[0],
          metalness:.15,
          roughness:.55
        })
      );

    attachOutline(mesh);
  }


  scene.add(mesh);


  const rec={
    id:Date.now()+Math.random(),
    num:active.shapes.length+1,
    mesh,
    geomId:`p2p-${type}`,
    fields:{
      points:[
        p1.toArray(),
        p2.toArray()
      ]
    },
    color:SWATCHES[0],
    baseDimensions:
      storeDimensions(mesh)
  };


  active.shapes.push(rec);

  activeShapeId=rec.id;

  armUndo(
    active.id,
    rec.id
  );

  refreshShapeVisuals();

  pendingP2P=null;

  showToast(
    `${type[0].toUpperCase()+type.slice(1)} line created`
  );

  goToShape();
}


async function createP2PShape(
  shapeKey,
  hollow
){

  if(
    !pendingP2P ||
    pendingP2P.points.length<2
  )
    return;


  if(!activeLayer()){

    const l=
      createLayer();

    activeLayerId=l.id;
  }


  const active=
    activeLayer();

  const p1=
    pendingP2P.points[0];

  const p2=
    pendingP2P.points[1];


  const width=
    Math.max(
      GRID_SQUARE,
      Math.abs(
        p2.x-p1.x
      )
    );

  const length=
    Math.max(
      GRID_SQUARE,
      Math.abs(
        p2.y-p1.y
      )
    );

  const size=
    Math.max(
      width,
      length
    );


  let outerGeo;


  if(shapeMode==='2d'){

    if(shapeKey==='rectangle'){

      outerGeo=
        new THREE.PlaneGeometry(
          width,
          length
        );

    }else if(
      shapeKey==='square'
    ){

      const side=
        Math.max(
          width,
          length
        );

      outerGeo=
        new THREE.PlaneGeometry(
          side,
          side
        );

    }else{

      outerGeo=
        buildDragGeometry(
          shapeKey,
          size
        );
    }

  }else{

    outerGeo=
      buildDragGeometry(
        shapeKey,
        size
      );
  }


  let finalGeo=outerGeo;


  if(hollow){

    try{

      const {
        Evaluator,
        Brush,
        SUBTRACTION
      }=
        await import(
          'https://unpkg.com/three-bvh-csg@0.0.16/build/index.module.js'
        );


      const wallRatio=.6;

      const innerGeo=
        buildDragGeometry(
          shapeKey,
          size*wallRatio
        );


      const brushA=
        new Brush(
          outerGeo
        );

      brushA.updateMatrixWorld();


      const brushB=
        new Brush(
          innerGeo
        );

      brushB.updateMatrixWorld();


      const evaluator=
        new Evaluator();


      const result=
        evaluator.evaluate(
          brushA,
          brushB,
          SUBTRACTION
        );


      result.geometry
        .computeVertexNormals();

      finalGeo=
        result.geometry;

    }catch(err){

      console.error(err);

      showToast(
        'Hollow tool could not load — placed filled instead'
      );
    }
  }


  const mesh=
    new THREE.Mesh(
      finalGeo,
      new THREE.MeshStandardMaterial({
        color:SWATCHES[0],
        metalness:.15,
        roughness:.55
      })
    );


  /*
    P2P placement remains based on
    its two selected points.
  */

  mesh.position.set(
    (p1.x+p2.x)/2,
    (p1.y+p2.y)/2,
    shapeMode==='3d'
      ? geometryDimensions(mesh).z/2
      : 0
  );


  clampToPlate(
    mesh,
    false
  );

  attachOutline(mesh);

  scene.add(mesh);


  const rec={
    id:Date.now()+Math.random(),
    num:active.shapes.length+1,
    mesh,
    geomId:shapeKey,
    fields:{
      W:width,
      L:length,
      H:
        shapeMode==='3d'
          ? geometryDimensions(mesh).z
          : 0,
      hollow
    },
    color:SWATCHES[0],
    baseDimensions:
      storeDimensions(mesh)
  };


  active.shapes.push(rec);

  activeShapeId=rec.id;

  armUndo(
    active.id,
    rec.id
  );

  refreshShapeVisuals();

  pendingP2P=null;

  showToast(
    `${hollow?'Hollow':'Filled'} ${shapeKey} placed`
  );

  goToShape();
}


/* ─────────────────────────────────────────────────────────────
   OBJECT MANIPULATION
───────────────────────────────────────────────────────────── */

let selectedAxis=
  shapeMode==='2d'
    ? 'X'
    : 'X';

let manipulationActive=false;
let manipulationCleanup=null;

const moveCursor=
  document.createElement(
    'div'
  );

moveCursor.id='moveCursor';

moveCursor.innerHTML=
  '<span>➤</span>';

document
  .getElementById('plate')
  .appendChild(
    moveCursor
  );


const CURSOR_OFFSET_X=30;
const CURSOR_OFFSET_Y=42;


function setAxis(axis){

  selectedAxis=axis;

  document
    .querySelectorAll(
      '.step-lbl[data-axis]'
    )
    .forEach(
      b =>
        b.classList.toggle(
          'axis-active',
          b.dataset.axis===axis
        )
    );
}


function currentIncrement(){

  return mmState==='2.5'
    ? 2.5
    : 5;
}


function updateMoveCursor(
  clientX,
  clientY
){

  const rect=
    canvas.getBoundingClientRect();

  moveCursor.style.left=
    (
      clientX-
      rect.left-
      CURSOR_OFFSET_X
    )+'px';

  moveCursor.style.top=
    (
      clientY-
      rect.top-
      CURSOR_OFFSET_Y
    )+'px';
}


function cursorWorldPoint(
  clientX,
  clientY
){

  return plateHit(
    clientX-CURSOR_OFFSET_X,
    clientY-CURSOR_OFFSET_Y
  );
}


function beginMove(){

  const s=
    activeShape();

  if(!s)
    return;


  cleanupManipulation();

  manipulationActive=true;

  moveCursor.style.display=
    'block';

  setH2(
    'Press and drag the cursor to move the selected object'
  );


  let dragging=false;
  let pointerId=null;
  let startFingerX=0;
  let startFingerY=0;
  let startPosition=
    s.mesh.position.clone();

  let startCursorPoint=null;

  let zPlane=null;


  function onDown(e){

    pointerId=e.pointerId;

    startFingerX=e.clientX;
    startFingerY=e.clientY;

    updateMoveCursor(
      e.clientX,
      e.clientY
    );

    const cp=
      cursorWorldPoint(
        e.clientX,
        e.clientY
      );

    if(!cp)
      return;


    dragging=true;

    startPosition=
      s.mesh.position.clone();

    startCursorPoint=
      cp.clone();


    if(
      shapeMode==='3d' &&
      selectedAxis==='Z'
    ){

      const normal=
        new THREE.Vector3();

      camera.getWorldDirection(
        normal
      );

      zPlane=
        new THREE.Plane()
          .setFromNormalAndCoplanarPoint(
            normal,
            s.mesh.position
          );
    }


    canvas.setPointerCapture(
      e.pointerId
    );

    e.preventDefault();
  }


  function onMove(e){

    updateMoveCursor(
      e.clientX,
      e.clientY
    );

    if(!dragging)
      return;


    let cp=
      cursorWorldPoint(
        e.clientX,
        e.clientY
      );


    if(!cp)
      return;


    if(
      shapeMode==='3d' &&
      selectedAxis==='Z'
    ){

      const rect=
        canvas.getBoundingClientRect();

      const x=
        ((e.clientX-rect.left)/
          rect.width)*2-1;

      const y=
        -((e.clientY-rect.top)/
          rect.height)*2+1;

      const r=
        new THREE.Raycaster();

      r.setFromCamera(
        new THREE.Vector2(
          x,
          y
        ),
        camera
      );

      const hit=
        new THREE.Vector3();

      if(
        !r.ray.intersectPlane(
          zPlane,
          hit
        )
      )
        return;

      cp=hit;
    }


    const dx=
      cp.x-startCursorPoint.x;

    const dy=
      cp.y-startCursorPoint.y;

    const dz=
      cp.z-startCursorPoint.z;


    if(selectedAxis==='X'){

      s.mesh.position.x=
        startPosition.x+dx;

    }else if(
      selectedAxis==='Y'
    ){

      s.mesh.position.y=
        startPosition.y+dy;

    }else if(
      selectedAxis==='Z'
    ){

      if(shapeMode==='3d'){

        s.mesh.position.z=
          startPosition.z+dz;

      }
    }


    clampToPlate(
      s.mesh,
      true
    );

    refreshShapeVisuals();
  }


  function onUp(){

    dragging=false;

    if(pointerId!==null){

      try{
        canvas.releasePointerCapture(
          pointerId
        );
      }catch(_){}
    }

    showToast(
      'Object moved'
    );
  }


  function cleanup(){

    canvas.removeEventListener(
      'pointerdown',
      onDown
    );

    canvas.removeEventListener(
      'pointermove',
      onMove
    );

    canvas.removeEventListener(
      'pointerup',
      onUp
    );

    moveCursor.style.display=
      'none';

    manipulationActive=false;

    if(
      manipulationCleanup===
      cleanup
    )
      manipulationCleanup=null;
  }


  canvas.addEventListener(
    'pointerdown',
    onDown
  );

  canvas.addEventListener(
    'pointermove',
    onMove
  );

  canvas.addEventListener(
    'pointerup',
    onUp
  );

  manipulationCleanup=
    cleanup;
}


function beginRotate(){

  const s=
    activeShape();

  if(!s)
    return;


  cleanupManipulation();

  manipulationActive=true;

  moveCursor.style.display=
    'block';

  setH2(
    'Press and drag to rotate the selected object'
  );


  let dragging=false;
  let pointerId=null;
  let startAngle=0;
  let startRotation=
    s.mesh.rotation.clone();


  function screenAngle(
    clientX,
    clientY
  ){

    const rect=
      canvas.getBoundingClientRect();

    const center=
      s.mesh.position.clone()
        .project(camera);

    const cx=
      rect.left+
      (center.x+1)*
      rect.width/2;

    const cy=
      rect.top+
      (1-center.y)*
      rect.height/2;

    return Math.atan2(
      clientY-cy,
      clientX-cx
    );
  }


  function onDown(e){

    pointerId=e.pointerId;

    updateMoveCursor(
      e.clientX,
      e.clientY
    );

    startAngle=
      screenAngle(
        e.clientX,
        e.clientY
      );

    startRotation=
      s.mesh.rotation.clone();

    dragging=true;

    canvas.setPointerCapture(
      e.pointerId
    );

    e.preventDefault();
  }


  function onMove(e){

    updateMoveCursor(
      e.clientX,
      e.clientY
    );

    if(!dragging)
      return;


    const angle=
      screenAngle(
        e.clientX,
        e.clientY
      );

    let delta=
      angle-startAngle;


    while(delta>Math.PI)
      delta-=Math.PI*2;

    while(delta<-Math.PI)
      delta+=Math.PI*2;


    if(selectedAxis==='X'){

      s.mesh.rotation.x=
        startRotation.x+delta;

    }else if(
      selectedAxis==='Y'
    ){

      s.mesh.rotation.y=
        startRotation.y+delta;

    }else if(
      selectedAxis==='Z'
    ){

      s.mesh.rotation.z=
        startRotation.z+delta;
    }

    refreshShapeVisuals();
  }


  function onUp(){

    dragging=false;

    if(pointerId!==null){

      try{
        canvas.releasePointerCapture(
          pointerId
        );
      }catch(_){}
    }

    showToast(
      'Object rotated'
    );
  }


  function cleanup(){

    canvas.removeEventListener(
      'pointerdown',
      onDown
    );

    canvas.removeEventListener(
      'pointermove',
      onMove
    );

    canvas.removeEventListener(
      'pointerup',
      onUp
    );

    moveCursor.style.display=
      'none';

    manipulationActive=false;

    if(
      manipulationCleanup===
      cleanup
    )
      manipulationCleanup=null;
  }


  canvas.addEventListener(
    'pointerdown',
    onDown
  );

  canvas.addEventListener(
    'pointermove',
    onMove
  );

  canvas.addEventListener(
    'pointerup',
    onUp
  );

  manipulationCleanup=
    cleanup;
}


function cleanupManipulation(){

  if(manipulationCleanup){

    manipulationCleanup();

    manipulationCleanup=null;
  }
}


/* ─────────────────────────────────────────────────────────────
   LAYER DELETE
───────────────────────────────────────────────────────────── */

function wireLayerDelete(){

  let armedId=null;
  let armTimer=null;


  menuScroll
    .querySelectorAll(
      '[data-del]'
    )
    .forEach(
      btn => {

        btn.addEventListener(
          'click',
          e => {

            e.stopPropagation();

            const id=
              parseInt(
                btn.dataset.del,
                10
              );


            if(armedId!==id){

              menuScroll
                .querySelectorAll(
                  '.tile-del'
                )
                .forEach(
                  b =>
                    b.classList.remove(
                      'armed'
                    )
                );

              armedId=id;

              btn.classList.add(
                'armed'
              );

              clearTimeout(
                armTimer
              );

              armTimer=
                setTimeout(
                  () => {

                    armedId=null;

                    btn.classList.remove(
                      'armed'
                    );

                  },
                  3000
                );

            }else{

              clearTimeout(
                armTimer
              );

              showConfirm(
                'Delete this layer?',
                () => {

                  deleteLayer(id);

                  goToLayersHome();
                }
              );
            }
          }
        );
      }
    );


  menuScroll
    .querySelectorAll(
      '[data-del-tool]'
    )
    .forEach(
      btn => {

        btn.addEventListener(
          'click',
          e => {

            e.stopPropagation();

            const id=
              parseInt(
                btn.dataset.delTool,
                10
              );

            showConfirm(
              'Delete this layer?',
              () => {

                deleteLayer(id);

                if(!layers.length){

                  const l=
                    createLayer();

                  activeLayerId=l.id;
                }

                renderDrawingToolsHome();
              }
            );
          }
        );
      }
    );
}


/* ─────────────────────────────────────────────────────────────
   SHAPE PANEL
───────────────────────────────────────────────────────────── */

const ACTIONS=[
  {
    id:'select',
    label:'Select',
    icon:'select'
  },
  {
    id:'move',
    label:'Move',
    icon:'move'
  },
  {
    id:'rotate',
    label:'Rotate',
    icon:'rotate'
  },
  {
    id:'scale',
    label:'Scale',
    icon:'scale'
  },
  {
    id:'color',
    label:'Color',
    icon:'color'
  },
  {
    id:'boolean',
    label:'Boolean',
    icon:'boolean'
  },
  {
    id:'delete',
    label:'Delete',
    icon:'trash'
  }
];


function renderShapePanel(
  subtool
){

  const l=
    activeLayer();

  const s=
    activeShape();


  if(!l || !s){

    goToDrawingTools();

    return;
  }


  setH2('');


  const totalShapes=
    layers.reduce(
      (n,ly) =>
        n+ly.shapes.length,
      0
    );


  const booleanDisabled=
    totalShapes<2 ||
    !s.mesh.isMesh;


  menuScroll.innerHTML=`
    <div class="tile-row">

      <div
        class="tile3 layer-active"
        data-selected-shape>
        ${svg('shapes')}
        <span>${shapeLabel(s)}</span>
      </div>

    </div>

    <div
      class="action-col"
      style="margin-top:8px;">

      ${
        ACTIONS.map(
          a => `
            <button
              data-action="${a.id}"
              class="${
                a.id===subtool
                  ? 'active'
                  : ''
              }"
              ${
                a.id==='boolean' &&
                booleanDisabled
                  ? 'disabled'
                  : ''
              }>
              ${svg(a.icon)}
              <span>${a.label}</span>
            </button>
          `
        ).join('')
      }

    </div>

    <div
      id="subtoolSlot"
      style="margin-top:8px;">
    </div>
  `;


  menuScroll
    .querySelector(
      '[data-selected-shape]'
    )
    .addEventListener(
      'click',
      () => {

        activeShapeId=s.id;

        refreshShapeVisuals();

        renderShapePanel(
          subtool
        );
      }
    );


  menuScroll
    .querySelectorAll(
      '[data-action]'
    )
    .forEach(
      b => {

        b.addEventListener(
          'click',
          () => {

            const id=
              b.dataset.action;


            if(id==='delete'){

              deleteShape(
                l.id,
                s.id
              );

              goToDrawingTools();

              showToast(
                'Shape deleted'
              );

              return;
            }


            if(id==='select'){

              activateCrosshair();

              return;
            }


            if(id==='boolean'){

              crumbs=[
                'Drawing Tools',
                shapeLabel(s),
                'Boolean'
              ];

              crumbBack=
                () =>
                  goToShape();

              render(
                'booleanPick'
              );

              return;
            }


            goToSubtool(
              id[0].toUpperCase()+
              id.slice(1)
            );
          }
        );
      }
    );


  if(
    subtool &&
    subtool!=='boolean' &&
    subtool!=='select'
  ){

    fillSubtool(
      subtool,
      l,
      s
    );
  }
}


/* ─────────────────────────────────────────────────────────────
   SUBTOOLS
───────────────────────────────────────────────────────────── */

function getDimension(
  s,
  axis
){

  const d=
    s.baseDimensions ||
    geometryDimensions(
      s.mesh
    );

  return d[
    axis.toLowerCase()
  ];
}


function setDimension(
  s,
  axis,
  value
){

  const key=
    axis.toLowerCase();

  const base=
    s.baseDimensions ||
    geometryDimensions(
      s.mesh
    );

  if(!base[key])
    return;

  s.mesh.scale[key]=
    value/base[key];

  clampToPlate(
    s.mesh,
    true
  );
}


function fillSubtool(
  tool,
  l,
  s
){

  const slot=
    document.getElementById(
      'subtoolSlot'
    );

  if(!slot)
    return;


  const axes=
    shapeMode==='2d'
      ? ['X','Y']
      : ['X','Y','Z'];


  if(tool==='move'){

    slot.innerHTML=`
      <div class="stepper-stack">
        ${
          axes.map(
            axis =>
              stepperRow(
                axis,
                s.mesh.position[
                  axis.toLowerCase()
                ],
                -half,
                half,
                'mm'
              )
          ).join('')
        }
      </div>
    `;


    wireAxisButtons(
      slot,
      axes
    );

    wireSteppers(
      slot,
      axes,
      (axis,val) => {

        s.mesh.position[
          axis.toLowerCase()
        ]=val;

        clampToPlate(
          s.mesh,
          true
        );

        fillSubtool(
          'move',
          l,
          s
        );
      }
    );


  }else if(tool==='rotate'){

    const rotateAxes=
      shapeMode==='2d'
        ? ['Z']
        : ['X','Y','Z'];


    slot.innerHTML=`
      <div class="stepper-stack">
        ${
          rotateAxes.map(
            axis =>
              stepperRow(
                axis,
                THREE.MathUtils.radToDeg(
                  s.mesh.rotation[
                    axis.toLowerCase()
                  ]
                ),
                -360,
                360,
                'deg'
              )
          ).join('')
        }
      </div>
    `;


    wireAxisButtons(
      slot,
      rotateAxes
    );


    slot
      .querySelectorAll(
        '.stepper-row[data-axis]'
      )
      .forEach(
        row => {

          row
            .querySelectorAll(
              '[data-step]'
            )
            .forEach(
              btn => {

                btn.addEventListener(
                  'click',
                  () => {

                    const axis=
                      row.dataset.axis;

                    const key=
                      axis.toLowerCase();

                    const current=
                      THREE.MathUtils.radToDeg(
                        s.mesh.rotation[key]
                      );

                    const v=
                      current+
                      parseFloat(
                        btn.dataset.step
                      )*5;

                    s.mesh.rotation[key]=
                      THREE.MathUtils.degToRad(
                        v
                      );

                    fillSubtool(
                      'rotate',
                      l,
                      s
                    );
                  }
                );
              }
            );
        }
      );


    menuScroll
      .querySelector(
        '[data-action="rotate"]'
      )
      ?.classList.add(
        'active'
      );


    beginRotate();


  }else if(tool==='scale'){

    slot.innerHTML=`
      <div class="stepper-stack">

        ${
          axes.map(
            axis =>
              stepperRow(
                axis,
                getDimension(
                  s,
                  axis
                ),
                GRID_SQUARE,
                PLATE_SIZE,
                'mm'
              )
          ).join('')
        }

      </div>
    `;


    wireAxisButtons(
      slot,
      axes
    );


    wireSteppers(
      slot,
      axes,
      (axis,val) => {

        setDimension(
          s,
          axis,
          val
        );

        fillSubtool(
          'scale',
          l,
          s
        );
      }
    );


  }else if(tool==='color'){

    slot.innerHTML=`
      <div class="swatch-row">
        ${
          SWATCHES.map(
            c => `
              <div
                class="swatch ${
                  s.color===c
                    ? 'selected'
                    : ''
                }"
                data-c="${c}"
                style="background:${c}">
              </div>
            `
          ).join('')
        }
      </div>
    `;


    slot
      .querySelectorAll(
        '[data-c]'
      )
      .forEach(
        sw => {

          sw.addEventListener(
            'click',
            () => {

              s.color=
                sw.dataset.c;

              refreshShapeVisuals();

              fillSubtool(
                'color',
                l,
                s
              );
            }
          );
        }
      );
  }
}


function stepperRow(
  axis,
  val,
  min,
  max,
  unit
){

  const display=
    unit==='mm'
      ? `${Number(val).toFixed(2)} mm`
      : `${Number(val).toFixed(1)}°`;


  return `
    <div
      class="stepper-row"
      data-axis="${axis}">

      <button
        class="step-lbl ${
          selectedAxis===axis
            ? 'axis-active'
            : ''
        }"
        data-axis="${axis}">
        ${axis}
      </button>

      <button
        data-step="-1">
        −
      </button>

      <div
        class="value-button"
        data-min="${min}"
        data-max="${max}">
        ${display}
      </div>

      <button
        data-step="1">
        +
      </button>

    </div>
  `;
}


function wireAxisButtons(
  scope,
  axes
){

  scope
    .querySelectorAll(
      '.step-lbl[data-axis]'
    )
    .forEach(
      btn => {

        btn.addEventListener(
          'click',
          e => {

            e.stopPropagation();

            setAxis(
              btn.dataset.axis
            );

            scope
              .querySelectorAll(
                '.step-lbl[data-axis]'
              )
              .forEach(
                b =>
                  b.classList.toggle(
                    'axis-active',
                    b.dataset.axis===
                    selectedAxis
                  )
              );
          }
        );
      }
    );
}


function wireSteppers(
  scope,
  axes,
  onChange
){

  axes.forEach(
    axis => {

      const row=
        scope.querySelector(
          `.stepper-row[data-axis="${axis}"]`
        );

      if(!row)
        return;


      const valueEl=
        row.querySelector(
          '.value-button'
        );

      const min=
        parseFloat(
          valueEl.dataset.min
        );

      const max=
        parseFloat(
          valueEl.dataset.max
        );


      row
        .querySelectorAll(
          '[data-step]'
        )
        .forEach(
          btn => {

            btn.addEventListener(
              'click',
              () => {

                const current=
                  parseFloat(
                    valueEl.textContent
                      .replace(
                        /[^0-9.-]/g,
                        ''
                      )
                  )||0;


                const step=
                  currentIncrement();


                const v=
                  Math.min(
                    max,
                    Math.max(
                      min,
                      current+
                      parseFloat(
                        btn.dataset.step
                      )*step
                    )
                  );


                onChange(
                  axis,
                  v
                );
              }
            );
          }
        );
    }
  );
}


/* ─────────────────────────────────────────────────────────────
   BOOLEAN
───────────────────────────────────────────────────────────── */

function renderBooleanPick(){

  const s=
    activeShape();

  if(!s){

    goToDrawingTools();

    return;
  }


  setH2(
    'Pick a second shape, then an operation'
  );


  const others=[];

  layers.forEach(
    l =>
      l.shapes.forEach(
        sh => {

          if(
            !(
              l.id===activeLayerId &&
              sh.id===activeShapeId
            )
          ){

            others.push({
              l,
              sh
            });
          }
        }
      )
  );


  let targetId=null;


  menuScroll.innerHTML=`
    <div class="tile-row">
      ${
        others.map(
          o => `
            <div
              class="tile3"
              data-target="${
                o.l.id
              }:${o.sh.id}">
              ${svg('shapes')}
              <span>${
                shapeLabel(o.sh)
              }</span>
            </div>
          `
        ).join('')
      }
    </div>

    <div
      class="action-col"
      style="margin-top:8px;">

      <button
        data-op="union"
        disabled>
        ${svg('boolean')}
        <span>Union</span>
      </button>

      <button
        data-op="subtract"
        disabled>
        ${svg('boolean')}
        <span>Subtract</span>
      </button>

      <button
        data-op="intersect"
        disabled>
        ${svg('boolean')}
        <span>Intersect</span>
      </button>

    </div>
  `;


  menuScroll
    .querySelectorAll(
      '[data-target]'
    )
    .forEach(
      b => {

        b.addEventListener(
          'click',
          () => {

            targetId=
              b.dataset.target;

            menuScroll
              .querySelectorAll(
                '[data-target]'
              )
              .forEach(
                x =>
                  x.classList.remove(
                    'layer-active'
                  )
              );

            b.classList.add(
              'layer-active'
            );

            menuScroll
              .querySelectorAll(
                '[data-op]'
              )
              .forEach(
                x =>
                  x.disabled=false
              );
          }
        );
      }
    );


  menuScroll
    .querySelectorAll(
      '[data-op]'
    )
    .forEach(
      b => {

        b.addEventListener(
          'click',
          () => {

            if(!targetId)
              return;

            const parts=
              targetId.split(':');

            runBoolean(
              b.dataset.op,
              parseInt(
                parts[0],
                10
              ),
              parseFloat(
                parts[1]
              )
            );
          }
        );
      }
    );
}


async function runBoolean(
  mode,
  targetLayerId,
  targetShapeId
){

  const a=
    activeShape();

  const aLayer=
    activeLayer();

  const bLayer=
    findLayer(
      targetLayerId
    );

  const b=
    bLayer
      ? bLayer.shapes.find(
          s =>
            s.id===targetShapeId
        )
      : null;


  if(!a || !b)
    return;


  try{

    const {
      Evaluator,
      Brush,
      ADDITION,
      SUBTRACTION,
      INTERSECTION
    }=
      await import(
        'https://unpkg.com/three-bvh-csg@0.0.16/build/index.module.js'
      );


    const opMap={
      union:ADDITION,
      subtract:SUBTRACTION,
      intersect:INTERSECTION
    };


    a.mesh.updateMatrixWorld();
    b.mesh.updateMatrixWorld();


    const brushA=
      new Brush(
        a.mesh.geometry.clone()
      );

    brushA.position.copy(
      a.mesh.position
    );

    brushA.rotation.copy(
      a.mesh.rotation
    );

    brushA.scale.copy(
      a.mesh.scale
    );

    brushA.updateMatrixWorld();


    const brushB=
      new Brush(
        b.mesh.geometry.clone()
      );

    brushB.position.copy(
      b.mesh.position
    );

    brushB.rotation.copy(
      b.mesh.rotation
    );

    brushB.scale.copy(
      b.mesh.scale
    );

    brushB.updateMatrixWorld();


    const result=
      new Evaluator().evaluate(
        brushA,
        brushB,
        opMap[mode]
      );


    result.geometry
      .computeVertexNormals();


    const mesh=
      new THREE.Mesh(
        result.geometry,
        new THREE.MeshStandardMaterial({
          color:a.color,
          metalness:.15,
          roughness:.55
        })
      );


    clampToPlate(
      mesh,
      false
    );

    attachOutline(mesh);

    scene.add(mesh);


    const rec={
      id:Date.now()+Math.random(),
      num:aLayer.shapes.length,
      mesh,
      geomId:'solid',
      fields:null,
      color:a.color,
      baseDimensions:
        storeDimensions(mesh)
    };


    deleteShape(
      aLayer.id,
      a.id
    );

    deleteShape(
      bLayer.id,
      b.id
    );


    aLayer.shapes.push(
      rec
    );

    aLayer.shapes.forEach(
      (s2,i) =>
        s2.num=i+1
    );


    activeLayerId=
      aLayer.id;

    activeShapeId=
      rec.id;


    refreshShapeVisuals();

    showToast(
      `${
        mode[0].toUpperCase()+
        mode.slice(1)
      } created`
    );

    goToShape();

  }catch(err){

    console.error(err);

    showToast(
      'Boolean tool could not load — check your connection'
    );
  }
}


/* ─────────────────────────────────────────────────────────────
   SETTINGS / HELP
───────────────────────────────────────────────────────────── */

function renderSettings(){

  setH2(
    `Plate fixed at ${PLATE_SIZE}×${PLATE_SIZE}mm, ${GRID_SQUARE}mm grid`
  );


  menuScroll.innerHTML=`
    <div class="tile-row">

      <div
        class="tile3"
        id="saveBtn">
        ${svg('settings')}
        <span>Save</span>
      </div>

      <div
        class="tile3"
        id="loadBtn">
        ${svg('settings')}
        <span>Load</span>
      </div>

      <div
        class="tile3"
        id="stlBtn">
        ${svg('settings')}
        <span>Export STL</span>
      </div>

    </div>
  `;


  document
    .getElementById(
      'saveBtn'
    )
    .addEventListener(
      'click',
      () => {

        saveSceneJSON();

        showToast(
          'Scene saved'
        );
      }
    );


  document
    .getElementById(
      'loadBtn'
    )
    .addEventListener(
      'click',
      () =>
        showToast(
          'Load Scene is coming in a future update'
        )
    );


  document
    .getElementById(
      'stlBtn'
    )
    .addEventListener(
      'click',
      () => {

        exportSTL();

        showToast(
          'STL exported'
        );
      }
    );
}


function renderHelp(){

  setH2(
    'Every module in the app'
  );


  menuScroll.innerHTML=`
    <div class="tile-row">
      ${
        MODULES
          .filter(
            m =>
              MODULE_ORDER.includes(
                m.id
              )
          )
          .map(
            m => `
              <div
                class="tile3"
                style="opacity:.6">
                ${svg(m.icon)}
                <span>${m.label}</span>
              </div>
            `
          )
          .join('')
      }
    </div>
  `;
}


/* ─────────────────────────────────────────────────────────────
   CONFIRMATION
───────────────────────────────────────────────────────────── */

const confirmOverlay=
  document.createElement(
    'div'
  );

confirmOverlay.id=
  'confirmOverlay';

confirmOverlay.classList.add(
  'hidden'
);

confirmOverlay.innerHTML=`
  <div class="confirm-box">

    <p id="confirmMsg"></p>

    <div class="confirm-row">

      <button
        class="confirm-no"
        id="confirmNo">
        No
      </button>

      <button
        class="confirm-yes"
        id="confirmYes">
        Yes
      </button>

    </div>

  </div>
`;

document
  .getElementById('main')
  .appendChild(
    confirmOverlay
  );


function showConfirm(
  msg,
  onYes
){

  document
    .getElementById(
      'confirmMsg'
    )
    .textContent=msg;


  confirmOverlay
    .classList.remove(
      'hidden'
    );


  const yes=
    document.getElementById(
      'confirmYes'
    );

  const no=
    document.getElementById(
      'confirmNo'
    );


  const cleanup=() => {

    confirmOverlay
      .classList.add(
        'hidden'
      );

    yes.replaceWith(
      yes.cloneNode(true)
    );

    no.replaceWith(
      no.cloneNode(true)
    );
  };


  document
    .getElementById(
      'confirmYes'
    )
    .addEventListener(
      'click',
      () => {

        cleanup();

        onYes();
      }
    );


  document
    .getElementById(
      'confirmNo'
    )
    .addEventListener(
      'click',
      cleanup
    );
}


/* ─────────────────────────────────────────────────────────────
   EXPORT / SAVE
───────────────────────────────────────────────────────────── */

function exportSTL(){

  const meshes=[];

  layers.forEach(
    l =>
      l.shapes.forEach(
        s => {

          if(s.mesh.isMesh)
            meshes.push(
              s.mesh
            );
        }
      )
  );


  if(!meshes.length){

    showToast(
      'Nothing to export'
    );

    return;
  }


  const group=
    new THREE.Group();


  meshes.forEach(
    m => {

      const c=
        m.clone();

      c.remove(
        ...c.children
      );

      group.add(c);
    }
  );


  const exporter=
    new STLExporter();


  const result=
    exporter.parse(
      group,
      {
        binary:true
      }
    );


  downloadBlob(
    new Blob(
      [result],
      {
        type:
          'application/octet-stream'
      }
    ),
    'stl-maker-model.stl'
  );
}


function saveSceneJSON(){

  const data=
    layers.map(
      l => ({
        name:l.name,

        shapes:
          l.shapes.map(
            s => ({
              geomId:s.geomId,
              fields:s.fields,
              color:s.color,
              position:
                s.mesh.position.toArray(),
              rotation:[
                s.mesh.rotation.x,
                s.mesh.rotation.y,
                s.mesh.rotation.z
              ],
              scale:
                s.mesh.scale.toArray(),
              baseDimensions:
                s.baseDimensions
            })
          )
      })
    );


  downloadBlob(
    new Blob(
      [
        JSON.stringify(
          data,
          null,
          2
        )
      ],
      {
        type:'application/json'
      }
    ),
    'stl-maker-scene.json'
  );
}


function downloadBlob(
  blob,
  filename
){

  const url=
    URL.createObjectURL(
      blob
    );

  const a=
    document.createElement(
      'a'
    );

  a.href=url;

  a.download=filename;

  document.body.appendChild(a);

  a.click();

  document.body.removeChild(a);

  setTimeout(
    () =>
      URL.revokeObjectURL(
        url
      ),
    2000
  );
}


/* ─────────────────────────────────────────────────────────────
   TOAST
───────────────────────────────────────────────────────────── */

let toastTimer=null;


function showToast(msg){

  const t=
    document.getElementById(
      'toast'
    );

  t.textContent=msg;

  t.classList.add(
    'show'
  );

  clearTimeout(
    toastTimer
  );

  toastTimer=
    setTimeout(
      () =>
        t.classList.remove(
          'show'
        ),
      1800
    );
}


/* ─────────────────────────────────────────────────────────────
   INITIAL STATE
───────────────────────────────────────────────────────────── */

refreshModeScene();
refreshModeToggle();

renderH1();

goToDrawingTools();
