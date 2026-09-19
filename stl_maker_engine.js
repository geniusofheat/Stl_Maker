import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { STLExporter } from 'three/addons/exporters/STLExporter.js';
import { ICONS, MODULES, SHAPES_3D, SWATCHES } from './stl_maker_data.js';

/* =====================================================================
   INJECTED STYLES — kept in this one file on purpose (single-file build)
   ===================================================================== */
const style = document.createElement('style');
style.textContent = `
.module-btn.active-blue{ background:#3a6fd8 !important; border-color:#3a6fd8 !important; color:#fff !important; }
.module-btn.active-blue svg{ color:#fff !important; }
.stepper-row{ display:flex; align-items:center; gap:6px; }
.stepper-row .step-lbl{ width:16px; font-family:'JetBrains Mono',monospace; font-size:11px; color:var(--gold); flex:0 0 auto; }
.stepper-row button{ width:32px; height:32px; flex:0 0 auto; background:var(--navy-3); border:1px solid var(--line); border-radius:7px; color:var(--gold-light); font-size:17px; font-weight:700; }
.stepper-row button:active{ background:var(--gold); color:var(--navy); }
.stepper-row input{ flex:1; min-width:0; background:#fff; color:#111; border:1px solid var(--line); border-radius:7px; font-family:'JetBrains Mono',monospace; font-size:12px; padding:6px 4px; text-align:center; }
.stepper-row.all-axes .step-lbl{ width:auto; font-size:9.5px; text-transform:uppercase; letter-spacing:0.04em; }
.pinned-tile{ display:flex; align-items:center; gap:8px; background:var(--navy-4); border:1px solid var(--gold); border-radius:10px; padding:8px; position:relative; }
.pinned-tile .swatch-fill{ width:28px; height:28px; border-radius:6px; flex:0 0 auto; }
.pinned-tile .pt-label{ font-size:11.5px; font-weight:700; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; display:none; }
#slideMenu.expanded .pinned-tile .pt-label{ display:block; }
.action-col{ display:flex; flex-direction:column; gap:6px; }
.action-col button{ display:flex; flex-direction:row; align-items:center; gap:10px; background:var(--navy-3); border:1px solid var(--line); border-radius:9px; color:var(--ink); padding:12px 10px; }
.action-col button svg{ width:20px; height:20px; color:var(--gold-light); flex:0 0 auto; }
.action-col button span{ font-size:12px; font-weight:600; display:block !important; }
.action-col button.active{ border-color:var(--gold); background:var(--navy-4); }
.shape-tile-wrap{ position:relative; }
.shape-num{ position:absolute; top:3px; right:5px; font-size:9px; font-weight:700; color:var(--gold-light); }
.layer-tile-wrap{ position:relative; }
.layer-del{ position:absolute; top:3px; right:3px; width:20px; height:20px; border-radius:5px; background:var(--navy); border:1px solid var(--line); color:var(--muted); display:flex; align-items:center; justify-content:center; z-index:2; }
.layer-del svg{ width:12px; height:12px; }
.layer-del.armed{ background:var(--danger); color:#fff; border-color:var(--danger); }
#lockBtn, #mmBtn{ position:absolute; top:10px; z-index:6; height:38px; background:rgba(32,33,58,0.9); border:1px solid var(--line); border-radius:9px; color:var(--gold-light); display:flex; align-items:center; justify-content:center; }
#lockBtn{ right:10px; width:38px; }
#lockBtn svg{ width:18px; height:18px; }
#lockBtn.unlocked{ color:var(--muted); }
#mmBtn{ left:10px; padding:0 10px; font-family:'JetBrains Mono',monospace; font-size:11px; font-weight:700; gap:5px; }
#mmBtn .seg{ opacity:0.4; }
#mmBtn .seg.on{ opacity:1; color:#fff; }
#mmBtn .sep{ opacity:0.3; }
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
  crosshair: '<circle cx="12" cy="12" r="7"/><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/>',
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

/* ---- axis indicator arrows, placed outside the plate boundary ---- */
const axisOrigin = new THREE.Vector3(-half-4, 0.1, -half-4);
scene.add(new THREE.ArrowHelper(new THREE.Vector3(1,0,0), axisOrigin, 18, 0xd9534f, 4, 3));   // X — red
scene.add(new THREE.ArrowHelper(new THREE.Vector3(0,0,1), axisOrigin, 18, 0x4a90d9, 4, 3));   // Z — blue
scene.add(new THREE.ArrowHelper(new THREE.Vector3(0,1,0), axisOrigin, 18, 0x5cb85c, 4, 3));   // Y (height) — green

/* ---- mm number labels along X and Z edges, toggleable, sprite-based ---- */
function makeLabelSprite(text){
  const cvs = document.createElement('canvas'); cvs.width = 64; cvs.height = 32;
  const ctx = cvs.getContext('2d');
  ctx.fillStyle = '#e0c48f'; ctx.font = 'bold 22px monospace'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(text, 32, 16);
  const tex = new THREE.CanvasTexture(cvs);
  const mat = new THREE.SpriteMaterial({ map:tex, depthTest:false });
  const spr = new THREE.Sprite(mat);
  spr.scale.set(6,3,1);
  return spr;
}
let mmLabelGroup = null;
function buildMmLabels(step){
  if (mmLabelGroup) { scene.remove(mmLabelGroup); }
  mmLabelGroup = new THREE.Group();
  for (let v=0; v<=PLATE_SIZE; v+=step){
    const sx = makeLabelSprite(String(v));
    sx.position.set(-half+v, 0.2, half+5);
    mmLabelGroup.add(sx);
    const sz = makeLabelSprite(String(v));
    sz.position.set(-half-5, 0.2, -half+v);
    mmLabelGroup.add(sz);
  }
  mmLabelGroup.visible = false;
  scene.add(mmLabelGroup);
}
buildMmLabels(5);
let mmState = 'off'; // 'off' | '5' | '2.5'
const mmBtn = document.createElement('button');
mmBtn.id = 'mmBtn';
document.getElementById('plate').appendChild(mmBtn);
function refreshMmBtn(){
  mmBtn.innerHTML = `<span class="seg ${mmState==='5'?'on':''}">5</span><span class="sep">|</span><span class="seg ${mmState==='2.5'?'on':''}">2.5</span>`;
}
mmBtn.addEventListener('click', () => {
  mmState = mmState==='off' ? '5' : mmState==='5' ? '2.5' : 'off';
  if (mmState==='off'){ mmLabelGroup.visible = false; }
  else { buildMmLabels(mmState==='5' ? 5 : 2.5); mmLabelGroup.visible = true; }
  refreshMmBtn();
});
refreshMmBtn();

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; controls.dampingFactor = 0.08;
controls.target.set(0,10,0); controls.update();

/* manual rotation lock — defaults LOCKED on load */
let rotationLocked = true;
controls.enableRotate = !rotationLocked;
const lockBtn = document.createElement('button');
lockBtn.id = 'lockBtn';
document.getElementById('plate').appendChild(lockBtn);
function refreshLockBtn(){
  lockBtn.innerHTML = svg(rotationLocked ? 'lock' : 'unlock');
  lockBtn.classList.toggle('unlocked', !rotationLocked);
}
lockBtn.addEventListener('click', () => { rotationLocked = !rotationLocked; controls.enableRotate = !rotationLocked; refreshLockBtn(); });
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
   DATA MODEL — layers hold many shapes
   ===================================================================== */
const layers = [];
let nextLayerId = 1;
let activeLayerId = null;
let activeShapeId = null;
const GRAY = 0x777788;

function findLayer(id){ return layers.find(l=>l.id===id); }
function activeLayer(){ return findLayer(activeLayerId); }
function activeShape(){ const l=activeLayer(); return l ? l.shapes.find(s=>s.id===activeShapeId) : null; }

function createLayer(){
  const l = { id: nextLayerId++, name:`Layer ${layers.length+1}`, shapes:[] };
  layers.push(l);
  return l;
}
function refreshShapeVisuals(){
  layers.forEach(l => l.shapes.forEach(s => {
    const active = (l.id===activeLayerId && s.id===activeShapeId);
    s.mesh.material.color.set(active ? s.color : GRAY);
    if (s.mesh.userData.outline) s.mesh.userData.outline.visible = !active;
  }));
}

/* =====================================================================
   GEOMETRY / CLAMP
   ===================================================================== */
function buildGeometry(shapeId, fields){
  if (shapeId==='circle')    return new THREE.SphereGeometry(fields.D/2, 32, 24);
  if (shapeId==='square')    return new THREE.BoxGeometry(fields.W, fields.W, fields.W);
  if (shapeId==='rectangle') return new THREE.BoxGeometry(fields.L, fields.H, fields.W);
  if (shapeId==='cylinder')  return new THREE.CylinderGeometry(fields.D/2, fields.D/2, fields.H, 32);
  if (shapeId==='cone')      return new THREE.ConeGeometry(fields.D/2, fields.H, 32);
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
  mesh.add(edges);
  mesh.userData.outline = edges;
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
  const idx = layers.indexOf(l);
  layers.splice(idx,1);
  layers.forEach((l2,i)=>l2.name=`Layer ${i+1}`);
  if (activeLayerId===layerId){ activeLayerId=null; activeShapeId=null; }
}

/* raycaster tap-to-select on the plate */
const raycaster = new THREE.Raycaster(), ndc = new THREE.Vector2();
canvas.addEventListener('pointerup', (e) => {
  const rect = canvas.getBoundingClientRect();
  ndc.x = ((e.clientX-rect.left)/rect.width)*2-1;
  ndc.y = -((e.clientY-rect.top)/rect.height)*2+1;
  raycaster.setFromCamera(ndc, camera);
  const all = [];
  layers.forEach(l => l.shapes.forEach(s => all.push({l,s})));
  const hits = raycaster.intersectObjects(all.map(x=>x.s.mesh), false);
  if (hits.length){
    const hit = all.find(x => x.s.mesh === hits[0].object);
    activeLayerId = hit.l.id; activeShapeId = hit.s.id;
    refreshShapeVisuals();
    resetView('tools', 'shapePanel', shapeLabel(hit.s));
  }
});
function shapeLabel(s){ return `${s.geomId[0].toUpperCase()+s.geomId.slice(1)} #${s.num}`; }

