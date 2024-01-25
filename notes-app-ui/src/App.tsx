import './App.css';
import { useEffect, useState } from 'react';

type Note = {
  id: number;
  title: string;
  content: string;
};

function App() {
  const [notes, setNotes] = useState<Note[]>([
    
  ]);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  useEffect(() => {
    const fetchNotes = async () => {
      try{
        const response = await fetch('http://localhost:4000/api/notes');
        const notes: Note[] = await response.json();
        setNotes(notes);
      }catch(e){

      }
    };

    fetchNotes();
  }, []);

  const handleClickNote = (note: Note) => {
    setSelectedNote(note);
    setTitle(note.title);
    setContent(note.content);
  };

  const handleUpdateNote = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedNote) { return; }

    try{
      const response = await fetch(`http://localhost:4000/api/notes/${selectedNote.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title,
          content,
        })
      });
      const newNode = await response.json();
      const updatedNotesList = notes.map((note) => {
        if (note.id === selectedNote.id) {
          return newNode;
        }
        return note;
      });
      setNotes(updatedNotesList);
      setTitle("");
      setContent("");
      setSelectedNote(null);
  
    }catch(e){

    }
  }

  const handleCancel = () => {
    setTitle("");
    setContent("");
    setSelectedNote(null);
  }

  const handleAddNote =  async (event: React.FormEvent) => {
    event.preventDefault();
    console.log(title, content);
    try{
      const response = await fetch('http://localhost:4000/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title : title,
          content : content
        })
      });
      const newNode = await response.json();
      setNotes([newNode, ...notes]);
      setTitle("");
      setContent("");
    }catch(e){

    }
  };

  const deleteNode = async (event : React.MouseEvent, noteId : number) => {
    event.stopPropagation();
    try{
      await fetch(`http://localhost:4000/api/notes/${noteId}`, {
        method: 'DELETE',
      });
      const updatedNotesList = notes.filter((note) => note.id !== noteId);
      setNotes(updatedNotesList);
    }catch(e){

    }
   
  }

  return (
    <div className='app-container'>
      <form className="note-form" onSubmit={(event) => selectedNote ? handleUpdateNote(event) :  handleAddNote(event)}>
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Title" required
        />
        <textarea
          value={content}
          onChange={(event) => setContent(event.target.value)}
          placeholder="Content" rows={10} required />
        {selectedNote ?
          (<div className="edit-buttons">
            <button type="submit">Save</button>
            <button onClick={handleCancel}>Cancel</button>
          </div>
          ) :
          (
            <button type="submit">Add Note</button>
          )
        }
      </form>
      <div className="notes-grid">
        {notes.map((note) => (
          <div className="note-item" onClick={() => {
            handleClickNote(note)
          }}>
            <div className="notes-header">
              <button
              onClick={(event) => deleteNode(event, note.id)}
              >x</button>
            </div>
            <h2>{note.title}</h2>
            <p>{note.content}</p>
          </div>
        ))}
      </div>
    </div>

  );
}

export default App;
