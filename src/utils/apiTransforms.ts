import type { Note, Reminder } from "@/types/Note";

/**
 * Transforma dados do MongoDB (inglês) para o formato do frontend
 * Suporta tanto o formato novo (inglês) quanto o antigo (português)
 */
export const transformMongoNote = (mongoNote: any): Note => {
  const { _id, __v, ...rest } = mongoNote;

  // Extrair ID do formato MongoDB
  let id: string;
  if (typeof _id === "object" && _id.$oid) {
    id = _id.$oid; // Formato {"$oid": "..."}
  } else if (typeof _id === "string") {
    id = _id; // Já é string
  } else {
    id = _id?.toString() || rest.id; // Fallback
  }

  // Função auxiliar para parsear datas
  const parseDate = (dateField: any): Date | undefined => {
    if (!dateField) return undefined;
    if (typeof dateField === "object" && dateField.$date) {
      return new Date(dateField.$date);
    }
    if (typeof dateField === "string") {
      return new Date(dateField);
    }
    return undefined;
  };

  // Função auxiliar para transformar Reminders
  const transformReminders = (reminders: any[]): Reminder[] => {
    if (!reminders || !Array.isArray(reminders)) return [];
    return reminders.map((r) => ({
      id: r.id || r._id?.toString(),
      dateTime: r.dateTime || r.dataHora || "",
      text: r.text || r.texto || "",
    }));
  };

  // Retorna objeto com campos novos (inglês) e compatibilidade com antigos (português)
  return {
    _id: id,
    id,
    userId: rest.userId || "",
    order: rest.order || 0,

    // Campos principais (inglês)
    title: rest.title || rest.titulo || "",
    content: rest.content || rest.conteudo || "",
    color: rest.color || rest.cor || "#fff475",
    tags: rest.tags || [],
    archived: rest.archived || false,
    pinned: rest.pinned || false,
    reminders: transformReminders(rest.reminders || rest.lembretes || []),
    collaborators: rest.collaborators || rest.colaboradores || [],
    isPublic: rest.isPublic || false,
    shareToken: rest.shareToken,

    // Datas
    createdAt: parseDate(rest.createdAt || rest.dataCriacao),
    updatedAt: parseDate(rest.updatedAt || rest.dataUltimaEdicao),

    // Campos antigos para compatibilidade reversa
    titulo: rest.title || rest.titulo || "",
    conteudo: rest.content || rest.conteudo || "",
    cor: rest.color || rest.cor || "#fff475",
    lembretes: transformReminders(rest.reminders || rest.lembretes || []),
    colaboradores: rest.collaborators || rest.colaboradores || [],
    dataCriacao: (
      parseDate(rest.createdAt || rest.dataCriacao) || new Date()
    ).toISOString(),
    dataUltimaEdicao: (
      parseDate(rest.updatedAt || rest.dataUltimaEdicao) || new Date()
    ).toISOString(),
  };
};

/**
 * Transforma array de notas do MongoDB
 */
export const transformMongoNotes = (mongoNotes: any[]): Note[] => {
  return mongoNotes.map(transformMongoNote);
};

/**
 * Transforma dados do frontend para envio ao MongoDB
 * Converte campos em português para inglês se necessário
 */
export const transformNoteForMongo = (note: Partial<Note>): any => {
  const {
    _id,
    id,
    // Remover campos antigos que não devem ir para o backend
    titulo,
    conteudo,
    cor,
    lembretes,
    colaboradores,
    dataCriacao,
    dataUltimaEdicao,
    ...rest
  } = note;

  // Preparar objeto para envio
  const mongoNote: any = {
    ...rest,
    // Garantir que os campos estejam em inglês
    title: note.title || note.titulo || "",
    content: note.content || note.conteudo || "",
    color: note.color || note.cor || "#fff475",
    reminders: note.reminders || note.lembretes || [],
    collaborators: note.collaborators || note.colaboradores || [],
  };

  // Adicionar _id se existir
  if (_id) {
    mongoNote._id = _id;
  } else if (id && /^[0-9a-fA-F]{24}$/.test(id)) {
    mongoNote._id = id;
  }

  return mongoNote;
};
