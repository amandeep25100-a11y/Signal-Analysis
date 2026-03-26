import React from 'react'
import { motion } from 'framer-motion'

export default function Header() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="text-center mb-8"
    >
      <h1 className="text-6xl md:text-7xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 animate-pulse" style={{fontFamily: 'Aptos, system-ui, sans-serif', letterSpacing: '-0.02em'}}>
        AUDIO SIGNAL ANALYZER
      </h1>
      <p className="text-lg text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-blue-400" style={{fontFamily: 'Aptos, system-ui, sans-serif'}}>Advanced Signal Processing & AI Classification</p>
      <div className="h-1 w-32 mx-auto mt-4 bg-gradient-to-r from-primary to-secondary rounded-full shadow-glow"></div>
    </motion.div>
  )
}
