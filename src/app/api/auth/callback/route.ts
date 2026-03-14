import { NextRequest, NextResponse } from 'next/server'

const DISCORD_API = 'https://discord.com/api/v10'

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code')
  const clientId = process.env.DISCORD_CLIENT_ID
  const clientSecret = process.env.DISCORD_CLIENT_SECRET
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin
  const redirectUri = `${baseUrl}/api/auth/callback`

  if (!code || !clientId || !clientSecret) {
    return NextResponse.redirect(`${baseUrl}/?error=oauth_config`)
  }

  try {
    const tokenRes = await fetch(`${DISCORD_API}/oauth2/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
      }),
    })
    if (!tokenRes.ok) {
      const err = await tokenRes.text()
      console.error('Discord token error:', err)
      return NextResponse.redirect(`${baseUrl}/?error=token`)
    }
    const { access_token } = await tokenRes.json()

    const userRes = await fetch(`${DISCORD_API}/users/@me`, {
      headers: { Authorization: `Bearer ${access_token}` },
    })
    if (!userRes.ok) return NextResponse.redirect(`${baseUrl}/?error=user`)
    const user = await userRes.json()

    const res = NextResponse.redirect(baseUrl)
    res.cookies.set('discord_id', user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30,
      path: '/',
    })
    return res
  } catch (e) {
    console.error('OAuth callback:', e)
    return NextResponse.redirect(`${baseUrl}/?error=oauth`)
  }
}
