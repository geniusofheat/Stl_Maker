import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { STLExporter } from 'three/addons/exporters/STLExporter.js';
import { ICONS, MODULES, TOOLS, SHAPES_3D, SHAPES_2D, BOOLEAN_OPS, SWATCHES, SETTINGS_ITEMS, PLATE } from './stl_maker_data.js';

/* =====================================================================
   ICON HELPER
   ===================================================================== */
function svg(name, extra){ return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" ${extra||''}>${ICONS[name]||''}</svg>`; }

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

const half = PLATE.size/2;
const grid = new THREE.GridHelper(PLATE.size, PLATE.size/PLATE.gridSquare, 0xc8a96e, 0x34355a);
grid.material.transparent = true; grid.material.opacity = 0.45;
scene.add(grid);
scene.add(new THREE.LineLoop(
  new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-half,0.06,-half),new THREE.Vector3(half,0.06,-half),new THREE.Vector3(half,0.06,half),new THREE.Vector3(-half,0.06,half)]),
  new THREE.LineBasicMaterial({ color:0xe0c48f })
));

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; controls.dampingFactor = 0.08;
controls.target.set(0,10,0); controls.update();

function fitCanvas(){
  const rect = document.getElementById('plate').getBoundingClientRect();
  renderer.setSize(rect.width, rect.height, false);
  camera.aspect = rect.width/rect.height; camera.updateProjectionMatrix();
}
new ResizeObserver(fitCanvas).observe(document.getElementById('plate'));
setTimeout(fitCanvas, 30);
(function animate(){ requestAnimationFrame(animate); controls.update(); renderer.render(scene,camera); })();

/* =====================================================================
   LAYERS — each layer holds zero or one shape. Active layer = full color.
   Every other layer's shape = gray fill + white outline.
   ===================================================================== */
const layers = [];       // { id, letter, mesh, geomId, fields, color }
let nextId = 1;
let activeLayerId = null;
const GRAY = 0x777788;

function nextLetter(){
  const n = layers.length;
  return String.fromCharCode(65 + n); // A, B, C ...
}
function createLayer(){
  const rec = { id: nextId++, letter: nextLetter(), mesh:null, geomId:null, fields:null, color: SWATCHES[0] };
  layers.push(rec);
  setActiveLayer(rec.id);
  return rec;
}
function findLayer(id){ return layers.find(l => l.id === id); }
function setActiveLayer(id){
  activeLayerId = id;
  refreshLayerVisuals();
  renderCurrentPanel();
}
function refreshLayerVisuals(){
  layers.forEach(l => {
    if (!l.mesh) return;
    if (l.id === activeLayerId){
      l.mesh.material.color.set(l.color);
      l.mesh.material.emissive.set(0x000000);
      if (l.mesh.userData.outline) l.mesh.userData.outline.visible = false;
    } else {
      l.mesh.material.color.set(GRAY);
      if (l.mesh.userData.outline) l.mesh.userData.outline.visible = true;
    }
  });
}
function deleteLayer(id){
  const l = findLayer(id);
  if (!l) return;
  if (l.mesh){ scene.remove(l.mesh); if (l.mesh.userData.outline) scene.remove(l.mesh.userData.outline); l.mesh.geometry.dispose(); }
  const idx = layers.indexOf(l);
  layers.splice(idx, 1);
  if (activeLayerId === id){
    activeLayerId = layers.length ? layers[Math.max(0,idx-1)].id : null;
  }
  if (!layers.length) createLayer();
  refreshLayerVisuals();
  renderCurrentPanel();
  renderH2();
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
function clampToPlate(mesh){
  const geo = mesh.geometry; if (!geo.boundingBox) geo.computeBoundingBox(); const bb = geo.boundingBox;
  const rx=(bb.max.x-bb.min.x)*mesh.scale.x, ry=(bb.max.y-bb.min.y)*mesh.scale.y, rz=(bb.max.z-bb.min.z)*mesh.scale.z;
  if (rx>PLATE.size) mesh.scale.x*=PLATE.size/rx;
  if (ry>PLATE.size) mesh.scale.y*=PLATE.size/ry;
  if (rz>PLATE.size) mesh.scale.z*=PLATE.size/rz;
  mesh.position.y = -bb.min.y*mesh.scale.y;
  const hx=(bb.max.x-bb.min.x)*mesh.scale.x/2, hz=(bb.max.z-bb.min.z)*mesh.scale.z/2;
  mesh.position.x = THREE.MathUtils.clamp(mesh.position.x, -half+hx, half-hx);
  mesh.position.z = THREE.MathUtils.clamp(mesh.position.z, -half+hz, half-hz);
}
function attachOutline(mesh){
  const edges = new THREE.LineSegments(new THREE.EdgesGeometry(mesh.geometry), new THREE.LineBasicMaterial({ color:0xffffff }));
  edges.visible = false;
  mesh.add(edges);
  mesh.userData.outline = edges;
}

/* insert a shape into a layer (creates or replaces its mesh) */
function insertShapeIntoLayer(layerId, shapeId, fields){
  const l = findLayer(layerId);
  if (!l) return;
  if (l.mesh){ scene.remove(l.mesh); l.mesh.geometry.dispose(); }
  const geo = buildGeometry(shapeId, fields);
  const mesh = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color:l.color, metalness:0.15, roughness:0.55 }));
  mesh.position.set(0,0,0);
  clampToPlate(mesh);
  attachOutline(mesh);
  scene.add(mesh);
  l.mesh = mesh; l.geomId = shapeId; l.fields = {...fields};
  refreshLayerVisuals();
  commitHistory();
}

