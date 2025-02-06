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

  getStats(): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return  this.httpClient.get<any>(this.apiURL+'users/dashboard', {headers} );
  }

  getUser(): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.httpClient.get<any>(this.apiURL+'users/get', {headers} );
  }

  getUserById(userId: string): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.httpClient.get<any>(this.apiURL+'users/get/'+userId, {headers} );
  }

  updateProfile(user: FormData ): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return  this.httpClient.put<any>(this.apiURL+'users/update-profile', user , {headers} );
  }

  changePassword(credentials: object ): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    // Return message
    return  this.httpClient.patch<any>(this.apiURL+'users/change-password', credentials , {headers} );
  }

  deleteProfilePicture(): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    // Return message
    return  this.httpClient.delete<any>(this.apiURL+'users/delete-profile-picture', {headers} );
  }
}
