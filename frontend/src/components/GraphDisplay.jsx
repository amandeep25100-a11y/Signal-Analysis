import React, { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts'

function buildFallbackSpectrogramValues(waveformData) {
  if (!waveformData || waveformData.length < 128) {
    return null
  }

  const samples = waveformData.map((point) => Number(point?.value || 0))
  const windowSize = 128
  const hopSize = 32
  const freqBins = 48
  const values = []

  for (let start = 0; start + windowSize <= samples.length; start += hopSize) {
    const frame = samples.slice(start, start + windowSize)
    const spectrum = []

    for (let k = 0; k < freqBins; k += 1) {
      let real = 0
      let imag = 0

      for (let n = 0; n < windowSize; n += 1) {
        const hann = 0.5 * (1 - Math.cos((2 * Math.PI * n) / (windowSize - 1)))
        const sample = frame[n] * hann
        const angle = (2 * Math.PI * k * n) / windowSize
        real += sample * Math.cos(angle)
        imag -= sample * Math.sin(angle)
      }

      spectrum.push(Math.sqrt(real * real + imag * imag))
    }

    values.push(spectrum)
  }

  if (!values.length) {
    return null
  }

  let maxValue = 0
  for (const row of values) {
    for (const v of row) {
      if (v > maxValue) {
        maxValue = v
      }
    }
  }

  if (maxValue <= 1e-12) {
    return values.map((row) => row.map(() => 0))
  }

  return values.map((row) => row.map((v) => v / maxValue))
}

function SpectrogramCanvas({ spectrogramData, waveformData }) {
  const canvasRef = useRef(null)
  const fallbackValues = buildFallbackSpectrogramValues(waveformData)
  const matrixValues =
    spectrogramData?.values && spectrogramData.values.length
      ? spectrogramData.values
      : fallbackValues

  useEffect(() => {
    const canvas = canvasRef.current
    const values = matrixValues
    if (!canvas || !values || !values.length || !values[0]?.length) {
      return
    }

    const height = values.length
    const width = values[0].length

    canvas.width = width
    canvas.height = height

    const ctx = canvas.getContext('2d')
    const imageData = ctx.createImageData(width, height)

    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < width; x += 1) {
        const intensity = Math.max(0, Math.min(1, Number(values[y][x] ?? 0)))
        const drawY = height - 1 - y
        const idx = (drawY * width + x) * 4

        imageData.data[idx] = Math.floor(15 + intensity * 230)
        imageData.data[idx + 1] = Math.floor(35 + intensity * 170)
        imageData.data[idx + 2] = Math.floor(140 + intensity * 90)
        imageData.data[idx + 3] = 255
      }
    }

    ctx.putImageData(imageData, 0, 0)
  }, [matrixValues])

  if (!matrixValues?.length) {
    return (
      <div className="bg-white/3 rounded h-80 flex items-center justify-center backdrop-blur-sm">
        <div className="text-center">
          <p className="text-primary text-sm mb-2">No spectrogram data available</p>
          <p className="text-secondary/50 text-xs">Try another audio sample</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white/3 rounded h-80 p-2 backdrop-blur-sm flex flex-col">
      <canvas
        ref={canvasRef}
        className="w-full h-full rounded"
        style={{ imageRendering: 'pixelated' }}
      />
      <div className="mt-2 flex justify-between text-[10px] text-secondary/50">
        <span>Low Energy</span>
        <span>High Energy</span>
      </div>
    </div>
  )
}

export default function GraphDisplay({ results }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="p-8 border-b border-primary/20"
    >
      <h2 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600" style={{fontFamily: 'Aptos, system-ui, sans-serif'}}>SIGNAL ANALYSIS GRAPHS</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Waveform */}
          <motion.div
            variants={itemVariants}
            className="p-6 bg-white/3 border border-primary/20 rounded-lg backdrop-blur-xs shadow-glass"
          >
            <h3 className="text-secondary font-bold mb-4">Cleaned Audio - Noise Reduced</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={results.cleaned_waveform_data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#14B8A6" opacity={0.2} />
                <XAxis stroke="#0EA5E9" />
                <YAxis stroke="#0EA5E9" />
                <Tooltip contentStyle={{ backgroundColor: 'rgba(5, 20, 40, 0.8)', border: '1px solid #14B8A6' }} />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#14B8A6"
                  dot={false}
                  isAnimationActive={false}
                  strokeWidth={1}
                />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* FFT Spectrum */}
          <motion.div
            variants={itemVariants}
            className="p-6 bg-white/3 border border-primary/20 rounded-lg backdrop-blur-xs shadow-glass"
          >
            <h3 className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-blue-400 font-bold mb-4" style={{fontFamily: 'Aptos, system-ui, sans-serif'}}>Frequency Domain - FFT Spectrum</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={results.fft_data || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#14B8A6" opacity={0.2} />
                <XAxis stroke="#0EA5E9" />
                <YAxis stroke="#0EA5E9" />
                <Tooltip contentStyle={{ backgroundColor: 'rgba(5, 20, 40, 0.8)', border: '1px solid #14B8A6' }} />
                <Bar dataKey="magnitude" fill="#0EA5E9" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Cleaned Audio Waveform */}
        {results.cleaned_waveform_data && (
          <motion.div
            variants={itemVariants}
            className="p-6 bg-white/5 border border-primary/30 rounded-lg backdrop-blur-xs shadow-glass"
          >
            <h3 className="text-secondary font-bold mb-4">Cleaned Audio - Noise Reduced</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={results.cleaned_waveform_data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#14B8A6" opacity={0.2} />
                <XAxis stroke="#0EA5E9" />
                <YAxis stroke="#0EA5E9" />
                <Tooltip contentStyle={{ backgroundColor: 'rgba(5, 20, 40, 0.8)', border: '1px solid #14B8A6' }} />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#14B8A6"
                  dot={false}
                  isAnimationActive={false}
                  strokeWidth={1}
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        )}

        {/* Spectrogram Info */}
        {results.spectrogram_data && (
          <motion.div
            variants={itemVariants}
            className="p-6 bg-white/3 border border-primary/20 rounded-lg backdrop-blur-xs shadow-glass"
          >
            <h3 className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-blue-400 font-bold mb-4" style={{fontFamily: 'Aptos, system-ui, sans-serif'}}>Spectrogram Visualization</h3>
            <SpectrogramCanvas
              spectrogramData={results.spectrogram_data}
              waveformData={results.cleaned_waveform_data || results.waveform_data}
            />
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
