import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts'
import LoadingIndicator from './LoadingIndicator'

export default function AudioEnhancementSection({
  audioFile,
  strength,
  setStrength,
  onCleanAudio,
  isCleaning,
  cleanedData,
  viewMode,
  setViewMode,
}) {
  const [originalAudioUrl, setOriginalAudioUrl] = useState(null)

  useEffect(() => {
    if (!audioFile) {
      setOriginalAudioUrl(null)
      return
    }

    const url = URL.createObjectURL(audioFile)
    setOriginalAudioUrl(url)

    return () => {
      URL.revokeObjectURL(url)
    }
  }, [audioFile])

  const currentWaveform = viewMode === 'original' ? cleanedData?.waveform_before : cleanedData?.waveform_after
  const currentSpectrogram = viewMode === 'original' ? cleanedData?.spectrogram_before : cleanedData?.spectrogram_after

  return (
    <div className="border-t border-primary/20">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-8 border-b border-primary/20"
      >
        <h2 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600" style={{ fontFamily: 'Aptos, system-ui, sans-serif' }}>
          AUDIO NOISE REMOVAL & ENHANCEMENT
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-end">
          <div className="lg:col-span-2">
            <label className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-blue-400 text-sm font-semibold mb-2" style={{ fontFamily: 'Aptos, system-ui, sans-serif' }}>
              Noise Reduction Strength: {strength.toFixed(2)}
            </label>
            <input
              type="range"
              min="0.10"
              max="1.00"
              step="0.05"
              value={strength}
              onChange={(e) => setStrength(Number(e.target.value))}
              className="w-full accent-cyan-400"
              disabled={isCleaning}
            />
          </div>

          <motion.button
            whileHover={{ scale: !audioFile || isCleaning ? 1 : 1.03 }}
            whileTap={{ scale: !audioFile || isCleaning ? 1 : 0.97 }}
            onClick={onCleanAudio}
            disabled={!audioFile || isCleaning}
            className={`px-6 py-3 rounded-lg font-bold transition-all duration-300 ${
              !audioFile || isCleaning
                ? 'bg-gray-600/30 border-2 border-gray-600/50 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-primary to-secondary text-white border-2 border-primary hover:shadow-glow-strong'
            }`}
          >
            🧼 Clean Audio
          </motion.button>
        </div>
      </motion.div>

      {isCleaning && <LoadingIndicator title="Cleaning Audio..." subtitle="Applying spectral gating and enhancement" />}

      {cleanedData && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-8 border-b border-primary/20"
          >
            <h2 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600" style={{ fontFamily: 'Aptos, system-ui, sans-serif' }}>
              AUDIO PLAYBACK
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 bg-white/3 border border-primary/20 rounded-lg backdrop-blur-xs">
                <h3 className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-blue-400 font-semibold mb-3" style={{ fontFamily: 'Aptos, system-ui, sans-serif' }}>
                  Original Audio
                </h3>
                <audio controls src={originalAudioUrl || undefined} className="w-full" />
              </div>
              <div className="p-4 bg-white/3 border border-primary/20 rounded-lg backdrop-blur-xs">
                <h3 className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-blue-400 font-semibold mb-3" style={{ fontFamily: 'Aptos, system-ui, sans-serif' }}>
                  Cleaned Audio
                </h3>
                <audio controls src={cleanedData.cleaned_audio_file} className="w-full" />
                <a
                  href={cleanedData.cleaned_audio_file}
                  download="cleaned_audio.wav"
                  className="inline-block mt-3 px-4 py-2 rounded-lg border border-primary/30 text-blue-200 hover:bg-primary/10 transition-colors"
                  style={{ fontFamily: 'Aptos, system-ui, sans-serif' }}
                >
                  ⬇ Download Cleaned Audio
                </a>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-8 border-b border-primary/20"
          >
            <h2 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600" style={{ fontFamily: 'Aptos, system-ui, sans-serif' }}>
              VISUALIZATION
            </h2>

            <div className="mb-6 w-full md:w-[280px] p-1 rounded-xl bg-white/5 border border-primary/20 backdrop-blur-sm shadow-glass">
              <div className="relative grid grid-cols-2 gap-1">
                <motion.div
                  layout
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  className={`absolute top-0 bottom-0 w-[calc(50%-2px)] rounded-lg bg-gradient-to-r from-primary/30 to-secondary/30 border border-primary/30 ${
                    viewMode === 'original' ? 'left-0' : 'left-1/2'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setViewMode('original')}
                  className={`relative z-10 px-4 py-2 rounded-lg font-semibold transition-colors ${
                    viewMode === 'original' ? 'text-cyan-200' : 'text-secondary/70'
                  }`}
                >
                  Original
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('cleaned')}
                  className={`relative z-10 px-4 py-2 rounded-lg font-semibold transition-colors ${
                    viewMode === 'cleaned' ? 'text-cyan-200' : 'text-secondary/70'
                  }`}
                >
                  Cleaned
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="p-4 bg-white/3 border border-primary/20 rounded-lg backdrop-blur-xs">
                <h3 className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-blue-400 font-semibold mb-3" style={{ fontFamily: 'Aptos, system-ui, sans-serif' }}>
                  {viewMode === 'original' ? 'Before Waveform' : 'After Waveform'}
                </h3>
                <ResponsiveContainer width="100%" height={260}>
                  <LineChart data={currentWaveform || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#14B8A6" opacity={0.2} />
                    <XAxis stroke="#0EA5E9" dataKey="time" />
                    <YAxis stroke="#0EA5E9" />
                    <Tooltip contentStyle={{ backgroundColor: 'rgba(5, 20, 40, 0.8)', border: '1px solid #14B8A6' }} />
                    <Line type="monotone" dataKey="value" stroke="#14B8A6" dot={false} isAnimationActive={false} strokeWidth={1} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="p-4 bg-white/3 border border-primary/20 rounded-lg backdrop-blur-xs">
                <h3 className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-blue-400 font-semibold mb-3" style={{ fontFamily: 'Aptos, system-ui, sans-serif' }}>
                  {viewMode === 'original' ? 'Before Spectrogram' : 'After Spectrogram'}
                </h3>
                {currentSpectrogram ? (
                  <img src={currentSpectrogram} alt="Spectrogram" className="w-full h-[260px] object-contain rounded bg-black/20" />
                ) : (
                  <div className="w-full h-[260px] rounded bg-black/20 flex items-center justify-center text-blue-300/70 text-sm">No data</div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
              <div className="p-4 bg-white/3 border border-primary/20 rounded-lg backdrop-blur-xs">
                <h3 className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-blue-400 font-semibold mb-3" style={{ fontFamily: 'Aptos, system-ui, sans-serif' }}>Before Waveform</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={cleanedData.waveform_before || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#14B8A6" opacity={0.2} />
                    <XAxis stroke="#0EA5E9" dataKey="time" />
                    <YAxis stroke="#0EA5E9" />
                    <Tooltip contentStyle={{ backgroundColor: 'rgba(5, 20, 40, 0.8)', border: '1px solid #14B8A6' }} />
                    <Line type="monotone" dataKey="value" stroke="#0EA5E9" dot={false} isAnimationActive={false} strokeWidth={1} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="p-4 bg-white/3 border border-primary/20 rounded-lg backdrop-blur-xs">
                <h3 className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-blue-400 font-semibold mb-3" style={{ fontFamily: 'Aptos, system-ui, sans-serif' }}>After Waveform</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={cleanedData.waveform_after || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#14B8A6" opacity={0.2} />
                    <XAxis stroke="#0EA5E9" dataKey="time" />
                    <YAxis stroke="#0EA5E9" />
                    <Tooltip contentStyle={{ backgroundColor: 'rgba(5, 20, 40, 0.8)', border: '1px solid #14B8A6' }} />
                    <Line type="monotone" dataKey="value" stroke="#14B8A6" dot={false} isAnimationActive={false} strokeWidth={1} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
              <div className="p-4 bg-white/3 border border-primary/20 rounded-lg backdrop-blur-xs">
                <h3 className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-blue-400 font-semibold mb-3" style={{ fontFamily: 'Aptos, system-ui, sans-serif' }}>Before Spectrogram</h3>
                <img src={cleanedData.spectrogram_before} alt="Before Spectrogram" className="w-full h-[220px] object-contain rounded bg-black/20" />
              </div>
              <div className="p-4 bg-white/3 border border-primary/20 rounded-lg backdrop-blur-xs">
                <h3 className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-blue-400 font-semibold mb-3" style={{ fontFamily: 'Aptos, system-ui, sans-serif' }}>After Spectrogram</h3>
                <img src={cleanedData.spectrogram_after} alt="After Spectrogram" className="w-full h-[220px] object-contain rounded bg-black/20" />
              </div>
            </div>
          </motion.div>
        </>
      )}
    </div>
  )
}
