'use client'

import { useState } from 'react'

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
}
type SimpleProduct = ProductBase & { price: string; variants?: never }
type VariantProduct = ProductBase & { price?: never; variants: ProductVariant[] }
type Product = SimpleProduct | VariantProduct

function isVariantProduct(p: Product): p is VariantProduct {
  return 'variants' in p && Array.isArray((p as VariantProduct).variants)
}

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

  if (granted) return <Shop />
  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-slate-950 via-slate-900 to-rose-950/20">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl font-bold text-white mb-1">Sayuri Shop 🛒</h1>
          <p className="text-slate-400 text-sm">Accès réservé</p>
        </div>
        <form onSubmit={handleSubmit} className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-2xl p-8 shadow-xl">
          <label htmlFor="key" className="block text-sm font-medium text-slate-300 mb-2">Clé d&apos;accès</label>
          <input
            id="key"
            type="password"
            value={key}
            onChange={(e) => { setKey(e.target.value); setError('') }}
            placeholder="Entrez la clé"
            className="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-slate-600/50 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500/50 transition"
            autoFocus
          />
          {error && <p className="mt-2 text-sm text-rose-400">{error}</p>}
          <button type="submit" className="mt-6 w-full py-3 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 text-white font-medium hover:from-rose-600 hover:to-pink-700 transition shadow-lg shadow-rose-500/20">
            Accéder
          </button>
        </form>
      </div>
    </main>
  )
}

