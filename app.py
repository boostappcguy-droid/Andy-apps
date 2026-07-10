import os
import re
import shutil
import tempfile

from flask import Flask, jsonify, render_template, request
import yt_dlp
from faster_whisper import WhisperModel

app = Flask(__name__)

WHISPER_MODEL_SIZE = os.environ.get("WHISPER_MODEL_SIZE", "base")
URL_PATTERN = re.compile(
    r"^https?://(www\.)?(facebook\.com|fb\.watch|instagram\.com)/", re.IGNORECASE
)

_model = None


def get_model():
    global _model
    if _model is None:
        _model = WhisperModel(WHISPER_MODEL_SIZE, device="cpu", compute_type="int8")
    return _model


def download_reel(url, out_dir):
    ydl_opts = {
        "outtmpl": os.path.join(out_dir, "%(id)s.%(ext)s"),
        "format": "bestaudio/best",
        "quiet": True,
        "no_warnings": True,
        "noplaylist": True,
    }
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        info = ydl.extract_info(url, download=True)
        filename = ydl.prepare_filename(info)
    return filename, info


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/api/transcribe", methods=["POST"])
def transcribe():
    data = request.get_json(silent=True) or {}
    url = (data.get("url") or "").strip()

    if not url:
        return jsonify({"error": "Please provide a reel URL."}), 400
    if not URL_PATTERN.match(url):
        return jsonify({"error": "URL must be a Facebook or Instagram link."}), 400

    tmp_dir = tempfile.mkdtemp(prefix="reel_")
    try:
        try:
            media_path, info = download_reel(url, tmp_dir)
        except Exception as exc:
            return jsonify({"error": f"Could not download this reel: {exc}"}), 502

        caption = (info.get("description") or info.get("title") or "").strip()

        model = get_model()
        segments, _ = model.transcribe(media_path, beam_size=5)
        transcript = " ".join(segment.text.strip() for segment in segments).strip()

        return jsonify(
            {
                "caption": caption,
                "transcript": transcript,
                "author": info.get("uploader") or info.get("channel") or "",
                "source": url,
            }
        )
    finally:
        shutil.rmtree(tmp_dir, ignore_errors=True)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
