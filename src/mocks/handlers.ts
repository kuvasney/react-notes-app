import { http, HttpResponse } from "msw";
import mockNotes from "./mockNotes.json";
import mockUsers from "./mockUsers.json";
import mockLogin from "./mockLogin.json";

export const handlers = [
  // GET /api/users/login
  http.post("*/api/users/login", async () => {
    // Simular delay de rede
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Simular erro ocasional (10% das vezes)
    if (Math.random() < 0.1) {
      return new HttpResponse(null, { status: 500 });
    }

    return HttpResponse.json(mockLogin);
  }),
  // GET /api/notes
  // Simular latência e possíveis erros
  http.get("*/api/notes", async () => {
    // Simular delay de rede
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Simular erro ocasional (10% das vezes)
    if (Math.random() < 0.1) {
      return new HttpResponse(null, { status: 500 });
    }

    // Retornar no formato da nova API com paginação
    // mockNotes já tem formato {notes: [...], pagination: {...}}
    return HttpResponse.json(mockNotes);
  }),

  // POST /api/notes
  // Simular latência e possíveis erros
  http.post("*/api/notes", async () => {
    // Simular delay de rede
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Simular erro ocasional (10% das vezes)
    if (Math.random() < 0.1) {
      return new HttpResponse(null, { status: 500 });
    }

    return HttpResponse.json({ success: true }, { status: 201 });
  }),

  // PUT /api/notes/:id - Atualizar nota específica
  http.put("*/api/notes/:id", async ({ params }) => {
    const { id } = params;

    // Simular delay de rede
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Simular erro ocasional (10% das vezes)
    if (Math.random() < 0.1) {
      return new HttpResponse(null, { status: 500 });
    }

    console.log(`Atualizando nota com ID: ${id}`);
    return HttpResponse.json({ success: true, id }, { status: 200 });
  }),

  // DELETE /api/notes/:id - Atualizar nota específica
  http.delete("*/api/notes/:id", async ({ params }) => {
    const { id } = params;

    // Simular delay de rede
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Simular erro ocasional (10% das vezes)
    if (Math.random() < 0.1) {
      return new HttpResponse(null, { status: 500 });
    }

    console.log(`Excluída nota com ID: ${id}`);
    return HttpResponse.json({ success: true, id }, { status: 200 });
  }),
];
