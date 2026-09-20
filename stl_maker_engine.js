import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { STLExporter } from 'three/addons/exporters/STLExporter.js';
import { ICONS, MODULES, SHAPES_3D, SWATCHES } from './stl_maker_data.js';

/* =====================================================================
   INJECTED STYLES
   ===================================================================== */
const style = document.createElement('style');
style.textContent = `
.module-btn.active-blue{ background:#3a6fd8 !important; border-color:#3a6fd8 !important; color:#fff !important; }
.module-btn.active-blue svg{ color:#fff !important; }

#slideMenu.open{ width:20%; min-width:88px; }
#slideMenu.open.expanded{ width:38%; min-width:150px; }
.toggle-row2{ display:flex; gap:5px; width:100%; }
.toggle-row2 button{ flex:1; padding:8px 2px; border-radius:8px; border:1px solid var(--line); background:var(--navy-3); color:var(--ink); font-size:10.5px; font-weight:700; }
.toggle-row2 button.toggle-active{ background:#3a6fd8; color:#fff; border-color:#3a6fd8; }
.add-rect{ width:100%; padding:8px 2px; border-radius:8px; border:1px solid var(--line); background:var(--navy-3); color:var(--gold-light); font-size:10.5px; font-weight:700; display:flex; align-items:center; justify-content:center; gap:5px; }
.add-rect svg{ width:14px; height:14px; }
.h3-stack{ display:flex; flex-direction:column; gap:6px; width:100%; }
.menu-scroll{ align-items:center; }
.tile3{
  display:flex; flex-direction:column; align-items:center; justify-content:center; gap:4px;
  width:82px; aspect-ratio:1; border-radius:14px; background:var(--navy-3); border:1px solid var(--line);
  color:var(--ink); padding:6px 4px; position:relative;
}
#slideMenu.expanded .tile3{ width:112px; }
.tile3 svg{ width:20px; height:20px; color:var(--gold-light); flex:0 0 auto; }
.tile3 span{ font-size:8.5px; font-weight:600; text-align:center; line-height:1.15; display:block; overflow:hidden; text-overflow:ellipsis; max-height:2.3em; }
#slideMenu.expanded .tile3 span{ font-size:10px; }
.tile3.toggle-active{ background:#3a6fd8; border-color:#3a6fd8; color:#fff; }
.tile3.toggle-active svg{ color:#fff; }
.tile3.layer-active{ background:#fff; border:2px solid #3a6fd8; color:#111; }
.tile3.layer-active svg{ color:#3a6fd8; }
.tile3.layer-active span{ color:#111; }

.tile-num{ position:absolute; top:-7px; right:-4px; background:var(--gold); color:var(--navy); font-size:9px; font-weight:800; width:17px; height:17px; border-radius:50%; display:flex; align-items:center; justify-content:center; }
.tile-del{ position:absolute; bottom:-7px; right:-7px; width:20px; height:20px; border-radius:6px; background:var(--navy); border:1px solid var(--line); color:var(--muted); display:flex; align-items:center; justify-content:center; z-index:2; }
.tile-del svg{ width:11px; height:11px; }
.tile-del.armed{ background:var(--danger); color:#fff; border-color:var(--danger); }

.stepper-row{ display:flex; align-items:center; gap:5px; width:100%; }
.stepper-row .step-lbl{ width:14px; font-family:'JetBrains Mono',monospace; font-size:10px; color:var(--gold); flex:0 0 auto; }
.stepper-row button{ width:26px; height:26px; flex:0 0 auto; background:var(--navy-3); border:1px solid var(--line); border-radius:6px; color:var(--gold-light); font-size:15px; font-weight:700; }
.stepper-row button:active{ background:var(--gold); color:var(--navy); }
.stepper-row input{ flex:1; min-width:0; background:#fff; color:#111; border:1px solid var(--line); border-radius:6px; font-family:'JetBrains Mono',monospace; font-size:10.5px; padding:5px 2px; text-align:center; }
.stepper-row.all-axes .step-lbl{ width:auto; font-size:8.5px; text-transform:uppercase; }
.stepper-stack{ display:flex; flex-direction:column; gap:5px; width:100%; padding:0 2px; }

.action-col{ display:flex; flex-direction:column; gap:6px; width:100%; }
.action-col button{ display:flex; flex-direction:row; align-items:center; gap:8px; background:var(--navy-3); border:1px solid var(--line); border-radius:9px; color:var(--ink); padding:9px 8px; width:100%; }
.action-col button svg{ width:17px; height:17px; color:var(--gold-light); flex:0 0 auto; }
.action-col button span{ font-size:10.5px; font-weight:600; }
.action-col button.active{ border-color:var(--gold); background:var(--navy-4); }

.tile-row{ display:flex; flex-wrap:wrap; gap:8px; justify-content:center; width:100%; }
.swatch-row{ display:flex; flex-wrap:wrap; gap:6px; justify-content:center; width:100%; }

#lockBtn, #mmBtn{ position:absolute; top:10px; z-index:6; height:36px; background:rgba(32,33,58,0.9); border:1px solid var(--line); border-radius:9px; color:var(--gold-light); display:flex; align-items:center; justify-content:center; }
#lockBtn{ right:10px; width:36px; }
#lockBtn svg{ width:17px; height:17px; }
#lockBtn.unlocked{ color:var(--muted); }
#mmBtn{ left:10px; padding:0 9px; font-family:'JetBrains Mono',monospace; font-size:10.5px; font-weight:700; gap:5px; }
#mmBtn .seg{ opacity:0.4; } #mmBtn .seg.on{ opacity:1; color:#fff; } #mmBtn .sep{ opacity:0.3; }

#confirmOverlay{ position:absolute; inset:0; z-index:50; background:rgba(0,0,0,0.55); display:flex; align-items:center; justify-content:center; }
#confirmOverlay.hidden{ display:none; }
.confirm-box{ background:var(--navy-2); border:1px solid var(--line); border-radius:12px; padding:18px; width:78%; max-width:280px; text-align:center; }
.confirm-box p{ font-size:13px; color:var(--ink); margin:0 0 14px; }
.confirm-row{ display:flex; gap:10px; }
.confirm-row button{ flex:1; padding:10px; border-radius:8px; font-size:13px; font-weight:700; border:1px solid var(--line); }
.confirm-yes{ background:var(--danger); color:#fff; border-color:var(--danger); }
.confirm-no{ background:var(--navy-3); color:var(--ink); }
#h2Title{ white-space:normal !important; word-break:break-word; }
`;
document.head.appendChild(style);

