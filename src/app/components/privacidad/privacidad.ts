import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../shared/navbar/navbar';

@Component({
  selector: 'app-privacidad',
  standalone: true,
  imports: [RouterModule, NavbarComponent],
  templateUrl: './privacidad.html'
})
export class PrivacidadComponent {}