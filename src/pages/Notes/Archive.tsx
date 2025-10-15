import { useNotesStore } from '@/stores/notesStore'
import { useNotesApi } from '@/hooks/useNotesApi'
import NotesContent from "./components/NotesContent"
import NotesContentSkeleton from "./components/NotesContentSkeleton"
import { NavLink } from 'react-router-dom'

export default function Archive () {
  // Usar a store
  const { getArchivedNotes, loading } = useNotesStore()

  // Carregar dados da API (SEMPRE executar)
  useNotesApi()

  // Obter notas arquivadas
  const archivedNotes = getArchivedNotes()


  return (
    <div className="content-wrapper">
      <section className='notes-list'>
        <h1>
          Archived Notes
        </h1>
        {loading ? (
          <NotesContentSkeleton />
        ) : (
          <NotesContent notes={archivedNotes} />
        )}
      </section>
      <NavLink to="/notes" className="btn btn-primary">
        Active notes
      </NavLink>
    </div>
  )
}
