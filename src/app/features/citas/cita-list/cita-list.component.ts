import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CitaService } from '../../../core/api/cita.service';
import { CitaResponse, EstadoCita } from '../../../core/models/cita.model';

@Component({
  selector: 'app-cita-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cita-list.component.html',
  styleUrl: './cita-list.component.css'
})
export class CitaListComponent implements OnInit {
  private citaService = inject(CitaService);
  private router = inject(Router);

  readonly citas = this.citaService.citas;
  readonly loading = this.citaService.loading;
  readonly totalElements = this.citaService.totalElements;
  readonly currentPage = this.citaService.currentPage;

  showEstadoModal = signal(false);
  selectedCita = signal<CitaResponse | null>(null);

  estadoOptions: { value: EstadoCita; label: string; color: string }[] = [
    { value: 'PROGRAMADA', label: 'Programada', color: 'bg-blue-100 text-blue-700' },
    { value: 'CONFIRMADA', label: 'Confirmada', color: 'bg-cyan-100 text-cyan-700' },
    { value: 'EN_CURSO', label: 'En Curso', color: 'bg-amber-100 text-amber-700' },
    { value: 'ATENDIDA', label: 'Atendida', color: 'bg-green-100 text-green-700' },
    { value: 'CANCELADA', label: 'Cancelada', color: 'bg-red-100 text-red-700' },
    { value: 'NO_ASISTIO', label: 'No Asistio', color: 'bg-gray-100 text-gray-700' }
  ];

  ngOnInit(): void {
    this.citaService.loadCitas();
  }

  onPageChange(page: number): void {
    this.citaService.loadCitas(page);
  }

  onNewCita(): void {
    this.router.navigate(['/citas/nuevo']);
  }

  onViewCita(id: string): void {
    this.router.navigate(['/citas', id]);
  }

  onEditCita(id: string): void {
    this.router.navigate(['/citas', id, 'editar']);
  }

  onDeleteCita(cita: CitaResponse): void {
    if (confirm(`¿Cancelar la cita del paciente ${cita.pacienteId}?`)) {
      this.citaService.delete(cita.id).subscribe({
        next: () => {
          this.citaService.loadCitas(this.currentPage());
        }
      });
    }
  }

  onCambiarEstado(cita: CitaResponse): void {
    this.selectedCita.set(cita);
    this.showEstadoModal.set(true);
  }

  confirmEstadoChange(estado: EstadoCita): void {
    const cita = this.selectedCita();
    if (cita) {
      this.citaService.cambiarEstado(cita.id, estado).subscribe({
        next: () => {
          this.showEstadoModal.set(false);
          this.selectedCita.set(null);
          this.citaService.loadCitas(this.currentPage());
        }
      });
    }
  }

  cancelEstadoChange(): void {
    this.showEstadoModal.set(false);
    this.selectedCita.set(null);
  }

  formatDateTime(dateStr: string): string {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleString('es-PE', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getEstadoBadge(estado: EstadoCita): { label: string; color: string } {
    const option = this.estadoOptions.find(e => e.value === estado);
    return { label: option?.label || estado, color: option?.color || 'bg-gray-100 text-gray-700' };
  }

  getPages(): number[] {
    const total = Math.ceil(this.totalElements() / 10);
    const current = this.currentPage();
    const pages: number[] = [];
    const start = Math.max(0, current - 2);
    const end = Math.min(total - 1, current + 2);
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }
}