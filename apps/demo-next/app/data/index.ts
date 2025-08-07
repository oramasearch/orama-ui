import { OramaCloud } from "@orama/core";

export const oramaDocsCollection = new OramaCloud({
  projectId: process.env.NEXT_PUBLIC_ORAMA_COLLECTION_ID!,
  apiKey: process.env.NEXT_PUBLIC_ORAMA_API_KEY!,
  cluster: {
    readURL: process.env.NEXT_PUBLIC_ORAMA_CLUSTER_READ_URL,
  },
});
