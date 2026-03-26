import base64
from typing import Dict, Tuple

import cv2
import numpy as np


class ImageProcessor:
    """Handle image loading and 2D signal analysis."""

    def __init__(self, max_dimension: int = 1024):
        self.max_dimension = max_dimension

    def load_image_from_bytes(self, content: bytes) -> np.ndarray:
        if not content:
            raise ValueError("Empty upload")

        arr = np.frombuffer(content, dtype=np.uint8)
        image = cv2.imdecode(arr, cv2.IMREAD_COLOR)
        if image is None:
            raise ValueError("Corrupted or unsupported image")

        return self._resize_if_needed(image)

    def _resize_if_needed(self, image: np.ndarray) -> np.ndarray:
        height, width = image.shape[:2]
        max_dim = max(height, width)

        if max_dim <= self.max_dimension:
            return image

        scale = self.max_dimension / max_dim
        new_width = int(width * scale)
        new_height = int(height * scale)
        return cv2.resize(image, (new_width, new_height), interpolation=cv2.INTER_AREA)

    def analyze(self, image_bgr: np.ndarray, filter_strength: float = 0.15) -> Dict:
        gray = cv2.cvtColor(image_bgr, cv2.COLOR_BGR2GRAY)
        gray_norm = cv2.normalize(gray.astype(np.float32), None, 0.0, 1.0, cv2.NORM_MINMAX)

        heatmap = self._generate_heatmap(gray_norm)
        fft_spectrum = self._generate_fft_spectrum(gray)
        low_pass, high_pass = self._apply_frequency_filters(gray, filter_strength)
        edges = self._detect_edges(gray)
        histogram = self._generate_histogram(gray)

        return {
            "original_image": self._encode_bgr_image(image_bgr),
            "grayscale_image": self._encode_gray_image(gray),
            "heatmap": self._encode_bgr_image(heatmap),
            "fft_spectrum": self._encode_bgr_image(fft_spectrum),
            "low_pass_image": self._encode_gray_image(low_pass),
            "high_pass_image": self._encode_gray_image(high_pass),
            "edge_detected_image": self._encode_gray_image(edges),
            "histogram": histogram,
            "image_width": int(image_bgr.shape[1]),
            "image_height": int(image_bgr.shape[0]),
            "filter_strength": float(filter_strength),
        }

    def _generate_heatmap(self, gray_norm: np.ndarray) -> np.ndarray:
        gray_u8 = np.clip(gray_norm * 255.0, 0, 255).astype(np.uint8)
        return cv2.applyColorMap(gray_u8, cv2.COLORMAP_TURBO)

    def _generate_fft_spectrum(self, gray: np.ndarray) -> np.ndarray:
        f = np.fft.fft2(gray)
        f_shift = np.fft.fftshift(f)
        magnitude = np.log1p(np.abs(f_shift))
        magnitude_norm = cv2.normalize(magnitude, None, 0, 255, cv2.NORM_MINMAX)
        magnitude_u8 = magnitude_norm.astype(np.uint8)
        return cv2.applyColorMap(magnitude_u8, cv2.COLORMAP_INFERNO)

    def _apply_frequency_filters(self, gray: np.ndarray, filter_strength: float) -> Tuple[np.ndarray, np.ndarray]:
        filter_strength = float(np.clip(filter_strength, 0.02, 0.5))

        rows, cols = gray.shape
        crow, ccol = rows // 2, cols // 2
        radius = int(min(rows, cols) * filter_strength)

        y, x = np.ogrid[:rows, :cols]
        mask_area = (x - ccol) ** 2 + (y - crow) ** 2 <= radius ** 2

        f = np.fft.fft2(gray)
        f_shift = np.fft.fftshift(f)

        low_mask = np.zeros((rows, cols), dtype=np.float32)
        low_mask[mask_area] = 1.0
        high_mask = 1.0 - low_mask

        low_freq = f_shift * low_mask
        high_freq = f_shift * high_mask

        low_img = np.abs(np.fft.ifft2(np.fft.ifftshift(low_freq)))
        high_img = np.abs(np.fft.ifft2(np.fft.ifftshift(high_freq)))

        low_norm = cv2.normalize(low_img, None, 0, 255, cv2.NORM_MINMAX).astype(np.uint8)
        high_norm = cv2.normalize(high_img, None, 0, 255, cv2.NORM_MINMAX).astype(np.uint8)

        return low_norm, high_norm

    def _detect_edges(self, gray: np.ndarray) -> np.ndarray:
        grad_x = cv2.Sobel(gray, cv2.CV_64F, 1, 0, ksize=3)
        grad_y = cv2.Sobel(gray, cv2.CV_64F, 0, 1, ksize=3)
        magnitude = cv2.magnitude(grad_x, grad_y)
        return cv2.normalize(magnitude, None, 0, 255, cv2.NORM_MINMAX).astype(np.uint8)

    def _generate_histogram(self, gray: np.ndarray) -> str:
        hist = cv2.calcHist([gray], [0], None, [256], [0, 256]).flatten()
        hist = hist / (hist.max() + 1e-9)

        width, height = 640, 320
        canvas = np.zeros((height, width, 3), dtype=np.uint8)
        canvas[:] = (39, 26, 10)

        bin_width = width / 256.0
        for i in range(255):
            x1 = int(i * bin_width)
            x2 = int((i + 1) * bin_width)
            y1 = height - int(hist[i] * (height - 30))
            y2 = height - int(hist[i + 1] * (height - 30))
            cv2.line(canvas, (x1, y1), (x2, y2), (220, 190, 60), 2)

        cv2.putText(canvas, 'Pixel Intensity Histogram', (18, 28), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (235, 190, 145), 2, cv2.LINE_AA)
        cv2.putText(canvas, '0', (8, height - 8), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (220, 170, 120), 1, cv2.LINE_AA)
        cv2.putText(canvas, '255', (width - 42, height - 8), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (220, 170, 120), 1, cv2.LINE_AA)

        return self._encode_bgr_image(canvas)

    def _encode_bgr_image(self, image_bgr: np.ndarray) -> str:
        success, encoded = cv2.imencode('.png', image_bgr)
        if not success:
            raise ValueError('Failed to encode image output')
        return self._to_data_url(encoded.tobytes())

    def _encode_gray_image(self, image_gray: np.ndarray) -> str:
        success, encoded = cv2.imencode('.png', image_gray)
        if not success:
            raise ValueError('Failed to encode grayscale output')
        return self._to_data_url(encoded.tobytes())

    def _to_data_url(self, png_bytes: bytes) -> str:
        encoded = base64.b64encode(png_bytes).decode('utf-8')
        return f'data:image/png;base64,{encoded}'
