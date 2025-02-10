// src/app/auth/signup/signup.component.ts
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-signup',
  standalone: true,
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  imports: [ReactiveFormsModule, CommonModule, RouterModule]
  
})
export class SignUpComponent {
  signUpForm: FormGroup;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.signUpForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.signUpForm.valid) {
      const { email, password, confirmPassword } = this.signUpForm.value;

      if (password !== confirmPassword) {
        this.errorMessage = 'Passwords do not match!';
        return;
      }

      console.log('Sending data:', { email, password });

      this.authService.signUp(email, password).pipe().subscribe({
        next: (response) => {
          console.log('SignUp successful:', response);
          this.router.navigate(['/login']);
        },
        error: (error) => {
          console.error('SignUp error:', error);
          this.errorMessage = 'Error signing up. Please try again.';
        }
      });
    }
  }
}
