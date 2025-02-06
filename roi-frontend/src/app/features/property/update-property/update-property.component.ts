import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { PropertyService } from '../../../core/services/property-service/property.service';

@Component({
  selector: 'app-update-property',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './update-property.component.html',
  styleUrl: './update-property.component.scss'
})
export class UpdatePropertyComponent implements OnInit {
  updatePropertyForm: FormGroup;
  fb = inject(FormBuilder);

  property: any;
  propertyId: string | null = null;
  selectedDeal: string | null = null;

  constructor(private propertyService: PropertyService, private router: Router, private route: ActivatedRoute) {
    this.updatePropertyForm = this.fb.group({
      'title': ['', [Validators.required]],
      'description': ['', [Validators.required]],
      'type_property': ['', [Validators.required]],
      'land_measurements': ['', [Validators.required]],
      'social_classification_area': ['', [Validators.required]],
      'status': ['', [Validators.required]],
      'deal': ['', [Validators.required]],
      'payment_periodicity': ['', [Validators.required]],
      'sales_price': ['', [Validators.required]],
      'rental_price': ['', [Validators.required]],
      'state': ['', [Validators.required]],
      'city': ['', [Validators.required]],
      'zip_code': ['', [Validators.required]],
      'settlement': ['', [Validators.required]],
      'references': ['', [Validators.required]],
      'constructed_meters': ['', [Validators.required]],
      'number_bedrooms': ['', [Validators.required]],
      'number_bathrooms': ['', [Validators.required]],
      'cistern_capacity': ['', [Validators.required]],
      'garage_description': ['', [Validators.required]],
      'additional_notes': ['', [Validators.required]],
      'percentage_sale': ['', [Validators.required]],
      'percentage_rent': ['', [Validators.required]],
      'amount_sale': ['', [Validators.required]],
      'amount_rent': ['', [Validators.required]],
      'notes': ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.getProperty();
  }

  getProperty(): void {
    this.propertyId = this.route.snapshot.paramMap.get('id');
    if (this.propertyId) {
      this.propertyService.getProperty(this.propertyId).subscribe({
        next: (data) => {
          this.property = data.property;
          this.selectedDeal = this.property.offer.deal;
          this.updatePropertyForm.patchValue({
            'title': this.property.title || '',
            'description': this.property.description || '',
            'type_property': this.property.type_property || '',
            'land_measurements': this.property.land_measurements || '',
            'social_classification_area': this.property.social_classification_area || '',
            'status': this.property.status || '',
            'deal': this.property.offer.deal || '',
            'payment_periodicity': this.property.offer.payment_periodicity || '',
            'sales_price': this.property.offer.sales_price || '',
            'rental_price': this.property.offer.rental_price || '',
            'state': this.property.location.state || '',
            'city': this.property.location.city || '',
            'zip_code': this.property.location.zip_code || '',
            'settlement': this.property.location.settlement || '',
            'references': this.property.location.references || '',
            'constructed_meters': this.property.features.constructed_meters || '',
            'number_bedrooms': this.property.features.number_bedrooms || '',
            'number_bathrooms': this.property.features.number_bathrooms || '',
            'cistern_capacity': this.property.features.cistern_capacity || '',
            'garage_description': this.property.features.garage_description || '',
            'additional_notes': this.property.features.additional_notes || '',
            'percentage_sale': this.property.agreed_commission.percentage_sale || '',
            'percentage_rent': this.property.agreed_commission.percentage_rent || '',
            'amount_sale': this.property.agreed_commission.amount_sale || '',
            'amount_rent': this.property.agreed_commission.amount_rent || '',
            'notes': this.property.agreed_commission.notes || '',
          });
        },
        error: (err) => console.log('Error al obtener la propiedad', err)
      })
    }
  }

  onChangedDeal(): void {
    this.selectedDeal = this.updatePropertyForm.get('deal')?.value;
  }

  updateProperty(): void {
    if (this.propertyId) {
      this.propertyService.updateProperty(this.updatePropertyForm.value, this.propertyId).subscribe({
        next: () => this.router.navigate(['/view-property', this.propertyId]),
        error: (err) => console.log('Error al agregar propiedad', err)
      })
    }
  }
}
