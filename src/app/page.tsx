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
  fullDescription?: string
  features: string[]
  emoji: string
  category: string
  badge?: string
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
  size = 'md',
}: {
  productName: string
  variant?: string
  price: string
  discordId: string | null
  size?: 'sm' | 'md' | 'lg'
}) {
  const [loading, setLoading] = useState(false)
  const sizeClass = size === 'lg' ? 'px-6 py-3 text-base' : size === 'sm' ? 'px-3 py-1.5 text-xs' : 'px-4 py-2 text-sm'

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
      className={`rounded-lg font-semibold bg-gradient-to-r from-pink-500 to-rose-600 text-white hover:from-pink-600 hover:to-rose-700 transition btn-animated shrink-0 disabled:opacity-70 ${sizeClass}`}
    >
      {loading ? '...' : 'Buy now'}
    </button>
  )
}

const FEATURES = [
  { icon: '⚡', title: 'Instant delivery', desc: 'Get your order within minutes' },
  { icon: '🛡️', title: '24/7 support', desc: 'We\'re always here to help' },
  { icon: '✓', title: 'Warranty included', desc: '24h replacement guarantee' },
]

const TESTIMONIALS = [
  { name: 'Alex', text: 'Fast delivery, exactly what I ordered. Top service!', rating: 5 },
  { name: 'Maya', text: 'Best prices I\'ve found. Will buy again.', rating: 5 },
  { name: 'Jordan', text: 'Customer support fixed my issue in minutes. 10/10', rating: 5 },
]

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
    <main className="min-h-screen flex items-center justify-center p-6 bg-[#0a0a0b] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(236,72,153,0.15),transparent)]">
      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl font-bold text-white mb-2">Sayuri Shop</h1>
          <p className="text-zinc-500">Access key required</p>
        </div>
        <form onSubmit={handleSubmit} className="glass rounded-2xl p-8">
          <label htmlFor="key" className="block text-sm font-medium text-zinc-300 mb-2">Access key</label>
          <input
            id="key"
            type="password"
            value={key}
            onChange={(e) => { setKey(e.target.value); setError('') }}
            placeholder="Enter key"
            className="w-full px-4 py-3 rounded-xl bg-zinc-900/80 border border-zinc-700/50 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50 transition"
            autoFocus
          />
          {error && <p className="mt-2 text-sm text-pink-400">{error}</p>}
          <button type="submit" className="mt-6 w-full py-3 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 text-white font-semibold hover:from-pink-600 hover:to-rose-700 transition btn-animated">
            Access shop
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
  const [expandedProduct, setExpandedProduct] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => r.json())
      .then((d) => setDiscordId(d.discordId))
      .catch(() => {})
  }, [])

  const products: Product[] = [
    { id: 'chatgpt', name: 'ChatGPT+ Generator', price: '€35.00', image: '/images/chatgpt.png', tagline: 'Unlimited Daily', description: 'Get up to 5 ChatGPT+ accounts every day.', fullDescription: 'Access our private generator for unlimited ChatGPT+ accounts. Perfect for productivity, reselling, or personal use. Includes instant delivery and exclusive Discord access.', features: ['5 accounts daily', 'Instant delivery', 'Private Discord role', 'Save €110+/month'], emoji: '🤖', category: 'Accounts', badge: 'Popular' },
    { id: 'spotify', name: 'Spotify Lifetime Key', price: '€7.50', image: '/images/spotify.png', tagline: 'Own Account', description: 'Full Spotify Premium on your personal account — forever.', fullDescription: 'Activate Spotify Premium directly on your own account. No shared credentials. No ads, unlimited skips, offline listening. One-time payment, lifetime access.', features: ['Lifetime access', 'No ads', 'All devices', 'Instant activation'], emoji: '🎵', category: 'Streaming' },
    { id: 'nba', name: 'NBA Lifetime Account', price: '€5.00', image: '/images/nba.png', tagline: 'Streaming', description: 'Watch every NBA game, live or on-demand.', fullDescription: 'Full access to NBA League Pass. Every game, highlights, replays, and exclusive content. Changeable credentials, lifetime access, no subscription.', features: ['Full access', 'Live & replays', '24h warranty', 'Instant delivery'], emoji: '🏀', category: 'Streaming' },
    { id: 'ufc', name: 'UFC Fight Pass', price: '€5.00', image: '/images/ufc.png', tagline: 'Lifetime', description: 'Every UFC fight, anytime. No monthly fees.', fullDescription: 'Complete UFC Fight Pass access. Live events, archives, original series. Works on all devices. Global access, no region locks.', features: ['Lifetime', 'All devices', 'Global access', 'Instant delivery'], emoji: '🥊', category: 'Streaming' },
    { id: 'youtube', name: 'YouTube Premium', price: '€3.50', image: '/images/youtube.png', tagline: 'Full Access', description: 'No ads, background play, offline downloads, YouTube Music.', fullDescription: 'Full YouTube Premium account. Login included, password changeable. No ads, offline downloads, background play, YouTube Music. Works worldwide.', features: ['Full account', 'Changeable password', 'All devices', 'No ads'], emoji: '▶️', category: 'Streaming' },
    { id: 'netflix', name: 'Netflix Generator', price: '€17.00', image: '/images/netflix.png', tagline: 'Private System', description: '30–100 Netflix accounts per day from our Discord generator.', fullDescription: 'Access our private Netflix generator. Generate accounts directly on Discord. Resell or use for your shop. License key delivered instantly.', features: ['30–100 accounts/day', 'Discord bot', 'Resell potential', 'Lifetime access'], emoji: '📺', category: 'Streaming', badge: 'Best value' },
    { id: 'crunchyroll', name: 'Crunchyroll MEGA FAN', price: '€2.00', image: '/images/crunchyroll.png', tagline: 'Lifetime', description: 'Unlimited anime, ad-free. MEGA FAN membership forever.', fullDescription: 'Premium Crunchyroll with MEGA FAN tier. Unlimited streaming, ad-free, exclusive perks. Clean accounts, 24h warranty, works with VPN.', features: ['MEGA FAN', 'Ad-free', '24h warranty', 'VPN support'], emoji: '🌸', category: 'Streaming' },
    { id: 'roblox', name: 'Roblox Accounts', image: '/images/roblox.png', tagline: 'Inventory Value', description: 'Premium accounts sorted by Robux/inventory value. For collectors & traders.', fullDescription: 'Roblox accounts with verified inventory value. Choose your tier from 1k to 50k+ Robux. Perfect for trading, collecting, or reselling. Instant delivery, warranty included.', features: ['Inventory tiers', 'Verified value', 'Instant delivery', 'Warranty'], emoji: '🎮', category: 'Gaming', badge: 'Bestseller', variants: [
      { label: '1,000 – 2,500 Robux', price: '€3.50' }, { label: '2,500 – 5,000', price: '€5.00' }, { label: '5,000 – 10,000', price: '€9.00' }, { label: '10,000 – 15,000', price: '€15.00' }, { label: '15,000 – 25,000', price: '€20.00' }, { label: '25,000 – 50,000', price: '€25.00' },
    ]},
    { id: 'fa-discord', name: 'FA Discord Accounts', image: '/images/discord-accounts.png', tagline: 'Verified', description: 'Full access Discord accounts. E-mail and phone verified.', fullDescription: 'Fresh Discord accounts with full access. E-mail and/or phone verified. Aged options available. Private, unused, 24h replacement warranty.', features: ['Verified', 'Changeable', '24h warranty', 'Instant delivery'], emoji: '💬', category: 'Discord', variants: [
      { label: 'E-Mail Verified', price: '€0.50' }, { label: 'E-Mail + Phone', price: '€0.80' }, { label: '3+ Months Aged', price: '€1.00' }, { label: '2023', price: '€1.20' }, { label: '2020', price: '€3.00' }, { label: '1M Nitro + 2 Boosts', price: '€4.50' }, { label: '2019', price: '€5.00' }, { label: '3M Nitro + 2 Boosts', price: '€6.00' }, { label: '2017', price: '€8.00' },
    ]},
    { id: 'boosts', name: '14× Server Boosts', price: '€5.50', image: '/images/boosts.png', tagline: 'Level 3', description: 'Instant Level 3 on any Discord server.', fullDescription: '14× 1 Month Server Boosts. Instantly upgrade any server to Level 3. Works on any server. One-time purchase, full perks.', features: ['14 boosts', 'Level 3', '1 month', 'Any server'], emoji: '🚀', category: 'Discord' },
    { id: 'decorations', name: 'Discord Decorations', image: '/images/nitro.png', tagline: 'Profile', description: 'Discord profile decorations at discounted prices.', features: ['Various options', 'Instant'], emoji: '✨', category: 'Discord', variants: [
      { label: '€4.99 → €2.50', price: '€2.50' }, { label: '€5.99 → €2.80', price: '€2.80' }, { label: '€7.99 → €3.50', price: '€3.50' }, { label: '€8.99 → €4.00', price: '€4.00' }, { label: '€9.99 → €4.50', price: '€4.50' }, { label: '€11.99 → €6.50', price: '€6.50' },
    ]},
    { id: 'nitro-boost', name: 'Nitro Boost', image: '/images/nitro.png', tagline: '3M & 1M', description: 'Nitro Boost options. 3-Month or 1-Month.', features: ['3-Month', '1-Month'], emoji: '💎', category: 'Discord', variants: [
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
    <main className="min-h-screen bg-[#0a0a0b]">
      <header className="sticky top-0 z-50 glass border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <a href="/" className="font-display text-xl font-bold text-white tracking-tight">Sayuri Shop</a>
            <nav className="flex items-center gap-4 sm:gap-6">
              {discordId ? (
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-zinc-400 text-sm hidden sm:inline">Connected</span>
                  <button
                    onClick={async () => {
                      await fetch('/api/auth/logout', { method: 'POST' })
                      setDiscordId(null)
                      window.location.reload()
                    }}
                    className="text-zinc-500 hover:text-white text-sm transition"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <a
                  href="/api/auth/discord"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#5865F2] text-white text-sm font-medium hover:bg-[#4752C4] transition"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/></svg>
                  Connect Discord
                </a>
              )}
              <a href={DISCORD_LINK} target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-white text-sm transition">
                Discord
              </a>
            </nav>
          </div>
          {!discordId && (
            <div className="flex items-center gap-2 pb-3">
              <span className="text-amber-400">⚠</span>
              <p className="text-amber-400/90 text-sm">Connect Discord before buying to see your ticket after purchase.</p>
            </div>
          )}
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-pink-500/10 via-transparent to-transparent" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-12 pb-8">
          <div className="aspect-[3/1] max-h-64 rounded-2xl overflow-hidden border border-white/10">
            <img src="/images/banner.png" alt="Sayuri Shop" className="w-full h-full object-cover" />
          </div>
          <div className="mt-10 text-center max-w-2xl mx-auto">
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-white mb-3">Premium digital products</h1>
            <p className="text-zinc-400">Streaming accounts, generators, Discord services & more. Instant delivery, 24/7 support.</p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 -mt-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {FEATURES.map((f, i) => (
            <div key={i} className="glass rounded-xl p-4 flex items-center gap-4 animate-slide-up" style={{ animationDelay: `${i * 100}ms` }}>
              <span className="text-2xl">{f.icon}</span>
              <div>
                <p className="font-semibold text-white">{f.title}</p>
                <p className="text-sm text-zinc-500">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Products */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div className="flex flex-wrap gap-2 mb-10">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`px-5 py-2.5 rounded-xl text-sm font-medium transition ${
                activeTab === cat
                  ? 'bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-lg shadow-pink-500/25'
                  : 'bg-zinc-900/80 text-zinc-400 hover:bg-zinc-800 hover:text-white border border-zinc-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((product, idx) => (
            <article
              key={product.id}
              className="group relative glass rounded-2xl overflow-hidden border border-white/5 hover:border-pink-500/30 transition-all duration-300 animate-slide-up"
              style={{ animationDelay: `${Math.min(idx * 50, 300)}ms` }}
            >
              {product.badge && (
                <div className="absolute top-4 right-4 z-10 px-2.5 py-1 rounded-lg bg-pink-500/90 text-white text-xs font-bold uppercase">
                  {product.badge}
                </div>
              )}
              <div className="relative aspect-square bg-gradient-to-b from-zinc-900/50 to-black flex items-center justify-center p-8 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                    const fb = e.currentTarget.nextElementSibling as HTMLElement
                    if (fb) fb.style.display = 'flex'
                  }}
                />
                <div className="absolute inset-0 hidden flex items-center justify-center text-6xl bg-black/80">
                  {product.emoji}
                </div>
              </div>
              <div className="p-6">
                <p className="text-pink-500 text-xs font-semibold uppercase tracking-wider mb-1">{product.tagline}</p>
                <h3 className="font-display text-xl font-bold text-white mb-2">{product.name}</h3>
                <p className="text-zinc-400 text-sm mb-4">{product.description}</p>
                {(product.fullDescription || expandedProduct === product.id) && (
                  <p className="text-zinc-500 text-sm mb-4 leading-relaxed">{product.fullDescription}</p>
                )}
                {product.fullDescription && (
                  <button
                    onClick={() => setExpandedProduct(expandedProduct === product.id ? null : product.id)}
                    className="text-pink-500 text-sm font-medium mb-4 hover:text-pink-400"
                  >
                    {expandedProduct === product.id ? 'Show less' : 'Read full description'}
                  </button>
                )}
                <ul className="space-y-2 mb-5">
                  {product.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-2 text-zinc-400 text-sm">
                      <span className="text-pink-500">✓</span> {f}
                    </li>
                  ))}
                </ul>
                {isVariantProduct(product) && (
                  <select
                    value={selectedVariants[product.id] ?? 0}
                    onChange={(e) => setSelectedVariants((v) => ({ ...v, [product.id]: Number(e.target.value) }))}
                    className="w-full mb-5 px-4 py-2.5 rounded-xl bg-zinc-900/80 border border-zinc-700/50 text-white text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/50"
                  >
                    {product.variants.map((v, i) => (
                      <option key={i} value={i}>{v.label} — {v.price}</option>
                    ))}
                  </select>
                )}
                <div className="flex items-center justify-between gap-4">
                  <span className="font-display text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-500">{getProductPrice(product)}</span>
                  <BuyButton
                    productName={product.name}
                    variant={isVariantProduct(product) ? product.variants[selectedVariants[product.id] ?? 0]?.label : undefined}
                    price={getProductPrice(product)}
                    discordId={discordId}
                    size="lg"
                  />
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
        <h2 className="font-display text-2xl font-bold text-white text-center mb-10">What our customers say</h2>
        <div className="grid gap-6 sm:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className="glass rounded-2xl p-6 border border-white/5">
              <div className="flex gap-1 mb-4">
                {[...Array(t.rating)].map((_, j) => (
                  <span key={j} className="text-amber-400">★</span>
                ))}
              </div>
              <p className="text-zinc-300 mb-4">&ldquo;{t.text}&rdquo;</p>
              <p className="text-zinc-500 text-sm font-medium">— {t.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 mt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <p className="font-display text-lg font-bold text-white">Sayuri Shop</p>
            <div className="flex gap-8">
              <a href={DISCORD_LINK} target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-white transition">Discord</a>
            </div>
          </div>
          <p className="mt-8 text-center text-zinc-600 text-sm">© {new Date().getFullYear()} Sayuri Shop. All rights reserved.</p>
        </div>
      </footer>
    </main>
  )
}
