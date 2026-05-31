import { Routes } from '@angular/router';

export const planTratamientoRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./plan-tratamiento-list/plan-tratamiento-list.component').then(m => m.PlanTratamientoListComponent)
  },
  {
    path: 'nuevo',
    loadComponent: () =>
      import('./plan-tratamiento-form/plan-tratamiento-form.component').then(m => m.PlanTratamientoFormComponent)
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./plan-tratamiento-detail/plan-tratamiento-detail.component').then(m => m.PlanTratamientoDetailComponent)
  },
  {
    path: ':id/editar',
    loadComponent: () =>
      import('./plan-tratamiento-form/plan-tratamiento-form.component').then(m => m.PlanTratamientoFormComponent)
  }
];
