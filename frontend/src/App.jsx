import React, { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import Header from './components/Header'
import InputSection from './components/InputSection'
import ControlsSection from './components/ControlsSection'
import GraphDisplay from './components/GraphDisplay'
import ResultsSection from './components/ResultsSection'
import LoadingIndicator from './components/LoadingIndicator'
import ImageAnalyzer from './components/ImageAnalyzer'
import { analyzeAudio } from './utils/api'
import { debugLog, createDebugDisplay, debugPanel, logStateChange } from './utils/debug'

function App() {
  const [mode, setMode] = useState('audio')
  const [audioFile, setAudioFile] = useState(null)
  const [audioData, setAudioData] = useState(null)
  const [audioType, setAudioType] = useState('miscellaneous')
  const [isRecording, setIsRecording] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState(null)
  const [error, setError] = useState(null)
  const mediaRecorderRef = useRef(null)
  const audioContextRef = useRef(null)
  const recordedChunksRef = useRef([])

  const audioBufferToWavBlob = (audioBuffer) => {
    const numChannels = 1
    const sampleRate = audioBuffer.sampleRate
    const channelData = audioBuffer.getChannelData(0)
    const bytesPerSample = 2
    const blockAlign = numChannels * bytesPerSample
    const buffer = new ArrayBuffer(44 + channelData.length * bytesPerSample)
    const view = new DataView(buffer)

    const writeString = (offset, value) => {
      for (let i = 0; i < value.length; i += 1) {
        view.setUint8(offset + i, value.charCodeAt(i))
      }
    }

    writeString(0, 'RIFF')
    view.setUint32(4, 36 + channelData.length * bytesPerSample, true)
    writeString(8, 'WAVE')
    writeString(12, 'fmt ')
    view.setUint32(16, 16, true)
    view.setUint16(20, 1, true)
    view.setUint16(22, numChannels, true)
    view.setUint32(24, sampleRate, true)
    view.setUint32(28, sampleRate * blockAlign, true)
    view.setUint16(32, blockAlign, true)
    view.setUint16(34, 16, true)
    writeString(36, 'data')
    view.setUint32(40, channelData.length * bytesPerSample, true)

    let offset = 44
    for (let i = 0; i < channelData.length; i += 1) {
      const sample = Math.max(-1, Math.min(1, channelData[i]))
      view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true)
      offset += bytesPerSample
    }

    return new Blob([buffer], { type: 'audio/wav' })
  }

  const convertBlobToWavFile = async (blob) => {
    const AudioCtx = window.AudioContext || window.webkitAudioContext
    const tempContext = new AudioCtx()
    const arrayBuffer = await blob.arrayBuffer()
    const decoded = await tempContext.decodeAudioData(arrayBuffer.slice(0))
    const wavBlob = audioBufferToWavBlob(decoded)
    await tempContext.close()
    return new File([wavBlob], 'recording.wav', { type: 'audio/wav' })
  }

  const isSupportedAudioFile = (file) => {
    if (!file) return false
    const allowedMimeTypes = [
      'audio/wav',
      'audio/x-wav',
      'audio/mpeg',
      'audio/mp3',
      'audio/webm',
      'audio/ogg',
      'audio/mp4',
      'audio/x-m4a',
    ]
    const allowedExtensions = ['.wav', '.mp3', '.webm', '.ogg', '.m4a']
    const fileName = (file.name || '').toLowerCase()
    const hasValidExtension = allowedExtensions.some((ext) => fileName.endsWith(ext))
    return allowedMimeTypes.includes(file.type) || hasValidExtension
  }

  // Initialize debug console on mount
  useEffect(() => {
    debugLog.info('🚀 App initialized')
    createDebugDisplay()
    debugPanel.addLog('info', '🚀 Application Started', { timestamp: new Date().toLocaleTimeString() })
  }, [])

  // Log state changes for debugging
  useEffect(() => {
    logStateChange('audioFile', null, audioFile)
  }, [audioFile])

  useEffect(() => {
    logStateChange('audioType', null, audioType)
  }, [audioType])

  useEffect(() => {
    logStateChange('isLoading', null, isLoading)
  }, [isLoading])

  useEffect(() => {
    logStateChange('error', null, error)
  }, [error])

  useEffect(() => {
    logStateChange('mode', null, mode)
    if (mode === 'image') {
      setAudioFile(null)
      setResults(null)
      setError(null)
      setIsLoading(false)
      setIsRecording(false)
      recordedChunksRef.current = []
    }
  }, [mode])

  const handleFileUpload = (file) => {
    debugLog.info('📁 File selected', { name: file?.name, size: `${(file?.size / 1024).toFixed(2)}KB` })
    
    if (isSupportedAudioFile(file)) {
      setAudioFile(file)
      setError(null)
      debugLog.success('✅ File validated')
      debugPanel.addLog('success', '✅ Audio file valid', { name: file.name })
    } else {
      const errorMsg = 'Please upload a valid WAV, MP3, WEBM, OGG, or M4A file'
      setError(errorMsg)
      debugLog.error('❌ Invalid file', { format: file?.type })
      debugPanel.addLog('error', '❌ Invalid file format', { type: file?.type })
    }
  }

  const handleStartRecording = async () => {
    try {
      debugLog.info('🎤 Requesting microphone access...')
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const preferredMimeTypes = [
        'audio/webm;codecs=opus',
        'audio/webm',
        'audio/ogg;codecs=opus',
        'audio/ogg',
      ]
      const selectedMimeType = preferredMimeTypes.find((type) => MediaRecorder.isTypeSupported(type))
      const mediaRecorder = selectedMimeType
        ? new MediaRecorder(stream, { mimeType: selectedMimeType })
        : new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      recordedChunksRef.current = []

      debugLog.success('✅ Microphone access granted')
      debugPanel.addLog('success', '✅ Microphone connected', { deviceId: stream.id })

      mediaRecorder.ondataavailable = (event) => {
        recordedChunksRef.current.push(event.data)
        debugLog.info(`📊 Recording chunk: ${(event.data.size / 1024).toFixed(2)}KB`)
      }

      mediaRecorder.onstop = async () => {
        const recorderType = mediaRecorder.mimeType || 'audio/webm'
        const extensionMap = {
          'audio/webm': 'webm',
          'audio/webm;codecs=opus': 'webm',
          'audio/ogg': 'ogg',
          'audio/ogg;codecs=opus': 'ogg',
          'audio/mp4': 'm4a',
          'audio/x-m4a': 'm4a',
        }
        const extension = extensionMap[recorderType] || 'webm'
        const sourceBlob = new Blob(recordedChunksRef.current, { type: recorderType })

        let file
        try {
          file = await convertBlobToWavFile(sourceBlob)
        } catch (conversionError) {
          debugLog.warning('⚠️ WAV conversion failed, using original recording format', {
            mime: recorderType,
            error: conversionError?.message,
          })
          file = new File([sourceBlob], `recording.${extension}`, { type: recorderType })
        }

        setAudioFile(file)
        stream.getTracks().forEach(track => track.stop())
        
        debugLog.success('✅ Recording saved', {
          size: `${(file.size / 1024).toFixed(2)}KB`,
          format: file.name.split('.').pop()?.toUpperCase(),
          mime: file.type,
        })
        debugPanel.addLog('success', '✅ Recording Saved', {
          size: `${(file.size / 1024).toFixed(2)}KB`,
          format: file.name.split('.').pop()?.toUpperCase(),
          mime: file.type,
        })
      }

      mediaRecorder.start()
      setIsRecording(true)
      setError(null)
    } catch (err) {
      const errorMsg = 'Microphone permission denied or not available'
      setError(errorMsg)
      debugLog.error('❌ Microphone error', err.message)
      debugPanel.addLog('error', '❌ Microphone Error', { message: err.message })
    }
  }

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      debugLog.info('⏹️ Recording stopped')
    }
  }

  const handleRunAnalysis = async () => {
    if (!audioFile) {
      const errorMsg = 'Please upload or record audio first'
      setError(errorMsg)
      debugLog.error('❌ No audio file', errorMsg)
      debugPanel.addLog('error', '❌ No Audio File', { error: errorMsg })
      return
    }

    setIsLoading(true)
    setError(null)
    debugLog.info('🔍 Starting analysis...')
    debugPanel.addLog('info', '⏳ Analysis Started', { 
      audioType, 
      fileName: audioFile.name,
      fileSize: `${(audioFile.size / 1024).toFixed(2)}KB`
    })

    try {
      const formData = new FormData()
      formData.append('audio', audioFile)
      formData.append('audio_type', audioType)

      const data = await analyzeAudio(formData)
      setResults(data)
      
      debugLog.success('🎉 Analysis complete!', {
        prediction: data.prediction,
        confidence: `${(data.prediction_confidence * 100).toFixed(1)}%`
      })
      
      debugPanel.addLog('success', '✨ Analysis Complete', {
        prediction: data.prediction,
        confidence: `${(data.prediction_confidence * 100).toFixed(1)}%`
      })
    } catch (err) {
      const errorMsg = err.message || 'Failed to analyze audio'
      setError(errorMsg)
      debugLog.error('💥 Analysis failed', errorMsg)
      debugPanel.addLog('error', '💥 Analysis Failed', { error: errorMsg })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#1a1a2e] to-[#0a0e27] py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <Header />

        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="mb-6"
        >
          <div className="w-full md:w-[360px] p-1 rounded-xl bg-white/5 border border-primary/20 backdrop-blur-sm shadow-glass">
            <div className="relative grid grid-cols-2 gap-1">
              <motion.div
                layout
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                className={`absolute top-0 bottom-0 w-[calc(50%-2px)] rounded-lg bg-gradient-to-r from-primary/30 to-secondary/30 border border-primary/30 ${
                  mode === 'audio' ? 'left-0' : 'left-1/2'
                }`}
              />
              <button
                type="button"
                onClick={() => setMode('audio')}
                className={`relative z-10 px-4 py-2 rounded-lg font-semibold transition-colors ${
                  mode === 'audio' ? 'text-cyan-200' : 'text-secondary/70'
                }`}
              >
                Audio Mode
              </button>
              <button
                type="button"
                onClick={() => setMode('image')}
                className={`relative z-10 px-4 py-2 rounded-lg font-semibold transition-colors ${
                  mode === 'image' ? 'text-cyan-200' : 'text-secondary/70'
                }`}
              >
                Image Mode
              </button>
            </div>
          </div>
        </motion.div>

        {/* Main Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="rounded-2xl border border-primary/20 bg-white/3 backdrop-blur-xl shadow-glow overflow-hidden"
        >
          {mode === 'audio' ? (
            <>
              <InputSection
                audioFile={audioFile}
                isRecording={isRecording}
                onFileUpload={handleFileUpload}
                onStartRecording={handleStartRecording}
                onStopRecording={handleStopRecording}
              />

              <ControlsSection
                audioType={audioType}
                onAudioTypeChange={setAudioType}
                onRunAnalysis={handleRunAnalysis}
                isDisabled={!audioFile || isLoading}
              />

              {error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mx-6 mb-6 p-4 bg-red-900/30 border border-red-500/50 rounded-lg text-red-300"
                >
                  {error}
                </motion.div>
              )}

              {isLoading && <LoadingIndicator />}

              {results && <GraphDisplay results={results} />}

              {results && <ResultsSection results={results} audioType={audioType} />}
            </>
          ) : (
            <ImageAnalyzer key="image-mode" />
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default App
