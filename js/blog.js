import { API_BASE } from "./api.js";

const postsEl = document.querySelector("#posts");

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (m) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  }[m]));
}

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

/* ---------- embed helpers ---------- */

function extractYouTubeId(input = "") {
  const s = String(input).trim();

  // iframe src=".../embed/ID"
  const iframeMatch = s.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]{6,})/);
  if (iframeMatch) return iframeMatch[1];

  // watch?v=ID
  const watchMatch = s.match(/[?&]v=([a-zA-Z0-9_-]{6,})/);
  if (watchMatch) return watchMatch[1];

  // youtu.be/ID
  const shortMatch = s.match(/youtu\.be\/([a-zA-Z0-9_-]{6,})/);
  if (shortMatch) return shortMatch[1];

  // already an ID
  if (/^[a-zA-Z0-9_-]{6,}$/.test(s)) return s;

  return "";
}

function spotifyToEmbedUrl(url = "") {
  // accept open.spotify.com/track/ID etc and convert to /embed/track/ID
  try {
    const u = new URL(url);
    if (!u.hostname.includes("spotify.com")) return "";

    const parts = u.pathname.split("/").filter(Boolean); // ["track","ID"]
    if (parts.length >= 2) return `https://open.spotify.com/embed/${parts[0]}/${parts[1]}`;
  } catch {
    // ignore
  }
  return "";
}

function renderEmbed(p) {
  const type = String(p.embed_type || "").trim().toLowerCase();
  const ref = String(p.embed_ref || "").trim();
  const title = String(p.embed_title || "").trim();

  if (!type || !ref) return "";

  const label = title ? `<div class="embed-label">${escapeHtml(title)}</div>` : "";

  if (type === "youtube") {
    const id = extractYouTubeId(ref);
    if (!id) return "";

    return `
      <div class="embed">
        ${label}
        <div class="embed-frame">
          <iframe
            src="https://www.youtube.com/embed/${encodeURIComponent(id)}"
            loading="lazy"
            allowfullscreen
          ></iframe>
        </div>
      </div>
    `;
  }

  if (type === "spotify") {
    const embedUrl = spotifyToEmbedUrl(ref) || ref; // if they already pasted an embed url, still works
    return `
      <div class="embed">
        ${label}
        <div class="embed-spotify">
          <iframe
            src="${escapeHtml(embedUrl)}"
            loading="lazy"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          ></iframe>
        </div>
      </div>
    `;
  }

  if (type === "link") {
    // basic safety: only render http(s) links
    const safe = /^https?:\/\//i.test(ref) ? ref : "";
    if (!safe) return "";

    return `
      <div class="embed">
        ${label}
        <a class="embed-link" href="${escapeHtml(safe)}" target="_blank" rel="noopener">
          open link
        </a>
      </div>
    `;
  }

  return "";
}

/* ---------- main ---------- */

async function loadPosts() {
  postsEl.innerHTML = `<div class="empty">loading…</div>`;

  try {
    const res = await fetch(`${API_BASE}/posts`);
    if (!res.ok) throw new Error(await res.text());

    const posts = await res.json();

    if (!posts.length) {
      postsEl.innerHTML = `<div class="empty">no posts yet.</div>`;
      return;
    }

    postsEl.innerHTML = posts.map((p) => `
      <article class="post card">
        <div class="post-top">
          <h2 class="post-title">${escapeHtml(p.title)}</h2>
          <div class="post-date">${formatDate(p.created_at)}</div>
        </div>

        ${p.mood ? `<div class="mood">${escapeHtml(p.mood)}</div>` : ""}

        <div class="post-body">${escapeHtml(p.body)}</div>

        ${renderEmbed(p)}
      </article>
    `).join("");
  } catch (e) {
    postsEl.innerHTML = `<div class="empty">error loading posts: ${escapeHtml(e.message)}</div>`;
  }
}

loadPosts();
