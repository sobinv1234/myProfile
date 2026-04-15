import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading-indicator',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="loading" [class.full-page]="fullPage" role="progressbar" aria-label="Loading content">
      <div class="loading__spinner"></div>
      <p class="loading__text" *ngIf="text">{{text}}</p>
    </div>
  `,
  styles: [`
    .loading {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 2rem;
      
      &.full-page {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(255, 255, 255, 0.9);
        z-index: 1000;
      }

      &__spinner {
        width: 40px;
        height: 40px;
        border: 3px solid #f3f3f3;
        border-top: 3px solid #4a90e2;
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }

      &__text {
        margin-top: 1rem;
        color: #4a5568;
        font-size: 0.9rem;
      }
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `]
})
export class LoadingIndicatorComponent {
  @Input() text?: string;
  @Input() fullPage = false;
}