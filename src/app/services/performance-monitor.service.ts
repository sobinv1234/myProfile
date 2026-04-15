import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface PerformanceMetrics {
  fcp: number | null; // First Contentful Paint
  lcp: number | null; // Largest Contentful Paint
  fid: number | null; // First Input Delay
  cls: number | null; // Cumulative Layout Shift
  ttfb: number | null; // Time to First Byte
}

@Injectable({
  providedIn: 'root'
})
export class PerformanceMonitorService {
  private metricsSubject = new BehaviorSubject<PerformanceMetrics>({
    fcp: null,
    lcp: null,
    fid: null,
    cls: null,
    ttfb: null
  });

  metrics$ = this.metricsSubject.asObservable();

  constructor() {
    this.initializeMetrics();
  }

  private initializeMetrics(): void {
    if (!window.performance || !window.performance.getEntriesByType) {
      console.warn('Performance API not supported');
      return;
    }

    // First Contentful Paint
    const paint = new PerformanceObserver((observerList) => {
      for (const entry of observerList.getEntries()) {
        if (entry.name === 'first-contentful-paint') {
          this.updateMetric('fcp', entry.startTime);
        }
      }
    });
    // Use buffered:true to capture entries that occurred before observer creation
    paint.observe({ entryTypes: ['paint'], buffered: true });

    // Fallback: read any existing paint entries immediately
    try {
      const paints = performance.getEntriesByType('paint') as PerformanceEntry[];
      for (const p of paints) {
        if (p.name === 'first-contentful-paint') {
          this.updateMetric('fcp', p.startTime);
        }
      }
    } catch (e) {
      // ignore if not supported
    }

    // Largest Contentful Paint
    const lcp = new PerformanceObserver((observerList) => {
      const lastEntry = observerList.getEntries().at(-1);
      if (lastEntry) {
        this.updateMetric('lcp', lastEntry.startTime);
      }
    });
    lcp.observe({ entryTypes: ['largest-contentful-paint'], buffered: true });

    // Fallback for LCP
    try {
      const lcpEntries = performance.getEntriesByType('largest-contentful-paint') as PerformanceEntry[];
      const last = lcpEntries.at(-1);
      if (last) this.updateMetric('lcp', last.startTime);
    } catch (e) {}

    // First Input Delay
    const fid = new PerformanceObserver((observerList) => {
      for (const entry of observerList.getEntries()) {
        const e: any = entry as any;
        if (typeof e.processingStart === 'number') {
          this.updateMetric('fid', e.processingStart - e.startTime);
        }
      }
    });
    // first-input may not be buffered in all browsers, but include buffered:true when available
    try {
      fid.observe({ entryTypes: ['first-input'], buffered: true } as any);
    } catch (e) {
      fid.observe({ entryTypes: ['first-input'] } as any);
    }

    // Cumulative Layout Shift
    let cumulativeLayoutShiftScore = 0;
    const cls = new PerformanceObserver((observerList) => {
      for (const entry of observerList.getEntries()) {
        const e: any = entry as any;
        if (!e.hadRecentInput) {
          cumulativeLayoutShiftScore += (typeof e.value === 'number' ? e.value : 0);
          this.updateMetric('cls', cumulativeLayoutShiftScore);
        }
      }
    });
    cls.observe({ entryTypes: ['layout-shift'], buffered: true });

    // Fallback for CLS: some browsers expose layout-shift entries via getEntriesByType
    try {
      const shifts = performance.getEntriesByType('layout-shift') as any[];
      for (const s of shifts) {
        if (!s.hadRecentInput) {
          cumulativeLayoutShiftScore += (typeof s.value === 'number' ? s.value : 0);
        }
      }
      this.updateMetric('cls', cumulativeLayoutShiftScore);
    } catch (e) {}

    // Time to First Byte
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navigation) {
      this.updateMetric('ttfb', navigation.responseStart - navigation.requestStart);
    }
  }

  private updateMetric(metric: keyof PerformanceMetrics, value: number): void {
    this.metricsSubject.next({
      ...this.metricsSubject.value,
      [metric]: value
    });

    // Log metrics to console in development mode
    if (!document.location.hostname.includes('production')) {
      console.debug(`Performance Metric - ${metric.toUpperCase()}: ${value}ms`);
    }
  }

  getCurrentMetrics(): PerformanceMetrics {
    return this.metricsSubject.value;
  }

  getMetricsReport(): string {
    const metrics = this.getCurrentMetrics();
    return `
Performance Metrics:
- First Contentful Paint: ${metrics.fcp?.toFixed(2) ?? 'N/A'}ms
- Largest Contentful Paint: ${metrics.lcp?.toFixed(2) ?? 'N/A'}ms
- First Input Delay: ${metrics.fid?.toFixed(2) ?? 'N/A'}ms
- Cumulative Layout Shift: ${metrics.cls?.toFixed(3) ?? 'N/A'}
- Time to First Byte: ${metrics.ttfb?.toFixed(2) ?? 'N/A'}ms
    `.trim();
  }
}