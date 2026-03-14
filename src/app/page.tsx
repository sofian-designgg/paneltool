'use client'

import { useState, useEffect } from 'react'

const ACCESS_KEY = 'sayuribuy'
const DISCORD_LINK = 'https://discord.gg/sayurishop'

type ProductVariant = { label: string; price: string }
type ProductBase = {
  id: string
  name: string
  image: string
  tagline: string
  description: string
  features: string[]
  emoji: string
  category: string
}
type SimpleProduct = ProductBase & { price: string; variants?: never }
type VariantProduct = ProductBase & { price?: never; variants: ProductVariant[] }
type Product = SimpleProduct | VariantProduct

function isVariantProduct(p: Product): p is VariantProduct {
  return 'variants' in p && Array.isArray((p as VariantProduct).variants)
}

function BuyButton({
  productName,
  variant,
  price,
  discordId,
}: {
  productName: string
  variant?: string
  price: string
  discordId: string | null
}) {
  const [loading, setLoading] = useState(false)

  const handleBuy = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/create-ticket', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product: productName,
          variant: variant || undefined,
          price,
          discordUserId: discordId || undefined,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || 'Failed')
      window.open(DISCORD_LINK, '_blank')
    } catch {
      window.open(DISCORD_LINK, '_blank')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleBuy}
      disabled={loading}
      className="px-4 py-2 rounded bg-pink-500 text-white text-sm font-medium hover:bg-pink-600 transition btn-animated shrink-0 disabled:opacity-70"
    >
      {loading ? '...' : 'Buy'}
    </button>
  )
}

const CATEGORIES = ['All', 'Streaming', 'Accounts', 'Discord', 'Gaming']

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
      setError('Invalid key')
    }
  }

  if (granted) return <Shop />
  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-black">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-display text-2xl font-semibold text-white mb-1">Sayuri Shop</h1>
          <p className="text-zinc-500 text-sm">Access key required</p>
        </div>
        <form onSubmit={handleSubmit} className="border border-zinc-800 rounded-lg p-6">
          <label htmlFor="key" className="block text-sm text-zinc-400 mb-2">Access key</label>
          <input
            id="key"
            type="password"
            value={key}
            onChange={(e) => { setKey(e.target.value); setError('') }}
            placeholder="Enter key"
            className="w-full px-4 py-2.5 rounded bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-600 focus:outline-none focus:border-pink-500 transition"
            autoFocus
          />
          {error && <p className="mt-2 text-sm text-pink-500">{error}</p>}
          <button type="submit" className="mt-5 w-full py-2.5 rounded bg-pink-500 text-white text-sm font-medium hover:bg-pink-600 transition btn-animated">
            Access
          </button>
        </form>
      </div>
    </main>
  )
}

