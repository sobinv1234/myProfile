import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IntersectionObserverDirective } from '../../directives/intersection-observer.directive';
import { 
  faHtml5, faCss3Alt, faJs, faReact, faAngular, 
  faSass, faBootstrap, faGitAlt, faFigma 
} from '@fortawesome/free-brands-svg-icons';
import { faDatabase, faPalette, faMobile } from '@fortawesome/free-solid-svg-icons';

interface Skill {
  name: string;
  icon: any;
  category: string;
}

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, IntersectionObserverDirective],
  templateUrl: './skills.html',
  styleUrls: ['./skills.scss']
})
export class SkillsComponent {
  isVisible = false;
  categories = ['Frontend', 'Tools & Technologies'];

  skills: Skill[] = [
    { name: 'Angular', icon: faAngular, category: 'Frontend' },
    { name: 'React', icon: faReact, category: 'Frontend' },
    { name: 'JavaScript (ES6+)', icon: faJs, category: 'Frontend' },
    { name: 'TypeScript', icon: faJs, category: 'Frontend' },
    { name: 'HTML5', icon: faHtml5, category: 'Frontend' },
    { name: 'CSS3 / Sass', icon: faCss3Alt, category: 'Frontend' },
    { name: 'Bootstrap', icon: faBootstrap, category: 'Frontend' },
    { name: 'Git', icon: faGitAlt, category: 'Tools & Technologies' },
    { name: 'Webpack', icon: faGitAlt, category: 'Tools & Technologies' },
    { name: 'CI/CD', icon: faGitAlt, category: 'Tools & Technologies' },
    { name: 'Figma', icon: faFigma, category: 'Tools & Technologies' },
    { name: 'Web Performance', icon: faMobile, category: 'Tools & Technologies' },
    { name: 'Accessibility', icon: faPalette, category: 'Tools & Technologies' },
    { name: 'RESTful APIs', icon: faDatabase, category: 'Tools & Technologies' }
  ];

  getSkillsByCategory(category: string): Skill[] {
    return this.skills.filter(skill => skill.category === category);
  }

  onSectionVisible() {
    this.isVisible = true;
  }
}
