# 🎼 AUDIO SIGNAL ANALYZER PRO

A production-quality web application for advanced audio signal processing, analysis, and intelligent classification using AI/ML.

## 🎯 Key Features

✅ **Audio Input**
- Upload WAV/MP3 files
- Record audio directly from microphone
- Real-time waveform preview

✅ **Signal Analysis**
- Time-domain waveform visualization
- Frequency-domain FFT analysis
- Spectrogram computation
- MFCC extraction
- Pitch and tempo detection

✅ **Noise Reduction**
- Spectral gating implementation
- Before/after comparison
- Preserves signal integrity

✅ **AI-Powered Classification**
- **Human Voice**: Emotion detection (Happy, Sad, Angry, Neutral)
- **Music**: Genre classification (Pop, Rock, Classical, Hip-Hop, Jazz)
- **Miscellaneous**: Signal analysis only

✅ **Futuristic UI/UX**
- Neon Green & Electric Blue theme
- Glassmorphism effects
- Smooth animations
- Responsive design

## 🏗️ Project Structure

```
SNS/
├── frontend/                 # React + Vite application
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── utils/           # API utilities
│   │   ├── App.jsx          # Main app component
│   │   ├── main.jsx         # Entry point
│   │   └── index.css        # Global styles
│   ├── public/              # Static assets
│   ├── package.json         # Frontend dependencies
│   ├── vite.config.js       # Vite configuration
│   ├── tailwind.config.js   # Tailwind CSS config
│   └── index.html           # HTML template
│
├── backend/                 # FastAPI application
│   ├── app/
│   │   ├── routes/
│   │   │   ├── analysis.py  # Analysis endpoints
│   │   │   └── __init__.py
│   │   ├── services/
│   │   │   ├── audio_processor.py    # Signal processing
│   │   │   ├── classifiers.py        # ML classifiers
│   │   │   └── __init__.py
│   │   ├── main.py          # FastAPI app initialization
│   │   └── __init__.py
│   ├── requirements.txt     # Python dependencies
│   └── README.md           # Backend documentation
│
├── models/                  # ML models directory
│   └── README.md           # Models documentation
│
├── assets/                  # Static assets
│   └── README.md
│
├── run_frontend.bat/.sh    # Frontend startup scripts
├── run_backend.bat/.sh     # Backend startup scripts
└── README.md               # This file
```

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Fast build tool
- **Tailwind CSS** - Utility-first CSS
- **Framer Motion** - Smooth animations
- **Recharts** - Interactive charts
- **Axios** - HTTP client

### Backend
- **FastAPI** - Modern async web framework
- **Python 3.8+** - Programming language
- **NumPy** - Numerical computing
- **SciPy** - Scientific computing
- **Librosa** - Audio analysis
- **Scikit-learn** - Machine learning

### Signal Processing
- FFT (Fast Fourier Transform)
- MFCC (Mel-Frequency Cepstral Coefficients)
- Spectrogram analysis
- Spectral gating for noise reduction

## 🚀 Installation & Setup

### Prerequisites
- Node.js 16+ and npm
- Python 3.8+
- pip (Python package manager)

### Step 1: Clone/Navigate to Project
```bash
cd SNS
```

### Step 2: Install Backend Dependencies
```bash
cd backend
pip install -r requirements.txt
cd ..
```

### Step 3: Install Frontend Dependencies
```bash
cd frontend
npm install
cd ..
```

## ▶️ Running the Application

### Option 1: Using Batch Scripts (Windows)
Open two terminals:

**Terminal 1 - Backend:**
```bash
run_backend.bat
```

**Terminal 2 - Frontend:**
```bash
run_frontend.bat
```

### Option 2: Using Shell Scripts (Linux/macOS)
Open two terminals:

**Terminal 1 - Backend:**
```bash
bash run_backend.sh
```

**Terminal 2 - Frontend:**
```bash
bash run_frontend.sh
```

### Option 3: Manual Startup

**Terminal 1 - Backend:**
```bash
cd backend
pip install -r requirements.txt
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm install
npm run dev
```

### Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

## 📖 Usage Guide

### 1. Upload Audio
- Click "📤 Upload Audio" button
- Select a WAV or MP3 file
- File info will be displayed

### 2. Record Audio
- Click "🎤 Record Audio" to start
- Grant microphone permission if prompted
- Click "⏹️ Stop Recording" to end
- Audio will be ready for analysis

### 3. Select Audio Type
Choose from dropdown:
- **Human Voice** → Emotion Detection
- **Music** → Genre Classification
- **Miscellaneous** → Signal Analysis Only

### 4. Run Analysis
- Click "▶ ANALYZE" button
- Wait for processing (animated loader shown)
- Results appear automatically

### 5. View Results
- **Graphs**: Waveform, FFT spectrum, cleaned audio
- **Features**: Duration, tempo, energy, spectral data
- **Classification**: Predicted emotion/genre with confidence scores

## 🔌 API Endpoints

### POST /api/analyze
Analyze audio file with signal processing and classification.

**Request:**
```
Content-Type: multipart/form-data
- audio: File (WAV/MP3)
- audio_type: "human_voice" | "music" | "miscellaneous"
```

