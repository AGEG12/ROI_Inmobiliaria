import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { PropertyService } from '../../../core/services/property-service/property.service';

@Component({
  selector: 'app-add-property',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './add-property.component.html',
  styleUrl: './add-property.component.scss'
})
export class AddPropertyComponent {
  addPropertyForm: FormGroup;
  fb = inject(FormBuilder);
  selectedDeal: string | null = null;

  imagesPreview: string[] = []; 
  selectedImages: File[] = [];
  
  constructor(private propertyService: PropertyService, private router: Router) {
    this.addPropertyForm = this.fb.group({
      'title':               ['', [Validators.required]],
      'description':         ['', [Validators.required]],
      'type_property':       ['', [Validators.required]],
      'land_measurements':   ['', [Validators.required]],
      'social_classification_area': ['', [Validators.required]],
      'status':              ['', [Validators.required]],
      'deal':                ['', [Validators.required]],
      'payment_periodicity': ['', [Validators.required]],
      'sales_price':         ['', [Validators.required]],
      'rental_price':        ['', [Validators.required]],
      'state':               ['', [Validators.required]],
      'city':                ['', [Validators.required]],
      'zip_code':            ['', [Validators.required]],
      'settlement':          ['', [Validators.required]],
      'references':          ['', [Validators.required]],
      'constructed_meters':  ['', [Validators.required]],
      'number_bedrooms':     ['', [Validators.required]],
      'number_bathrooms':     ['', [Validators.required]],
      'cistern_capacity':    ['', [Validators.required]],
      'garage_description':  ['', [Validators.required]],
      'additional_notes':    ['', [Validators.required]],
      'percentage_sale':     ['', [Validators.required]],
      'percentage_rent':     ['', [Validators.required]],
      'amount_sale':         ['', [Validators.required]],
      'amount_rent':         ['', [Validators.required]],
      'notes':               ['', [Validators.required]],
    });
  }

  onImagesSelected(event: any): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) {
      return;
    }
    this.imagesPreview = [];
    this.selectedImages = Array.from(input.files);

    this.selectedImages.forEach((file) => {
      if (!file.type.startsWith('image/')) {
        alert(`El archivo ${file.name} no es una imagen. Será ignorado.`);
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          this.imagesPreview.push(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    });
  }

  onChangedDeal(): void {
    this.selectedDeal = this.addPropertyForm.get('deal')?.value;
  }

  addProperty(): void {
    const formData = new FormData();
    Object.keys(this.addPropertyForm.controls).forEach((key) => {
      formData.append( key , this.addPropertyForm.get(key)?.value );
    });
    this.selectedImages.forEach((image) => {
      formData.append('images', image);
    });

    this.propertyService.addProperty(formData).subscribe({
      next: () => this.router.navigate(['/property-list']),
      error: (err) => console.log('Error al agregar propiedad', err)
    })
  }

}
