import React from 'react'
import Spline from '@splinetool/react-spline'

export default function Hero() {
  return (
    <section className="relative w-full h-[60vh] md:h-[70vh] lg:h-[75vh] overflow-hidden">
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/WCoEDSwacOpKBjaC/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-white/40 to-white pointer-events-none" />
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
        <h1 className="text-3xl md:text-5xl font-bold text-gray-900 tracking-tight">
          Visual Prompt Dashboard
        </h1>
        <p className="mt-3 md:mt-4 max-w-2xl text-gray-700 text-sm md:text-base">
          Browse a grid of creative images with their prompts. Copy prompts after an ad, and manage content with long‑press editing in admin mode.
        </p>
      </div>
    </section>
  )
}
