import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
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
    alert(`${files.length} archivo(s) listos para subir. Conectar a POST /admin/documentos/upload.`);
  }
}
