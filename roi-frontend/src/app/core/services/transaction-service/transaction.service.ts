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
    return  this.httpClient.get<any>(this.apiURL+'transactions/get/transactions', {headers} ).pipe(
      tap(response =>{
        if (response.transactions) console.log(response.transactions);
    }));
  }
  getTransaction(id: string): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return  this.httpClient.get<any>(`${this.apiURL}transactions/get/${id}`, {headers} ).pipe(
      tap(response =>{
        if (response.transaction) console.log(response.transaction);
    }));
  }

  registerTransaction(transaction: object ): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return  this.httpClient.post<any>(this.apiURL+'transactions/register', transaction , {headers} ).pipe(
      tap(response =>{
        if (response.message) console.log(response.message);
    }));
  }

  updateTransaction(transaction: object, id: string ): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return  this.httpClient.put<any>(`${this.apiURL}transactions/update/${id}`, transaction , {headers} ).pipe(
      tap(response =>{
        if (response.message) console.log(response.message);
    }));
  }
}
