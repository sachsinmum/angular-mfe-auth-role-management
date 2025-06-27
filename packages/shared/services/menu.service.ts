import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

export interface Screen {
  screenId: string;
  screenName: string;
  routePath: string;
  iconName: string;
  isMenuItem: boolean;
  actions: string[];
  parentScreenId?: string;
}

export interface MenuItem {
  screenId: string;
  screenName: string;
  routePath: string;
  iconName: string;
  isMenuItem: boolean;
  actions: string[];
  children?: MenuItem[];
}

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private menuItemsSubject = new BehaviorSubject<MenuItem[]>([]);
  public menuItems$ = this.menuItemsSubject.asObservable();

  constructor(private http: HttpClient) {}

  loadMenu(): Observable<MenuItem[]> {
    return this.http.get<Screen[]>('/api/menu').pipe(
      map(screens => this.buildMenuTree(screens)),
      tap(menuItems => this.menuItemsSubject.next(menuItems))
    );
  }

  private buildMenuTree(screens: Screen[]): MenuItem[] {
    // First, create a map of all screens
    const screenMap = new Map<string, Screen>();
    screens.forEach(screen => screenMap.set(screen.screenId, screen));

    // Filter root level items (those without parentScreenId)
    const rootItems = screens.filter(screen => !screen.parentScreenId && screen.isMenuItem);

    // Recursively build the tree
    return rootItems.map(item => this.buildMenuItem(item, screenMap));
  }

  private buildMenuItem(screen: Screen, screenMap: Map<string, Screen>): MenuItem {
    const menuItem: MenuItem = {
      screenId: screen.screenId,
      screenName: screen.screenName,
      routePath: screen.routePath,
      iconName: screen.iconName,
      isMenuItem: screen.isMenuItem,
      actions: screen.actions
    };

    // Find children
    const children = Array.from(screenMap.values())
      .filter(s => s.parentScreenId === screen.screenId && s.isMenuItem)
      .map(s => this.buildMenuItem(s, screenMap));

    if (children.length > 0) {
      menuItem.children = children;
    }

    return menuItem;
  }

  hasPermission(screenId: string, action: string): boolean {
    const allScreens = this.menuItemsSubject.value;
    const screen = this.findScreen(allScreens, screenId);
    return screen ? screen.actions.includes(action) : false;
  }

  private findScreen(items: MenuItem[], screenId: string): MenuItem | null {
    for (const item of items) {
      if (item.screenId === screenId) {
        return item;
      }
      if (item.children) {
        const found = this.findScreen(item.children, screenId);
        if (found) {
          return found;
        }
      }
    }
    return null;
  }
}
