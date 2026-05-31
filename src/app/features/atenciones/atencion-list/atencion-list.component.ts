import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AtencionService } from '../../../core/api/atencion.service';
import { AtencionResponse } from '../../../core/models/atencion.model';

@Component({
  selector: 'app-atencion-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './atencion-list.component.html',
  styleUrl: './atencion-list.component.css'
})
export class AtencionListComponent implements OnInit {
  private atencionService = inject(AtencionService);
  private router = inject(Router);

  readonly atenciones = this.atencionService.atenciones;
  readonly loading = this.atencionService.loading;

  ngOnInit(): void {
    this.atencionService.loadEnCurso();
  }

  onViewAtencion(id: string): void {
    this.router.navigate(['/atenciones', id]);
  }

  onCerrarAtencion(atencion: AtencionResponse): void {
    if (confirm('¿Cerrar esta atención?')) {
      this.atencionService.cerrar(atencion.id).subscribe({
        next: () => {
          this.atencionService.loadEnCurso();
        }
      });
    }
  }

  formatDateTime(isoString: string): string {
    if (!isoString) return '-';
    const date = new Date(isoString);
    return date.toLocaleString('es-PE', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getDuracion(fechaInicio: string): string {
    const inicio = new Date(fechaInicio);
    const ahora = new Date();
    const diffMs = ahora.getTime() - inicio.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const hours = Math.floor(diffMins / 60);
    const mins = diffMins % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  }
}