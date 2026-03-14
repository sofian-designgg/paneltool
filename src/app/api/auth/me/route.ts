import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET() {
  const c = await cookies()
  const discordId = c.get('discord_id')?.value
  return NextResponse.json({ discordId: discordId || null })
}
