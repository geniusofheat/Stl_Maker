import { S } from './stl_maker_state.js';


/* ─────────────────────────────────────────────────────────────
   DATA
───────────────────────────────────────────────────────────── */

export const layers=[];


const GRAY=0x777788;


export function findLayer(id){
  return layers.find(
    l => l.id===id
  );
}


export function activeLayer(){
  return findLayer(
    S.activeLayerId
  );
}


export function activeShape(){

  const l=activeLayer();

  return l
    ? l.shapes.find(
        s => s.id===S.activeShapeId
      )
    : null;
}


export function createLayer(){

  const l={
    id:S.nextLayerId++,
    name:`Layer ${layers.length+1}`,
    shapes:[]
  };

  layers.push(l);

  return l;
}


export function refreshShapeVisuals(){

  layers.forEach(
    l => {

      l.shapes.forEach(
        s => {

          const active =
            l.id===S.activeLayerId &&
            s.id===S.activeShapeId;

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
