import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './landing.html',
  styleUrl: './landing.css'
})
export class LandingComponent {
  constructor(private router: Router) {}
  goLogin()    { this.router.navigate(['/login']); }
  goRegistro() { this.router.navigate(['/registro']); }
}
