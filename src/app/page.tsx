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
      className="py-2 px-4 rounded-lg bg-white/15 text-white text-sm font-medium hover:bg-white/25 transition border border-white/10 disabled:opacity-70 shrink-0"
    >
      {loading ? '...' : 'Buy'}
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
    <main className="min-h-screen text-white relative">
      {/* Fond flou */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/images/bg.png)', filter: 'blur(40px)', transform: 'scale(1.1)' }}
      />
      <div className="fixed inset-0 z-0 bg-black/60" />

      <div className="relative z-10">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/5 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <span className="font-display text-lg font-semibold text-white">Sayuri Shop</span>
          <div className="flex items-center gap-2">
            {discordId ? (
              <span className="text-zinc-300 text-sm flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Connected
              </span>
            ) : (
              <a
                href="/api/auth/discord"
                className="px-3 py-1.5 rounded-md bg-white/10 text-white text-sm hover:bg-white/20 transition"
              >
                Connect
              </a>
            )}
            <a
              href={DISCORD_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-md bg-white/15 text-white text-sm font-medium hover:bg-white/25 transition border border-white/10"
            >
              Discord
            </a>
          </div>
        </div>
      </header>

      {/* Hero épuré */}
      <section className="max-w-5xl mx-auto px-4 pt-16 pb-12 text-center">
        <h1 className="font-display text-3xl sm:text-4xl font-semibold text-white tracking-tight mb-2">
          Sayuri Shop
        </h1>
        <p className="text-zinc-400 text-sm max-w-md mx-auto">
          Digital products. Instant delivery.
        </p>
      </section>

      {/* Products */}
      <section className="max-w-5xl mx-auto px-4 pb-20">
        <div className="flex flex-wrap gap-1.5 mb-8 justify-center">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`px-3 py-1.5 rounded-md text-sm transition ${
                activeTab === cat
                  ? 'bg-white/20 text-white'
                  : 'text-zinc-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((product) => (
            <article
              key={product.id}
              className="relative rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 overflow-hidden hover:bg-white/10 hover:border-white/20 transition"
            >
              {product.badge && (
                <div className="absolute top-2.5 right-2.5 z-10 px-2 py-0.5 rounded bg-white/20 text-white text-xs">
                  {product.badge}
                </div>
              )}
              <div className="relative aspect-square flex items-center justify-center p-6 bg-white/[0.02]">
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
                <div className="absolute inset-0 hidden flex items-center justify-center text-4xl text-zinc-500">
                  {product.emoji}
                </div>
              </div>
              <div className="p-4">
                <p className="text-zinc-500 text-xs uppercase tracking-wider mb-0.5">{product.tagline}</p>
                <h3 className="font-display text-base font-semibold text-white mb-1">{product.name}</h3>
                <p className="text-zinc-400 text-sm mb-3">{product.description}</p>
                {isVariantProduct(product) && (
                  <select
                    value={selectedVariants[product.id] ?? 0}
                    onChange={(e) => setSelectedVariants((v) => ({ ...v, [product.id]: Number(e.target.value) }))}
                    className="w-full mb-3 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-1 focus:ring-white/20"
                  >
                    {product.variants.map((v, i) => (
                      <option key={i} value={i}>{v.label} — {v.price}</option>
                    ))}
                  </select>
                )}
                <div className="flex items-center justify-between gap-3">
                  <span className="text-white font-medium">{getProductPrice(product)}</span>
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
      </section>

      {/* CTA */}
      <section className="max-w-5xl mx-auto px-4 py-12 text-center border-t border-white/10">
        <p className="text-zinc-400 text-sm mb-4">Orders & support on Discord</p>
        <a
          href={DISCORD_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-6 py-2.5 rounded-lg bg-white/15 text-white text-sm font-medium hover:bg-white/25 transition border border-white/10"
        >
          Join Discord
        </a>
      </section>

      {/* Footer */}
      <footer className="py-6 text-center">
        <p className="text-zinc-500 text-xs">© {new Date().getFullYear()} Sayuri Shop</p>
      </footer>
      </div>
    </main>
  )
}
