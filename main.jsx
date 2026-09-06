import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import MenuPage from './MenuPage.jsx'
import CatProfilePage, { catProfiles } from './CatProfilePage.jsx'
import './styles.css'

const searchParams = new URLSearchParams(window.location.search)
const legacyMenuUrl = searchParams.get('page') === 'menu'
const legacyCatSlug = searchParams.get('cat')
const pathCatSlug = window.location.pathname.match(/^\/koty\/([^/]+)$/)?.[1]
const catSlug = catProfiles[pathCatSlug] ? pathCatSlug : catProfiles[legacyCatSlug] ? legacyCatSlug : null
const isMenuPage = window.location.pathname === '/menu' || legacyMenuUrl
const isCatPage = Boolean(catSlug)
if (legacyMenuUrl && window.location.pathname !== '/menu') window.history.replaceState({}, '', '/menu')
if (legacyCatSlug && catSlug && window.location.pathname !== `/koty/${catSlug}`) window.history.replaceState({}, '', `/koty/${catSlug}`)
const Page = isMenuPage ? MenuPage : App
const pageMeta = isCatPage ? {
  title: `${catProfiles[catSlug].name} — profil kota | Niebieski Kot`,
  description: catProfiles[catSlug].seoDescription,
  url: `https://niebieski-kot.vercel.app/koty/${catSlug}`,
} : isMenuPage ? {
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
    {isCatPage ? <CatProfilePage slug={catSlug}/> : <Page />}
  </React.StrictMode>,
)
