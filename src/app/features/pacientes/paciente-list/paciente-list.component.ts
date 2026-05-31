import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PacienteService } from '../../../core/api/paciente.service';
import { PacienteResponse } from '../../../core/models/paciente.model';

@Component({
  selector: 'app-paciente-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './paciente-list.component.html',
  styleUrl: './paciente-list.component.css'
})
export class PacienteListComponent implements OnInit {
  private pacienteService = inject(PacienteService);
  private router = inject(Router);

  searchQuery = signal('');
  showDeleteConfirm = signal(false);
  pacienteToDelete = signal<PacienteResponse | null>(null);

  readonly pacientes = this.pacienteService.pacientes;
  readonly loading = this.pacienteService.loading;
  readonly totalElements = this.pacienteService.totalElements;
  readonly currentPage = this.pacienteService.currentPage;
  readonly totalPages = this.pacienteService.totalPages;

  ngOnInit(): void {
    this.pacienteService.loadPacientes();
  }

  onSearch(): void {
    this.pacienteService.loadPacientes(0, 10, this.searchQuery());
  }

  onPageChange(page: number): void {
    this.pacienteService.loadPacientes(page, 10, this.searchQuery());
  }

  onNewPaciente(): void {
    this.router.navigate(['/pacientes/nuevo']);
  }

  onEditPaciente(id: string): void {
    this.router.navigate(['/pacientes', id, 'editar']);
  }

  onViewPaciente(id: string): void {
    this.router.navigate(['/pacientes', id]);
  }

  onDeletePaciente(paciente: PacienteResponse): void {
    this.pacienteToDelete.set(paciente);
    this.showDeleteConfirm.set(true);
  }

  confirmDelete(): void {
    const paciente = this.pacienteToDelete();
    if (paciente) {
      this.pacienteService.delete(paciente.id).subscribe({
        next: () => {
          this.showDeleteConfirm.set(false);
          this.pacienteToDelete.set(null);
          this.pacienteService.loadPacientes(this.currentPage(), 10, this.searchQuery());
        }
      });
    }
  }

  cancelDelete(): void {
    this.showDeleteConfirm.set(false);
    this.pacienteToDelete.set(null);
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  getPages(): number[] {
    const total = this.totalPages();
    const current = this.currentPage();
    const pages: number[] = [];

    const start = Math.max(0, current - 2);
    const end = Math.min(total - 1, current + 2);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  }
}