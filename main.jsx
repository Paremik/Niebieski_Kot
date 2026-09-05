import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import MenuPage from './MenuPage.jsx'
import './styles.css'

const legacyMenuUrl = new URLSearchParams(window.location.search).get('page') === 'menu'
const isMenuPage = window.location.pathname === '/menu' || legacyMenuUrl
if (legacyMenuUrl && window.location.pathname !== '/menu') window.history.replaceState({}, '', '/menu')
const Page = isMenuPage ? MenuPage : App
const pageMeta = isMenuPage ? {
  title: 'Menu | Niebieski Kot',
  description: 'Kawy specialty, śniadania, lekkie dania i domowe słodkości w kociej kawiarni Niebieski Kot.',
  url: 'https://niebieski-kot.vercel.app/menu',
} : {
  title: 'Niebieski Kot | Kocia kawiarnia w Opolu',
  description: 'Niebieski Kot — kameralna kocia kawiarnia w Opolu. Specialty coffee, domowe słodkości i spokojne spotkania z mruczącymi rezydentami.',
  url: 'https://niebieski-kot.vercel.app/',
}
document.title = pageMeta.title
document.querySelector('meta[name="description"]')?.setAttribute('content', pageMeta.description)
document.querySelector('link[rel="canonical"]')?.setAttribute('href', pageMeta.url)
document.querySelector('meta[property="og:title"]')?.setAttribute('content', pageMeta.title)
document.querySelector('meta[property="og:description"]')?.setAttribute('content', pageMeta.description)
document.querySelector('meta[property="og:url"]')?.setAttribute('content', pageMeta.url)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Page />
  </React.StrictMode>,
)
