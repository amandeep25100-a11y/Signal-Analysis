from fastapi import APIRouter, File, UploadFile, Form, HTTPException
import tempfile
import os
import logging
from app.services.audio_processor import AudioProcessor
from app.services.audio_enhancer import AudioEnhancer
from app.services.classifiers import EmotionClassifier, GenreClassifier
from app.services.image_processor import ImageProcessor

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api", tags=["analysis"])

# Initialize processors and classifiers
audio_processor = AudioProcessor()
audio_enhancer = AudioEnhancer()
emotion_classifier = EmotionClassifier()
genre_classifier = GenreClassifier()
image_processor = ImageProcessor()

@router.post("/analyze")
async def analyze_audio(audio: UploadFile = File(...), audio_type: str = Form(...)):
    """
    Analyze audio file with signal processing and ML classification.
    
    - audio_type: 'human_voice', 'music', or 'miscellaneous'
    """
    
    logger.info(f"🎵 Received analysis request - Audio Type: {audio_type}")
    logger.info(f"📁 Filename: {audio.filename}, Content Type: {audio.content_type}")
    
    # Validate audio type
    if audio_type not in ['human_voice', 'music', 'miscellaneous']:
        logger.error(f"❌ Invalid audio_type: {audio_type}")
        raise HTTPException(status_code=400, detail="Invalid audio_type")
    
    # Validate file
    if not audio.filename:
        logger.error("❌ No filename provided")
        raise HTTPException(status_code=400, detail="No audio file provided")
    
    try:
        # Save uploaded file temporarily
        logger.info("💾 Saving temporary file...")
        original_ext = os.path.splitext(audio.filename)[1].lower() if audio.filename else ""
        if not original_ext:
            content_type_suffix = {
                "audio/wav": ".wav",
                "audio/x-wav": ".wav",
                "audio/mpeg": ".mp3",
                "audio/mp3": ".mp3",
                "audio/webm": ".webm",
                "audio/ogg": ".ogg",
                "audio/mp4": ".m4a",
                "audio/x-m4a": ".m4a",
            }
            original_ext = content_type_suffix.get(audio.content_type or "", ".bin")

        with tempfile.NamedTemporaryFile(delete=False, suffix=original_ext) as tmp_file:
            content = await audio.read()
            logger.info(f"📊 File size: {len(content)} bytes")
            tmp_file.write(content)
            tmp_path = tmp_file.name
            logger.info(f"✅ Temp file saved: {tmp_path}")
        
        # Load audio
        logger.info("🔊 Loading audio...")
        try:
            y, sr = audio_processor.load_audio(tmp_path)
            logger.info(f"✅ Audio loaded - SR: {sr}Hz, Length: {len(y)} samples, Duration: {len(y)/sr:.2f}s")
        except Exception as e:
            logger.error(f"❌ Audio loading failed: {str(e)}", exc_info=True)
            raise HTTPException(status_code=400, detail=f"Invalid audio format: {str(e)}")
        
        # Check if audio is not empty
        if len(y) == 0:
            logger.error("❌ Empty audio detected")
            raise HTTPException(status_code=400, detail="No audio detected")
        
        # Extract features
        logger.info("📈 Extracting features...")
        try:
            features = audio_processor.extract_features(y, sr)
            logger.info(f"✅ Features extracted - Duration: {features['duration']:.2f}s, Tempo: {features['tempo']:.1f}")
        except Exception as e:
            logger.error(f"❌ Feature extraction failed: {str(e)}", exc_info=True)
            raise HTTPException(status_code=500, detail=f"Feature extraction error: {str(e)}")
        
        # Generate visualization data
        logger.info("📊 Generating visualization data...")
        try:
            waveform_data = audio_processor.get_waveform_data(y, sr)
            fft_data = audio_processor.get_fft_data(y, sr)
            spectrogram_data = audio_processor.get_spectrogram_data(y, sr)
            logger.info(f"✅ Visualization data ready - Waveform points: {len(waveform_data)}, FFT bins: {len(fft_data)}")
        except Exception as e:
            logger.error(f"❌ Visualization generation failed: {str(e)}", exc_info=True)
            raise HTTPException(status_code=500, detail=f"Visualization error: {str(e)}")
        
        # Apply noise reduction
        logger.info("🔇 Applying noise reduction...")
        try:
            y_clean = audio_processor.reduce_noise(y, sr)
            cleaned_waveform_data = audio_processor.get_waveform_data(y_clean, sr)
            logger.info("✅ Noise reduction complete")
        except Exception as e:
            logger.error(f"❌ Noise reduction failed: {str(e)}", exc_info=True)
            raise HTTPException(status_code=500, detail=f"Noise reduction error: {str(e)}")
        
        # Prepare response
        response = {
            "waveform_data": waveform_data,
            "fft_data": fft_data,
            "spectrogram_data": spectrogram_data,
            "cleaned_waveform_data": cleaned_waveform_data,
            "duration": features['duration'],
            "sample_rate": features['sample_rate'],
            "rms_energy": features['rms_energy'],
            "spectral_centroid": features['spectral_centroid'],
            "mfcc_mean": features['mfcc_mean'],
            "zcr": features['zcr'],
            "tempo": features['tempo'],
            "pitch": features['pitch'],
        }
        
        # Apply classification based on audio type
        logger.info(f"🤖 Running classification for: {audio_type}")
        try:
            if audio_type == 'human_voice':
                logger.info("😊 Emotion classification...")
                prediction, confidence, scores = emotion_classifier.predict(y, sr)
                logger.info(f"✅ Emotion: {prediction} (Confidence: {confidence:.2%})")
                response.update({
                    "prediction": prediction,
                    "prediction_confidence": confidence,
                    "emotion_scores": scores
                })
            elif audio_type == 'music':
                logger.info("🎵 Genre classification...")
                prediction, confidence, scores, tempo = genre_classifier.predict(y, sr)
                logger.info(f"✅ Genre: {prediction} (Confidence: {confidence:.2%}, Tempo: {tempo:.1f})")
                response.update({
                    "prediction": prediction,
                    "prediction_confidence": confidence,
                    "genre_scores": scores,
                    "tempo": tempo
                })
            else:  # miscellaneous
                logger.info("📊 Miscellaneous analysis (no classification)")
                response.update({
                    "prediction": "No prediction for miscellaneous audio",
                    "prediction_confidence": 0.0
                })
        except Exception as e:
            logger.error(f"❌ Classification failed: {str(e)}", exc_info=True)
            raise HTTPException(status_code=500, detail=f"Classification error: {str(e)}")
        
        # Clean up temporary file
        logger.info(f"🧹 Cleaning up temp file: {tmp_path}")
        try:
            os.unlink(tmp_path)
            logger.info("✅ Temp file deleted")
        except Exception as e:
            logger.warning(f"⚠️ Could not delete temp file: {e}")
        
        logger.info("✅✅✅ Analysis complete - sending response")
        return response
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌❌❌ Unexpected error: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Error analyzing audio: {str(e)}")


