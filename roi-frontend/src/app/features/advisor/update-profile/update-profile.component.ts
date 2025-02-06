import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdvisorService } from '../../../core/services/advisor-service/advisor.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-update-profile',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './update-profile.component.html',
  styleUrl: './update-profile.component.scss'
})
export class UpdateProfileComponent implements OnInit {
  updateProfileForm: FormGroup;
  fb = inject(FormBuilder);
  user: any;
  imageUrl: string | undefined;
  uploadsUrl = 'http://localhost:3000/uploads/profile_pictures/';
  imagePreview: string | ArrayBuffer | null = null;
  selectedFile: any | null = null;

  constructor(private advisorService: AdvisorService, private router: Router) {
    this.updateProfileForm = this.fb.group({
      'name': ['', [Validators.required]],
      'surname': ['', [Validators.required]],
      'phone': ['', [Validators.required]],
      'email': ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.getUser();
  }
  getUser() {
    this.advisorService.getUser().subscribe({
      next: (data) => {
        this.user = data.user;
        this.imageUrl = this.user.profile_picture ? this.uploadsUrl + this.user.profile_picture : 'assets/resources/unknown_user.png';
        this.updateProfileForm.patchValue({
          'name': this.user.name || '',
          'surname': this.user.surname || '',
          'phone': this.user.phone || '',
          'email': this.user.email || '',
        });
      },
      error: (err) => console.log('Error al obtener usuario', err)
    });
  }

  onFileSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      const file = fileInput.files[0];

      if (!file.type.startsWith('image/')) {
        alert('Por favor selecciona un archivo de imagen.');
        fileInput.value = '';
        return;
      }

      this.selectedFile = file;

      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  updateProfile(): void {
    const formData = new FormData();
    formData.append('name', this.updateProfileForm.get('name')?.value);
    formData.append('surname', this.updateProfileForm.get('surname')?.value);
    formData.append('phone', this.updateProfileForm.get('phone')?.value);
    formData.append('email', this.updateProfileForm.get('email')?.value);
    formData.append('image', this.selectedFile);
    this.advisorService.updateProfile(formData).subscribe({
      next: (data) => this.router.navigate(['/view-profile']),
      error: (err) => console.log('Error al editar perfil', err)
    })
  }
}
