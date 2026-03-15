'use client'

import { useState, useRef } from 'react'
import { toPng } from 'html-to-image'

export type Profile = {
  avatar: string
  username: string
  handle: string
}

const DEFAULT_PROFILES: [Profile, Profile] = [
  { avatar: '', username: '', handle: '' },
  { avatar: '', username: '', handle: '' },
]

// Placeholder vide pour images que tu remplis
const PLACEHOLDER_IMG = 'data:image/svg+xml,' + encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="112" height="112" viewBox="0 0 112 112"><rect fill="#27272a" width="112" height="112"/><text x="56" y="60" font-size="32" fill="#71717a" text-anchor="middle" font-family="sans-serif">?</text></svg>'
)

export default function VoteToFame({
  title = 'SAYURI VOTE',
  subtitle = 'Vote for your favorite',
  profiles: initialProfiles = DEFAULT_PROFILES,
  editable = true,
}: {
  title?: string
  subtitle?: string
  profiles?: [Profile, Profile]
  editable?: boolean
}) {
  const [profiles, setProfiles] = useState<[Profile, Profile]>(initialProfiles)
  const [voted, setVoted] = useState<0 | 1 | null>(null)

  const updateProfile = (idx: 0 | 1, field: keyof Profile, value: string) => {
    if (!editable) return
    setProfiles((p) => {
      const next = [...p] as [Profile, Profile]
      next[idx] = { ...next[idx], [field]: value }
      return next
    })
  }

  const exportRef = useRef<HTMLDivElement>(null)
  const [downloading, setDownloading] = useState(false)

  const handleDownload = async () => {
    if (!exportRef.current) return
    setDownloading(true)
    try {
      const dataUrl = await toPng(exportRef.current, {
        backgroundColor: '#0a0a0b',
        cacheBust: true,
      })
      const a = document.createElement('a')
      a.href = dataUrl
      a.download = `sayuri-vote-${Date.now()}.png`
      a.click()
    } catch (err) {
      console.error(err)
    } finally {
      setDownloading(false)
    }
  }

  // Bloc propre pour l'export (caché, sans champs de saisie)
  const ExportPreview = () => (
    <div ref={exportRef} className="absolute -left-[9999px] top-0 w-[600px] flex flex-col items-center p-8 bg-[#0a0a0b] rounded-2xl" aria-hidden>
      <h1 className="font-display text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-rose-500 to-pink-400 tracking-wider mb-4">SAYURI VOTE</h1>
      <p className="text-zinc-500 text-sm mb-8">{subtitle}</p>
      <div className="flex items-center gap-8">
        <div className="flex flex-col items-center gap-2">
          <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-pink-500/50 bg-zinc-800">
            <img src={profiles[0].avatar || PLACEHOLDER_IMG} alt="" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = PLACEHOLDER_IMG }} />
          </div>
          <p className="font-semibold text-white">{profiles[0].username || 'Profil 1'}</p>
          <p className="text-zinc-500 text-sm">{profiles[0].handle || ''}</p>
        </div>
        <div className="flex flex-col items-center">
          <p className="text-pink-500/80 font-black text-2xl">VS</p>
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-500/20 to-rose-600/20 border-2 border-pink-500/40 flex items-center justify-center mt-2">
            <svg className="w-8 h-8 text-pink-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
          </div>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-pink-500/50 bg-zinc-800">
            <img src={profiles[1].avatar || PLACEHOLDER_IMG} alt="" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = PLACEHOLDER_IMG }} />
          </div>
          <p className="font-semibold text-white">{profiles[1].username || 'Profil 2'}</p>
          <p className="text-zinc-500 text-sm">{profiles[1].handle || ''}</p>
        </div>
      </div>
      <footer className="mt-8 pt-6 border-t border-white/5">
        <p className="font-display text-sm font-bold text-zinc-600">Sayuri • Vote to Fame</p>
      </footer>
    </div>
  )

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#0a0a0b] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(236,72,153,0.2),transparent)]">
      <ExportPreview />
      <div className="w-full max-w-2xl text-center">
        {/* Header */}
        <div className="mb-12">
          <h1 className="font-display text-3xl sm:text-4xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-rose-500 to-pink-400">
            {title}
          </h1>
          <p className="mt-2 text-zinc-500 text-sm">{subtitle}</p>
        </div>

        {/* Profiles + Central Vote Icon */}
        <div className="flex items-center justify-center gap-6 sm:gap-12 mb-12">
          {/* Profile 1 */}
          <div className="flex-1 flex flex-col items-center gap-3 max-w-[180px]">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-4 border-pink-500/50 bg-zinc-800 ring-2 ring-pink-500/30 shrink-0">
              <img
                src={profiles[0].avatar || PLACEHOLDER_IMG}
                alt={profiles[0].username || 'Profil 1'}
                className="w-full h-full object-cover"
                onError={(e) => { e.currentTarget.src = PLACEHOLDER_IMG }}
              />
            </div>
            {editable && (
              <input
                type="text"
                placeholder="URL image (ex: /images/mon-image.png)"
                value={profiles[0].avatar}
                onChange={(e) => updateProfile(0, 'avatar', e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg bg-zinc-900/80 border border-zinc-700/50 text-white text-center text-xs placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-pink-500/50"
              />
            )}
            {editable ? (
              <>
                <input
                  type="text"
                  placeholder="Username"
                  value={profiles[0].username}
                  onChange={(e) => updateProfile(0, 'username', e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-zinc-900/80 border border-zinc-700/50 text-white text-center text-sm font-semibold placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-pink-500/50"
                />
                <input
                  type="text"
                  placeholder="Handle"
                  value={profiles[0].handle}
                  onChange={(e) => updateProfile(0, 'handle', e.target.value)}
                  className="w-full px-3 py-1 rounded-lg bg-zinc-900/60 border border-zinc-800/50 text-zinc-400 text-center text-xs placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-pink-500/50"
                />
              </>
            ) : (
              <>
                <p className="font-semibold text-white text-center">{profiles[0].username}</p>
                <p className="text-zinc-500 text-sm text-center">{profiles[0].handle}</p>
              </>
            )}
            <button
              onClick={() => setVoted(voted === 0 ? null : 0)}
              className={`mt-1 flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition ${
                voted === 0
                  ? 'bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-lg shadow-pink-500/30'
                  : 'bg-zinc-800/80 text-pink-400 hover:bg-pink-500/20 border border-pink-500/30'
              }`}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              {voted === 0 ? 'Voté ✓' : 'Voter'}
            </button>
          </div>

          {/* Central VS + Vote Star */}
          <div className="flex-shrink-0 flex flex-col items-center gap-2">
            <p className="text-pink-500/80 font-black text-xl sm:text-2xl tracking-widest">VS</p>
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-pink-500/20 to-rose-600/20 border-2 border-pink-500/40 flex items-center justify-center">
              <svg className="w-8 h-8 sm:w-10 sm:h-10 text-pink-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </div>
          </div>

          {/* Profile 2 */}
          <div className="flex-1 flex flex-col items-center gap-3 max-w-[180px]">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-4 border-pink-500/50 bg-zinc-800 ring-2 ring-pink-500/30 shrink-0">
              <img
                src={profiles[1].avatar || PLACEHOLDER_IMG}
                alt={profiles[1].username || 'Profil 2'}
                className="w-full h-full object-cover"
                onError={(e) => { e.currentTarget.src = PLACEHOLDER_IMG }}
              />
            </div>
            {editable && (
              <input
                type="text"
                placeholder="URL image (ex: /images/mon-image.png)"
                value={profiles[1].avatar}
                onChange={(e) => updateProfile(1, 'avatar', e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg bg-zinc-900/80 border border-zinc-700/50 text-white text-center text-xs placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-pink-500/50"
              />
            )}
            {editable ? (
              <>
                <input
                  type="text"
                  placeholder="Username"
                  value={profiles[1].username}
                  onChange={(e) => updateProfile(1, 'username', e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-zinc-900/80 border border-zinc-700/50 text-white text-center text-sm font-semibold placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-pink-500/50"
                />
                <input
                  type="text"
                  placeholder="Handle"
                  value={profiles[1].handle}
                  onChange={(e) => updateProfile(1, 'handle', e.target.value)}
                  className="w-full px-3 py-1 rounded-lg bg-zinc-900/60 border border-zinc-800/50 text-zinc-400 text-center text-xs placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-pink-500/50"
                />
              </>
            ) : (
              <>
                <p className="font-semibold text-white text-center">{profiles[1].username}</p>
                <p className="text-zinc-500 text-sm text-center">{profiles[1].handle}</p>
              </>
            )}
            <button
              onClick={() => setVoted(voted === 1 ? null : 1)}
              className={`mt-1 flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition ${
                voted === 1
                  ? 'bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-lg shadow-pink-500/30'
                  : 'bg-zinc-800/80 text-pink-400 hover:bg-pink-500/20 border border-pink-500/30'
              }`}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              {voted === 1 ? 'Voté ✓' : 'Voter'}
            </button>
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-white/5 pt-8 mt-8">
          <p className="font-display text-sm font-bold text-zinc-600">Sayuri • Vote to Fame</p>
          <p className="mt-1 text-zinc-600 text-xs">© {new Date().getFullYear()} Sayuri</p>
        </footer>

        {/* Bouton Télécharger */}
        <button
          onClick={handleDownload}
          disabled={downloading}
          className="no-export mt-8 px-6 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 text-white font-semibold hover:from-pink-600 hover:to-rose-700 transition disabled:opacity-60"
        >
          {downloading ? 'Génération...' : '⬇ Télécharger l\'image'}
        </button>
      </div>
    </main>
  )
}
