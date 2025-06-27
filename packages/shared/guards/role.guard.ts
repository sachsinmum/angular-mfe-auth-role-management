import { Injectable } from '@angular/core';
import { 
  CanActivate, 
  ActivatedRouteSnapshot, 
  RouterStateSnapshot, 
  Router,
  UrlTree 
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { MenuService } from '../services/menu.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private menuService: MenuService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return false;
    }

    const screenId = route.data['screenId'];
    const requiredAction = route.data['action'] || 'VIEW';

    if (!screenId) {
      console.warn('No screenId provided for RoleGuard');
      return true;
    }

    if (!this.menuService.hasPermission(screenId, requiredAction)) {
      this.router.navigate(['/unauthorized']);
      return false;
    }

    return true;
  }
}
