import { slideMenu } from './stl_maker_h2.js';
import { renderLayersHome } from './stl_maker_layers_home.js';
import { renderShapePanel } from './stl_maker_shape_panel.js';
import { renderDrawingToolsHome } from './stl_maker_drawing_tools.js';
import { renderP2PFillPick, renderP2PHome, renderP2PLineOptions, renderP2PShapeOptions } from './stl_maker_p2p.js';
import { renderBooleanPick } from './stl_maker_boolean.js';
import { renderHelp, renderSettings } from './stl_maker_settings_help.js';
import { renderDrawShapePick } from './stl_maker_shape_draw.js';
import { cleanupManipulation } from './stl_maker_object_manipulation.js';


/* ─────────────────────────────────────────────────────────────
   RENDER
───────────────────────────────────────────────────────────── */

export function render(
  view,
  subtool
){

  // Leaving the rotate tool (back arrow, other buttons) must end rotate mode
  if(!(view==='shapePanel' && subtool==='rotate'))
    cleanupManipulation();

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
