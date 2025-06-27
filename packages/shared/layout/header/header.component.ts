import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  template: `
    <header class="bg-white dark:bg-gray-900 shadow-sm">
      <nav class="container mx-auto px-4 py-3 flex items-center justify-between">
        <div class="flex items-center">
          <img src="assets/logo.png" alt="Logo" class="h-8 w-auto" />
          <h1 class="ml-3 text-xl font-semibold text-gray-800 dark:text-white">Angular MFE</h1>
        </div>
        <div class="flex items-center space-x-4">
          <button class="p-button p-button-text" (click)="toggleTheme()">
            <i class="pi" [ngClass]="isDarkMode ? 'pi-sun' : 'pi-moon'"></i>
          </button>
          <button class="p-button p-button-outlined" (click)="logout()">
            <i class="pi pi-sign-out mr-2"></i>
            Logout
          </button>
        </div>
      </nav>
    </header>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class HeaderComponent {
  isDarkMode = false;

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    document.documentElement.classList.toggle('dark');
  }

  logout() {
    // Will be implemented with AuthService
    console.log('Logout clicked');
  }
}
