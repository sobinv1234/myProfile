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
      title: 'Aviva Angular Upgrade',
      description: 'Led migration of a large enterprise application from Angular v10 to v17, integrated ADF v7, resolved compatibility issues and improved stability.',
      technologies: ['Angular', 'TypeScript', 'ADF v7', 'Git'],
      imageUrl: 'aviva.png', 
      imageLoaded: true,
      isVisible: true
    },
    {
      title: 'Unilever API Integration',
      description: 'Implemented UI modules consuming Unilever’s RESTful APIs, optimised load time via payload reduction and lazy loading, and improved error handling with backend collaboration.',
      technologies: ['Angular', 'TypeScript', 'REST APIs', 'Lazy Loading'],
      imageUrl: 'unilever.png',
      imageLoaded: true,
      isVisible: true
    }
  ];

  constructor(private imageOptimizationService: ImageOptimizationService) {}

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
