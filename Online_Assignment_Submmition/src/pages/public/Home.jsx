import AnnouncementsSection from '../../components/home/AnnouncementsSection.jsx'
import BackToTop from '../../components/home/BackToTop.jsx'
import HeroSection from '../../components/home/HeroSection.jsx'
import Reveal from '../../components/home/Reveal.jsx'
import { homeContent } from '../../data/homeContent.js'

function Home({ onNavigate }) {
  return (
    <main>
      <HeroSection onNavigate={onNavigate} />
      <section aria-labelledby="home-overview-title" className="bg-brand-cream py-12 sm:py-16">
        <Reveal className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-brand-royal">A connected academic workspace</p>
          <h2 className="mt-3 text-3xl font-bold text-brand-navy" id="home-overview-title">
            Assignment work, from submission to feedback
          </h2>
          <p className="mt-4 leading-7 text-brand-dark">{homeContent.about.paragraphs[0]}</p>
          <button
            className="mt-5 rounded-lg font-semibold text-brand-royal hover:text-brand-navy focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-royal"
            onClick={() => onNavigate('about')}
            type="button"
          >
            About the system <span aria-hidden="true">→</span>
          </button>
        </Reveal>
      </section>
      <AnnouncementsSection />
      <BackToTop />
    </main>
  )
}

export default Home
