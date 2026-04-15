import { Directive, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';

@Directive({
  selector: '[appIntersectionObserver]',
  standalone: true
})
export class IntersectionObserverDirective implements OnInit, OnDestroy {
  @Input() threshold = 0.1;
  @Input() rootMargin = '0px';
  @Output() intersectionChange = new EventEmitter<boolean>();
  @Output() intersectionOnce = new EventEmitter<void>();

  private observer: IntersectionObserver | null = null;
  private hasIntersected = false;

  constructor(private element: ElementRef) {}

  ngOnInit() {
    this.createObserver();
  }

  ngOnDestroy() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  }

  private createObserver() {
    const options = {
      root: null,
      rootMargin: this.rootMargin,
      threshold: this.threshold
    };

    this.observer = new IntersectionObserver(([entry]) => {
      this.intersectionChange.emit(entry.isIntersecting);
      
      if (entry.isIntersecting && !this.hasIntersected) {
        this.hasIntersected = true;
        this.intersectionOnce.emit();
      }
    }, options);

    this.observer.observe(this.element.nativeElement);
  }
}