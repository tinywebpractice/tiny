export const API_BASE = "https://thought-tracker-api.gzamlo98.workers.dev";

export async function getPosts() {
  const res = await fetch(`${API_BASE}/posts`);
  if (!res.ok) throw new Error(`GET /posts failed: ${res.status}`);
  return res.json();
}

export async function createPost(adminKey, post) {
  const res = await fetch(`${API_BASE}/posts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Admin-Key": adminKey,
    },
    body: JSON.stringify(post),
  });

  const text = await res.text();
  if (!res.ok) throw new Error(text || `POST failed: ${res.status}`);
  return text;
}
