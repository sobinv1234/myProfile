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
  name = 'Sobin Varghese';
  role = 'Frontend Developer';
  summary = 'Results-driven Software Developer with over 7 years of experience in front-end development, specializing in React, Angular, JavaScript, and HTML5/CSS3. Proven ability to design, prototype (using Figma), and deliver responsive, high-performance web applications for large clients like Unilever and Aviva. Adept at coordinating with backend teams, bug-fixing, and upgrading legacy systems.';
}
