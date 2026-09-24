import * as THREE from 'three';
import { camera, canvas, dragGroundPlane } from './stl_maker_three.js';
import { ndc, raycaster } from './stl_maker_selection.js';


/* ─────────────────────────────────────────────────────────────
   PLATE HIT
───────────────────────────────────────────────────────────── */

export function plateHit(
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