function Shop() {
  const [selectedVariants, setSelectedVariants] = useState<Record<string, number>>({})
  const [activeTab, setActiveTab] = useState('All')
  const [discordId, setDiscordId] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => r.json())
      .then((d) => setDiscordId(d.discordId))
      .catch(() => {})
  }, [])

  const products: Product[] = [
    { id: 'chatgpt', name: 'ChatGPT+ Generator', price: '€35.00', image: '/images/chatgpt.png', tagline: 'Unlimited Daily', description: 'Up to 5 accounts/day.', features: ['5 accounts daily', 'Instant delivery'], emoji: '🤖', category: 'Accounts' },
    { id: 'spotify', name: 'Spotify Lifetime Key', price: '€7.50', image: '/images/spotify.png', tagline: 'Own Account', description: 'Full Spotify Premium forever.', features: ['Lifetime', 'No ads'], emoji: '🎵', category: 'Streaming' },
    { id: 'nba', name: 'NBA Lifetime Account', price: '€5.00', image: '/images/nba.png', tagline: 'Streaming', description: 'Watch every game.', features: ['Full access', '24h warranty'], emoji: '🏀', category: 'Streaming' },
    { id: 'ufc', name: 'UFC Fight Pass', price: '€5.00', image: '/images/ufc.png', tagline: 'Lifetime', description: 'Every fight, anytime.', features: ['All devices', 'Global'], emoji: '🥊', category: 'Streaming' },
    { id: 'youtube', name: 'YouTube Premium', price: '€3.50', image: '/images/youtube.png', tagline: 'Full Access', description: 'No ads, offline, Music.', features: ['Login included', 'All devices'], emoji: '▶️', category: 'Streaming' },
    { id: 'netflix', name: 'Netflix Generator', price: '€17.00', image: '/images/netflix.png', tagline: 'Private System', description: '30–100 accounts/day.', features: ['Discord bot', 'Instant'], emoji: '📺', category: 'Streaming' },
    { id: 'crunchyroll', name: 'Crunchyroll MEGA FAN', price: '€2.00', image: '/images/crunchyroll.png', tagline: 'Lifetime', description: 'Unlimited anime.', features: ['Ad-free', '24h warranty'], emoji: '🌸', category: 'Streaming' },
    { id: 'roblox', name: 'Roblox (Robux)', image: '/images/roblox.png', tagline: 'Inventory Value', description: 'Accounts by value.', features: ['Tiers', 'Instant'], emoji: '🎮', category: 'Gaming', variants: [
      { label: '1,000 – 2,500', price: '€3.50' }, { label: '2,500 – 5,000', price: '€5.00' }, { label: '5,000 – 10,000', price: '€9.00' }, { label: '10,000 – 15,000', price: '€15.00' }, { label: '15,000 – 25,000', price: '€20.00' }, { label: '25,000 – 50,000', price: '€25.00' },
    ]},
    { id: 'fa-discord', name: 'FA Discord Accounts', image: '/images/discord-accounts.png', tagline: 'Verified', description: 'Full access accounts.', features: ['Instant delivery', '24h warranty'], emoji: '💬', category: 'Discord', variants: [
      { label: 'E-Mail Verified', price: '€0.50' }, { label: 'E-Mail + Phone', price: '€0.80' }, { label: '3+ Months Aged', price: '€1.00' }, { label: '2023', price: '€1.20' }, { label: '2020', price: '€3.00' }, { label: '1M Nitro + 2 Boosts', price: '€4.50' }, { label: '2019', price: '€5.00' }, { label: '3M Nitro + 2 Boosts', price: '€6.00' }, { label: '2017', price: '€8.00' },
    ]},
    { id: 'boosts', name: '14× Server Boosts', price: '€5.50', image: '/images/boosts.png', tagline: 'Level 3', description: 'Instant Level 3.', features: ['14 boosts', '1 month'], emoji: '🚀', category: 'Discord' },
    { id: 'decorations', name: 'Discord Decorations', image: '/images/nitro.png', tagline: 'Profile', description: 'Discord decorations.', features: ['Various options'], emoji: '✨', category: 'Discord', variants: [
      { label: '€4.99 → €2.50', price: '€2.50' }, { label: '€5.99 → €2.80', price: '€2.80' }, { label: '€7.99 → €3.50', price: '€3.50' }, { label: '€8.99 → €4.00', price: '€4.00' }, { label: '€9.99 → €4.50', price: '€4.50' }, { label: '€11.99 → €6.50', price: '€6.50' },
    ]},
    { id: 'nitro-boost', name: 'Nitro Boost', image: '/images/nitro.png', tagline: '3M & 1M', description: 'Nitro Boost options.', features: ['3-Month', '1-Month'], emoji: '💎', category: 'Discord', variants: [
      { label: '3-Month', price: '€2.00' }, { label: '3-Month + Activation', price: '€3.00' }, { label: '1-Month Promo Link', price: '€5.00' },
    ]},
  ]

  const filtered = activeTab === 'All' ? products : products.filter((p) => p.category === activeTab)
  const getProductPrice = (p: Product) => {
    if (isVariantProduct(p)) {
      const idx = selectedVariants[p.id] ?? 0
      return p.variants[idx]?.price ?? p.variants[0].price
    }
    return p.price
  }

  return (
    <main className="min-h-screen bg-black">
      <header className="border-b border-zinc-900 bg-black/95 backdrop-blur sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            <a href="/" className="text-lg font-semibold text-white">Sayuri Shop</a>
            <nav className="flex items-center gap-6">
              {discordId ? (
                <div className="flex items-center gap-3">
                  <span className="text-zinc-400 text-sm">Connected</span>
                  <button
                    onClick={async () => {
                      await fetch('/api/auth/logout', { method: 'POST' })
                      setDiscordId(null)
                      window.location.reload()
                    }}
                    className="text-zinc-500 hover:text-white text-sm"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <a
                  href="/api/auth/discord"
                  className="px-4 py-2 rounded bg-[#5865F2] text-white text-sm font-medium hover:bg-[#4752C4] transition"
                >
                  Connect Discord
                </a>
              )}
              <a
                href={DISCORD_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-400 hover:text-white text-sm"
              >
                Discord
              </a>
            </nav>
          </div>
          {!discordId && (
            <p className="pb-3 text-amber-500/90 text-xs">Connect Discord before buying to see your ticket.</p>
          )}
        </div>
      </header>

      <div className="w-full max-w-6xl mx-auto">
        <div className="w-full aspect-[3/1] max-h-56 overflow-hidden">
          <img src="/images/banner.png" alt="Sayuri Shop" className="w-full h-full object-cover object-center" />
        </div>

        <div className="px-4 py-8">
          <div className="flex flex-wrap gap-2 mb-8">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  activeTab === cat
                    ? 'bg-pink-500 text-white'
                    : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((product) => (
              <article key={product.id} className="border border-zinc-800 rounded-lg overflow-hidden bg-zinc-950/50 hover:border-zinc-700 transition">
                <div className="relative aspect-square bg-black flex items-center justify-center p-6">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                      const fb = e.currentTarget.nextElementSibling as HTMLElement
                      if (fb) fb.style.display = 'flex'
                    }}
                  />
                  <div className="absolute inset-0 hidden flex items-center justify-center text-4xl bg-black">
                    {product.emoji}
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-pink-500 text-xs uppercase tracking-wider mb-0.5">{product.tagline}</p>
                  <h3 className="text-white font-medium mb-2">{product.name}</h3>
                  <p className="text-zinc-500 text-sm mb-3">{product.description}</p>
                  {isVariantProduct(product) && (
                    <select
                      value={selectedVariants[product.id] ?? 0}
                      onChange={(e) => setSelectedVariants((v) => ({ ...v, [product.id]: Number(e.target.value) }))}
                      className="w-full mb-3 px-3 py-1.5 rounded bg-zinc-900 border border-zinc-800 text-white text-sm focus:outline-none focus:border-pink-500"
                    >
                      {product.variants.map((v, i) => (
                        <option key={i} value={i}>{v.label} — {v.price}</option>
                      ))}
                    </select>
                  )}
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-pink-500 font-semibold">{getProductPrice(product)}</span>
                    <BuyButton
                      productName={product.name}
                      variant={isVariantProduct(product) ? product.variants[selectedVariants[product.id] ?? 0]?.label : undefined}
                      price={getProductPrice(product)}
                      discordId={discordId}
                    />
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
