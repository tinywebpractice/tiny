import { createPost } from "./api.js";

const $ = (sel) => document.querySelector(sel);

const form = $("#adminForm");
const statusEl = $("#status");

function setStatus(msg) {
    statusEl.textContent = msg;
}

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const key = $("#key").value.trim();
    const title = $("#title").value.trim();
    const mood = $("#mood").value.trim();
    const body = $("#body").value.trim();

    if (!key) return setStatus("missing admin key.");
    if (!title || !body) return setStatus("title + thought are required.");

    setStatus("posting…");

    try {
        await createPost(key, { title, mood, body }); // 
        setStatus("published ✦");

        $("#title").value = "";
        $("#mood").value = "";
        $("#body").value = "";
    } catch (err) {
        setStatus("error: " + err.message);
    }
});
