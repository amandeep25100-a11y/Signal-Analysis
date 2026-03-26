# Frontend Documentation

## Overview
React + Vite web application with modern UI and real-time signal visualization.

## Project Structure

### Components

#### Header
- Displays application title with gradient animation
- Subtitle and decorative underline
- Uses Framer Motion for smooth appearance

#### InputSection
- File upload button (accepts WAV/MP3)
- Microphone recording toggle
- File information display
- Recording status indicator

#### ControlsSection
- Audio type dropdown (Human Voice / Music / Miscellaneous)
- Analyze button (disabled when no audio)
- Responsive layout

#### GraphDisplay
- Waveform visualization (time domain)
- FFT spectrum chart (frequency domain)
- Cleaned audio comparison
- Spectrogram info display
- Uses Recharts for interactive charts

#### ResultsSection
- Classification prediction display
- Confidence score
- Emotion/Genre scores breakdown
- Extracted audio features table

#### LoadingIndicator
- Animated loading dots
- Status message
- Smooth appearance/disappearance

### Utilities

#### api.js
- Axios instance for API communication
- `analyzeAudio()` function for backend calls
- Error handling and response parsing

## Styling

### Design System

**Colors:**
- Primary: Neon Green (#39FF14)
- Secondary: Electric Blue (#00FFFF)
- Background: Black (#000000)
- Dark gradient: #0a0e27 to #1a1a2e

**Effects:**
- Glassmorphism with backdrop blur
- Neon glow shadows
- Smooth animations (Framer Motion)
- Responsive grid layouts (Tailwind)

### CSS Classes

```tailwind
- neon-green: #39FF14
- neon-blue: #00FFFF
- neon-black: #000000
- shadow-neon-glow: Soft glow border
- shadow-neon-glow-strong: Intense glow
- animate-pulse-glow: Pulsing glow animation
```

## State Management

### App.jsx State
- `audioFile`: Currently loaded audio file
- `audioData`: Processed audio derivatives
- `audioType`: Selected classification type
- `isRecording`: Recording status
- `isLoading`: Analysis in progress
- `results`: Analysis results
- `error`: Error message display

### Event Handlers
- `handleFileUpload()`: Process uploaded file
- `handleStartRecording()`: Initialize recording
- `handleStopRecording()`: Finalize recording
- `handleRunAnalysis()`: Call backend API
- `handleAudioTypeChange()`: Update selection

## API Integration

### Request Handling
```javascript
const formData = new FormData()
formData.append('audio', audioFile)
formData.append('audio_type', audioType)
const data = await analyzeAudio(formData)
```

### Response Processing
- Extract waveform data for charts
- Format emotion/genre scores
- Display audio features
- Handle prediction results

### Error Handling
- File format validation
- No audio detection
- Microphone permission errors
- Network errors
- Detailed error messages to user

## Interactive Features

### File Upload
- Click to browse files
- File type validation (WAV/MP3)
- File size display
- Visual confirmation

### Live Recording
- MediaRecorder API
- Start/stop controls
- Stream audio to backend
- Recording indicator

### Dynamic Charts
- Responsive sizing
- Interactive tooltips
- Color-coded data points
- Smooth animations

### Real-time Updates
- Results appear as soon as analysis completes
- Loading animation during processing
- Error messages displayed immediately

## Performance Optimization

### Code Splitting
- Components are modules
- Lazy loading capability
- Efficient re-renders with React.memo

### Bundle Size
- Lightweight dependencies
- Production build optimization
- No unnecessary libraries

### Rendering
- Framer Motion for animations
- Debounced inputs
- Memoized results

## Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

Required features:
- MediaRecorder API (recording)
- Canvas API (charting)
- FormData API
- Fetch/Axios

## Configuration

### Vite Config
```javascript
server: {
  port: 3000,
  proxy: {
    '/api': 'http://localhost:8000'
  }
}
```

### Tailwind Config
- Custom neon colors
- Glow shadow effects
- Pulse animation keyframes

## Development

### Start Dev Server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

### Preview Build
```bash
npm run preview
```

## Component Lifecycle

1. **App Loads**: Header renders, Input section ready
2. **User Uploads**: File validated, preview displayed
3. **User Analyzes**: Loading indicator shown
4. **Backend Processes**: API call made with audio data
5. **Results Arrive**: Graphs and scores displayed
6. **User Reviews**: Can download, save, or analyze another file

## Accessibility

- Semantic HTML elements
- ARIA labels on buttons
- Color contrast meets WCAG AA
- Keyboard navigation support
- Screen reader compatible structure

## Mobile Responsiveness

- Grid adjusts to single column on mobile
- Touch-friendly buttons
- Dropdown works on all devices
- Charts scale responsively
- Text remains readable

## Common Patterns

### Animation Pattern
```jsx
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.3 }}
>
  Content
</motion.div>
```

### State Update Pattern
```jsx
const [state, setState] = useState(initialValue)
const handleChange = (value) => setState(value)
```

### Conditional Rendering
```jsx
{results && <GraphDisplay results={results} />}
{error && <ErrorMessage error={error} />}
```

## Extending Frontend

### Add New Component
1. Create file in `src/components/`
2. Export React component
3. Import in App.jsx
4. Add to JSX tree

### Add New Page
1. Create new route handler
2. Add React Router
3. Create page component
4. Update App.jsx

### Customize Styling
1. Edit `tailwind.config.js` for colors
2. Edit `index.css` for globals
3. Add component-specific styles
4. Use Tailwind classes in JSX

## Troubleshooting

### Charts not rendering
- Check data format matches Recharts expected shape
- Verify waveform_data contains time/value keys
- Ensure fft_data has frequency/magnitude keys

### Styles not applying
- Clear Tailwind cache
- Rebuild with `npm run build`
- Check class names for typos
- Verify tailwind.config.js includes src paths

### API calls failing
- Check backend is running on port 8000
- Verify CORS enabled in FastAPI
- Check browser console for errors
- Test with curl first

### Recording not working
- Grant microphone permission
- Check browser supports MediaRecorder
- Ensure HTTPS in production
- Different browser might help

## Dependencies

- react: UI library
- react-dom: DOM rendering
- axios: HTTP requests
- framer-motion: Animations
- recharts: Charting library
- tailwindcss: Styling framework
- postcss/autoprefixer: CSS processing
- vite: Build tool

## Browser DevTools Tips

- Check Network tab for API calls
- Console for JavaScript errors
- Performance tab for rendering issues
- Application tab for local storage
- DevTools animation inspector
