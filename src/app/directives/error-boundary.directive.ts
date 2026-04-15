import { Directive, ElementRef, Input, OnDestroy, OnInit, Renderer2, ViewContainerRef } from '@angular/core';

interface ErrorState {
  hasError: boolean;
  error: Error | null;
  errorInfo: string;
}

@Directive({
  selector: '[appErrorBoundary]',
  standalone: true
})
export class ErrorBoundaryDirective implements OnInit, OnDestroy {
  @Input() fallbackTemplate?: string;
  
  private errorState: ErrorState = {
    hasError: false,
    error: null,
    errorInfo: ''
  };

  private originalContent: Node[] = [];
  private errorHandler: (event: ErrorEvent | Event) => void;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private viewContainer: ViewContainerRef
  ) {
    this.errorHandler = this.handleError.bind(this);
  }

  ngOnInit() {
    // Store original content
    this.originalContent = Array.from(this.el.nativeElement.childNodes);
    
    // Add error handler
    window.addEventListener('error', this.errorHandler as EventListener);
  }

  ngOnDestroy() {
    window.removeEventListener('error', this.errorHandler as EventListener);
  }

  private handleError(event: ErrorEvent | Event) {
    // Normalize to an Error object where possible
    const err: Error = (event as ErrorEvent).error ?? new Error((event as ErrorEvent).message || 'Unknown error');

    // Check if error occurred in this component's subtree
    if (this.isErrorInSubtree(event)) {
      this.errorState = {
        hasError: true,
        error: err,
        errorInfo: err.stack || ''
      };

      this.showFallback();

      // Log error to monitoring service in production
      if (document.location.hostname.includes('production')) {
        this.logError(err);
      }
    }
  }

  private isErrorInSubtree(eventOrError: ErrorEvent | Event): boolean {
    const target = (eventOrError as any).target || (eventOrError as any).srcElement;
    return !!target && this.el.nativeElement.contains(target);
  }

  private showFallback() {
    // Clear current content
    while (this.el.nativeElement.firstChild) {
      this.el.nativeElement.removeChild(this.el.nativeElement.firstChild);
    }

    // Show fallback UI
    const fallback = this.renderer.createElement('div');
    this.renderer.addClass(fallback, 'error-boundary');

    const content = this.renderer.createElement('div');
    this.renderer.addClass(content, 'error-boundary__content');

    if (this.fallbackTemplate) {
      content.innerHTML = this.fallbackTemplate;
    } else {
      content.innerHTML = `
        <div class="error-boundary__icon">⚠️</div>
        <h3 class="error-boundary__title">Something went wrong</h3>
        <p class="error-boundary__message">Please try refreshing the page</p>
        ${!document.location.hostname.includes('production') ? `
          <details class="error-boundary__details">
            <summary>Error details</summary>
            <pre>${this.errorState.error?.message}\n\n${this.errorState.errorInfo}</pre>
          </details>
        ` : ''}
      `;
    }

    const retryButton = this.renderer.createElement('button');
    this.renderer.addClass(retryButton, 'error-boundary__retry');
    retryButton.textContent = 'Try Again';
    this.renderer.listen(retryButton, 'click', () => this.retry());

    this.renderer.appendChild(content, retryButton);
    this.renderer.appendChild(fallback, content);
    this.renderer.appendChild(this.el.nativeElement, fallback);

    // Add styles
    this.addStyles();
  }

  private retry() {
    this.errorState = {
      hasError: false,
      error: null,
      errorInfo: ''
    };

    // Restore original content
    while (this.el.nativeElement.firstChild) {
      this.el.nativeElement.removeChild(this.el.nativeElement.firstChild);
    }

    this.originalContent.forEach(node => {
      this.renderer.appendChild(this.el.nativeElement, node.cloneNode(true));
    });
  }

  private addStyles() {
    const styles = `
      .error-boundary {
        padding: 2rem;
        text-align: center;
        background: #fff;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      }

      .error-boundary__content {
        max-width: 400px;
        margin: 0 auto;
      }

      .error-boundary__icon {
        font-size: 3rem;
        margin-bottom: 1rem;
      }

      .error-boundary__title {
        color: #2d3748;
        margin: 0 0 0.5rem;
      }

      .error-boundary__message {
        color: #4a5568;
        margin: 0 0 1.5rem;
      }

      .error-boundary__retry {
        background: #4a90e2;
        color: white;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 4px;
        cursor: pointer;
        transition: background-color 0.3s ease;
      }

      .error-boundary__retry:hover {
        background: #357abd;
      }

      .error-boundary__details {
        margin-top: 1rem;
        text-align: left;
      }

      .error-boundary__details summary {
        cursor: pointer;
        color: #4a90e2;
      }

      .error-boundary__details pre {
        background: #f8f9fa;
        padding: 1rem;
        border-radius: 4px;
        overflow-x: auto;
        margin-top: 0.5rem;
      }
    `;

    const styleEl = this.renderer.createElement('style');
    styleEl.textContent = styles;
    this.renderer.appendChild(document.head, styleEl);
  }

  private logError(error: Error) {
    // Implement error logging to your monitoring service
    console.error('[ErrorBoundary]', {
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      url: window.location.href
    });
  }
}