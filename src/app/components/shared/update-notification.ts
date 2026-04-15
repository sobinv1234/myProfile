import { Component } from '@angular/core';
import { AsyncPipe, NgIf } from '@angular/common';
import { Observable } from 'rxjs';
import { PwaUpdateService } from '../../services/pwa-update.service';

@Component({
  selector: 'app-update-notification',
  standalone: true,
  imports: [AsyncPipe, NgIf],
  template: `
    <div *ngIf="updateAvailable$ | async" class="update-notification">
      <span>A new version is available!</span>
      <button (click)="updateApp()">Update Now</button>
    </div>
  `,
  styles: [`
    .update-notification {
      position: fixed;
      bottom: 20px;
      right: 20px;
      padding: 1rem;
      background-color: #fff;
      box-shadow: 0 2px 4px rgba(0,0,0,0.2);
      border-radius: 4px;
      display: flex;
      gap: 1rem;
      align-items: center;
    }
    button {
      padding: 0.5rem 1rem;
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      &:hover {
        background-color: #0056b3;
      }
    }
  `]
})
export class UpdateNotificationComponent {
  updateAvailable$: Observable<boolean>;

  constructor(private pwaUpdateService: PwaUpdateService) {
    this.updateAvailable$ = this.pwaUpdateService.updateAvailable$;
  }

  updateApp(): void {
    this.pwaUpdateService.updateApplication();
  }
}