import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  CitaResponse,
  CreateCitaRequest,
  UpdateCitaRequest,
  CambiarEstadoRequest,
  PagedResponse,
  EstadoCita
} from '../models/cita.model';

@Injectable({ providedIn: 'root' })
export class CitaService {
  private readonly apiUrl = '/api/citas';

  private _citas = signal<CitaResponse[]>([]);
  private _loading = signal(false);
  private _totalElements = signal(0);
  private _currentPage = signal(0);

  readonly citas = this._citas.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly totalElements = this._totalElements.asReadonly();
  readonly currentPage = this._currentPage.asReadonly();

  constructor(private http: HttpClient) {}

  loadCitas(page = 0, size = 10, pacienteId?: string): void {
    this._loading.set(true);
    this._currentPage.set(page);

    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', 'fechaHoraInicio,desc');

    if (pacienteId) {
      params = params.set('pacienteId', pacienteId);
    }

    this.http.get<PagedResponse<CitaResponse>>(this.apiUrl, { params })
      .subscribe({
        next: (response) => {
          this._citas.set(response.content);
          this._totalElements.set(response.totalElements);
          this._loading.set(false);
        },
        error: () => {
          this._loading.set(false);
        }
      });
  }

  getById(id: string): Observable<CitaResponse> {
    return this.http.get<CitaResponse>(`${this.apiUrl}/${id}`);
  }

  create(request: CreateCitaRequest): Observable<CitaResponse> {
    return this.http.post<CitaResponse>(this.apiUrl, request);
  }

  update(id: string, request: UpdateCitaRequest): Observable<CitaResponse> {
    return this.http.put<CitaResponse>(`${this.apiUrl}/${id}`, request);
  }

  cambiarEstado(id: string, estado: EstadoCita): Observable<CitaResponse> {
    return this.http.patch<CitaResponse>(`${this.apiUrl}/${id}/estado`, { estado } as CambiarEstadoRequest);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getTodayCitas(): Observable<CitaResponse[]> {
    return this.http.get<CitaResponse[]>(`${this.apiUrl}/today`);
  }
}