function Shop() {
  const [selectedVariants, setSelectedVariants] = useState<Record<string, number>>({})

  const products: Product[] = [
    {
      id: 'chatgpt',
      name: 'ChatGPT+ Generator',
      price: '€35.00',
      image: '/images/chatgpt.png',
      tagline: 'Unlimited Daily Accounts',
      description: 'Boost your productivity in seconds — get up to 5 ChatGPT+ accounts every day with our private generator.',
      features: ['Up to 5 accounts daily', 'Instant Delivery', 'Private Discord Role', 'Save over €110 monthly', 'Easy to use'],
      emoji: '🤖',
    },
    {
      id: 'spotify',
      name: 'Spotify Lifetime Key',
      price: '€7.50',
      image: '/images/spotify.png',
      tagline: 'Activate on Your Own Account',
      description: 'Unlock unlimited music, no ads, and premium quality — forever. Activate full Spotify Premium on your personal account.',
      features: ['Lifetime access', 'No ads, unlimited skips', 'Works on all devices', 'Instant delivery', 'Support included'],
      emoji: '🎵',
    },
    {
      id: 'nba',
      name: 'NBA Lifetime Account',
      price: '€5.00',
      image: '/images/nba.png',
      tagline: 'Full Access (Streaming)',
      description: 'Premium NBA streaming accounts with lifetime access — watch every game, highlight & exclusive content without limits.',
      features: ['Full Access — email & password changeable', 'Lifetime streaming', '24-hour replacement warranty', 'Instant delivery'],
      emoji: '🏀',
    },
    {
      id: 'ufc',
      name: 'UFC Fight Pass Lifetime Account',
      price: '€5.00',
      image: '/images/ufc.png',
      tagline: 'Watch every fight. Anytime. Forever.',
      description: 'Get full access to UFC Fight Pass content without any monthly cost. Perfect for true MMA fans.',
      features: ['Lifetime access', 'Live & on-demand fights', 'Works on PC, mobile, tablet, smart TV', 'Global access — no region restrictions', 'Instant delivery & support'],
      emoji: '🥊',
    },
    {
      id: 'youtube',
      name: 'YouTube Premium',
      price: '€3.50',
      image: '/images/youtube.png',
      tagline: 'Full Access (Own Account)',
      description: 'Enjoy full YouTube Premium with no ads, background play, offline downloads & YouTube Music. Full access account — login details, secure and permanently yours.',
      features: ['Full login details (email + password)', 'Password & recovery changeable', 'No ads, offline downloads, YouTube Music', 'Works globally on all devices', 'Instant delivery & support'],
      emoji: '▶️',
    },
    {
      id: 'netflix',
      name: 'NETFLIX ACCOUNT GENERATOR',
      price: '€17.00',
      image: '/images/netflix.png',
      tagline: 'Private Generator System',
      description: 'Access our PRIVATE Netflix Generator. Activate key on Discord. Generate 30–100 accounts per day. Resell or use for your shop.',
      features: ['30–100 Netflix accounts per day', 'License key on Discord', 'Works on our Discord server', 'Accounts sent to your DM', 'Potential $15+ profit/day'],
      emoji: '📺',
    },
    {
      id: 'crunchyroll',
      name: 'Crunchyroll MEGA FAN MEMBER',
      price: '€2.00',
      image: '/images/crunchyroll.png',
      tagline: 'Lifetime Account',
      description: 'Premium Crunchyroll accounts with MEGA FAN membership — unlimited anime streaming, ad-free viewing, exclusive features for a lifetime.',
      features: ['MEGA FAN membership (Lifetime)', 'Clean account — no bans', 'Unlimited anime, ad-free', 'Works worldwide with VPN support', '24-hour replacement warranty', 'Instant delivery'],
      emoji: '🌸',
    },
    {
      id: 'roblox',
      name: 'Roblox (Robux)',
      image: '/images/roblox.png',
      tagline: 'Inventory Value Accounts',
      description: 'Premium Roblox accounts sorted by inventory value. Perfect for collectors, traders, or resellers.',
      features: ['Inventory-based tiers', 'Accurate valuation', 'Ready for trading & collecting', 'Instant delivery', 'Warranty & support'],
      emoji: '🎮',
      variants: [
        { label: '1,000 – 2,500 Robux', price: '€3.50' },
        { label: '2,500 – 5,000 Robux', price: '€5.00' },
        { label: '5,000 – 10,000 Robux', price: '€9.00' },
        { label: '10,000 – 15,000 Robux', price: '€15.00' },
        { label: '15,000 – 25,000 Robux', price: '€20.00' },
        { label: '25,000 – 50,000 Robux', price: '€25.00' },
      ],
    },
    {
      id: 'fa-discord',
      name: 'FA Discord Accounts',
      image: '/images/discord-accounts.png',
      tagline: 'Account Types',
      description: 'Full access, changeable credentials. Email and/or phone verification. Instant delivery, 24h replacement warranty.',
      features: ['Full access & changeable credentials', 'Private, unused & 100% safe', 'Instant delivery', '24-hour replacement warranty'],
      emoji: '💬',
      variants: [
        { label: 'E-Mail Verified', price: '€0.50' },
        { label: 'E-Mail + Phone Verified', price: '€0.80' },
        { label: '3+ Months Aged', price: '€1.00' },
        { label: '2023 Accounts', price: '€1.20' },
        { label: '2020 Accounts', price: '€3.00' },
        { label: '1 Month Nitro + 2 Boosts + Phone', price: '€4.50' },
        { label: '2019 Accounts', price: '€5.00' },
        { label: '3 Month Nitro + 2 Boosts + Phone', price: '€6.00' },
        { label: '2017 Accounts', price: '€8.00' },
      ],
    },
    {
      id: 'boosts',
      name: '14× 1 Month Server Boosts',
      price: '€5.50',
      image: '/images/boosts.png',
      tagline: 'Instant Level 3',
      description: 'Boost your Discord server to Level 3 instantly. 14× Server Boosts (1 Month). Works on any server.',
      features: ['Instant Level 3 perks', 'Instant delivery', 'Works on any server', 'Support included', 'One-time purchase'],
      emoji: '🚀',
    },
    {
      id: 'decorations',
      name: 'Discord Decorations',
      image: '/images/nitro.png',
      tagline: 'DISCORD FEATURES',
      description: 'Discord profile decorations at discounted prices.',
      features: ['Various decoration options', 'Instant delivery', 'Support included'],
      emoji: '✨',
      variants: [
        { label: '€4.99 → €2.50', price: '€2.50' },
        { label: '€5.99 → €2.80', price: '€2.80' },
        { label: '€7.99 → €3.50', price: '€3.50' },
        { label: '€8.99 → €4.00', price: '€4.00' },
        { label: '€9.99 → €4.50', price: '€4.50' },
        { label: '€11.99 → €6.50', price: '€6.50' },
      ],
    },
    {
      id: 'nitro-boost',
      name: 'Nitro Boost',
      image: '/images/nitro.png',
      tagline: '3-Month & 1-Month',
      description: 'Nitro Boost options. 3-Month includes optional activation by our team (+€1). 1-Month via Promo Links (requires payment method).',
      features: ['3-Month Nitro Boost', '1-Month Nitro Boost (Promo Links)', 'Activation by our team optional'],
      emoji: '💎',
      variants: [
        { label: '3-Month Nitro Boost', price: '€2.00' },
        { label: '3-Month + Activation', price: '€3.00' },
        { label: '1-Month Nitro Boost (Promo Link)', price: '€5.00' },
      ],
    },
  ]

  const getProductPrice = (p: Product) => {
    if (isVariantProduct(p)) {
      const idx = selectedVariants[p.id] ?? 0
      return p.variants[idx]?.price ?? p.variants[0].price
    }
    return p.price
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-rose-950/10">
      <header className="border-b border-slate-800/50 bg-slate-900/30 backdrop-blur sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-center">
          <h1 className="font-display text-xl font-bold text-white">Sayuri Shop 🛒</h1>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-2">Nos offres</h2>
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
                  {product.emoji}
                </div>
              </div>
              <div className="p-6">
                <p className="text-rose-400 text-xs font-medium uppercase tracking-wider mb-1">{product.tagline}</p>
                <h3 className="font-display text-xl font-bold text-white mb-2">{product.name}</h3>
                <p className="text-slate-400 text-sm line-clamp-3 mb-4">{product.description}</p>
                <ul className="space-y-2 mb-4">
                  {product.features.slice(0, 3).map((f, i) => (
                    <li key={i} className="text-slate-300 text-sm flex items-start gap-2">
                      <span className="text-rose-500 mt-0.5">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                {isVariantProduct(product) && (
                  <select
                    value={selectedVariants[product.id] ?? 0}
                    onChange={(e) => setSelectedVariants((v) => ({ ...v, [product.id]: Number(e.target.value) }))}
                    className="w-full mb-4 px-3 py-2 rounded-lg bg-slate-900/80 border border-slate-600/50 text-white text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/50"
                  >
                    {product.variants.map((v, i) => (
                      <option key={i} value={i}>
                        {v.label} — {v.price}
                      </option>
                    ))}
                  </select>
                )}
                <div className="flex items-center justify-between gap-4">
                  <span className="font-display text-2xl font-bold text-rose-400">{getProductPrice(product)}</span>
                  <a
                    href={DISCORD_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 text-white text-sm font-medium hover:from-rose-600 hover:to-pink-700 transition text-center shrink-0"
                  >
                    Acheter
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  )
}
