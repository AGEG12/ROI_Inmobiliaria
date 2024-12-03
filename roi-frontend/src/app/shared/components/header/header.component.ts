import { Component } from '@angular/core';
import { AuthService } from '../../../core/services/auth-service/auth.service';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  constructor (private authService: AuthService) {};
  
  logout(): void {
    this.authService.logout();
  }
}
