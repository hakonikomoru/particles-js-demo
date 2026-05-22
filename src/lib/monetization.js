const defaultAdsenseClient = 'ca-pub-9485679688870074'
const defaultAnalyticsId = 'G-V5Y6V8DRXT'

const config = {
  analyticsId: import.meta.env.VITE_GA_MEASUREMENT_ID || defaultAnalyticsId,
  adsenseClient: import.meta.env.VITE_ADSENSE_CLIENT || defaultAdsenseClient,
  adsenseSlots: {
    top: import.meta.env.VITE_ADSENSE_SLOT_TOP,
    'in-feed': import.meta.env.VITE_ADSENSE_SLOT_IN_FEED,
  },
}

let analyticsInitialized = false

function appendScript(attributes, id) {
  if (attributes.src) {
    const existingScript = document.querySelector(`script[src="${attributes.src}"]`)

    if (existingScript) {
      return existingScript
    }
  }

  if (id) {
    const existingScript = document.getElementById(id)

    if (existingScript) {
      return existingScript
    }
  }

  const script = document.createElement('script')

  if (id) {
    script.id = id
  }

  for (const [key, value] of Object.entries(attributes)) {
    if (value === undefined || value === null || value === false) {
      continue
    }

    script.setAttribute(key, value === true ? '' : value)
  }

  document.head.append(script)
  return script
}

function setupAnalytics() {
  const { analyticsId } = config

  if (!analyticsId || analyticsInitialized) {
    return
  }

  appendScript(
    {
      async: true,
      src: `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(analyticsId)}`,
    },
    'google-analytics-script',
  )

  window.dataLayer = window.dataLayer || []

  if (typeof window.gtag !== 'function') {
    window.gtag = function gtag() {
      window.dataLayer.push(arguments)
    }
  }

  window.gtag('js', new Date())
  window.gtag('config', analyticsId)
  analyticsInitialized = true
}

function createAdSlot(unitName, slotId) {
  const ad = document.createElement('ins')
  ad.className = 'adsbygoogle'
  ad.style.display = 'block'
  ad.dataset.adClient = config.adsenseClient
  ad.dataset.adSlot = slotId
  ad.dataset.adFormat = 'auto'
  ad.dataset.fullWidthResponsive = 'true'

  return ad
}

function setupAds() {
  const { adsenseClient } = config

  if (!adsenseClient) {
    document.querySelectorAll('[data-ad-unit]').forEach((slot) => slot.remove())
    return
  }

  appendScript(
    {
      async: true,
      src: `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(
        adsenseClient,
      )}`,
      crossorigin: 'anonymous',
    },
    'google-adsense-script',
  )

  document.querySelectorAll('[data-ad-unit]').forEach((slot) => {
    const unitName = slot.dataset.adUnit
    const slotId = config.adsenseSlots[unitName]

    if (!slotId) {
      slot.remove()
      return
    }

    slot.append(createAdSlot(unitName, slotId))
    window.adsbygoogle = window.adsbygoogle || []
    window.adsbygoogle.push({})
  })
}

export function setupMonetization() {
  setupAnalytics()
  setupAds()
}
