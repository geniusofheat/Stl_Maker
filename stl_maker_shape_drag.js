import * as THREE from 'three';
import { SWATCHES } from './stl_maker_data.js';
import { S } from './stl_maker_state.js';
import { armUndo, menuScroll, setH2 } from './stl_maker_h2.js';
import { plateHit } from './stl_maker_plate_hit.js';
import { GRID_SQUARE, canvas, controls, refreshLockBtn, scene } from './stl_maker_three.js';
import { buildDragGeometry } from './stl_maker_drag_geometry.js';
import { attachOutline, clampToPlate, geometryDimensions, storeDimensions } from './stl_maker_geometry.js';
import { activeLayer, refreshShapeVisuals } from './stl_maker_layer_data.js';
import { showToast } from './stl_maker_toast.js';
import { goToShape } from './stl_maker_navigation.js';


/* ─────────────────────────────────────────────────────────────
   SHAPE DRAG
───────────────────────────────────────────────────────────── */

export function startDragToSize(
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

    S.rotationLocked=true;

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
      S.shapeMode==='3d'
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
      S.shapeMode==='3d'
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

    S.activeShapeId=
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
