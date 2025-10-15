export interface Reminder {
  id: string
  dataHora: string
  texto: string
}

export interface Note {
  id: string
  titulo: string
  conteudo: string
  dataCriacao: string
  dataUltimaEdicao: string
  archived: boolean
  cor: string
  tags: string[]
  fixada: boolean
  lembretes: Reminder[]
  colaboradores: string[]
}

// Types utilitários para o app de notas
export type NoteStatus = 'active' | 'archived'
export type NoteSortBy = 'dataCriacao' | 'dataUltimaEdicao' | 'titulo'
export type NoteSortOrder = 'asc' | 'desc'

export interface NoteFilters {
  status: NoteStatus
  tags: string[]
  searchTerm: string
  sortBy: NoteSortBy
  sortOrder: NoteSortOrder
}

export interface CreateNoteDto {
  titulo: string
  conteudo: string
  cor?: string
  tags?: string[]
  fixada?: boolean
}

export interface UpdateNoteDto extends Partial<CreateNoteDto> {
  id: string
  dataUltimaEdicao: string
}