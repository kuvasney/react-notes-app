// src/mocks/index.ts
export async function enableMocking() {
  // Só ativar MSW quando o modo do Vite for "nodata"
  // Executar `pnpm dev-nodata` usa `vite --mode nodata`, que define import.meta.env.MODE === 'nodata'
  if (import.meta.env.MODE === "nodata") {
    const { worker } = await import("./browser.ts");
    console.log("🔧 MSW ativado - usando dados mockados");
    return worker.start();
  } else {
    return Promise.resolve();
  }
}
