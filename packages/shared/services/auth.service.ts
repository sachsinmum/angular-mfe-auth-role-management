import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';

export interface User {
  id: string;
  email: string;
  roles: string[];
  mfaEnabled: boolean;
  forcePasswordChange: boolean;
}

export interface LoginResponse {
  token: string;
  user: User;
  requiresMfa: boolean;
  forcePasswordChange: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private readonly TOKEN_KEY = 'auth_token';

  constructor(private http: HttpClient) {
    // Check for existing token on startup
    const token = this.getToken();
    if (token) {
      this.loadUserProfile().subscribe();
    }
  }

  login(email: string, password: string): Observable<LoginResponse> {
    // Mock API call - replace with actual API endpoint
    return this.http.post<LoginResponse>('/api/auth/login', { email, password })
      .pipe(
        tap(response => {
          if (!response.requiresMfa && !response.forcePasswordChange) {
            this.setToken(response.token);
            this.currentUserSubject.next(response.user);
          }
        }),
        catchError(error => {
          console.error('Login failed:', error);
          return throwError(() => new Error('Login failed. Please check your credentials.'));
        })
      );
  }

  verifyMfa(code: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>('/api/auth/verify-mfa', { code })
      .pipe(
        tap(response => {
          if (!response.forcePasswordChange) {
            this.setToken(response.token);
            this.currentUserSubject.next(response.user);
          }
        }),
        catchError(error => {
          console.error('MFA verification failed:', error);
          return throwError(() => new Error('Invalid MFA code.'));
        })
      );
  }

  changePassword(newPassword: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>('/api/auth/change-password', { newPassword })
      .pipe(
        tap(response => {
          this.setToken(response.token);
          this.currentUserSubject.next(response.user);
        }),
        catchError(error => {
          console.error('Password change failed:', error);
          return throwError(() => new Error('Password change failed. Please try again.'));
        })
      );
  }

  logout(): void {
    this.removeToken();
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  hasRole(role: string): boolean {
    const user = this.currentUserSubject.value;
    return user ? user.roles.includes(role) : false;
  }

  private loadUserProfile(): Observable<User> {
    return this.http.get<User>('/api/user/profile')
      .pipe(
        tap(user => this.currentUserSubject.next(user)),
        catchError(error => {
          console.error('Failed to load user profile:', error);
          this.logout();
          return throwError(() => new Error('Failed to load user profile.'));
        })
      );
  }

  private setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  private getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  private removeToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }
}