/* =====================================================================
   SELECTION (tap a shape in the 3D view = make its layer active)
   ===================================================================== */
const raycaster = new THREE.Raycaster(), ndc = new THREE.Vector2();
canvas.addEventListener('pointerup', (e) => {
  const rect = canvas.getBoundingClientRect();
  ndc.x = ((e.clientX-rect.left)/rect.width)*2-1;
  ndc.y = -((e.clientY-rect.top)/rect.height)*2+1;
  raycaster.setFromCamera(ndc, camera);
  const meshes = layers.filter(l=>l.mesh).map(l=>l.mesh);
  const hits = raycaster.intersectObjects(meshes, false);
  if (hits.length){
    const l = layers.find(l => l.mesh === hits[0].object);
    setActiveLayer(l.id);
  }
});

/* =====================================================================
   UNDO / REDO — snapshot based
   ===================================================================== */
const history = []; let historyIndex = -1;
function snapshot(){
  return { activeLayerId, layers: layers.map(l => ({
    id:l.id, letter:l.letter, color:l.color, geomId:l.geomId, fields:l.fields ? {...l.fields} : null,
    position: l.mesh ? l.mesh.position.toArray() : null,
    scale: l.mesh ? l.mesh.scale.toArray() : null,
  })) };
}
function commitHistory(){
  history.splice(historyIndex+1);
  history.push(snapshot());
  historyIndex = history.length-1;
  if (history.length>60){ history.shift(); historyIndex--; }
  renderH2();
}
function restoreSnapshot(snap){
  layers.slice().forEach(l => { if (l.mesh){ scene.remove(l.mesh); l.mesh.geometry.dispose(); } });
  layers.length = 0;
  snap.layers.forEach(s => {
    const rec = { id:s.id, letter:s.letter, color:s.color, geomId:s.geomId, fields:s.fields, mesh:null };
    if (s.geomId){
      const geo = buildGeometry(s.geomId, s.fields);
      const mesh = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color:s.color, metalness:0.15, roughness:0.55 }));
      mesh.position.fromArray(s.position); mesh.scale.fromArray(s.scale);
      attachOutline(mesh);
      scene.add(mesh);
      rec.mesh = mesh;
    }
    layers.push(rec);
  });
  activeLayerId = snap.activeLayerId;
  nextId = Math.max(0, ...layers.map(l=>l.id)) + 1;
  refreshLayerVisuals();
  renderCurrentPanel();
  renderH2();
}
function doUndo(){ if (historyIndex<=0) return; historyIndex--; restoreSnapshot(history[historyIndex]); }
function doRedo(){ if (historyIndex>=history.length-1) return; historyIndex++; restoreSnapshot(history[historyIndex]); }

/* =====================================================================
   H1 — MODULES
   ===================================================================== */