/* =====================================================================
   H1 — MODULES (View intentionally excluded — replaced by the lock button)
   ===================================================================== */
const h1 = document.getElementById('h1');
const MODULE_ORDER = ['tools','layers','settings','help'];
let activeModule = 'tools';
function renderH1(){
  const mods = MODULE_ORDER.map(id => MODULES.find(m=>m.id===id)).filter(Boolean);
  h1.innerHTML = mods.map(m => `<button class="module-btn ${m.id===activeModule?'active-blue':''}" data-module="${m.id}">${svg(m.icon)}<span>${m.label}</span></button>`).join('');
  h1.querySelectorAll('[data-module]').forEach(btn => btn.addEventListener('click', () => {
    const id = btn.dataset.module;
    if (id==='tools') resetView('tools', 'home');
    else if (id==='layers') resetView('layers', 'layersList', 'Layers');
    else if (id==='settings') resetView('settings', 'settings', 'Settings');
    else if (id==='help') resetView('help', 'help', 'Help');
  }));
}

/* =====================================================================
   H2 — breadcrumb path + Undo/Redo
   ===================================================================== */
const h2Title = document.getElementById('h2Title'), h2Info = document.getElementById('h2Info');
const btnUndo = document.getElementById('btnUndo'), btnRedo = document.getElementById('btnRedo');
btnUndo.innerHTML = svg('undo') + '<span>Undo</span>';
btnRedo.innerHTML = svg('redo') + '<span>Redo</span>';
btnUndo.disabled = true; btnRedo.disabled = true; // history not wired in this pass

