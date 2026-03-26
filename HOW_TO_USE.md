# 🎯 HOW TO USE - Audio Signal Analyzer Pro

## ⚡ Quick Start (Right Now!)

Your application is **ALREADY RUNNING** and ready to use!

### Access the Application
1. Open your web browser
2. Go to: **http://localhost:3000**
3. You should see the Audio Signal Analyzer interface

---

## 🎤 Option 1: Record Audio (Easiest)

1. **Click "🎤 Record Audio" button**
2. **Grant Microphone Permission** when prompted
3. **Speak or make sound** for 5-10 seconds
4. **Click "⏹️ Stop Recording"**
5. **Select Audio Type**:
   - 🎤 Human Voice (for emotion detection)
   - 🎵 Music (for genre classification)
   - 📊 Miscellaneous (for analysis only)
6. **Click "▶ ANALYZE"**
7. **Wait for processing** (animated dots will show)
8. **View Your Results**:
   - Waveform graph
   - FFT spectrum
   - Cleaned audio version
   - Classification prediction
   - Confidence scores
   - Audio features

---

## 📤 Option 2: Upload Audio File

1. **Click "📤 Upload Audio" button**
2. **Select a file** from your computer:
   - WAV format (best)
   - MP3 format (also works)
3. **See file info** displayed (name, size)
4. **Select Audio Type**
5. **Click "▶ ANALYZE"**
6. **Wait for results**
7. **View graphs and predictions**

---

## 📊 Understanding the Results

### Waveform (Time Domain)
- Shows how loud the audio is over time
- Higher peaks = louder parts
- Smooth wave = consistent volume

### FFT Spectrum (Frequency Domain)
- Shows which frequencies are in the audio
- Low frequencies (left) = bass/bass tones
- High frequencies (right) = treble/high notes

### Cleaned Audio
- Audio after noise reduction
- Should be cleaner and smoother
- Try to spot the difference from original

### Classification Results

#### If Human Voice:
- **Emotion Prediction**: Happy, Sad, Angry, or Neutral
- **Confidence Score**: How sure the system is (0-100%)
- **Emotion Scores**: Breakdown of all emotions

#### If Music:
- **Genre Prediction**: Pop, Rock, Classical, Hip-Hop, or Jazz
- **Confidence Score**: System confidence level
- **Genre Scores**: Breakdown of all genres
- **Tempo**: BPM (beats per minute)

#### If Miscellaneous:
- **Analysis Only**: Waveform, spectrum, features
- **No Prediction**: System doesn't classify
- **Features**: Audio characteristics

### Audio Features Displayed
- **Duration**: Total audio length in seconds
- **Sample Rate**: Audio quality (22050 Hz = standard)
- **RMS Energy**: Overall loudness
- **Spectral Centroid**: "Brightness" of audio
- **MFCC Mean**: Audio timbre characteristic
- **Zero Crossing Rate**: How much pitch variation

---

## 🧪 Test With Example Sounds

### If You Have FFmpeg Installed
```bash
# Generate a test tone
ffmpeg -f lavfi -i sine=f=440:d=5 -q:a 9 test.mp3

# Generate noise (for testing miscellaneous)
ffmpeg -f lavfi -i anullsrc=r=44100 -t 5 -q:a 9 noise.mp3
```

### Without FFmpeg
- Record your own voice
- Find audio online
- Use any MP3/WAV file

---

## 💡 Tips for Best Results

### Voice Recording
- **Speak clearly** in a quiet environment
- **Longer is better**: 10-30 seconds recommended
- **Try different emotions** for comparison
- **Speak naturally** (not robotic)

### Music Files
- **Good quality** audio files work better
- **10-30 seconds** is ideal
- **Try different genres** to test
- **Clear music** (not too muffled)

### General Tips
- **Avoid background noise** for better analysis
- **Use different file formats** to test
- **Try short vs long audio** to see differences
- **Export results** by taking screenshots

