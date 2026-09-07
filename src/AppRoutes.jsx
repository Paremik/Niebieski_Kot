import React, {useEffect} from 'react';
import {Navigate, Route, Routes, useLocation, useParams} from 'react-router-dom';
import HomePage from './pages/HomePage.jsx';
import MenuPage from './pages/MenuPage.jsx';
import CatProfilePage from './pages/CatProfilePage.jsx';
import AdminPage from '../AdminPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import {catProfiles} from './data/catProfiles.js';
import {useLanguage} from './i18n/LanguageProvider.jsx';

export const isCatSlug = slug => typeof slug === 'string' && Object.hasOwn(catProfiles, slug);
export const normalizePath = path => path.replace(/\/+$/, '') || '/';

function DocumentMeta() {
  const {pathname, hash} = useLocation();
  const {language, tr} = useLanguage();
  useEffect(() => {
    const path = normalizePath(pathname);
    const slug = path.match(/^\/koty\/([^/]+)$/)?.[1];
    const cat = isCatSlug(slug) ? catProfiles[slug] : null;
    const titles = { '/': tr('Kocia kawiarnia w Opolu'), '/menu': tr('Jedzenie i napoje'), '/admin': tr('Panel administracyjny') };
    const title = cat ? cat.name : titles[path] || tr('Tej strony jeszcze nie ma.');
    const description = cat ? tr(cat.seoDescription) : tr('Projekt koncepcyjny — adres, kontakt i bohaterowie są demonstracyjne.');
    const set = (selector, attr, value) => document.querySelector(selector)?.setAttribute(attr, value);
    document.title = title + ' | Niebieski Kot';
    set('meta[name="description"]', 'content', description);
    set('link[rel="canonical"]', 'href', 'https://niebieski-kot.vercel.app' + path);
    for (const kind of ['og', 'twitter']) {
      const attr = kind === 'og' ? 'property' : 'name';
      set('meta[' + attr + '="' + kind + ':title"]', 'content', document.title);
      set('meta[' + attr + '="' + kind + ':description"]', 'content', description);
    }
    set('meta[property="og:url"]', 'content', 'https://niebieski-kot.vercel.app' + path);
    set('meta[property="og:locale"]', 'content', {pl:'pl_PL', ru:'ru_RU', en:'en_GB'}[language]);
    set('meta[name="robots"]', 'content', path === '/admin' || (!cat && !titles[path]) ? 'noindex, follow' : 'index, follow');
  }, [pathname, language, tr]);
  useEffect(() => {
    let id;
    try { id = decodeURIComponent(hash.slice(1)); } catch { id = ''; }
    if (id) document.getElementById(id)?.scrollIntoView({behavior:'instant'});
    else window.scrollTo({top:0, behavior:'instant'});
  }, [pathname, hash]);
  return null;
}

function CatRoute() {
  const {slug} = useParams();
  return isCatSlug(slug) ? <CatProfilePage slug={slug} /> : <NotFoundPage />;
}

export default function AppRoutes() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  if (normalizePath(location.pathname) === '/') {
    if (params.get('page') === 'menu') return <Navigate to="/menu" replace />;
    if (params.has('cat')) return <Navigate to={'/koty/' + encodeURIComponent(params.get('cat'))} replace />;
  }
  return <>
    <DocumentMeta />
    <Routes>
      <Route caseSensitive path="/" element={<HomePage />} />
      <Route caseSensitive path="/menu" element={<MenuPage />} />
      <Route caseSensitive path="/koty/:slug" element={<CatRoute />} />
      <Route caseSensitive path="/admin" element={<AdminPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  </>;
}