/* =====================================================================
   ICON HELPER
   ===================================================================== */
function svg(name){ return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${ICONS[name]||''}</svg>`; }
Object.assign(ICONS, {
  lock:   '<rect x="5" y="10.5" width="14" height="9.5" rx="1.5"/><path d="M8 10.5V7a4 4 0 0 1 8 0v3.5"/>',
  unlock: '<rect x="5" y="10.5" width="14" height="9.5" rx="1.5"/><path d="M8 10.5V7a4 4 0 0 1 7.5-2"/>',
  twod:   '<rect x="4" y="4" width="16" height="16" rx="2"/>',
  threed: '<path d="M12 2 3 7.5 12 12l9-4.5L12 2Z"/><path d="M3 7.5v9L12 21l9-4.5v-9"/>',
});

/* =====================================================================
   THREE.JS SCENE
   ===================================================================== */
const canvas = document.getElementById('viewport3d');
const renderer = new THREE.WebGLRenderer({ canvas, antialias:true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor(0x1a1a2e, 1);
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 5000);
const DEFAULT_CAM = new THREE.Vector3(90, 70, 110);
camera.position.copy(DEFAULT_CAM);
scene.add(new THREE.HemisphereLight(0xfff4e0, 0x14141f, 1.1));
const key = new THREE.DirectionalLight(0xffffff, 1.4); key.position.set(60,90,40); scene.add(key);
const fillL = new THREE.DirectionalLight(0xc8a96e, 0.35); fillL.position.set(-60,30,-40); scene.add(fillL);

const PLATE_SIZE = 100, GRID_SQUARE = 2.5, half = PLATE_SIZE/2;
const grid = new THREE.GridHelper(PLATE_SIZE, PLATE_SIZE/GRID_SQUARE, 0xc8a96e, 0x34355a);
grid.material.transparent = true; grid.material.opacity = 0.4;
scene.add(grid);
scene.add(new THREE.LineLoop(
  new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-half,0.06,-half),new THREE.Vector3(half,0.06,-half),new THREE.Vector3(half,0.06,half),new THREE.Vector3(-half,0.06,half)]),
  new THREE.LineBasicMaterial({ color:0xe0c48f })
));
const axisOrigin = new THREE.Vector3(-half-4, 0.1, -half-4);
scene.add(new THREE.ArrowHelper(new THREE.Vector3(1,0,0), axisOrigin, 18, 0xd9534f, 4, 3));
scene.add(new THREE.ArrowHelper(new THREE.Vector3(0,0,1), axisOrigin, 18, 0x4a90d9, 4, 3));
scene.add(new THREE.ArrowHelper(new THREE.Vector3(0,1,0), axisOrigin, 18, 0x5cb85c, 4, 3));

function makeLabelSprite(text){
  const cvs = document.createElement('canvas'); cvs.width = 64; cvs.height = 32;
  const ctx = cvs.getContext('2d');
  ctx.fillStyle = '#e0c48f'; ctx.font = 'bold 22px monospace'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(text, 32, 16);
  const spr = new THREE.Sprite(new THREE.SpriteMaterial({ map:new THREE.CanvasTexture(cvs), depthTest:false }));
  spr.scale.set(6,3,1);
  return spr;
}
let mmLabelGroup = null;
function buildMmLabels(step){
  if (mmLabelGroup) scene.remove(mmLabelGroup);
  mmLabelGroup = new THREE.Group();
  for (let v=0; v<=PLATE_SIZE; v+=step){
    const sx = makeLabelSprite(String(v)); sx.position.set(-half+v, 0.2, half+5); mmLabelGroup.add(sx);
    const sz = makeLabelSprite(String(v)); sz.position.set(-half-5, 0.2, -half+v); mmLabelGroup.add(sz);
  }
  mmLabelGroup.visible = false;
  scene.add(mmLabelGroup);
}
buildMmLabels(5);
let mmState = 'off';
const mmBtn = document.createElement('button'); mmBtn.id = 'mmBtn';
document.getElementById('plate').appendChild(mmBtn);
function refreshMmBtn(){ mmBtn.innerHTML = `<span class="seg ${mmState==='5'?'on':''}">5</span><span class="sep">|</span><span class="seg ${mmState==='2.5'?'on':''}">2.5</span>`; }
mmBtn.addEventListener('click', () => {
  mmState = mmState==='off' ? '5' : mmState==='5' ? '2.5' : 'off';
  if (mmState==='off'){ mmLabelGroup.visible=false; } else { buildMmLabels(mmState==='5'?5:2.5); mmLabelGroup.visible=true; }
  refreshMmBtn();
});
refreshMmBtn();

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; controls.dampingFactor = 0.08;
controls.target.set(0,10,0); controls.update();
let rotationLocked = true;
controls.enableRotate = !rotationLocked;
const lockBtn = document.createElement('button'); lockBtn.id = 'lockBtn';
document.getElementById('plate').appendChild(lockBtn);
function refreshLockBtn(){ lockBtn.innerHTML = svg(rotationLocked?'lock':'unlock'); lockBtn.classList.toggle('unlocked', !rotationLocked); }
lockBtn.addEventListener('click', () => { rotationLocked=!rotationLocked; controls.enableRotate=!rotationLocked; refreshLockBtn(); });
refreshLockBtn();

function fitCanvas(){
  const rect = document.getElementById('plate').getBoundingClientRect();
  renderer.setSize(rect.width, rect.height, false);
  camera.aspect = rect.width/rect.height; camera.updateProjectionMatrix();
}
new ResizeObserver(fitCanvas).observe(document.getElementById('plate'));
setTimeout(fitCanvas, 30);
(function animate(){ requestAnimationFrame(animate); controls.update(); renderer.render(scene,camera); })();

/* =====================================================================
   DATA MODEL
   ===================================================================== */
const layers = [];
let nextLayerId = 1;
let activeLayerId = null;
let activeShapeId = null;
const GRAY = 0x777788;

function findLayer(id){ return layers.find(l=>l.id===id); }
function activeLayer(){ return findLayer(activeLayerId); }
function activeShape(){ const l=activeLayer(); return l ? l.shapes.find(s=>s.id===activeShapeId) : null; }
function createLayer(){ const l = { id: nextLayerId++, name:`Layer ${layers.length+1}`, shapes:[] }; layers.push(l); return l; }
function refreshShapeVisuals(){
  layers.forEach(l => l.shapes.forEach(s => {
    const active = (l.id===activeLayerId && s.id===activeShapeId);
    s.mesh.material.color.set(active ? s.color : GRAY);
    if (s.mesh.userData.outline) s.mesh.userData.outline.visible = !active;
  }));
}

function buildGeometry(shapeId, fields){
  if (shapeId==='circle')    return new THREE.SphereGeometry(fields.D/2, 32, 24);
  if (shapeId==='square')    return new THREE.BoxGeometry(fields.W, fields.W, fields.W);
  if (shapeId==='rectangle') return new THREE.BoxGeometry(fields.L, fields.H, fields.W);
  if (shapeId==='cylinder')  return new THREE.CylinderGeometry(fields.D/2, fields.D/2, fields.H, 32);
  if (shapeId==='cone')      return new THREE.ConeGeometry(fields.D/2, fields.H, 32);
  if (shapeId==='triangle')  return new THREE.CylinderGeometry(fields.D/2, fields.D/2, fields.H, 3);
  if (shapeId==='octagon')   return new THREE.CylinderGeometry(fields.D/2, fields.D/2, fields.H, 8);
  if (shapeId==='oval'){ const g = new THREE.SphereGeometry(fields.D/2, 32, 24); g.scale(1,0.6,1); return g; }
  return new THREE.BoxGeometry(30,30,30);
}
function clampToPlate(mesh, allowFloat){
  const geo = mesh.geometry; if (!geo.boundingBox) geo.computeBoundingBox(); const bb = geo.boundingBox;
  const rx=(bb.max.x-bb.min.x)*mesh.scale.x, ry=(bb.max.y-bb.min.y)*mesh.scale.y, rz=(bb.max.z-bb.min.z)*mesh.scale.z;
  if (rx>PLATE_SIZE) mesh.scale.x*=PLATE_SIZE/rx;
  if (ry>PLATE_SIZE) mesh.scale.y*=PLATE_SIZE/ry;
  if (rz>PLATE_SIZE) mesh.scale.z*=PLATE_SIZE/rz;
  if (!allowFloat) mesh.position.y = -bb.min.y*mesh.scale.y;
  else if (mesh.position.y < -bb.min.y*mesh.scale.y) mesh.position.y = -bb.min.y*mesh.scale.y;
  const hx=(bb.max.x-bb.min.x)*mesh.scale.x/2, hz=(bb.max.z-bb.min.z)*mesh.scale.z/2;
  mesh.position.x = THREE.MathUtils.clamp(mesh.position.x, -half+hx, half-hx);
  mesh.position.z = THREE.MathUtils.clamp(mesh.position.z, -half+hz, half-hz);
}
function attachOutline(mesh){
  const edges = new THREE.LineSegments(new THREE.EdgesGeometry(mesh.geometry), new THREE.LineBasicMaterial({ color:0xffffff }));
  mesh.add(edges); mesh.userData.outline = edges;
}
function insertShape(layerId, shapeId, fields){
  const l = findLayer(layerId);
  const geo = buildGeometry(shapeId, fields);
  const color = SWATCHES[0];
  const mesh = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color, metalness:0.15, roughness:0.55 }));
  mesh.position.set(0,0,0);
  clampToPlate(mesh, false);
  attachOutline(mesh);
  scene.add(mesh);
  const rec = { id: Date.now()+Math.random(), num: l.shapes.length+1, mesh, geomId:shapeId, fields:{...fields}, color };
  l.shapes.push(rec);
  return rec;
}
function deleteShape(layerId, shapeId){
  const l = findLayer(layerId); if (!l) return;
  const idx = l.shapes.findIndex(s=>s.id===shapeId); if (idx===-1) return;
  const s = l.shapes[idx];
  scene.remove(s.mesh); s.mesh.geometry.dispose();
  l.shapes.splice(idx,1);
  l.shapes.forEach((s2,i)=>s2.num=i+1);
  if (activeShapeId===shapeId) activeShapeId = null;
}
function deleteLayer(layerId){
  const l = findLayer(layerId); if (!l) return;
  l.shapes.forEach(s => { scene.remove(s.mesh); s.mesh.geometry.dispose(); });
  layers.splice(layers.indexOf(l),1);
  layers.forEach((l2,i)=>l2.name=`Layer ${i+1}`);
  if (activeLayerId===layerId){ activeLayerId=null; activeShapeId=null; }
}

const raycaster = new THREE.Raycaster(), ndc = new THREE.Vector2();
canvas.addEventListener('pointerup', (e) => {
  const rect = canvas.getBoundingClientRect();
  ndc.x = ((e.clientX-rect.left)/rect.width)*2-1;
  ndc.y = -((e.clientY-rect.top)/rect.height)*2+1;
  raycaster.setFromCamera(ndc, camera);
  const all = []; layers.forEach(l => l.shapes.forEach(s => all.push({l,s})));
  const hits = raycaster.intersectObjects(all.map(x=>x.s.mesh), false);
  if (hits.length){
    const hit = all.find(x => x.s.mesh === hits[0].object);
    activeLayerId = hit.l.id; activeShapeId = hit.s.id;
    refreshShapeVisuals();
    goToShape();
  }
});
function shapeLabel(s){ return `${s.geomId[0].toUpperCase()+s.geomId.slice(1)} #${s.num}`; }

/* =====================================================================
   H1 — MODULES. Layers is the default/active module on load.
   ===================================================================== */
const h1 = document.getElementById('h1');
const MODULE_ORDER = ['tools','layers','settings','help'];
let activeModule = 'layers';
function renderH1(){
  const mods = MODULE_ORDER.map(id => MODULES.find(m=>m.id===id)).filter(Boolean);
  h1.innerHTML = mods.map(m => `<button class="module-btn ${m.id===activeModule?'active-blue':''}" data-module="${m.id}">${svg(m.icon)}<span>${m.label}</span></button>`).join('');
  h1.querySelectorAll('[data-module]').forEach(btn => btn.addEventListener('click', () => {
    const id = btn.dataset.module;
    activeModule = id;
    if (id==='layers') goToLayersHome();
    else if (id==='tools') goToTools();
    else if (id==='settings'){ crumbs=['Settings']; crumbBack=null; render('settings'); }
    else if (id==='help'){ crumbs=['Help']; crumbBack=null; render('help'); }
    renderH1();
  }));
}

/* =====================================================================
   H2 — breadcrumb
   ===================================================================== */
const h2Title = document.getElementById('h2Title'), h2Info = document.getElementById('h2Info');
const btnUndo = document.getElementById('btnUndo'), btnRedo = document.getElementById('btnRedo');
btnUndo.innerHTML = svg('undo') + '<span>Undo</span>';
btnRedo.innerHTML = svg('redo') + '<span>Redo</span>';
btnUndo.disabled = true; btnRedo.disabled = true;

let crumbs = ['Layers'];
let crumbBack = null;
let h2BackAttached = false;
function ensureH2Back(){
  if (h2BackAttached) return;
  const wrap = h2Title.parentElement.parentElement;
  const backBtn = document.createElement('button');
  backBtn.id = 'h2Back';
  backBtn.style.cssText = 'background:none;border:none;color:var(--gold-light);width:26px;height:26px;display:flex;align-items:center;justify-content:center;flex:0 0 auto;';
  backBtn.innerHTML = svg('back');
  backBtn.addEventListener('click', () => { if (crumbBack) crumbBack(); });
  wrap.insertBefore(backBtn, wrap.firstChild);
  h2BackAttached = true;
}
ensureH2Back();
function setH2(info){
  document.getElementById('h2Back').style.display = crumbBack ? 'flex' : 'none';
  h2Title.textContent = crumbs.join(' - ');
  h2Info.textContent = info || '';
}

const menuScroll = document.getElementById('menuScroll');
const slideMenu = document.getElementById('slideMenu');
document.getElementById('expandTab').innerHTML = svg('back');
document.getElementById('expandTab').addEventListener('click', () => slideMenu.classList.toggle('expanded'));

/* =====================================================================
   SHAPE MODE (2D/3D) — presentational toggle, always visible, never gates
   ===================================================================== */
let shapeMode = '2d';

/* =====================================================================
   NAVIGATION
   ===================================================================== */
function goToLayersHome(){
  crumbs = ['Layers']; crumbBack = null;
  activeShapeId = null;
  render('layersHome');
}
function goToLayer(){
  const l = activeLayer();
  crumbs = ['Layers', l.name];
  crumbBack = () => { activeLayerId = null; goToLayersHome(); };
  render('layersHome');
}
function goToShape(){
  const l = activeLayer(), s = activeShape();
  crumbs = ['Layers', l.name, shapeLabel(s)];
  crumbBack = () => { activeShapeId = null; goToLayer(); };
  render('shapePanel');
}
function goToSubtool(toolLabel){
  const l = activeLayer(), s = activeShape();
  crumbs = ['Layers', l.name, shapeLabel(s), toolLabel];
  crumbBack = () => { goToShape(); };
  render('shapePanel', toolLabel.toLowerCase());
}
function goToTools(){
  crumbs = ['Tools']; crumbBack = null;
  render('toolsHome');
}

function render(view, subtool){
  slideMenu.classList.add('open');
  if (view==='layersHome') renderLayersHome();
  else if (view==='shapePanel') renderShapePanel(subtool);
  else if (view==='toolsHome') renderToolsHome();
  else if (view==='booleanPick') renderBooleanPick();
  else if (view==='settings') renderSettings();
  else if (view==='help') renderHelp();
  else if (view==='drawMethod') renderDrawMethod(subtool);
  else if (view==='drawShapePick') renderDrawShapePick(subtool);
  else if (view==='drawDivisionPick') renderDrawDivisionPick(subtool.method, subtool.shapeKey);
}

function renderLayersHome(){
  if (!layers.length){ const l = createLayer(); activeLayerId = l.id; }
  const active = activeLayer();
  setH2(active ? `${active.name} : ${active.shapes.length} shapes` : 'Tap Add for a layer');

  const toggleRow = `<div class="toggle-row2">
    <button class="${shapeMode==='2d'?'toggle-active':''}" data-mode="2d">2D</button>
    <button class="${shapeMode==='3d'?'toggle-active':''}" data-mode="3d">3D</button>
  </div>`;
  const addRect = `<button class="add-rect" id="addLayerTile">${svg('add')}Add</button>`;

  let layerTiles;
  if (active){
    layerTiles = `<div class="tile3 layer-active" data-layer="${active.id}">${svg('layers')}<span>${active.name}</span>
        <button class="tile-del" data-del="${active.id}">${svg('trash')}</button></div>`;
  } else {
    layerTiles = layers.map(l => `<div class="tile3" data-layer="${l.id}">${svg('layers')}<span>${l.name}</span>
        <button class="tile-del" data-del="${l.id}">${svg('trash')}</button></div>`).join('');
  }

  let shapeTiles = '';
  if (active && active.shapes.length){
    shapeTiles = active.shapes.map(s => `
      <div class="tile3" data-shape="${s.id}">${svg('shapes')}<span>${s.geomId}</span>
        <span class="tile-num">${s.num}</span>
      </div>`).join('');
  }

  menuScroll.innerHTML = `<div class="h3-stack">${toggleRow}${addRect}<div class="tile-row">${layerTiles}${shapeTiles}</div></div>`;

  menuScroll.querySelectorAll('[data-mode]').forEach(el => el.addEventListener('click', () => { shapeMode = el.dataset.mode; renderLayersHome(); }));
  document.getElementById('addLayerTile').addEventListener('click', () => {
    const l = createLayer(); activeLayerId = l.id; activeShapeId = null;
    goToLayer();
  });
  menuScroll.querySelectorAll('[data-layer]').forEach(el => el.addEventListener('click', (e) => {
    if (e.target.closest('[data-del]')) return;
    const id = parseInt(el.dataset.layer,10);
    if (activeLayerId===id) return;
    activeLayerId = id; activeShapeId = null;
    refreshShapeVisuals();
    goToLayer();
  }));
  menuScroll.querySelectorAll('[data-shape]').forEach(el => el.addEventListener('click', () => {
    activeShapeId = parseFloat(el.dataset.shape);
    refreshShapeVisuals();
    goToShape();
  }));
  wireLayerDelete();

  if (active && active.shapes.length===0){
    const addRow = document.createElement('div');
    addRow.className = 'tile-row';
    addRow.style.marginTop = '8px';
    addRow.innerHTML = (shapeMode==='3d'
      ? [...SHAPES_3D, ...SHAPES_3D_EXTRA].map(s => `<div class="tile3" data-add3d="${s.id}">${svg('shapes')}<span>${s.label}</span></div>`).join('')
      : [['freehand','Freehand'],['shapedrag','Shape Drag'],['p2p','P2P']].map(([id,l]) => `<div class="tile3" data-method="${id}">${svg('shapes')}<span>${l}</span></div>`).join('')
    );
    menuScroll.appendChild(addRow);
    addRow.querySelectorAll('[data-add3d]').forEach(el => el.addEventListener('click', () => {
      const def = [...SHAPES_3D, ...SHAPES_3D_EXTRA].find(s=>s.id===el.dataset.add3d);
      const rec = insertShape(active.id, def.id, def.fields);
      activeShapeId = rec.id;
      refreshShapeVisuals();
      showToast(`${def.label} added`);
      goToShape();
    }));
    addRow.querySelectorAll('[data-method]').forEach(el => el.addEventListener('click', () => goToDrawMethod(el.dataset.method)));
  }
}
/* extra 3D primitives, kept local to this file so data.js doesn't need editing */
const SHAPES_3D_EXTRA = [
  { id:'triangle', label:'Triangle', fields:{ D:30, H:15 } },
  { id:'octagon',  label:'Octagon',  fields:{ D:30, H:15 } },
  { id:'oval',     label:'Oval',     fields:{ D:30, H:15 } },
];
const DRAW_METHOD_LABEL = { freehand:'Freehand', shapedrag:'Shape Drag', p2p:'P2P' };
const DIVISIONS = {
  circle:    [['full','Full'],['half','Half'],['quarter','Quarter']],
  square:    [['full','Full'],['quarter','Quarter']],
  rectangle: [['full','Full'],['eighth','Eighth']],
  triangle:  [['full','Full'],['half','Half']],
  octagon:   [['full','Full'],['quarter','Quarter']],
  oval:      [['full','Full'],['half','Half']],
};
const LINE_TYPES = [['straight','Straight'],['arc','Arc'],['wave','Wave']];
function goToDrawMethod(method){
  const l = activeLayer();
  crumbs = ['Layers', l.name, DRAW_METHOD_LABEL[method]];
  crumbBack = () => goToLayer();
  render('drawMethod', method);
}
function goToDrawShapePick(method){
  const l = activeLayer();
  crumbs = ['Layers', l.name, DRAW_METHOD_LABEL[method]];
  crumbBack = () => goToDrawMethod(method);
  render('drawShapePick', method);
}
function goToDrawDivisionPick(method, shapeKey){
  const l = activeLayer();
  crumbs = ['Layers', l.name, DRAW_METHOD_LABEL[method], shapeKey[0].toUpperCase()+shapeKey.slice(1)];
  crumbBack = () => goToDrawShapePick(method);
  render('drawDivisionPick', {method, shapeKey});
}
function renderDrawMethod(method){
  if (method==='freehand'){
    setH2('Drag one finger on the plate to trace a line');
    menuScroll.innerHTML = `<div style="padding:14px 6px;color:var(--muted);font-size:11px;text-align:center;max-width:220px;">Freehand tracing isn\u2019t wired up yet \u2014 next build.</div>`;
    return;
  }
  if (method==='p2p'){
    setH2('Tap points on the plate; pick how they connect');
    menuScroll.innerHTML = `<div class="tile-row">${LINE_TYPES.map(([id,label]) => `<div class="tile3" data-line="${id}">${svg('shapes')}<span>${label}</span></div>`).join('')}</div>
      <div style="padding:10px 6px;color:var(--muted);font-size:10.5px;text-align:center;max-width:220px;">Point placement on the plate isn\u2019t wired up yet \u2014 next build. This picks which connector each segment will use once it is.</div>`;
    menuScroll.querySelectorAll('[data-line]').forEach(el => el.addEventListener('click', () => {
      showToast(`${el.dataset.line} connector selected \u2014 point placement itself is next build`);
    }));
    return;
  }
  goToDrawShapePick(method); // shapedrag
}
function renderDrawShapePick(method){
  setH2('Pick a shape to divide, or use it whole');
  menuScroll.innerHTML = `<div class="tile-row">${Object.keys(DIVISIONS).map(k => `<div class="tile3" data-dshape="${k}">${svg('shapes')}<span>${k[0].toUpperCase()+k.slice(1)}</span></div>`).join('')}</div>`;
  menuScroll.querySelectorAll('[data-dshape]').forEach(el => el.addEventListener('click', () => goToDrawDivisionPick(method, el.dataset.dshape)));
}
function renderDrawDivisionPick(method, shapeKey){
  setH2('Press and drag on the plate to size it');
  const divs = DIVISIONS[shapeKey] || [['full','Full']];
  menuScroll.innerHTML = `<div class="tile-row">${divs.map(([id,label]) => `<div class="tile3" data-div="${id}">${svg('shapes')}<span>${label}</span></div>`).join('')}</div>`;
  menuScroll.querySelectorAll('[data-div]').forEach(el => el.addEventListener('click', () => {
    if (el.dataset.div !== 'full'){
      showToast(`${shapeKey} (${el.dataset.div}) isn\u2019t wired up yet \u2014 next build. Try Full \u2014 that one\u2019s live.`);
      return;
    }
    startDragToSize(shapeKey);
  }));
}

/* =====================================================================
   SHAPE DRAG — real press/drag/release sizing on the plate, "Full" only
   ===================================================================== */
const dragGroundPlane = new THREE.Plane(new THREE.Vector3(0,1,0), 0);
function plateHit(clientX, clientY){
  const rect = canvas.getBoundingClientRect();
  ndc.x = ((clientX-rect.left)/rect.width)*2-1;
  ndc.y = -((clientY-rect.top)/rect.height)*2+1;
  raycaster.setFromCamera(ndc, camera);
  const pt = new THREE.Vector3();
  raycaster.ray.intersectPlane(dragGroundPlane, pt);
  return pt;
}
function buildDragGeometry(shapeKey, sizeMM){
  const H = 15;
  if (shapeKey==='circle')    return new THREE.SphereGeometry(sizeMM/2, 32, 24);
  if (shapeKey==='square')    return new THREE.BoxGeometry(sizeMM, sizeMM, sizeMM);
  if (shapeKey==='rectangle') return new THREE.BoxGeometry(sizeMM, H, sizeMM*0.5);
  if (shapeKey==='triangle')  return new THREE.CylinderGeometry(sizeMM/2, sizeMM/2, H, 3);
  if (shapeKey==='octagon')   return new THREE.CylinderGeometry(sizeMM/2, sizeMM/2, H, 8);
  if (shapeKey==='oval'){ const g = new THREE.SphereGeometry(sizeMM/2, 32, 24); g.scale(1,0.6,1); return g; }
  return new THREE.BoxGeometry(sizeMM, H, sizeMM);
}
function startDragToSize(shapeKey){
  setH2('Press on the plate, drag out to size, release to place');
  menuScroll.innerHTML = `<div style="padding:14px 6px;color:var(--muted);font-size:11px;text-align:center;max-width:220px;">Dragging on the plate now sizes the ${shapeKey}\u2026</div>`;

  let startPt = null, previewMesh = null;
  function onDown(e){
    startPt = plateHit(e.clientX, e.clientY);
    rotationLocked = true; controls.enableRotate = false; refreshLockBtn();
  }
  function onMove(e){
    if (!startPt) return;
    const cur = plateHit(e.clientX, e.clientY);
    const size = Math.max(2.5, startPt.distanceTo(cur));
    if (previewMesh){ scene.remove(previewMesh); previewMesh.geometry.dispose(); }
    previewMesh = new THREE.Mesh(buildDragGeometry(shapeKey, size), new THREE.MeshStandardMaterial({ color:0xe0c48f, transparent:true, opacity:0.55 }));
    previewMesh.position.set((startPt.x+cur.x)/2, 0, (startPt.z+cur.z)/2);
    clampToPlate(previewMesh, false);
    scene.add(previewMesh);
  }
  function onUp(e){
    if (!startPt){ cleanup(); return; }
    const cur = plateHit(e.clientX, e.clientY);
    let size = Math.max(2.5, startPt.distanceTo(cur));
    size = Math.round(size / GRID_SQUARE) * GRID_SQUARE; // snap to nearest grid line
    if (previewMesh){ scene.remove(previewMesh); previewMesh.geometry.dispose(); previewMesh=null; }
    const active = activeLayer();
    const mesh = new THREE.Mesh(buildDragGeometry(shapeKey, size), new THREE.MeshStandardMaterial({ color:SWATCHES[0], metalness:0.15, roughness:0.55 }));
    mesh.position.set((startPt.x+cur.x)/2, 0, (startPt.z+cur.z)/2);
    clampToPlate(mesh, false);
    attachOutline(mesh);
    scene.add(mesh);
    const rec = { id: Date.now()+Math.random(), num: active.shapes.length+1, mesh, geomId:shapeKey, fields:{ size }, color: SWATCHES[0] };
    active.shapes.push(rec);
    activeShapeId = rec.id;
    refreshShapeVisuals();
    showToast(`${shapeKey} placed at ${size}mm`);
    cleanup();
    goToShape();
  }
  function cleanup(){
    canvas.removeEventListener('pointerdown', onDown);
    canvas.removeEventListener('pointermove', onMove);
    canvas.removeEventListener('pointerup', onUp);
  }
  canvas.addEventListener('pointerdown', onDown);
  canvas.addEventListener('pointermove', onMove);
  canvas.addEventListener('pointerup', onUp);
}
function wireLayerDelete(){
  let armedId = null, armTimer = null;
  menuScroll.querySelectorAll('[data-del]').forEach(btn => btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const id = parseInt(btn.dataset.del,10);
    if (armedId !== id){
      menuScroll.querySelectorAll('.tile-del').forEach(b=>b.classList.remove('armed'));
      armedId = id; btn.classList.add('armed');
      clearTimeout(armTimer);
      armTimer = setTimeout(() => { armedId=null; btn.classList.remove('armed'); }, 3000);
    } else {
      clearTimeout(armTimer);
      showConfirm('Delete this layer?', () => { deleteLayer(id); goToLayersHome(); });
    }
  }));
}

