import { createPost } from "./api.js";

const $ = (sel) => document.querySelector(sel);

const form = $("#adminForm");
const statusEl = $("#status");

function setStatus(msg) {
  statusEl.textContent = msg;
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const key = ($("#key")?.value || "").trim();
  const title = ($("#title")?.value || "").trim();
  const mood = ($("#mood")?.value || "").trim();
  const body = ($("#body")?.value || "").trim();

  // NEW: embed fields (optional)
  const embed_type = ($("#embed_type")?.value || "").trim();
  const embed_ref = ($("#embed_ref")?.value || "").trim();
  const embed_title = ($("#embed_title")?.value || "").trim();

  if (!key) return setStatus("missing admin key.");
  if (!title || !body) return setStatus("title + thought are required.");

  // if they pick an embed type but forget the ref, nudge them
  if (embed_type && !embed_ref) return setStatus("embed needs an id/url (or set embed type to none).");

  setStatus("posting…");

  try {
    await createPost(key, {
      title,
      mood,
      body,
      embed_type: embed_type || null,
      embed_ref: embed_ref || null,
      embed_title: embed_title || null,
    });

    setStatus("published ✦");

    $("#title").value = "";
    $("#mood").value = "";
    $("#body").value = "";

    if ($("#embed_type")) $("#embed_type").value = "";
    if ($("#embed_ref")) $("#embed_ref").value = "";
    if ($("#embed_title")) $("#embed_title").value = "";
  } catch (err) {
    setStatus("error: " + err.message);
  }
});
