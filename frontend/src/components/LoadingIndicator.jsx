import React from 'react'
import { motion } from 'framer-motion'

export default function LoadingIndicator({
  title = 'Analyzing Audio Signal...',
  subtitle = 'Processing signal in time and frequency domains',
}) {
  const containerVariants = {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const dotVariants = {
    animate: {
      y: [0, -20, 0],
      transition: {
        duration: 0.6,
        repeat: Infinity,
      },
    },
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-12 flex flex-col items-center justify-center"
    >
      <motion.div
        variants={containerVariants}
        animate="animate"
        className="flex gap-3 mb-6"
      >
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            variants={dotVariants}
            className="w-3 h-3 bg-primary rounded-full shadow-glow"
          />
        ))}
      </motion.div>
      <p className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-blue-400 font-bold text-lg animate-pulse" style={{fontFamily: 'Aptos, system-ui, sans-serif'}}>
        {title}
      </p>
      <p className="text-secondary/50 text-sm mt-2">
        {subtitle}
      </p>
    </motion.div>
  )
}
