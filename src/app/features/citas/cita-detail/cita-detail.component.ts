import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CitaService } from '../../../core/api/cita.service';
import { AtencionService } from '../../../core/api/atencion.service';
import { CitaResponse, EstadoCita } from '../../../core/models/cita.model';
import { AtencionResponse } from '../../../core/models/atencion.model';

@Component({
  selector: 'app-cita-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cita-detail.component.html',
  styleUrl: './cita-detail.component.css'
})
export class CitaDetailComponent implements OnInit {
  private citaService = inject(CitaService);
  private atencionService = inject(AtencionService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  loading = signal(true);
  cita = signal<CitaResponse | null>(null);
  criandoAtencion = signal(false);
  atencionExistente = signal<AtencionResponse | null>(null);

  estadoOptions: { value: EstadoCita; label: string; color: string }[] = [
    { value: 'PROGRAMADA', label: 'Programada', color: 'bg-blue-100 text-blue-700' },
    { value: 'CONFIRMADA', label: 'Confirmada', color: 'bg-cyan-100 text-cyan-700' },
    { value: 'EN_CURSO', label: 'En Curso', color: 'bg-amber-100 text-amber-700' },
    { value: 'ATENDIDA', label: 'Atendida', color: 'bg-green-100 text-green-700' },
    { value: 'CANCELADA', label: 'Cancelada', color: 'bg-red-100 text-red-700' },
    { value: 'NO_ASISTIO', label: 'No Asistio', color: 'bg-gray-100 text-gray-700' }
  ];

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadCita(id);
    }
  }

  loadCita(id: string): void {
    this.loading.set(true);
    this.citaService.getById(id).subscribe({
      next: (cita) => {
        this.cita.set(cita);
        this.loading.set(false);
        this.loadAtencionExistente(id);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  loadAtencionExistente(citaId: string): void {
    this.atencionService.getPorCita(citaId).subscribe({
      next: (atencion) => {
        this.atencionExistente.set(atencion);
      },
      error: () => {
        this.atencionExistente.set(null);
      }
    });
  }

  onBack(): void {
    this.router.navigate(['/citas']);
  }

  onEdit(): void {
    const cita = this.cita();
    if (cita) {
      this.router.navigate(['/citas', cita.id, 'editar']);
    }
  }

  onCrearAtencion(): void {
    const cita = this.cita();
    if (!cita) return;

    if (!confirm('¿Crear atención para esta cita?')) return;

    this.criandoAtencion.set(true);
    this.atencionService.create({
      citaId: cita.id,
      historiaClinicaId: cita.historiaClinicaId,
      odontologoId: cita.odontologoId,
      notas: ''
    }).subscribe({
      next: (atencion) => {
        this.criandoAtencion.set(false);
        this.router.navigate(['/atenciones', atencion.id]);
      },
      error: (err) => {
        this.criandoAtencion.set(false);
        console.error('Error al crear atención:', err);
        alert('Error al crear la atención');
      }
    });
  }

  puedeCrearAtencion(): boolean {
    const cita = this.cita();
    if (!cita) return false;
    return (cita.estado === 'CONFIRMADA' || cita.estado === 'EN_CURSO')
           && !this.atencionExistente();
  }

  formatDateTime(isoString: string): string {
    if (!isoString) return '-';
    const date = new Date(isoString);
    return date.toLocaleString('es-PE', {
      weekday: 'short',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getEstadoBadge(estado: EstadoCita): { label: string; color: string } {
    const option = this.estadoOptions.find(e => e.value === estado);
    return { label: option?.label || estado, color: option?.color || 'bg-gray-100 text-gray-700' };
  }
}