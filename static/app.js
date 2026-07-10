const form = document.getElementById("form");
const urlInput = document.getElementById("url");
const captionBtn = document.getElementById("caption-btn");
const transcribeBtn = document.getElementById("transcribe-btn");
const statusEl = document.getElementById("status");
const resultEl = document.getElementById("result");
const captionEl = document.getElementById("caption");
const transcriptEl = document.getElementById("transcript");
const transcriptHeading = document.getElementById("transcript-heading");

const MODES = {
  caption: {
    endpoint: "/api/caption",
    loadingText: "Fetching caption...",
  },
  transcribe: {
    endpoint: "/api/transcribe",
    loadingText: "Downloading and transcribing... this can take a minute.",
  },
};

async function runMode(mode) {
  const url = urlInput.value.trim();
  const { endpoint, loadingText } = MODES[mode];

  statusEl.textContent = "";
  resultEl.hidden = true;
  captionBtn.disabled = true;
  transcribeBtn.disabled = true;
  statusEl.textContent = loadingText;

  try {
    const response = await fetch(endpoint, {
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
    transcriptHeading.hidden = mode === "caption";
    transcriptEl.hidden = mode === "caption";
    if (mode === "transcribe") {
      transcriptEl.textContent = data.transcript || "(no speech detected)";
    }
    resultEl.hidden = false;
  } catch (err) {
    statusEl.textContent = "Network error: " + err.message;
  } finally {
    captionBtn.disabled = false;
    transcribeBtn.disabled = false;
  }
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const mode = event.submitter?.dataset.mode || "transcribe";
  runMode(mode);
});
