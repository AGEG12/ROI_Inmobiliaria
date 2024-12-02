import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-register-transaction',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register-transaction.component.html',
  styleUrl: './register-transaction.component.scss'
})
export class RegisterTransactionComponent {
  registerTransactionForm: FormGroup;
  fb = inject(FormBuilder);
  
  constructor() {
    this.registerTransactionForm = this.fb.group({
      'deal':                 ['', [Validators.required]],
      'payment_periodicity':  ['', [Validators.required]],
      'amount':               ['', [Validators.required]],
      'commission':           ['', [Validators.required]],
      'date':                 ['', [Validators.required]],
    });
  }

  registerTransaction(): void {
    console.log(this.registerTransactionForm.value);
  }
}
