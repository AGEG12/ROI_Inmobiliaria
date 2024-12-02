import { Component, inject } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})

export class LoginComponent {
  loginForm: FormGroup;
  fb = inject(FormBuilder);

  constructor(private authService: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      'email': ['', [Validators.required, Validators.email]],
      'password': ['', [Validators.required, Validators.minLength(1)]],
    });
  }

  login(): void {
    this.authService.login(this.loginForm.value.email, this.loginForm.value.password).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: (err) => console.log('Login failed', err)
    })
  }

}
