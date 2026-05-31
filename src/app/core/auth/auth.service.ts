import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { LoginRequest, LoginResponse, UsuarioPrincipal } from '../models/auth.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'inspire_token';
  private readonly USER_KEY = 'inspire_user';

  private _user = signal<UsuarioPrincipal | null>(this.loadUser());
  private _isAuthenticated = signal<boolean>(!!this.loadToken());

  readonly user = this._user.asReadonly();
  readonly isAuthenticated = this._isAuthenticated.asReadonly();
  readonly userFullName = computed(() => {
    const u = this._user();
    return u ? `${u.nombres} ${u.apellidoPaterno}` : '';
  });

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  login(request: LoginRequest) {
    return this.http.post<LoginResponse>('/api/auth/login', request).pipe(
      tap(response => {
        localStorage.setItem(this.TOKEN_KEY, response.token);
        const principal: UsuarioPrincipal = {
          usuarioId: response.usuarioId,
          personaId: response.personaId,
          email: response.email,
          nombres: response.nombres,
          apellidoPaterno: response.apellidoPaterno
        };
        localStorage.setItem(this.USER_KEY, JSON.stringify(principal));
        this._user.set(principal);
        this._isAuthenticated.set(true);
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this._user.set(null);
    this._isAuthenticated.set(false);
    this.router.navigate(['/auth/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  private loadToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  private loadUser(): UsuarioPrincipal | null {
    const stored = localStorage.getItem(this.USER_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return null;
      }
    }
    return null;
  }
}