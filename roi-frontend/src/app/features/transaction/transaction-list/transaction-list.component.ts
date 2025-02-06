import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TransactionService } from '../../../core/services/transaction-service/transaction.service';

@Component({
  selector: 'app-transaction-list',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './transaction-list.component.html',
  styleUrl: './transaction-list.component.scss'
})
export class TransactionListComponent {
  transactions: any;

  constructor(private transactionService: TransactionService, private router: Router) { }

  ngOnInit(): void {
    this.getTransactions();
  }

  getTransactions(): void {
    this.transactionService.getTransactions().subscribe({
      next: (data) => {
        this.transactions = data;
      },
      error: (err) => console.log('Error al obtener transacciones', err)
    })
  }

  formatCurrencyMXN(value: number): string {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(value);
  }

  deleteTransaction(transactionId: string): void {
    this.transactionService.deleteTransaction(transactionId).subscribe({
      next: () => {
        this.getTransactions();
      },
      error: (err) => console.log('Error al eliminar transacción', err)
    })

  }

}
