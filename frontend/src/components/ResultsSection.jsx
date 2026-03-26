import React from 'react'
import { motion } from 'framer-motion'

export default function ResultsSection({ results, audioType }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5 },
    },
  }

  const getResultsContent = () => {
    if (audioType === 'human_voice') {
      return (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {Object.entries(results.emotion_scores || {}).map(([emotion, score]) => (
              <motion.div
                key={emotion}
                variants={itemVariants}
                className="p-4 bg-primary/10 border border-primary/30 rounded-lg text-center backdrop-blur-xs"
              >
                <p className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-blue-400 text-sm font-semibold capitalize" style={{fontFamily: 'Aptos, system-ui, sans-serif'}}>{emotion}</p>
                <p className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-blue-300 text-2xl font-bold mt-2" style={{fontFamily: 'Aptos, system-ui, sans-serif'}}>
                  {(score * 100).toFixed(1)}%
                </p>
              </motion.div>
            ))}
          </div>
          <motion.div
            variants={itemVariants}
            className="p-6 bg-secondary/10 border border-secondary/30 rounded-lg backdrop-blur-xs shadow-glass"
          >
            <p className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-blue-400 font-bold text-lg" style={{fontFamily: 'Aptos, system-ui, sans-serif'}}>
              Detected Emotion: <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-blue-300" style={{fontFamily: 'Aptos, system-ui, sans-serif'}}>{results.prediction}</span>
            </p>
            <p className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300/70 to-blue-400/70 text-sm mt-2" style={{fontFamily: 'Aptos, system-ui, sans-serif'}}>
              Confidence: {((results.prediction_confidence || 0) * 100).toFixed(2)}%
            </p>
          </motion.div>
        </>
      )
    }

    if (audioType === 'music') {
      return (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {Object.entries(results.genre_scores || {}).map(([genre, score]) => (
              <motion.div
                key={genre}
                variants={itemVariants}
                className="p-4 bg-primary/5 border border-primary/20 rounded-lg text-center backdrop-blur-xs"
              >
                <p className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-blue-400 text-sm font-semibold" style={{fontFamily: 'Aptos, system-ui, sans-serif'}}>{genre}</p>
                <p className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-blue-300 text-2xl font-bold mt-2" style={{fontFamily: 'Aptos, system-ui, sans-serif'}}>
                  {(score * 100).toFixed(1)}%
                </p>
              </motion.div>
            ))}
          </div>
          <motion.div
            variants={itemVariants}
            className="p-6 bg-secondary/5 border border-secondary/20 rounded-lg backdrop-blur-xs shadow-glass"
          >
            <p className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-blue-400 font-bold text-lg" style={{fontFamily: 'Aptos, system-ui, sans-serif'}}>
              Detected Genre: <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-blue-300" style={{fontFamily: 'Aptos, system-ui, sans-serif'}}>{results.prediction}</span>
            </p>
            <p className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300/70 to-blue-400/70 text-sm mt-2" style={{fontFamily: 'Aptos, system-ui, sans-serif'}}>
              Confidence: {((results.prediction_confidence || 0) * 100).toFixed(2)}%
            </p>
            <p className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300/70 to-blue-400/70 text-sm mt-2" style={{fontFamily: 'Aptos, system-ui, sans-serif'}}>
              Estimated Tempo: {results.tempo?.toFixed(2) || 'N/A'} BPM
            </p>
          </motion.div>
        </>
      )
    }

    return (
      <motion.div
        variants={itemVariants}
        className="p-6 bg-primary/5 border border-primary/20 rounded-lg backdrop-blur-xs shadow-glass"
      >
        <p className="text-primary font-bold text-lg">Analysis Complete</p>
        <p className="text-secondary/70 text-sm mt-2">
          Audio has been processed and analyzed. No ML prediction applied for miscellaneous audio.
        </p>
      </motion.div>
    )
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="p-8"
    >
      <h2 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600" style={{fontFamily: 'Aptos, system-ui, sans-serif'}}>CLASSIFICATION RESULTS</h2>
      {getResultsContent()}

      {/* Audio Features */}
      <motion.div variants={itemVariants} className="mt-8 p-6 bg-white/3 border border-secondary/20 rounded-lg backdrop-blur-xs shadow-glass">
        <h3 className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-blue-400 font-bold mb-4" style={{fontFamily: 'Aptos, system-ui, sans-serif'}}>Extracted Features</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300/70 to-blue-400/70" style={{fontFamily: 'Aptos, system-ui, sans-serif'}}>Duration</p>
            <p className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-blue-300 font-bold" style={{fontFamily: 'Aptos, system-ui, sans-serif'}}>{(results.duration || 0).toFixed(2)}s</p>
          </div>
          <div>
            <p className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300/70 to-blue-400/70" style={{fontFamily: 'Aptos, system-ui, sans-serif'}}>Sample Rate</p>
            <p className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-blue-300 font-bold" style={{fontFamily: 'Aptos, system-ui, sans-serif'}}>{results.sample_rate || 'N/A'} Hz</p>
          </div>
          <div>
            <p className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300/70 to-blue-400/70" style={{fontFamily: 'Aptos, system-ui, sans-serif'}}>RMS Energy</p>
            <p className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-blue-300 font-bold" style={{fontFamily: 'Aptos, system-ui, sans-serif'}}>{(results.rms_energy || 0).toFixed(4)}</p>
          </div>
          <div>
            <p className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300/70 to-blue-400/70" style={{fontFamily: 'Aptos, system-ui, sans-serif'}}>Spectral Centroid</p>
            <p className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-blue-300 font-bold" style={{fontFamily: 'Aptos, system-ui, sans-serif'}}>{(results.spectral_centroid || 0).toFixed(2)} Hz</p>
          </div>
          <div>
            <p className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300/70 to-blue-400/70" style={{fontFamily: 'Aptos, system-ui, sans-serif'}}>MFCC Mean</p>
            <p className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-blue-300 font-bold" style={{fontFamily: 'Aptos, system-ui, sans-serif'}}>{(results.mfcc_mean || 0).toFixed(4)}</p>
          </div>
          <div>
            <p className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300/70 to-blue-400/70" style={{fontFamily: 'Aptos, system-ui, sans-serif'}}>Zero Crossing Rate</p>
            <p className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-blue-300 font-bold" style={{fontFamily: 'Aptos, system-ui, sans-serif'}}>{(results.zcr || 0).toFixed(4)}</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
