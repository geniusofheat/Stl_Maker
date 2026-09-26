import { S } from './stl_maker_state.js';
import { svg } from './stl_maker_icons.js';
import { deleteShape } from './stl_maker_geometry.js';
import { goToDrawingTools } from './stl_maker_navigation.js';
import { showToast } from './stl_maker_toast.js';


/* ─────────────────────────────────────────────────────────────
   H2
───────────────────────────────────────────────────────────── */

const h2Title=
  document.getElementById(
    'h2Title'
  );

const h2Info=
  document.getElementById(
    'h2Info'
  );

const btnUndo=
  document.getElementById(
    'btnUndo'
  );

const btnRedo=
  document.getElementById(
    'btnRedo'
  );

btnUndo.innerHTML=
  svg('undo')+
  '<span>Undo</span>';

btnRedo.innerHTML=
  svg('redo')+
  '<span>Redo</span>';

btnUndo.disabled=true;
btnRedo.disabled=true;


/* Undo / redo history.
   Each entry is { kind, undo(), redo() } — redo is optional.
   Placed shapes can be undone (removed); grid turns can be undone and redone. */

const undoStack=[];
const redoStack=[];


function refreshUndoRedo(){

  btnUndo.disabled=
    undoStack.length===0;

  btnRedo.disabled=
    redoStack.length===0;
}


export function pushHistory(entry){

  undoStack.push(entry);

  redoStack.length=0;

  refreshUndoRedo();
}


// drops history entries of one kind (used when the camera is reset)
export function clearHistoryKind(kind){

  for(const st of [undoStack,redoStack]){

    for(let i=st.length-1;i>=0;i--){

      if(st[i].kind===kind)
        st.splice(i,1);
    }
  }

  refreshUndoRedo();
}


export function armUndo(
  layerId,
  shapeId
){

  S.lastPlaced={
    layerId,
    shapeId
  };

  // only the latest placed shape can be undone
  clearHistoryKind('shape');

  pushHistory({
    kind:'shape',
    undo:() => {

      deleteShape(
        layerId,
        shapeId
      );

      goToDrawingTools();

      showToast(
        'Shape removed'
      );

      S.lastPlaced=null;
    }
  });
}


btnUndo.addEventListener(
  'click',
  () => {

    const entry=
      undoStack.pop();

    if(!entry)
      return;

    entry.undo();

    if(entry.redo)
      redoStack.push(entry);

    refreshUndoRedo();
  }
);


btnRedo.addEventListener(
  'click',
  () => {

    const entry=
      redoStack.pop();

    if(!entry)
      return;

    entry.redo();

    undoStack.push(entry);

    refreshUndoRedo();
  }
);


function ensureH2Back(){

  if(S.h2BackAttached)
    return;

  const wrap=
    h2Title.parentElement
      .parentElement;

  const backBtn=
    document.createElement(
      'button'
    );

  backBtn.id='h2Back';

  backBtn.style.cssText=
    'background:none;border:none;color:var(--gold-light);width:26px;height:26px;display:flex;align-items:center;justify-content:center;flex:0 0 auto;';

  backBtn.innerHTML=
    svg('back');

  backBtn.addEventListener(
    'click',
    () => {

      if(S.crumbBack)
        S.crumbBack();
    }
  );

  wrap.insertBefore(
    backBtn,
    wrap.firstChild
  );

  S.h2BackAttached=true;
}


ensureH2Back();


export function setH2(info){

  document
    .getElementById(
      'h2Back'
    )
    .style.display=
      S.crumbBack
        ? 'flex'
        : 'none';

  h2Title.textContent=
    S.crumbs.join(' - ');

  h2Info.textContent=
    info||'';
}


export const menuScroll=
  document.getElementById(
    'menuScroll'
  );

export const slideMenu=
  document.getElementById(
    'slideMenu'
  );

const expandTabEl=
  document.getElementById(
    'expandTab'
  );

if(expandTabEl)
  expandTabEl.remove();
