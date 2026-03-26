import axios from 'axios'
import { debugLog, debugPanel, measurePerformance } from './debug'

const API_URL = '/api'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor - logs outgoing requests
api.interceptors.request.use(
  (config) => {
    debugLog.api(config.method.toUpperCase(), config.url)
    debugPanel.addLog('info', `📤 API Request: ${config.method.toUpperCase()} ${config.url}`, config)
    return config
  },
  (error) => {
    debugLog.error('API Request Error', error.message)
    debugPanel.addLog('error', '❌ API Request Failed', error.message)
    return Promise.reject(error)
  }
)

// Response interceptor - logs responses and errors
api.interceptors.response.use(
  (response) => {
    debugLog.success(`API Response: ${response.status}`, response.data)
    debugPanel.addLog('success', `✅ API Response: ${response.status}`, {
      endpoint: response.config.url,
      dataKeys: Object.keys(response.data || {})
    })
    return response
  },
  (error) => {
    const status = error.response?.status
    const message = error.response?.data?.detail || error.message
    
    debugLog.error(`API Error: ${status}`, message)
    debugPanel.addLog('error', `❌ API Error ${status}`, {
      url: error.config?.url,
      error: message
    })
    
    return Promise.reject(error)
  }
)

export const analyzeAudio = async (formData) => {
  try {
    debugLog.info('🚀 Starting audio analysis...')
    const perf = measurePerformance('Audio Analysis')
    
    debugPanel.addLog('info', '⏳ Sending audio to backend...', {
      files: Array.from(formData.entries())
        .filter(([key]) => key === 'audio')
        .map(([, file]) => `${file.name} (${(file.size / 1024).toFixed(2)}KB)`)
    })
    
    const response = await api.post('/analyze', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    
    const duration = perf.end()
    
    debugLog.success('✨ Analysis complete!', {
      duration: `${duration.toFixed(2)}ms`,
      resultKeys: Object.keys(response.data)
    })
    
    debugPanel.addLog('success', `✨ Analysis Successful (${duration.toFixed(0)}ms)`, {
      features: response.data.duration,
      prediction: response.data.prediction
    })
    
    return response.data
  } catch (error) {
    const errorMsg = error.response?.data?.detail || error.message
    
    debugLog.error('💥 Analysis Failed', errorMsg)
    debugPanel.addLog('error', '💥 Analysis Failed', {
      status: error.response?.status,
      error: errorMsg
    })
    
    throw new Error(errorMsg || 'Failed to analyze audio')
  }
}

export const analyzeImage = async (formData) => {
  try {
    debugLog.info('🖼️ Starting image analysis...')
    const perf = measurePerformance('Image Analysis')

    debugPanel.addLog('info', '⏳ Sending image to backend...', {
      files: Array.from(formData.entries())
        .filter(([key]) => key === 'image')
        .map(([, file]) => `${file.name} (${(file.size / 1024).toFixed(2)}KB)`)
    })

    const response = await api.post('/analyze-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    const duration = perf.end()

    debugLog.success('✨ Image analysis complete!', {
      duration: `${duration.toFixed(2)}ms`,
      resultKeys: Object.keys(response.data)
    })

    debugPanel.addLog('success', `✨ Image Analysis Successful (${duration.toFixed(0)}ms)`, {
      width: response.data.image_width,
      height: response.data.image_height
    })

    return response.data
  } catch (error) {
    const errorMsg = error.response?.data?.detail || error.message

    debugLog.error('💥 Image analysis failed', errorMsg)
    debugPanel.addLog('error', '💥 Image Analysis Failed', {
      status: error.response?.status,
      error: errorMsg
    })

    throw new Error(errorMsg || 'Failed to analyze image')
  }
}

export const cleanAudio = async (formData) => {
  try {
    debugLog.info('🧼 Starting audio cleaning...')
    const perf = measurePerformance('Audio Cleaning')

    debugPanel.addLog('info', '⏳ Sending audio for cleaning...', {
      files: Array.from(formData.entries())
        .filter(([key]) => key === 'audio')
        .map(([, file]) => `${file.name} (${(file.size / 1024).toFixed(2)}KB)`)
    })

    const response = await api.post('/clean-audio', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    const duration = perf.end()
    debugPanel.addLog('success', `✨ Audio Cleaning Successful (${duration.toFixed(0)}ms)`, {
      duration: response.data.duration,
      sample_rate: response.data.sample_rate,
    })

    return response.data
  } catch (error) {
    const errorMsg = error.response?.data?.detail || error.message
    debugLog.error('💥 Audio cleaning failed', errorMsg)
    debugPanel.addLog('error', '💥 Audio Cleaning Failed', {
      status: error.response?.status,
      error: errorMsg
    })
    throw new Error(errorMsg || 'Failed to clean audio')
  }
}

export default api
