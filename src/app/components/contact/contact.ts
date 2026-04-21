import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { faPhone, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { faLinkedin } from '@fortawesome/free-brands-svg-icons';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, FormsModule, ReactiveFormsModule],
  templateUrl: './contact.html',
  styleUrls: ['./contact.scss']
})
export class ContactComponent implements OnInit {
  faPhone = faPhone;
  faEnvelope = faEnvelope;
  faLinkedin = faLinkedin;
  isSubmitting = false;
  submitSuccess = false;
  submitError = false;
  submitErrorMessage = '';

  contactInfo = {
    phone: '7721087835',
    email: 'sobinv71@gmail.com',
    address: 'Flat 12, Pinelands Court, Coxford Road, Southampton SO165SS, United Kingdom',
    linkedin: 'https://www.linkedin.com/in/sobin-varghese-843b9592/'
  };

  contactForm: FormGroup;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngOnInit() {
    this.contactForm.valueChanges.subscribe(() => {
      if (this.submitSuccess) this.submitSuccess = false;
      if (this.submitError) {
        this.submitError = false;
        this.submitErrorMessage = '';
      }
    });
  }

  getErrorMessage(controlName: string): string {
    const control = this.contactForm.get(controlName);
    if (!control?.errors || !control.touched) return '';

    if (control.errors['required']) {
      return `${controlName.charAt(0).toUpperCase() + controlName.slice(1)} is required`;
    }
    if (control.errors['email']) {
      return 'Please enter a valid email address';
    }
    if (control.errors['minlength']) {
      const requiredLength = control.errors['minlength'].requiredLength;
      return `${controlName.charAt(0).toUpperCase() + controlName.slice(1)} must be at least ${requiredLength} characters`;
    }
    return '';
  }

  onSubmit() {
    if (this.contactForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      this.submitError = false;

      const formData = {
        name: this.contactForm.get('name')?.value || '',
        email: this.contactForm.get('email')?.value || '',
        message: this.contactForm.get('message')?.value || ''
      };

      this.http.post('/api/contact', formData).subscribe({
        next: (response: any) => {
          if (response.success) {
            this.isSubmitting = false;
            this.submitSuccess = true;
            this.submitError = false;
            this.submitErrorMessage = '';
            this.contactForm.reset();
            setTimeout(() => {
            this.submitSuccess = true;
            }, 1000);
            // Reset success message after 5 seconds
            setTimeout(() => {
              this.submitSuccess = false;
            }, 6000);
          } else {
            throw new Error(response.error || 'Form submission failed');
          }
        },
        error: (error: any) => {
          console.error('Error submitting form:', error);
          this.isSubmitting = false;
          this.submitError = true;
          this.submitErrorMessage =
            error?.error?.error || error?.message ||
            'Error sending message. Please try again or contact me directly.';
        }
      });
    } else {
      // Mark all fields as touched to trigger validation messages
      Object.keys(this.contactForm.controls).forEach(key => {
        const control = this.contactForm.get(key);
        control?.markAsTouched();
      });
    }
  }
}
