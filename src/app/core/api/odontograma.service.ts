import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import {
  OdontogramaResponse,
  CreateOdontogramaRequest,
  UpdateOdontogramaRequest,
  HallazgoResponse,
  CreateHallazgoRequest,
  CreateHallazgoVozRequest,
  UpdateHallazgoRequest,
  CatalogoOdontograma,
  PiezaDental,
  CaraDental,
  CondicionDental
} from '../models/odontograma.model';

@Injectable({ providedIn: 'root' })
export class OdontogramaService {
  private readonly apiUrl = '/api/odontogramas';
  private http = inject(HttpClient);

  private _odontogramas = signal<OdontogramaResponse[]>([]);
  private _currentOdontograma = signal<OdontogramaResponse | null>(null);
  private _hallazgos = signal<HallazgoResponse[]>([]);
  private _loading = signal(false);
  private _catalogos = signal<CatalogoOdontograma | null>(null);

  readonly odontogramas = this._odontogramas.asReadonly();
  readonly currentOdontograma = this._currentOdontograma.asReadonly();
  readonly hallazgos = this._hallazgos.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly catalogos = this._catalogos.asReadonly();

  private catalogosLocales: CatalogoOdontograma = {
    piezas: this.generarPiezasDentales(),
    caras: [
      { codigo: 'VESTIBULAR', descripcion: 'Vestibular', abreviatura: 'V' },
      { codigo: 'LINGUAL', descripcion: 'Lingual', abreviatura: 'L' },
      { codigo: 'MESIAL', descripcion: 'Mesial', abreviatura: 'M' },
      { codigo: 'DISTAL', descripcion: 'Distal', abreviatura: 'D' },
      { codigo: 'OCLUSAL', descripcion: 'Oclusal', abreviatura: 'O' }
    ],
    condiciones: [
      { codigo: 'CARIES', descripcion: 'Caries', colorHex: '#EF4444' },
      { codigo: 'OBTURACION', descripcion: 'Obturación', colorHex: '#22C55E' },
      { codigo: 'OBTURACION_TEMPORAL', descripcion: 'Obturación temporal', colorHex: '#84CC16' },
      { codigo: 'CORONA', descripcion: 'Corona', colorHex: '#F59E0B' },
      { codigo: 'CORONA_TEMPORAL', descripcion: 'Corona temporal', colorHex: '#FCD34D' },
      { codigo: 'ENDODONCIA', descripcion: 'Endodoncia', colorHex: '#8B5CF6' },
      { codigo: 'IMPLANTE', descripcion: 'Implante', colorHex: '#EC4899' },
      { codigo: 'FRACTURA', descripcion: 'Fractura', colorHex: '#DC2626' },
      { codigo: 'MANCHA_BLANCA', descripcion: 'Mancha blanca', colorHex: '#FEF3C7' },
      { codigo: 'SELLANTE', descripcion: 'Sellante', colorHex: '#06B6D4' },
      { codigo: 'AUSENTE', descripcion: 'Pieza ausente', colorHex: '#1F2937' },
      { codigo: 'PUENTE', descripcion: 'Puente', colorHex: '#6366F1' },
      { codigo: 'PROTESIS_REMOVIBLE', descripcion: 'Prótesis removible', colorHex: '#A78BFA' }
    ]
  };