@router.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "ok"}


@router.post("/analyze-image")
async def analyze_image(image: UploadFile = File(...), filter_strength: float = Form(0.15)):
    """Analyze image as a 2D signal."""

    logger.info(f"🖼️ Received image analysis request - file: {image.filename}, type: {image.content_type}")

    if not image.filename:
        raise HTTPException(status_code=400, detail="No image file provided")

    valid_types = {"image/jpeg", "image/jpg", "image/png"}
    if image.content_type and image.content_type.lower() not in valid_types:
        raise HTTPException(status_code=400, detail="Invalid image format. Please upload JPG or PNG")

    try:
        content = await image.read()
        if not content:
            raise HTTPException(status_code=400, detail="Empty image upload")

        img = image_processor.load_image_from_bytes(content)
        result = image_processor.analyze(img, filter_strength=filter_strength)

        logger.info("✅ Image analysis complete")
        return result

    except HTTPException:
        raise
    except ValueError as e:
        logger.error(f"❌ Image validation error: {str(e)}", exc_info=True)
        raise HTTPException(status_code=400, detail=f"Invalid image: {str(e)}")
    except Exception as e:
        logger.error(f"❌ Image analysis failed: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Image analysis error: {str(e)}")


@router.post("/clean-audio")
async def clean_audio(audio: UploadFile = File(...), strength: float = Form(0.8)):
    """Remove background noise and enhance uploaded audio."""
    logger.info(f"🧼 Received clean-audio request - file: {audio.filename}, type: {audio.content_type}, strength: {strength}")

    if not audio.filename:
        raise HTTPException(status_code=400, detail="No audio file provided")

    try:
        original_ext = os.path.splitext(audio.filename)[1].lower() if audio.filename else ""
        if not original_ext:
            content_type_suffix = {
                "audio/wav": ".wav",
                "audio/x-wav": ".wav",
                "audio/mpeg": ".mp3",
                "audio/mp3": ".mp3",
                "audio/webm": ".webm",
                "audio/ogg": ".ogg",
                "audio/mp4": ".m4a",
                "audio/x-m4a": ".m4a",
            }
            original_ext = content_type_suffix.get(audio.content_type or "", ".bin")

        with tempfile.NamedTemporaryFile(delete=False, suffix=original_ext) as tmp_file:
            content = await audio.read()
            if not content:
                raise HTTPException(status_code=400, detail="Empty audio upload")

            tmp_file.write(content)
            tmp_path = tmp_file.name

        try:
            result = audio_enhancer.clean_audio(tmp_path, strength=strength)
            logger.info("✅ Audio cleaning complete")
            return result
        finally:
            try:
                os.unlink(tmp_path)
            except Exception:
                pass

    except HTTPException:
        raise
    except ValueError as e:
        logger.error(f"❌ Audio cleaning validation error: {str(e)}", exc_info=True)
        raise HTTPException(status_code=400, detail=f"Invalid audio format: {str(e)}")
    except Exception as e:
        logger.error(f"❌ Audio cleaning failed: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Audio cleaning error: {str(e)}")
