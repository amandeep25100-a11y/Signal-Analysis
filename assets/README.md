# Assets Directory

This directory contains static assets for the application.

## Current Structure

```
assets/
├── README.md
└── (add your assets here)
```

## Asset Types

### Audio Files (for testing)
- Place sample WAV/MP3 files here
- Useful for demo and testing

### Images
- Logo and branding
- Icons (if not using emoji)
- Screenshots

### Documentation
- Architecture diagrams
- API specifications
- User guides

## Recommended Assets

### Sample Audio Files
- happy_voice.wav
- sad_voice.wav
- angry_voice.angry
- neutral_voice.wav
- pop_music.mp3
- rock_music.mp3
- classical_music.mp3
- hip_hop_music.mp3
- jazz_music.mp3

## Asset Management

### Adding Assets
1. Place file in this directory
2. Update documentation
3. Reference in frontend/backend code

### Asset Optimization
- Compress audio files
- Use optimal bitrate (128-192 kbps)
- Convert to widely supported formats

### Serving Assets
Currently served from:
- Frontend: `/public/` (via Vite)
- Backend: Static files can be served from `/static/` (if configured)

## Adding Static File Serving

### Backend (FastAPI)
```python
from fastapi.staticfiles import StaticFiles

app.mount("/static", StaticFiles(directory="static"), name="static")
```

### Frontend
```jsx
<img src="/assets/logo.png" />
```

## Asset Guidelines

- Keep file sizes reasonable (< 1MB each)
- Use descriptive filenames
- Maintain version control
- Document all external resources
- Respect copyright and licenses
