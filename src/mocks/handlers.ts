import { http, HttpResponse } from "msw";
import mockNotes from "./mockNotes.json";

export const handlers = [
  // GET /api/notes
  // Simular latência e possíveis erros
  http.get("/api/notes", async () => {
    // Simular delay de rede
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Simular erro ocasional (10% das vezes)
    if (Math.random() < 0.1) {
      return new HttpResponse(null, { status: 500 });
    }

    return HttpResponse.json(mockNotes);
  }),

  // POST /api/notes
  // Simular latência e possíveis erros
  http.post("/api/notes", async () => {
    // Simular delay de rede
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Simular erro ocasional (10% das vezes)
    if (Math.random() < 0.1) {
      return new HttpResponse(null, { status: 500 });
    }

    return HttpResponse.json({ success: true }, { status: 201 });
  }),

  // PUT /api/notes/:id - Atualizar nota específica
  http.put("/api/notes/:id", async ({ params }) => {
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
];
