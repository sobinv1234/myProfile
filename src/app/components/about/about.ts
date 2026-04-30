import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './about.html',
  styleUrls: ['./about.scss']
})
export class AboutComponent {
  location = 'Southampton, United Kingdom';
  professionalSummary = `Results-driven Software Developer with over 9 years of experience in front-end development, specializing in React, Angular, JavaScript, and HTML5/CSS3. Proven ability to design, prototype (using Figma), and deliver responsive, high-performance web applications for large clients like Unilever and Aviva.`;
  // languages = ['English', 'Malayalam', 'Hindi'];
  coreCompetencies = [
    'React', 'Angular', 'JavaScript (ES6+)', 'TypeScript',
    'HTML5', 'CSS3', 'Sass', 'Bootstrap',
    'Web Performance', 'Accessibility', 'Figma',
    'Git', 'Webpack', 'CI/CD'
  ];
}
