import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CitaService } from '../../../core/api/cita.service';
import { AuthService } from '../../../core/auth/auth.service';
import { PacienteSelectComponent } from '../../../shared/components/paciente-select/paciente-select.component';
import { PacienteResponse } from '../../../core/models/paciente.model';

@Component({
  selector: 'app-cita-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PacienteSelectComponent],
  templateUrl: './cita-form.component.html',
  styleUrl: './cita-form.component.css'
})
export class CitaFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private citaService = inject(CitaService);
  private authService = inject(AuthService);

  isEdit = signal(false);
  loading = signal(false);
  saving = signal(false);
  citaId = signal<string | null>(null);
  selectedPaciente = signal<PacienteResponse | null>(null);

  form!: FormGroup;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit.set(true);
      this.citaId.set(id);
      this.loadCita(id);
    }

    this.initForm();
  }

  initForm(): void {
    this.form = this.fb.group({
      odontologoId: [this.authService.user()?.personaId || '', Validators.required],
      fechaHoraInicio: ['', Validators.required],
      fechaHoraFin: ['', Validators.required],
      motivo: ['']
    });
  }

  onPacienteSeleccionado(paciente: PacienteResponse | null): void {
    this.selectedPaciente.set(paciente);
  }

  hasError(field: string, error: string): boolean {
    const control = this.form.get(field);
    return !!(control && control.hasError(error) && control.touched);
  }

  validatePaciente(): boolean {
    return this.selectedPaciente() !== null;
  }

  loadCita(id: string): void {
    this.loading.set(true);
    this.citaService.getById(id).subscribe({
      next: (cita) => {
        this.form.patchValue({
          odontologoId: cita.odontologoId,
          fechaHoraInicio: this.formatDateTimeLocal(cita.fechaHoraInicio),
          fechaHoraFin: this.formatDateTimeLocal(cita.fechaHoraFin),
          motivo: cita.motivo
        });
        this.selectedPaciente.set({
          id: cita.pacienteId,
          personaId: '',
          tipoDocumentoCodigo: '',
          numeroDocumento: '',
          nombres: cita.pacienteNombres,
          apellidoPaterno: cita.pacienteApellidoPaterno,
          apellidoMaterno: cita.pacienteApellidoMaterno,
          fechaNacimiento: '',
          sexoCodigo: '',
          celular: '',
          email: '',
          direccion: '',
          codigoHistoria: '',
          lugarNacimiento: '',
          procedencia: '',
          viajesUltimoAnio: '',
          gradoInstruccionCodigo: '',
          ocupacion: '',
          estadoCivilCodigo: '',
          isActive: true,
          createdAt: '',
          updatedAt: ''
        } as PacienteResponse);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid || !this.validatePaciente()) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    const formValue = this.form.value;

    const request = {
      pacienteId: this.selectedPaciente()!.id,
      odontologoId: formValue.odontologoId,
      fechaHoraInicio: new Date(formValue.fechaHoraInicio).toISOString(),
      fechaHoraFin: new Date(formValue.fechaHoraFin).toISOString(),
      motivo: formValue.motivo
    };

    if (this.isEdit() && this.citaId()) {
      this.citaService.update(this.citaId()!, request).subscribe({
        next: () => {
          this.saving.set(false);
          this.router.navigate(['/citas']);
        },
        error: () => {
          this.saving.set(false);
        }
      });
    } else {
      this.citaService.create(request).subscribe({
        next: () => {
          this.saving.set(false);
          this.router.navigate(['/citas']);
        },
        error: () => {
          this.saving.set(false);
        }
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/citas']);
  }

  private formatDateTimeLocal(isoString: string): string {
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }
}