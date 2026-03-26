# Testing Guide

## Quick Start Testing

### 1. Verify Servers Running

**Backend:**
```bash
curl http://localhost:8000/api/health
# Expected: {"status":"ok"}
```

**Frontend:**
Open browser: http://localhost:3000

### 2. Test With UI

1. Click "📤 Upload Audio" or "🎤 Record Audio"
2. Select audio type
3. Click "▶ ANALYZE"
4. Observe results

### 3. Create Test Audio

**Option A: Use FFmpeg (recommended)**
```bash
# Generate 5-second sine wave (440 Hz pure tone)
ffmpeg -f lavfi -i sine=f=440:d=5 -q:a 9 -acodec libmp3lame test_tone.mp3

# Generate white noise
ffmpeg -f lavfi -i anullsrc=r=44100:cl=mono -t 5 -q:a 9 -acodec libmp3lame noise.mp3

# Record from microphone
ffmpeg -f dshow -i audio="Microphone" -t 10 recording.wav
```

**Option B: Use Online Generator**
- Audacity (open source)
- Generate Menus > Tones
- Export as WAV/MP3

### 4. Test Cases

#### Test 1: Valid Audio Upload
- **File**: Any WAV or MP3
- **Expected**: Display waveform and analysis
- **Result**: ✓ Pass / ✗ Fail

#### Test 2: Audio Recording
- **Action**: Click "🎤 Record"
- **Expected**: Browser asks permission
- **Result**: ✓ Pass / ✗ Fail

#### Test 3: Emotion Classification
- **File**: Speech recording
- **Type**: Human Voice
- **Expected**: Emotion scores (Happy, Sad, Angry, Neutral)
- **Result**: ✓ Pass / ✗ Fail

#### Test 4: Genre Classification
- **File**: Music file
- **Type**: Music
- **Expected**: Genre prediction (Pop, Rock, etc.)
- **Result**: ✓ Pass / ✗ Fail

#### Test 5: Miscellaneous Analysis
- **File**: Ambient sound / nature
- **Type**: Miscellaneous
- **Expected**: Only signal analysis, no prediction
- **Result**: ✓ Pass / ✗ Fail

#### Test 6: Error Handling
- **Action**: Upload non-audio file
- **Expected**: Error message displayed
- **Result**: ✓ Pass / ✗ Fail

### 5. API Testing with cURL

**Test Analyze Endpoint:**
```bash
curl -X POST http://localhost:8000/api/analyze \
  -F "audio=@path/to/audio.wav" \
  -F "audio_type=human_voice" \
  -H "Content-Type: multipart/form-data"
```

**Test Health Endpoint:**
```bash
curl http://localhost:8000/api/health
```

### 6. Browser DevTools Checks

**Console:**
- No JavaScript errors
- API calls successful
- Components rendering

**Network:**
- POST /api/analyze → 200 OK
- Response contains expected JSON
- File upload size < 50MB

**Performance:**
- Initial load < 3 seconds
- Analysis < 10 seconds
- No memory leaks

### 7. UI/UX Checks

**Visual Elements:**
- ✓ Neon green and blue colors visible
- ✓ Glow effects on borders
- ✓ Smooth animations
- ✓ Loading indicator shows during processing

**Interactivity:**
- ✓ Buttons respond to clicks
- ✓ Dropdown works
- ✓ File upload valid files
- ✓ Error messages clear

**Responsiveness:**
- ✓ Desktop layout (1920x1080)
- ✓ Tablet layout (768x1024)
- ✓ Mobile layout (320x568)

### 8. Performance Testing

**Load Testing:**
```bash
# Multiple concurrent requests (requires tool like wrk or Apache Bench)
ab -n 100 -c 10 http://localhost:8000/api/health
```

**Response Times:**
- Health check: < 100ms
- Analysis: < 10 seconds
- Graph rendering: < 2 seconds

### 9. Edge Cases

**Test Invalid Inputs:**
- Empty file
- Corrupted audio
- Wrong format (e.g., PDF)
- Very large file (> 100MB)
- Mono vs Stereo
- Different sample rates

**Test Missing Components:**
- No audio selected
- No audio type selected
- Backend offline
- Network timeout

### 10. Browser Compatibility

**Test on:**
- [ ] Chrome/Chromium
- [ ] Firefox
- [ ] Safari
- [ ] Edge
- [ ] Mobile Safari
- [ ] Chrome Mobile

### 11. Integration Testing

**Full User Flow:**
1. Load application
2. Record 10 seconds of speech
3. Select "Human Voice"
4. Click Analyze
5. Verify emotion prediction appears
6. Upload music file
7. Select "Music"
8. Click Analyze
9. Verify genre prediction appears
10. Check feature table populated

### 12. Regression Testing

After code changes, verify:
- [ ] API endpoints still work
- [ ] Frontend components render
- [ ] Charts display correctly
- [ ] Classifications still accurate
- [ ] No console errors
- [ ] Styling still matches spec

## Automated Testing Setup

### Frontend Testing (Optional)
```bash
npm install --save-dev jest @testing-library/react

# Create test files: src/components/__tests__/
# Run: npm test
```

### Backend Testing
```python
# Install pytest
pip install pytest pytest-asyncio

# Create tests: backend/tests/
# Run: pytest
```

## Performance Baseline

### Expected Performance

| Operation | Time | Target |
|-----------|------|--------|
| App Load | 2-3s | < 5s |
| Health Check | 50ms | < 200ms |
| Record Start | 500ms | < 1s |
| Analyze 5s audio | 3-5s | < 10s |
| Chart Render | 1-2s | < 3s |

### Memory Usage

- Frontend: 50-100MB
- Backend: 200-300MB
- Total: 250-400MB RAM

## Troubleshooting Failed Tests

### API Errors
- Verify backend running: `curl http://localhost:8000/`
- Check port 8000 available
- Check logs in terminal for errors

### UI Issues
- Clear browser cache
- Open DevTools console
- Check for JavaScript errors
- Try different browser

### Audio Problems
- Verify file is valid: `ffprobe audio.wav`
- Check sample rate: `ffprobe -show_streams audio.wav`
- Try test audio from assets/

### Permission Issues
- Check microphone permissions
- Try different browser
- Restart browser
- Check OS privacy settings

## Test Report Template

```
TEST RUN: [Date] [Environment]

PASSED TESTS:
- [ ] Test 1
- [ ] Test 2

FAILED TESTS:
- [ ] Test 3 - Reason

NOTES:
- [Observations]

PERFORMANCE:
- Load time: XXs
- Analysis time: XXs
- Memory: XXmB

BROWSER:
- [Browser and version]

ISSUES FOUND:
1. [Issue description]
2. [Issue description]
```

## Continuous Testing

Monitor these in production:
- Error rate in backend logs
- API response times
- Browser console for client errors
- User feedback
- Failed analysis cases

##Load.net Testing Tools

- **Postman**: API testing
- **JMeter**: Load testing
- **Selenium**: Browser automation
- **Lighthouse**: Performance auditing