/* viewStack entries: {v, label} — label is what shows in the h2 breadcrumb */
let viewStack = [];
function resetView(mod, v, label){
  activeModule = mod;
  viewStack = [{v, label}];
  renderH1();
  render();
}
function pushView(v, label){ viewStack.push({v, label}); render(); }
function backView(){ if (viewStack.length>1) viewStack.pop(); render(); }
function topView(){ return viewStack[viewStack.length-1]; }
function replaceTop(v, label){ viewStack[viewStack.length-1] = {v, label}; render(); }

let h2BackAttached = false;
function ensureH2Back(){
  if (h2BackAttached) return;
  const wrap = h2Title.parentElement.parentElement; // #h2
  const backBtn = document.createElement('button');
  backBtn.id = 'h2Back';
  backBtn.style.cssText = 'background:none;border:none;color:var(--gold-light);width:26px;height:26px;display:flex;align-items:center;justify-content:center;flex:0 0 auto;';
  backBtn.innerHTML = svg('back');
  backBtn.addEventListener('click', backView);
  wrap.insertBefore(backBtn, wrap.firstChild);
  h2BackAttached = true;
}
ensureH2Back();
function renderH2(info){
  document.getElementById('h2Back').style.display = viewStack.length>1 ? 'flex' : 'none';
  h2Title.textContent = viewStack.map(x=>x.label).join(' - ');
  h2Info.textContent = info || '';
}

