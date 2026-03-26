# Quick Start Guide

## 🚀 5-Minute Setup

### Prerequisites
- Node.js 16+
- Python 3.8+

### Step 1: Install Backend
```bash
cd backend
pip install -r requirements.txt
```

### Step 2: Install Frontend
```bash
cd ../frontend
npm install
```

### Step 3: Start Services

**Windows Users:**
Open two terminals in the project root:

Terminal 1:
```bash
run_backend.bat
```

Terminal 2:
```bash
run_frontend.bat
```

**Mac/Linux Users:**
Open two terminals in the project root:

Terminal 1:
```bash
bash run_backend.sh
```

Terminal 2:
```bash
bash run_frontend.sh
```

### Step 4: Access Application
- Frontend: http://localhost:3000
- Backend: http://localhost:8000
- API Docs: http://localhost:8000/docs

That's it! 🎉

## 📖 First Use

1. Click **"📤 Upload Audio"** or **"🎤 Record Audio"**
2. Select audio type:
   - 🎤 Human Voice (emotion detection)
   - 🎵 Music (genre classification)
   - 📊 Miscellaneous (analysis only)
3. Click **"▶ ANALYZE"**
4. View results with graphs and predictions

## 🎯 Quick Test

### Generate Test Audio
```bash
# Install FFmpeg first
# Then run:

# Pure tone (5 seconds)
ffmpeg -f lavfi -i sine=f=440:d=5 -q:a 9 test.mp3

# White noise
ffmpeg -f lavfi -i anullsrc=r=44100 -t 5 -q:a 9 noise.mp3
```

### Or Record Yourself
1. Click "🎤 Record Audio"
2. Grant microphone permission
3. Speak for 5-10 seconds
4. Click "⏹️ Stop Recording"
5. Select "Human Voice" and analyze

## ⚡ Shortcuts

### Check Servers
```bash
# Backend health
curl http://localhost:8000/api/health

# Frontend
curl http://localhost:3000
```

### View API Documentation
Visit: http://localhost:8000/docs

### Stop Servers
Windows: Ctrl+C in each terminal
Mac/Linux: Ctrl+C in each terminal

## 🆘 Common Issues

| Problem | Solution |
|---------|----------|
| Port 8000 in use | Kill process or use different port |
| Port 3000 in use | Kill process or npm run dev -- --port 3001 |
| npm ERR! | Delete node_modules and run npm install again |
| Backend won't start | pip install -r requirements.txt again |
| No audio uploaded | Refresh page, grant permissions |
| Slow analysis | Use shorter audio clips |

## 📚 Learn More

- [Main README](README.md)
- [Frontend Docs](frontend/README.md)
- [Backend Docs](backend/README.md)
- [Testing Guide](TESTING.md)

## 🎨 Customize

### Change Colors
Edit `frontend/tailwind.config.js` and change:
```js
colors: {
  'neon-green': '#39FF14',
  'neon-blue': '#00FFFF',
}
```

### Add Features
1. Create new component in `frontend/src/components/`
2. Add new API endpoint in `backend/app/routes/`
3. Connect them in App.jsx

### Deploy
- Frontend: Vercel, Netlify, GitHub Pages
- Backend: Heroku, Railway, Render

## 🔗 Helpful Resources

- [React Documentation](https://react.dev)
- [FastAPI Documentation](https://fastapi.tiangolo.com)
- [Librosa Documentation](https://librosa.org)
- [Tailwind CSS Documentation](https://tailwindcss.com)

---

**Need Help?** Check the Testing Guide and troubleshooting sections!
