import React, { useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Navigate, Route, Routes, useLocation, useParams } from 'react-router-dom'
import HomePage from './src/pages/HomePage.jsx'
import MenuPage from './src/pages/MenuPage.jsx'
import CatProfilePage, { catProfiles } from './src/pages/CatProfilePage.jsx'
import NotFoundPage from './src/pages/NotFoundPage.jsx'
import AdminPage from './AdminPage.jsx'
import './styles.css'

const siteUrl = 'https://niebieski-kot.vercel.app'

function updateMeta(pathname) {
  const slug = pathname.match(/^\/koty\/([^/]+)\/?$/)?.[1]
  const pageMeta = slug && catProfiles[slug] ? {
    title: `${catProfiles[slug].name} — profil kota | Niebieski Kot`,
    description: catProfiles[slug].seoDescription,
    url: `${siteUrl}/koty/${slug}`,
  } : pathname === '/admin' ? {
    title: 'Admin | Niebieski Kot',
    description: 'Panel administracyjny kociej kawiarni Niebieski Kot.',
    url: `${siteUrl}/admin`,
  } : pathname === '/menu' ? {
    title: 'Menu | Niebieski Kot',
    description: 'Kawy specialty, śniadania, lekkie dania i domowe słodkości w kociej kawiarni Niebieski Kot.',
    url: `${siteUrl}/menu`,
  } : pathname === '/' ? {
    title: 'Niebieski Kot | Kocia kawiarnia w Opolu',
    description: 'Niebieski Kot — kameralna kocia kawiarnia w Opolu. Specialty coffee, domowe słodkości i spokojne spotkania z mruczącymi rezydentami.',
    url: `${siteUrl}/`,
  } : {
    title: 'Nie znaleziono strony | Niebieski Kot',
    description: 'Ta strona nie istnieje w serwisie Niebieski Kot.',
    url: `${siteUrl}${pathname}`,
  }

  document.title = pageMeta.title
  document.querySelector('meta[name="description"]')?.setAttribute('content', pageMeta.description)
  document.querySelector('link[rel="canonical"]')?.setAttribute('href', pageMeta.url)
  document.querySelector('meta[property="og:title"]')?.setAttribute('content', pageMeta.title)
  document.querySelector('meta[property="og:description"]')?.setAttribute('content', pageMeta.description)
  document.querySelector('meta[property="og:url"]')?.setAttribute('content', pageMeta.url)
}

function DocumentMeta() {
  const { pathname } = useLocation()
  useEffect(() => updateMeta(pathname), [pathname])
  return null
}

function CatRoute() {
  const { slug } = useParams()
  return catProfiles[slug] ? <CatProfilePage slug={slug}/> : <NotFoundPage/>
}

function AppRoutes() {
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const legacyCat = searchParams.get('cat')

  if (location.pathname === '/' && searchParams.get('page') === 'menu') {
    return <Navigate to="/menu" replace/>
  }
  if (location.pathname === '/' && legacyCat && catProfiles[legacyCat]) {
    return <Navigate to={`/koty/${legacyCat}`} replace/>
  }

  return (
    <>
      <DocumentMeta/>
      <Routes>
        <Route path="/" element={<HomePage/>}/>
        <Route path="/menu" element={<MenuPage/>}/>
        <Route path="/koty/:slug" element={<CatRoute/>}/>
        <Route path="/admin" element={<AdminPage/>}/>
        <Route path="*" element={<NotFoundPage/>}/>
      </Routes>
    </>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AppRoutes/>
    </BrowserRouter>
  </React.StrictMode>,
)
