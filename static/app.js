const form = document.getElementById("form");
const urlInput = document.getElementById("url");
const submitBtn = document.getElementById("submit-btn");
const statusEl = document.getElementById("status");
const resultEl = document.getElementById("result");
const captionEl = document.getElementById("caption");
const transcriptEl = document.getElementById("transcript");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const url = urlInput.value.trim();
  statusEl.textContent = "";
  resultEl.hidden = true;
  submitBtn.disabled = true;
  statusEl.textContent = "Downloading and transcribing... this can take a minute.";

  try {
    const response = await fetch("/api/transcribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });
    const data = await response.json();

    if (!response.ok) {
      statusEl.textContent = data.error || "Something went wrong.";
      return;
    }

    statusEl.textContent = "";
    captionEl.textContent = data.caption || "(no caption found)";
    transcriptEl.textContent = data.transcript || "(no speech detected)";
    resultEl.hidden = false;
  } catch (err) {
    statusEl.textContent = "Network error: " + err.message;
  } finally {
    submitBtn.disabled = false;
  }
});
