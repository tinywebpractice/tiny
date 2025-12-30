import { API_BASE } from "./api.js";

const postsEl = document.querySelector("#posts");

function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, (m) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    }[m]));
}

function formatDate(iso) {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

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

        postsEl.innerHTML = posts.map(p => `
      <article class="post card">
        <div class="post-top">
          <h2 class="post-title">${escapeHtml(p.title)}</h2>
          <div class="post-date">${formatDate(p.created_at)}</div>
        </div>
        ${p.mood ? `<div class="mood">${escapeHtml(p.mood)}</div>` : ""}
        <div class="post-body">${escapeHtml(p.body)}</div>
      </article>
    `).join("");
    } catch (e) {
        postsEl.innerHTML = `<div class="empty">error loading posts: ${escapeHtml(e.message)}</div>`;
    }
}

loadPosts();
