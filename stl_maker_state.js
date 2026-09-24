/* ─────────────────────────────────────────────────────────────
   STATE
   Shared values that used to be top-level "let" variables in the
   engine file. Every section file reads/writes them as S.name
   (a module can't reassign a variable it imported, so they live
   on this one shared object instead).
───────────────────────────────────────────────────────────── */

export const S = {
  shapeMode: '2d',  // was top-level let in "THREE.JS"
  mmLabelGroup: null,  // was top-level let in "THREE.JS"
  mmState: 'off',  // was top-level let in "THREE.JS"
  rotationLocked: true,  // was top-level let in "THREE.JS"
  nextLayerId: 1,  // was top-level let in "DATA"
  activeLayerId: null,  // was top-level let in "DATA"
  activeShapeId: null,  // was top-level let in "DATA"
  crosshairActive: false,  // was top-level let in "SELECTION"
  activeModule: 'tools',  // was top-level let in "MODULE / H1"
  lastPlaced: null,  // was top-level let in "H2"
  crumbs: ['Drawing Tools'],  // was top-level let in "H2"
  crumbBack: null,  // was top-level let in "H2"
  h2BackAttached: false,  // was top-level let in "H2"
  pendingP2P: null,  // was top-level let in "P2P"
  selectedAxis: 'X',  // was top-level let in "OBJECT MANIPULATION"
  manipulationActive: false,  // was top-level let in "OBJECT MANIPULATION"
  manipulationCleanup: null,  // was top-level let in "OBJECT MANIPULATION"
  toastTimer: null,  // was top-level let in "TOAST"
};
