import { Injectable, signal, computed } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  PacienteResponse,
  CreatePacienteRequest,
  UpdatePacienteRequest,
  PagedResponse,
  Catalogo
} from '../models/paciente.model';

@Injectable({ providedIn: 'root' })
export class PacienteService {
  private readonly apiUrl = '/api/pacientes';

  private _pacientes = signal<PacienteResponse[]>([]);
  private _loading = signal(false);
  private _totalElements = signal(0);
  private _currentPage = signal(0);
  private _searchQuery = signal('');

  readonly pacientes = this._pacientes.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly totalElements = this._totalElements.asReadonly();
  readonly currentPage = this._currentPage.asReadonly();
  readonly searchQuery = this._searchQuery.asReadonly();

  readonly totalPages = computed(() =>
    Math.ceil(this._totalElements() / 10)
  );

  constructor(private http: HttpClient) {}

  loadPacientes(page = 0, size = 10, search = ''): void {
    this._loading.set(true);
    this._currentPage.set(page);
    this._searchQuery.set(search);

    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (search) {
      params = params.set('q', search);
    }

    this.http.get<PagedResponse<PacienteResponse>>(this.apiUrl, { params })
      .subscribe({
        next: (response) => {
          this._pacientes.set(response.content);
          this._totalElements.set(response.totalElements);
          this._loading.set(false);
        },
        error: () => {
          this._loading.set(false);
        }
      });
  }

  getById(id: string): Observable<PacienteResponse> {
    return this.http.get<PacienteResponse>(`${this.apiUrl}/${id}`);
  }

  create(request: CreatePacienteRequest): Observable<PacienteResponse> {
    return this.http.post<PacienteResponse>(this.apiUrl, request);
  }

  update(id: string, request: UpdatePacienteRequest): Observable<PacienteResponse> {
    return this.http.put<PacienteResponse>(`${this.apiUrl}/${id}`, request);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getCatalogos(): Observable<any> {
    return this.http.get<any>('/api/catalogos');
  }
}