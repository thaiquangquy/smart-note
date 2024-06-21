import Note from "./Note";

export default interface EditorProps {
  currentNote: Note;
  updateNote: (value: string) => void;
}
