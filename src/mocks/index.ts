// src/mocks/index.ts
export async function enableMocking() {
  // Só ativar MSW quando VITE_NODE_ENV for "nodata"
  if (import.meta.env.VITE_NODE_ENV === "nodata") {
    const { worker } = await import("./browser.ts");
    console.log("🔧 MSW ativado - usando dados mockados");
    return worker.start();
  } else {
    return Promise.resolve();
  }
}
