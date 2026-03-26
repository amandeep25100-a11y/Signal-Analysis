import React, { useState } from 'react'
import { motion } from 'framer-motion'
import LoadingIndicator from './LoadingIndicator'
import { analyzeImage } from '../utils/api'

const cardVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
}

const imageCards = [
  { key: 'original_image', label: 'Original Image' },
  { key: 'grayscale_image', label: 'Grayscale Image' },
  { key: 'heatmap', label: 'Intensity Heatmap (Matrix View)' },
  { key: 'fft_spectrum', label: '2D FFT Magnitude Spectrum' },
  { key: 'low_pass_image', label: 'Low-pass Filter Output' },
  { key: 'high_pass_image', label: 'High-pass Filter Output' },
  { key: 'edge_detected_image', label: 'Edge Detection Output' },
  { key: 'histogram', label: 'Pixel Intensity Histogram' },
]

export default function ImageAnalyzer() {
  const [imageFile, setImageFile] = useState(null)
  const [filterStrength, setFilterStrength] = useState(0.15)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [results, setResults] = useState(null)

  const handleFileUpload = (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    const validType = ['image/jpeg', 'image/jpg', 'image/png'].includes((file.type || '').toLowerCase())
    const validExt = /\.(jpg|jpeg|png)$/i.test(file.name || '')

    if (!validType && !validExt) {
      setError('Please upload a valid JPG or PNG image')
      setImageFile(null)
      setResults(null)
      return
    }

    setImageFile(file)
    setResults(null)
    setError(null)
  }

  const handleAnalyze = async () => {
    if (!imageFile) {
      setError('Please upload an image first')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('image', imageFile)
      formData.append('filter_strength', String(filterStrength))

      const data = await analyzeImage(formData)
      setResults(data)
    } catch (err) {
      setError(err.message || 'Failed to analyze image')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-8 border-b border-primary/20"
      >
        <h2 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600" style={{ fontFamily: 'Aptos, system-ui, sans-serif' }}>
          IMAGE UPLOAD SECTION
        </h2>

        <div className="flex flex-col md:flex-row gap-6">
          <label className="flex-1 px-6 py-4 bg-gradient-to-r from-primary/20 to-secondary/20 border-2 border-primary/40 rounded-lg font-semibold text-blue-300 hover:border-primary hover:shadow-glow backdrop-blur-xs transition-all duration-300 cursor-pointer text-center">
            🖼️ Upload Image
            <input
              type="file"
              accept="image/jpeg,image/jpg,image/png,.jpg,.jpeg,.png"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>

          <motion.button
            whileHover={{ scale: imageFile && !isLoading ? 1.04 : 1 }}
            whileTap={{ scale: imageFile && !isLoading ? 0.98 : 1 }}
            onClick={handleAnalyze}
            disabled={!imageFile || isLoading}
            className={`px-8 py-3 rounded-lg font-bold text-lg transition-all duration-300 ${
              !imageFile || isLoading
                ? 'bg-gray-600/30 border-2 border-gray-600/50 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-primary to-secondary text-white border-2 border-primary hover:shadow-glow-strong'
            }`}
          >
            ▶ RUN ANALYSIS
          </motion.button>
        </div>

        {imageFile && (
          <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-lg backdrop-blur-xs">
            <p className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-blue-300 text-sm" style={{ fontFamily: 'Aptos, system-ui, sans-serif' }}>
              ✓ Image selected: <span className="font-bold">{imageFile.name}</span>
            </p>
            <p className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300/70 to-blue-400/70 text-xs mt-1" style={{ fontFamily: 'Aptos, system-ui, sans-serif' }}>
              Size: {(imageFile.size / 1024).toFixed(2)} KB
            </p>
            <p className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300/70 to-blue-400/70 text-xs mt-1" style={{ fontFamily: 'Aptos, system-ui, sans-serif' }}>
              Type: {imageFile.type || 'unknown'}
            </p>
          </div>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="px-8 pb-2"
      >
        <h2 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600" style={{ fontFamily: 'Aptos, system-ui, sans-serif' }}>
          CONTROLS SECTION
        </h2>

        <div className="max-w-xl">
          <label className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-blue-400 text-sm font-semibold mb-2" style={{ fontFamily: 'Aptos, system-ui, sans-serif' }}>
            Filter Strength: {filterStrength.toFixed(2)}
          </label>
          <input
            type="range"
            min="0.02"
            max="0.5"
            step="0.01"
            value={filterStrength}
            onChange={(e) => setFilterStrength(Number(e.target.value))}
            className="w-full accent-cyan-400"
          />
        </div>
      </motion.div>

      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mx-6 p-4 bg-red-900/30 border border-red-500/50 rounded-lg text-red-300"
        >
          {error}
        </motion.div>
      )}

      {isLoading && <LoadingIndicator />}

      {results && (
        <>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
            className="px-8 pb-4"
          >
            <h2 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600" style={{ fontFamily: 'Aptos, system-ui, sans-serif' }}>
              ANALYSIS VISUALIZATION SECTION
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {imageCards.map((item) => (
                <motion.div
                  key={item.key}
                  variants={cardVariants}
                  className="p-4 bg-white/3 border border-primary/20 rounded-lg backdrop-blur-xs shadow-glass"
                >
                  <h3 className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-blue-400 font-bold mb-3" style={{ fontFamily: 'Aptos, system-ui, sans-serif' }}>
                    {item.label}
                  </h3>
                  {results[item.key] ? (
                    <img
                      src={results[item.key]}
                      alt={item.label}
                      className="w-full h-64 object-contain rounded bg-black/20"
                    />
                  ) : (
                    <div className="w-full h-64 rounded bg-black/20 flex items-center justify-center text-blue-300/70 text-sm" style={{ fontFamily: 'Aptos, system-ui, sans-serif' }}>
                      No data
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="px-8 pb-8"
          >
            <h2 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600" style={{ fontFamily: 'Aptos, system-ui, sans-serif' }}>
              RESULTS SECTION
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg text-center">
                <p className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300/70 to-blue-400/70 text-xs" style={{ fontFamily: 'Aptos, system-ui, sans-serif' }}>Width</p>
                <p className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-blue-300 font-bold text-lg" style={{ fontFamily: 'Aptos, system-ui, sans-serif' }}>{results.image_width || 'N/A'}</p>
              </div>
              <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg text-center">
                <p className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300/70 to-blue-400/70 text-xs" style={{ fontFamily: 'Aptos, system-ui, sans-serif' }}>Height</p>
                <p className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-blue-300 font-bold text-lg" style={{ fontFamily: 'Aptos, system-ui, sans-serif' }}>{results.image_height || 'N/A'}</p>
              </div>
              <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg text-center">
                <p className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300/70 to-blue-400/70 text-xs" style={{ fontFamily: 'Aptos, system-ui, sans-serif' }}>Filter Strength</p>
                <p className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-blue-300 font-bold text-lg" style={{ fontFamily: 'Aptos, system-ui, sans-serif' }}>{(results.filter_strength ?? filterStrength).toFixed(2)}</p>
              </div>
              <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg text-center">
                <p className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300/70 to-blue-400/70 text-xs" style={{ fontFamily: 'Aptos, system-ui, sans-serif' }}>Mode</p>
                <p className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-blue-300 font-bold text-lg" style={{ fontFamily: 'Aptos, system-ui, sans-serif' }}>2D Signal</p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </div>
  )
}
