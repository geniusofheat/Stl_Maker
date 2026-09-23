/* STL Maker subsystem — generated from stl_maker_engine2.js */

function polygonGeometry(
  sides,
  radius
){

  const shape =
    new THREE.Shape();

  for(
    let i=0;
    i<sides;
    i++
  ){

    const a =
      Math.PI/2 +
      i/sides *
      Math.PI*2;

    const x =
      Math.cos(a)*radius;

    const y =
      Math.sin(a)*radius;

    if(i===0)
      shape.moveTo(x,y);
    else
      shape.lineTo(x,y);
  }

  shape.closePath();

  return new THREE.ShapeGeometry(
    shape
  );
}


function rotateGeometryToZ(
  geometry
){

  geometry.rotateX(
    Math.PI/2
  );

  return geometry;
}


function buildGeometry(
  shapeId,
  fields
){

  if(shapeMode==='2d'){

    if(shapeId==='circle')
      return new THREE.CircleGeometry(
        fields.D/2,
        64
      );

    if(shapeId==='square')
      return new THREE.PlaneGeometry(
        fields.W,
        fields.W
      );

    if(shapeId==='rectangle')
      return new THREE.PlaneGeometry(
        fields.W,
        fields.L
      );

    if(shapeId==='triangle')
      return polygonGeometry(
        3,
        fields.D/2
      );

    if(shapeId==='octagon')
      return polygonGeometry(
        8,
        fields.D/2
      );

    if(shapeId==='oval'){

      const g=
        new THREE.CircleGeometry(
          fields.D/2,
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
      30,
      30
    );
  }


  if(shapeId==='circle')
    return new THREE.SphereGeometry(
      fields.D/2,
      32,
      24
    );

  if(shapeId==='square')
    return new THREE.BoxGeometry(
      fields.W,
      fields.W,
      fields.H ?? fields.W
    );

  if(shapeId==='rectangle')
    return new THREE.BoxGeometry(
      fields.W,
      fields.L,
      fields.H
    );

  if(shapeId==='cylinder')
    return rotateGeometryToZ(
      new THREE.CylinderGeometry(
        fields.D/2,
        fields.D/2,
        fields.H,
        32
      )
    );

  if(shapeId==='cone')
    return rotateGeometryToZ(
      new THREE.ConeGeometry(
        fields.D/2,
        fields.H,
        32
      )
    );

  if(shapeId==='triangle')
    return rotateGeometryToZ(
      new THREE.CylinderGeometry(
        fields.D/2,
        fields.D/2,
        fields.H,
        3
      )
    );

  if(shapeId==='octagon')
    return rotateGeometryToZ(
      new THREE.CylinderGeometry(
        fields.D/2,
        fields.D/2,
        fields.H,
        8
      )
    );

  if(shapeId==='oval'){

    const g=
      new THREE.SphereGeometry(
        fields.D/2,
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
    30,
    30,
    30
  );
}


function geometryDimensions(mesh){

  if(!mesh.geometry.boundingBox)
    mesh.geometry.computeBoundingBox();

  const bb=
    mesh.geometry.boundingBox;

  return {
    x:
      Math.abs(
        bb.max.x-bb.min.x
      ) * Math.abs(mesh.scale.x),

    y:
      Math.abs(
        bb.max.y-bb.min.y
      ) * Math.abs(mesh.scale.y),

    z:
      Math.abs(
        bb.max.z-bb.min.z
      ) * Math.abs(mesh.scale.z)
  };
}


function storeDimensions(
  mesh
){

  return geometryDimensions(
    mesh
  );
}


function clampToPlate(
  mesh,
  allowFloat
){

  if(!mesh.geometry.boundingBox)
    mesh.geometry.computeBoundingBox();

  const bb=
    mesh.geometry.boundingBox;

  const rx=
    (bb.max.x-bb.min.x) *
    Math.abs(mesh.scale.x);

  const ry=
    (bb.max.y-bb.min.y) *
    Math.abs(mesh.scale.y);

  const rz=
    (bb.max.z-bb.min.z) *
    Math.abs(mesh.scale.z);


  if(rx>PLATE_SIZE)
    mesh.scale.x *=
      PLATE_SIZE/rx;

  if(ry>PLATE_SIZE)
    mesh.scale.y *=
      PLATE_SIZE/ry;

  if(rz>PLATE_SIZE)
    mesh.scale.z *=
      PLATE_SIZE/rz;


  const hx=
    (bb.max.x-bb.min.x) *
    Math.abs(mesh.scale.x)/2;

  const hy=
    (bb.max.y-bb.min.y) *
    Math.abs(mesh.scale.y)/2;

  const hz=
    (bb.max.z-bb.min.z) *
    Math.abs(mesh.scale.z)/2;


  mesh.position.x=
    THREE.MathUtils.clamp(
      mesh.position.x,
      -half+hx,
      half-hx
    );

  mesh.position.y=
    THREE.MathUtils.clamp(
      mesh.position.y,
      -half+hy,
      half-hy
    );


  const floorZ=
    -bb.min.z *
    mesh.scale.z;


  if(!allowFloat){

    mesh.position.z=
      floorZ;

  }else if(
    mesh.position.z<floorZ
  ){

    mesh.position.z=
      floorZ;
  }


  if(
    mesh.position.z >
    PLATE_SIZE-hz
  ){

    mesh.position.z=
      PLATE_SIZE-hz;
  }
}


function attachOutline(mesh){

  if(!mesh.isMesh)
    return;

  const edges=
    new THREE.LineSegments(
      new THREE.EdgesGeometry(
        mesh.geometry
      ),
      new THREE.LineBasicMaterial({
        color:0xffffff
      })
    );

  mesh.add(edges);

  mesh.userData.outline=edges;
}


function centerMeshOnGrid(
  mesh
){

  mesh.position.x=0;
  mesh.position.y=0;

  clampToPlate(
    mesh,
    false
  );
}


function insertShape(
  layerId,
  shapeId,
  fields
){

  const l=
    findLayer(layerId);

  const geo=
    buildGeometry(
      shapeId,
      fields
    );

  const color=
    SWATCHES[0];

  const mesh=
    new THREE.Mesh(
      geo,
      new THREE.MeshStandardMaterial({
        color,
        metalness:.15,
        roughness:.55
      })
    );

  centerMeshOnGrid(mesh);

  attachOutline(mesh);

  scene.add(mesh);

  const rec={
    id:Date.now()+Math.random(),
    num:l.shapes.length+1,
    mesh,
    geomId:shapeId,
    fields:{...fields},
    color,
    baseDimensions:
      storeDimensions(mesh)
  };

  l.shapes.push(rec);

  return rec;
}


function deleteShape(
  layerId,
  shapeId
){

  const l=
    findLayer(layerId);

  if(!l)
    return;

  const idx=
    l.shapes.findIndex(
      s => s.id===shapeId
    );

  if(idx===-1)
    return;

  const s=
    l.shapes[idx];

  scene.remove(s.mesh);

  if(s.mesh.geometry)
    s.mesh.geometry.dispose();

  if(s.mesh.material){

    if(Array.isArray(
      s.mesh.material
    )){

      s.mesh.material.forEach(
        m => m.dispose()
      );

    }else{

      s.mesh.material.dispose();
    }
  }

  l.shapes.splice(
    idx,
    1
  );

  l.shapes.forEach(
    (s2,i) =>
      s2.num=i+1
  );

  if(
    activeShapeId===shapeId
  ){

    activeShapeId=null;
  }
}


function deleteLayer(
  layerId
){

  const l=
    findLayer(layerId);

  if(!l)
    return;

  l.shapes.forEach(
    s => {

      scene.remove(
        s.mesh
      );

      if(s.mesh.geometry)
        s.mesh.geometry.dispose();

      if(s.mesh.material){

        if(Array.isArray(
          s.mesh.material
        )){

          s.mesh.material.forEach(
            m => m.dispose()
          );

        }else{

          s.mesh.material.dispose();
        }
      }
    }
  );

  layers.splice(
    layers.indexOf(l),
    1
  );

  layers.forEach(
    (l2,i) =>
      l2.name=`Layer ${i+1}`
  );

  if(
    activeLayerId===layerId
  ){

    activeLayerId=null;
    activeShapeId=null;
  }
}


