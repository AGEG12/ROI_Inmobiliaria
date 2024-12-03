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
/*   images: File[] = []; */
  
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

/*   onImagesSelected(event: any): void {
    this.images = Array.from(event.target['files'][0]);
  } */

  addProperty(): void {
    const formData = new FormData();
    Object.keys(this.addPropertyForm.controls).forEach((key) => {
      console.log(key);
      formData.append( key , this.addPropertyForm.get(key)?.value );
    });
    console.log(formData);
/*     this.images.forEach((image) => {
      formData.append('images', image);
    }); */

    this.propertyService.addProperty(formData).subscribe({
      next: () => this.router.navigate(['/property-list']),
      error: (err) => console.log('Error al agregar propiedad', err)
    })
  }

}
