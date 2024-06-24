import SidebarProps from "../interfaces/SidebarProps";

export default function Sidebar(props: SidebarProps) {
  const noteElements = props.notes.map((note, index) => (
    <div key={note.id}>
      <div
        className={`title ${
          note.id === props.currentNoteId ? "selected-note" : ""
        }`}
        onClick={() => {
          if (note.id) {
            props.setCurrentNoteId(note.id);
          }
        }}
      >
        <h4 className="text-snippet">
          {note.body ? note.body.split("\n")[0] : ""}
        </h4>
        <button
          className="delete-btn"
          onClick={() => {
            if (note.id) {
              props.deleteNote(note.id);
            }
          }}
        >
          <i className="gg-trash trash-icon"></i>
        </button>
      </div>
    </div>
  ));

  return (
    <section className="pane sidebar">
      <div className="sidebar--header">
        <h3>Notes</h3>
        <button className="new-note" onClick={props.newNote}>
          +
        </button>
      </div>
      {noteElements}
    </section>
  );
}