/* ---- SHAPE PANEL ---- */
const ACTIONS = [
  { id:'select', label:'Select', icon:'select' },
  { id:'move',   label:'Move',   icon:'move' },
  { id:'scale',  label:'Scale',  icon:'scale' },
  { id:'color',  label:'Color',  icon:'color' },
  { id:'delete', label:'Delete', icon:'trash' },
];
function renderShapePanel(subtool){
  const l = activeLayer(), s = activeShape();
  if (!l || !s){ goToLayersHome(); return; }
  setH2('');
  menuScroll.innerHTML = `
    <div class="tile-row"><div class="tile3 layer-active">${svg('shapes')}<span>${shapeLabel(s)}</span></div></div>
    <div class="action-col" style="margin-top:8px;">
      ${ACTIONS.map(a => `<button data-action="${a.id}" class="${a.id===subtool?'active':''}">${svg(a.icon)}<span>${a.label}</span></button>`).join('')}
    </div>
    <div id="subtoolSlot" style="margin-top:8px;"></div>
  `;
  menuScroll.querySelectorAll('[data-action]').forEach(b => b.addEventListener('click', () => {
    const id = b.dataset.action;
    if (id==='delete'){ deleteShape(l.id, s.id); goToLayer(); showToast('Shape deleted'); return; }
    if (id==='select'){ showToast('Tap any shape on the plate to select it \u2014 crosshair mode coming soon'); return; }
    goToSubtool(id[0].toUpperCase()+id.slice(1));
  }));
  if (subtool) fillSubtool(subtool, l, s);
}
function fillSubtool(tool, l, s){
  const slot = document.getElementById('subtoolSlot');
  if (tool==='move'){
    slot.innerHTML = `<div class="stepper-stack">${stepperRow('X', s.mesh.position.x, -half, half)}${stepperRow('Y', s.mesh.position.y, 0, PLATE_SIZE)}${stepperRow('Z', s.mesh.position.z, -half, half)}</div>`;
    wireSteppers(slot, ['X','Y','Z'], (axis,val) => {
      if (axis==='X') s.mesh.position.x = val;
      if (axis==='Y') s.mesh.position.y = Math.max(0, val);
      if (axis==='Z') s.mesh.position.z = val;
      clampToPlate(s.mesh, true);
      fillSubtool('move', l, s);
    });
  } else if (tool==='scale'){
    slot.innerHTML = `<div class="stepper-stack">${allAxisStepper()}${stepperRow('X', s.mesh.scale.x, 0.1, 10)}${stepperRow('Y', s.mesh.scale.y, 0.1, 10)}${stepperRow('Z', s.mesh.scale.z, 0.1, 10)}</div>`;
    wireSteppers(slot, ['X','Y','Z'], (axis,val) => {
      if (axis==='X') s.mesh.scale.x = val; if (axis==='Y') s.mesh.scale.y = val; if (axis==='Z') s.mesh.scale.z = val;
      clampToPlate(s.mesh, true);
      fillSubtool('scale', l, s);
    });
    slot.querySelector('.all-axes').querySelectorAll('[data-step]').forEach(btn => btn.addEventListener('click', () => {
      const d = parseFloat(btn.dataset.step) * 0.1;
      s.mesh.scale.x = Math.min(10, Math.max(0.1, s.mesh.scale.x + d));
      s.mesh.scale.y = Math.min(10, Math.max(0.1, s.mesh.scale.y + d));
      s.mesh.scale.z = Math.min(10, Math.max(0.1, s.mesh.scale.z + d));
      clampToPlate(s.mesh, true);
      fillSubtool('scale', l, s);
    }));
  } else if (tool==='color'){
    slot.innerHTML = `<div class="swatch-row">${SWATCHES.map(c=>`<div class="swatch ${s.color===c?'selected':''}" data-c="${c}" style="background:${c}"></div>`).join('')}</div>`;
    slot.querySelectorAll('[data-c]').forEach(sw => sw.addEventListener('click', () => { s.color = sw.dataset.c; refreshShapeVisuals(); fillSubtool('color', l, s); }));
  }
}
function allAxisStepper(){
  return `<div class="stepper-row all-axes"><span class="step-lbl">All</span><button data-step="-1">\u2212</button><input type="text" value="X/Y/Z" readonly><button data-step="1">+</button></div>`;
}
function stepperRow(axis, val, min, max){
  return `<div class="stepper-row" data-axis="${axis}"><span class="step-lbl">${axis}</span><button data-step="-1">\u2212</button><input type="number" value="${val.toFixed(2)}" data-min="${min}" data-max="${max}"><button data-step="1">+</button></div>`;
}
function wireSteppers(scope, axes, onChange){
  axes.forEach(axis => {
    const row = scope.querySelector(`.stepper-row[data-axis="${axis}"]`); if (!row) return;
    const input = row.querySelector('input');
    const min = parseFloat(input.dataset.min), max = parseFloat(input.dataset.max);
    row.querySelectorAll('[data-step]').forEach(btn => btn.addEventListener('click', () => {
      const stepSize = max>50 ? GRID_SQUARE : 0.1;
      let v = Math.min(max, Math.max(min, parseFloat(input.value) + parseFloat(btn.dataset.step)*stepSize));
      onChange(axis, v);
    }));
    input.addEventListener('change', () => { onChange(axis, Math.min(max, Math.max(min, parseFloat(input.value)||0))); });
  });
}

