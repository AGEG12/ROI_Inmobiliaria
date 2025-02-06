import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PropertyService } from '../../../core/services/property-service/property.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TransactionService } from '../../../core/services/transaction-service/transaction.service';

@Component({
  selector: 'app-register-transaction',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './register-transaction.component.html',
  styleUrl: './register-transaction.component.scss'
})
export class RegisterTransactionComponent implements OnInit {
  property: any;
  propertyId: string | null = null;
  selectedDeal: string | null = null;

  registerTransactionForm: FormGroup;
  fb = inject(FormBuilder);

  constructor(
    private propertyService: PropertyService,
    private transactionService: TransactionService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.registerTransactionForm = this.fb.group({
      'deal': ['', [Validators.required]],
      'payment_periodicity': ['', [Validators.required]],
      'amount': ['', [Validators.required]],
      'commission': ['', [Validators.required]],
      'date': ['', [Validators.required]],
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
          let amount;
          let commission;
          this.property = data.property;
          this.selectedDeal = this.property.offer.deal;
          if (this.selectedDeal === "Venta") {
            amount = this.property.offer.sales_price;
            commission = this.property.agreed_commission.amount_sale ? this.property.agreed_commission.amount_sale : amount * (this.property.agreed_commission.percentage_sale / 100);
          } else if (this.selectedDeal === "Renta") {
            amount = this.property.offer.rental_price;
            commission = this.property.agreed_commission.amount_rent ? this.property.agreed_commission.amount_rent : amount * (this.property.agreed_commission.percentage_rent / 100);
          } else {
            amount = "";
          }
          this.registerTransactionForm.patchValue({
            'deal': this.property.offer.deal || '',
            'payment_periodicity': this.property.offer.payment_periodicity || '',
            'amount': amount,
            'commission': commission,
          });
        },
        error: (err) => console.log('Error al obtener la propiedad', err)
      })
    }
  }

  onChangedDeal(): void {
    let amount;
    let commission;
    this.selectedDeal = this.registerTransactionForm.get('deal')?.value;
    if (this.selectedDeal === "Venta") {
      amount = this.property.offer.sales_price;
      commission = this.property.agreed_commission.amount_sale ? this.property.agreed_commission.amount_sale : amount * (this.property.agreed_commission.percentage_sale / 100);
    } else if (this.selectedDeal === "Renta") {
      amount = this.property.offer.rental_price;
      commission = this.property.agreed_commission.amount_rent ? this.property.agreed_commission.amount_rent : amount * (this.property.agreed_commission.percentage_rent / 100);
    } else {
      amount = "";
    }
    this.registerTransactionForm.patchValue({'amount': amount, 'commission': commission});
  }

  registerTransaction(): void {
    if (this.propertyId) {
      this.transactionService.registerTransaction(this.registerTransactionForm.value, this.propertyId).subscribe({
        next: (data) => this.router.navigate(['/view-transaction', data.transactionId]),
        error: (err) => console.log('Error al registrar transacción', err)
      })
    }
  }
}
