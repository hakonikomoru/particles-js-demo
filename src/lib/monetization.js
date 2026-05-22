const config = {
  analyticsId: import.meta.env.VITE_GA_MEASUREMENT_ID,
  adsenseClient: import.meta.env.VITE_ADSENSE_CLIENT,
  adsenseSlots: {
    top: import.meta.env.VITE_ADSENSE_SLOT_TOP,
    'in-feed': import.meta.env.VITE_ADSENSE_SLOT_IN_FEED,
  },
}

function appendScript(attributes) {
  const script = document.createElement('script')

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

  if (!analyticsId) {
    return
  }

  appendScript({
    async: true,
    src: `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(analyticsId)}`,
  })

  window.dataLayer = window.dataLayer || []

  window.gtag = function gtag() {
    window.dataLayer.push(arguments)
  }

  window.gtag('js', new Date())
  window.gtag('config', analyticsId)
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

  appendScript({
    async: true,
    src: `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(
      adsenseClient,
    )}`,
    crossorigin: 'anonymous',
  })

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