/* ---- TOOLS: Boolean, Select ---- */
function renderToolsHome(){
  setH2('Boolean and selection helpers');
  const totalShapes = layers.reduce((n,l)=>n+l.shapes.length,0);
  menuScroll.innerHTML = `<div class="tile-row">
    <div class="tile3" data-t="select">${svg('select')}<span>Select</span></div>
    <div class="tile3" data-t="boolean" style="${totalShapes<2?'opacity:0.4':''}">${svg('boolean')}<span>Boolean</span></div>
  </div>`;
  menuScroll.querySelector('[data-t="select"]').addEventListener('click', () => showToast('Tap any shape on the plate to select it \u2014 crosshair mode coming soon'));
  menuScroll.querySelector('[data-t="boolean"]').addEventListener('click', () => {
    if (!activeShape()){ showToast('Select a shape first (via Layers), then open Boolean'); return; }
    crumbs = ['Tools','Boolean']; crumbBack = () => goToTools();
    render('booleanPick');
  });
}
function renderBooleanPick(){
  const s = activeShape();
  if (!s){ goToTools(); return; }
  setH2('Pick a second shape, then an operation');
  const others = [];
  layers.forEach(l => l.shapes.forEach(sh => { if (!(l.id===activeLayerId && sh.id===activeShapeId)) others.push({l,sh}); }));
  let targetId = null;
  menuScroll.innerHTML = `<div class="tile-row">${others.map(o => `<div class="tile3" data-target="${o.l.id}:${o.sh.id}">${svg('shapes')}<span>${shapeLabel(o.sh)}</span></div>`).join('')}</div>
    <div class="action-col" style="margin-top:8px;">
      <button data-op="union" disabled>${svg('boolean')}<span>Union</span></button>
      <button data-op="subtract" disabled>${svg('boolean')}<span>Subtract</span></button>
      <button data-op="intersect" disabled>${svg('boolean')}<span>Intersect</span></button>
    </div>`;
  menuScroll.querySelectorAll('[data-target]').forEach(b => b.addEventListener('click', () => {
    targetId = b.dataset.target;
    menuScroll.querySelectorAll('[data-target]').forEach(x=>x.classList.remove('layer-active'));
    b.classList.add('layer-active');
    menuScroll.querySelectorAll('[data-op]').forEach(x=>x.disabled=false);
  }));
  menuScroll.querySelectorAll('[data-op]').forEach(b => b.addEventListener('click', () => {
    if (!targetId) return;
    const parts = targetId.split(':');
    runBoolean(b.dataset.op, parseInt(parts[0],10), parseFloat(parts[1]));
  }));
}
async function runBoolean(mode, targetLayerId, targetShapeId){
  const a = activeShape(), aLayer = activeLayer();
  const bLayer = findLayer(targetLayerId), b = bLayer ? bLayer.shapes.find(s=>s.id===targetShapeId) : null;
  if (!a || !b) return;
  try{
    const { Evaluator, Brush, ADDITION, SUBTRACTION, INTERSECTION } = await import('https://unpkg.com/three-bvh-csg@0.0.16/build/index.module.js');
    const opMap = { union:ADDITION, subtract:SUBTRACTION, intersect:INTERSECTION };
    a.mesh.updateMatrixWorld(); b.mesh.updateMatrixWorld();
    const brushA = new Brush(a.mesh.geometry.clone()); brushA.position.copy(a.mesh.position); brushA.scale.copy(a.mesh.scale); brushA.updateMatrixWorld();
    const brushB = new Brush(b.mesh.geometry.clone()); brushB.position.copy(b.mesh.position); brushB.scale.copy(b.mesh.scale); brushB.updateMatrixWorld();
    const evaluator = new Evaluator();
    const result = evaluator.evaluate(brushA, brushB, opMap[mode]);
    result.geometry.computeVertexNormals();
    const color = a.color;
    const mesh = new THREE.Mesh(result.geometry, new THREE.MeshStandardMaterial({ color, metalness:0.15, roughness:0.55 }));
    clampToPlate(mesh, false);
    attachOutline(mesh);
    scene.add(mesh);
    const rec = { id: Date.now()+Math.random(), num: aLayer.shapes.length, mesh, geomId:'solid', fields:null, color };
    deleteShape(aLayer.id, a.id);
    deleteShape(bLayer.id, b.id);
    aLayer.shapes.push(rec);
    aLayer.shapes.forEach((s2,i)=>s2.num=i+1);
    activeLayerId = aLayer.id; activeShapeId = rec.id;
    refreshShapeVisuals();
    showToast(`${mode[0].toUpperCase()+mode.slice(1)} created`);
    activeModule = 'layers'; renderH1();
    goToShape();
  } catch(err){
    console.error(err);
    showToast('Boolean tool could not load \u2014 check your connection and try again');
  }
}

