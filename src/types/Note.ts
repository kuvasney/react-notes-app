export interface Reminder {
  id: string;
  dateTime: string;
  text: string;
}

export interface Note {
  _id?: string; // MongoDB ID
  id: string;
  userId: string;
  order: number;
  title: string;
  content: string;
  createdAt?: Date;
  updatedAt?: Date;
  archived: boolean;
  color: string;
  tags: string[];
  pinned: boolean;
  reminders: Reminder[];
  collaborators: string[];
  isPublic: boolean;
  shareToken?: string;

  // Campos antigos para compatibilidade (serão removidos gradualmente)
  titulo?: string;
  conteudo?: string;
  dataCriacao?: string;
  dataUltimaEdicao?: string;
  cor?: string;
  lembretes?: Reminder[];
  colaboradores?: string[];
}

// Types utilitários para o app de notas
export type NoteStatus = "active" | "archived";
export type NoteSortBy = "createdAt" | "updatedAt" | "title";
export type NoteSortOrder = "asc" | "desc";

export interface NoteFilters {
  status: NoteStatus;
  tags: string[];
  searchTerm: string;
  sortBy: NoteSortBy;
  sortOrder: NoteSortOrder;
}

export interface CreateNoteDto {
  title: string;
  content: string;
  color?: string;
  tags?: string[];
  pinned?: boolean;
  isPublic?: boolean;
}

export interface UpdateNoteDto extends Partial<CreateNoteDto> {
  id: string;
  updatedAt?: Date;
}