  private generarPiezasDentales(): PiezaDental[] {
    const piezas: PiezaDental[] = [];
    const nombresAdulto: Record<number, string> = {
      11: 'Incisivo Central Sup Der',
      12: 'Incisivo Lateral Sup Der',
      13: 'Canino Sup Der',
      14: 'Primer Premolar Sup Der',
      15: 'Segundo Premolar Sup Der',
      16: 'Primer Molar Sup Der',
      17: 'Segundo Molar Sup Der',
      18: 'Tercer Molar Sup Der',
      21: 'Incisivo Central Sup Izq',
      22: 'Incisivo Lateral Sup Izq',
      23: 'Canino Sup Izq',
      24: 'Primer Premolar Sup Izq',
      25: 'Segundo Premolar Sup Izq',
      26: 'Primer Molar Sup Izq',
      27: 'Segundo Molar Sup Izq',
      28: 'Tercer Molar Sup Izq',
      31: 'Incisivo Central Inf Izq',
      32: 'Incisivo Lateral Inf Izq',
      33: 'Canino Inf Izq',
      34: 'Primer Premolar Inf Izq',
      35: 'Segundo Premolar Inf Izq',
      36: 'Primer Molar Inf Izq',
      37: 'Segundo Molar Inf Izq',
      38: 'Tercer Molar Inf Izq',
      41: 'Incisivo Central Inf Der',
      42: 'Incisivo Lateral Inf Der',
      43: 'Canino Inf Der',
      44: 'Primer Premolar Inf Der',
      45: 'Segundo Premolar Inf Der',
      46: 'Primer Molar Inf Der',
      47: 'Segundo Molar Inf Der',
      48: 'Tercer Molar Inf Der'
    };

    for (let i = 1; i <= 4; i++) {
      for (let j = 1; j <= 8; j++) {
        const id = i * 10 + j;
        piezas.push({
          id,
          cuadrante: i,
          posicion: j,
          nombre: nombresAdulto[id] || `Pieza ${id}`,
          isDeciduo: false
        });
      }
    }
    return piezas;
  }

  getCatalogos(): Observable<CatalogoOdontograma> {
    return of(this.catalogosLocales);
  }

  loadCatalogos(): void {
    this._catalogos.set(this.catalogosLocales);
  }

  listPorHistoria(historiaClinicaId: string): Observable<OdontogramaResponse[]> {
    return this.http.get<OdontogramaResponse[]>(`${this.apiUrl}/por-historia/${historiaClinicaId}`);
  }

  listPorAtencion(atencionId: string): Observable<OdontogramaResponse[]> {
    return this.http.get<OdontogramaResponse[]>(`${this.apiUrl}/por-atencion/${atencionId}`);
  }

  getById(id: string): Observable<OdontogramaResponse> {
    return this.http.get<OdontogramaResponse>(`${this.apiUrl}/${id}`);
  }

  create(request: CreateOdontogramaRequest): Observable<OdontogramaResponse> {
    return this.http.post<OdontogramaResponse>(this.apiUrl, request);
  }

  update(id: string, request: UpdateOdontogramaRequest): Observable<OdontogramaResponse> {
    return this.http.put<OdontogramaResponse>(`${this.apiUrl}/${id}`, request);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getHallazgos(odontogramaId: string): Observable<HallazgoResponse[]> {
    return this.http.get<HallazgoResponse[]>(`${this.apiUrl}/${odontogramaId}/hallazgos`);
  }

  createHallazgo(odontogramaId: string, request: CreateHallazgoRequest): Observable<HallazgoResponse> {
    return this.http.post<HallazgoResponse>(`${this.apiUrl}/${odontogramaId}/hallazgos`, request);
  }

  createHallazgoVoz(odontogramaId: string, request: CreateHallazgoVozRequest): Observable<HallazgoResponse[]> {
    return this.http.post<HallazgoResponse[]>(`${this.apiUrl}/${odontogramaId}/hallazgos/voz`, request);
  }

  updateHallazgo(odontogramaId: string, hallazgoId: string, request: UpdateHallazgoRequest): Observable<HallazgoResponse> {
    return this.http.put<HallazgoResponse>(`${this.apiUrl}/${odontogramaId}/hallazgos/${hallazgoId}`, request);
  }

  deleteHallazgo(odontogramaId: string, hallazgoId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${odontogramaId}/hallazgos/${hallazgoId}`);
  }

  loadOdontogramasPorHistoria(historiaClinicaId: string): void {
    this._loading.set(true);
    this.listPorHistoria(historiaClinicaId).subscribe({
      next: (odontogramas) => {
        this._odontogramas.set(odontogramas);
        this._loading.set(false);
      },
      error: () => {
        this._loading.set(false);
      }
    });
  }

  loadOdontograma(id: string): void {
    this._loading.set(true);
    this.getById(id).subscribe({
      next: (odontograma) => {
        this._currentOdontograma.set(odontograma);
        this.loadHallazgos(id);
      },
      error: () => {
        this._loading.set(false);
      }
    });
  }

  loadHallazgos(odontogramaId: string): void {
    this.getHallazgos(odontogramaId).subscribe({
      next: (hallazgos) => {
        this._hallazgos.set(hallazgos);
        this._loading.set(false);
      },
      error: () => {
        this._loading.set(false);
      }
    });
  }
}
