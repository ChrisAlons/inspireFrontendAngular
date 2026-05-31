import { Component, signal, OnInit, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface DashboardStats {
  pacientesTotal: number;
  citasHoy: number;
  atencionesEnCurso: number;
  citasProximas: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  private http = inject(HttpClient);

  stats = signal<DashboardStats>({
    pacientesTotal: 0,
    citasHoy: 0,
    atencionesEnCurso: 0,
    citasProximas: 0
  });
  loading = signal(true);

  ngOnInit(): void {
    this.cargarStats();
  }

  cargarStats(): void {
    this.http.get<DashboardStats>('/api/dashboard/stats').subscribe({
      next: (data) => {
        this.stats.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }
}