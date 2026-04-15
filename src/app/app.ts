import { Component, HostListener, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule } from '@angular/router';
import { PwaUpdateService } from './services/pwa-update.service';
import { LoadingStateService } from './services/loading-state.service';
import { LoadingIndicatorComponent } from './components/shared/loading-indicator';
import { UpdateNotificationComponent } from './components/shared/update-notification';
import { PerformanceMetricsComponent } from './components/shared/performance-metrics';
import { PerformanceMonitorService } from './services/performance-monitor.service';
import { ErrorBoundaryDirective } from './directives/error-boundary.directive';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterModule,
    LoadingIndicatorComponent,
    UpdateNotificationComponent,
    PerformanceMetricsComponent,
    ErrorBoundaryDirective
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class AppComponent implements OnInit {
  isNavbarFixed = false;
  isMenuOpen = false;
  activeSection = 'hero';

  private pwaUpdateService = inject(PwaUpdateService);
  private performanceMonitorService = inject(PerformanceMonitorService);
  public loadingStateService = inject(LoadingStateService);

  constructor() {
    // Check for updates when the app starts
    this.pwaUpdateService.checkForUpdate();
    
    // Log initial performance metrics after load
    window.addEventListener('load', () => {
      setTimeout(() => {
        console.info('Initial Performance Metrics:', 
          this.performanceMonitorService.getMetricsReport()
        );
      }, 2000);
    });
  }

  ngOnInit() {}

  @HostListener('window:scroll')
  onWindowScroll() {
    this.isNavbarFixed = window.scrollY > 50;
    this.updateActiveSection();
  }

  @HostListener('window:resize')
  onWindowResize() {
    if (window.innerWidth > 768) {
      this.isMenuOpen = false;
    }
  }

  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Escape' && this.isMenuOpen) {
      this.isMenuOpen = false;
    }
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    document.body.style.overflow = this.isMenuOpen ? 'hidden' : '';
  }

  closeMenu() {
    if (this.isMenuOpen) {
      this.isMenuOpen = false;
      document.body.style.overflow = '';
    }
  }

  scrollTo(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      this.activeSection = sectionId;
      if (window.innerWidth <= 768) {
        this.closeMenu();
      }
    }
  }

  private updateActiveSection() {
    const sections = ['hero', 'about', 'experience', 'education', 'skills', 'projects', 'contact'];
    const offset = 100;
    
    for (const section of sections) {
      const element = document.getElementById(section);
      if (element) {
        const rect = element.getBoundingClientRect();
        if (rect.top <= offset && rect.bottom > offset) {
          if (this.activeSection !== section) {
            this.activeSection = section;
            history.replaceState(null, '', `#${section}`);
          }
          break;
        }
      }
    }
  }
}
