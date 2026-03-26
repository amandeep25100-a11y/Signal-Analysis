# Backend Documentation

## Overview
The backend is a FastAPI application that handles audio processing and machine learning classification.

## Architecture

### Services

#### AudioProcessor (`audio_processor.py`)
- **load_audio()**: Load WAV/MP3 files using librosa
- **get_waveform_data()**: Convert audio to plottable time-domain data
- **get_fft_data()**: Compute FFT and return frequency spectrum
- **extract_features()**: Extract 10+ audio features (MFCC, tempo, etc.)
- **reduce_noise()**: Apply spectral gating for noise reduction
- **get_spectrogram_data()**: Compute time-frequency representation

#### EmotionClassifier (`classifiers.py`)
- Classifies voice into 4 emotions: Happy, Sad, Angry, Neutral
- Extracts MFCC, spectral, and energy-based features
- Returns emotion scores for all classes
- Fallback to heuristic-based prediction

#### GenreClassifier (`classifiers.py`)
- Classifies music into 5 genres: Pop, Rock, Classical, Hip-Hop, Jazz
- Extracts tempo, spectral contrast, MFCC features
- Returns genre scores and estimated tempo
- Fallback to rhythm/spectral heuristics

### Endpoints

#### POST /api/analyze
Main analysis endpoint.

**Parameters:**
- `audio` (file): WAV or MP3 audio file
- `audio_type` (form): "human_voice" | "music" | "miscellaneous"

**Returns:**
```json
{
  "waveform_data": [...timeseries...],
  "fft_data": [...spectrum...],
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
  "emotion_scores": {...} OR "genre_scores": {...}
}
```

#### GET /api/health
Health check endpoint.

**Response:**
```json
{"status": "ok"}
```

## Signal Processing Pipeline

1. **Load Audio**: Read WAV/MP3 and resample to 22050 Hz mono
2. **Extract Features**: Compute 10+ audio descriptors
3. **Noise Reduction**: Apply spectral gating
4. **Signal Analysis**:
   - Time domain: Waveform visualization
   - Frequency domain: FFT analysis
   - Time-frequency: Spectrogram
5. **Classification**: Apply emotional or genre classifier based on type
6. **Return Results**: Graph data + prediction + features

## Feature Extraction Details

### Audio Features
- **MFCC**: Mel-Frequency Cepstral Coefficients (13 coefficients)
- **Spectral Centroid**: Center of mass of frequency spectrum
- **Spectral Contrast**: Loudness contrast across frequency bands
- **Zero Crossing Rate**: Number of sign changes per frame
- **RMS Energy**: Overall loudness of signal
- **Pitch**: Fundamental frequency using autocorrelation
- **Tempo**: Beats per minute via onset detection

### Noise Reduction
- Uses spectral gating method
- Threshold: 20th percentile of spectrogram
- Applied per frequency bin
- Reconstructed with inverse STFT

## Dependencies

- **FastAPI**: Modern web framework
- **Uvicorn**: ASGI server
- **Librosa**: Audio analysis library
- **NumPy/SciPy**: Numerical computing
- **Scikit-learn**: Machine learning

## Configuration

- Sample rate: 22050 Hz
- Frame length: 2048 samples
- Hop length: 512 samples
- MFCC coefficients: 13
- Noise gate threshold: 20th percentile

## Extending the Backend

### Add New Classifier
1. Create class in `classifiers.py`
2. Implement `extract_features()` and `predict()`
3. Add route in `analysis.py`

### Add New Feature
1. Extend `extract_features()` in `AudioProcessor`
2. Add to response JSON
3. Update frontend to display

### Use Pre-trained Models
1. Add model files to `models/` directory
2. Load in `__init__()` of classifier
3. Use model's `predict()` instead of fallback

## Performance Considerations

- Async processing with FastAPI
- Librosa handles heavy computations efficiently
- Downsampling for visualization data
- Streaming not yet implemented
- Max recommended audio: 30 seconds

## Testing

```bash
# Test health endpoint
curl http://localhost:8000/api/health

# Test with audio file
curl -X POST http://localhost:8000/api/analyze \
  -F "audio=@test_audio.wav" \
  -F "audio_type=human_voice"
```

## Troubleshooting

### ImportError for librosa
```bash
pip install librosa --upgrade
```

### NumPy version conflict
```bash
pip install numpy==1.24.3 --force-reinstall
```

### STFT/Audio processing errors
- Check audio file is valid WAV/MP3
- Ensure sample rate > 8000 Hz
- Try shorter audio clips

## Future Improvements

- [ ] Pre-trained neural network models
- [ ] Real-time streaming analysis
- [ ] Batch processing
- [ ] Model versioning
- [ ] Feature caching
- [ ] Hardware acceleration (GPU)