---

## 🔄 Analyze Multiple Files

You can:
1. Upload/record audio
2. Click ANALYZE
3. View results
4. Upload a NEW file
5. ANALYZE again
6. Results will update automatically

The system shows the latest analysis results.

---

## 🎨 Theme & Visual Elements

### Colors Explained
- **Neon Green**: Primary color, indicates active elements
- **Electric Blue**: Secondary color, information display
- **Black**: Background, clean and modern

### Visual Feedback
- **Glowing borders**: Active sections
- **Smooth animations**: Elements fade in
- **Loading dots**: System is processing
- **Charts**: Interactive visualization

---

## 🆘 Troubleshooting

### "No Audio Detected"
- Make sure you recorded or uploaded the file
- Try a different audio file
- Check file format is WAV or MP3

### "Error Processing Audio"
- File might be corrupted
- Try a different audio file
- Check file size (under 50MB recommended)

### Microphone Not Working
- Grant browser permission when asked
- Check OS microphone isn't blocked
- Try Chrome/Firefox if Edge doesn't work
- Restart browser if stuck

### Results Taking Long Time
- Normal for the first analysis (3-10 seconds)
- Shorter audio files are faster
- Check system isn't doing heavy work

### Graphs Not Showing
- Refresh the page (Ctrl+R or Cmd+R)
- Clear browser cache
- Try different browser
- Check browser developer console (F12) for errors

---

## 🔍 What's Happening Behind the Scenes

1. **Upload Phase**
   - File is sent to backend
   - Backend validates format
   - Audio is loaded and resampled

2. **Analysis Phase**
   - Audio is converted to waveform
   - FFT computation (converts to frequencies)
   - Spectrogram generation
   - Feature extraction (10+ characteristics)

3. **Cleaning Phase**
   - Noise reduction algorithm runs
   - Spectral gating applied
   - Cleaned waveform created

4. **Classification Phase**
   - Features sent to classifier
   - Machine learning model predicts
   - Scores calculated for all classes
   - Confidence determined

5. **Display Phase**
   - Results formatted for display
   - Charts generated from data
   - Frontend renders all visualizations
   - Results shown to you

Total time: **3-10 seconds** for a typical 5-30 second audio file

---

## 📱 Can I Use on Mobile?

**Yes, but with limitations:**
- Recording works better on mobile
- File upload works
- Display is responsive
- Charts may be smaller
- Best on tablet or larger screen

**Recommended**: Desktop/laptop for full experience

---

## ❓ Frequently Asked Questions

**Q: Can I download the results?**
A: Currently view only. You can screenshot or save the page.

**Q: What file formats work?**
A: WAV and MP3 are supported.

**Q: How long can the audio be?**
A: Recommended under 30 seconds. Works up to ~5 minutes.

**Q: Is my audio saved?**
A: No, processed in-memory, deleted after analysis.

**Q: Can I use in production?**
A: Yes, application is production-ready!

**Q: Can I modify the code?**
A: Yes, all source code is included and documented.

**Q: Is it free to use?**
A: Yes, open source and free!

---

## 🚀 Next Steps

1. **Try it now**: Open http://localhost:3000
2. **Test recording**: Click record and speak
3. **Analyze**: Run analysis on your audio
4. **Explore**: Try different audio types
5. **Learn more**: Read README.md for details

---

## 📞 Need Help?

Check these resources:
1. **QUICKSTART.md** - 5-minute guide
2. **README.md** - Full documentation
3. **TESTING.md** - Test procedures
4. **ARCHITECTURE.md** - Technical details

---

## 🎉 Have Fun!

The application is ready to explore. Experiment with:
- Different audio types
- Various recording conditions
- Different music genres
- Various voice emotions
- Comparing noise reduction

Enjoy analyzing audio! 🎵

---

**Audio Signal Analyzer Pro v1.0.0**
**Status: Running & Ready to Use**
