import { Component, Input } from '@angular/core';

interface PerformanceMetrics {
  fcp: number | null;
  lcp: number | null;
  fid: number | null;
  cls: number | null;
  ttfb: number | null;
}

@Component({
  selector: 'app-performance-metrics',
  template: '',
  styles: [`
    .metrics-container {
      display: grid;
      gap: 1rem;
      padding: 1rem;
    }
    .metric-item {
      padding: 0.5rem;
      border-radius: 4px;
      background-color: #f0f0f0;
    }
    .good {
      background-color: #e6ffe6;
    }
  `]
})
export class PerformanceMetricsComponent {
  @Input() metrics: PerformanceMetrics | null = null;
}