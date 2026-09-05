import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import MenuPage from './MenuPage.jsx'

const isMenuPage = new URLSearchParams(window.location.search).get('page') === 'menu'
const Page = isMenuPage ? MenuPage : App
document.title = isMenuPage ? 'Menu | Niebieski Kot' : 'Niebieski Kot | Kocia kawiarnia w Opolu'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Page />
  </React.StrictMode>,
)
