import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from './environment';

export type ThemeType = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_KEY = 'app_theme';
  private currentThemeSubject: BehaviorSubject<ThemeType>;
  public currentTheme$: Observable<ThemeType>;

  constructor() {
    const savedTheme = localStorage.getItem(this.THEME_KEY) as ThemeType;
    const initialTheme = savedTheme || environment.theme.defaultTheme as ThemeType;
    this.currentThemeSubject = new BehaviorSubject<ThemeType>(initialTheme);
    this.currentTheme$ = this.currentThemeSubject.asObservable();

    // Apply initial theme
    this.applyTheme(initialTheme);
  }

  setTheme(theme: ThemeType): void {
    if (environment.theme.supportedThemes.includes(theme)) {
      localStorage.setItem(this.THEME_KEY, theme);
      this.currentThemeSubject.next(theme);
      this.applyTheme(theme);
    }
  }

  toggleTheme(): void {
    const currentTheme = this.currentThemeSubject.value;
    const newTheme: ThemeType = currentTheme === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }

  private applyTheme(theme: ThemeType): void {
    // Remove any existing theme classes
    document.documentElement.classList.remove('light-theme', 'dark-theme');
    
    // Add the new theme class
    document.documentElement.classList.add(`${theme}-theme`);
    
    // Set data-theme attribute for PrimeNG components
    document.documentElement.setAttribute('data-theme', theme);
    
    // Toggle dark mode class for Tailwind
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute(
        'content',
        theme === 'dark' ? '#1a1a1a' : '#ffffff'
      );
    }
  }

  getCurrentTheme(): ThemeType {
    return this.currentThemeSubject.value;
  }

  isDarkTheme(): boolean {
    return this.currentThemeSubject.value === 'dark';
  }
}
