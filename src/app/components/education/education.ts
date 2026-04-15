import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faGraduationCap } from '@fortawesome/free-solid-svg-icons';

interface Education {
  degree: string;
  institution: string;
  year: string;
}

@Component({
  selector: 'app-education',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './education.html',
  styleUrls: ['./education.scss']
})
export class EducationComponent {
  faGraduationCap = faGraduationCap;
  educationList: Education[] = [
    {
      degree: 'Diploma in Computer Science and Engineering',
      institution: 'Government Polytechnic College',
      year: 'Jun 2010 – Mar 2013'
    },
    {
      degree: 'Higher Secondary / A-Levels',
      institution: 'St Berchmans Higher Secondary School',
      year: 'Jun 2008 – Apr 2010'
    },
    {
      degree: 'SSLC / GCSE',
      institution: 'St Berchmans Higher Secondary School',
      year: 'May 2008'
    }
  ];
}
