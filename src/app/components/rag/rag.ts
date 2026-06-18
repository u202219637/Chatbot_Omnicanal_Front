import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NavbarComponent } from '../shared/navbar/navbar';
import { environment } from '../../../environments/environment';


@Component({
  selector: 'app-rag',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './rag.html',
  styleUrl: './rag.css'
})
export class RagComponent implements OnInit {

  pasos = [
    { icono: '⬆️', nombre: 'Subir archivos',      descripcion: 'Agrega documentos en PDF, DOCX o TXT.', estado: 'Listo para subir', estadoClass: 'badge-blue'   },
    { icono: '📄', nombre: 'Extraer contenido',    descripcion: 'Extraemos el texto y metadatos relevantes.', estado: 'Procesando',    estadoClass: 'badge-purple' },
    { icono: '🗂️', nombre: 'Organizar información',descripcion: 'Dividimos y estructuramos en bloques.',   estado: 'En progreso',    estadoClass: 'badge-orange' },
    { icono: '🧠', nombre: 'Generar contexto IA',  descripcion: 'Creamos contexto para búsquedas inteligentes.', estado: 'En progreso', estadoClass: 'badge-orange' },
    { icono: '✅', nombre: 'Estado procesado',     descripcion: 'Tu información está lista para consultarse.', estado: 'Completado',   estadoClass: 'badge-green'  }
  ];

  estadisticas = { documentos: 0, bloques: 0, tokens: '0K', completado: 0 };

  documentos: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get<any[]>(`${environment.apiUrl}/admin/documentos`).subscribe({
      next: (d) => {
        this.documentos = d;
        this.estadisticas.documentos = d.length;
      },
      error: () => {}
    });
  }

  onDrop(e: DragEvent) {
    e.preventDefault();
    const files = e.dataTransfer?.files;
    if (files) this.procesarArchivos(files);
  }

  onFileSelect(e: any) {
    this.procesarArchivos(e.target.files);
  }

  procesarArchivos(files: FileList) {
    const token = localStorage.getItem('token') || '';

    Array.from(files).forEach(file => {
      const formData = new FormData();
      formData.append('archivo', file);
      formData.append('titulo', file.name.replace(/\.[^/.]+$/, ''));

      this.http.post(`${environment.apiUrl}/admin/documentos/upload`,
        formData, {
          headers: { Authorization: `Bearer ${token}` }
        }).subscribe({
        next: () => {
          console.log(`✅ ${file.name} subido`);
          this.ngOnInit();
        },
        error: (err) => {
          console.error(`❌ Error ${file.name}:`, err);
          alert(`Error subiendo ${file.name}: ${err.status}`);
        }
      });
    });
  }

  reindexando = false;
  resultadoReindex = '';

  reindexar() {
    this.reindexando = true;
    this.resultadoReindex = '';
    this.http.post(`${environment.apiUrl}/admin/documentos/reindexar`, {}, { responseType: 'text' })
      .subscribe({
        next: (res: string) => {
          this.resultadoReindex = res;
          this.reindexando = false;
          // Refresca las estadísticas después de reindexar
          this.http.get<any[]>(`${environment.apiUrl}/admin/documentos`).subscribe({
            next: (d) => { this.documentos = d; this.estadisticas.documentos = d.length; },
            error: () => {}
          });
        },
        error: () => {
          this.resultadoReindex = 'Error al reindexar. Revisa la consola del backend.';
          this.reindexando = false;
        }
      });
  }
}
