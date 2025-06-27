import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from './theme.service';

export interface ConfigOptions {
  production?: boolean;
  apiUrl?: string;
}

@NgModule({
  imports: [CommonModule],
  providers: [ThemeService]
})
export class ConfigModule {
  static forRoot(options?: ConfigOptions): ModuleWithProviders<ConfigModule> {
    return {
      ngModule: ConfigModule,
      providers: [
        {
          provide: 'CONFIG_OPTIONS',
          useValue: options
        },
        ThemeService
      ]
    };
  }
}

// Export everything that should be available to consuming modules
export { environment as devEnvironment } from './environment';
export { environment as prodEnvironment } from './environment.prod';
export * from './theme.service';
