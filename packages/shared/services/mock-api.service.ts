import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { User, LoginResponse } from './auth.service';
import { Screen } from './menu.service';

@Injectable({
  providedIn: 'root'
})
export class MockApiService {
  private mockUsers: User[] = [
    {
      id: '1',
      email: 'admin@example.com',
      roles: ['ADMIN'],
      mfaEnabled: true,
      forcePasswordChange: false
    },
    {
      id: '2',
      email: 'user@example.com',
      roles: ['USER'],
      mfaEnabled: false,
      forcePasswordChange: true
    }
  ];

  private mockScreens: Screen[] = [
    {
      screenId: 'DASH',
      screenName: 'Dashboard',
      routePath: '/dashboard',
      iconName: 'pi pi-home',
      isMenuItem: true,
      actions: ['VIEW']
    },
    {
      screenId: 'USERS',
      screenName: 'User Management',
      routePath: '/users',
      iconName: 'pi pi-users',
      isMenuItem: true,
      actions: ['VIEW', 'CREATE', 'EDIT', 'DELETE']
    },
    {
      screenId: 'ROLES',
      screenName: 'Role Management',
      routePath: '/roles',
      iconName: 'pi pi-key',
      isMenuItem: true,
      actions: ['VIEW', 'CREATE', 'EDIT', 'DELETE'],
      parentScreenId: 'USERS'
    }
  ];

  login(email: string, password: string): Observable<LoginResponse> {
    const user = this.mockUsers.find(u => u.email === email);
    
    if (!user) {
      return throwError(() => new Error('Invalid credentials'));
    }

    return of({
      token: 'mock-jwt-token',
      user,
      requiresMfa: user.mfaEnabled,
      forcePasswordChange: user.forcePasswordChange
    }).pipe(delay(1000)); // Simulate network delay
  }

  verifyMfa(code: string): Observable<LoginResponse> {
    if (code === '123456') {
      return of({
        token: 'mock-jwt-token',
        user: this.mockUsers[0],
        requiresMfa: false,
        forcePasswordChange: false
      }).pipe(delay(1000));
    }
    return throwError(() => new Error('Invalid MFA code'));
  }

  changePassword(newPassword: string): Observable<LoginResponse> {
    if (newPassword.length >= 8) {
      return of({
        token: 'mock-jwt-token',
        user: this.mockUsers[1],
        requiresMfa: false,
        forcePasswordChange: false
      }).pipe(delay(1000));
    }
    return throwError(() => new Error('Password must be at least 8 characters'));
  }

  getUserProfile(): Observable<User> {
    return of(this.mockUsers[0]).pipe(delay(1000));
  }

  getMenuItems(): Observable<Screen[]> {
    return of(this.mockScreens).pipe(delay(1000));
  }
}
