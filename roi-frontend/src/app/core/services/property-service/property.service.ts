import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { AuthService } from '../auth-service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class PropertyService {
  private apiURL = 'http://localhost:3000/api/v1/';
  constructor(private httpClient: HttpClient, private authService: AuthService) { }

  getProperties(): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.httpClient.get<any>(this.apiURL + 'properties/get/properties', { headers });
  }
  getProperty(id: string): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.httpClient.get<any>(`${this.apiURL}properties/get/${id}`, { headers });
  }

  addProperty(property: FormData): Observable<any> {
    /*     property.forEach((value, key) => {
          console.log(`${key}:`, value);
        }); */
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.httpClient.post<any>(this.apiURL + 'properties/add', property, { headers }).pipe(
      tap(response => {
        if (response.message) console.log(response.message);
      }));
  }

  updateProperty(property: object, id: string): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.httpClient.put<any>(`${this.apiURL}properties/update/${id}`, { property }, { headers }).pipe(
      tap(response => {
        if (response.message) console.log(response.message);
      }));
  }

  deleteProperty(propertyId: string): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.httpClient.delete<any>(`${this.apiURL}properties/delete/${propertyId}`, { headers });
  }

  addImages(images: FormData, id: string): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.httpClient.post<any>(`${this.apiURL}properties/add-images/${id}`, images, { headers });
  }

  deleteImage(propertyId: string, imageName: string): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.httpClient.delete<any>(`${this.apiURL}properties/delete-image/${propertyId}/image/${imageName}`, { headers });
  }

}
