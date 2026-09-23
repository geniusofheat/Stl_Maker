/* STL Maker — static application data */

const ICONS = {
  add:'<path d="M12 5v14M5 12h14"/>',
  back:'<path d="m15 18-6-6 6-6"/>',
  boolean:'<circle cx="9" cy="12" r="6"/><circle cx="15" cy="12" r="6"/>',
  layers:'<path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="m3 12 9 5 9-5"/><path d="m3 16 9 5 9-5"/>',
  redo:'<path d="M4 7v5h5"/><path d="M5 12a7 7 0 0 1 12-4l3 4"/>',
  settings:'<path d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z"/><path d="M4.9 4.9 7 7m10-2.1L15 7M4 12H2m20 0h-2M4.9 19.1 7 17m10 2.1L15 17M12 4V2m0 20v-2"/>',
  shapes:'<rect x="3" y="3" width="7" height="7"/><circle cx="17" cy="7" r="4"/><path d="m3 21 6-7 6 7H3Z"/><path d="M17 14v7M14 17h6"/>',
  trash:'<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7l1-3h4l1 3"/>',
  undo:'<path d="M20 7v5h-5"/><path d="M19 12a7 7 0 0 0-12-4L4 12"/>',
  select:'<path d="m5 3 5 14 2-6 6-2L5 3Z"/>',
  move:'<path d="M12 2v20M2 12h20"/><path d="m8 6 4-4 4 4M8 18l4 4 4-4M6 8l-4 4 4 4M18 8l4 4-4 4"/>',
  rotate:'<path d="M20 11a8 8 0 0 0-14.9-4L3 9"/><path d="M3 4v5h5"/><path d="M4 13a8 8 0 0 0 14.9 4L21 15"/><path d="M21 20v-5h-5"/>',
  scale:'<path d="M4 4h6M4 4v6M20 4h-6M20 4v6M4 20h6M4 20v-6M20 20h-6M20 20v-6"/>',
  color:'<path d="M12 3a9 9 0 0 0 0 18h1.5a2.5 2.5 0 0 0 0-5H12a2 2 0 0 1 0-4h2a7 7 0 0 0-2-9Z"/><circle cx="7" cy="10" r="1"/><circle cx="10" cy="7" r="1"/><circle cx="15" cy="8" r="1"/>',
  lock:'<rect x="5" y="10.5" width="14" height="9.5" rx="1.5"/><path d="M8 10.5V7a4 4 0 0 1 8 0v3.5"/>',
  unlock:'<rect x="5" y="10.5" width="14" height="9.5" rx="1.5"/><path d="M8 10.5V7a4 4 0 0 1 7.5-2"/>',
  twod:'<rect x="4" y="4" width="16" height="16" rx="2"/>',
  threed:'<path d="M12 2 3 7.5 12 12l9-4.5L12 2Z"/><path d="M3 7.5v9L12 21l9-4.5v-9"/>',
  pencil:'<path d="m14 4 6 6-11 11H3v-6L14 4Z"/><path d="m13.5 5.5 5 5"/>'
};

const MODULES = [
  {id:'tools',label:'Drawing Tools',icon:'pencil'},
  {id:'layers',label:'Layers',icon:'layers'},
  {id:'settings',label:'Settings',icon:'settings'},
  {id:'help',label:'Help',icon:'settings'}
];

const SHAPES_3D = ['circle','square','rectangle','cylinder','cone','triangle','octagon','oval'];

const SWATCHES = ['#e0c48f','#d9534f','#5cb85c','#4a90d9','#9b59b6','#f39c12','#ecf0f1','#333333'];
