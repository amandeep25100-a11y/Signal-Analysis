# Models Directory

This directory is for storing machine learning models.

## Current Status

The application currently uses **heuristic-based prediction** with fallback models.

## Available Models

### Emotion Classification (Voice)
- Target: Happy, Sad, Angry, Neutral
- Features: MFCC, Spectral, Energy
- Current: Heuristic classifier
- Fallback: Feature-based rules

### Genre Classification (Music)
- Target: Pop, Rock, Classical, Hip-Hop, Jazz
- Features: Tempo, Spectral Contrast, MFCC
- Current: Heuristic classifier
- Fallback: Rhythm & spectral rules

## Adding Pre-trained Models

### Step 1: Place Model Files
```
models/
├── emotion_model.pkl
├── genre_model.pkl
├── scaler_emotion.pkl
├── scaler_genre.pkl
└── README.md
```

### Step 2: Update Classifiers

In `backend/app/services/classifiers.py`:

```python
def __init__(self):
    self.model = pickle.load(open('models/emotion_model.pkl', 'rb'))
    self.scaler = pickle.load(open('models/scaler_emotion.pkl', 'rb'))
    self.is_trained = True
```

### Step 3: Test
```bash
curl -X POST http://localhost:8000/api/analyze \
  -F "audio=@test.wav" \
  -F "audio_type=human_voice"
```

## Pre-trained Model Sources

### RAVDESS (Emotion)
- Dataset: Ryerson Audio-Visual Database
- URL: https://zenodo.org/record/1188976
- Models: SVM, RandomForest, Deep Learning

### GTZan (Genre)
- Dataset: Music Information Retrieval Evaluation eXchange
- URL: http://marsyas.info/download/datasets/
- Models: Available via librosa

### ESC-50 (Environmental Sound)
- Dataset: ESC: Dataset for Environmental Sound Classification
- URL: https://github.com/karolpiczak/ESC-50
- Useful for miscellaneous classification

## Model Training

### Save Model
```python
import pickle

# Train your model
model = train_my_model(X_train, y_train)
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X_train)

# Save
pickle.dump(model, open('models/my_model.pkl', 'wb'))
pickle.dump(scaler, open('models/my_scaler.pkl', 'wb'))
```

### Load Model
```python
import pickle

model = pickle.load(open('models/my_model.pkl', 'rb'))
scaler = pickle.load(open('models/my_scaler.pkl', 'rb'))
```

## Recommended Models

### For Emotion Detection
```
Scikit-learn SVM with RBF kernel
- Accuracy: ~70-75% on RAVDESS
- Speed: Fast inference
- Size: ~5MB
```

### For Genre Classification
```
Random Forest with 100 estimators
- Accuracy: ~80-85% on GTZan
- Speed: Fast inference
- Size: ~10MB
```

### For Voice Activity Detection
```
Librosa onset detection
- Built-in, no additional model needed
- Good for filtering silence
```

## Performance Considerations

- Model loading: ~1-2 seconds at startup
- Inference: ~100-500ms per audio file
- Memory: Loaded in RAM, ~50-100MB total
- Bottleneck: Feature extraction (not model)

## Future Enhancements

- [ ] Deep learning models (TensorFlow/PyTorch)
- [ ] Model quantization for smaller size
- [ ] Multi-model ensemble
- [ ] Transfer learning fine-tuning
- [ ] Online learning updates
- [ ] Model versioning system

## References

- Librosa documentation: https://librosa.org
- AudioSet: https://research.google.com/audioset
- TensorFlow Hub: https://www.tensorflow.org/hub