/* ---- SETTINGS ---- */
function renderSettings(){
  setH2(`Plate fixed at ${PLATE_SIZE}\u00d7${PLATE_SIZE}mm, ${GRID_SQUARE}mm grid`);
  menuScroll.innerHTML = `<div class="tile-row">
    <div class="tile3" id="saveBtn">${svg('settings')}<span>Save</span></div>
    <div class="tile3" id="loadBtn">${svg('settings')}<span>Load</span></div>
    <div class="tile3" id="stlBtn">${svg('settings')}<span>Export STL</span></div>
  </div>`;
  document.getElementById('saveBtn').addEventListener('click', () => { saveSceneJSON(); showToast('Scene saved'); });
  document.getElementById('loadBtn').addEventListener('click', () => showToast('Load Scene is coming in a future update'));
  document.getElementById('stlBtn').addEventListener('click', () => { exportSTL(); showToast('STL exported'); });
}
function renderHelp(){
  setH2('Every module in the app');
  menuScroll.innerHTML = `<div class="tile-row">${MODULES.filter(m=>MODULE_ORDER.includes(m.id)).map(m => `<div class="tile3" style="opacity:0.6">${svg(m.icon)}<span>${m.label}</span></div>`).join('')}</div>`;
}

/* =====================================================================
   CONFIRM POPUP
   ===================================================================== */
