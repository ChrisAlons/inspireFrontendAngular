import { Component, OnInit, OnDestroy, inject, signal, effect, Injector, runInInjectionContext } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { OdontogramaService } from '../../../core/api/odontograma.service';
import {
  HallazgoResponse,
  CreateHallazgoRequest,
  PiezaDental,
  CondicionDental
} from '../../../core/models/odontograma.model';

export interface PiezaConHallazgo {
  pieza: PiezaDental;
  hallazgosPorCara: Map<string, HallazgoResponse[]>;
  tieneHallazgos: boolean;
}

interface CaraInfo {
  codigo: string;
  nombre: string;
  nombreCorto: string;
}

@Component({
  selector: 'app-odontograma-grid',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './odontograma-grid.component.html',
  styleUrl: './odontograma-grid.component.css'
})
export class OdontogramaGridComponent implements OnInit, OnDestroy {
  private injector = inject(Injector);
  private odontogramaService = inject(OdontogramaService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  readonly odontograma = this.odontogramaService.currentOdontograma;
  readonly loading = this.odontogramaService.loading;
  readonly catalogos = this.odontogramaService.catalogos;
  readonly hallazgos = this.odontogramaService.hallazgos;

  readonly condiciones = signal<CondicionDental[]>([]);

  selectedPieza = signal<PiezaConHallazgo | null>(null);
  selectedCara = signal<string | null>(null);
  selectedCondicion = signal<string | null>(null);
  showHallazgoModal = signal(false);
  showObservacionesModal = signal(false);
  observacionesText = signal('');
  notasText = '';

  private odontogramaId = signal<string | null>(null);

  readonly availableFaces: CaraInfo[] = [
    { codigo: 'VESTIBULAR', nombre: 'Vestibular', nombreCorto: 'V' },
    { codigo: 'MESIAL', nombre: 'Mesial', nombreCorto: 'M' },
    { codigo: 'DISTAL', nombre: 'Distal', nombreCorto: 'D' },
    { codigo: 'LINGUAL', nombre: 'Lingual', nombreCorto: 'L' },
    { codigo: 'OCLUSAL', nombre: 'Oclusal', nombreCorto: 'O' }
  ];

  private _cuadrante1: PiezaConHallazgo[] = [];
  private _cuadrante2: PiezaConHallazgo[] = [];
  private _cuadrante3: PiezaConHallazgo[] = [];
  private _cuadrante4: PiezaConHallazgo[] = [];

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.odontogramaId.set(id);
      this.odontogramaService.loadOdontograma(id);
    }

    this.odontogramaService.loadCatalogos();

