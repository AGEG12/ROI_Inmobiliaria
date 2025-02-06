import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss'
})
export class ChangePasswordComponent {
  changePasswordForm: FormGroup;
  fb = inject(FormBuilder);

  constructor() {
    this.changePasswordForm = this.fb.group({
      'currentPassword': ['', [Validators.required]],
      'newPassword': ['', [Validators.required]],
      'confirmPassword': ['', [Validators.required]],
    });
  }

  changePassword(): void {
    console.log(this.changePasswordForm.value);
  }
}
