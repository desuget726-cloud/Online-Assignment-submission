import PublicNavbar from '../components/PublicNavbar.jsx'
import TopBar from '../components/TopBar.jsx'
import HomeFooter from '../components/home/HomeFooter.jsx'

function PublicLayout({ activePage, children, onNavigate }) {
  return (
    <div className="flex min-h-screen flex-col bg-brand-cream">
      <TopBar onNavigate={onNavigate} />
      <PublicNavbar activePage={activePage} onNavigate={onNavigate} />
      <div className="flex-1">{children}</div>
      <HomeFooter onNavigate={onNavigate} />
    </div>
  )
}

export default PublicLayout
