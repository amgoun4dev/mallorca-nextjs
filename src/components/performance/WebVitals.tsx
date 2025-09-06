'use client'

import { useReportWebVitals } from 'next/web-vitals'

export function WebVitals() {
  useReportWebVitals((metric) => {
    // Only log in development
    if (process.env.NODE_ENV === 'development') {
      console.log(metric)
    }

    // In production, you could send to analytics
    if (process.env.NODE_ENV === 'production') {
      // Example: Send to Google Analytics
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', metric.name, {
          custom_map: { metric_id: 'web_vitals' },
          value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
          event_category: 'Web Vitals',
          event_label: metric.id,
          non_interaction: true,
        })
      }
    }
  })

  return null
}

// Declare gtag for TypeScript
declare global {
  interface Window {
    gtag?: (...args: any[]) => void
  }
}
