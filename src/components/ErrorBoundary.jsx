import React from 'react';
import {useLanguage} from '../i18n/LanguageProvider.jsx';
import LanguageSelect from '../../LanguageSelect.jsx';

function Fallback() {
  const {tr} = useLanguage();
  return <main className="not-found-page"><section className="not-found-card">
    <LanguageSelect />
    <h1>{tr('Nie udało się wyświetlić strony.')}</h1>
    <p>{tr('Odśwież stronę, aby spróbować ponownie.')}</p>
    <button className="button button-primary" onClick={() => window.location.reload()}>{tr('Odśwież stronę')}</button>
  </section></main>;
}
export default class ErrorBoundary extends React.Component {
  state = {failed: false};
  static getDerivedStateFromError() { return {failed: true}; }
  componentDidCatch(error, info) { console.error('Page render failed', error, info.componentStack); }
  render() { return this.state.failed ? <Fallback /> : this.props.children; }
}
