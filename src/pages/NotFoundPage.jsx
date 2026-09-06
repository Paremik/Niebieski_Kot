import React from 'react'
import { ArrowLeft, Cat } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <main className="not-found-page">
      <div className="not-found-card">
        <div className="not-found-icon" aria-hidden="true"><Cat size={30}/></div>
        <p className="eyebrow">Niebieski Kot</p>
        <h1>Tej strony jeszcze nie ma.</h1>
        <p>Wygląda na to, że ten adres nie prowadzi do żadnego miejsca w naszej kawiarni.</p>
        <Link className="button button-primary" to="/"><ArrowLeft size={17}/> Wróć na stronę główną</Link>
      </div>
    </main>
  )
}
