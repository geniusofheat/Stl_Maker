import { S } from './stl_maker_state.js';
import { activeLayer, activeShape, createLayer, layers } from './stl_maker_layer_data.js';
import { menuScroll, setH2 } from './stl_maker_h2.js';
import { svg } from './stl_maker_icons.js';
import { goToDrawingTools, goToLayer, goToP2POptions } from './stl_maker_navigation.js';
import { startFreehand } from './stl_maker_freehand.js';
import { render } from './stl_maker_render.js';
import { camera, canvas } from './stl_maker_three.js';
import { raycaster, ndc } from './stl_maker_selection.js';
import { classifyLocalHit, selectPoint, selectFace, selectEdge } from './stl_maker_face_edit.js';


/* ─────────────────────────────────────────────────────────────
   DRAWING TOOLS
───────────────────────────────────────────────────────────── */

export function renderDrawingToolsHome(){

  ensureExtrudeListeners();

  if(!layers.length){

    const l=
      createLayer();

    S.activeLayerId=l.id;
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

        S.activeModule='layers';

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

        S.crumbs=[
          'Drawing Tools',
          'Shape'
        ];

        S.crumbBack=
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
   EXTRUDE
   Tap and hold a side, edge, or corner of the active object for
   one full second, then lift your finger — that part highlights
   blue. With it highlighted, the Move button + a finger drag pulls
   that side or point outward (or in) instead of moving the whole
   object. Only box shapes (square, rectangle) are supported so
   far; edges aren't yet, only sides and corners.
───────────────────────────────────────────────────────────── */

const LONG_PRESS_MS=1000;
const CANCEL_DRIFT_PX=12;

let pressTimer=null;
let pressArmed=false;
let pressStart=null;
let pressLocal=null;

function extrudeEligible(){

  const s=activeShape();

  if(
    !s ||
    S.shapeMode!=='3d' ||
    (s.geomId!=='square' && s.geomId!=='rectangle')
  )
    return null;

  return s;
}

let extrudeListenersReady=false;

// deferred: this file is imported by stl_maker_three.js (for
// renderDrawingToolsHome), so wiring these up at module load time
// would try to use "canvas" before three.js finishes loading it.
// Called instead the first time Drawing Tools actually renders.
function ensureExtrudeListeners(){

  if(extrudeListenersReady)
    return;

  extrudeListenersReady=true;

  canvas.addEventListener(
    'pointerdown',
    e => {

      const s=extrudeEligible();

      if(!s)
        return;

      const rect=
        canvas.getBoundingClientRect();

      ndc.x=
        ((e.clientX-rect.left)/rect.width)*2-1;

      ndc.y=
        -((e.clientY-rect.top)/rect.height)*2+1;

      raycaster.setFromCamera(ndc,camera);

      const hit=
        raycaster.intersectObject(
          s.mesh,
          false
        )[0];

      if(!hit)
        return;

      pressStart={
        x:e.clientX,
        y:e.clientY
      };

      pressLocal=
        s.mesh.worldToLocal(
          hit.point.clone()
        );

      pressArmed=false;

      clearTimeout(pressTimer);

      pressTimer=
        setTimeout(
          () => {
            pressArmed=true;
          },
          LONG_PRESS_MS
        );
    }
  );

  canvas.addEventListener(
    'pointermove',
    e => {

      if(!pressStart)
        return;

      const dx=e.clientX-pressStart.x;
      const dy=e.clientY-pressStart.y;

      if(
        Math.hypot(dx,dy)>CANCEL_DRIFT_PX
      ){

        clearTimeout(pressTimer);

        pressStart=null;
        pressArmed=false;
      }
    }
  );

  canvas.addEventListener('pointerup',endPress);
  canvas.addEventListener('pointercancel',endPress);
}

function endPress(){

  clearTimeout(pressTimer);

  const s=extrudeEligible();

  if(s && pressArmed && pressLocal){

    const hit=
      classifyLocalHit(s,pressLocal);

    if(hit.kind==='point')
      selectPoint(s,hit.point);
    else if(hit.kind==='edge')
      selectEdge(s,hit.edge);
    else
      selectFace(s,hit.face);
  }

  pressStart=null;
  pressArmed=false;
  pressLocal=null;
}

