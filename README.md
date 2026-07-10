# Andy-apps

## Reel Transcriber

A small web app that takes a public Facebook or Instagram reel URL and returns:

- **Transcript** — spoken-word transcription of the reel's audio, generated locally with [faster-whisper](https://github.com/SYSTRAN/faster-whisper) (no API key or cloud service required).
- **Caption** — the post's written caption/description, extracted via [yt-dlp](https://github.com/yt-dlp/yt-dlp).

### Setup

Requires Python 3.9+ and `ffmpeg` installed on your system (used for audio extraction).

```bash
# Debian/Ubuntu
sudo apt-get install ffmpeg

pip install -r requirements.txt
```

### Run

```bash
python app.py
```

Then open `http://localhost:5000`, paste a reel URL, and click **Transcribe**.

### Notes / limitations

- Only works on **public** reels. Private or login-gated posts aren't supported without authenticated cookies.
- The first run downloads a Whisper model checkpoint (~150 MB for the default `base` model) from Hugging Face, so it needs internet access the first time. Set `WHISPER_MODEL_SIZE` (e.g. `tiny`, `small`, `medium`) to trade off speed vs. accuracy.
- "Caption" here means the post's own written caption, not burned-in on-screen subtitles in the video.
- Downloading content from Facebook/Instagram may be subject to their Terms of Service — use this for personal, low-volume use on public content.
