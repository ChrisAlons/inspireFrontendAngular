import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { PacienteService } from '../../../core/api/paciente.service';
import { PacienteResponse } from '../../../core/models/paciente.model';

@Component({
  selector: 'app-paciente-select',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './paciente-select.component.html',
  styleUrl: './paciente-select.component.css'
})
export class PacienteSelectComponent implements OnInit {
  @Output() pacienteSeleccionado = new EventEmitter<PacienteResponse | null>();

  searchTerm = '';
  showDropdown = false;
  selectedPaciente: PacienteResponse | null = null;
  loading = false;
  resultados: PacienteResponse[] = [];

  private searchSubject = new Subject<string>();

  constructor(private pacienteService: PacienteService) {}

  ngOnInit(): void {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(term => {
      this.buscarPacientes(term);
    });

    this.loadInitialPacientes();
  }

  loadInitialPacientes(): void {
    this.loading = true;
    this.pacienteService.loadPacientes(0, 20, '');
    setTimeout(() => {
      this.resultados = this.pacienteService.pacientes();
      this.loading = false;
    }, 100);
  }

  onSearch(term: string): void {
    this.searchTerm = term;
    if (term.length >= 2) {
      this.searchSubject.next(term);
      this.showDropdown = true;
    } else if (term.length === 0) {
      this.loadInitialPacientes();
      this.showDropdown = false;
    }
  }

  buscarPacientes(term: string): void {
    this.loading = true;
    this.pacienteService.loadPacientes(0, 20, term);
    setTimeout(() => {
      this.resultados = this.pacienteService.pacientes();
      this.loading = false;
    }, 100);
  }

  selectPaciente(paciente: PacienteResponse): void {
    this.selectedPaciente = paciente;
    this.searchTerm = this.getNombreCompleto(paciente);
    this.showDropdown = false;
    this.pacienteSeleccionado.emit(paciente);
  }

  clearSelection(): void {
    this.selectedPaciente = null;
    this.searchTerm = '';
    this.resultados = [];
    this.pacienteSeleccionado.emit(null);
    this.loadInitialPacientes();
  }

  onFocus(): void {
    if (this.searchTerm.length > 0) {
      this.showDropdown = true;
    }
  }

  onBlur(): void {
    setTimeout(() => {
      this.showDropdown = false;
    }, 200);
  }

  getNombreCompleto(p: PacienteResponse): string {
    return `${p.nombres} ${p.apellidoPaterno} ${p.apellidoMaterno}`.trim();
  }

  getDisplayName(): string {
    if (this.selectedPaciente) {
      return `${this.getNombreCompleto(this.selectedPaciente)} (${this.selectedPaciente.numeroDocumento})`;
    }
    return this.searchTerm;
  }
}