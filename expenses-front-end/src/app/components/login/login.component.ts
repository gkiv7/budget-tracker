import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service'; // Εισαγωγή του AuthService
import { Router, RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [ReactiveFormsModule, CommonModule, RouterModule]
})

export class LoginComponent implements OnInit {
  loginForm!: FormGroup;  // Εδώ προσθέτουμε το '!' για να επισημάνουμε ότι θα ανατεθεί αργότερα.
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Δημιουργία του formGroup με τις κατάλληλες επικυρώσεις
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]], // Επικύρωση email
      password: ['', [Validators.required, Validators.minLength(6)]] // Επικύρωση password
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    const { email, password } = this.loginForm.value;
    this.authService.login(email, password).subscribe({
      next: (response) => {
        this.authService.saveToken(response.token)
        const userId = this.authService.getUserIdFromToken()
        console.log('Login successful:', response);
        this.router.navigate([`/expenses/${userId}`]); // Ανακατεύθυνση στη σελίδα των εξόδων
      },
      error: (error) => {
        console.error('Login error:', error);
        this.errorMessage = 'Invalid email or password'; // Μήνυμα λάθους
      }
    });
  }
}

