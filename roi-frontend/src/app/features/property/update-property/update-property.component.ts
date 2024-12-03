import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { PropertyService } from '../../../core/services/property-service/property.service';

@Component({
  selector: 'app-update-property',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './update-property.component.html',
  styleUrl: './update-property.component.scss'
})
export class UpdatePropertyComponent {
  updatePropertyForm: FormGroup;
  fb = inject(FormBuilder);

  constructor(private propertyService: PropertyService, private router: Router) {
    this.updatePropertyForm = this.fb.group({
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

  updateProperty(): void {
    this.propertyService.updateProperty( this.updatePropertyForm.value, 'id' ).subscribe({
      next: () => this.router.navigate(['/property-list']),
      error: (err) => console.log('Error al agregar propiedad', err)
    })
  }
}
