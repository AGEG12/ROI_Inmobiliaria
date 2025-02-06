import { Component, OnInit } from '@angular/core';
import { AdvisorService } from '../../../core/services/advisor-service/advisor.service';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-view-profile',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './view-profile.component.html',
  styleUrl: './view-profile.component.scss'
})
export class ViewProfileComponent implements OnInit {
  user: any;
  admin: any;
  imageUrl: string | undefined;
  uploadsUrl = 'http://localhost:3000/uploads/profile_pictures/';
  constructor(private advisorService: AdvisorService, private router: Router) { }

  ngOnInit(): void {
    this.getUser();
  }
  
  getUser(): void {
    this.advisorService.getUser().subscribe({
      next: (data) => {
        this.user = data.user;
        this.imageUrl = this.user.profile_picture ? this.uploadsUrl+this.user.profile_picture : 'assets/resources/unknown_user.png';
        this.getAdmin();
      },
      error: (err) => console.log('Error al obtener usuario', err)
    });
  }

  getAdmin(): void {
    if (this.user) {
      this.advisorService.getUserById(this.user.fk_admin).subscribe({
        next: (data) => {
          this.admin = data.user;
        },
        error: (err) => console.log('Error al obtener admin', err)
      });
    }
  }

  deleteProfilePicture(): void {
    this.advisorService.deleteProfilePicture().subscribe({
      next: () => {
        this.getUser();
      },
      error: (err) => console.log('Error al eliminar imagen del perfil', err)
    });
  }
}
