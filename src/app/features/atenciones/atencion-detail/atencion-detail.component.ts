import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AtencionService } from '../../../core/api/atencion.service';
import { PlanTratamientoService } from '../../../core/api/plan-tratamiento.service';
import { AtencionResponse } from '../../../core/models/atencion.model';
import { PlanTratamientoResponse, ESTADO_PLAN_COLORS, ESTADO_PLAN_LABELS } from '../../../core/models/plan-tratamiento.model';

@Component({
  selector: 'app-atencion-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './atencion-detail.component.html',
  styleUrl: './atencion-detail.component.css'
})
export class AtencionDetailComponent implements OnInit {
  private atencionService = inject(AtencionService);
  private planService = inject(PlanTratamientoService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  loading = signal(true);
  atencion = signal<AtencionResponse | null>(null);
  planes = signal<PlanTratamientoResponse[]>([]);
  loadingPlanes = signal(false);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadAtencion(id);
    }
  }

  loadAtencion(id: string): void {
    this.loading.set(true);
    this.atencionService.getById(id).subscribe({
      next: (atencion) => {
        this.atencion.set(atencion);
        this.loading.set(false);
        this.loadPlanes(id);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  loadPlanes(atencionId: string): void {
    this.loadingPlanes.set(true);
    this.planService.listPorAtencion(atencionId).subscribe({
      next: (planes) => {
        this.planes.set(planes);
        this.loadingPlanes.set(false);
      },
      error: () => {
        this.loadingPlanes.set(false);
      }
    });
  }

  onBack(): void {
    this.router.navigate(['/atenciones']);
  }

  onCerrar(): void {
    const atencion = this.atencion();
    if (atencion && confirm('¿Cerrar esta atención?')) {
      this.atencionService.cerrar(atencion.id).subscribe({
        next: () => {
          this.loadAtencion(atencion.id);
        }
      });
    }
  }

  formatDateTime(isoString: string | null): string {
    if (!isoString) return 'En curso';
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

  isClosed(): boolean {
    return this.atencion()?.fechaFin !== null;
  }

  onVerPlanes(): void {
    const atencion = this.atencion();
    if (atencion) {
      this.router.navigate(['/planes-tratamiento'], {
        queryParams: { atencionId: atencion.id, historiaClinicaId: atencion.historiaClinicaId }
      });
    }
  }

  onCrearPlan(): void {
    const atencion = this.atencion();
    if (atencion) {
      this.router.navigate(['/planes-tratamiento/nuevo'], {
        queryParams: { atencionId: atencion.id, historiaClinicaId: atencion.historiaClinicaId }
      });
    }
  }

  onVerPlan(planId: string): void {
    this.router.navigate(['/planes-tratamiento', planId]);
  }

  getEstadoColor(estado: string): string {
    return ESTADO_PLAN_COLORS[estado as keyof typeof ESTADO_PLAN_COLORS] || '#6b7280';
  }

  getEstadoLabel(estado: string): string {
    return ESTADO_PLAN_LABELS[estado as keyof typeof ESTADO_PLAN_LABELS] || estado;
  }
}