import { Component, OnInit } from '@angular/core';
import { AdvisorService } from '../../../core/services/advisor-service/advisor.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  user: any;
  propertyStats: any;
  transactionStats: any;
  imageUrl: string | undefined;
  uploadsUrl = 'http://localhost:3000/uploads/profile_pictures/';

  constructor(private advisorService: AdvisorService) { }

  ngOnInit(): void {
    this.getStats();
  }

  formatCurrencyMXN(value: number): string {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(value);
  }

  getStats(): void {
    this.advisorService.getStats().subscribe({
      next: (data) => {
        this.user = data.user;
        this.propertyStats = data.propertyStats;
        this.transactionStats = data.transactionStats;
        this.imageUrl = this.user?.profile_picture ? this.uploadsUrl + this.user.profile_picture : 'assets/resources/unknown_user.png';
      },
      error: (err) => console.log('Error al obtener stats', err)
    });
  }
}