const h1 = document.getElementById('h1');
let activeModule = 'tools';
function renderH1(){
  h1.innerHTML = MODULES.map(m => `<button class="module-btn ${m.id===activeModule?'active':''}" data-module="${m.id}">${svg(m.icon)}<span>${m.label}</span></button>`).join('');
  h1.querySelectorAll('[data-module]').forEach(btn => btn.addEventListener('click', () => {
    activeModule = btn.dataset.module;
    renderH1();
    openModule(activeModule);
  }));
}

/* =====================================================================
   H2 — title/info + undo/redo
   ===================================================================== */
const h2Title = document.getElementById('h2Title'), h2Info = document.getElementById('h2Info');
const btnUndo = document.getElementById('btnUndo'), btnRedo = document.getElementById('btnRedo');
btnUndo.innerHTML = svg('undo') + '<span>Undo</span>';
btnRedo.innerHTML = svg('redo') + '<span>Redo</span>';
btnUndo.addEventListener('click', doUndo);
btnRedo.addEventListener('click', doRedo);
function setH2(title, info){ h2Title.textContent = title; h2Info.textContent = info; }
function renderH2(){
  btnUndo.disabled = historyIndex<=0;
  btnRedo.disabled = historyIndex>=history.length-1;
}

/* =====================================================================
   SLIDE MENU rendering
   ===================================================================== */
const slideMenu = document.getElementById('slideMenu');
const menuScroll = document.getElementById('menuScroll');
document.getElementById('expandTab').innerHTML = svg('back', 'style="transform:rotate(180deg)"');
document.getElementById('expandTab').addEventListener('click', () => slideMenu.classList.toggle('expanded'));

let currentPanel = { module:'tools', tool:null }; // tracks what's on screen so undo/redo can refresh it
function renderCurrentPanel(){
  if (currentPanel.module === 'tools' && currentPanel.tool) openTool(currentPanel.tool, true);
  else if (currentPanel.module === 'tools') renderToolList();
  else if (currentPanel.module === 'layers') renderLayersPanel();
  else if (currentPanel.module === 'view') renderViewPanel();
  else if (currentPanel.module === 'settings') renderSettingsPanel();
  else if (currentPanel.module === 'help') renderHelpPanel();
}

function openModule(id){
  slideMenu.classList.add('open');
  currentPanel = { module:id, tool:null };
  if (id==='tools') renderToolList();
  else if (id==='layers') renderLayersPanel();
  else if (id==='view') renderViewPanel();
  else if (id==='settings') renderSettingsPanel();
  else if (id==='help') renderHelpPanel();
}

function activeShapeCount(){ return findLayer(activeLayerId) && findLayer(activeLayerId).mesh ? 1 : 0; }

function renderToolList(){
  setH2('Tools', 'Tap a tool to open its options');
  menuScroll.innerHTML = TOOLS.map(t => {
    const disabled = (t.needs==='one' && activeShapeCount()<1) || (t.needs==='two' && layers.filter(l=>l.mesh).length<2);
    return `<button class="tile" data-tool="${t.id}" ${disabled?'disabled':''}>${svg(t.icon)}<span>${t.label}</span></button>`;
  }).join('');
  menuScroll.querySelectorAll('[data-tool]').forEach(btn => btn.addEventListener('click', () => openTool(btn.dataset.tool)));
}

function backToToolList(){ currentPanel = { module:'tools', tool:null }; renderToolList(); }

function openTool(toolId, silent){
  if (!silent) currentPanel = { module:'tools', tool:toolId };
  const tool = TOOLS.find(t=>t.id===toolId);
  setH2(tool.label, '');
  if (toolId==='select'){
    setH2('Select', 'Tap a shape on the plate to select it');
    menuScroll.innerHTML = backTile();
  } else if (toolId==='shapes'){
    renderShapesTool();
  } else if (toolId==='boolean'){
    renderBooleanTool();
  } else if (toolId==='move'){
    renderMoveTool();
  } else if (toolId==='scale'){
    renderScaleTool();
  } else if (toolId==='colorTool'){
    renderColorTool();
  } else if (toolId==='delete'){
    const l = findLayer(activeLayerId);
    if (l && l.mesh){ deleteLayer(l.id); commitHistory(); }
    backToToolList();
  } else if (toolId==='undo'){
    doUndo(); renderCurrentPanel();
  } else if (toolId==='redo'){
    doRedo(); renderCurrentPanel();
  }
  wireBackTiles();
}
function backTile(){ return `<button class="tile back-tile" data-back="1">${svg('back')}<span>Back</span></button>`; }
function wireBackTiles(){ menuScroll.querySelectorAll('[data-back]').forEach(b => b.addEventListener('click', backToToolList)); }

