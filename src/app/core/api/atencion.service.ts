import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AtencionResponse, CreateAtencionRequest, UpdateAtencionRequest } from '../models/atencion.model';

@Injectable({ providedIn: 'root' })
export class AtencionService {
  private readonly apiUrl = '/api/atenciones';
  private http = inject(HttpClient);

  private _atenciones = signal<AtencionResponse[]>([]);
  private _loading = signal(false);

  readonly atenciones = this._atenciones.asReadonly();
  readonly loading = this._loading.asReadonly();

  getEnCurso(): Observable<AtencionResponse[]> {
    return this.http.get<AtencionResponse[]>(`${this.apiUrl}/en-curso`);
  }

  getById(id: string): Observable<AtencionResponse> {
    return this.http.get<AtencionResponse>(`${this.apiUrl}/${id}`);
  }

  getPorHistoria(historiaClinicaId: string): Observable<AtencionResponse[]> {
    return this.http.get<AtencionResponse[]>(`${this.apiUrl}/por-historia/${historiaClinicaId}`);
  }

  getPorCita(citaId: string): Observable<AtencionResponse> {
    return this.http.get<AtencionResponse>(`${this.apiUrl}/porcita/${citaId}`);
  }

  create(request: CreateAtencionRequest): Observable<AtencionResponse> {
    return this.http.post<AtencionResponse>(this.apiUrl, request);
  }

  update(id: string, request: UpdateAtencionRequest): Observable<AtencionResponse> {
    return this.http.put<AtencionResponse>(`${this.apiUrl}/${id}`, request);
  }

  cerrar(id: string): Observable<AtencionResponse> {
    return this.http.patch<AtencionResponse>(`${this.apiUrl}/${id}/cerrar`, {});
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  loadEnCurso(): void {
    this._loading.set(true);
    this.getEnCurso().subscribe({
      next: (atenciones) => {
        this._atenciones.set(atenciones);
        this._loading.set(false);
      },
      error: () => {
        this._loading.set(false);
      }
    });
  }
}
