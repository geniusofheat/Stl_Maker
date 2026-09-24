/* ─────────────────────────────────────────────────────────────
   STYLES
───────────────────────────────────────────────────────────── */

const style = document.createElement('style');

style.textContent = `
.module-btn.active-blue{
  background:#3a6fd8 !important;
  border-color:#3a6fd8 !important;
  color:#fff !important;
}
.module-btn.active-blue svg{color:#fff !important}

#slideMenu{transition:none !important}
#slideMenu.open{width:92px;min-width:92px}

.toggle-row2{
  display:flex;
  gap:4px;
  width:100%;
}

.toggle-row2 button{
  flex:1;
  padding:6px 1px;
  border-radius:7px;
  border:1px solid var(--line);
  background:var(--navy-3);
  color:var(--ink);
  font-size:9.5px;
  font-weight:700;
}

.toggle-row2 button.toggle-active{
  background:#3a6fd8;
  color:#fff;
  border-color:#3a6fd8;
}

.add-rect{
  width:100%;
  padding:6px 1px;
  border-radius:7px;
  border:1px solid var(--line);
  background:var(--navy-3);
  color:var(--gold-light);
  font-size:8.5px;
  font-weight:700;
  display:flex;
  align-items:center;
  justify-content:center;
  gap:3px;
}

.add-rect svg{
  width:12px;
  height:12px;
}

.h3-stack{
  display:flex;
  flex-direction:column;
  gap:6px;
  width:100%;
}

.menu-scroll{
  align-items:center;
}

.tile3{
  display:flex;
  flex-direction:column;
  align-items:center;
  justify-content:center;
  gap:3px;
  width:72px;
  aspect-ratio:1;
  border-radius:12px;
  background:var(--navy-3);
  border:1px solid var(--line);
  color:var(--ink);
  padding:4px 3px;
  position:relative;
}

.tile3 svg{
  width:16px;
  height:16px;
  color:var(--gold-light);
  flex:0 0 auto;
}

.tile3 span{
  font-size:8.5px;
  font-weight:600;
  text-align:center;
  line-height:1.1;
  display:block;
  overflow:hidden;
  text-overflow:ellipsis;
  max-height:2.2em;
}

.tile3.toggle-active{
  background:#3a6fd8;
  border-color:#3a6fd8;
  color:#fff;
}

.tile3.toggle-active svg{
  color:#fff;
}

.tile3.layer-active{
  background:#fff;
  border:2px solid #3a6fd8;
  color:#111;
}

.tile3.layer-active svg{
  color:#3a6fd8;
}

.tile3.layer-active span{
  color:#111;
}

.tile-num{
  position:absolute;
  top:-7px;
  right:-4px;
  background:var(--gold);
  color:var(--navy);
  font-size:9px;
  font-weight:800;
  width:17px;
  height:17px;
  border-radius:50%;
  display:flex;
  align-items:center;
  justify-content:center;
}

.tile-del{
  position:absolute;
  bottom:-7px;
  right:-7px;
  width:20px;
  height:20px;
  border-radius:6px;
  background:var(--navy);
  border:1px solid var(--line);
  color:var(--muted);
  display:flex;
  align-items:center;
  justify-content:center;
  z-index:2;
}

.tile-del svg{
  width:11px;
  height:11px;
}

.tile-del.armed{
  background:var(--danger);
  color:#fff;
  border-color:var(--danger);
}

.stepper-row{
  display:flex;
  align-items:center;
  gap:3px;
  width:100%;
  min-width:0;
  padding:0 3px;
  box-sizing:border-box;
}

.stepper-row .step-lbl{
  display:flex;
  align-items:center;
  justify-content:center;
  width:18px;
  min-width:18px;
  height:28px;
  font-family:'JetBrains Mono',monospace;
  font-size:8px;
  color:var(--gold);
  flex:0 0 auto;
  text-align:center;
  border:1px solid var(--line);
  border-radius:6px;
  background:var(--navy-3);
  cursor:pointer;
}

.stepper-row .step-lbl.axis-active{
  background:#3a6fd8;
  border-color:#3a6fd8;
  color:#fff;
}

.stepper-row button{
  width:28px;
  height:28px;
  flex:0 0 auto;
  background:var(--navy-3);
  border:1px solid var(--line);
  border-radius:6px;
  color:var(--gold-light);
  font-size:15px;
  font-weight:700;
  line-height:1;
  padding:0;
}

.stepper-row button:active{
  background:var(--gold);
  color:var(--navy);
}

.stepper-row input{
  flex:1 1 0;
  min-width:0;
  width:0;
  height:28px;
  box-sizing:border-box;
  background:#fff;
  color:#111;
  border:1px solid var(--line);
  border-radius:6px;
  font-family:'JetBrains Mono',monospace;
  font-size:9px;
  padding:3px 1px;
  text-align:center;
}

.stepper-row .value-button{
  flex:1 1 0;
  min-width:0;
  height:28px;
  background:#fff;
  color:#111;
  border:1px solid var(--line);
  border-radius:6px;
  font-family:'JetBrains Mono',monospace;
  font-size:8.5px;
  padding:0 2px;
  text-align:center;
}

.stepper-row .value-button[data-axis]{
  cursor:pointer;
}

.stepper-row .value-button.axis-active{
  background:#3a6fd8;
  border-color:#3a6fd8;
  color:#fff;
}

.stepper-row.all-axes .step-lbl{
  width:28px;
  min-width:28px;
  font-size:7px;
  text-transform:uppercase;
}

.stepper-stack{
  display:flex;
  flex-direction:column;
  gap:5px;
  width:100%;
  padding:0;
  box-sizing:border-box;
}

.action-col{
  display:flex;
  flex-direction:column;
  gap:4px;
  width:100%;
}

.action-col button{
  display:flex;
  flex-direction:row;
  align-items:center;
  gap:6px;
  background:var(--navy-3);
  border:1px solid var(--line);
  border-radius:8px;
  color:var(--ink);
  padding:7px 6px;
  width:100%;
}

.action-col button svg{
  width:15px;
  height:15px;
  color:var(--gold-light);
  flex:0 0 auto;
}

.action-col button span{
  font-size:9px;
  font-weight:600;
}

.action-col button.active{
  border-color:#3a6fd8;
  background:#3a6fd8;
  color:#fff;
}

.action-col button.active svg{
  color:#fff;
}

.action-col button:disabled{
  opacity:.35;
}

.tile-row{
  display:flex;
  flex-wrap:wrap;
  gap:8px;
  justify-content:center;
  width:100%;
}

.swatch-row{
  display:flex;
  flex-wrap:wrap;
  gap:6px;
  justify-content:center;
  width:100%;
}

#lockBtn,
#mmBtn,
#modeToggle{
  position:absolute;
  top:10px;
  z-index:6;
  height:36px;
  background:rgba(32,33,58,.9);
  border:1px solid var(--line);
  border-radius:9px;
  color:var(--gold-light);
  display:flex;
  align-items:center;
  justify-content:center;
}

#modeToggle{
  left:10px;
  padding:3px;
  gap:3px;
}

#modeToggle button{
  height:100%;
  padding:0 10px;
  border-radius:6px;
  border:none;
  background:transparent;
  color:var(--muted);
  font-size:11px;
  font-weight:700;
}

#modeToggle button.toggle-active{
  background:#3a6fd8;
  color:#fff;
}

#mmBtn{
  left:118px;
  padding:0 9px;
  font-family:'JetBrains Mono',monospace;
  font-size:10.5px;
  font-weight:700;
  gap:5px;
}

#lockBtn{
  right:10px;
  width:36px;
}

#lockBtn svg{
  width:17px;
  height:17px;
}

#lockBtn.unlocked{
  color:var(--muted);
}

#mmBtn .seg{
  opacity:.4;
}

#mmBtn .seg.on{
  opacity:1;
  color:#fff;
}

#mmBtn .sep{
  opacity:.3;
}

#crosshairCursor{
  position:absolute;
  display:none;
  align-items:center;
  justify-content:center;
  width:34px;
  height:34px;
  pointer-events:none;
  z-index:7;
  color:#3a6fd8;
  font-size:30px;
  line-height:1;
  text-shadow:0 1px 2px #000;
}

#moveCursor{
  position:absolute;
  display:none;
  width:34px;
  height:34px;
  pointer-events:none;
  z-index:20;
  color:#3a6fd8;
  font-size:30px;
  line-height:30px;
  text-shadow:0 1px 2px #000;
}

#moveCursor span{
  display:block;
  transform:rotate(-8deg);
}

#confirmOverlay{
  position:absolute;
  inset:0;
  z-index:50;
  background:rgba(0,0,0,.55);
  display:flex;
  align-items:center;
  justify-content:center;
}

#confirmOverlay.hidden{
  display:none;
}

.confirm-box{
  background:var(--navy-2);
  border:1px solid var(--line);
  border-radius:12px;
  padding:18px;
  width:78%;
  max-width:280px;
  text-align:center;
}

.confirm-box p{
  font-size:13px;
  color:var(--ink);
  margin:0 0 14px;
}

.confirm-row{
  display:flex;
  gap:10px;
}

.confirm-row button{
  flex:1;
  padding:10px;
  border-radius:8px;
  font-size:13px;
  font-weight:700;
  border:1px solid var(--line);
}

.confirm-yes{
  background:var(--danger);
  color:#fff;
  border-color:var(--danger);
}

.confirm-no{
  background:var(--navy-3);
  color:var(--ink);
}

#h2Title{
  white-space:normal !important;
  word-break:break-word;
}
`;

document.head.appendChild(style);
