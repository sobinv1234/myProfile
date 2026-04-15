import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, timer } from 'rxjs';
import { delay, finalize } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoadingStateService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private minimumLoadingTime = 500; // ms

  isLoading$: Observable<boolean> = this.loadingSubject.asObservable();

  startLoading(): void {
    this.loadingSubject.next(true);
  }

  stopLoading(): void {
    timer(this.minimumLoadingTime).pipe(
      finalize(() => this.loadingSubject.next(false))
    ).subscribe();
  }
}