import Note from "./Note";

export default interface SidebarProps {
  notes: Note[];
  currentNote: Note;
  setCurrentNoteId: (id: string) => void;
  newNote: () => void;
}
