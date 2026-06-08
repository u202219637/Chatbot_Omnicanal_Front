import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { NavbarComponent } from '../shared/navbar/navbar';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-escalaciones',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './escalaciones.html',
  styleUrl: './escalaciones.css'
})
export class EscalacionesComponent implements OnInit {

  escalaciones: any[] = [
    { id: 'ESC-2025-00125', clienteNombre: 'María González',  tema: 'Laptops',     descripcion: 'Compatibilidad de RAM',       prioridad: 'ALTA',  asesorNombre: 'Andrés Castro',  estado: 'EN_REVISION',  ultimaActualizacion: 'Hoy, 10:24 AM' },
    { id: 'ESC-2025-00124', clienteNombre: 'José Carmona',    tema: 'Periféricos', descripcion: 'Teclados mecánicos',          prioridad: 'MEDIA', asesorNombre: 'Laura Ramírez',  estado: 'PENDIENTE',    ultimaActualizacion: 'Hoy, 09:15 AM' },
    { id: 'ESC-2025-00123', clienteNombre: 'Vanessa Pérez',   tema: 'Stock',       descripcion: 'Disponibilidad de laptop',    prioridad: 'ALTA',  asesorNombre: 'Andrés Castro',  estado: 'EN_REVISION',  ultimaActualizacion: 'Ayer, 04:42 PM' },
    { id: 'ESC-2025-00122', clienteNombre: 'Ricardo Torres',  tema: 'Garantía',    descripcion: 'Extensión de garantía',       prioridad: 'BAJA',  asesorNombre: 'Ana Salazar',    estado: 'PENDIENTE',    ultimaActualizacion: 'Ayer, 02:11 PM' },
    { id: 'ESC-2025-00121', clienteNombre: 'Luis Martínez',   tema: 'Laptops',     descripcion: 'Recomendación de equipo',     prioridad: 'MEDIA', asesorNombre: 'Laura Ramírez',  estado: 'EN_ESPERA',    ultimaActualizacion: 'Ayer, 11:08 AM' },
    { id: 'ESC-2025-00120', clienteNombre: 'Sofía Ortega',    tema: 'Periféricos', descripcion: 'Mouse inalámbrico',           prioridad: 'BAJA',  asesorNombre: 'Ana Salazar',    estado: 'RESUELTO',     ultimaActualizacion: 'Ayer, 09:30 AM' }
  ];

  escalacionesFiltradas: any[] = [];
  filtroEstado    = '';
  filtroPrioridad = '';
  filtroBuscar    = '';
  cargando        = false;

  constructor(private http: HttpClient, public auth: AuthService) {}

  ngOnInit() { this.cargar(); }

  cargar() {
    this.escalacionesFiltradas = [...this.escalaciones];
    // TODO: reemplazar con GET /escalaciones cuando el backend esté listo
  }

  aplicarFiltros() {
    this.escalacionesFiltradas = this.escalaciones.filter(e => {
      const okEstado    = !this.filtroEstado    || e.estado    === this.filtroEstado;
      const okPrioridad = !this.filtroPrioridad || e.prioridad === this.filtroPrioridad;
      const q = this.filtroBuscar.toLowerCase();
      const okBuscar = !q
        || e.clienteNombre.toLowerCase().includes(q)
        || e.tema.toLowerCase().includes(q)
        || e.id.toLowerCase().includes(q);
      return okEstado && okPrioridad && okBuscar;
    });
  }

  seleccionar(e: any) { console.log('Escalación:', e.id); }

  countEstado(estado: string)   { return this.escalaciones.filter(e => e.estado    === estado).length; }
  countPrioridad(p: string)     { return this.escalaciones.filter(e => e.prioridad === p).length; }
}
