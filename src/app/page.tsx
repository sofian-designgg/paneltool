'use client'

import { useState, useEffect } from 'react'

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
      className="w-full py-3 rounded-xl font-bold bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:from-pink-600 hover:to-rose-600 transition shadow-lg shadow-pink-500/25 disabled:opacity-70"
    >
      {loading ? '...' : 'Buy — ' + price}
    </button>
  )
}

const CATEGORIES = ['All', 'Streaming', 'Accounts', 'Discord', 'Gaming']

export default function Home() {
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
    { id: 'chatgpt', name: 'ChatGPT+ Generator', price: '€35.00', image: '/images/chatgpt.png', tagline: 'Unlimited Daily', description: 'Up to 5 accounts/day. Private generator.', features: ['5/day', 'Instant', 'Discord role'], emoji: '🤖', category: 'Accounts', badge: 'Popular' },
    { id: 'spotify', name: 'Spotify Lifetime', price: '€7.50', image: '/images/spotify.png', tagline: 'Own Account', description: 'Full Premium on your account forever.', features: ['Lifetime', 'No ads'], emoji: '🎵', category: 'Streaming' },
    { id: 'nba', name: 'NBA Lifetime', price: '€5.00', image: '/images/nba.png', tagline: 'Streaming', description: 'Every game, live & on-demand.', features: ['Full access', '24h warranty'], emoji: '🏀', category: 'Streaming' },
    { id: 'ufc', name: 'UFC Fight Pass', price: '€5.00', image: '/images/ufc.png', tagline: 'Lifetime', description: 'Every fight, anytime.', features: ['All devices', 'Global'], emoji: '🥊', category: 'Streaming' },
    { id: 'youtube', name: 'YouTube Premium', price: '€3.50', image: '/images/youtube.png', tagline: 'Full Access', description: 'No ads, offline, YouTube Music.', features: ['Login included', 'All devices'], emoji: '▶️', category: 'Streaming' },
    { id: 'netflix', name: 'Netflix Generator', price: '€17.00', image: '/images/netflix.png', tagline: 'Private', description: '30–100 accounts/day on Discord.', features: ['Generator', 'Instant'], emoji: '📺', category: 'Streaming', badge: 'Best value' },
    { id: 'crunchyroll', name: 'Crunchyroll MEGA FAN', price: '€2.00', image: '/images/crunchyroll.png', tagline: 'Lifetime', description: 'Unlimited anime, ad-free.', features: ['MEGA FAN', '24h warranty'], emoji: '🌸', category: 'Streaming' },
    { id: 'roblox', name: 'Roblox Accounts', image: '/images/roblox.png', tagline: 'Inventory Value', description: 'Accounts by Robux value. Tiers 1k–50k.', features: ['Tiers', 'Instant', 'Warranty'], emoji: '🎮', category: 'Gaming', badge: 'Bestseller', variants: [
      { label: '1k – 2.5k', price: '€3.50' }, { label: '2.5k – 5k', price: '€5.00' }, { label: '5k – 10k', price: '€9.00' }, { label: '10k – 15k', price: '€15.00' }, { label: '15k – 25k', price: '€20.00' }, { label: '25k – 50k', price: '€25.00' },
    ]},
    { id: 'fa-discord', name: 'FA Discord Accounts', image: '/images/discord-accounts.png', tagline: 'Verified', description: 'Full access, e-mail/phone verified.', features: ['Verified', '24h warranty'], emoji: '💬', category: 'Discord', variants: [
      { label: 'E-Mail', price: '€0.50' }, { label: 'E-Mail + Phone', price: '€0.80' }, { label: '3+ Months', price: '€1.00' }, { label: '2023', price: '€1.20' }, { label: '2020', price: '€3.00' }, { label: '1M Nitro + 2 Boosts', price: '€4.50' }, { label: '2019', price: '€5.00' }, { label: '3M Nitro + 2 Boosts', price: '€6.00' }, { label: '2017', price: '€8.00' },
    ]},
    { id: 'boosts', name: '14× Server Boosts', price: '€5.50', image: '/images/boosts.png', tagline: 'Level 3', description: 'Instant Level 3 on any server.', features: ['14 boosts', '1 month'], emoji: '🚀', category: 'Discord' },
    { id: 'decorations', name: 'Discord Decorations', image: '/images/nitro.png', tagline: 'Profile', description: 'Profile decorations, discounted.', features: ['Various', 'Instant'], emoji: '✨', category: 'Discord', variants: [
      { label: '€2.50', price: '€2.50' }, { label: '€2.80', price: '€2.80' }, { label: '€3.50', price: '€3.50' }, { label: '€4.00', price: '€4.00' }, { label: '€4.50', price: '€4.50' }, { label: '€6.50', price: '€6.50' },
    ]},
    { id: 'nitro-boost', name: 'Nitro Boost', image: '/images/nitro.png', tagline: '3M & 1M', description: 'Nitro Boost options.', features: ['3-Month', '1-Month'], emoji: '💎', category: 'Discord', variants: [
      { label: '3-Month', price: '€2.00' }, { label: '3-Month + Activation', price: '€3.00' }, { label: '1-Month Promo', price: '€5.00' },
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
    <main className="min-h-screen bg-[#09090b] text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#09090b]/90 backdrop-blur-md border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <span className="font-display text-xl font-bold">Sayuri Shop</span>
          <div className="flex items-center gap-3">
            {discordId ? (
              <span className="text-zinc-400 text-sm flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Connected
              </span>
            ) : (
              <a
                href="/api/auth/discord"
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#5865F2] text-white text-sm font-medium hover:bg-[#4752C4] transition"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/></svg>
                Connect
              </a>
            )}
            <a
              href={DISCORD_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-pink-500 to-rose-500 text-white text-sm font-bold hover:from-pink-600 hover:to-rose-600 transition"
            >
              Join Discord
            </a>
          </div>
        </div>
      </header>

      {/* Hero — style flash shop */}
      <section className="relative border-b border-white/5">
        <div className="absolute inset-0 bg-gradient-to-b from-pink-500/10 to-transparent pointer-events-none" />
        <div className="relative max-w-6xl mx-auto px-4 py-12 sm:py-16 text-center">
          <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight mb-3">
            <span className="text-white">Sayuri</span>{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-500">Shop</span>
          </h1>
          <p className="text-zinc-400 text-lg max-w-xl mx-auto mb-8">
            Premium digital products. Instant delivery, 24/7 support.
          </p>
          <a
            href={DISCORD_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold text-lg hover:from-pink-600 hover:to-rose-600 transition shadow-xl shadow-pink-500/25"
          >
            Open in Discord
          </a>
        </div>
      </section>

      {/* Banner image */}
      <section className="max-w-6xl mx-auto px-4 py-8">
        <div className="rounded-2xl overflow-hidden border border-white/10 aspect-[3/1] max-h-52">
          <img src="/images/banner.png" alt="Sayuri Shop" className="w-full h-full object-cover" />
        </div>
      </section>

      {/* Products */}
      <section className="max-w-6xl mx-auto px-4 pb-20">
        <div className="flex flex-wrap gap-2 mb-8">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                activeTab === cat
                  ? 'bg-pink-500 text-white'
                  : 'bg-zinc-800/80 text-zinc-400 hover:text-white hover:bg-zinc-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((product) => (
            <article
              key={product.id}
              className="relative rounded-2xl border border-white/10 bg-zinc-900/50 overflow-hidden hover:border-pink-500/30 transition"
            >
              {product.badge && (
                <div className="absolute top-3 right-3 z-10 px-2 py-0.5 rounded-md bg-pink-500 text-white text-xs font-bold">
                  {product.badge}
                </div>
              )}
              <div className="relative aspect-square bg-zinc-900 flex items-center justify-center p-6">
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
                <div className="absolute inset-0 hidden flex items-center justify-center text-5xl bg-zinc-900">
                  {product.emoji}
                </div>
              </div>
              <div className="p-5">
                <p className="text-pink-500 text-xs font-semibold uppercase tracking-wider mb-1">{product.tagline}</p>
                <h3 className="font-display text-lg font-bold text-white mb-2">{product.name}</h3>
                <p className="text-zinc-400 text-sm mb-4">{product.description}</p>
                <ul className="flex flex-wrap gap-2 mb-4">
                  {product.features.map((f, i) => (
                    <li key={i} className="text-xs text-zinc-500 bg-zinc-800 px-2 py-1 rounded">{f}</li>
                  ))}
                </ul>
                {isVariantProduct(product) && (
                  <select
                    value={selectedVariants[product.id] ?? 0}
                    onChange={(e) => setSelectedVariants((v) => ({ ...v, [product.id]: Number(e.target.value) }))}
                    className="w-full mb-4 px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                  >
                    {product.variants.map((v, i) => (
                      <option key={i} value={i}>{v.label} — {v.price}</option>
                    ))}
                  </select>
                )}
                <BuyButton
                  productName={product.name}
                  variant={isVariantProduct(product) ? product.variants[selectedVariants[product.id] ?? 0]?.label : undefined}
                  price={getProductPrice(product)}
                  discordId={discordId}
                />
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* CTA Discord */}
      <section className="border-t border-white/5 py-16">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="font-display text-2xl font-bold text-white mb-2">Order on Discord</h2>
          <p className="text-zinc-400 mb-6">Join our server to buy. Instant delivery & support.</p>
          <a
            href={DISCORD_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[#5865F2] text-white font-bold hover:bg-[#4752C4] transition"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/></svg>
            Join Sayuri Shop Discord
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="font-display font-bold text-white">Sayuri Shop</span>
          <a href={DISCORD_LINK} target="_blank" rel="noopener noreferrer" className="text-zinc-500 hover:text-white text-sm">
            Discord
          </a>
        </div>
        <p className="text-center text-zinc-600 text-xs mt-6">© {new Date().getFullYear()} Sayuri Shop</p>
      </footer>
    </main>
  )
}
