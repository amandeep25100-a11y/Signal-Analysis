import os
import numpy as np
import librosa
import scipy.signal as signal
from typing import Tuple, Dict, List

class AudioProcessor:
    """Handle audio loading, processing, and feature extraction."""
    
    def __init__(self, sr: int = 22050):
        self.sr = sr
    
    def load_audio(self, audio_path: str) -> Tuple[np.ndarray, int]:
        """Load audio file and return waveform and sample rate."""
        try:
            y, sr = librosa.load(audio_path, sr=self.sr, mono=True)
            return y, sr
        except Exception as e:
            raise Exception(f"Error loading audio: {str(e)}")
    
    def get_waveform_data(self, y: np.ndarray, sr: int, max_points: int = 2000) -> List[Dict]:
        """Convert waveform to plottable data."""
        # Downsample for visualization
        if len(y) > max_points:
            indices = np.linspace(0, len(y) - 1, max_points, dtype=int)
            y_plot = y[indices]
            time = np.linspace(0, len(y) / sr, max_points)
        else:
            y_plot = y
            time = np.linspace(0, len(y) / sr, len(y))
        
        return [{"time": float(t), "value": float(val)} for t, val in zip(time, y_plot)]
    
    def get_fft_data(self, y: np.ndarray, sr: int, n_fft: int = 2048) -> List[Dict]:
        """Compute FFT and return frequency spectrum data."""
        D = librosa.stft(y, n_fft=n_fft)
        S = np.abs(D) ** 2
        magnitude = np.sqrt(np.mean(S, axis=1))
        freq = librosa.fft_frequencies(sr=sr, n_fft=n_fft)
        
        # Downsample for visualization
        indices = np.linspace(0, len(freq) - 1, 200, dtype=int)
        
        return [
            {"frequency": float(freq[i]), "magnitude": float(magnitude[i])}
            for i in indices
        ]
    
    def extract_features(self, y: np.ndarray, sr: int) -> Dict:
        """Extract audio features."""
        features = {}
        
        # Basic features
        features['duration'] = len(y) / sr
        features['sample_rate'] = sr
        features['rms_energy'] = float(np.sqrt(np.mean(y ** 2)))
        
        # MFCC
        mfccs = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=13)
        features['mfcc_mean'] = float(np.mean(mfccs))
        
        # Spectral features
        features['spectral_centroid'] = float(np.mean(librosa.feature.spectral_centroid(y=y, sr=sr)))
        features['spectral_contrast'] = float(np.mean(librosa.feature.spectral_contrast(y=y, sr=sr)))
        
        # Zero crossing rate
        features['zcr'] = float(np.mean(librosa.feature.zero_crossing_rate(y)))
        
        # Tempo detection
        onset_env = librosa.onset.onset_strength(y=y, sr=sr)
        features['tempo'] = float(librosa.beat.tempo(onset_envelope=onset_env, sr=sr)[0])
        
        # Pitch estimation (simple approach using autocorrelation)
        try:
            features['pitch'] = self._estimate_pitch(y, sr)
        except:
            features['pitch'] = 0.0
        
        return features
    
    def _estimate_pitch(self, y: np.ndarray, sr: int) -> float:
        """Estimate fundamental frequency."""
        # Use a simple autocorrelation method
        frame = y[:min(4096, len(y))]
        autocorr = np.correlate(frame, frame, mode='full')
        autocorr = autocorr[len(autocorr) // 2:]
        autocorr /= autocorr[0]
        
        # Find first significant peak after lag 0
        min_idx = int(sr / 500)  # Min frequency 500 Hz
        max_idx = int(sr / 50)   # Max frequency 50 Hz
        
        if len(autocorr) > max_idx:
            dip = np.argmin(autocorr[min_idx:max_idx]) + min_idx
            return float(sr / dip) if dip > 0 else 0.0
        return 0.0
    
    def reduce_noise(self, y: np.ndarray, sr: int) -> np.ndarray:
        """Apply noise reduction using spectral gating."""
        D = librosa.stft(y)
        S = np.abs(D) ** 2
        
        # Compute noise gate threshold
        threshold = np.percentile(S, 20)
        
        # Apply gate
        mask = S > threshold
        D_clean = D * mask
        
        # Inverse STFT
        y_clean = librosa.istft(D_clean)
        
        return y_clean
    
    def get_spectrogram_data(self, y: np.ndarray, sr: int) -> Dict:
        """Compute spectrogram for visualization."""
        D = librosa.stft(y, n_fft=1024, hop_length=256)
        S_db = librosa.power_to_db(np.abs(D) ** 2, ref=np.max)

        target_freq_bins = 96
        target_time_bins = 96

        freq_indices = np.linspace(0, S_db.shape[0] - 1, min(target_freq_bins, S_db.shape[0]), dtype=int)
        time_indices = np.linspace(0, S_db.shape[1] - 1, min(target_time_bins, S_db.shape[1]), dtype=int)
        S_small = S_db[np.ix_(freq_indices, time_indices)]

        min_db = float(np.min(S_small))
        max_db = float(np.max(S_small))
        dynamic_range = max_db - min_db

        if dynamic_range <= 1e-9:
            S_norm = np.zeros_like(S_small)
        else:
            S_norm = (S_small - min_db) / dynamic_range

        return {
            "shape": S_db.shape,
            "mean_energy": float(np.mean(S_db)),
            "max_energy": float(np.max(S_db)),
            "width": int(S_norm.shape[1]),
            "height": int(S_norm.shape[0]),
            "values": S_norm.astype(float).tolist(),
        }
