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

  // Você pode adicionar mais endpoints aqui:
  // POST, PUT, DELETE, etc.
];
