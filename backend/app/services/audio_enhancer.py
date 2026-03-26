import base64
import io
from typing import Dict, List

import cv2
import librosa
import noisereduce as nr
import numpy as np
import soundfile as sf


class AudioEnhancer:
    """Noise removal and enhancement pipeline for audio files."""

    def __init__(self, sr: int = 22050):
        self.sr = sr

    def clean_audio(self, audio_path: str, strength: float = 0.8) -> Dict:
        y, sr = librosa.load(audio_path, sr=self.sr, mono=True)
        if y is None or len(y) == 0:
            raise ValueError("No audio samples detected")

        reduction_strength = float(np.clip(strength, 0.1, 1.0))

        y_denoised = nr.reduce_noise(
            y=y,
            sr=sr,
            stationary=False,
            prop_decrease=reduction_strength,
            use_tqdm=False,
        )

        peak = np.max(np.abs(y_denoised)) + 1e-9
        y_clean = (y_denoised / peak) * 0.98

        cleaned_audio_data_url = self._to_wav_data_url(y_clean, sr)

        return {
            "cleaned_audio_file": cleaned_audio_data_url,
            "waveform_before": self._waveform_data(y, sr),
            "waveform_after": self._waveform_data(y_clean, sr),
            "spectrogram_before": self._spectrogram_image(y, sr),
            "spectrogram_after": self._spectrogram_image(y_clean, sr),
            "sample_rate": sr,
            "duration": float(len(y) / sr),
            "strength": reduction_strength,
        }

    def _waveform_data(self, y: np.ndarray, sr: int, max_points: int = 2000) -> List[Dict]:
        if len(y) > max_points:
            indices = np.linspace(0, len(y) - 1, max_points, dtype=int)
            y_plot = y[indices]
            time = np.linspace(0, len(y) / sr, max_points)
        else:
            y_plot = y
            time = np.linspace(0, len(y) / sr, len(y))

        return [{"time": float(t), "value": float(v)} for t, v in zip(time, y_plot)]

    def _spectrogram_image(self, y: np.ndarray, sr: int) -> str:
        D = librosa.stft(y, n_fft=1024, hop_length=256)
        S_db = librosa.power_to_db(np.abs(D) ** 2, ref=np.max)

        S_norm = cv2.normalize(S_db, None, 0, 255, cv2.NORM_MINMAX).astype(np.uint8)
        S_flip = np.flipud(S_norm)
        color = cv2.applyColorMap(S_flip, cv2.COLORMAP_TURBO)
        color = cv2.resize(color, (640, 280), interpolation=cv2.INTER_LINEAR)

        success, encoded = cv2.imencode('.png', color)
        if not success:
            raise ValueError("Failed to encode spectrogram")

        return self._to_data_url(encoded.tobytes())

    def _to_wav_data_url(self, y: np.ndarray, sr: int) -> str:
        buffer = io.BytesIO()
        sf.write(buffer, y, sr, format='WAV')
        return self._to_data_url(buffer.getvalue(), mime='audio/wav')

    def _to_data_url(self, raw_bytes: bytes, mime: str = 'image/png') -> str:
        encoded = base64.b64encode(raw_bytes).decode('utf-8')
        return f'data:{mime};base64,{encoded}'
