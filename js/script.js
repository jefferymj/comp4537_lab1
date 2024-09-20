/* ChatGPT Acknowledgement:
    This is to acknowledge that I have used the assistance of ChatGPT for various explainations and code generation whenever I found myself stuck and in need of help. */

class NoteApp {
    constructor() {
        this.notes = [];
        this.init();
    }

    init() {
        // Check if we're on writer.html or reader.html
        this.writerPage = document.getElementById('notes-container');
        this.readerPage = document.getElementById('notes-display');

        if (this.writerPage) {
            this.loadNotesForWriter();
            const addNoteButton = document.getElementById('add-note');
            if (addNoteButton) {
                addNoteButton.innerText = messages.addNote;
                addNoteButton.onclick = () => this.addNote();
            }
            setInterval(() => this.saveNotes(), 2000);
        } else if (this.readerPage) {
            this.loadNotesForReader();
            setInterval(() => this.loadNotesForReader(), 2000);
        }
    }

    // Load existing notes from localStorage
    loadStoredNotes() {
        const storedNotes = JSON.parse(localStorage.getItem('notes'));
        if (storedNotes) {
            this.notes = storedNotes;
        }
    }

    // Writer Functions
    loadNotesForWriter() {
        this.loadStoredNotes();
        this.notes.forEach((note, index) => {
            this.createNoteElement(note, index);
        });
    }

    createNoteElement(content, index) {
        const noteDiv = document.createElement('div');
        const textarea = document.createElement('textarea');
        textarea.value = content;
        textarea.oninput = () => {
            this.notes[index] = textarea.value;
        };
        const removeButton = document.createElement('button');
        removeButton.innerText = messages.removeNote;
        removeButton.onclick = () => this.removeNote(index);
        noteDiv.appendChild(textarea);
        noteDiv.appendChild(removeButton);
        this.writerPage.appendChild(noteDiv);
    }

    addNote() {
        const newNoteIndex = this.notes.length;
        this.notes.push('');
        this.createNoteElement('', newNoteIndex);
    }

    removeNote(index) {
        this.notes.splice(index, 1);
        this.saveNotes();
        this.writerPage.innerHTML = '';
        this.notes.forEach((note, idx) => this.createNoteElement(note, idx)); // Re-create the notes
    }

    saveNotes() {
        localStorage.setItem('notes', JSON.stringify(this.notes));
        this.updateSaveTime();
    }

    updateSaveTime() {
        const saveTimeElement = document.getElementById('save-time');
        if (saveTimeElement) {
            saveTimeElement.innerText = `${messages.storedAt} ${new Date().toLocaleTimeString()}`;
        }
    }

    // Reader Functions
    loadNotesForReader() {
        this.loadStoredNotes();
        this.readerPage.innerHTML = '';
        if (this.notes.length === 0) {
            const noNotesMessage = document.createElement('div');
            noNotesMessage.innerText = messages.noNotes;
            this.readerPage.appendChild(noNotesMessage);
        } else {
            this.notes.forEach(note => {
                const noteDiv = document.createElement('div');
                noteDiv.innerText = note;
                this.readerPage.appendChild(noteDiv);
            });
        }
        this.updateUpdateTime();
    }

    updateUpdateTime() {
        const updateTimeElement = document.getElementById('update-time');
        if (updateTimeElement) {
            updateTimeElement.innerText = `${messages.updatedAt} ${new Date().toLocaleTimeString()}`;
        }
    }
}

window.onload = function() {
    new NoteApp();
};
