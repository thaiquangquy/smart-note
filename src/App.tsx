import React from "react";
import "./App.css";
import Sidebar from "./components/Sidebar";
import Editor from "./components/Editor";
import Split from "react-split";
import Note from "./interfaces/Note";
import { onSnapshot, addDoc, doc, deleteDoc, setDoc } from "firebase/firestore";
import { notesCollection, db } from "./firebase";

function App() {
  const [notes, setNotes] = React.useState<Note[]>([]);
  const [currentNoteId, setCurrentNoteId] = React.useState("");
  const [tempNoteText, setTempNoteText] = React.useState("");

  const sortedNotes = notes.sort(
    (a, b) => (b.updatedAt || 0) - (a.updatedAt || 0)
  );

  React.useEffect(() => {
    const unsubscribe = onSnapshot(notesCollection, function (snapshot) {
      const notesArr = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setNotes(notesArr);
    });
    return unsubscribe;
  }, []);

  React.useEffect(() => {
    if (!currentNoteId && notes[0]?.id) {
      setCurrentNoteId(notes[0]?.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notes]);

  React.useEffect(() => {
    if (currentNoteId) {
      const currentNote = notes.find((note) => note.id === currentNoteId);
      setTempNoteText(currentNote?.body || "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentNoteId]);

  async function createNewNote() {
    const newNote: Note = {
      body: "# Type your markdown note's title here",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    const newNoteRef = await addDoc(notesCollection, newNote);
    setCurrentNoteId(newNoteRef.id);
  }

  let timeoutId: NodeJS.Timeout | null = null;
  async function updateNoteWithDelay(text: string) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(async () => {
      const docRef = doc(db, "notes", currentNoteId);
      await setDoc(
        docRef,
        { body: text, updatedAt: Date.now() },
        { merge: true }
      );
      timeoutId = null;
    }, 500);
  }

  async function updateNote(text: string) {
    setTempNoteText(text);
    updateNoteWithDelay(text);
  }

  async function deleteNote(noteId: string) {
    const docRef = doc(db, "notes", noteId);
    await deleteDoc(docRef);
  }

  return (
    <main>
      {notes.length > 0 ? (
        <Split sizes={[30, 70]} direction="horizontal" className="split">
          <Sidebar
            notes={sortedNotes}
            currentNoteId={currentNoteId}
            setCurrentNoteId={setCurrentNoteId}
            newNote={createNewNote}
            deleteNote={deleteNote}
          />
          <Editor tempNoteText={tempNoteText} setTempNoteText={updateNote} />
        </Split>
      ) : (
        <div className="no-notes">
          <h1>You have no notes</h1>
          <button className="first-note" onClick={createNewNote}>
            Create one now
          </button>
        </div>
      )}
    </main>
  );
}

export default App;
