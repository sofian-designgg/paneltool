'use client'

import { useState } from 'react'

const ACCESS_KEY = 'sayuribuy'

export default function Home() {
  const [key, setKey] = useState('')
  const [granted, setGranted] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (key.trim().toLowerCase() === ACCESS_KEY) {
      setGranted(true)
      setError('')
    } else {
      setError('Clé incorrecte')
    }
  }

  if (granted) {
    return <Shop />
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-slate-950 via-slate-900 to-rose-950/20">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl font-bold text-white mb-1">
            Sayuri Shop 🛒
          </h1>
          <p className="text-slate-400 text-sm">Accès réservé</p>
        </div>
        <form
          onSubmit={handleSubmit}
          className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-2xl p-8 shadow-xl"
        >
          <label htmlFor="key" className="block text-sm font-medium text-slate-300 mb-2">
            Clé d&apos;accès
          </label>
          <input
            id="key"
            type="password"
            value={key}
            onChange={(e) => {
              setKey(e.target.value)
              setError('')
            }}
            placeholder="Entrez la clé"
            className="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-slate-600/50 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500/50 transition"
            autoFocus
          />
          {error && (
            <p className="mt-2 text-sm text-rose-400">{error}</p>
          )}
          <button
            type="submit"
            className="mt-6 w-full py-3 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 text-white font-medium hover:from-rose-600 hover:to-pink-700 transition shadow-lg shadow-rose-500/20"
          >
            Accéder
          </button>
        </form>
      </div>
    </main>
  )
}

function Shop() {
  const products = [
    {
      id: 'chatgpt',
      name: 'ChatGPT+ Generator',
      price: '€35.00',
      image: '/images/chatgpt.png',
      tagline: 'Unlimited Daily Accounts',
      description: 'Boost your productivity in seconds — get up to 5 ChatGPT+ accounts every day with our private generator. Perfect for anyone who wants full access at a fraction of the price.',
      features: [
        'Up to 5 accounts daily — create accounts fast and easily',
        'Instant Delivery — access right after purchase',
        'Private Discord Role — exclusive member-only access',
        'Save over €110 monthly — huge value for the price',
        'Easy to use — no extra steps needed',
      ],
      highlights: [
        'Full access at the lowest cost',
        'Instant setup and delivery',
        'No limits — perfect for personal use or reselling',
        'Simple and secure',
      ],
    },
    {
      id: 'spotify',
      name: 'Spotify Lifetime Key',
      price: '€7.50',
      image: '/images/spotify.png',
      tagline: 'Activate on Your Own Account',
      description: 'Unlock unlimited music, no ads, and premium quality — forever. Activate full Spotify Premium on your personal account with a one-time key.',
      features: [
        'Spotify Premium Activation Key – Lifetime access',
        'Works on your own Spotify account',
        'No ads, unlimited skips, offline listening',
        'High-quality audio streaming',
        'Works worldwide on all devices',
        'Instant delivery + activation guide',
        'Support included',
      ],
      highlights: ['One key, lifetime Premium. Perfect for users who want Premium without monthly subscriptions.'],
    },
    {
      id: 'nba',
      name: 'NBA Lifetime Account',
      price: '€5.00',
      image: '/images/nba.png',
      tagline: 'Full Access (Streaming)',
      description: 'Premium, fully verified NBA streaming accounts with lifetime access — watch every game, highlight & exclusive content without limits. Perfect for basketball fans who want unlimited access to NBA games.',
      features: [
        'Full Access — email & password changeable',
        'Lifetime streaming access — no monthly subscription needed',
        'Watch live games, highlights, replays & exclusive NBA content',
        'Some accounts include bonus features or premium extras',
        '24-hour replacement warranty',
        'Instant automatic delivery after purchase',
      ],
      highlights: ['Platform: Official NBA streaming service (NBA League Pass)', 'Enjoy unlimited NBA access — once purchased, it\'s yours forever!'],
    },
  ]

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-rose-950/10">
      <header className="border-b border-slate-800/50 bg-slate-900/30 backdrop-blur sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="font-display text-xl font-bold text-white">
            Sayuri Shop 🛒
          </h1>
          <p className="text-slate-400 text-sm">Site factice / démo</p>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-2">
            Nos offres
          </h2>
          <p className="text-slate-400">Sélectionnez un produit pour en savoir plus</p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <article
              key={product.id}
              className="group bg-slate-800/40 backdrop-blur rounded-2xl border border-slate-700/50 overflow-hidden hover:border-rose-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-rose-500/5"
            >
              <div className="relative aspect-square bg-slate-900/80 flex items-center justify-center p-8 rounded-t-2xl overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                    const fallback = e.currentTarget.nextElementSibling as HTMLElement
                    if (fallback) fallback.style.display = 'flex'
                  }}
                />
                <div className="absolute inset-0 hidden flex items-center justify-center text-6xl opacity-80 bg-slate-900/80">
                  {product.id === 'chatgpt' && '🤖'}
                  {product.id === 'spotify' && '🎵'}
                  {product.id === 'nba' && '🏀'}
                </div>
              </div>
              <div className="p-6">
                <p className="text-rose-400 text-xs font-medium uppercase tracking-wider mb-1">
                  {product.tagline}
                </p>
                <h3 className="font-display text-xl font-bold text-white mb-2">
                  {product.name}
                </h3>
                <p className="text-slate-400 text-sm line-clamp-3 mb-4">
                  {product.description}
                </p>
                <ul className="space-y-2 mb-6">
                  {product.features.slice(0, 3).map((f, i) => (
                    <li key={i} className="text-slate-300 text-sm flex items-start gap-2">
                      <span className="text-rose-500 mt-0.5">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <div className="flex items-center justify-between">
                  <span className="font-display text-2xl font-bold text-rose-400">
                    {product.price}
                  </span>
                  <button
                    type="button"
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 text-white text-sm font-medium hover:from-rose-600 hover:to-pink-700 transition"
                  >
                    Acheter
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  )
}
