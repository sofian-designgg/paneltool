import { NextRequest, NextResponse } from 'next/server'

const DISCORD_OAUTH = 'https://discord.com/api/oauth2/authorize'

export async function GET(request: NextRequest) {
  const clientId = process.env.DISCORD_CLIENT_ID
  if (!clientId) {
    return NextResponse.json({ error: 'OAuth not configured' }, { status: 500 })
  }
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin
  const redirectUri = `${baseUrl}/api/auth/callback`
  const scopes = 'identify'
  const url = `${DISCORD_OAUTH}?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${encodeURIComponent(scopes)}`
  return NextResponse.redirect(url)
}
