import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PropertyService } from '../../../core/services/property-service/property.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-view-property',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './view-property.component.html',
  styleUrl: './view-property.component.scss'
})
export class ViewPropertyComponent implements OnInit {
  property: any;
  propertyId: string | null = null;
  transactionId: any;
  uploadsUrl = 'http://localhost:3000/uploads/property_images/';

  imagesPreview: string[] = [];
  selectedImages: File[] = [];

  constructor(private propertyService: PropertyService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.getProperty();
  }

  getProperty(): void {
    this.propertyId = this.route.snapshot.paramMap.get('id');
    if (this.propertyId) {
      this.propertyService.getProperty(this.propertyId).subscribe({
        next: (data) => {
          this.property = data.property;
          this.transactionId = data.transactionId;
        },
        error: (err) => console.log('Error al obtener la propiedad', err)
      })
    }
  }

  formatCurrencyMXN(value: number): string {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(value);
  }

  deleteProperty(): void {
    if (this.propertyId) {
      this.propertyService.deleteProperty(this.propertyId).subscribe({
        next: () => {
          this.router.navigate(['/property-list']);
        },
        error: (err) => console.log('Error al eliminar propiedad', err)
      })
    }
  }

  deleteImage(imageName: string): void {
    if (this.propertyId) {
      this.propertyService.deleteImage(this.propertyId, imageName).subscribe({
        next: () => {
          this.getProperty();
        },
        error: (err) => console.log('Error al eliminar imagen', err)
      })
    }
  }

  onImagesSelected(event: any): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) {
      return;
    }
    this.imagesPreview = [];
    this.selectedImages = Array.from(input.files);

    this.selectedImages.forEach((file) => {
      if (!file.type.startsWith('image/')) {
        alert(`El archivo ${file.name} no es una imagen. Será ignorado.`);
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          this.imagesPreview.push(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    });
  }

  addImages(): void {
    const formData = new FormData();
    this.selectedImages.forEach((image) => {
      formData.append('images', image);
    });

    this.imagesPreview = [];
    this.selectedImages = [];

    if (this.propertyId) {
      this.propertyService.addImages(formData, this.propertyId).subscribe({
        next: () => this.getProperty(),
        error: (err) => console.log('Error al agregar imagenes', err)
      })
    }
  }

}
