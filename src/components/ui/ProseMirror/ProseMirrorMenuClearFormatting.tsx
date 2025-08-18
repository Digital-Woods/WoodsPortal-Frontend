import {MenuItem as MenuItem2} from "prosemirror-menu"
import {setBlockType} from "prosemirror-commands"

const clearFormattingNote = (state: any, dispatch: any) => {
  const { schema, selection } = state;
  const { from, to } = selection;

  if (!dispatch) return false;

  let tr = state.tr;

  // Remove all active marks
  schema.marks &&
    Object.keys(schema.marks).forEach((markName) => {
      const markType = schema.marks[markName];
      if (markType) {
        tr = tr.removeMark(from, to, markType);
      }
    });

  // Reset block type to paragraph
  const paragraphType = schema.nodes.paragraph;
  if (paragraphType) {
    setBlockType(paragraphType)(state, dispatch);
  }

  dispatch(tr);
  return true;
};

export const clearFormattingNoteMenuItem = new MenuItem2({
  title: "Clear Formatting",
  icon: {
    dom: (() => {
      const span = document.createElement("span");
      span.innerHTML = `
        <svg version="1.0" xmlns="http://www.w3.org/2000/svg"
          width="15px" height="15px" viewBox="0 0 30.000000 38.000000"
          preserveAspectRatio="xMidYMid meet">

          <g transform="translate(0.000000,38.000000) scale(0.100000,-0.100000)"
          fill="#666666" stroke="none">
          <path d="M47 334 c-15 -15 -6 -24 23 -24 35 0 35 -2 14 -82 -11 -42 -12 -64
          -5 -71 15 -15 17 -11 38 73 l19 75 38 3 c23 2 36 8 33 15 -4 13 -148 23 -160
          11z"/>
          <path d="M140 162 c0 -5 9 -17 20 -27 l20 -18 -20 -22 c-29 -31 -26 -54 3 -27
          29 27 35 27 64 0 18 -16 23 -18 23 -6 0 8 -9 23 -20 33 l-20 18 22 24 c28 30
          15 43 -15 15 l-24 -22 -18 20 c-19 21 -35 26 -35 12z"/>
          <path d="M40 110 c0 -5 20 -10 45 -10 25 0 45 5 45 10 0 6 -20 10 -45 10 -25
          0 -45 -4 -45 -10z"/>
          </g>
        </svg>
      `;
      span.className = "note-menuitem";
      return span;
    })(),
  },
  enable: (state: any) => true,
  // enable: (state) => !state.selection.empty,
  run: clearFormattingNote,
});
