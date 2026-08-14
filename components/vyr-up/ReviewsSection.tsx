import { ShieldCheck } from 'lucide-react'
import { reviews } from './quiz-data'

// The "Avis" link in the header has always pointed to #reviews, and the
// full review-card styling already existed in globals.css — but no section
// with that id was ever rendered, so the link led nowhere. This wires it up.
export function ReviewsSection() {
  return (
    <section className="reviews-section" id="reviews">
      <div className="section-heading">
        <span className="section-label">03 / ILS ONT VU CLAIR</span>
        <h2>DES CRÉATEURS<br />QUI ONT <em>CHANGÉ</em> DE MÉTHODE.</h2>
        <p>Des retours de créateurs qui ont remplacé l’intuition par la lecture de leurs propres signaux.</p>
      </div>
      <div className="reviews-grid">
        {reviews.map(([name, handle, quote], i) => (
          <article className="review-card" key={handle}>
            <div className={`avatar avatar-${i + 1} avatar-initial`} aria-hidden="true">{name.slice(0, 1)}</div>
            <div className="review-author"><b>{name}</b><span>{handle}</span></div>
            <div className="review-stars" aria-hidden="true">★★★★★</div>
            <blockquote>“{quote}”</blockquote>
            <div className="verified"><ShieldCheck /><span>Avis vérifié</span></div>
          </article>
        ))}
      </div>
    </section>
  )
}
