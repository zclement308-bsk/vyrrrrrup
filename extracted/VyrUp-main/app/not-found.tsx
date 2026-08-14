import Link from 'next/link'
import { Wordmark } from '@/components/vyr-up/shared'

export default function NotFound() {
  return (
    <div className="flow-shell boot-screen">
      <Wordmark />
      <span className="mono-note">ERREUR 404</span>
      <h1>CETTE PAGE N’EXISTE PAS.</h1>
      <p style={{ color: 'var(--muted-foreground)', maxWidth: 420 }}>
        Le lien que tu as suivi est cassé, ou la page a été déplacée.
      </p>
      <Link href="/" className="primary-action" style={{ textDecoration: 'none' }}>
        <span>Retour à l’accueil</span>
      </Link>
    </div>
  )
}
