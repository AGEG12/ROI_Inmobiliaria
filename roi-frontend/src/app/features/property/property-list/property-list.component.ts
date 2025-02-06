import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { PropertyService } from '../../../core/services/property-service/property.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-property-list',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './property-list.component.html',
  styleUrl: './property-list.component.scss'
})
export class PropertyListComponent implements OnInit{
  properties: any;
  uploadsUrl = 'http://localhost:3000/uploads/property_images/';

  constructor(private propertyService: PropertyService, private router: Router) {}

  ngOnInit(): void {
    this.getProperties();
  }

  formatCurrencyMXN(value: number): string {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(value);
  }

  getProperties():void {
    this.propertyService.getProperties().subscribe({
      next: (data) => {
        this.properties = data;
      },
      error: (err) => console.log('Error al obtener propiedades', err)
    })
  }
  
}