/* ---- Shapes tool: 2D/3D toggle ---- */
let shapeMode = '3d';
function renderShapesTool(){
  setH2('Shapes', shapeMode==='3d' ? 'Tap a shape to add it' : 'Sketch tools \u2014 coming soon');
  const list = shapeMode==='3d' ? SHAPES_3D : SHAPES_2D;
  menuScroll.innerHTML = backTile() +
    `<div class="toggle-row">
      <button class="toggle-btn ${shapeMode==='2d'?'active':''}" data-mode="2d">2D</button>
      <button class="toggle-btn ${shapeMode==='3d'?'active':''}" data-mode="3d">3D</button>
    </div>` +
    list.map(s => `<button class="tile" data-shape="${s.id}">${svg('shapes')}<span>${s.label}</span></button>`).join('');
  wireBackTiles();
  menuScroll.querySelectorAll('[data-mode]').forEach(b => b.addEventListener('click', () => { shapeMode = b.dataset.mode; renderShapesTool(); }));
  menuScroll.querySelectorAll('[data-shape]').forEach(b => b.addEventListener('click', () => {
    if (shapeMode==='2d'){ showToast('Sketch-to-Extrude is coming in a future update'); return; }
    const def = SHAPES_3D.find(s=>s.id===b.dataset.shape);
    let targetLayer = findLayer(activeLayerId);
    if (!targetLayer || targetLayer.mesh) targetLayer = createLayer();
    insertShapeIntoLayer(targetLayer.id, def.id, def.fields);
    setActiveLayer(targetLayer.id);
    openTool('move');
    showToast(`${def.label} added`);
  }));
}

/* ---- Boolean tool ---- */
let booleanTargetId = null;
function renderBooleanTool(){
  booleanTargetId = null;
  setH2('Boolean', 'Pick a second shape, then an operation');
  const others = layers.filter(l => l.mesh && l.id !== activeLayerId);
  menuScroll.innerHTML = backTile() +
    `<div class="section-label">Combine with</div>` +
    others.map(l => `<button class="tile" data-target="${l.id}">${svg('layers')}<span>Layer ${l.letter}</span></button>`).join('') +
    `<div class="section-label">Operation</div>` +
    BOOLEAN_OPS.map(op => `<button class="tile" data-op="${op.id}" disabled>${svg('boolean')}<span>${op.label}</span></button>`).join('');
  wireBackTiles();
  menuScroll.querySelectorAll('[data-target]').forEach(b => b.addEventListener('click', () => {
    booleanTargetId = parseInt(b.dataset.target,10);
    menuScroll.querySelectorAll('[data-target]').forEach(x=>x.classList.remove('selected'));
    b.classList.add('selected');
    menuScroll.querySelectorAll('[data-op]').forEach(x=>x.disabled=false);
  }));
  menuScroll.querySelectorAll('[data-op]').forEach(b => b.addEventListener('click', () => runBoolean(b.dataset.op)));
}
async function runBoolean(mode){
  if (booleanTargetId==null) return;
  const a = findLayer(activeLayerId), b = findLayer(booleanTargetId);
  if (!a || !b || !a.mesh || !b.mesh) return;
  try{
    const { Evaluator, Brush, ADDITION, SUBTRACTION, INTERSECTION } = await import('https://unpkg.com/three-bvh-csg@0.0.16/build/index.module.js');
    const opMap = { union:ADDITION, subtract:SUBTRACTION, intersect:INTERSECTION };
    a.mesh.updateMatrixWorld(); b.mesh.updateMatrixWorld();
    const brushA = new Brush(a.mesh.geometry.clone()); brushA.position.copy(a.mesh.position); brushA.scale.copy(a.mesh.scale); brushA.updateMatrixWorld();
    const brushB = new Brush(b.mesh.geometry.clone()); brushB.position.copy(b.mesh.position); brushB.scale.copy(b.mesh.scale); brushB.updateMatrixWorld();
    const evaluator = new Evaluator();
    const result = evaluator.evaluate(brushA, brushB, opMap[mode]);
    result.geometry.computeVertexNormals();
    const newLayer = createLayer();
    const mesh = new THREE.Mesh(result.geometry, new THREE.MeshStandardMaterial({ color:newLayer.color, metalness:0.15, roughness:0.55 }));
    clampToPlate(mesh);
    attachOutline(mesh);
    scene.add(mesh);
    newLayer.mesh = mesh; newLayer.geomId = null; newLayer.fields = null; // custom geometry — not rebuildable from primitive params
    deleteLayer(a.id); deleteLayer(b.id);
    setActiveLayer(newLayer.id);
    commitHistory();
    showToast(`${mode[0].toUpperCase()+mode.slice(1)} created`);
    openTool('move');
  } catch(err){
    console.error(err);
    showToast('Boolean tool could not load \u2014 check your connection and try again');
  }
}

