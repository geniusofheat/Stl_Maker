/* =====================================================================
   FORMWORK — DATA FILE
   Plain arrays only. No logic lives here.
   To add a new tool, shape, or icon later: add an entry to the right
   array below. formwork-engine.js loops over these generically, so most
   additions don't require touching the engine at all.
   ===================================================================== */

/* ---- icon library (SVG inner-markup strings, 24x24 viewBox) ---- */
export const ICONS = {
  tools:    '<path d="M14.7 6.3a4 4 0 0 1-5.66 5.66L4 17l3 3 5.04-5.04a4 4 0 0 1 5.66-5.66L21 6l-3-3-3.3 3.3Z"/>',
  layers:   '<path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="m3 13 9 5 9-5"/>',
  view:     '<path d="M21 12a9 9 0 1 1-3-6.7"/><path d="M21 3v5h-5"/>',
  help:     '<rect x="3" y="4" width="18" height="16" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/><line x1="9" y1="10" x2="9" y2="20"/>',
  select:   '<path d="M5 3v17l4.5-4.2L12 20l2-1-2.5-4.2H17z"/>',
  shapes:   '<path d="M12 2 3 7.5 12 12l9-4.5L12 2Z"/><path d="M3 7.5v9L12 21l9-4.5v-9"/>',
  boolean:  '<circle cx="9" cy="12" r="5.5" fill="currentColor" fill-opacity="0.18"/><circle cx="15" cy="12" r="5.5" fill="currentColor" fill-opacity="0.18"/>',
  move:     '<path d="M12 2v20M2 12h20M5 5l-3 3 3 3M19 5l3 3-3 3M5 19l-3-3 3-3M19 19l3-3-3-3"/>',
  scale:    '<path d="M8 3H3v5M16 3h5v5M8 21H3v-5M16 21h5v-5M3 3l7 7M21 3l-7 7M3 21l7-7M21 21l-7-7"/>',
  color:    '<circle cx="12" cy="12" r="8.5"/>',
  grid:     '<rect x="3" y="3" width="18" height="18" rx="1"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="15" y1="3" x2="15" y2="21"/>',
  settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z"/>',
  back:     '<path d="m15 18-6-6 6-6"/>',
  trash:    '<path d="M4 7h16M9 7V4h6v3m-8 0 1 13h8l1-13"/>',
  undo:     '<path d="M9 7 4 12l5 5"/><path d="M4 12h11a5 5 0 0 1 0 10h-1"/>',
  redo:     '<path d="m15 7 5 5-5 5"/><path d="M20 12H9a5 5 0 0 0 0 10h1"/>',
  home:     '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none"/>',
  add:      '<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>',
  arrowUp:    '<path d="M12 19V5M5 12l7-7 7 7"/>',
  arrowDown:  '<path d="M12 5v14M19 12l-7 7-7-7"/>',
  arrowLeft:  '<path d="M19 12H5M12 5l-7 7 7 7"/>',
  arrowRight: '<path d="M5 12h14M12 5l7 7-7 7"/>',
};

/* ---- h1 modules (top-level containers) ---- */
export const MODULES = [
  { id:'tools',    label:'Tools',    icon:'tools' },
  { id:'layers',   label:'Layers',   icon:'layers' },
  { id:'view',     label:'View',     icon:'view' },
  { id:'settings', label:'Settings', icon:'settings' },
  { id:'help',     label:'Help',     icon:'help' },
];

/* ---- tools shown inside the Tools module (default slide-menu content) ----
   `needs` describes when a tool is enabled vs greyed out:
   none = always enabled, one = needs exactly one shape selected,
   two = needs exactly two shapes selected. */
export const TOOLS = [
  { id:'select',  label:'Select',  icon:'select',  needs:'none' },
  { id:'shapes',  label:'Shapes',  icon:'shapes',  needs:'none' },
  { id:'boolean', label:'Boolean', icon:'boolean', needs:'two' },
  { id:'move',    label:'Move',    icon:'move',    needs:'one' },
  { id:'scale',   label:'Scale',   icon:'scale',   needs:'one' },
  { id:'colorTool', label:'Color', icon:'color',   needs:'one' },
  { id:'delete',  label:'Delete',  icon:'trash',   needs:'one' },
  { id:'undo',    label:'Undo',    icon:'undo',    needs:'none' },
  { id:'redo',    label:'Redo',    icon:'redo',    needs:'none' },
];

/* ---- shape definitions: 3D mode (direct primitives, instant insert at defaults) ----
   fields describe the mm dimensions used to build the geometry.
   H defaults to 15mm on every shape that has a separate height field. */
export const SHAPES_3D = [
  { id:'circle',    label:'Circle',    fields:{ D:30 } },
  { id:'square',    label:'Square',    fields:{ W:30 } },
  { id:'rectangle', label:'Rectangle', fields:{ L:30, W:15, H:15 } },
  { id:'cylinder',  label:'Cylinder',  fields:{ D:30, H:15 } },
  { id:'cone',      label:'Cone',      fields:{ D:30, H:15 } },
];

/* ---- shape definitions: 2D mode (sketch, then extrude) ----
   placeholder for now — flagged as not yet built in the engine. */
export const SHAPES_2D = [
  { id:'freehand', label:'Freehand', fields:{} },
  { id:'points',   label:'Point-by-point', fields:{} },
];

/* ---- boolean operations ---- */
export const BOOLEAN_OPS = [
  { id:'union',     label:'Union' },
  { id:'subtract',  label:'Subtract' },
  { id:'intersect', label:'Intersect' },
];

/* ---- color swatches (in-app organization only — STL stores no color) ---- */
export const SWATCHES = ['#c8a96e','#e0c48f','#7fae8e','#6e8fc8','#c1666b','#9a9ab0'];

/* ---- settings list ---- */
export const SETTINGS_ITEMS = [
  { id:'save',  label:'Save Scene' },
  { id:'load',  label:'Load Scene' },
  { id:'stl',   label:'Export STL' },
];

/* ---- plate / grid constants ---- */
export const PLATE = {
  size: 100,        // fixed printable bed, mm
  gridSquare: 5,     // fixed grid spacing, mm
  nudgeStep: 5,      // Move pad step, mm
};
