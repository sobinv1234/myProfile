import { Routes } from '@angular/router';

export const routes: Routes = [
  { 
    path: '', 
    children: [
      {
        path: '',
        loadComponent: () => import('./components/hero/hero').then(m => m.HeroComponent)
      },
      {
        path: 'about',
        loadComponent: () => import('./components/about/about').then(m => m.AboutComponent)
      },
      {
        path: 'experience',
        loadComponent: () => import('./components/experience/experience').then(m => m.ExperienceComponent)
      },
      {
        path: 'education',
        loadComponent: () => import('./components/education/education').then(m => m.EducationComponent)
      },
      {
        path: 'skills',
        loadComponent: () => import('./components/skills/skills').then(m => m.SkillsComponent)
      },
      {
        path: 'projects',
        loadComponent: () => import('./components/projects/projects').then(m => m.ProjectsComponent)
      },
      {
        path: 'contact',
        loadComponent: () => import('./components/contact/contact').then(m => m.ContactComponent)
      }
    ]
  }
];
