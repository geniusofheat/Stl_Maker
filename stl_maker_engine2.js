/* STL Maker Engine — modular bootstrap */

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { STLExporter } from 'three/addons/exporters/STLExporter.js';

const SUBSYSTEMS = [
  'stl_maker_data.js',
  'stl_maker_core.js',
  'stl_maker_layers.js',
  'stl_maker_shapes.js',
  'stl_maker_drawing.js',
  'stl_maker_transform.js',
  'stl_maker_settings.js',
  'stl_maker_ui.js'
];

globalThis.THREE=THREE;
globalThis.OrbitControls=OrbitControls;
globalThis.STLExporter=STLExporter;

function loadScript(src){
  return new Promise((resolve,reject)=>{
    const script=document.createElement('script');
    script.src=new URL(src,import.meta.url).href;
    script.async=false;
    script.onload=resolve;
    script.onerror=()=>reject(new Error(`Failed to load ${src}`));
    document.head.appendChild(script);
  });
}

for(const src of SUBSYSTEMS) await loadScript(src);

refreshModeScene();
refreshModeToggle();
renderH1();
goToDrawingTools();
