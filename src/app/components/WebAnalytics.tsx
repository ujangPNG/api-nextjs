// app/components/WebAnalytics.tsx
"use client";

import { useReportWebVitals } from "next/web-vitals";
import GA4 from "./GA4"; // Komponen pageview tracking yang sudah kita buat

declare global {
  interface Window {
    gtag: (
      command: 'event',
      action: string,
      params: {
        event_category?: string;
        event_label?: string;
        value?: number;
        non_interaction?: boolean;
        [key: string]: any;
      }
    ) => void;
  }
}

export default function WebAnalytics() {
  // Setup hook untuk mengirim data Web Vitals
  useReportWebVitals((metric) => {
    // Pastikan gtag tersedia
    if (typeof window.gtag === 'function') {
      window.gtag('event', metric.name, {
        event_category: 'Web Vitals',
        value: Math.round(
          metric.name === "CLS" ? metric.value * 1000 : metric.value
        ),
        event_label: metric.id,
        non_interaction: true,
      });
    }
  });

  // Render komponen untuk page view tracking
  return <GA4 />;
}