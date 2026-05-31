import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  PlanTratamientoResponse,
  CreatePlanTratamientoRequest,
  UpdatePlanTratamientoRequest,
  CambiarEstadoPlanRequest,
  PlanTratamientoDetalleResponse,
  CreateDetalleRequest,
  UpdateDetalleRequest,
  PlanTratamientoEventoResponse,
  TratamientoEjecutadoResponse,
  CreateTratamientoEjecutadoRequest
} from '../models/plan-tratamiento.model';

@Injectable({ providedIn: 'root' })
export class PlanTratamientoService {
  private http = inject(HttpClient);
  private apiUrl = '/api/planes-tratamiento';

  private _planes = signal<PlanTratamientoResponse[]>([]);
  private _currentPlan = signal<PlanTratamientoResponse | null>(null);
  private _detalles = signal<PlanTratamientoDetalleResponse[]>([]);
  private _eventos = signal<PlanTratamientoEventoResponse[]>([]);
  private _loading = signal(false);

  readonly planes = this._planes.asReadonly();
  readonly currentPlan = this._currentPlan.asReadonly();
  readonly detalles = this._detalles.asReadonly();
  readonly eventos = this._eventos.asReadonly();
  readonly loading = this._loading.asReadonly();

  listPorHistoria(historiaClinicaId: string): Observable<PlanTratamientoResponse[]> {
    return this.http.get<PlanTratamientoResponse[]>(`${this.apiUrl}/por-historia/${historiaClinicaId}`);
  }

  listPorAtencion(atencionId: string): Observable<PlanTratamientoResponse[]> {
    return this.http.get<PlanTratamientoResponse[]>(`${this.apiUrl}/por-atencion/${atencionId}`);
  }

  loadPlanesPorAtencion(atencionId: string): void {
    this._loading.set(true);
    this.listPorAtencion(atencionId).subscribe({
      next: (planes) => {
        this._planes.set(planes);
        this._loading.set(false);
      },
      error: () => {
        this._loading.set(false);
      }
    });
  }

  getById(id: string): Observable<PlanTratamientoResponse> {
    return this.http.get<PlanTratamientoResponse>(`${this.apiUrl}/${id}`);
  }

  create(request: CreatePlanTratamientoRequest): Observable<PlanTratamientoResponse> {
    return this.http.post<PlanTratamientoResponse>(this.apiUrl, request);
  }

  update(id: string, request: UpdatePlanTratamientoRequest): Observable<PlanTratamientoResponse> {
    return this.http.put<PlanTratamientoResponse>(`${this.apiUrl}/${id}`, request);
  }

  cambiarEstado(id: string, request: CambiarEstadoPlanRequest): Observable<PlanTratamientoResponse> {
    return this.http.patch<PlanTratamientoResponse>(`${this.apiUrl}/${id}/estado`, request);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getEventos(planId: string): Observable<PlanTratamientoEventoResponse[]> {
    return this.http.get<PlanTratamientoEventoResponse[]>(`${this.apiUrl}/${planId}/eventos`);
  }

  getDetalles(planId: string): Observable<PlanTratamientoDetalleResponse[]> {
    return this.http.get<PlanTratamientoDetalleResponse[]>(`${this.apiUrl}/${planId}/detalles`);
  }

  createDetalle(planId: string, request: CreateDetalleRequest): Observable<PlanTratamientoDetalleResponse> {
    return this.http.post<PlanTratamientoDetalleResponse>(`${this.apiUrl}/${planId}/detalles`, request);
  }

  updateDetalle(planId: string, detalleId: string, request: UpdateDetalleRequest): Observable<PlanTratamientoDetalleResponse> {
    return this.http.put<PlanTratamientoDetalleResponse>(`${this.apiUrl}/${planId}/detalles/${detalleId}`, request);
  }

  deleteDetalle(planId: string, detalleId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${planId}/detalles/${detalleId}`);
  }

  getTratamientosEjecutadosPorAtencion(atencionId: string): Observable<TratamientoEjecutadoResponse[]> {
    return this.http.get<TratamientoEjecutadoResponse[]>(`/api/tratamientos-ejecutados/por-atencion/${atencionId}`);
  }

  createTratamientoEjecutado(request: CreateTratamientoEjecutadoRequest): Observable<TratamientoEjecutadoResponse> {
    return this.http.post<TratamientoEjecutadoResponse>('/api/tratamientos-ejecutados', request);
  }

  loadPlanesPorHistoria(historiaClinicaId: string): void {
    this._loading.set(true);
    this.listPorHistoria(historiaClinicaId).subscribe({
      next: (planes) => {
        this._planes.set(planes);
        this._loading.set(false);
      },
      error: () => {
        this._loading.set(false);
      }
    });
  }

  loadPlan(id: string): void {
    this._loading.set(true);
    this.getById(id).subscribe({
      next: (plan) => {
        this._currentPlan.set(plan);
        this.loadDetalles(id);
        this.loadEventos(id);
        this._loading.set(false);
      },
      error: () => {
        this._loading.set(false);
      }
    });
  }

  loadDetalles(planId: string): void {
    this.getDetalles(planId).subscribe({
      next: (detalles) => {
        this._detalles.set(detalles);
      }
    });
  }

  loadEventos(planId: string): void {
    this.getEventos(planId).subscribe({
      next: (eventos) => {
        this._eventos.set(eventos);
      }
    });
  }

  clearCurrent(): void {
    this._currentPlan.set(null);
    this._detalles.set([]);
    this._eventos.set([]);
  }
}
