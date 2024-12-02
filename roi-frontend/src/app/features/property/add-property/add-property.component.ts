import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-property',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './add-property.component.html',
  styleUrl: './add-property.component.scss'
})
export class AddPropertyComponent {
  addPropertyForm: FormGroup;
  fb = inject(FormBuilder);
  
  constructor() {
    this.addPropertyForm = this.fb.group({
      'images':              ['', [Validators.required]],
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

  addProperty(): void {
    console.log(this.addPropertyForm.value);
  }

}
