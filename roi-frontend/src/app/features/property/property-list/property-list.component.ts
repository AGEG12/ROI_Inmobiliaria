import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { PropertyService } from '../../../core/services/property-service/property.service';

@Component({
  selector: 'app-property-list',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './property-list.component.html',
  styleUrl: './property-list.component.scss'
})
export class PropertyListComponent{
  constructor(private propertyService: PropertyService, private router: Router) {}

  updateProperty(): void {
    this.propertyService.getProperties().subscribe({
      next: () => console.log(''),
      error: (err) => console.log('Error al agregar propiedad', err)
    })
  }

}
