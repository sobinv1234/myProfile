import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBriefcase } from '@fortawesome/free-solid-svg-icons';

interface Experience {
  company: string;
  period: string;
  role: string;
  description: string[];
}

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './experience.html',
  styleUrls: ['./experience.scss']
})
export class ExperienceComponent {
  faBriefcase = faBriefcase;
  experiences: Experience[] = [
    {
      company: 'Tata Consultancy Services (TCS)',
      period: 'Mar 2023 – 15 Jan 2026',
      role: 'Assistant Consultant - Frontend Developer',
      description: [
        'Led Aviva migration from Angular 10 to Angular 17, integrating ADF v7 and resolving compatibility issues',
        'Fixed 50+ compatibility bugs and reduced defects by ~30% through structured regression testing',
        'Developed enterprise-grade UI modules for Unilever API integrations',
        'Improved page load performance by ~20% via code refactoring and payload optimization'
      ]
    },
    {
      company: 'Centelon',
      period: 'Sep 2022 – Feb 2023',
      role: 'Consultant - Frontend Developer',
      description: [
        'Built web product features using Angular 12 with improved scalability',
        'Delivered feature work and critical bug fixes in coordination with backend and QA teams',
        'Contributed to sprint planning and code reviews to accelerate releases'
      ]
    },
    {
      company: 'Hintt',
      period: 'Jul 2020 – Apr 2022',
      role: 'Consultant, UI Developer',
      description: [
        'Converted PSD designs to responsive HTML5 using Bootstrap',
        'Built web apps with React and Angular and modularized code for maintainability',
        'Coordinated with WordPress teams to resolve style inconsistencies'
      ]
    },
    {
      company: 'Bizessence Consultancy Services / Vandalay Business Solutions',
      period: '2016 – 2020',
      role: 'Frontend Developer',
      description: [
        'PSD to HTML conversion and responsive conversions using Bootstrap',
        'Template and app design, maintenance, and updates',
        'Worked on accessibility and cross-browser compatibility'
      ]
    }
  ];
}
