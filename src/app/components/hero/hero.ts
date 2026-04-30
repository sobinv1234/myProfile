import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, RouterModule],
  templateUrl: './hero.html',
  styleUrls: ['./hero.scss']
})
export class HeroComponent {
  name = 'Sobin Varghese,';
  role = 'Frontend Developer';
  quote = 'As a developer, I specialize in creating modular and scalable front-end architectures that deliver seamless user experiences. I focus on writing clean, efficient, and maintainable code while continuously learning and adapting to modern web technologies.';
  summary = 'I specialize in React, Angular, JavaScript, and HTML5/CSS3, with experience in designing and prototyping using Figma. I’ve delivered responsive, high-performance applications for enterprise-level projects, collaborating closely with backend teams to debug issues, optimize performance, and modernize legacy systems.';
}
