# AGENTS.md

> Ver `CLAUDE.md` para contexto completo de arquitectura y convenciones.

## Visión General del Proyecto

Frontend Angular 21 para sistema SaaS de gestión odontológica. MVP monousuario.

**Stack:**
- Angular 21 + Tailwind v4
- State management: Angular Signals
- HTTP: HttpClient con interceptores
- Routing: Angular Router con lazy loading

## Comandos

```bash
cd ../inspireFrontendAngular
npm start                           # dev server en http://localhost:4200
npm run build                       # build de producción
```

## Arquitectura

- `src/app/core/` — modelos, servicios API, auth, guards
- `src/app/features/` — componentes por módulo (list, form, detail)
- `src/app/shared/` — componentes reutilizables
- `src/app/layout/` — layouts principales

## Estructura de Archivos

```
src/app/
├── core/
│   ├── api/                  # Servicios HTTP
│   │   ├── auth.service.ts
│   │   ├── cita.service.ts
│   │   ├── paciente.service.ts
│   │   ├── atencion.service.ts
│   │   ├── odontograma.service.ts
│   │   └── plan-tratamiento.service.ts
│   ├── auth/
│   │   ├── auth.service.ts
│   │   ├── auth.interceptor.ts
│   │   └── auth.guard.ts
│   ├── models/               # Interfaces TypeScript
│   │   ├── auth.model.ts
│   │   ├── paciente.model.ts
│   │   ├── cita.model.ts
│   │   ├── atencion.model.ts
│   │   ├── odontograma.model.ts
│   │   ├── catalogo.model.ts    # Procedimientos, piezas, caras locales
│   │   └── plan-tratamiento.model.ts
│   └── guards/
│       └── auth.guard.ts
├── features/
│   ├── auth/login/
│   ├── pacientes/
│   │   ├── paciente-list/
│   │   ├── paciente-form/
│   │   └── patient-detail/
│   ├── citas/
│   │   ├── cita-list/
│   │   ├── cita-form/
│   │   └── cita-detail/
│   ├── atenciones/
│   │   ├── atencion-list/
│   │   └── atencion-detail/
│   ├── odontogramas/
│   │   ├── odontograma-list/
│   │   └── odontograma-grid/
│   └── plan-tratamiento/
│       ├── plan-tratamiento-list/
│       ├── plan-tratamiento-detail/
│       └── plan-tratamiento-form/
├── shared/
│   └── components/
│       └── paciente-select/   # Selector de paciente con búsqueda
└── layout/
    └── main-layout/
```

## Modelos (TypeScript)

```typescript
// cita.model.ts
export interface CitaResponse {
  id: string;
  pacienteId: string;
  odontologoId: string;
  historiaClinicaId: string;
  pacienteNombres: string;
  pacienteApellidoPaterno: string;
  pacienteApellidoMaterno: string;
  pacienteNumeroDocumento: string;
  fechaHoraInicio: string;
  fechaHoraFin: string;
  estado: EstadoCita;
  motivo: string;
}

// atencion.model.ts
export interface AtencionResponse {
  id: string;
  citaId: string;
  historiaClinicaId: string;
  odontologoId: string;
  fechaInicio: string;
  fechaFin: string | null;
  notas: string;
}
```

## Convenciones

### Services
Usan Angular Signals para estado reactivo:
```typescript
private _data = signal<Type[]>([]);
readonly data = this._data.asReadonly();
readonly loading = this._loading.asReadonly();
```

### Components
- Standalone components (sin NgModule)
- Lazy loading en rutas
- `inject()` para dependencias
- Signals para estado local

### Rutas
```typescript
{
  path: 'citas',
  loadComponent: () =>
    import('./features/citas/cita-list/cita-list.component')
      .then(m => m.CitaListComponent)
}
```

## Módulos Implementados

| Módulo | Componentes | Estado |
|--------|-------------|--------|
| Auth | Login | ✅ |
| Dashboard | Dashboard | ✅ |
| Pacientes | List, Form, Detail | ✅ |
| Citas | List, Form, Detail | ✅ |
| Atenciones | List, Detail | ✅ |
| Odontograma | List, Grid visual interactivo | ✅ |
| Plan Tratamiento | List, Detail, Form | ✅ |

## Catálogos Locales

- Procedimientos: 26 códigos (CONSULTA, OBTURACION, ENDODONCIA, etc.)
- Piezas dentales: 49 registros FDI (0, 11-18, 21-28, 31-38, 41-48)
- Caras dentales: 8 códigos (VESTIBULAR, PALATINO, LINGUAL, MESIAL, DISTAL, OCLUSAL, INCISAL, NO_APLICA)

## Endpoints Utilizados

| Servicio | Métodos |
|----------|---------|
| AuthService | `login()` |
| PacienteService | `loadPacientes()`, `getById()`, `create()`, `update()`, `delete()` |
| CitaService | `loadCitas()`, `getById()`, `create()`, `update()`, `delete()`, `cambiarEstado()` |
| AtencionService | `loadEnCurso()`, `getById()`, `cerrar()` |
| OdontogramaService | `loadOdontogramasPorHistoria()`, `loadOdontograma()`, `loadHallazgos()`, `createHallazgo()`, `deleteHallazgo()` |
| PlanTratamientoService | `loadPlanesPorHistoria()`, `getById()`, `create()`, `update()`, `cambiarEstado()`, `getDetalles()`, `createDetalle()`, `updateDetalle()`, `deleteDetalle()`, `createTratamientoEjecutado()` |

## Interceptores

- `AuthInterceptor` — añade `Authorization: Bearer <token>` a todas las peticiones
- `AuthGuard` — protege rutas que requieren autenticación

## ambiente

- Backend: `http://localhost:8080`
- Frontend: `http://localhost:4200`
- Proxy configurado en `proxy.conf.json`

## Notas

- El selector de paciente (`paciente-select`) es reutilizable para crear citas
- Los DTOs del frontend coinciden con los del backend
- `historiaClinicaId` viene en `CitaResponse` para crear atenciones desde una cita
- El Odontograma tiene catálogos locales (32 piezas dentales, 5 caras, 12 condiciones) para el MVP
- El grid visual muestra los 4 cuadrantes de la dentición permanente (FDI)

## Plan de Tratamiento

**Rutas:**
- `/planes-tratamiento?historiaClinicaId=xxx` — Lista de planes por HC
- `/planes-tratamiento/nuevo?historiaClinicaId=xxx&atencionId=xxx` — Crear plan
- `/planes-tratamiento/:id` — Ver detalle del plan
- `/planes-tratamiento/:id/editar` — Editar plan y procedimientos

**Flujo de estados:** PROPUESTO → ACEPTADO/RECHAZADO → EN_EJECUCION → COMPLETADO/PARCIAL

**Catálogos locales:**
- Procedimientos: 26 tipos con precios base (ver `catalogo.model.ts`)
- Piezas: 0 (No aplica), 11-18 (Q1), 21-28 (Q2), 31-38 (Q3), 41-48 (Q4)
- Caras: VESTIBULAR (V), PALATINO (P), LINGUAL (L), MESIAL (M), DISTAL (D), OCLUSAL (O), INCISAL (I), NO_APLICA (NA)

**Nombres resueltos localmente:** El backend devuelve solo códigos, el frontend resuelve descripciones desde catálogos locales