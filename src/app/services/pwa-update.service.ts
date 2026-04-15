import { Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PwaUpdateService {
  constructor(private swUpdate: SwUpdate) {}

  get updateAvailable$(): Observable<boolean> {
    return this.swUpdate.versionUpdates.pipe(
      map(event => event.type === 'VERSION_READY')
    );
  }

  async updateApplication(): Promise<void> {
    if (await this.swUpdate.activateUpdate()) {
      document.location.reload();
    }
  }

  async checkForUpdate(): Promise<void> {
    try {
      if (this.swUpdate.isEnabled) {
        await this.swUpdate.checkForUpdate();
      }
    } catch (e) {
      // SwUpdate may not be available in some environments (e.g. dev server)
      console.debug('PWA checkForUpdate failed', e);
    }
  }
}