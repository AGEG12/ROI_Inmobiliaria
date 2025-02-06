import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TransactionService } from '../../../core/services/transaction-service/transaction.service';

@Component({
  selector: 'app-update-transaction',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './update-transaction.component.html',
  styleUrl: './update-transaction.component.scss'
})
export class UpdateTransactionComponent implements OnInit {
  transaction: any;
  transactionId: string | null = null;
  selectedDeal: string | null = null;

  updateTransactionForm: FormGroup;
  fb = inject(FormBuilder);

  constructor(private transactionService: TransactionService, private router: Router, private route: ActivatedRoute) {
    this.updateTransactionForm = this.fb.group({
      'deal': ['', [Validators.required]],
      'payment_periodicity': ['', [Validators.required]],
      'amount': ['', [Validators.required]],
      'commission': ['', [Validators.required]],
      'date': ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.getTransaction();
  }
  getTransaction(): void {
    this.transactionId = this.route.snapshot.paramMap.get('id');
    if (this.transactionId) {
      this.transactionService.getTransaction(this.transactionId).subscribe({
        next: (data) => {
          this.transaction = data.transaction;
          this.selectedDeal = this.transaction.deal;
          this.updateTransactionForm.patchValue({
            'deal': this.transaction.deal || '',
            'payment_periodicity': this.transaction.payment_periodicity || '',
            'amount': this.transaction.amount || '',
            'commission': this.transaction.commission || '',
            'date': this.transaction.date.substr(0, 10) || '',
          });
        },
        error: (err) => console.log('Error al obtener transacción', err)
      });
    }
  }

  onChangedDeal(): void {
    this.selectedDeal = this.updateTransactionForm.get('deal')?.value;
    if (this.selectedDeal === this.transaction.deal) {
      this.updateTransactionForm.patchValue({
        'amount': this.transaction.amount || '',
        'commission': this.transaction.commission || '',
      });
    } else {
      this.updateTransactionForm.patchValue({
        'amount': '',
        'commission': '',
      });
    }
  }

  updateTransaction(): void {
    if (this.transactionId) {
      this.transactionService.updateTransaction(this.updateTransactionForm.value, this.transactionId).subscribe({
        next: (data) => this.router.navigate(['/view-transaction', this.transactionId]),
        error: (err) => console.log('Error al editar transacción', err)
      })
    }
  }
}
