import type { Note } from "@/types/Note";

/**
 * Transforma dados do MongoDB para o formato esperado pelo frontend
 * Lida com ObjectId, datas do MongoDB e remove campos desnecessários
 */
export const transformMongoNote = (mongoNote: any): Note => {
  const { _id, __v, dataCriacao, dataUltimaEdicao, ...rest } = mongoNote;

  // Extrair ID do formato MongoDB
  let id: string;
  if (typeof _id === "object" && _id.$oid) {
    id = _id.$oid; // Formato {"$oid": "..."}
  } else if (typeof _id === "string") {
    id = _id; // Já é string
  } else {
    id = _id?.toString() || rest.id; // Fallback
  }

  // Extrair datas do formato MongoDB
  const parseDateField = (dateField: any): string => {
    if (typeof dateField === "object" && dateField.$date) {
      return dateField.$date; // Formato {"$date": "..."}
    }
    if (typeof dateField === "string") {
      return dateField; // Já é string ISO
    }
    return new Date().toISOString(); // Fallback
  };

  return {
    ...rest,
    id,
    _id: id, // Mantém referência para edições
    dataCriacao: parseDateField(dataCriacao),
    dataUltimaEdicao: parseDateField(dataUltimaEdicao),
    // __v é removido automaticamente pela desestruturação
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
 * Remove campos que não devem ser enviados
 */
export const transformNoteForMongo = (note: Partial<Note>): any => {
  const { _id, id, ...noteData } = note;

  // Se tem _id (vem do MongoDB), use-o como identificador principal
  if (_id) {
    return {
      _id,
      ...noteData,
    };
  }

  // Se tem ID e parece ser do MongoDB (24 chars hex), use como _id
  if (id && /^[0-9a-fA-F]{24}$/.test(id)) {
    return {
      _id: id,
      ...noteData,
    };
  }

  // Para novas notas ou IDs inválidos, não enviar ID
  // Deixa o MongoDB gerar o _id automaticamente
  return noteData;
};
