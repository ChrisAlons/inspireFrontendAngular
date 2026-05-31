import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PacienteService } from '../../../core/api/paciente.service';
import { PacienteResponse } from '../../../core/models/paciente.model';

@Component({
  selector: 'app-patient-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './patient-detail.component.html',
  styleUrl: './patient-detail.component.css'
})
export class PatientDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private pacienteService = inject(PacienteService);

  paciente = signal<PacienteResponse | null>(null);
  loading = signal(true);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.pacienteService.getById(id).subscribe({
        next: (data: PacienteResponse) => {
          this.paciente.set(data);
          this.loading.set(false);
        },
        error: () => {
          this.loading.set(false);
        }
      });
    }
  }

  onBack(): void {
    this.router.navigate(['/pacientes']);
  }

  onEdit(): void {
    const paciente = this.paciente();
    if (paciente) {
      this.router.navigate(['/pacientes', paciente.id, 'editar']);
    }
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-PE', { day: '2-digit', month: 'long', year: 'numeric' });
  }

  getSexoLabel(codigo: string): string {
    return codigo === 'M' ? 'Masculino' : 'Femenino';
  }
}