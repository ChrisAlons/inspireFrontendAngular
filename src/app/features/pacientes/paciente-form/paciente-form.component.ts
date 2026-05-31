import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PacienteService } from '../../../core/api/paciente.service';

@Component({
  selector: 'app-paciente-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './paciente-form.component.html',
  styleUrl: './paciente-form.component.css'
})
export class PacienteFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private pacienteService = inject(PacienteService);

  isEdit = signal(false);
  loading = signal(false);
  saving = signal(false);
  pacienteId = signal<string | null>(null);

  form!: FormGroup;

  tipoDocumentoOptions = [
    { value: 'DNI', label: 'DNI' },
    { value: 'CE', label: 'Carné de Extranjería' },
    { value: 'PASAPORTE', label: 'Pasaporte' },
    { value: 'RUC', label: 'RUC' }
  ];

  sexoOptions = [
    { value: 'M', label: 'Masculino' },
    { value: 'F', label: 'Femenino' }
  ];

  gradoInstruccionOptions = [
    { value: 'SIN_INSTRUCCION', label: 'Sin instrucción' },
    { value: 'PRIMARIA', label: 'Primaria' },
    { value: 'SECUNDARIA', label: 'Secundaria' },
    { value: 'TECNICO', label: 'Técnico' },
    { value: 'SUPERIOR', label: 'Superior' },
    { value: 'POSGRADO', label: 'Posgrado' }
  ];

  estadoCivilOptions = [
    { value: 'SOLTERO', label: 'Soltero/a' },
    { value: 'CASADO', label: 'Casado/a' },
    { value: 'DIVORCIADO', label: 'Divorciado/a' },
    { value: 'VIUDO', label: 'Viudo/a' },
    { value: 'CONVIVIENTE', label: 'Conviviente' },
    { value: 'SEPARADO', label: 'Separado/a' }
  ];

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit.set(true);
      this.pacienteId.set(id);
      this.loadPaciente(id);
    }

    this.initForm();
  }

  initForm(): void {
    this.form = this.fb.group({
      // Persona fields
      tipoDocumentoCodigo: ['DNI', Validators.required],
      numeroDocumento: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(12)]],
      nombres: ['', [Validators.required, Validators.minLength(2)]],
      apellidoPaterno: ['', [Validators.required, Validators.minLength(2)]],
      apellidoMaterno: [''],
      fechaNacimiento: ['', Validators.required],
      sexoCodigo: ['M', Validators.required],
      celular: [''],
      email: ['', Validators.email],
      direccion: [''],
      // Paciente fields
      lugarNacimiento: [''],
      procedencia: [''],
      viajesUltimoAnio: [''],
      gradoInstruccionCodigo: ['SUPERIOR', Validators.required],
      ocupacion: [''],
      estadoCivilCodigo: ['SOLTERO', Validators.required]
    });
  }

  loadPaciente(id: string): void {
    this.loading.set(true);
    this.pacienteService.getById(id).subscribe({
      next: (paciente) => {
        this.form.patchValue({
          tipoDocumentoCodigo: paciente.tipoDocumentoCodigo,
          numeroDocumento: paciente.numeroDocumento,
          nombres: paciente.nombres,
          apellidoPaterno: paciente.apellidoPaterno,
          apellidoMaterno: paciente.apellidoMaterno,
          fechaNacimiento: paciente.fechaNacimiento,
          sexoCodigo: paciente.sexoCodigo,
          celular: paciente.celular,
          email: paciente.email,
          direccion: paciente.direccion,
          lugarNacimiento: paciente.lugarNacimiento,
          procedencia: paciente.procedencia,
          viajesUltimoAnio: paciente.viajesUltimoAnio,
          gradoInstruccionCodigo: paciente.gradoInstruccionCodigo,
          ocupacion: paciente.ocupacion,
          estadoCivilCodigo: paciente.estadoCivilCodigo
        });
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    const formValue = this.form.value;

    if (this.isEdit() && this.pacienteId()) {
      this.pacienteService.update(this.pacienteId()!, formValue).subscribe({
        next: () => {
          this.saving.set(false);
          this.router.navigate(['/pacientes']);
        },
        error: () => {
          this.saving.set(false);
        }
      });
    } else {
      this.pacienteService.create(formValue).subscribe({
        next: () => {
          this.saving.set(false);
          this.router.navigate(['/pacientes']);
        },
        error: () => {
          this.saving.set(false);
        }
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/pacientes']);
  }

  hasError(field: string, error: string): boolean {
    const control = this.form.get(field);
    return !!(control && control.hasError(error) && control.touched);
  }
}