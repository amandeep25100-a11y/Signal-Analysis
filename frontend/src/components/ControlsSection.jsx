import React from 'react'
import { motion } from 'framer-motion'

export default function ControlsSection({ audioType, onAudioTypeChange, onRunAnalysis, isDisabled }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="p-8 border-b border-primary/20"
    >
      <h2 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600" style={{fontFamily: 'Aptos, system-ui, sans-serif'}}>CONTROLS</h2>

      <div className="flex flex-col md:flex-row gap-6 items-end">
        {/* Audio Type Dropdown */}
        <div className="flex-1">
          <label className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-blue-400 text-sm font-semibold mb-2" style={{fontFamily: 'Aptos, system-ui, sans-serif'}}>Audio Type</label>
          <select
            value={audioType}
            onChange={(e) => onAudioTypeChange(e.target.value)}
            className="w-full px-4 py-3 bg-white/5 border-2 border-secondary/30 rounded-lg font-semibold hover:border-secondary backdrop-blur-sm transition-all focus:outline-none focus:border-primary focus:shadow-glow-strong"
            style={{color: '#0ea5e9', fontFamily: 'Aptos, system-ui, sans-serif', fontWeight: '600'}}
          >
            <option value="human_voice" style={{color: '#0ea5e9', backgroundColor: '#0f172a'}}>🎤 Human Voice</option>
            <option value="music" style={{color: '#0ea5e9', backgroundColor: '#0f172a'}}>🎵 Music</option>
            <option value="miscellaneous" style={{color: '#0ea5e9', backgroundColor: '#0f172a'}}>📊 Miscellaneous</option>
          </select>
        </div>

        {/* Run Analysis Button */}
        <motion.button
          whileHover={!isDisabled ? { scale: 1.05 } : {}}
          whileTap={!isDisabled ? { scale: 0.95 } : {}}
          onClick={onRunAnalysis}
          disabled={isDisabled}
          className={`px-8 py-3 rounded-lg font-bold text-lg transition-all duration-300 ${
            isDisabled
              ? 'bg-gray-600/30 border-2 border-gray-600/50 text-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-primary to-secondary text-blue-200 border-2 border-primary hover:shadow-glow-strong'
          }`}
        >
          ▶ ANALYZE
        </motion.button>
      </div>
    </motion.div>
  )
}
