import { useEffect, useState } from 'react'

// Crossfades through hero background images and pauses for hover or reduced motion.
function HeroSlider({ images = [] }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )
  const hasMultipleImages = images.length > 1

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const updatePreference = () => setReducedMotion(mediaQuery.matches)
    updatePreference()
    mediaQuery.addEventListener('change', updatePreference)
    return () => mediaQuery.removeEventListener('change', updatePreference)
  }, [])

  useEffect(() => {
    if (!hasMultipleImages || paused || reducedMotion) return undefined

    const intervalId = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % images.length)
    }, 5000)

    return () => window.clearInterval(intervalId)
  }, [hasMultipleImages, images.length, paused, reducedMotion])

  if (images.length === 0) return null

  const showImage = (index) => {
    setActiveIndex((index + images.length) % images.length)
  }

  return (
    <div
      aria-label="University highlights"
      className="absolute inset-0 overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false)
      }}
      role="region"
    >
      {images.map((image, index) => (
        <img
          alt={image.alt}
          aria-hidden={index !== activeIndex}
          className={`absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-1000 motion-reduce:transition-none ${
            index === activeIndex ? 'opacity-100' : 'opacity-0'
          }`}
          key={`${image.src}-${index}`}
          loading={index === 0 ? 'eager' : 'lazy'}
          src={image.src}
        />
      ))}

      {hasMultipleImages ? (
        <>
          <button
            aria-label="Show previous background image"
            className="absolute left-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/70 bg-brand-dark/40 text-white transition hover:bg-white hover:text-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:left-6"
            onClick={() => showImage(activeIndex - 1)}
            type="button"
          >
            <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
              <path d="m15 18-6-6 6-6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
          </button>
          <button
            aria-label="Show next background image"
            className="absolute right-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/70 bg-brand-dark/40 text-white transition hover:bg-white hover:text-brand-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:right-6"
            onClick={() => showImage(activeIndex + 1)}
            type="button"
          >
            <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
              <path d="m9 18 6-6-6-6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
          </button>
          <div aria-label="Choose background image" className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2" role="group">
            {images.map((image, index) => (
              <button
                aria-current={index === activeIndex ? 'true' : undefined}
                aria-label={`Show image ${index + 1}: ${image.alt}`}
                className={`h-2.5 rounded-full border border-white transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
                  index === activeIndex ? 'w-7 bg-white' : 'w-2.5 bg-white/40 hover:bg-white/80'
                }`}
                key={`${image.src}-indicator-${index}`}
                onClick={() => showImage(index)}
                type="button"
              />
            ))}
          </div>
        </>
      ) : null}
    </div>
  )
}

export default HeroSlider
