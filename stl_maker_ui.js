/* STL Maker subsystem — generated from stl_maker_engine2.js */

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


