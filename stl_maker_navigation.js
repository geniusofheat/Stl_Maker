import { S } from './stl_maker_state.js';
import { activeLayer, activeShape } from './stl_maker_layer_data.js';
import { render } from './stl_maker_render.js';
import { renderH1 } from './stl_maker_module_h1.js';
import { shapeLabel } from './stl_maker_selection.js';


/* ─────────────────────────────────────────────────────────────
   NAVIGATION
───────────────────────────────────────────────────────────── */

export function goToLayersHome(){

  S.activeModule='layers';

  const l=
    activeLayer();

  S.crumbs=[
    l ? l.name : 'Layers'
  ];

  S.crumbBack=null;

  S.activeShapeId=null;

  render('layersHome');

  renderH1();
}


export function goToLayer(){

  const l=
    activeLayer();

  if(!l){

    goToLayersHome();

    return;
  }

  S.crumbs=[l.name];

  S.crumbBack=() => {

    S.activeShapeId=null;

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


export function goToShape(){

  const l=
    activeLayer();

  const s=
    activeShape();

  if(!l || !s){

    goToDrawingTools();

    return;
  }

  S.crumbs=[
    'Drawing Tools',
    shapeLabel(s)
  ];

  S.crumbBack=() =>
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

  S.activeModule='tools';

  renderH1();
}


export function goToSubtool(
  toolLabel
){

  const l=
    activeLayer();

  const s=
    activeShape();

  S.crumbs=[
    'Drawing Tools',
    shapeLabel(s),
    toolLabel
  ];

  S.crumbBack=() =>
    goToShape();

  render(
    'shapePanel',
    toolLabel.toLowerCase()
  );

  S.activeModule='tools';

  renderH1();
}


export function goToDrawingTools(){

  S.activeModule='tools';

  S.crumbs=[
    'Drawing Tools'
  ];

  S.crumbBack=null;

  render(
    'drawingToolsHome'
  );

  renderH1();
}


export function goToP2POptions(){

  S.crumbs=[
    'Drawing Tools',
    'P2P'
  ];

  S.crumbBack=() =>
    goToDrawingTools();

  render(
    'p2pHome'
  );
}


export function goToP2PFillPick(
  shapeKey
){

  S.crumbs=[
    'Drawing Tools',
    'P2P',
    'Shape',
    shapeKey[0].toUpperCase()+
    shapeKey.slice(1)
  ];

  S.crumbBack=() =>
    goToP2POptions();

  render(
    'p2pFillPick',
    shapeKey
  );
}
