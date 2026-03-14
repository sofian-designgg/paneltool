import { NextRequest, NextResponse } from 'next/server'

const DISCORD_API = 'https://discord.com/api/v10'

export async function POST(request: NextRequest) {
  try {
    const { product, variant, price, discordUserId } = await request.json()

    const token = process.env.DISCORD_BOT_TOKEN
    const guildId = process.env.DISCORD_GUILD_ID
    const categoryId = process.env.DISCORD_TICKET_CATEGORY_ID
    const supportRoleIds = (process.env.DISCORD_SUPPORT_ROLE_IDS || '').split(',').filter(Boolean)

    if (!token || !guildId || !categoryId) {
      return NextResponse.json(
        { error: 'Server misconfigured: missing Discord env vars' },
        { status: 500 }
      )
    }

    const productName = typeof product === 'string' ? product : 'Product'
    const variantInfo = typeof variant === 'string' ? ` - ${variant}` : ''
    const priceInfo = typeof price === 'string' ? ` (${price})` : ''
    const fullLabel = `${productName}${variantInfo}${priceInfo}`

    const safeName = fullLabel
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .slice(0, 50)

    const suffix = Math.random().toString(36).slice(2, 6)
    const channelName = `ticket-${safeName || 'order'}-${suffix}`.slice(0, 100)

    const permissionOverwrites: { id: string; type: number; deny?: string; allow?: string }[] = [
      { id: guildId, type: 0, deny: '1024' }
    ]
    if (discordUserId && typeof discordUserId === 'string') {
      permissionOverwrites.push({ id: discordUserId.trim(), type: 1, allow: '3072' })
    }
    for (const rid of supportRoleIds) {
      if (rid?.trim()) {
        permissionOverwrites.push({ id: rid.trim(), type: 0, allow: '3072' })
      }
    }

    const body = {
      name: channelName,
      type: 0,
      parent_id: categoryId,
      permission_overwrites: permissionOverwrites
    }

    const res = await fetch(`${DISCORD_API}/guilds/${guildId}/channels`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bot ${token}`
      },
      body: JSON.stringify(body)
    })

    if (!res.ok) {
      const err = await res.text()
      console.error('Discord API error:', res.status, err)
      return NextResponse.json(
        { error: 'Failed to create ticket' },
        { status: 502 }
      )
    }

    const channel = await res.json()

    const mention = discordUserId ? `<@${discordUserId}>` : 'Customer'
    const msgBody = {
      content: `🛒 **New order from website**\n\n**Product:** ${productName}${variantInfo}${priceInfo}\n\n${mention} — Your ticket is ready.`
    }

    await fetch(`${DISCORD_API}/channels/${channel.id}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bot ${token}`
      },
      body: JSON.stringify(msgBody)
    }).catch(() => {})

    return NextResponse.json({ ok: true, channelId: channel.id })
  } catch (e) {
    console.error('create-ticket:', e)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
