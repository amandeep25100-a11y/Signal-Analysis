# 🐛 Debug Console Guide

## What's Fixed

✅ **Fixed the 404 error** - The proxy was stripping the `/api` prefix, now it keeps it
✅ **Added comprehensive logging** - Backend logs every step of analysis
✅ **Added frontend debug console** - Visible on-screen debugging with color-coded logs
✅ **API interceptors** - All requests/responses are now logged

---

## How to View Logs

### 1. **Browser Console (Bottom Right - Green Box)**
A __floating debug panel__ will appear in the bottom-right corner of your browser:

- **[INFO]** - Blue messages - Informational logs
- **[SUCCESS]** - Green messages - Operations completed
- **[ERROR]** - Red messages - Errors occurred
- **[WARNING]** - Orange messages - Warnings

Each log shows:
- Timestamp
- Action description
- Relevant data

### 2. **Browser Developer Console (F12)**
Much more detailed information:

1. Press **F12** to open Developer Tools
2. Go to **Console** tab
3. You'll see colored log output:
   - 🔵 Blue = Info messages
   - 🟢 Green = Success messages
   - 🔴 Red = Error messages
   - 🟠 Orange = Warning messages

Example output:
```
[INFO] 📁 File selected  {name: "recording.wav", size: "74.20 KB"}
[SUCCESS] ✅ File validated
[INFO] 🚀 Starting audio analysis...
[API] POST /api/analyze
[SUCCESS] ✨ Analysis complete!
```

### 3. **Backend Server Logs**
The backend terminal will show detailed step-by-step logging:

```
🎵 Received analysis request - Audio Type: human_voice
📁 Filename: recording.wav, Content Type: audio/wav
💾 Saving temporary file...
📊 File size: 74204 bytes
✅ Temp file saved: /tmp/tmpXXXXXX.wav
🔊 Loading audio...
✅ Audio loaded - SR: 22050Hz, Length: 110250 samples, Duration: 5.00s
📈 Extracting features...
✅ Features extracted - Duration: 5.00s, Tempo: 120.5
📊 Generating visualization data...
✅ Visualization data ready
🔇 Applying noise reduction...
✅ Noise reduction complete
🤖 Running classification for: human_voice
😊 Emotion classification...
✅ Emotion: happy (Confidence: 85.00%)
✅✅✅ Analysis complete - sending response
```

---

## Testing the Fix

### Step 1: Open the Application
1. Go to **http://localhost:3000**
2. You should see the app interface
3. **Bottom-right corner** will have a green "🐛 DEBUG CONSOLE" box

### Step 2: Try Recording Audio
1. Click **"🎤 Record Audio"**
2. Speak for 5-10 seconds
3. Click **"⏹️ Stop Recording"**
4. **Watch the debug console** - you'll see:
   ```
   [INFO] 🎤 Requesting microphone access...
   [SUCCESS] ✅ Microphone access granted
   [INFO] 📊 Recording chunk: 8.50KB
   [SUCCESS] ✅ Recording Saved (74.20 KB)
   ```

### Step 3: Select Type & Analyze
1. Select **"🎤 Human Voice"** from dropdown
2. Click **"▶ ANALYZE"**
3. **Watch both consoles:**

**Debug Panel (Bottom-right):**
```
[INFO] ⏳ Sending audio to backend...
[SUCCESS] 📤 API Request: POST /api/analyze
[INFO] ⏳ Analysis Started
[SUCCESS] ✨ Analysis Successful (2500ms)
```

**Backend Terminal (if running locally):**
```
🎵 Received analysis request - Audio Type: human_voice
💾 Saving temporary file...
✅ Temp file saved
🔊 Loading audio...
✅ Audio loaded - SR: 22050Hz
📈 Extracting features...
✅ Features extracted
...
✅♦ Emotion: happy (Confidence: 85.00%)
```

---

## What Each Log Means

### Frontend Logs

