import React, { useState } from 'react'
import Hero from './components/Hero'
import Gallery from './components/Gallery'

function App() {
  const [adminMode, setAdminMode] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Hero />

      <div className="max-w-6xl mx-auto px-6 pt-6 pb-2 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">User Dashboard</h2>
          <p className="text-sm text-gray-600">Tap copy to watch an ad, then copy the prompt.</p>
        </div>
        <label className="inline-flex items-center gap-2 text-sm text-gray-700">
          <input type="checkbox" className="h-4 w-4" checked={adminMode} onChange={(e) => setAdminMode(e.target.checked)} />
          Admin mode
        </label>
      </div>

      <Gallery adminMode={adminMode} />

      <footer className="px-6 py-10 text-center text-xs text-gray-500">Built with love • Prompts & images for inspiration</footer>
    </div>
  )
}

export default App
