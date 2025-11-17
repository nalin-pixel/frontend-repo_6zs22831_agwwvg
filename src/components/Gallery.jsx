import React, { useEffect, useMemo, useState } from 'react'
import { Copy, Edit3, UploadCloud } from 'lucide-react'

const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function useLongPress(callback = () => {}, ms = 600) {
  const [startLongPress, setStartLongPress] = useState(false)

  useEffect(() => {
    let timerId
    if (startLongPress) {
      timerId = setTimeout(callback, ms)
    } else {
      clearTimeout(timerId)
    }
    return () => {
      clearTimeout(timerId)
    }
  }, [callback, ms, startLongPress])

  const start = () => setStartLongPress(true)
  const stop = () => setStartLongPress(false)

  return {
    onMouseDown: start,
    onMouseUp: stop,
    onMouseLeave: stop,
    onTouchStart: start,
    onTouchEnd: stop,
  }
}

function PromptAdFlow({ prompt }) {
  const [adShown, setAdShown] = useState(false)
  const [copied, setCopied] = useState(false)

  const showFakeAd = async () => {
    // Placeholder for AdSense interstitial trigger. In web preview we simulate.
    setAdShown(true)
    await new Promise((r) => setTimeout(r, 2000)) // simulate 2s ad
  }

  const handleCopy = async ()n => {
    await showFakeAd()
    await navigator.clipboard.writeText(prompt)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className="w-full inline-flex items-center justify-center gap-2 bg-gray-900 hover:bg-black text-white text-sm px-3 py-2 rounded-md transition"
    >
      <Copy size={16} /> {copied ? 'Copied!' : adShown ? 'Copy Now' : 'Copy Prompt'}
    </button>
  )
}

export default function Gallery({ adminMode }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchAssets = async () => {
    try {
      setLoading(true)
      setError('')
      const res = await fetch(`${API}/api/assets`)
      if (!res.ok) throw new Error('Failed to load assets')
      const data = await res.json()
      if (data.length === 0) {
        // seed if empty
        await fetch(`${API}/api/assets/seed`, { method: 'POST' })
        const seeded = await fetch(`${API}/api/assets`).then(r => r.json())
        setItems(seeded)
      } else {
        setItems(data)
      }
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchAssets() }, [])

  const updateAsset = async (id, patch) => {
    const res = await fetch(`${API}/api/assets/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patch),
    })
    if (res.ok) {
      const updated = await res.json()
      setItems(prev => prev.map(i => i.id === id ? updated : i))
    }
  }

  const onChangeImage = async (id) => {
    const url = prompt('Enter new image URL')
    if (url) await updateAsset(id, { image_url: url })
  }
  const onChangePrompt = async (id, current) => {
    const text = prompt('Edit prompt text', current)
    if (text !== null) await updateAsset(id, { prompt: text })
  }

  if (loading) return <div className="py-20 text-center text-gray-600">Loading...</div>
  if (error) return <div className="py-20 text-center text-red-600">{error}</div>

  return (
    <div className="px-6 py-10 max-w-6xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {items.map(item => (
          <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="relative group">
              <img src={item.image_url} alt={item.title} className="w-full h-52 object-cover" {...(adminMode ? useLongPress(() => onChangeImage(item.id)) : {})} />
              {adminMode && (
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition flex items-center justify-center">
                  <div className="hidden group-hover:flex items-center gap-2 text-white text-sm bg-black/50 px-3 py-1 rounded-full">
                    <UploadCloud size={16} /> Long press to change image
                  </div>
                </div>
              )}
            </div>
            <div className="p-4 space-y-3">
              <h3 className="font-semibold text-gray-900 line-clamp-1">{item.title}</h3>
              <div className="text-xs text-gray-500 line-clamp-2">{item.prompt}</div>
              <div className="flex gap-3">
                <PromptAdFlow prompt={item.prompt} />
                {adminMode && (
                  <button
                    className="inline-flex items-center justify-center gap-2 px-3 py-2 text-sm rounded-md border border-gray-200 hover:bg-gray-50"
                    {...useLongPress(() => onChangePrompt(item.id, item.prompt))}
                  >
                    <Edit3 size={16} /> Long press
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
