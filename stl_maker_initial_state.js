import './stl_maker_styles.js';
import './stl_maker_selection.js';
import './stl_maker_icons.js';
import './stl_maker_three.js';
import './stl_maker_layer_data.js';
import './stl_maker_geometry.js';
import './stl_maker_module_h1.js';
import './stl_maker_h2.js';
import './stl_maker_navigation.js';
import './stl_maker_render.js';
import './stl_maker_layers_home.js';
import './stl_maker_drawing_tools.js';
import './stl_maker_shape_draw.js';
import './stl_maker_plate_hit.js';
import './stl_maker_drag_geometry.js';
import './stl_maker_shape_drag.js';
import './stl_maker_freehand.js';
import './stl_maker_p2p.js';
import './stl_maker_object_manipulation.js';
import './stl_maker_layer_delete.js';
import './stl_maker_shape_panel.js';
import './stl_maker_subtools.js';
import './stl_maker_boolean.js';
import './stl_maker_settings_help.js';
import './stl_maker_confirmation.js';
import './stl_maker_export_save.js';
import './stl_maker_toast.js';
import { refreshModeScene, refreshModeToggle } from './stl_maker_three.js';
import { renderH1 } from './stl_maker_module_h1.js';
import { goToDrawingTools } from './stl_maker_navigation.js';


/* ─────────────────────────────────────────────────────────────
   INITIAL STATE
───────────────────────────────────────────────────────────── */

refreshModeScene();
refreshModeToggle();

renderH1();

goToDrawingTools();
