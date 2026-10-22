import Button from '../Button.jsx'
import sealImage from '../../assets/logo.jpg'
import { heroImages, homeContent } from '../../data/homeContent.js'
import HeroSlider from './HeroSlider.jsx'
import Reveal from './Reveal.jsx'

// Introduces the university system and links visitors to its main actions.
function HeroSection({ onNavigate }) {
  return (
    <section
      aria-labelledby="home-title"
      className="relative isolate flex min-h-[80vh] scroll-mt-20 items-center overflow-hidden bg-brand-dark text-white"
      id="home"
    >
      <HeroSlider images={heroImages} />
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/25 to-transparent" />
      <div aria-hidden="true" className="absolute bottom-0 inset-x-0 h-1/3 bg-gradient-to-t from-black/40 to-transparent" />
      <div className="pointer-events-none relative z-10 mx-auto grid w-full max-w-7xl gap-12 px-4 pb-24 pt-16 sm:px-6 sm:pb-28 sm:pt-20 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:px-8">
        <Reveal className="relative z-10">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-gold">
            {homeContent.hero.eyebrow}
          </p>
          <h1 className="mt-5 max-w-3xl text-4xl font-bold leading-tight text-white drop-shadow-lg sm:text-5xl lg:text-6xl" id="home-title">
            {homeContent.hero.title}
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-white drop-shadow-md sm:text-lg">
            {homeContent.hero.description}
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button
              className="pointer-events-auto px-6 py-3"
              onClick={() => onNavigate('login')}
              size="lg"
              variant="accent"
            >
              Get Started
            </Button>
            <button
              className="pointer-events-auto rounded-lg border border-white bg-transparent px-6 py-3 text-base font-medium text-white transition hover:bg-white hover:text-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              onClick={() => onNavigate('about')}
              type="button"
            >
              Learn More
            </button>
          </div>
        </Reveal>
        <Reveal className="relative z-10 hidden justify-center sm:flex">
          <div className="flex h-64 w-64 items-center justify-center rounded-full border border-brand-gold/50 p-8 shadow-[0_0_0_24px_rgba(212,175,55,0.08)] sm:h-80 sm:w-80">
            <img
              alt="Mekdela Amba University emblem"
              className="h-full w-full rounded-full object-cover object-center ring-4 ring-white/30"
              src={sealImage}
            />
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export default HeroSection
