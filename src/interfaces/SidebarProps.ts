import Note from "./Note";

export default interface SidebarProps {
  notes: Note[];
  currentNoteId: string;
  setCurrentNoteId: (id: string) => void;
  deleteNote: (id: string) => void;
  newNote: () => void;
}
