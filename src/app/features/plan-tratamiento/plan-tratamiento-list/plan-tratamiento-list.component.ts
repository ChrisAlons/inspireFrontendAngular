import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PlanTratamientoService } from '../../../core/api/plan-tratamiento.service';
import {
  PlanTratamientoResponse,
  ESTADO_PLAN_COLORS,
  ESTADO_PLAN_LABELS
} from '../../../core/models/plan-tratamiento.model';

@Component({
  selector: 'app-plan-tratamiento-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="p-6 max-w-6xl mx-auto">
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center gap-4">
          <button
            (click)="onBack()"
            class="inline-flex items-center justify-center h-9 px-3 py-2 text-sm font-medium rounded-md border border-input bg-background hover:bg-accent transition-colors"
          >
            ← Volver
          </button>
          <div>
            <h1 class="text-xl font-semibold text-foreground">Planes de Tratamiento</h1>
            @if (atencionId()) {
              <p class="text-sm text-muted-foreground">Planes para esta Atención</p>
            } @else if (historiaClinicaId()) {
              <p class="text-sm text-muted-foreground">Historia Clínica</p>
            }
          </div>
        </div>
        @if (historiaClinicaId()) {
          <button
            (click)="onNewPlan()"
            class="inline-flex items-center justify-center h-9 px-4 py-2 text-sm font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            + Nuevo Plan
          </button>
        }
      </div>

      @if (loading()) {
        <div class="flex items-center justify-center py-12">
          <p class="text-muted-foreground">Cargando planes...</p>
        </div>
      } @else if (planes().length === 0) {
        <div class="bg-card border rounded-xl p-12 text-center">
          <p class="text-muted-foreground mb-4">No hay planes de tratamiento registrados</p>
          @if (historiaClinicaId()) {
            <button
              (click)="onNewPlan()"
              class="inline-flex items-center justify-center h-9 px-4 py-2 text-sm font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Crear el primer plan
            </button>
          }
        </div>
      } @else {
        <div class="grid gap-4">
          @for (plan of planes(); track plan.id) {
            <div class="bg-card border rounded-xl p-4 hover:border-primary/50 transition-colors">
              <div class="flex items-center justify-between">
                <div class="flex-1">
                  <div class="flex items-center gap-3 mb-2">
                    <span
                      class="inline-flex items-center px-2 py-1 rounded text-xs font-medium text-white"
                      [style.background-color]="getEstadoColor(plan.estado)"
                    >
                      {{ getEstadoLabel(plan.estado) }}
                    </span>
                    <span class="text-sm text-muted-foreground">
                      {{ formatDate(plan.createdAt) }}
                    </span>
                  </div>
                  <div class="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p class="text-muted-foreground text-xs">Monto Total</p>
                      <p class="font-medium">{{ plan.montoTotal | currency:'PEN':'S/ ' }}</p>
                    </div>
                    <div class="col-span-2">
                      <p class="text-muted-foreground text-xs">Observaciones</p>
                      <p class="font-medium truncate">{{ plan.observaciones || '-' }}</p>
                    </div>
                  </div>
                </div>
                <div class="flex items-center gap-2">
                  <button
                    (click)="onViewPlan(plan)"
                    class="inline-flex items-center justify-center h-8 px-3 py-1 text-sm font-medium rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
                  >
                    Ver Detalle
                  </button>
                </div>
              </div>
            </div>
          }
        </div>
      }
    </div>
  `
})
export class PlanTratamientoListComponent implements OnInit {
  private planService = inject(PlanTratamientoService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  historiaClinicaId = signal<string | null>(null);
  atencionId = signal<string | null>(null);
  readonly planes = this.planService.planes;
  readonly loading = this.planService.loading;

  ngOnInit(): void {
    const historiaId = this.route.snapshot.queryParamMap.get('historiaClinicaId');
    const atencionIdParam = this.route.snapshot.queryParamMap.get('atencionId');

    if (atencionIdParam) {
      this.atencionId.set(atencionIdParam);
      this.historiaClinicaId.set(historiaId);
      this.planService.loadPlanesPorAtencion(atencionIdParam);
    } else if (historiaId) {
      this.historiaClinicaId.set(historiaId);
      this.planService.loadPlanesPorHistoria(historiaId);
    }
  }

  getEstadoColor(estado: string): string {
    return ESTADO_PLAN_COLORS[estado as keyof typeof ESTADO_PLAN_COLORS] || '#6b7280';
  }

  getEstadoLabel(estado: string): string {
    return ESTADO_PLAN_LABELS[estado as keyof typeof ESTADO_PLAN_LABELS] || estado;
  }

  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  onViewPlan(plan: PlanTratamientoResponse): void {
    this.router.navigate(['/planes-tratamiento', plan.id]);
  }

  onNewPlan(): void {
    const historiaId = this.historiaClinicaId();
    const atencionId = this.atencionId();
    if (historiaId && atencionId) {
      this.router.navigate(['/planes-tratamiento/nuevo'], {
        queryParams: { historiaClinicaId: historiaId, atencionId: atencionId }
      });
    } else if (historiaId) {
      this.router.navigate(['/planes-tratamiento/nuevo'], {
        queryParams: { historiaClinicaId: historiaId }
      });
    }
  }

  onBack(): void {
    const atencionId = this.atencionId();
    if (atencionId) {
      this.router.navigate(['/atenciones', atencionId]);
    } else {
      this.router.navigate(['/pacientes']);
    }
  }
}
