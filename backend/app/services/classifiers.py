import os
import numpy as np
import librosa
from sklearn.preprocessing import StandardScaler
from sklearn.svm import SVC
from sklearn.ensemble import RandomForestClassifier
import pickle
from typing import Dict, Tuple

class EmotionClassifier:
    """Classify emotions from voice samples."""
    
    EMOTIONS = ['happy', 'sad', 'angry', 'neutral']
    
    def __init__(self):
        self.model = None
        self.scaler = None
        self.is_trained = False
    
    def extract_features(self, y: np.ndarray, sr: int) -> np.ndarray:
        """Extract features for emotion classification."""
        features = []
        
        # MFCC
        mfccs = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=13)
        features.extend(np.mean(mfccs, axis=1))
        features.extend(np.std(mfccs, axis=1))
        
        # Spectral features
        spectral_centroid = librosa.feature.spectral_centroid(y=y, sr=sr)
        features.append(np.mean(spectral_centroid))
        features.append(np.std(spectral_centroid))
        
        # Zero crossing rate
        zcr = librosa.feature.zero_crossing_rate(y)
        features.append(np.mean(zcr))
        features.append(np.std(zcr))
        
        # RMS Energy
        S = np.abs(librosa.stft(y)) ** 2
        rms = np.sqrt(np.mean(S, axis=0))
        features.append(np.mean(rms))
        features.append(np.std(rms))
        
        return np.array(features).reshape(1, -1)
    
    def predict(self, y: np.ndarray, sr: int) -> Tuple[str, float, Dict]:
        """Predict emotion and return emotion scores."""
        if not self.is_trained:
            return self._predict_simple(y, sr)
        
        features = self.extract_features(y, sr)
        scaled_features = self.scaler.transform(features)
        prediction = self.model.predict(scaled_features)[0]
        confidence = np.max(self.model.predict_proba(scaled_features))
        
        # Get scores for all emotions
        scores = {}
        for i, emotion in enumerate(self.EMOTIONS):
            scores[emotion] = float(self.model.predict_proba(scaled_features)[0][i])
        
        return prediction, confidence, scores
    
    def _predict_simple(self, y: np.ndarray, sr: int) -> Tuple[str, float, Dict]:
        """Simple emotion prediction based on audio characteristics."""
        # Extract basic features
        mfcc_mean = np.mean(librosa.feature.mfcc(y=y, sr=sr, n_mfcc=13))
        energy = np.sqrt(np.mean(y ** 2))
        zcr = np.mean(librosa.feature.zero_crossing_rate(y))
        
        # Simple heuristic
        scores = {
            'happy': max(0.1, min(0.8, energy / 0.2)),
            'sad': max(0.1, 0.5 - energy / 0.4),
            'angry': max(0.1, zcr * 2),
            'neutral': 1.0 - (abs(mfcc_mean) / 100)
        }
        
        # Normalize
        total = sum(scores.values())
        scores = {k: v / total for k, v in scores.items()}
        
        prediction = max(scores, key=scores.get)
        confidence = scores[prediction]
        
        return prediction, confidence, scores


class GenreClassifier:
    """Classify music genres."""
    
    GENRES = ['pop', 'rock', 'classical', 'hip_hop', 'jazz']
    
    def __init__(self):
        self.model = None
        self.scaler = None
        self.is_trained = False
    
    def extract_features(self, y: np.ndarray, sr: int) -> np.ndarray:
        """Extract features for genre classification."""
        features = []
        
        # Spectral features
        spectral_centroids = librosa.feature.spectral_centroid(y=y, sr=sr)[0]
        features.append(np.mean(spectral_centroids))
        features.append(np.std(spectral_centroids))
        
        # Tempo
        onset_env = librosa.onset.onset_strength(y=y, sr=sr)
        tempo = librosa.beat.tempo(onset_envelope=onset_env, sr=sr)[0]
        features.append(tempo)
        
        # MFCC statistics
        mfccs = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=13)
        features.extend(np.mean(mfccs, axis=1))
        features.extend(np.std(mfccs, axis=1))
        
        # Spectral contrast
        contrast = librosa.feature.spectral_contrast(y=y, sr=sr)
        features.extend(np.mean(contrast, axis=1))
        
        # Zero crossing rate
        zcr = librosa.feature.zero_crossing_rate(y)
        features.append(np.mean(zcr))
        
        return np.array(features).reshape(1, -1)
    
    def predict(self, y: np.ndarray, sr: int) -> Tuple[str, float, Dict, float]:
        """Predict genre with confidence and tempo."""
        if not self.is_trained:
            return self._predict_simple(y, sr)
        
        features = self.extract_features(y, sr)
        scaled_features = self.scaler.transform(features)
        prediction = self.model.predict(scaled_features)[0]
        confidence = np.max(self.model.predict_proba(scaled_features))
        
        # Get tempo
        onset_env = librosa.onset.onset_strength(y=y, sr=sr)
        tempo = float(librosa.beat.tempo(onset_envelope=onset_env, sr=sr)[0])
        
        # Get scores for all genres
        scores = {}
        for i, genre in enumerate(self.GENRES):
            scores[genre] = float(self.model.predict_proba(scaled_features)[0][i])
        
        return prediction, confidence, scores, tempo
    
    def _predict_simple(self, y: np.ndarray, sr: int) -> Tuple[str, float, Dict, float]:
        """Simple genre prediction based on audio characteristics."""
        # Extract features
        spectral_cent = np.mean(librosa.feature.spectral_centroid(y=y, sr=sr))
        onset_env = librosa.onset.onset_strength(y=y, sr=sr)
        tempo = float(librosa.beat.tempo(onset_envelope=onset_env, sr=sr)[0])
        zcr = np.mean(librosa.feature.zero_crossing_rate(y))
        
        # Simple heuristic based on tempo and spectral content
        scores = {
            'pop': 0.35,
            'rock': 0.25,
            'classical': 0.15,
            'hip_hop': 0.15,
            'jazz': 0.10
        }
        
        # Adjust based on features
        if tempo > 140:
            scores['pop'] += 0.2
        if spectral_cent > 3000:
            scores['rock'] += 0.15
        if zcr > 0.15:
            scores['hip_hop'] += 0.15
        
        # Normalize
        total = sum(scores.values())
        scores = {k: v / total for k, v in scores.items()}
        
        prediction = max(scores, key=scores.get)
        confidence = scores[prediction]
        
        return prediction, confidence, scores, tempo