| Log | Meaning |
|-----|---------|
| `🎤 Requesting microphone access` | Getting permission |
| `✅ Microphone access granted` | Permission approved |
| `📁 File selected` | User chose file |
| `✅ File validated` | File format is good |
| `❌ Invalid file format` | Wrong file type |
| `⏳ Sending audio to backend` | Starting analysis |
| `📤 API Request: POST /api/analyze` | API call being made |
| `✨ Analysis Successful` | Analysis completed |
| `💥 Analysis Failed` | Something went wrong |
| `❌ Error 500` | Backend error |

### Backend Logs

| Log | Meaning |
|-----|---------|
| `🎵 Received analysis request` | API call received |
| `💾 Saving temporary file` | Storing uploaded audio |
| `🔊 Loading audio...` | Reading audio data |
| `📈 Extracting features...` | Computing audio properties |
| `📊 Generating visualization...` | Creating graph data |
| `🔇 Applying noise reduction` | Cleaning audio |
| `🤖 Running classification` | Starting ML prediction |
| `😊/🎵 [Emotion/Genre] classification` | Specific type running |
| `✅ Emotion: happy` | Final prediction |
| `✅✅✅ Analysis complete` | Success! |
| `❌ Error message` | Something failed |

---

## Troubleshooting

### Debug Console Not Appearing?
1. Refresh the page (Ctrl+R)
2. Look in **bottom-right corner**
3. Check browser console (F12) for errors

### No Logs in Debug Panel?
1. Open **F12 Developer Tools**
2. Go to **Console** tab
3. Should see colored logs there
4. Check backend terminal for server logs

### "Request failed with status code 500"?
1. Check **backend terminal** for error details
2. Look for red 🔴 **[ERROR]** messages
3. The log will say exactly what failed

### "POST /api/analyze 404"?
This should be fixed now, but if you see it:
1. Restart backend: `Ctrl+C` then run again
2. Clear frontend cache: `Ctrl+Shift+Del`
3. Reload page: `Ctrl+R`

---

## Debug Console Features

### View Logs
- Sorted by timestamp
- Color-coded by level
- Latest at bottom
- Scrollable if many logs

### Clear Logs
- Click **"Clear"** button in debug panel
- Or open console and remove manually

### Disable Debug Mode
If you want to disable logging (not recommended for fixing issues):
Edit `frontend/src/utils/debug.js`:
```javascript
const DEBUG_ENABLED = false; // Change to false
```

---

## Example: Full Debugging Session

```
4:10:06 pm [INFO] 🚀 App initialized
4:10:08 pm [INFO] 📁 File selected  {name: "recording.wav", size: "74.20 KB"}
4:10:08 pm [SUCCESS] ✅ File validated
4:10:10 pm [INFO] 🎤 Requesting microphone access...
4:10:10 pm [SUCCESS] ✅ Microphone access granted
4:10:15 pm [INFO] 📊 Recording chunk: 8.50KB
4:10:15 pm [SUCCESS] ✅ Recording Saved (74.20 KB)
4:10:17 pm [INFO] 🔍 Starting analysis...
4:10:17 pm [INFO] ⏳ Analysis Started (audio file, human_voice)
4:10:17 pm [SUCCESS] 📤 API Request: POST /api/analyze
4:10:17 pm [INFO] 📤 API Request sent  {files: [...], type: "human_voice"}
4:10:20 pm [SUCCESS] ✅ API Response: 200
4:10:20 pm [SUCCESS] ✨ Analysis Successful (2500ms)
4:10:20 pm [INFO] Emotion: happy, Confidence: 85%
```

---

## Production Tips

When deploying:
1. Keep debugging **ENABLED** for first week
2. Monitor backend logs for errors
3. Watch frontend console for API issues
4. Disable debug console in production:
   ```javascript
   const DEBUG_ENABLED = false;
   ```

---

## Next Steps

1. **Test now**: Open http://localhost:3000
2. **Record audio**: Try the microphone
3. **Watch logs**: Both console and debug panel
4. **Analyze**: Click the blue ANALYZE button
5. **Fix issues**: Logs will tell you what's wrong!

---

**Status**: ✅ All debug systems ready!

Open http://localhost:3000 to see the fixed application with full debug console!
