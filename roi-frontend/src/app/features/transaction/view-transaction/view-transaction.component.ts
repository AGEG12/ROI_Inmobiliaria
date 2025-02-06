import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TransactionService } from '../../../core/services/transaction-service/transaction.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-view-transaction',
  standalone: true,
  imports: [RouterLink, CommonModule, ReactiveFormsModule],
  templateUrl: './view-transaction.component.html',
  styleUrl: './view-transaction.component.scss'
})
export class ViewTransactionComponent {
  transaction: any;
  transactionId: string | null = null;

  uploadDocumentForm: FormGroup;
  fb = inject(FormBuilder);
  selectedFile: any | null = null;

  pdfUrl: string = '';
  sanitizedPdfUrl: SafeResourceUrl | null = null;
  uploadsUrl = 'http://localhost:3000/uploads/transaction_files/';


  constructor(private transactionService: TransactionService, private router: Router, private route: ActivatedRoute, private sanitizer: DomSanitizer) {
    this.uploadDocumentForm = this.fb.group({ 'name': ['', [Validators.required]] });
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
        },
        error: (err) => console.log('Error al obtener la transacción', err)
      })
    }
  }

  formatCurrencyMXN(value: number): string {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(value);
  }

  deleteTransaction(): void {
    if (this.transactionId) {
      this.transactionService.deleteTransaction(this.transactionId).subscribe({
        next: () => {
          this.router.navigate(['/transaction-list']);
        },
        error: (err) => console.log('Error al eliminar transacción', err)
      })
    }
  }

  deleteDocument(filename: string): void {
    if (this.transactionId) {
      this.transactionService.deleteDocument(this.transactionId, filename).subscribe({
        next: () => {
          this.getTransaction();
        },
        error: (err) => console.log('Error al eliminar documento', err)
      })
    }
  }

  onFileSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    console.log();
    if (fileInput.files && fileInput.files.length > 0) {
      const file = fileInput.files[0];
      /*       if (!file.type.startsWith('image/')) {
              alert('Por favor selecciona un archivo de imagen.');
              fileInput.value = '';
              return;
            } */

      this.selectedFile = file;
    }
  }

  uploadDocument(): void {
    const formData = new FormData();
    console.log(this.selectedFile);
    formData.append('name', this.uploadDocumentForm.get('name')?.value);
    formData.append('document', this.selectedFile);
    if (this.transactionId) {
      this.transactionService.uploadDocument(formData, this.transactionId).subscribe({
        next: () => this.getTransaction(),
        error: (err) => console.log('Error al agregar documento', err)
      })
    }
  }

  showDocument(filename: string): void {
    this.pdfUrl = this.uploadsUrl + filename;
    this.sanitizedPdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.pdfUrl);
    console.log(this.sanitizedPdfUrl);
  }

}
