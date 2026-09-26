import * as THREE from 'three';
import { STLExporter } from 'three/addons/exporters/STLExporter.js';
import { layers } from './stl_maker_layer_data.js';
import { showToast } from './stl_maker_toast.js';


/* ─────────────────────────────────────────────────────────────
   EXPORT / SAVE
───────────────────────────────────────────────────────────── */

export function exportSTL(){

  const meshes=[];

  layers.forEach(
    l =>
      l.shapes.forEach(
        s => {

          if(s.mesh.isMesh)
            meshes.push(
              s.mesh
            );
        }
      )
  );


  if(!meshes.length){

    showToast(
      'Nothing to export'
    );

    return;
  }


  const group=
    new THREE.Group();


  meshes.forEach(
    m => {

      const c=
        m.clone();

      c.remove(
        ...c.children
      );

      group.add(c);
    }
  );


  const exporter=
    new STLExporter();


  const result=
    exporter.parse(
      group,
      {
        binary:true
      }
    );


  downloadBlob(
    new Blob(
      [result],
      {
        type:
          'application/octet-stream'
      }
    ),
    'stl-maker-model.stl'
  );
}


export function saveSceneJSON(){

  const data=
    layers.map(
      l => ({
        name:l.name,

        shapes:
          l.shapes.map(
            s => ({
              geomId:s.geomId,
              fields:s.fields,
              color:s.color,
              position:
                s.mesh.position.toArray(),
              rotation:[
                s.mesh.rotation.x,
                s.mesh.rotation.y,
                s.mesh.rotation.z
              ],
              scale:
                s.mesh.scale.toArray(),
              baseDimensions:
                s.baseDimensions
            })
          )
      })
    );


  downloadBlob(
    new Blob(
      [
        JSON.stringify(
          data,
          null,
          2
        )
      ],
      {
        type:'application/json'
      }
    ),
    'stl-maker-scene.json'
  );
}


function downloadBlob(
  blob,
  filename
){

  const url=
    URL.createObjectURL(
      blob
    );

  const a=
    document.createElement(
      'a'
    );

  a.href=url;

  a.download=filename;

  document.body.appendChild(a);

  a.click();

  document.body.removeChild(a);

  setTimeout(
    () =>
      URL.revokeObjectURL(
        url
      ),
    2000
  );
}
