import VoteToFame from '@/components/VoteToFame'
import Link from 'next/link'

export default function VotePage() {
  return (
    <>
      <div className="fixed top-4 left-4 z-50">
        <Link
          href="/"
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900/80 border border-zinc-700/50 text-zinc-400 hover:text-white hover:border-pink-500/30 transition text-sm"
        >
          ← Retour
        </Link>
      </div>
      <VoteToFame
        title="SAYURI VOTE"
        subtitle="Vote pour ton favori"
        editable={true}
      />
    </>
  )
}
