import * as THREE from 'three';
import { S } from './stl_maker_state.js';
import { GRID_SQUARE } from './stl_maker_three.js';
import { polygonGeometry, rotateGeometryToZ } from './stl_maker_geometry.js';


/* ─────────────────────────────────────────────────────────────
   DRAG GEOMETRY
───────────────────────────────────────────────────────────── */

export function buildDragGeometry(
  shapeKey,
  sizeMM
){

  const H=
    Math.max(
      GRID_SQUARE,
      15
    );


  if(S.shapeMode==='2d'){

    if(shapeKey==='circle')
      return new THREE.CircleGeometry(
        sizeMM/2,
        64
      );

    if(shapeKey==='square')
      return new THREE.PlaneGeometry(
        sizeMM,
        sizeMM
      );

    if(shapeKey==='rectangle')
      return new THREE.PlaneGeometry(
        sizeMM,
        sizeMM*.5
      );

    if(shapeKey==='triangle')
      return polygonGeometry(
        3,
        sizeMM/2
      );

    if(shapeKey==='octagon')
      return polygonGeometry(
        8,
        sizeMM/2
      );

    if(shapeKey==='oval'){

      const g=
        new THREE.CircleGeometry(
          sizeMM/2,
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
      sizeMM,
      sizeMM
    );
  }


  if(shapeKey==='circle')
    return new THREE.SphereGeometry(
      sizeMM/2,
      32,
      24
    );

  if(shapeKey==='square')
    return new THREE.BoxGeometry(
      sizeMM,
      sizeMM,
      sizeMM
    );

  if(shapeKey==='rectangle')
    return new THREE.BoxGeometry(
      sizeMM,
      sizeMM*.5,
      H
    );

  if(shapeKey==='triangle')
    return rotateGeometryToZ(
      new THREE.CylinderGeometry(
        sizeMM/2,
        sizeMM/2,
        H,
        3
      )
    );

  if(shapeKey==='octagon')
    return rotateGeometryToZ(
      new THREE.CylinderGeometry(
        sizeMM/2,
        sizeMM/2,
        H,
        8
      )
    );

  if(shapeKey==='oval'){

    const g=
      new THREE.SphereGeometry(
        sizeMM/2,
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
    sizeMM,
    sizeMM,
    H
  );
}
