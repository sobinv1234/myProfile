import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LoadingStateService } from './loading-state.service';

export interface TransitionState {
  entering: boolean;
  leaving: boolean;
  direction: 'forward' | 'backward';
}

@Injectable({
  providedIn: 'root'
})
export class RouteTransitionService {
  private transitionSubject = new BehaviorSubject<TransitionState>({
    entering: false,
    leaving: false,
    direction: 'forward'
  });

  transition$ = this.transitionSubject.asObservable();

  constructor(private loadingStateService: LoadingStateService) {}

  startTransition(direction: 'forward' | 'backward' = 'forward') {
    this.loadingStateService.startLoading();
    this.transitionSubject.next({
      entering: false,
      leaving: true,
      direction
    });

    // Simulate minimum transition time
    setTimeout(() => {
      this.transitionSubject.next({
        entering: true,
        leaving: false,
        direction
      });
      this.loadingStateService.stopLoading();
    }, 300);
  }

  completeTransition() {
    this.transitionSubject.next({
      entering: false,
      leaving: false,
      direction: 'forward'
    });
  }
}