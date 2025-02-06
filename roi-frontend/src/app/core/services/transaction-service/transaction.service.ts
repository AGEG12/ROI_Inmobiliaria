import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { AuthService } from '../auth-service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private apiURL = 'http://localhost:3000/api/v1/';
  constructor(private httpClient: HttpClient, private authService: AuthService) { }

  getTransactions(): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return  this.httpClient.get<any>(this.apiURL+'transactions/get/transactions', {headers} );
  }

  getTransaction(id: string): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return  this.httpClient.get<any>(`${this.apiURL}transactions/get/${id}`, {headers} );
  }

  registerTransaction(transaction: object, propertyId: string ): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return  this.httpClient.post<any>(`${this.apiURL}transactions/register/${propertyId}`, {transaction} , {headers} );
  }

  updateTransaction(transaction: object, id: string ): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return  this.httpClient.put<any>(`${this.apiURL}transactions/update/${id}`, {transaction} , {headers} );
  }

  deleteTransaction(transactionId: string): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return  this.httpClient.delete<any>(`${this.apiURL}transactions/delete/${transactionId}`, {headers} );
  }

  uploadDocument(document: FormData, id: string ): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return  this.httpClient.post<any>(`${this.apiURL}transactions/add-document/${id}`, document , {headers} );
  }
  
  deleteDocument(transactionId: string ,filename: string): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return  this.httpClient.delete<any>(`${this.apiURL}transactions/delete-document/${transactionId}/document/${filename}`, {headers} );
  }

}
