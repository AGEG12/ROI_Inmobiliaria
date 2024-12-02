import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-update-transaction',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './update-transaction.component.html',
  styleUrl: './update-transaction.component.scss'
})
export class UpdateTransactionComponent {
  updateTransactionForm: FormGroup;
  fb = inject(FormBuilder);
  
  constructor() {
    this.updateTransactionForm = this.fb.group({
      'deal':                 ['', [Validators.required]],
      'payment_periodicity':  ['', [Validators.required]],
      'amount':               ['', [Validators.required]],
      'commission':           ['', [Validators.required]],
      'date':                 ['', [Validators.required]],
    });
  }

  updateTransaction(): void {
    console.log(this.updateTransactionForm.value);
  }
}