**Response:**
```json
{
  "waveform_data": [...],
  "fft_data": [...],
  "spectrogram_data": {...},
  "cleaned_waveform_data": [...],
  "duration": 5.2,
  "sample_rate": 22050,
  "rms_energy": 0.123,
  "spectral_centroid": 1500.5,
  "mfcc_mean": 2.3,
  "zcr": 0.045,
  "tempo": 120.5,
  "pitch": 440.0,
  "prediction": "happy",
  "prediction_confidence": 0.85,
  "emotion_scores": {"happy": 0.85, "sad": 0.1, "angry": 0.03, "neutral": 0.02}
}
```

### GET /api/health
Health check endpoint.

**Response:**
```json
{"status": "ok"}
```

## 🎨 UI Components

### Header
- Animated title with gradient
- Neon glow effects
- Responsive design

### Input Section
- File upload button
- Microphone recording button
- File info display

### Controls Section
- Audio type dropdown
- Analyze button (disabled when no audio)

### Graph Display
- Waveform plot
- FFT spectrum chart
- Cleaned audio comparison
- Spectrogram info

### Results Section
- Classification prediction
- Confidence scores
- Emotion/Genre breakdown
- Extracted features table

## 🔧 Configuration

### Frontend
- **Port**: 3000 (configurable in vite.config.js)
- **API Proxy**: `/api` → `http://localhost:8000`

### Backend
- **Port**: 8000 (configurable in run_backend scripts)
- **Sample Rate**: 22050 Hz
- **CORS**: Enabled for all origins

## 📊 Signal Processing Details

### Audio Feature Extraction
1. **MFCC (Mel-Frequency Cepstral Coefficients)** - 13 coefficients
2. **Spectral Centroid** - Center of mass of spectrum
3. **Spectral Contrast** - Loudness contrast across bands
4. **Zero Crossing Rate** - Frequency of sign changes
5. **RMS Energy** - Overall loudness
6. **Pitch** - Fundamental frequency
7. **Tempo** - Beats per minute

### Noise Reduction
- Uses spectral gating method
- 20th percentile threshold
- Preserves signal dynamics
- Inverse STFT reconstruction

### Classification Models
- **Emotion**: SVMs with audio feature vectors (used if trained)
- **Genre**: Random Forest with spectral/rhythm features (used if trained)
- **Fallback**: Heuristic-based prediction using feature analysis

## ⚙️ Troubleshooting

### Backend won't start
**Problem**: Port 8000 already in use
```bash
# Use different port
uvicorn app.main:app --port 8001
```

### Frontend can't connect to backend
**Problem**: CORS errors or proxy not configured
- Check backend is running on port 8000
- Verify vite.config.js proxy settings
- Check browser console for specific errors

### Audio upload fails
**Problem**: Unsupported format
- Ensure file is WAV or MP3
- Check file size (files >50MB may take time)
- Try converting to WAV at 22050Hz

### Microphone not working
**Problem**: Permission denied or no device
- Grant microphone permission when prompted
- Check if another app is using microphone
- Try different browser

### Slow analysis
**Problem**: Large file or high computational load
- Use shorter audio clips (<30 seconds)
- Check system CPU/RAM availability
- Try lower sample rate if needed

## 📈 Performance Tips

1. **Optimize Audio Files**
   - Convert to 22050 Hz sample rate
   - Use mono channel
   - Trim silence

2. **Frontend Optimization**
   - React.memo for components
   - Lazy loading for large graphs
   - Debounce input handlers

3. **Backend Optimization**
   - Async processing with FastAPI
   - Efficient NumPy operations
   - Cache feature extraction

## 🔐 Security

- CORS enabled for development (restrict in production)
- File type validation on upload
- Temporary file cleanup after processing
- Error handling without exposing system paths

## 📝 Code Comments

All source files include:
- Clear function descriptions
- Parameter type hints
- Inline comments for complex logic
- Docstrings for classes and methods

## 🚀 Deployment

### Frontend (Vercel, Netlify, etc.)
```bash
cd frontend
npm run build
# Deploy 'dist' folder
```

### Backend (Heroku, Railway, etc.)
```bash
# Add Procfile
# Run: python -m uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

## 📦 Project Size

- **Frontend Dependencies**: ~300MB
- **Backend Dependencies**: ~500MB
- **Typical Audio File**: 1-5MB
- **Model Files** (optional): 50-200MB

## 🤝 Contributing

1. Fork the project
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

This project is open source and available under the MIT License.

## 🎓 Educational Use

This project demonstrates:
- Full-stack web development
- Signal processing fundamentals
- Audio feature extraction
- Machine learning classification
- REST API design
- Real-time data visualization
- UI/UX with modern frameworks

## 🐛 Known Issues

- Spectrogram visualization is displayed as text (can be enhanced with plotly)
- ML models use heuristic fallback without pre-trained weights
- Large audio files (>100MB) may timeout

## 🔮 Future Enhancements

- [ ] Add real spectrogram visualization
- [ ] Implement neural network models
- [ ] Add audio effects processing
- [ ] Support batch processing
- [ ] Add user authentication
- [ ] Create dashboard for statistics
- [ ] Mobile app version
- [ ] Real-time streaming analysis

## 📞 Support

For issues, questions, or suggestions:
1. Check troubleshooting section
2. Review code comments
3. Check console for error messages
4. Test with sample audio files

---

**Built with ❤️ | Audio Signal Analyzer Pro v1.0.0**

*Advanced audio processing meets modern web technology*
