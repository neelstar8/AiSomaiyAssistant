
import { ref, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js";
import { storage } from "../firebase";

/**
 * Fetches the active RAG JSON payload from a given storage path.
 * Path format: "rag/active/infra_policy.json"
 */
export const fetchRagPayload = async (path: string): Promise<string[]> => {
  try {
    const storageRef = ref(storage, path);
    const url = await getDownloadURL(storageRef);
    const response = await fetch(url);
    const data = await response.json();
    return data.content || [];
  } catch (error) {
    console.error(`Failed to fetch RAG payload at ${path}:`, error);
    return [];
  }
};
