import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-update-profile',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './update-profile.component.html',
  styleUrl: './update-profile.component.scss'
})
export class UpdateProfileComponent {
  updateProfileForm: FormGroup;
  fb = inject(FormBuilder);
  
  constructor() {
    this.updateProfileForm = this.fb.group({
      'image':              ['', [Validators.required]],
      'name':               ['', [Validators.required]],
      'surname':               ['', [Validators.required]],
      'phone':         ['', [Validators.required]],
      'email':       ['', [Validators.required]],
    });
  }

  updateProfile(): void {
    console.log(this.updateProfileForm.value);
  }
}
