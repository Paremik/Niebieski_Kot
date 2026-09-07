import { useLanguage } from '../i18n/LanguageProvider.jsx';
import React from 'react';
import { ArrowLeft, Cat } from 'lucide-react';
import { Link } from 'react-router-dom';
import LanguageSelect from '../../LanguageSelect.jsx';
export default function NotFoundPage() {
  const {
    tr
  } = useLanguage();
  return <main className="not-found-page">
      <div className="not-found-card">
        <LanguageSelect />
        <div className="not-found-icon" aria-hidden="true"><Cat size={30} /></div>
        <p className="eyebrow">Niebieski Kot</p>
        <h1>{tr("Tej strony jeszcze nie ma.")}</h1>
        <p>{tr("Wygląda na to, że ten adres nie prowadzi do żadnego miejsca w naszej kawiarni.")}</p>
        <Link className="button button-primary" to="/"><ArrowLeft size={17} />{tr("Wróć na stronę główną")}</Link>
      </div>
    </main>;
}
