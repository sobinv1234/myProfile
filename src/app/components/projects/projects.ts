import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { faLink } from '@fortawesome/free-solid-svg-icons';
import { IntersectionObserverDirective } from '../../directives/intersection-observer.directive';
import { ImageOptimizationService } from '../../services/image-optimization.service';

interface Project {
  title: string;
  description: string;
  technologies: string[];
  role: string;
  myDuties: string;
  imageUrl?: string;
  githubUrl?: string;
  liveUrl?: string;
  imageLoaded?: boolean;
  isVisible?: boolean;
}

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, IntersectionObserverDirective],
  templateUrl: './projects.html',
  styleUrls: ['./projects.scss']
})
export class ProjectsComponent {
  faGithub = faGithub;
  faLink = faLink;

  projects: Project[] = [
    {
      title: 'Enterprise Content Management System',
      description: 'An enterprise content management system enhanced and modernized to improve usability, performance, and scalability.',
      myDuties: 'Led and contributed to the migration of the application from Angular v10 to v17, including upgrading dependencies and resolving compatibility issues. Beyond migration, worked on developing new features, refactoring legacy code, improving UI/UX, integrating ADF v7, and optimizing overall application performance and stability. Collaborated with cross-functional teams to ensure a smooth transition and continuous delivery of enhancements.',
      technologies: ['Angular', 'TypeScript', 'ADF v7', 'Git'],
      role: 'Role: Technical Lead',
      imageUrl: 'aviva.png',
      imageLoaded: true,
      isVisible: true
    },
    {
      title: 'Digital Factory Operation System',
      description: 'Digital factory operation system is an adaptive and responsive web application developed in Angular framework. The purpose of the web application is to monitor the efficiency, speed and performance of the lines.',
      myDuties: 'Contributed to the end-to-end front-end development, including building scalable UI components, integrating APIs, optimizing performance, and ensuring responsiveness across devices. Collaborated closely with backend teams to deliver a reliable, high-performance system used in operational environments.',
      technologies: ['Angular', 'MSAL 2.0', 'Docker', 'PowerBI Integration'],
      role: 'Role: Technical Lead',
      imageUrl: 'unilever.png',
      imageLoaded: true,
      isVisible: true
    },
    {
      title: 'Line Rejection Dashboard',
      description: 'Line Rejection Dashboard is a responsive web application developing in ReactJS. The purpose of the web application is to monitor and estimate the waste from each lines in a factory.',
      myDuties: 'Developed responsive UI components in React, integrated APIs for real-time data visualization, optimized application performance, and collaborated with backend teams to ensure accurate and reliable data flow.',
      technologies: ['ReactJS'],
      role: 'Role: Frontend Developer',
      imageUrl: 'unilever.png',
      imageLoaded: true,
      isVisible: true
    }
  ];

  constructor(private imageOptimizationService: ImageOptimizationService) { }

  onImageLoad(project: Project) {
    project.imageLoaded = true;
  }

  getImageSources(project: Project) {
    if (!project.imageUrl) return [];
    const image = this.imageOptimizationService.getResponsiveImage(project.imageUrl);
    return image.sources;
  }

  getImageSrcset(project: Project) {
    if (!project.imageUrl) return '';
    return this.imageOptimizationService.getSrcset(project.imageUrl);
  }

  getImagePlaceholder(project: Project) {
    if (!project.imageUrl) return '';
    return this.imageOptimizationService.getPlaceholderUrl(project.imageUrl);
  }
}
