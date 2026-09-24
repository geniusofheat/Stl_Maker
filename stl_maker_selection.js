import * as THREE from 'three';
import { S } from './stl_maker_state.js';
import { camera, canvas } from './stl_maker_three.js';
import { layers, refreshShapeVisuals } from './stl_maker_layer_data.js';
import { goToShape } from './stl_maker_navigation.js';
import { showToast } from './stl_maker_toast.js';


/* ─────────────────────────────────────────────────────────────
   SELECTION
───────────────────────────────────────────────────────────── */

export const raycaster=
  new THREE.Raycaster();

export const ndc=
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

    S.activeLayerId=
      hit.l.id;

    S.activeShapeId=
      hit.s.id;

    refreshShapeVisuals();

    goToShape();

    return true;
  }

  return false;
}


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


export function activateCrosshair(){

  S.crosshairActive=true;

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

    S.crosshairActive=false;

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

    if(!S.crosshairActive &&
       !S.manipulationActive){

      trySelectAt(
        e.clientX,
        e.clientY
      );
    }
  }
);


export function shapeLabel(s){

  if(!s || !s.geomId)
    return 'Shape';

  return (
    s.geomId[0].toUpperCase()+
    s.geomId.slice(1)+
    ` #${s.num}`
  );
}