const confirmOverlay = document.createElement('div');
confirmOverlay.id = 'confirmOverlay'; confirmOverlay.classList.add('hidden');
confirmOverlay.innerHTML = `<div class="confirm-box"><p id="confirmMsg"></p><div class="confirm-row"><button class="confirm-no" id="confirmNo">No</button><button class="confirm-yes" id="confirmYes">Yes</button></div></div>`;
document.getElementById('main').appendChild(confirmOverlay);
function showConfirm(msg, onYes){
  document.getElementById('confirmMsg').textContent = msg;
  confirmOverlay.classList.remove('hidden');
  const yes = document.getElementById('confirmYes'), no = document.getElementById('confirmNo');
  const cleanup = () => { confirmOverlay.classList.add('hidden'); yes.replaceWith(yes.cloneNode(true)); no.replaceWith(no.cloneNode(true)); };
  document.getElementById('confirmYes').addEventListener('click', () => { cleanup(); onYes(); });
  document.getElementById('confirmNo').addEventListener('click', cleanup);
}

/* =====================================================================
   EXPORT
   ===================================================================== */
function exportSTL(){
  const meshes = []; layers.forEach(l=>l.shapes.forEach(s=>meshes.push(s.mesh)));
  if (!meshes.length){ showToast('Nothing to export'); return; }
  const group = new THREE.Group();
  meshes.forEach(m => { const c = m.clone(); c.remove(...c.children); group.add(c); });
  const exporter = new STLExporter();
  const result = exporter.parse(group, { binary:true });
  downloadBlob(new Blob([result], {type:'application/octet-stream'}), 'stl-maker-model.stl');
}
function saveSceneJSON(){
  const data = layers.map(l => ({ name:l.name, shapes: l.shapes.map(s => ({ geomId:s.geomId, fields:s.fields, color:s.color, position:s.mesh.position.toArray(), scale:s.mesh.scale.toArray() })) }));
  downloadBlob(new Blob([JSON.stringify(data, null, 2)], {type:'application/json'}), 'stl-maker-scene.json');
}
function downloadBlob(blob, filename){
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = filename;
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  setTimeout(()=>URL.revokeObjectURL(url), 2000);
}

/* =====================================================================
   TOAST
   ===================================================================== */
let toastTimer = null;
function showToast(msg){
  const t = document.getElementById('toast');
  t.textContent = msg; t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(()=>t.classList.remove('show'), 1800);
}

/* =====================================================================
   INIT
   ===================================================================== */
renderH1();
goToLayersHome();