/* ---- Move tool: nudge pad ---- */
function renderMoveTool(){
  const l = findLayer(activeLayerId);
  setH2('Move', l ? `Layer ${l.letter} \u2014 ${PLATE.nudgeStep}mm per tap` : 'Nothing selected');
  menuScroll.innerHTML = backTile() + `
    <div class="nudge-box">
      <button class="nudge-btn" style="grid-column:2;grid-row:1" data-dir="up">${svg('arrowUp')}</button>
      <button class="nudge-btn" style="grid-column:1;grid-row:2" data-dir="left">${svg('arrowLeft')}</button>
      <div style="grid-column:2;grid-row:2"></div>
      <button class="nudge-btn" style="grid-column:3;grid-row:2" data-dir="right">${svg('arrowRight')}</button>
      <button class="nudge-btn" style="grid-column:2;grid-row:3" data-dir="down">${svg('arrowDown')}</button>
    </div>`;
  wireBackTiles();
  menuScroll.querySelectorAll('[data-dir]').forEach(b => b.addEventListener('click', () => {
    if (!l || !l.mesh) return;
    const s = PLATE.nudgeStep;
    if (b.dataset.dir==='up') l.mesh.position.z -= s;
    if (b.dataset.dir==='down') l.mesh.position.z += s;
    if (b.dataset.dir==='left') l.mesh.position.x -= s;
    if (b.dataset.dir==='right') l.mesh.position.x += s;
    clampToPlate(l.mesh);
    commitHistory();
  }));
}

/* ---- Scale tool: numeric X/Y/Z ---- */
function renderScaleTool(){
  const l = findLayer(activeLayerId);
  setH2('Scale', 'Capped at 100mm on every axis');
  if (!l || !l.mesh){ menuScroll.innerHTML = backTile(); wireBackTiles(); return; }
  const s = l.mesh.scale;
  menuScroll.innerHTML = backTile() +
    `<div class="field-row"><label>X</label><input type="number" step="0.1" id="scX" value="${s.x.toFixed(2)}"></div>
     <div class="field-row"><label>Y</label><input type="number" step="0.1" id="scY" value="${s.y.toFixed(2)}"></div>
     <div class="field-row"><label>Z</label><input type="number" step="0.1" id="scZ" value="${s.z.toFixed(2)}"></div>`;
  wireBackTiles();
  ['scX','scY','scZ'].forEach((id,i) => {
    document.getElementById(id).addEventListener('change', (e) => {
      const v = parseFloat(e.target.value)||1;
      if (i===0) l.mesh.scale.x = v; if (i===1) l.mesh.scale.y = v; if (i===2) l.mesh.scale.z = v;
      clampToPlate(l.mesh);
      commitHistory();
      renderScaleTool();
    });
  });
}

/* ---- Color tool ---- */
function renderColorTool(){
  const l = findLayer(activeLayerId);
  setH2('Color', 'In-app only \u2014 STL stores no color');
  menuScroll.innerHTML = backTile() +
    `<div class="swatch-row">${SWATCHES.map(c => `<div class="swatch ${l&&l.color===c?'selected':''}" data-c="${c}" style="background:${c}"></div>`).join('')}</div>`;
  wireBackTiles();
  menuScroll.querySelectorAll('[data-c]').forEach(sw => sw.addEventListener('click', () => {
    if (!l) return;
    l.color = sw.dataset.c;
    refreshLayerVisuals();
    commitHistory();
    renderColorTool();
  }));
}

