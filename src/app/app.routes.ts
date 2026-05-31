import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('./features/auth/login/login.component').then(m => m.LoginComponent)
      }
    ]
  },
  {
    path: '',
    loadComponent: () =>
      import('./layout/main-layout/main-layout.component').then(m => m.MainLayoutComponent),
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'pacientes',
        loadComponent: () =>
          import('./features/pacientes/paciente-list/paciente-list.component').then(m => m.PacienteListComponent)
      },
      {
        path: 'pacientes/nuevo',
        loadComponent: () =>
          import('./features/pacientes/paciente-form/paciente-form.component').then(m => m.PacienteFormComponent)
      },
      {
        path: 'pacientes/:id',
        loadComponent: () =>
          import('./features/pacientes/patient-detail/patient-detail.component').then(m => m.PatientDetailComponent)
      },
      {
        path: 'pacientes/:id/editar',
        loadComponent: () =>
          import('./features/pacientes/paciente-form/paciente-form.component').then(m => m.PacienteFormComponent)
      },
      {
        path: 'citas',
        loadComponent: () =>
          import('./features/citas/cita-list/cita-list.component').then(m => m.CitaListComponent)
      },
      {
        path: 'citas/nuevo',
        loadComponent: () =>
          import('./features/citas/cita-form/cita-form.component').then(m => m.CitaFormComponent)
      },
      {
        path: 'citas/:id',
        loadComponent: () =>
          import('./features/citas/cita-detail/cita-detail.component').then(m => m.CitaDetailComponent)
      },
      {
        path: 'citas/:id/editar',
        loadComponent: () =>
          import('./features/citas/cita-form/cita-form.component').then(m => m.CitaFormComponent)
      },
      {
        path: 'atenciones',
        loadComponent: () =>
          import('./features/atenciones/atencion-list/atencion-list.component').then(m => m.AtencionListComponent)
      },
      {
        path: 'atenciones/:id',
        loadComponent: () =>
          import('./features/atenciones/atencion-detail/atencion-detail.component').then(m => m.AtencionDetailComponent)
      },
      {
        path: 'odontogramas',
        loadComponent: () =>
          import('./features/odontogramas/odontograma-list/odontograma-list.component').then(m => m.OdontogramaListComponent)
      },
      {
        path: 'odontogramas/:id',
        loadComponent: () =>
          import('./features/odontogramas/odontograma-grid/odontograma-grid.component').then(m => m.OdontogramaGridComponent)
      },
      {
        path: 'planes-tratamiento',
        loadComponent: () =>
          import('./features/plan-tratamiento/plan-tratamiento-list/plan-tratamiento-list.component').then(m => m.PlanTratamientoListComponent)
      },
      {
        path: 'planes-tratamiento/nuevo',
        loadComponent: () =>
          import('./features/plan-tratamiento/plan-tratamiento-form/plan-tratamiento-form.component').then(m => m.PlanTratamientoFormComponent)
      },
      {
        path: 'planes-tratamiento/:id',
        loadComponent: () =>
          import('./features/plan-tratamiento/plan-tratamiento-detail/plan-tratamiento-detail.component').then(m => m.PlanTratamientoDetailComponent)
      },
      {
        path: 'planes-tratamiento/:id/editar',
        loadComponent: () =>
          import('./features/plan-tratamiento/plan-tratamiento-form/plan-tratamiento-form.component').then(m => m.PlanTratamientoFormComponent)
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '**',
    redirectTo: '/auth/login'
  }
];