    runInInjectionContext(this.injector, () => {
      effect(() => {
        const cat = this.catalogos();
        const hall = this.hallazgos();

        if (cat && cat.condiciones.length > 0) {
          this.condiciones.set(cat.condiciones);
        }

        if (cat && hall) {
          this.buildCuadrantes(cat, hall);
        }
      });
    });
  }

  ngOnDestroy(): void {}

  private buildCuadrantes(catalogos: any, hallazgos: HallazgoResponse[]): void {
    this._cuadrante1 = this.buildCuadrante(1, [18, 17, 16, 15, 14, 13, 12, 11], catalogos, hallazgos);
    this._cuadrante2 = this.buildCuadrante(2, [21, 22, 23, 24, 25, 26, 27, 28], catalogos, hallazgos);
    this._cuadrante3 = this.buildCuadrante(3, [31, 32, 33, 34, 35, 36, 37, 38], catalogos, hallazgos);
    this._cuadrante4 = this.buildCuadrante(4, [48, 47, 46, 45, 44, 43, 42, 41], catalogos, hallazgos);
  }

  private buildCuadrante(cuadrante: number, ordenFDI: number[], catalogos: any, hallazgos: HallazgoResponse[]): PiezaConHallazgo[] {
    const todasPiezas = catalogos?.piezas?.filter((p: PiezaDental) => p.cuadrante === cuadrante) || [];

    return ordenFDI.map(idFDI => {
      const pieza = todasPiezas.find((p: PiezaDental) => p.id === idFDI);
      const piezaActual = pieza || { id: idFDI, cuadrante, posicion: 0, nombre: `Pieza ${idFDI}`, isDeciduo: false };

      const hallazgosPorCara = new Map<string, HallazgoResponse[]>();
      const piezaHallazgos = hallazgos.filter(h => h.piezaId === idFDI);

      this.availableFaces.forEach(cara => {
        const hallgc = piezaHallazgos.filter(h => h.caraCodigo === cara.codigo);
        if (hallgc.length > 0) {
          hallazgosPorCara.set(cara.codigo, hallgc);
        }
      });

      return {
        pieza: piezaActual,
        hallazgosPorCara,
        tieneHallazgos: piezaHallazgos.length > 0
      };
    });
  }

  getCuadrante1(): PiezaConHallazgo[] {
    return this._cuadrante1;
  }

  getCuadrante2(): PiezaConHallazgo[] {
    return this._cuadrante2;
  }

  getCuadrante3(): PiezaConHallazgo[] {
    return this._cuadrante3;
  }

  getCuadrante4(): PiezaConHallazgo[] {
    return this._cuadrante4;
  }

  getFaceColor(item: PiezaConHallazgo, cara: string): string {
    const faceCode = this.getFaceCode(cara);
    const hallazgos = item.hallazgosPorCara.get(faceCode);
    if (hallazgos && hallazgos.length > 0) {
      return this.getColorForCondicion(hallazgos[0].condicionCodigo);
    }
    return 'transparent';
  }

  getFaceCode(shortCode: string): string {
    const map: Record<string, string> = {
      'V': 'VESTIBULAR',
      'M': 'MESIAL',
      'D': 'DISTAL',
      'L': 'LINGUAL',
      'O': 'OCLUSAL'
    };
    return map[shortCode] || shortCode;
  }

  getColorForCondicion(codigo: string): string {
    const cond = this.condiciones().find(c => c.codigo === codigo);
    return cond?.colorHex || '#6b7280';
  }

  getCondicionLabel(codigo: string): string {
    const cond = this.condiciones().find(c => c.codigo === codigo);
    return cond?.descripcion || codigo;
  }

  onToothClick(item: PiezaConHallazgo): void {
    this.selectedPieza.set(item);
    this.selectedCara.set(null);
    this.selectedCondicion.set(null);
    this.notasText = '';
    this.showHallazgoModal.set(true);
  }

  selectCara(codigo: string): void {
    this.selectedCara.set(codigo);
    this.selectedCondicion.set(null);
  }

  selectCondicion(codigo: string): void {
    this.selectedCondicion.set(codigo);
  }

  onAddHallazgo(): void {
    const item = this.selectedPieza();
    const cara = this.selectedCara();
    const condicion = this.selectedCondicion();
    if (!item || !cara || !condicion) return;

    const request: CreateHallazgoRequest = {
      piezaId: item.pieza.id,
      caraCodigo: cara,
      condicionCodigo: condicion,
      notas: this.notasText
    };

    const odontoId = this.odontogramaId();
    if (odontoId) {
      this.odontogramaService.createHallazgo(odontoId, request).subscribe({
        next: (newHallazgo) => {
          this.odontogramaService.loadHallazgos(odontoId);
          this.selectedCara.set(null);
          this.selectedCondicion.set(null);
          this.notasText = '';
        },
        error: (err) => {
          console.error('Error al guardar hallazgo:', err);
          alert('Error al guardar el hallazgo');
        }
      });
    }
  }

  onDeleteHallazgo(hallazgo: HallazgoResponse): void {
    if (confirm('¿Eliminar este hallazgo?')) {
      const odontoId = this.odontogramaId();
      if (odontoId) {
        this.odontogramaService.deleteHallazgo(odontoId, hallazgo.id).subscribe({
          next: () => {
            this.odontogramaService.loadHallazgos(odontoId);
          },
          error: (err) => {
            console.error('Error al eliminar:', err);
          }
        });
      }
    }
  }

  getHallazgosPieza(piezaId: number | undefined): HallazgoResponse[] {
    if (!piezaId) return [];
    return this.hallazgos().filter(h => h.piezaId === piezaId);
  }

  continueWithSamePieza(): void {
    this.selectedCara.set(null);
    this.selectedCondicion.set(null);
  }

  closeModal(): void {
    this.showHallazgoModal.set(false);
    this.selectedPieza.set(null);
    this.selectedCara.set(null);
    this.selectedCondicion.set(null);
    this.notasText = '';
  }

  onSaveObservaciones(): void {
    const odontoId = this.odontogramaId();
    const odonto = this.odontograma();
    if (odontoId && odonto) {
      this.odontogramaService.update(odontoId, { observaciones: this.observacionesText() }).subscribe({
        next: () => {
          this.odontogramaService.loadOdontograma(odontoId);
          this.showObservacionesModal.set(false);
        },
        error: (err) => {
          console.error('Error al guardar observaciones:', err);
        }
      });
    }
  }

  openObservaciones(): void {
    const odonto = this.odontograma();
    if (odonto) {
      this.observacionesText.set(odonto.observaciones || '');
      this.showObservacionesModal.set(true);
    }
  }

  onBack(): void {
    const odonto = this.odontograma();
    if (odonto) {
      this.router.navigate(['/odontogramas'], { queryParams: { historiaClinicaId: odonto.historiaClinicaId } });
    } else {
      this.router.navigate(['/odontogramas']);
    }
  }
}