const menuScroll = document.getElementById('menuScroll');
const slideMenu = document.getElementById('slideMenu');
document.getElementById('expandTab').innerHTML = svg('back');
document.getElementById('expandTab').addEventListener('click', () => slideMenu.classList.toggle('expanded'));

/* =====================================================================
   RENDER DISPATCH
   ===================================================================== */
function render(){
  slideMenu.classList.add('open');
  const t = topView();
  if (t.v==='home') renderHome();
  else if (t.v==='addShapeFlow') renderAddShapeFlow();
  else if (t.v==='shapePanel') renderShapePanel();
  else if (t.v==='subtool') renderSubtool(t.tool);
  else if (t.v==='layersList') renderLayersList();
  else if (t.v==='booleanPick') renderBooleanPick();
  else if (t.v==='settings') renderSettings();
  else if (t.v==='help') renderHelp();
  else if (t.v==='drawMethod') renderDrawMethod(t.method);
  else if (t.v==='drawShapePick') renderDrawShapePick(t.method);
  else if (t.v==='drawDivisionPick') renderDrawDivisionPick(t.method, t.shape);
}

/* ---- HOME: content of the active layer ---- */
function renderHome(){
  let l = activeLayer();
  if (!l){ l = createLayer(); activeLayerId = l.id; }
  if (!l.shapes.length){
    replaceTop('addShapeFlow', shapeMode==='2d' ? '2D' : '3D');
    renderAddShapeFlow();
    return;
  }
  renderH2(`Tap a shape to select it`);
  h2Title.textContent = `${l.name} : ${l.shapes.length} shapes`;
  document.getElementById('h2Back').style.display = 'none';
  menuScroll.innerHTML = l.shapes.map(s => `
    <div class="tile shape-tile-wrap" data-shape="${s.id}">
      ${svg('shapes')}<span>${s.geomId}</span>
      <span class="shape-num">#${s.num}</span>
    </div>`).join('');
  menuScroll.querySelectorAll('[data-shape]').forEach(el => el.addEventListener('click', () => {
    activeShapeId = parseFloat(el.dataset.shape);
    refreshShapeVisuals();
    pushView('shapePanel', shapeLabel(l.shapes.find(s=>s.id===activeShapeId)));
  }));
}

/* ---- ADD SHAPE FLOW: 2D (default) / 3D toggle ---- */
let shapeMode = '2d';
function renderAddShapeFlow(){
  replaceTop('addShapeFlow', shapeMode==='2d' ? '2D' : '3D');
  renderH2(shapeMode==='2d' ? 'Sketch tools' : 'Tap a shape to add it');
  const toggle = `<div class="toggle-row">
    <button class="toggle-btn ${shapeMode==='2d'?'active':''}" data-mode="2d">2D</button>
    <button class="toggle-btn ${shapeMode==='3d'?'active':''}" data-mode="3d">3D</button>
  </div>`;
  let list;
  if (shapeMode==='3d'){
    list = SHAPES_3D.map(s => `<button class="tile" data-shape3d="${s.id}">${svg('shapes')}<span>${s.label}</span></button>`).join('');
  } else {
    list = [['freehand','Freehand'],['shapedrag','Shape Drag'],['p2p','P2P']]
      .map(([id,label]) => `<button class="tile" data-method="${id}">${svg('shapes')}<span>${label}</span></button>`).join('');
  }
  menuScroll.innerHTML = toggle + list;
  menuScroll.querySelectorAll('[data-mode]').forEach(b => b.addEventListener('click', () => { shapeMode=b.dataset.mode; renderAddShapeFlow(); }));
  menuScroll.querySelectorAll('[data-shape3d]').forEach(b => b.addEventListener('click', () => {
    const def = SHAPES_3D.find(s=>s.id===b.dataset.shape3d);
    const l = activeLayer();
    const rec = insertShape(l.id, def.id, def.fields);
    activeShapeId = rec.id;
    refreshShapeVisuals();
    showToast(`${def.label} added`);
    resetView('tools', 'shapePanel', shapeLabel(rec));
  }));
  menuScroll.querySelectorAll('[data-method]').forEach(b => b.addEventListener('click', () => {
    const label = b.dataset.method==='freehand'?'Freehand':b.dataset.method==='shapedrag'?'Shape Drag':'P2P';
    pushView('drawMethod', label);
  }));
}

