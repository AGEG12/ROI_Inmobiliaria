import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { AuthService } from '../auth-service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdvisorService {
  private apiURL = 'http://localhost:3000/api/v1/';
  constructor(private httpClient: HttpClient, private authService: AuthService) { }

  getUser(): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return  this.httpClient.get<any>(this.apiURL+'users/get', {headers} ).pipe(
      tap(response =>{
        if (response.user) console.log(response.user);
    }));
  }

  updateProfile(user: object ): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return  this.httpClient.put<any>(this.apiURL+'users/update-profile', user , {headers} ).pipe(
      tap(response =>{
        if (response.message) console.log(response.message);
    }));
  }

  changePassword(credentials: object ): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return  this.httpClient.patch<any>(this.apiURL+'users/change-password', credentials , {headers} ).pipe(
      tap(response =>{
        if (response.message) console.log(response.message);
    }));
  }

  deleteProfilePicture(): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return  this.httpClient.delete<any>(this.apiURL+'users/delete-profile-picture', {headers} ).pipe(
      tap(response =>{
        if (response.message) console.log(response.message);
    }));
  }
}
