import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PlanTratamientoService } from '../../../core/api/plan-tratamiento.service';
import {
  PlanTratamientoResponse,
  PlanTratamientoDetalleResponse,
  PlanTratamientoEventoResponse,
  EstadoPlan,
  ESTADO_PLAN_COLORS,
  ESTADO_PLAN_LABELS,
  ESTADO_DETALLE_COLORS,
  ESTADO_DETALLE_LABELS
} from '../../../core/models/plan-tratamiento.model';
import {
  PROCEDIMIENTOS_CATALOGO,
  PIEZAS_DENTALES_CATALOGO
} from '../../../core/models/catalogo.model';

function getProcedimientoDescripcion(codigo: string): string {
  const proc = PROCEDIMIENTOS_CATALOGO.find(p => p.codigo === codigo);
  return proc ? proc.nombre : codigo;
}

function getPiezaNombre(id: number): string {
  const pieza = PIEZAS_DENTALES_CATALOGO.find(p => p.id === id);
  return pieza ? pieza.nombre : `Pieza ${id}`;
}

@Component({
  selector: 'app-plan-tratamiento-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="p-6 max-w-6xl mx-auto">
      @if (loading()) {
        <div class="flex items-center justify-center py-12">
          <p class="text-muted-foreground">Cargando plan...</p>
        </div>
      } @else if (plan()) {
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center gap-4">
            <button
              (click)="onBack()"
              class="inline-flex items-center justify-center h-9 px-3 py-2 text-sm font-medium rounded-md border border-input bg-background hover:bg-accent transition-colors"
            >
              ← Volver
            </button>
            <div>
              <h1 class="text-xl font-semibold text-foreground">Plan de Tratamiento</h1>
              <p class="text-sm text-muted-foreground">Detalle del plan</p>
            </div>
          </div>
          <div class="flex items-center gap-2">
            @if (canEdit()) {
              <button
                (click)="onEdit()"
                class="inline-flex items-center justify-center h-9 px-4 py-2 text-sm font-medium rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
              >
                Editar
              </button>
            }
            @if (canChangeState()) {
              @if (plan()!.estado === 'PROPUESTO') {
                <button
                  (click)="onAceptar()"
                  class="inline-flex items-center justify-center h-9 px-4 py-2 text-sm font-medium rounded-md bg-green-600 text-white hover:bg-green-700 transition-colors"
                >
                  Aceptar
                </button>
                <button
                  (click)="onRechazar()"
                  class="inline-flex items-center justify-center h-9 px-4 py-2 text-sm font-medium rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors"
                >
                  Rechazar
                </button>
              }
              @if (plan()!.estado === 'ACEPTADO') {
                <button
                  (click)="onIniciarEjecucion()"
                  class="inline-flex items-center justify-center h-9 px-4 py-2 text-sm font-medium rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                >
                  Iniciar Ejecución
                </button>
              }
              @if (plan()!.estado === 'EN_EJECUCION') {
                <button
                  (click)="onCompletar()"
                  class="inline-flex items-center justify-center h-9 px-4 py-2 text-sm font-medium rounded-md bg-green-600 text-white hover:bg-green-700 transition-colors"
                >
                  Completar Plan
                </button>
              }
            }
          </div>
        </div>

        <div class="grid grid-cols-3 gap-6 mb-6">
          <div class="bg-card border rounded-xl p-4">
            <p class="text-muted-foreground text-xs mb-1">Estado</p>
            <span
              class="inline-flex items-center px-2 py-1 rounded text-sm font-medium text-white"
              [style.background-color]="getEstadoColor(plan()!.estado)"
            >
              {{ getEstadoLabel(plan()!.estado) }}
            </span>
          </div>
          <div class="bg-card border rounded-xl p-4">
            <p class="text-muted-foreground text-xs mb-1">Monto Total</p>
            <p class="text-xl font-semibold">{{ plan()!.montoTotal | currency:'PEN':'S/ ' }}</p>
          </div>
          <div class="bg-card border rounded-xl p-4">
            <p class="text-muted-foreground text-xs mb-1">Fecha Creación</p>
            <p class="font-medium">{{ formatDate(plan()!.createdAt) }}</p>
          </div>
        </div>

        @if (plan()!.observaciones) {
          <div class="bg-card border rounded-xl p-4 mb-6">
            <p class="text-muted-foreground text-xs mb-1">Observaciones</p>
            <p class="font-medium">{{ plan()!.observaciones }}</p>
          </div>
        }

        <div class="grid grid-cols-3 gap-6">
          <div class="col-span-2">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-lg font-semibold">Procedimientos</h2>
              @if (canEdit()) {
                <button
                  (click)="onAddProcedimiento()"
                  class="inline-flex items-center justify-center h-8 px-3 py-1 text-sm font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  + Agregar
                </button>
              }
            </div>

            @if (detalles().length === 0) {
              <div class="bg-card border rounded-xl p-8 text-center">
                <p class="text-muted-foreground">No hay procedimientos registrados</p>
              </div>
            } @else {
              <div class="bg-card border rounded-xl overflow-x-auto">
                <table class="w-full min-w-[700px]">
                  <thead class="bg-muted/50">
                    <tr>
                      <th class="text-left px-4 py-2 text-xs font-medium text-muted-foreground">#</th>
                      <th class="text-left px-4 py-2 text-xs font-medium text-muted-foreground">Procedimiento</th>
                      <th class="text-left px-4 py-2 text-xs font-medium text-muted-foreground">Pieza</th>
                      <th class="text-left px-4 py-2 text-xs font-medium text-muted-foreground">Cara</th>
                      <th class="text-right px-4 py-2 text-xs font-medium text-muted-foreground">Cant.</th>
                      <th class="text-right px-4 py-2 text-xs font-medium text-muted-foreground">Precio</th>
                      <th class="text-left px-4 py-2 text-xs font-medium text-muted-foreground">Estado</th>
                      <th class="text-center px-4 py-2 text-xs font-medium text-muted-foreground">Acciones</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y">
                    @for (detalle of detalles(); track detalle.id) {
                      <tr class="hover:bg-muted/30">
                        <td class="px-4 py-2 text-sm">{{ detalle.orden }}</td>
                        <td class="px-4 py-2 text-sm">{{ getProcedimientoDescripcion(detalle.procedimientoCodigo) }}</td>
                        <td class="px-4 py-2 text-sm">{{ getPiezaNombre(detalle.piezaId) }}</td>
                        <td class="px-4 py-2 text-sm">{{ detalle.caraCodigo }}</td>
                        <td class="px-4 py-2 text-sm text-right">{{ detalle.cantidad }}</td>
                        <td class="px-4 py-2 text-sm text-right">{{ detalle.precioUnitario | currency:'PEN':'S/ ' }}</td>
                        <td class="px-4 py-2">
                          <span
                            class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium text-white"
                            [style.background-color]="getDetalleEstadoColor(detalle.estado)"
                          >
                            {{ getDetalleEstadoLabel(detalle.estado) }}
                          </span>
                        </td>
                        <td class="px-4 py-2">
                          <div class="flex items-center justify-center gap-1">
                            @if (canMarcarEjecutado(detalle)) {
                              <button
                                (click)="onMarcarEjecutado(detalle)"
                                class="inline-flex items-center justify-center h-7 px-2 py-0.5 text-xs font-medium rounded bg-green-100 text-green-700 hover:bg-green-200 transition-colors"
                              >
                                Ejecutar
                              </button>
                            }
                            @if (canEdit()) {
                              <button
                                (click)="onEditDetalle(detalle)"
                                class="inline-flex items-center justify-center h-7 px-2 py-0.5 text-xs font-medium rounded bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors"
                              >
                                Editar
                              </button>
                              <button
                                (click)="onDeleteDetalle(detalle)"
                                class="inline-flex items-center justify-center h-7 px-2 py-0.5 text-xs font-medium rounded bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
                              >
                                Eliminar
                              </button>
                            }
                          </div>
                        </td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            }

            <div class="mt-4 bg-card border rounded-xl p-4">
              <div class="flex justify-end">
                <div class="text-right">
                  <p class="text-sm text-muted-foreground">Total</p>
                  <p class="text-xl font-semibold">{{ calcularTotal() | currency:'PEN':'S/ ' }}</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 class="text-lg font-semibold mb-4">Historial de Eventos</h2>

            @if (eventos().length === 0) {
              <div class="bg-card border rounded-xl p-8 text-center">
                <p class="text-muted-foreground">No hay eventos registrados</p>
              </div>
            } @else {
              <div class="bg-card border rounded-xl p-4">
                <div class="space-y-4">
                  @for (evento of eventos(); track evento.id) {
                    <div class="flex gap-3">
                      <div class="flex flex-col items-center">
                        <div
                          class="w-3 h-3 rounded-full"
                          [style.background-color]="getEstadoColor(evento.estadoNuevo)"
                        ></div>
                        @if (!$last) {
                          <div class="w-0.5 h-full bg-border mt-1"></div>
                        }
                      </div>
                      <div class="flex-1 pb-4">
                        <div class="flex items-center gap-2 mb-1">
                          <span
                            class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium text-white"
                            [style.background-color]="getEstadoColor(evento.estadoNuevo)"
                          >
                            {{ getEstadoLabel(evento.estadoNuevo) }}
                          </span>
                        </div>
                        <p class="text-sm text-muted-foreground">{{ formatDateTime(evento.createdAt) }}</p>
                        @if (evento.notas) {
                          <p class="text-sm mt-1">{{ evento.notas }}</p>
                        }
                      </div>
                    </div>
                  }
                </div>
              </div>
            }
          </div>
        </div>
      } @else {
        <div class="bg-card border rounded-xl p-12 text-center">
          <p class="text-muted-foreground">Plan no encontrado</p>
        </div>
      }
    </div>
  `
})
export class PlanTratamientoDetailComponent implements OnInit {
  private planService = inject(PlanTratamientoService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  readonly plan = this.planService.currentPlan;
  readonly detalles = this.planService.detalles;
  readonly eventos = this.planService.eventos;
  readonly loading = this.planService.loading;

  private planId = signal<string | null>(null);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.planId.set(id);
      this.planService.loadPlan(id);
    }
  }

  canEdit(): boolean {
    const estado = this.plan()?.estado;
    return estado === 'PROPUESTO' || estado === 'EN_EJECUCION';
  }

  canChangeState(): boolean {
    const estado = this.plan()?.estado;
    return estado === 'PROPUESTO' || estado === 'ACEPTADO' || estado === 'EN_EJECUCION';
  }

  canMarcarEjecutado(detalle: PlanTratamientoDetalleResponse): boolean {
    return this.plan()?.estado === 'EN_EJECUCION' && detalle.estado === 'PENDIENTE';
  }

  getEstadoColor(estado: string): string {
    return ESTADO_PLAN_COLORS[estado as keyof typeof ESTADO_PLAN_COLORS] || '#6b7280';
  }

  getEstadoLabel(estado: string): string {
    return ESTADO_PLAN_LABELS[estado as keyof typeof ESTADO_PLAN_LABELS] || estado;
  }

  getDetalleEstadoColor(estado: string): string {
    return ESTADO_DETALLE_COLORS[estado as keyof typeof ESTADO_DETALLE_COLORS] || '#6b7280';
  }

  getDetalleEstadoLabel(estado: string): string {
    return ESTADO_DETALLE_LABELS[estado as keyof typeof ESTADO_DETALLE_LABELS] || estado;
  }

  getProcedimientoDescripcion(codigo: string): string {
    return getProcedimientoDescripcion(codigo);
  }

  getPiezaNombre(id: number): string {
    return getPiezaNombre(id);
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  formatDateTime(dateStr: string): string {
    return new Date(dateStr).toLocaleString('es-PE', {
      day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  }

  calcularTotal(): number {
    return this.detalles().reduce((sum, d) => sum + d.precioUnitario * d.cantidad, 0);
  }

  onBack(): void {
    const historiaId = this.plan()?.historiaClinicaId;
    if (historiaId) {
      this.router.navigate(['/planes-tratamiento'], { queryParams: { historiaClinicaId: historiaId } });
    } else {
      this.router.navigate(['/planes-tratamiento']);
    }
  }

  onEdit(): void {
    const id = this.planId();
    if (id) {
      this.router.navigate(['/planes-tratamiento', id, 'editar']);
    }
  }

  onAddProcedimiento(): void {
    // TODO: modal o navegar a form con parametro para agregar procedimiento
  }

  onAceptar(): void {
    const id = this.planId();
    if (id) {
      this.planService.cambiarEstado(id, { estado: 'ACEPTADO', notas: 'Aceptado por el paciente' }).subscribe({
        next: () => this.planService.loadPlan(id)
      });
    }
  }

  onRechazar(): void {
    const id = this.planId();
    if (id) {
      this.planService.cambiarEstado(id, { estado: 'RECHAZADO', notas: 'Rechazado por el paciente' }).subscribe({
        next: () => this.planService.loadPlan(id)
      });
    }
  }

  onIniciarEjecucion(): void {
    const id = this.planId();
    if (id) {
      this.planService.cambiarEstado(id, { estado: 'EN_EJECUCION', notas: 'Iniciando ejecución del plan' }).subscribe({
        next: () => this.planService.loadPlan(id)
      });
    }
  }

  onCompletar(): void {
    const id = this.planId();
    if (id) {
      this.planService.cambiarEstado(id, { estado: 'COMPLETADO', notas: 'Plan completado' }).subscribe({
        next: () => this.planService.loadPlan(id)
      });
    }
  }

  onMarcarEjecutado(detalle: PlanTratamientoDetalleResponse): void {
    const plan = this.plan();
    if (!plan) return;

    const atencionId = plan.atencionId;
    if (!atencionId) {
      alert('No hay atención asociada para registrar la ejecución');
      return;
    }

    const detalleId = detalle.id;
    const planId = plan.id;

    this.planService.updateDetalle(planId, detalleId, { estado: 'EJECUTADO' }).subscribe({
      next: () => {
        this.planService.createTratamientoEjecutado({
          planDetalleId: detalleId,
          atencionId: atencionId,
          fechaEjecucion: new Date().toISOString(),
          observaciones: ''
        }).subscribe({
          next: () => this.planService.loadPlan(planId)
        });
      }
    });
  }

  onEditDetalle(detalle: PlanTratamientoDetalleResponse): void {
    // TODO: modal para editar
  }

  onDeleteDetalle(detalle: PlanTratamientoDetalleResponse): void {
    if (!confirm('¿Eliminar este procedimiento?')) return;
    const planId = this.planId();
    if (planId) {
      this.planService.deleteDetalle(planId, detalle.id).subscribe({
        next: () => this.planService.loadPlan(planId)
      });
    }
  }
}