/* =====================================================================
   LAYERS module
   ===================================================================== */
function renderLayersPanel(){
  setH2('Layers', 'Tap Add for a new layer, or tap one to select it');
  menuScroll.innerHTML = `<button class="tile" id="addLayerBtn">${svg('add')}<span>Add</span></button>` +
    layers.map(l => `
      <button class="tile layer-tile ${l.id===activeLayerId?'active':''}" data-layer="${l.id}">
        <span class="letter">${l.letter}</span>
        ${l.mesh ? `<div class="swatch-fill" style="background:${l.color}"></div>` : ''}
      </button>`).join('');
  document.getElementById('addLayerBtn').addEventListener('click', () => { createLayer(); commitHistory(); renderLayersPanel(); });
  menuScroll.querySelectorAll('[data-layer]').forEach(b => b.addEventListener('click', () => {
    setActiveLayer(parseInt(b.dataset.layer,10));
    renderLayersPanel();
  }));
}

/* =====================================================================
   VIEW module — camera controls
   ===================================================================== */
function renderViewPanel(){
  setH2('View', 'Camera controls only \u2014 the model never rotates on its own');
  menuScroll.innerHTML = `
    <button class="tile" id="rotateViewBtn">${svg('view')}<span>Rotate View</span></button>
    <button class="tile" id="homeBtn">${svg('home')}<span>Reset View</span></button>`;
  document.getElementById('rotateViewBtn').addEventListener('click', () => {
    const offset = new THREE.Vector3().subVectors(camera.position, controls.target);
    const sph = new THREE.Spherical().setFromVector3(offset); sph.theta += Math.PI/4;
    offset.setFromSpherical(sph); camera.position.copy(controls.target).add(offset); controls.update();
  });
  document.getElementById('homeBtn').addEventListener('click', () => {
    camera.position.copy(DEFAULT_CAM); controls.target.set(0,10,0); controls.update();
  });
}

/* =====================================================================
   SETTINGS module
   ===================================================================== */
function renderSettingsPanel(){
  setH2('Settings', `Plate fixed at ${PLATE.size}\u00d7${PLATE.size}mm, ${PLATE.gridSquare}mm grid`);
  menuScroll.innerHTML = SETTINGS_ITEMS.map(s => `<button class="tile" data-setting="${s.id}">${svg('settings')}<span>${s.label}</span></button>`).join('');
  menuScroll.querySelectorAll('[data-setting]').forEach(b => b.addEventListener('click', () => {
    if (b.dataset.setting==='save') { saveSceneJSON(); showToast('Scene saved'); }
    else if (b.dataset.setting==='stl') { exportSTL(); showToast('STL exported'); }
    else if (b.dataset.setting==='load') { showToast('Load Scene is coming in a future update'); }
  }));
}

/* =====================================================================
   HELP module — reference list
   ===================================================================== */
function renderHelpPanel(){
  setH2('Help', 'Every module and tool in the app');
  const all = [...MODULES.map(m=>({...m,cat:'Module'})), ...TOOLS.map(t=>({...t,cat:'Tool'}))];
  menuScroll.innerHTML = all.map(x => `<button class="tile" disabled>${svg(x.icon)}<span>${x.label}</span></button>`).join('');
}

/* =====================================================================
   SETTINGS-ish actions: STL + scene export (reached via Help for now)
   ===================================================================== */
function exportSTL(){
  const meshes = layers.filter(l=>l.mesh).map(l=>l.mesh);
  if (!meshes.length){ showToast('Nothing to export'); return; }
  const group = new THREE.Group();
  meshes.forEach(m => { const c = m.clone(); c.remove(...c.children); group.add(c); });
  const exporter = new STLExporter();
  const result = exporter.parse(group, { binary:true });
  downloadBlob(new Blob([result], {type:'application/octet-stream'}), 'formwork-model.stl');
}
function saveSceneJSON(){
  downloadBlob(new Blob([JSON.stringify(snapshot(), null, 2)], {type:'application/json'}), 'formwork-scene.json');
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
createLayer();       // Layer A, empty, active — shown on load
commitHistory();
renderH1();
openModule('tools');
renderH2();

/* expose export actions on window so Help-tile-free simple triggers can reach them later */
window.formworkExportSTL = exportSTL;
window.formworkSaveScene = saveSceneJSON;
