import { OramaCloud } from "@orama/core";

// check env variables are set
if (!import.meta.env.VITE_ORAMA_PROJECT_ID || !import.meta.env.VITE_ORAMA_API_KEY) {
  throw new Error("ORAMA_PROJECT_ID and ORAMA_API_KEY must be set");
}

export const oramaDocsCollection = new OramaCloud({
  projectId: import.meta.env.VITE_ORAMA_PROJECT_ID,
  apiKey: import.meta.env.VITE_ORAMA_API_KEY,
});