/* ---- 2D draw methods: structural navigation is real; the actual canvas
   drawing interaction (finger-drag capture, point placement) is the next
   build, not this one — each still stubs at its deepest actionable step. ---- */
function renderDrawMethod(method){
  const key = method.toLowerCase().replace(' ','');
  if (key==='freehand'){
    renderH2('Drag one finger on the plate to trace a line');
    menuScroll.innerHTML = `<div class="panel-note-static" style="padding:14px 6px;color:var(--muted);font-size:12px;text-align:center;">Freehand tracing isn't wired up yet \u2014 next build.</div>`;
    return;
  }
  // shapedrag and p2p both offer the same shape+division picker
  pushOrShow('drawShapePick', method);
}
function pushOrShow(v, method){ pushView(v, method); }
const DIVISIONS = {
  circle:   [['full','Full'],['half','Half'],['quarter','Quarter']],
  square:   [['full','Full'],['quarter','Quarter']],
  rectangle:[['full','Full'],['eighth','Eighth']],
};
function renderDrawShapePick(method){
  renderH2('Pick a shape to divide, or use it whole');
  menuScroll.innerHTML = Object.keys(DIVISIONS).map(k => `<button class="tile" data-dshape="${k}">${svg('shapes')}<span>${k[0].toUpperCase()+k.slice(1)}</span></button>`).join('');
  menuScroll.querySelectorAll('[data-dshape]').forEach(b => b.addEventListener('click', () => {
    pushView('drawDivisionPick', b.dataset.dshape[0].toUpperCase()+b.dataset.dshape.slice(1));
  }));
}
function renderDrawDivisionPick(method, shapeLabelText){
  const shapeKey = shapeLabelText.toLowerCase();
  renderH2(`Press and drag on the plate to size it`);
  const divs = DIVISIONS[shapeKey] || [['full','Full']];
  menuScroll.innerHTML = divs.map(([id,label]) => `<button class="tile" data-div="${id}">${svg('shapes')}<span>${label}</span></button>`).join('');
  menuScroll.querySelectorAll('[data-div]').forEach(b => b.addEventListener('click', () => {
    showToast(`${method} \u2014 ${shapeLabelText} (${b.dataset.div}) drag-to-size isn't wired up yet, next build`);
  }));
}

/* ---- SHAPE PANEL: pinned tile + 5 action buttons, stacked vertically ---- */
const ACTIONS = [
  { id:'select', label:'Select', icon:'select' },
  { id:'move',   label:'Move',   icon:'move' },
  { id:'scale',  label:'Scale',  icon:'scale' },
  { id:'color',  label:'Color',  icon:'color' },
  { id:'delete', label:'Delete', icon:'trash' },
];
function renderShapePanel(activeTool){
  const l = activeLayer(), s = activeShape();
  if (!l || !s){ resetView('tools','home','Tools'); return; }
  renderH2(l.name);
  menuScroll.innerHTML = `
    <div class="pinned-tile">
      <div class="swatch-fill" style="background:${s.color}"></div>
      <span class="pt-label">${shapeLabel(s)}</span>
    </div>
    <div class="action-col">
      ${ACTIONS.map(a => `<button data-action="${a.id}" class="${a.id===activeTool?'active':''}">${svg(a.icon)}<span>${a.label}</span></button>`).join('')}
    </div>
    <div id="subtoolSlot"></div>
  `;
  menuScroll.querySelectorAll('[data-action]').forEach(b => b.addEventListener('click', () => {
    const id = b.dataset.action;
    if (id==='delete'){
      deleteShape(l.id, s.id);
      resetView('tools','home','Tools');
      showToast('Shape deleted');
      return;
    }
    if (id==='select'){
      showToast('Tap any shape on the plate to select it \u2014 crosshair mode coming soon');
      return;
    }
    pushView('subtool', id[0].toUpperCase()+id.slice(1));
  }));
}

