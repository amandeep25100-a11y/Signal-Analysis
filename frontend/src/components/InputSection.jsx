import React, { useRef } from 'react'
import { motion } from 'framer-motion'

export default function InputSection({ audioFile, isRecording, onFileUpload, onStartRecording, onStopRecording }) {
  const fileInputRef = useRef(null)

  const getFileExtension = (name = '') => {
    const idx = name.lastIndexOf('.')
    return idx >= 0 ? name.slice(idx + 1).toUpperCase() : 'UNKNOWN'
  }

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      onFileUpload(e.target.files[0])
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="p-8 border-b border-primary/20"
    >
      <h2 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600" style={{fontFamily: 'Aptos, system-ui, sans-serif'}}>INPUT SECTION</h2>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Upload Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => fileInputRef.current?.click()}
          className="flex-1 px-6 py-4 bg-gradient-to-r from-primary/20 to-secondary/20 border-2 border-primary/40 rounded-lg font-semibold text-blue-300 hover:border-primary hover:shadow-glow backdrop-blur-xs transition-all duration-300"
        >
          📤 Upload Audio
        </motion.button>

        {/* Record Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={isRecording ? onStopRecording : onStartRecording}
          className={`flex-1 px-6 py-4 rounded-lg font-semibold transition-all duration-300 ${
            isRecording
              ? 'bg-red-500/20 border-2 border-red-500 text-red-300 shadow-lg'
              : 'bg-gradient-to-r from-secondary/20 to-primary/20 border-2 border-secondary/40 text-blue-300 hover:border-secondary hover:shadow-glow backdrop-blur-xs'
          }`}
        >
          {isRecording ? '⏹️ Stop Recording' : '🎤 Record Audio'}
        </motion.button>

        <input
          ref={fileInputRef}
          type="file"
          accept="audio/wav,audio/x-wav,audio/mpeg,audio/mp3,audio/webm,audio/ogg,audio/mp4,audio/x-m4a,.wav,.mp3,.webm,.ogg,.m4a"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {/* File Info */}
      {audioFile && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-lg backdrop-blur-xs"
        >
          <p className="text-primary text-sm">
            ✓ File selected: <span className="font-bold">{audioFile.name}</span>
          </p>
          <p className="text-secondary/50 text-xs mt-1">
            Size: {(audioFile.size / 1024).toFixed(2)} KB
          </p>
          <p className="text-secondary/60 text-xs mt-1">
            Format: {getFileExtension(audioFile.name)} ({audioFile.type || 'unknown mime'})
          </p>
        </motion.div>
      )}
    </motion.div>
  )
}
