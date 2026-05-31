import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { OdontogramaService } from '../../../core/api/odontograma.service';
import { OdontogramaResponse } from '../../../core/models/odontograma.model';

@Component({
  selector: 'app-odontograma-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './odontograma-list.component.html',
  styleUrl: './odontograma-list.component.css'
})
export class OdontogramaListComponent implements OnInit {
  private odontogramaService = inject(OdontogramaService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  readonly odontogramas = this.odontogramaService.odontogramas;
  readonly loading = this.odontogramaService.loading;

  historiaClinicaId = signal<string | null>(null);

  ngOnInit(): void {
    const historiaId = this.route.snapshot.queryParamMap.get('historiaClinicaId');
    if (historiaId) {
      this.historiaClinicaId.set(historiaId);
      this.odontogramaService.loadOdontogramasPorHistoria(historiaId);
    }
  }

  onViewOdontograma(odontograma: OdontogramaResponse): void {
    this.router.navigate(['/odontogramas', odontograma.id]);
  }

  onNewOdontograma(): void {
    const historiaId = this.historiaClinicaId();
    if (historiaId) {
      this.router.navigate(['/odontogramas/nuevo'], { queryParams: { historiaClinicaId: historiaId } });
    }
  }

  onBack(): void {
    this.router.navigate(['/pacientes']);
  }

  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-PE', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }

  getTipoLabel(isInicial: boolean): string {
    return isInicial ? 'Inicial' : 'Seguimiento';
  }
}
