import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PlanTratamientoService } from '../../../core/api/plan-tratamiento.service';
import {
  CreatePlanTratamientoRequest,
  UpdatePlanTratamientoRequest,
  PlanTratamientoResponse,
  CreateDetalleRequest
} from '../../../core/models/plan-tratamiento.model';
import {
  PROCEDIMIENTOS_CATALOGO,
  PIEZAS_DENTALES_CATALOGO,
  CARAS_DENTALES_CATALOGO,
  ProcedimientoCatalogo
} from '../../../core/models/catalogo.model';

interface DetalleForm {
  id?: string;
  procedimientoCodigo: string;
  procedimientoDescripcion: string;
  piezaId: number;
  piezaNombre: string;
  caraCodigo: string;
  cantidad: number;
  precioUnitario: number;
  orden: number;
  notas: string;
}

function getProcedimientoDescripcion(codigo: string): string {
  const proc = PROCEDIMIENTOS_CATALOGO.find(p => p.codigo === codigo);
  return proc ? proc.nombre : codigo;
}

function getPiezaNombre(id: number): string {
  const pieza = PIEZAS_DENTALES_CATALOGO.find(p => p.id === id);
  return pieza ? pieza.nombre : `Pieza ${id}`;
}

@Component({
  selector: 'app-plan-tratamiento-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="p-6 max-w-6xl mx-auto">
      <div class="flex items-center gap-4 mb-6">
        <button
          (click)="onBack()"
          class="inline-flex items-center justify-center h-9 px-3 py-2 text-sm font-medium rounded-md border border-input bg-background hover:bg-accent transition-colors"
        >
          ← Volver
        </button>
        <div>
          <h1 class="text-xl font-semibold text-foreground">{{ isEdit() ? 'Editar' : 'Nuevo' }} Plan de Tratamiento</h1>
          @if (historiaClinicaId()) {
            <p class="text-sm text-muted-foreground">Historia Clínica</p>
          }
        </div>
      </div>

      <div class="bg-card border rounded-xl p-6 mb-6">
        <h2 class="text-lg font-semibold mb-4">Datos del Plan</h2>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-foreground mb-1">Observaciones</label>
            <textarea
              [(ngModel)]="observaciones"
              rows="3"
              class="w-full px-3 py-2 text-sm rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="Observaciones generales del plan..."
            ></textarea>
          </div>
        </div>
      </div>

      <div class="bg-card border rounded-xl p-6 mb-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold">Procedimientos</h2>
          <button
            (click)="onAddProcedimiento()"
            class="inline-flex items-center justify-center h-9 px-4 py-2 text-sm font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            + Agregar Procedimiento
          </button>
        </div>

        @if (detalles().length === 0) {
          <div class="bg-muted/50 rounded-xl p-8 text-center">
            <p class="text-muted-foreground mb-2">No hay procedimientos agregados</p>
            <button
              (click)="onAddProcedimiento()"
              class="inline-flex items-center justify-center h-8 px-3 py-1 text-sm font-medium rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
            >
              Agregar el primer procedimiento
            </button>
          </div>
        } @else {
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-muted/50">
                <tr>
                  <th class="text-left px-3 py-2 text-xs font-medium text-muted-foreground">#</th>
                  <th class="text-left px-3 py-2 text-xs font-medium text-muted-foreground">Procedimiento</th>
                  <th class="text-left px-3 py-2 text-xs font-medium text-muted-foreground">Pieza</th>
                  <th class="text-left px-3 py-2 text-xs font-medium text-muted-foreground">Cara</th>
                  <th class="text-center px-3 py-2 text-xs font-medium text-muted-foreground">Cant.</th>
                  <th class="text-right px-3 py-2 text-xs font-medium text-muted-foreground">Precio Unit.</th>
                  <th class="text-right px-3 py-2 text-xs font-medium text-muted-foreground">Subtotal</th>
                  <th class="text-center px-3 py-2 text-xs font-medium text-muted-foreground">Acciones</th>
                </tr>
              </thead>
              <tbody class="divide-y">
                @for (detalle of detalles(); track $index) {
                  <tr>
                    <td class="px-3 py-2 text-sm">{{ detalle.orden }}</td>
                    <td class="px-3 py-2 text-sm">
                      <select
                        [ngModel]="detalle.procedimientoCodigo"
                        (ngModelChange)="onProcedimientoCodigoChange($index, $event)"
                        class="px-2 py-1 text-sm rounded border border-input bg-background focus:outline-none focus:ring-1 focus:ring-primary/50"
                      >
                        <option value="">Seleccionar...</option>
                        @for (proc of procedimientos; track proc.codigo) {
                          <option [value]="proc.codigo">{{ proc.nombre }} ({{ proc.precioBase | currency:'PEN':'S/ ' }})</option>
                        }
                      </select>
                    </td>
                    <td class="px-3 py-2">
                      <select
                        [ngModel]="detalle.piezaId"
                        (ngModelChange)="onPiezaIdChange($index, $event)"
                        class="px-2 py-1 text-sm rounded border border-input bg-background focus:outline-none focus:ring-1 focus:ring-primary/50"
                      >
                        <option [value]="0">No aplica</option>
                        @for (pieza of piezas; track pieza.id) {
                          <option [value]="pieza.id">{{ pieza.id }} - {{ pieza.nombre }}</option>
                        }
                      </select>
                    </td>
                    <td class="px-3 py-2">
                      <select
                        [ngModel]="detalle.caraCodigo"
                        (ngModelChange)="onCaraChange($index, $event)"
                        class="px-2 py-1 text-sm rounded border border-input bg-background focus:outline-none focus:ring-1 focus:ring-primary/50"
                      >
                        @for (cara of caras; track cara.codigo) {
                          <option [value]="cara.codigo">{{ cara.abreviatura }} - {{ cara.nombre }}</option>
                        }
                      </select>
                    </td>
                    <td class="px-3 py-2 text-center">
                      <input
                        type="number"
                        [ngModel]="detalle.cantidad"
                        (ngModelChange)="onCantidadChange($index, $event)"
                        min="1"
                        class="w-16 px-2 py-1 text-sm text-center rounded border border-input bg-background focus:outline-none focus:ring-1 focus:ring-primary/50"
                      />
                    </td>
                    <td class="px-3 py-2 text-right">
                      <input
                        type="number"
                        [ngModel]="detalle.precioUnitario"
                        (ngModelChange)="onPrecioChange($index, $event)"
                        step="0.01"
                        class="w-24 px-2 py-1 text-sm text-right rounded border border-input bg-background focus:outline-none focus:ring-1 focus:ring-primary/50"
                      />
                    </td>
                    <td class="px-3 py-2 text-right font-medium">
                      {{ detalle.cantidad * detalle.precioUnitario | currency:'PEN':'S/ ' }}
                    </td>
                    <td class="px-3 py-2 text-center">
                      <button
                        (click)="onRemoveProcedimiento($index)"
                        class="inline-flex items-center justify-center h-7 px-2 py-0.5 text-xs font-medium rounded bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>

          <div class="mt-4 flex justify-end">
            <div class="text-right">
              <p class="text-sm text-muted-foreground">Monto Total</p>
              <p class="text-2xl font-semibold">{{ montoTotal() | currency:'PEN':'S/ ' }}</p>
            </div>
          </div>
        }
      </div>

      <div class="flex items-center justify-end gap-3">
        <button
          (click)="onBack()"
          class="inline-flex items-center justify-center h-10 px-4 py-2 text-sm font-medium rounded-md border border-input bg-background hover:bg-accent transition-colors"
        >
          Cancelar
        </button>
        <button
          (click)="onSave()"
          [disabled]="detalles().length === 0 || saving()"
          class="inline-flex items-center justify-center h-10 px-4 py-2 text-sm font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {{ saving() ? 'Guardando...' : (isEdit() ? 'Actualizar' : 'Crear Plan') }}
        </button>
      </div>
    </div>
  `
})
export class PlanTratamientoFormComponent implements OnInit {
  private planService = inject(PlanTratamientoService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  procedimientos = PROCEDIMIENTOS_CATALOGO;
  piezas = PIEZAS_DENTALES_CATALOGO;
  caras = CARAS_DENTALES_CATALOGO;

  historiaClinicaId = signal<string | null>(null);
  atencionId = signal<string | null>(null);
  planId = signal<string | null>(null);
  isEdit = signal(false);
  saving = signal(false);

  observaciones = '';
  detalles = signal<DetalleForm[]>([]);
  private originalDetalleIds = signal<string[]>([]);

  montoTotal = computed(() => {
    return this.detalles().reduce((sum, d) => sum + (d.cantidad * d.precioUnitario), 0);
  });

  ngOnInit(): void {
    const historiaId = this.route.snapshot.queryParamMap.get('historiaClinicaId');
    const atencionIdParam = this.route.snapshot.queryParamMap.get('atencionId');
    const planIdParam = this.route.snapshot.paramMap.get('id');

    if (historiaId) {
      this.historiaClinicaId.set(historiaId);
    }
    if (atencionIdParam) {
      this.atencionId.set(atencionIdParam);
    }
    if (planIdParam) {
      this.planId.set(planIdParam);
      this.isEdit.set(true);
      this.loadPlan(planIdParam);
    }
  }

  loadPlan(id: string): void {
    this.planService.getById(id).subscribe({
      next: (plan) => {
        this.observaciones = plan.observaciones || '';
        this.historiaClinicaId.set(plan.historiaClinicaId);
        this.atencionId.set(plan.atencionId);

        this.planService.getDetalles(id).subscribe({
          next: (detalles) => {
            const loadedDetalles = detalles.map((d, idx) => ({
              id: d.id,
              procedimientoCodigo: d.procedimientoCodigo,
              procedimientoDescripcion: getProcedimientoDescripcion(d.procedimientoCodigo),
              piezaId: d.piezaId,
              piezaNombre: getPiezaNombre(d.piezaId),
              caraCodigo: d.caraCodigo,
              cantidad: d.cantidad,
              precioUnitario: Number(d.precioUnitario),
              orden: d.orden || idx + 1,
              notas: d.notas || ''
            }));
            this.detalles.set(loadedDetalles);
            this.originalDetalleIds.set(loadedDetalles.map(d => d.id).filter(id => !!id) as string[]);
          }
        });
      }
    });
  }

  onProcedimientoCodigoChange(index: number, codigo: string): void {
    const current = this.detalles()[index];
    const proc = this.procedimientos.find(p => p.codigo === codigo);
    if (proc) {
      this.updateDetalleAtIndex(index, {
        ...current,
        procedimientoCodigo: codigo,
        procedimientoDescripcion: proc.nombre,
        precioUnitario: proc.precioBase,
        piezaId: !proc.requierePieza ? 0 : current.piezaId,
        caraCodigo: !proc.requierePieza ? 'NO_APLICA' : current.caraCodigo
      });
    } else {
      this.updateDetalleAtIndex(index, {
        ...current,
        procedimientoCodigo: codigo,
        procedimientoDescripcion: ''
      });
    }
  }

  onPiezaIdChange(index: number, piezaId: number): void {
    const current = this.detalles()[index];
    const pieza = this.piezas.find(p => p.id === piezaId);
    this.updateDetalleAtIndex(index, {
      ...current,
      piezaId: piezaId,
      piezaNombre: pieza ? pieza.nombre : 'No aplica'
    });
  }

  onCaraChange(index: number, caraCodigo: string): void {
    const current = this.detalles()[index];
    this.updateDetalleAtIndex(index, { ...current, caraCodigo });
  }

  onCantidadChange(index: number, cantidad: number): void {
    const current = this.detalles()[index];
    this.updateDetalleAtIndex(index, { ...current, cantidad });
  }

  onPrecioChange(index: number, precio: number): void {
    const current = this.detalles()[index];
    this.updateDetalleAtIndex(index, { ...current, precioUnitario: precio });
  }

  private updateDetalleAtIndex(index: number, updated: DetalleForm): void {
    this.detalles.update(dets => {
      const newDets = [...dets];
      newDets[index] = updated;
      return newDets;
    });
  }

  onAddProcedimiento(): void {
    const newDetalle: DetalleForm = {
      procedimientoCodigo: '',
      procedimientoDescripcion: '',
      piezaId: 0,
      piezaNombre: 'No aplica',
      caraCodigo: 'NO_APLICA',
      cantidad: 1,
      precioUnitario: 0,
      orden: this.detalles().length + 1,
      notas: ''
    };
    this.detalles.update(dets => [...dets, newDetalle]);
  }

  onRemoveProcedimiento(index: number): void {
    this.detalles.update(dets => {
      const filtered = dets.filter((_, i) => i !== index);
      filtered.forEach((d, i) => d.orden = i + 1);
      return filtered;
    });
  }

  onBack(): void {
    const historiaId = this.historiaClinicaId();
    if (historiaId) {
      this.router.navigate(['/planes-tratamiento'], { queryParams: { historiaClinicaId: historiaId } });
    } else {
      this.router.navigate(['/planes-tratamiento']);
    }
  }

  onSave(): void {
    if (this.detalles().length === 0) {
      alert('Agregue al menos un procedimiento');
      return;
    }

    const invalidDetalles = this.detalles().filter(d => !d.procedimientoCodigo);
    if (invalidDetalles.length > 0) {
      alert('Complete todos los procedimientos');
      return;
    }

    this.saving.set(true);

    const historiaId = this.historiaClinicaId();
    const atencionId = this.atencionId();

    if (!historiaId) {
      alert('Falta historia clínica');
      this.saving.set(false);
      return;
    }

    if (this.isEdit()) {
      const planIdValue = this.planId();
      if (!planIdValue) {
        this.saving.set(false);
        return;
      }

      const updateRequest: UpdatePlanTratamientoRequest = { observaciones: this.observaciones };
      this.planService.update(planIdValue, updateRequest).subscribe({
        next: () => {
          this.syncDetalles(planIdValue);
        },
        error: () => {
          this.saving.set(false);
          alert('Error al actualizar el plan');
        }
      });
    } else {
      if (!atencionId) {
        alert('Falta atención asociada');
        this.saving.set(false);
        return;
      }

      const createRequest: CreatePlanTratamientoRequest = {
        atencionId: atencionId,
        historiaClinicaId: historiaId,
        observaciones: this.observaciones
      };

      this.planService.create(createRequest).subscribe({
        next: (plan) => {
          this.syncDetalles(plan.id);
        },
        error: () => {
          this.saving.set(false);
          alert('Error al crear el plan');
        }
      });
    }
  }

  private syncDetalles(planId: string): void {
    const detallesToCreate = this.detalles().filter(d => !d.id);
    const detallesToUpdate = this.detalles().filter(d => !!d.id);
    const currentIds = this.detalles().filter(d => !!d.id).map(d => d.id as string);
    const originalIds = this.originalDetalleIds();
    const detallesToDelete = originalIds.filter(id => !currentIds.includes(id));

    let created = 0;
    let updated = 0;
    let deleted = 0;
    let total = detallesToCreate.length + detallesToUpdate.length + detallesToDelete.length;

    if (total === 0) {
      this.saving.set(false);
      this.originalDetalleIds.set([]);
      this.router.navigate(['/planes-tratamiento', planId]);
      return;
    }

    const onComplete = () => {
      created++;
      if (created >= total) {
        this.saving.set(false);
        this.router.navigate(['/planes-tratamiento', planId]);
      }
    };

    detallesToDelete.forEach(id => {
      this.planService.deleteDetalle(planId, id).subscribe({
        next: () => {
          deleted++;
          if (deleted + created >= total) {
            onComplete();
          }
        },
        error: () => {
          deleted++;
          if (deleted + created >= total) {
            onComplete();
          }
        }
      });
    });

    detallesToCreate.forEach(detalle => {
      const request: CreateDetalleRequest = {
        procedimientoCodigo: detalle.procedimientoCodigo,
        piezaId: detalle.piezaId,
        caraCodigo: detalle.caraCodigo,
        cantidad: detalle.cantidad,
        precioUnitario: detalle.precioUnitario,
        orden: detalle.orden,
        notas: detalle.notas
      };
      this.planService.createDetalle(planId, request).subscribe({
        next: () => {
          created++;
          if (created >= total) {
            onComplete();
          }
        },
        error: () => {
          created++;
          if (created >= total) {
            onComplete();
          }
        }
      });
    });

    detallesToUpdate.forEach(detalle => {
      if (detalle.id) {
        this.planService.updateDetalle(planId, detalle.id, {
          procedimientoCodigo: detalle.procedimientoCodigo,
          piezaId: detalle.piezaId,
          caraCodigo: detalle.caraCodigo,
          cantidad: detalle.cantidad,
          precioUnitario: detalle.precioUnitario,
          orden: detalle.orden,
          notas: detalle.notas
        }).subscribe({
          next: () => {
            created++;
            if (created >= total) {
              onComplete();
            }
          },
          error: () => {
            created++;
            if (created >= total) {
              onComplete();
            }
          }
        });
      }
    });
  }
}