/* ---- SUBTOOL: Move / Scale / Color ---- */
function renderSubtool(toolLabel){
  const tool = toolLabel.toLowerCase();
  const l = activeLayer(), s = activeShape();
  if (!l || !s){ resetView('tools','home','Tools'); return; }
  renderShapePanel(tool);
  const slot = document.getElementById('subtoolSlot');
  if (tool==='move'){
    slot.innerHTML = stepperRow('X', s.mesh.position.x, -half, half) + stepperRow('Y', s.mesh.position.y, 0, PLATE_SIZE) + stepperRow('Z', s.mesh.position.z, -half, half);
    wireSteppers(slot, ['X','Y','Z'], (axis,val) => {
      if (axis==='X') s.mesh.position.x = val;
      if (axis==='Y') s.mesh.position.y = Math.max(0, val);
      if (axis==='Z') s.mesh.position.z = val;
      clampToPlate(s.mesh, true);
      renderSubtool('Move');
    });
  } else if (tool==='scale'){
    slot.innerHTML = allAxisStepper(s) + stepperRow('X', s.mesh.scale.x, 0.1, 10) + stepperRow('Y', s.mesh.scale.y, 0.1, 10) + stepperRow('Z', s.mesh.scale.z, 0.1, 10);
    wireSteppers(slot, ['X','Y','Z'], (axis,val) => {
      if (axis==='X') s.mesh.scale.x = val;
      if (axis==='Y') s.mesh.scale.y = val;
      if (axis==='Z') s.mesh.scale.z = val;
      clampToPlate(s.mesh, true);
      renderSubtool('Scale');
    });
    const allRow = slot.querySelector('.stepper-row.all-axes');
    allRow.querySelectorAll('[data-step]').forEach(btn => btn.addEventListener('click', () => {
      const d = parseFloat(btn.dataset.step) * 0.1;
      s.mesh.scale.x = Math.min(10, Math.max(0.1, s.mesh.scale.x + d));
      s.mesh.scale.y = Math.min(10, Math.max(0.1, s.mesh.scale.y + d));
      s.mesh.scale.z = Math.min(10, Math.max(0.1, s.mesh.scale.z + d));
      clampToPlate(s.mesh, true);
      renderSubtool('Scale');
    }));
  } else if (tool==='color'){
    slot.innerHTML = `<div class="swatch-row">${SWATCHES.map(c=>`<div class="swatch ${s.color===c?'selected':''}" data-c="${c}" style="background:${c}"></div>`).join('')}</div>`;
    slot.querySelectorAll('[data-c]').forEach(sw => sw.addEventListener('click', () => {
      s.color = sw.dataset.c; refreshShapeVisuals(); renderSubtool('Color');
    }));
  }
}
function allAxisStepper(s){
  return `<div class="stepper-row all-axes">
    <span class="step-lbl">All</span>
    <button data-step="-1">\u2212</button>
    <input type="text" value="X/Y/Z together" readonly>
    <button data-step="1">+</button>
  </div>`;
}
function stepperRow(axis, val, min, max){
  return `<div class="stepper-row" data-axis="${axis}">
    <span class="step-lbl">${axis}</span>
    <button data-step="-1">\u2212</button>
    <input type="number" value="${val.toFixed(2)}" data-min="${min}" data-max="${max}">
    <button data-step="1">+</button>
  </div>`;
}
function wireSteppers(scope, axes, onChange){
  axes.forEach(axis => {
    const row = scope.querySelector(`.stepper-row[data-axis="${axis}"]`);
    if (!row) return;
    const input = row.querySelector('input');
    const min = parseFloat(input.dataset.min), max = parseFloat(input.dataset.max);
    row.querySelectorAll('[data-step]').forEach(btn => btn.addEventListener('click', () => {
      const stepSize = max>50 ? GRID_SQUARE : 0.1;
      let v = parseFloat(input.value) + parseFloat(btn.dataset.step)*stepSize;
      v = Math.min(max, Math.max(min, v));
      onChange(axis, v);
    }));
    input.addEventListener('change', () => {
      let v = Math.min(max, Math.max(min, parseFloat(input.value)||0));
      onChange(axis, v);
    });
  });
}

