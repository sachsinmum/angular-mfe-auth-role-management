import { Component, Input } from '@angular/core';

interface MenuItem {
  screenId: string;
  screenName: string;
  routePath: string;
  iconName: string;
  isMenuItem: boolean;
  actions: string[];
  children?: MenuItem[];
}

@Component({
  selector: 'app-sidebar',
  template: `
    <div class="sidebar bg-white dark:bg-gray-900 h-screen w-64 fixed left-0 top-0 shadow-lg">
      <div class="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 class="text-xl font-semibold text-gray-800 dark:text-white">{{ title }}</h2>
      </div>
      <nav class="p-4">
        <p-panelMenu 
          [model]="menuItems" 
          [multiple]="false"
          styleClass="w-full border-none"
        ></p-panelMenu>
      </nav>
    </div>
    <div class="ml-64">
      <ng-content></ng-content>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
    
    ::ng-deep .p-panelmenu .p-panelmenu-header-link {
      padding: 1rem;
      border: none;
      border-radius: 0.375rem;
    }

    ::ng-deep .p-panelmenu .p-panelmenu-content {
      border: none;
    }

    ::ng-deep .p-panelmenu .p-panelmenu-header:not(.p-highlight):not(.p-disabled):hover .p-panelmenu-header-link {
      background: #f3f4f6;
      color: #1f2937;
    }
  `]
})
export class SidebarComponent {
  @Input() title: string = 'Navigation';
  @Input() menuItems: MenuItem[] = [];
}