/* ---- LAYERS LIST ---- */
function renderLayersList(){
  renderH2('Tap Add, or tap a layer to enter it');
  menuScroll.innerHTML = `<button class="tile" id="addLayerBtn">${svg('add')}<span>Add</span></button>` +
    layers.map(l => `
      <div class="tile layer-tile-wrap" data-layer="${l.id}">
        ${svg('layers')}<span>${l.name}</span>
        <button class="layer-del" data-del="${l.id}">${svg('trash')}</button>
      </div>`).join('');
  document.getElementById('addLayerBtn').addEventListener('click', () => {
    const l = createLayer(); activeLayerId = l.id; activeShapeId = null;
    resetView('tools','home','Tools');
  });
  menuScroll.querySelectorAll('[data-layer]').forEach(el => el.addEventListener('click', (e) => {
    if (e.target.closest('[data-del]')) return;
    activeLayerId = parseInt(el.dataset.layer,10); activeShapeId = null;
    refreshShapeVisuals();
    resetView('tools','home','Tools');
  }));
  let armedId = null, armTimer = null;
  menuScroll.querySelectorAll('[data-del]').forEach(btn => btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const id = parseInt(btn.dataset.del,10);
    if (armedId !== id){
      menuScroll.querySelectorAll('.layer-del').forEach(b=>b.classList.remove('armed'));
      armedId = id; btn.classList.add('armed');
      clearTimeout(armTimer);
      armTimer = setTimeout(() => { armedId=null; btn.classList.remove('armed'); }, 3000);
    } else {
      clearTimeout(armTimer);
      showConfirm(`Delete this layer?`, () => { deleteLayer(id); renderLayersList(); });
    }
  }));
}

/* ---- BOOLEAN (reached from a selected shape's action row is not listed —
   kept reachable via Tools home shape list for now: select a shape, then
   use this view directly) ---- */
function renderBooleanPick(){
  const s = activeShape();
  if (!s){ resetView('tools','home','Tools'); return; }
  renderH2('Pick a second shape, then an operation');
  const others = [];
  layers.forEach(l => l.shapes.forEach(sh => { if (!(l.id===activeLayerId && sh.id===activeShapeId)) others.push({l,sh}); }));
  let targetId = null;
  menuScroll.innerHTML = others.map(o => `<button class="tile" data-target="${o.l.id}:${o.sh.id}">${svg('shapes')}<span>${shapeLabel(o.sh)}</span></button>`).join('') +
    `<div class="action-col">
      <button data-op="union" disabled>${svg('boolean')}<span>Union</span></button>
      <button data-op="subtract" disabled>${svg('boolean')}<span>Subtract</span></button>
      <button data-op="intersect" disabled>${svg('boolean')}<span>Intersect</span></button>
    </div>`;
  menuScroll.querySelectorAll('[data-target]').forEach(b => b.addEventListener('click', () => {
    targetId = b.dataset.target;
    menuScroll.querySelectorAll('[data-target]').forEach(x=>x.classList.remove('selected'));
    b.classList.add('selected');
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
    resetView('tools','shapePanel', shapeLabel(rec));
  } catch(err){
    console.error(err);
    showToast('Boolean tool could not load \u2014 check your connection and try again');
  }
}

/* ---- SETTINGS ---- */
function renderSettings(){
  renderH2(`Plate fixed at ${PLATE_SIZE}\u00d7${PLATE_SIZE}mm, ${GRID_SQUARE}mm grid`);
  menuScroll.innerHTML = `
    <button class="tile" id="saveBtn">${svg('settings')}<span>Save Scene</span></button>
    <button class="tile" id="loadBtn">${svg('settings')}<span>Load Scene</span></button>
    <button class="tile" id="stlBtn">${svg('settings')}<span>Export STL</span></button>
  `;
  document.getElementById('saveBtn').addEventListener('click', () => { saveSceneJSON(); showToast('Scene saved'); });
  document.getElementById('loadBtn').addEventListener('click', () => showToast('Load Scene is coming in a future update'));
  document.getElementById('stlBtn').addEventListener('click', () => { exportSTL(); showToast('STL exported'); });
}

/* ---- HELP ---- */
function renderHelp(){
  renderH2('Every module in the app');
  menuScroll.innerHTML = MODULES.filter(m=>MODULE_ORDER.includes(m.id)).map(m => `<button class="tile" disabled>${svg(m.icon)}<span>${m.label}</span></button>`).join('');
}

/* =====================================================================
   CONFIRM POPUP (Yes/No)
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
  const data = layers.map(l => ({ name:l.name, shapes: l.shapes.map(s => ({
    geomId:s.geomId, fields:s.fields, color:s.color,
    position:s.mesh.position.toArray(), scale:s.mesh.scale.toArray(),
  })) }));
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
resetView('tools', 'home', 'Tools');
